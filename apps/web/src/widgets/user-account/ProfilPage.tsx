"use client";

/**
 * Halaman penuh "Profil Saya" -- pengganti ProfileModal.tsx yang dulu berupa
 * jendela modal. Dipindah ke halaman sendiri (/profil) supaya:
 *  1. Tombol "Hapus akun" punya cukup ruang untuk penjelasan & konfirmasi
 *     yang jelas, alih-alih berdesakan di dalam jendela kecil.
 *  2. Bisa dibuka lewat tautan langsung (bookmark, dibagikan lewat chat),
 *     bukan hanya lewat menu pengguna.
 *
 * FotoCropModal tetap dipakai sebagai jendela di atas halaman ini -- itu
 * sudah tepat sebagai modal karena memang tugasnya sesaat (atur satu foto,
 * lalu tutup), berbeda dari profil yang sekarang jadi tujuan halaman sendiri.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WarningTriangleIcon } from "@/shared/ui/icons/WarningTriangleIcon";
import { useAuth } from "./AuthProvider";
import type { RiwayatItem } from "./AuthProvider";
import { avatarProps } from "./avatar";
import { FotoCropModal } from "./FotoCropModal";

type Tab = "info" | "pref" | "riwayat";

function fmtWaktu(ms: number): string {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ProfilPage() {
  const router = useRouter();
  const { profil, simpanProfil, simpanPref, muatRiwayat, hapusAkunSendiri } =
    useAuth();
  const [tab, setTab] = useState<Tab>("info");
  const [nama, setNama] = useState(profil?.nama || "");
  const [inst, setInst] = useState(profil?.institusi || "");
  const [avatarSementara, setAvatarSementara] = useState<string | null>(null);
  const [pesan, setPesan] = useState<{ txt: string; jenis: "galat" | "info" }>(
    { txt: "", jenis: "info" },
  );
  const [sibuk, setSibuk] = useState(false);

  const [dekor, setDekor] = useState(
    !!(profil?.preferensi && profil.preferensi.sembunyikanDekorasi),
  );
  const [prefSibuk, setPrefSibuk] = useState(false);

  const [riwayat, setRiwayat] = useState<RiwayatItem[] | null>(null);
  const [riwayatGalat, setRiwayatGalat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fotoTerpilih, setFotoTerpilih] = useState<File | null>(null);

  /* Alur konfirmasi hapus akun: klik pertama hanya membuka panel konfirmasi
     dan meminta ketik "HAPUS", klik kedua (tombol di dalam panel) yang
     benar-benar memicu penghapusan. Dua langkah ini sengaja dibuat lambat
     -- akun yang terhapus tidak bisa dikembalikan. */
  const [konfirmasiTampil, setKonfirmasiTampil] = useState(false);
  const [ketikan, setKetikan] = useState("");
  const [hapusSibuk, setHapusSibuk] = useState(false);
  const [hapusGalat, setHapusGalat] = useState("");

  useEffect(() => {
    if (tab !== "riwayat" || riwayat !== null) return;
    let batal = false;
    muatRiwayat()
      .then((r) => {
        if (!batal) setRiwayat(r);
      })
      .catch((e) => {
        if (!batal) setRiwayatGalat((e as Error).message);
      });
    return () => {
      batal = true;
    };
  }, [tab, riwayat, muatRiwayat]);

  if (!profil) return null;

  const avaSumber = avatarSementara || profil.avatar;
  const ava = avatarProps(avaSumber, profil.nama);

  function pilihFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFotoTerpilih(f);
  }

  function onCropSelesai(dataUrl: string) {
    setAvatarSementara(dataUrl);
    setFotoTerpilih(null);
    if (fileRef.current) fileRef.current.value = "";
    setPesan({ txt: "Foto siap disimpan. Klik Simpan perubahan.", jenis: "info" });
  }

  function onCropBatal() {
    setFotoTerpilih(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSimpanProfil() {
    setSibuk(true);
    try {
      await simpanProfil({
        nama,
        institusi: inst,
        avatar: avatarSementara || undefined,
      });
      setAvatarSementara(null);
      setPesan({ txt: "Profil berhasil disimpan.", jenis: "info" });
    } catch (err) {
      setPesan({ txt: "Gagal menyimpan: " + (err as Error).message, jenis: "galat" });
    } finally {
      setSibuk(false);
    }
  }

  async function onSimpanPref() {
    setPrefSibuk(true);
    try {
      await simpanPref({ sembunyikanDekorasi: dekor });
      setPesan({ txt: "Preferensi berhasil disimpan.", jenis: "info" });
    } catch (err) {
      setPesan({ txt: "Gagal menyimpan: " + (err as Error).message, jenis: "galat" });
    } finally {
      setPrefSibuk(false);
    }
  }

  async function onHapusAkun() {
    setHapusGalat("");
    setHapusSibuk(true);
    try {
      await hapusAkunSendiri();
      router.push("/");
    } catch (err) {
      setHapusGalat((err as Error).message);
      setHapusSibuk(false);
    }
  }

  return (
    <div className="tv-halaman-profil">
      <h1>{"\uD83D\uDC64"} Profil Saya</h1>

      <div className="tv-tab-bar">
        <button
          className={"tv-tab" + (tab === "info" ? " aktif" : "")}
          onClick={() => setTab("info")}
        >
          Identitas
        </button>
        <button
          className={"tv-tab" + (tab === "pref" ? " aktif" : "")}
          onClick={() => setTab("pref")}
        >
          Preferensi
        </button>
        <button
          className={"tv-tab" + (tab === "riwayat" ? " aktif" : "")}
          onClick={() => setTab("riwayat")}
        >
          Riwayat
        </button>
      </div>

      {tab === "info" && (
        <div>
          {pesan.txt && (
            <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
          )}
          <div className="tv-ava-aksi">
            <div
              className={"tv-ava-besar" + (ava.teks ? "" : " tv-user-av-foto")}
              style={ava.style}
            >
              {ava.teks}
            </div>
            <label className="tv-foto-btn">
              {"\uD83D\uDCF7"} Ganti foto
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="tv-sembunyi"
                onChange={pilihFoto}
              />
            </label>
          </div>
          {fotoTerpilih && (
            <FotoCropModal
              file={fotoTerpilih}
              onBatal={onCropBatal}
              onSelesai={onCropSelesai}
            />
          )}
          <div className="tv-field">
            <label>Nama lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <div className="tv-field">
            <label>Institusi / jabatan</label>
            <input
              type="text"
              value={inst}
              onChange={(e) => setInst(e.target.value)}
            />
          </div>
          <div className="tv-field">
            <label>Email</label>
            <input type="text" value={profil.email || ""} disabled />
          </div>
          <button className="tv-btn" disabled={sibuk} onClick={onSimpanProfil}>
            {sibuk ? "Menyimpan\u2026" : "Simpan perubahan"}
          </button>
        </div>
      )}

      {tab === "pref" && (
        <div>
          {pesan.txt && (
            <div className={"tv-pesan " + pesan.jenis}>{pesan.txt}</div>
          )}
          <label className="tv-cek">
            <input
              type="checkbox"
              checked={dekor}
              onChange={(e) => setDekor(e.target.checked)}
            />{" "}
            Sembunyikan dekorasi background (tampilan fokus)
          </label>
          <button className="tv-btn" disabled={prefSibuk} onClick={onSimpanPref}>
            {prefSibuk ? "Menyimpan\u2026" : "Simpan preferensi"}
          </button>
        </div>
      )}

      {tab === "riwayat" && (
        <div className="tv-riwayat">
          {riwayatGalat ? (
            <div className="tv-kosong">Gagal memuat riwayat: {riwayatGalat}</div>
          ) : riwayat === null ? (
            <div className="tv-kosong">{"Memuat\u2026"}</div>
          ) : riwayat.length === 0 ? (
            <div className="tv-kosong">Belum ada riwayat perhitungan.</div>
          ) : (
            riwayat.map((d, i) => (
              <div className="tv-riwayat-item" key={i}>
                <div className="tipe">{d.tipe}</div>
                <div className="judul">{d.judul}</div>
                <div className="detail">{d.detail}</div>
                <div className="waktu">{fmtWaktu(d.waktuLokal)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Zona berbahaya -- selalu di paling bawah halaman, terpisah dari tab
          apa pun, supaya tidak tersenggol tak sengaja saat mengedit profil
          biasa. */}
      <div className="tv-zona-bahaya">
        <div className="tv-zona-bahaya-isi">
          <div className="tv-zona-bahaya-judul">
            <span className="tv-zona-bahaya-lencana">
              <WarningTriangleIcon size={16} />
            </span>
            Hapus akun
          </div>
          <p>
            Menghapus akun bersifat permanen. Data profil, preferensi, dan
            riwayat perhitungan Anda akan hilang dan tidak bisa dikembalikan.
            Langganan yang masih berjalan tidak otomatis dikembalikan (refund)
            lewat penghapusan akun ini.
          </p>

          {!konfirmasiTampil ? (
            <button
              className="tv-btn-bahaya"
              onClick={() => {
                setKonfirmasiTampil(true);
                setKetikan("");
                setHapusGalat("");
              }}
            >
              Hapus akun
            </button>
          ) : (
            <div className="tv-konfirmasi-hapus">
              {hapusGalat && <div className="tv-pesan galat">{hapusGalat}</div>}
              <p>
                Ketik <b>HAPUS</b> untuk mengonfirmasi. Tindakan ini tidak bisa
                dibatalkan setelah tombol di bawah ditekan.
              </p>
              <input
                type="text"
                value={ketikan}
                onChange={(e) => setKetikan(e.target.value)}
                placeholder="Ketik HAPUS"
                disabled={hapusSibuk}
              />
              <div className="tv-konfirmasi-aksi">
                <button
                  className="tv-btn-bahaya"
                  disabled={ketikan !== "HAPUS" || hapusSibuk}
                  onClick={onHapusAkun}
                >
                  {hapusSibuk ? "Menghapus\u2026" : "Ya, hapus akun saya permanen"}
                </button>
                <button
                  className="tv-btn sekunder"
                  disabled={hapusSibuk}
                  onClick={() => setKonfirmasiTampil(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
