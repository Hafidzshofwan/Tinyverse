"use client";

import { useMemo, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { RedFlagCrossLink } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  KPSP_DATA,
  hitungKpsp,
  sektorTerabaikan,
  type KpspJawaban,
  type KpspSektor,
} from "./data";

function usiaTeks(bulan: number): string {
  if (bulan < 24) return bulan + " bulan";
  const th = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  return sisa ? th + " th " + sisa + " bln" : th + " tahun";
}

const KATEGORI_WARNA: Record<string, string> = {
  sesuai: "#ECFDF5",
  meragukan: "#FFFBEB",
  penyimpangan: "#FEF2F2",
};

const KATEGORI_TEKS: Record<string, string> = {
  sesuai: "#047857",
  meragukan: "#B45309",
  penyimpangan: "#B42318",
};

const SEKTOR_WARNA: Record<KpspSektor, { bg: string; fg: string }> = {
  kasar: { bg: "#EFF6FF", fg: "#1D4ED8" },
  halus: { bg: "#F0FDF4", fg: "#15803D" },
  bicara: { bg: "#FAF5FF", fg: "#6B21A8" },
  sosialisasi: { bg: "#FFF1F2", fg: "#BE123C" },
};

export function KpspForm({ onBack }: { onBack?: () => void } = {}) {
  const profil = usePatientProfile();
  const [selectedAge, setSelectedAge] = useState<number>(3);
  const [jawaban, setJawaban] = useState<Record<number, KpspJawaban>>({});
  const [selesai, setSelesai] = useState(false);
  const [langkah, setLangkah] = useState(0); // index 0..9

  const groupData = KPSP_DATA[selectedAge] || KPSP_DATA[3]!;
  const daftarSoal = groupData.pertanyaan;

  const totalDijawab = Object.values(jawaban).filter((v) => v != null).length;
  const semuaTerjawab = totalDijawab === daftarSoal.length;

  const hasil = useMemo(() => (selesai ? hitungKpsp(jawaban) : null), [selesai, jawaban]);
  const daftarTidak = useMemo(
    () => (selesai ? sektorTerabaikan(daftarSoal, jawaban) : []),
    [selesai, daftarSoal, jawaban]
  );

  const itemAktif = daftarSoal[langkah] || daftarSoal[0]!;
  const iniTerakhir = langkah === daftarSoal.length - 1;

  function gantiUsia(usia: number) {
    setSelectedAge(usia);
    setJawaban({});
    setSelesai(false);
    setLangkah(0);
  }

  function pilih(no: number, val: KpspJawaban) {
    setJawaban((prev) => ({ ...prev, [no]: val }));
    setSelesai(false);
    if (langkah < daftarSoal.length - 1) {
      setLangkah((l) => l + 1);
    }
  }

  function reset() {
    setJawaban({});
    setSelesai(false);
    setLangkah(0);
  }

  function ubahJawaban() {
    setSelesai(false);
    setLangkah(0);
  }

  function simpanKeRingkasan() {
    if (!hasil) return;
    const tidakTeks =
      daftarTidak.map((it) => `#${it.no} (${it.sektorLabel})`).join(", ") || "Tidak ada";
    addRingkasanItem({
      title: `Skrining KPSP Usia ${selectedAge} Bulan`,
      body: `Total YA: ${hasil.totalYa}/${daftarSoal.length} (${hasil.label}). Item TIDAK: ${tidakTeks}. ${hasil.saran}`,
      source: "Kemenkes RI - SDIDTK KPSP",
    });
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            border: "none",
            background: "transparent",
            color: "#667085",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 10,
            padding: 0,
          }}
        >
          {"\u2190"} Pilih alat skrining lain
        </button>
      )}



      {/* Pasien Aktif Info */}
      {(profil.nama || profil.usiaBulan != null) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            fontSize: 12.5,
            fontWeight: 600,
            color: "#0a0b5f",
            background: "rgba(217,54,166,0.08)",
            border: "1px solid rgba(217,54,166,0.18)",
            borderRadius: 12,
            padding: "8px 14px",
            marginBottom: 14,
          }}
        >
          {"\uD83D\uDC64"} Pasien aktif: <strong>{profil.nama || "(tanpa nama)"}</strong>
          {profil.usiaBulan != null ? " \u00b7 " + usiaTeks(profil.usiaBulan) : ""}
        </div>
      )}

      {/* Selector Usia KPSP */}
      <div className="kartu" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0a0b4f", marginBottom: 8 }}>
          Pilih Kelompok Usia KPSP:
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[3].map((age) => {
            const aktif = selectedAge === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => gantiUsia(age)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: aktif ? "none" : "1px solid #E2E8F0",
                  background: aktif ? "#0a0b5f" : "#fff",
                  color: aktif ? "#fff" : "#344054",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {age} Bulan (Aktif)
              </button>
            );
          })}
          {[6, 9, 12, 15, 18, 24, 36, 48, 60, 72].map((age) => (
            <button
              key={age}
              type="button"
              disabled
              title="Akan hadir bertahap pada pembaruan berikutnya"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px dashed #CBD5E1",
                background: "#F8FAFC",
                color: "#94A3B8",
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "not-allowed",
              }}
            >
              {age} Bln (Segera)
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#667085", marginTop: 10, lineHeight: 1.5 }}>
          {groupData.deskripsi}
        </div>
      </div>

      {!selesai && (
        <div className="kartu">
          {/* Progress bar + header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#667085" }}>
              Pertanyaan {langkah + 1} dari {daftarSoal.length} · Terjawab {totalDijawab}
            </span>
            <button
              type="button"
              onClick={reset}
              style={{
                border: "none",
                background: "transparent",
                color: "#667085",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              height: 6,
              background: "#F1F3F8",
              borderRadius: 999,
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: ((langkah + 1) / daftarSoal.length) * 100 + "%",
                background: "#0a0b5f",
                borderRadius: 999,
                transition: "width .2s ease",
              }}
            />
          </div>

          {/* Dot/Number Navigator */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {daftarSoal.map((it, idx) => {
              const terjawab = jawaban[it.no] != null;
              const aktifDot = idx === langkah;
              return (
                <button
                  key={it.no}
                  type="button"
                  onClick={() => setLangkah(idx)}
                  title={`Soal #${it.no} (${it.sektorLabel}) ${
                    terjawab ? `- Jawaban: ${jawaban[it.no]!.toUpperCase()}` : "(belum dijawab)"
                  }`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: aktifDot ? "2px solid #0a0b5f" : "1px solid #E2E8F0",
                    background: terjawab
                      ? jawaban[it.no] === "ya"
                        ? "#0a0b5f"
                        : "#991B1B"
                      : "#fff",
                    color: terjawab ? "#fff" : "#98A2B3",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {it.no}
                </button>
              );
            })}
          </div>

          {/* Pertanyaan Aktif */}
          <div style={{ minHeight: 130 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: SEKTOR_WARNA[itemAktif.sektor].bg,
                  color: SEKTOR_WARNA[itemAktif.sektor].fg,
                }}
              >
                {itemAktif.sektorLabel}
              </span>
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0a0b4f",
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              {itemAktif.no}. {itemAktif.teks}
            </div>

            {itemAktif.petunjuk && (
              <div
                style={{
                  fontSize: 12.5,
                  color: "#667085",
                  marginBottom: 12,
                  fontStyle: "italic",
                }}
              >
                💡 {itemAktif.petunjuk}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {(["ya", "tidak"] as const).map((opt) => {
                const aktif = jawaban[itemAktif.no] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pilih(itemAktif.no, opt)}
                    style={{
                      flex: 1,
                      padding: "13px 10px",
                      borderRadius: 12,
                      border: aktif ? "none" : "1px solid #E2E8F0",
                      background: aktif
                        ? opt === "ya"
                          ? "#0a0b5f"
                          : "#991B1B"
                        : "#fff",
                      color: aktif ? "#fff" : "#344054",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    {opt === "ya" ? "✓ YA" : "✕ TIDAK"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button
              type="button"
              disabled={langkah === 0}
              onClick={() => setLangkah((l) => Math.max(0, l - 1))}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 999,
                border: "1px solid #E2E8F0",
                background: "#fff",
                color: langkah === 0 ? "#CBD5E1" : "#344054",
                fontWeight: 700,
                fontSize: 13,
                cursor: langkah === 0 ? "not-allowed" : "pointer",
              }}
            >
              {"\u2190"} Sebelumnya
            </button>

            {!iniTerakhir ? (
              <button
                type="button"
                disabled={jawaban[itemAktif.no] == null}
                onClick={() => setLangkah((l) => Math.min(daftarSoal.length - 1, l + 1))}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 999,
                  border: "none",
                  background: jawaban[itemAktif.no] != null ? "#0a0b5f" : "#E2E8F0",
                  color: jawaban[itemAktif.no] != null ? "#fff" : "#98A2B3",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: jawaban[itemAktif.no] != null ? "pointer" : "not-allowed",
                }}
              >
                Selanjutnya {"\u2192"}
              </button>
            ) : (
              <button
                type="button"
                disabled={!semuaTerjawab}
                onClick={() => setSelesai(true)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 999,
                  border: "none",
                  background: semuaTerjawab ? "#0a0b5f" : "#E2E8F0",
                  color: semuaTerjawab ? "#fff" : "#98A2B3",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: semuaTerjawab ? "pointer" : "not-allowed",
                }}
              >
                Hitung Hasil KPSP
              </button>
            )}
          </div>

          {!semuaTerjawab && iniTerakhir && (
            <p style={{ fontSize: 11.5, color: "#98A2B3", marginTop: 8, textAlign: "center" }}>
              Masih ada {daftarSoal.length - totalDijawab} pertanyaan belum dijawab — klik nomor di
              atas untuk melengkapinya.
            </p>
          )}
        </div>
      )}

      {/* Hasil Skrining */}
      {selesai && hasil && (
        <div
          className="kartu"
          style={{ marginTop: 14, background: KATEGORI_WARNA[hasil.kategori] }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: KATEGORI_TEKS[hasil.kategori],
                }}
              >
                Hasil KPSP {selectedAge} Bulan — Total {"'YA'"}: {hasil.totalYa} / {daftarSoal.length}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: KATEGORI_TEKS[hasil.kategori],
                  marginTop: 4,
                }}
              >
                {hasil.label}
              </div>
            </div>
            <button
              type="button"
              onClick={ubahJawaban}
              style={{
                border: "1px solid currentColor",
                background: "#fff",
                color: KATEGORI_TEKS[hasil.kategori],
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Ubah Jawaban
            </button>
          </div>

          <p style={{ fontSize: 13, color: "#344054", marginTop: 10, lineHeight: 1.6 }}>
            {hasil.saran}
          </p>

          {daftarTidak.length > 0 && (
            <div
              style={{
                fontSize: 12.5,
                color: "#475467",
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px dashed rgba(0,0,0,0.1)",
              }}
            >
              <strong>Sektor yang belum tercapai {"('TIDAK')"}:</strong>
              <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                {daftarTidak.map((it) => (
                  <li key={it.no}>
                    Item #{it.no} [{it.sektorLabel}]: {it.teks}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasil.kategori !== "sesuai" && (
            <RedFlagCrossLink
              title={
                hasil.kategori === "penyimpangan"
                  ? "Kemungkinan Penyimpangan — Perlu Rujukan Sp.A"
                  : "Perkembangan Meragukan — Evaluasi Ulang 2 Minggu"
              }
              description={
                hasil.kategori === "penyimpangan"
                  ? "Segera konsultasikan atau rujuk ke dokter spesialis anak / klinik tumbuh kembang untuk pemeriksaan diagnostik lebih lanjut."
                  : "Lakukan intervensi stimulasi harian terfokus pada sektor yang belum tercapai, lalu jadwalkan KPSP ulang 14 hari lagi."
              }
              level={hasil.kategori === "penyimpangan" ? "crit" : "warn"}
              actions={[
                { label: "Tambahkan ke Ringkasan Klinis", onClick: simpanKeRingkasan, primary: true },
              ]}
            />
          )}

          {hasil.kategori === "sesuai" && (
            <button
              type="button"
              onClick={simpanKeRingkasan}
              style={{
                marginTop: 14,
                padding: "9px 16px",
                borderRadius: 999,
                border: "none",
                background: "#0a0b5f",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              Tambahkan ke Ringkasan Klinis
            </button>
          )}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#98A2B3", marginTop: 14, lineHeight: 1.5 }}>
        Sumber: Pedoman Pelaksanaan Stimulasi, Deteksi dan Intervensi Dini Tumbuh Kembang (SDIDTK)
        Anak, Kementerian Kesehatan Republik Indonesia.
      </p>
    </div>
  );
}
