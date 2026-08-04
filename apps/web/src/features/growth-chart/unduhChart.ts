import type { TitikPlot } from "./plotting";

/**
 * Unduh growth chart hasil plotting sebagai PNG resolusi penuh.
 *
 * WHY: koas memakai chart ini untuk presentasi, dan tangkapan layar hanya
 * merekam sebesar piksel yang kebetulan tampil (sekitar 900 px), sehingga
 * pecah begitu diperbesar di proyektor atau slide. Modul ini menggambar
 * ULANG overlay di atas gambar chart pada ukuran ASLINYA -- IMT/U misalnya
 * 3508 x 2481 px, hampir 4x lebih tajam daripada yang terlihat di layar.
 *
 * Kuncinya: plotting.ts sudah menghasilkan posisi dalam PERSEN, sehingga
 * koordinat yang sama bisa dipakai ulang pada resolusi berapa pun tanpa
 * menghitung ulang kalibrasi. Tidak ada pustaka tambahan yang dibutuhkan;
 * html2canvas sekalipun hanya akan menyalin piksel layar yang sudah kecil.
 *
 * Berkas unduhan ini punya DUA pita di bawah gambar chart, masing-masing
 * baris sendiri sehingga tidak pernah saling tumpang tindih:
 *  1. Pita data pasien (judul + subjudul di baris atas, keterangan/nilai
 *     terukur di baris bawah -- baris sendiri, lebar penuh, dipotong dengan
 *     elipsis bila kelewat panjang, apa pun jumlah indikator yang diukur).
 *  2. Pita promosi Tinyverse (logo + nama + tautan web), sebab berkas ini
 *     kerap dibagikan ke pihak lain sehingga sekaligus jadi bahan promosi.
 */

export interface TitikUnduh {
  titik: TitikPlot;
  /** Persen X tujuan garis bantu horizontal (hasil tkTargetGarisHorizontal). */
  targetX: number;
  warna: string;
  yLabel: string;
  yUnit: string;
  nilai: number;
}

export interface OpsiUnduhChart {
  /** Elemen <img> chart yang sedang tampil; dipakai sebagai sumber piksel. */
  img: HTMLImageElement;
  titik: TitikUnduh[];
  /** Nama berkas tanpa ekstensi. */
  namaBerkas: string;
  judul: string;
  subjudul: string;
  /** Baris keterangan di pita bawah, mis. ["BB: 12,5 kg", "Usia: 18 bulan"]. */
  keterangan: string[];
  /**
   * Pengali resolusi. Bila tidak diisi, dipilih otomatis agar lebar akhir
   * minimal ~2200 px (chart CDC yang aslinya 1275 px jadi ikut tajam).
   */
  skala?: number;
}

const WARNA_LABEL_BG = "#0F172A";
const WARNA_PITA_BG = "#FFFFFF";
const WARNA_PITA_TEKS = "#0F172A";
const WARNA_PITA_SUB = "#475569";
const FONT_STACK = "'Fredoka', 'Segoe UI', system-ui, sans-serif";

// --- Pita promosi Tinyverse (baris paling bawah unduhan) ---
const PROMO_LOGO_SRC = "/brand/logo.png";
const PROMO_NAMA = "Tinyverse";
const PROMO_LINK_LABEL = "tinyverse-web.vercel.app";
const WARNA_PROMO_BG = "#F8FAFC";
const WARNA_PROMO_GARIS = "#E2E8F0";
const WARNA_PROMO_NAMA = "#0F172A";
const WARNA_PROMO_LINK = "#2563EB";

/** Persegi panjang bersudut membulat (roundRect belum ada di semua peramban). */
function jalurKotakBulat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/**
 * Garis bantu hasil unduhan: UTUH, bukan putus-putus.
 *
 * Di layar, .tk-garis-bantu memang putus-putus 4px/4px dan itu terbaca
 * karena pengguna bisa memperbesar tampilan. Pada berkas unduhan yang
 * dicetak atau dilampirkan ke rekam medis, strip sependek itu pecah di
 * atas kurva WHO yang sudah padat garis dan justru hilang terbaca.
 * Keterbacaan sengaja dimenangkan atas kemiripan dengan layar.
 *
 * Digambar dua lapis: alas putih sedikit lebih tebal sebagai pemisah,
 * lalu garis berwarna di atasnya, supaya tetap kontras saat melintasi
 * garis kurva rujukan yang warnanya mirip.
 */
function garisBantu(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  warna: string,
  tebal: number,
): void {
  ctx.save();
  ctx.lineCap = "round";
  ctx.setLineDash([]);

  // Alas putih semi-tembus sebagai pemisah dari garis kurva di bawahnya.
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = tebal + 2;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Garis utama, tanpa transparansi supaya warnanya penuh saat dicetak.
  ctx.strokeStyle = warna;
  ctx.lineWidth = tebal;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Gambar satu titik pasien lengkap dengan garis bantu dan labelnya.
 * Geometrinya menyalin .tk-garis-bantu / .tk-titik-pasien / .tk-label-pasien,
 * hanya saja seluruh ukurannya diskalakan terhadap lebar kanvas.
 */
function gambarTitik(
  ctx: CanvasRenderingContext2D,
  t: TitikUnduh,
  W: number,
  H: number,
): void {
  const unit = W / 900; // 1 unit = 1 px pada tampilan layar biasa
  // Sedikit lebih tebal daripada 2px di layar: berkas unduhan berukuran
  // jauh lebih besar dan kerap diperkecil saat dicetak.
  const tebalGaris = Math.max(1.5, 2.6 * unit);

  const px = (t.titik.leftPercent / 100) * W;
  const py = (t.titik.topPercent / 100) * H;

  const baseBawah = isFinite(t.titik.sumbuUsiaPersen)
    ? t.titik.sumbuUsiaPersen
    : t.titik.sumbuBawahPersen;
  const pyBase = (baseBawah / 100) * H;
  const pxTarget = (t.targetX / 100) * W;

  // Garis bantu: vertikal ke sumbu usia, horizontal ke sumbu nilai.
  garisBantu(ctx, px, py, px, pyBase, t.warna, tebalGaris);
  garisBantu(ctx, px, py, pxTarget, py, t.warna, tebalGaris);

  // Titik pasien: lingkaran berwarna, cincin putih, halo lembut.
  const r = 4.5 * unit;
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, r + 3.5 * unit, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(240, 99, 135, 0.35)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fillStyle = t.warna;
  ctx.fill();
  ctx.lineWidth = 2 * unit;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.restore();

  // Label melayang.
  const fontUkuran = Math.round(11 * unit);
  const padX = 6 * unit;
  const padY = 5 * unit;
  const baris1 = t.yLabel;
  const baris2 = `${t.nilai} ${t.yUnit}`;

  ctx.save();
  ctx.font = `700 ${fontUkuran}px ${FONT_STACK}`;
  const bulatR = fontUkuran * 0.42;
  const lebarTeks = Math.max(
    ctx.measureText(baris1).width + bulatR * 2 + 4 * unit,
    ctx.measureText(baris2).width,
  );
  const tinggiBaris = fontUkuran * 1.4;
  const kotakW = lebarTeks + padX * 2;
  const kotakH = tinggiBaris * 2 + padY * 2;

  // Sisi penempatan mengikuti aturan yang sama seperti di layar.
  const keKiri = t.targetX === t.titik.sumbuKananPersen
    ? t.titik.leftPercent >= 20
    : t.titik.leftPercent > 72;
  const keBawah = t.titik.topPercent < 22;

  let kx = keKiri ? px - kotakW - 16 * unit : px + 16 * unit;
  let ky = keBawah ? py + 16 * unit : py - kotakH - 14 * unit;

  // Jangan sampai keluar kanvas.
  kx = Math.max(4 * unit, Math.min(kx, W - kotakW - 4 * unit));
  ky = Math.max(4 * unit, Math.min(ky, H - kotakH - 4 * unit));

  jalurKotakBulat(ctx, kx, ky, kotakW, kotakH, 9 * unit);
  ctx.fillStyle = WARNA_LABEL_BG;
  ctx.globalAlpha = 0.94;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.5 * unit;
  ctx.strokeStyle = t.warna;
  ctx.stroke();

  ctx.textBaseline = "middle";
  const yBaris1 = ky + padY + tinggiBaris / 2;
  const yBaris2 = yBaris1 + tinggiBaris;

  ctx.beginPath();
  ctx.arc(kx + padX + bulatR, yBaris1, bulatR, 0, Math.PI * 2);
  ctx.fillStyle = t.warna;
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(baris1, kx + padX + bulatR * 2 + 4 * unit, yBaris1);
  ctx.fillText(baris2, kx + padX, yBaris2);
  ctx.restore();
}

/**
 * Tulis satu baris teks; potong dengan elipsis "..." bila lebih lebar
 * daripada ruang yang tersedia, alih-alih dibiarkan meluber dan menabrak
 * elemen lain di sebelahnya.
 */
function gambarTeksPas(
  ctx: CanvasRenderingContext2D,
  teks: string,
  x: number,
  y: number,
  lebarMaks: number,
): void {
  if (ctx.measureText(teks).width <= lebarMaks) {
    ctx.fillText(teks, x, y);
    return;
  }
  const elipsis = "\u2026";
  let potong = teks;
  while (potong.length > 1 && ctx.measureText(potong + elipsis).width > lebarMaks) {
    potong = potong.slice(0, -1);
  }
  ctx.fillText(potong + elipsis, x, y);
}

/**
 * Pita data pasien di bawah chart, supaya gambar bisa berdiri sendiri di slide.
 *
 * Judul & subjudul pendek berbagi baris atas (kiri/kanan). Keterangan (nilai
 * terukur) SELALU mendapat baris sendiri di bawahnya, lebar penuh -- ini
 * sengaja dipisah dari desain lama yang menaruh keterangan di sela-sela
 * judul/subjudul: pada indikator dengan banyak nilai terukur (mis. WHO yang
 * menampilkan berat, tinggi, DAN IMT sekaligus), teks itu bisa memanjang dan
 * menabrak judul bila keduanya berbagi baris. Dipotong elipsis bila tetap
 * kelewat panjang untuk lebar chart yang bersangkutan.
 */
function gambarPita(
  ctx: CanvasRenderingContext2D,
  W: number,
  yAtas: number,
  tinggi: number,
  judul: string,
  subjudul: string,
  keterangan: string[],
): void {
  const unit = W / 900;
  ctx.save();
  ctx.fillStyle = WARNA_PITA_BG;
  ctx.fillRect(0, yAtas, W, tinggi);

  ctx.fillStyle = "#E2E8F0";
  ctx.fillRect(0, yAtas, W, Math.max(1, unit));

  const kiri = 18 * unit;
  const kanan = W - 18 * unit;
  ctx.textBaseline = "middle";

  // Baris atas: judul (kiri) & subjudul (kanan) -- keduanya singkat.
  ctx.fillStyle = WARNA_PITA_TEKS;
  ctx.font = `700 ${Math.round(15 * unit)}px ${FONT_STACK}`;
  const yBarisJudul = yAtas + tinggi * 0.32;
  const lebarJudulMaks = (kanan - kiri) * 0.58;
  gambarTeksPas(ctx, judul, kiri, yBarisJudul, lebarJudulMaks);

  ctx.fillStyle = WARNA_PITA_SUB;
  ctx.font = `600 ${Math.round(11.5 * unit)}px ${FONT_STACK}`;
  const lebarSubjudulMaks = (kanan - kiri) * 0.38;
  gambarTeksPasKanan(ctx, subjudul, kanan, yBarisJudul, lebarSubjudulMaks);

  // Baris bawah: keterangan (data pasien) -- baris SENDIRI, lebar penuh.
  const isi = keterangan.filter(Boolean).join("   \u2022   ");
  if (isi) {
    ctx.fillStyle = WARNA_PITA_TEKS;
    ctx.font = `600 ${Math.round(12 * unit)}px ${FONT_STACK}`;
    const yBarisKet = yAtas + tinggi * 0.72;
    gambarTeksPas(ctx, isi, kiri, yBarisKet, kanan - kiri);
  }
  ctx.restore();
}

/** Sama seperti gambarTeksPas, tetapi rata kanan (dipakai untuk subjudul). */
function gambarTeksPasKanan(
  ctx: CanvasRenderingContext2D,
  teks: string,
  xKanan: number,
  y: number,
  lebarMaks: number,
): void {
  ctx.textAlign = "right";
  if (ctx.measureText(teks).width <= lebarMaks) {
    ctx.fillText(teks, xKanan, y);
    ctx.textAlign = "left";
    return;
  }
  const elipsis = "\u2026";
  let potong = teks;
  while (potong.length > 1 && ctx.measureText(potong + elipsis).width > lebarMaks) {
    potong = potong.slice(0, -1);
  }
  ctx.fillText(potong + elipsis, xKanan, y);
  ctx.textAlign = "left";
}

/** Muat gambar dari URL; dipakai untuk logo promosi. */
function muatGambar(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const gbr = new Image();
    gbr.onload = () => resolve(gbr);
    gbr.onerror = () => reject(new Error(`Gagal memuat gambar: ${src}`));
    gbr.src = src;
  });
}

/**
 * Pita promosi Tinyverse di baris PALING BAWAH unduhan (logo + nama + tautan).
 *
 * WHY: berkas unduhan ini sering dibagikan ke pihak lain (presentasi, slide,
 * rekam medis), sehingga sekaligus jadi bahan promosi web Tinyverse. Sengaja
 * dipisah dengan garis tersendiri dari pita data pasien di atasnya supaya
 * jelas mana data klinis pasien dan mana identitas produk -- keduanya tidak
 * boleh bercampur dalam baris yang sama.
 *
 * Logo bersifat pelengkap: dipanggil dengan logo null bila gagal dimuat
 * (mis. berkasnya belum ada di server), unduhan tetap tampil rapi tanpa logo
 * alih-alih gagal total.
 */
function gambarPromo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  W: number,
  yAtas: number,
  tinggi: number,
): void {
  const unit = W / 900;
  ctx.save();
  ctx.fillStyle = WARNA_PROMO_BG;
  ctx.fillRect(0, yAtas, W, tinggi);
  ctx.fillStyle = WARNA_PROMO_GARIS;
  ctx.fillRect(0, yAtas, W, Math.max(1, unit));

  const kiri = 18 * unit;
  const kanan = W - 18 * unit;
  const tengahY = yAtas + tinggi / 2;
  let xTeks = kiri;

  if (logo && logo.naturalWidth && logo.naturalHeight) {
    const tinggiLogo = tinggi * 0.5;
    const lebarLogo = (logo.naturalWidth / logo.naturalHeight) * tinggiLogo;
    ctx.drawImage(logo, kiri, tengahY - tinggiLogo / 2, lebarLogo, tinggiLogo);
    xTeks = kiri + lebarLogo + 10 * unit;
  }

  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(13 * unit)}px ${FONT_STACK}`;
  ctx.fillStyle = WARNA_PROMO_NAMA;
  ctx.fillText(PROMO_NAMA, xTeks, tengahY);
  const lebarNama = ctx.measureText(PROMO_NAMA).width;

  ctx.font = `600 ${Math.round(11.5 * unit)}px ${FONT_STACK}`;
  ctx.fillStyle = WARNA_PROMO_LINK;
  const lebarMaksLink = kanan - (xTeks + lebarNama + 14 * unit);
  gambarTeksPasKanan(ctx, PROMO_LINK_LABEL, kanan, tengahY, Math.max(60 * unit, lebarMaksLink));
  ctx.restore();
}

/**
 * Render chart + overlay + pita data pasien + pita promosi ke PNG, lalu picu
 * unduhan peramban. Menghasilkan error bila gambar chart belum selesai dimuat.
 */
export async function unduhChartPNG(opsi: OpsiUnduhChart): Promise<void> {
  const { img, titik, namaBerkas, judul, subjudul, keterangan } = opsi;

  if (!img.complete || !img.naturalWidth) {
    throw new Error("Gambar chart belum selesai dimuat.");
  }

  // Logo promosi bersifat pelengkap, bukan syarat: bila gagal dimuat, unduhan
  // tetap jalan tanpa logo alih-alih membatalkan seluruh unduhan.
  const logo = await muatGambar(PROMO_LOGO_SRC).catch(() => null);

  const skala =
    opsi.skala ?? Math.max(1, Math.min(3, Math.ceil(2200 / img.naturalWidth)));

  const W = Math.round(img.naturalWidth * skala);
  const Hchart = Math.round(img.naturalHeight * skala);
  const tinggiPitaData = Math.round((W / 900) * 74);
  const tinggiPitaPromo = Math.round((W / 900) * 42);
  const H = Hchart + tinggiPitaData + tinggiPitaPromo;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Peramban ini tidak mendukung canvas 2D.");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, W, Hchart);

  for (const t of titik) gambarTitik(ctx, t, W, Hchart);

  gambarPita(ctx, W, Hchart, tinggiPitaData, judul, subjudul, keterangan);
  gambarPromo(ctx, logo, W, Hchart + tinggiPitaData, tinggiPitaPromo);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) throw new Error("Gagal membuat berkas PNG.");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${namaBerkas}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Beri jeda agar unduhan sempat dimulai sebelum URL dilepas.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Ubah teks bebas menjadi potongan nama berkas yang aman. */
export function amanNamaBerkas(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
