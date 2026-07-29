/**
 * POST /api/checkout
 *
 * Membuat satu pesanan lalu meminta Midtrans menyiapkan halaman pembayaran.
 * Jawabannya berisi dua hal: token untuk jendela Snap, dan alamat halaman
 * Midtrans sebagai jalur cadangan bila snap.js gagal dimuat.
 *
 * Rute ini TIDAK PERNAH membuka akses. Yang membuka akses hanya webhook,
 * setelah Midtrans menyatakan uangnya benar-benar masuk. Pemisahan ini
 * disengaja: apa pun yang dilakukan pelanggan di peramban - menutup jendela
 * pembayaran, menekan tombol kembali, memanggil ulang alamat ini - tidak dapat
 * menghasilkan masa aktif.
 */
import { randomBytes } from "node:crypto";

import { bekukanHarga } from "@tinyverse/billing";
import type { Pesanan } from "@tinyverse/billing";
import { NextResponse } from "next/server";

import { envAplikasi } from "@/server/env";
import {
  DURASI_BAYAR_MENIT,
  SELISIH_PENGAMAN_MENIT,
  buatTransaksiSnap,
} from "@/server/midtrans/snap";
import { FirestoreOrderRepository } from "@/server/ordersAdmin";
import { cariPlan } from "@/server/planKatalog";
import { akunAktif } from "@/server/provisioning";
import { bacaSesi } from "@/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEMENIT_MS = 60_000;

/**
 * Nomor pesanan sekaligus id dokumen.
 *
 * WHY keduanya dibuat sama: webhook menerima order_id dari Midtrans dan harus
 * menemukan pesanannya. Bila id dokumen berbeda, pencarian menuntut query
 * berindeks - yang tidak bisa dijalankan di dalam transaksi Firestore. Dengan
 * nilai yang sama, satu pembacaan dokumen langsung sudah cukup.
 *
 * Midtrans membatasi 50 karakter dan menolak pemakaian ulang selamanya, jadi
 * unsur waktu dan acak keduanya disertakan.
 */
function buatOrderId(accountId: string): string {
  const akun = accountId.replace(/[^A-Za-z0-9]/g, "").slice(0, 8) || "AKUN";
  const waktu = Date.now().toString(36).toUpperCase();
  const acak = randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `TV-${akun}-${waktu}-${acak}`;
}

export async function POST(permintaan: Request) {
  const sesi = await bacaSesi();
  if (!sesi) {
    return NextResponse.json({ pesan: "Belum masuk." }, { status: 401 });
  }

  let badan: { planId?: unknown };
  try {
    badan = (await permintaan.json()) as { planId?: unknown };
  } catch {
    return NextResponse.json({ pesan: "Badan permintaan bukan JSON." }, { status: 400 });
  }

  if (typeof badan.planId !== "string") {
    return NextResponse.json({ pesan: "planId wajib diisi." }, { status: 400 });
  }

  const plan = cariPlan(badan.planId);
  if (!plan || !plan.aktif) {
    /* Paket lama tetap ada di katalog agar pesanan lampau terbaca, tetapi
       tidak boleh dibeli lagi. */
    return NextResponse.json({ pesan: "Paket tidak tersedia." }, { status: 400 });
  }

  const accountId = await akunAktif(sesi);
  const sekarangMs = Date.now();
  const sekarang = new Date(sekarangMs).toISOString();
  const orderId = buatOrderId(accountId);

  /* expiresAt lokal sengaja lebih lambat daripada masa berlaku di Midtrans.
     Lihat alasannya pada SELISIH_PENGAMAN_MENIT di midtrans/snap.ts. */
  const expiresAt = new Date(
    sekarangMs + (DURASI_BAYAR_MENIT + SELISIH_PENGAMAN_MENIT) * SEMENIT_MS,
  ).toISOString();

  const pesanan: Pesanan = {
    id: orderId,
    accountId,
    createdByUid: sesi.uid,
    snapshotHarga: bekukanHarga(plan),
    status: "menunggu",
    midtransOrderId: orderId,
    createdAt: sekarang,
    expiresAt,
    updatedAt: sekarang,
  };

  const orderRepo = new FirestoreOrderRepository();

  /* Pesanan ditulis SEBELUM transaksi Snap dibuat. Urutan sebaliknya membuka
     celah nyata: pelanggan bisa membayar sementara pesanannya belum ada, dan
     webhook tidak akan menemukan apa pun untuk diperbarui. */
  await orderRepo.create(pesanan);

  const { baseUrl } = envAplikasi();

  try {
    const { token, redirectUrl } = await buatTransaksiSnap({
      orderId,
      hargaRupiah: plan.hargaRupiah,
      planId: plan.id,
      namaPaket: `Tinyverse ${plan.nama}`,
      email: sesi.email,
      finishUrl: `${baseUrl}/langganan/selesai?order_id=${encodeURIComponent(orderId)}`,
    });

    /* token dipakai jendela Snap, redirectUrl dipakai jalur cadangan. Keduanya
       dikirim sekaligus supaya peramban tidak perlu meminta dua kali - dan
       supaya kegagalan snap.js tidak melahirkan pesanan kedua. */
    return NextResponse.json({ orderId, token, redirectUrl });
  } catch (kesalahan) {
    /* Snap gagal, jadi tidak akan pernah ada pembayaran atas pesanan ini.
       Menutupnya sekarang mencegah nomor pesanan menggantung sebagai
       "menunggu" selamanya - Midtrans tidak akan mengirim notifikasi expire
       untuk transaksi yang tidak pernah lahir. */
    await orderRepo.updateStatus({
      id: orderId,
      dariStatus: "menunggu",
      keStatus: "dibatalkan",
      padaWaktu: new Date().toISOString(),
    });

    console.error("[checkout] Snap gagal", kesalahan);
    return NextResponse.json(
      { pesan: "Gagal menghubungi penyedia pembayaran. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
