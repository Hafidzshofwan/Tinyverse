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
      source: "Pedoman SDIDTK Kemenkes RI 2022",
    });
  }

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 48, fontFamily: "Quicksand, system-ui, sans-serif" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="tv-btn-sec"
          >
            ← Kembali
          </button>
        )}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontFamily: "Fredoka, Quicksand, system-ui, sans-serif",
              color: "var(--tv-navy, #0A0B5F)",
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            Skrining Perkembangan KPSP
          </h2>
          <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: "var(--tv-soft-teks, #667085)", fontWeight: 600 }}>
            Kuesioner Pra Skrining Perkembangan
          </p>
        </div>
      </div>



      {/* Pasien Aktif Info */}
      {(profil.nama || profil.usiaBulan != null) && (
        <div className="tv-patient-active-banner tv-patient-info" style={{ borderRadius: 16 }}>
          {"\uD83D\uDC64"} Pasien aktif: <strong className="tv-patient-name">{profil.nama || "(tanpa nama)"}</strong>
          {profil.usiaBulan != null ? " \u00b7 " + usiaTeks(profil.usiaBulan) : ""}
        </div>
      )}

      {/* Selector Usia KPSP */}
      <div className="kartu" style={{ marginBottom: 16, borderRadius: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--tv-teks, #0a0b4f)", marginBottom: 8 }}>
          Pilih Kelompok Usia KPSP:
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72].map((age) => {
            const aktif = selectedAge === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => gantiUsia(age)}
                className={`tv-age-btn ${aktif ? "active" : ""}`}
              >
                {age} Bulan {aktif ? "(Aktif)" : ""}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: "var(--tv-soft-teks, #667085)", marginTop: 10, lineHeight: 1.5 }}>
          {groupData.deskripsi}
        </div>
      </div>

      {!selesai && (
        <div className="kartu" style={{ borderRadius: 20 }}>
          {/* Progress bar + header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--tv-soft-teks, #667085)" }}>
              Pertanyaan {langkah + 1} dari {daftarSoal.length} · Terjawab {totalDijawab}
            </span>
            <button
              type="button"
              onClick={reset}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--tv-soft-teks, #667085)",
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
              background: "var(--tv-line, #F1F3F8)",
              borderRadius: 999,
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: ((langkah + 1) / daftarSoal.length) * 100 + "%",
                background: "var(--tv-navy, #0a0b5f)",
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
                  className={`tv-num-dot ${aktifDot ? "active-step" : ""} ${
                    terjawab ? (jawaban[it.no] === "ya" ? "ans-ya" : "ans-tidak") : ""
                  }`}
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
                color: "var(--tv-teks, #0a0b4f)",
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
                  color: "var(--tv-soft-teks, #667085)",
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
                    className={`tv-opt-btn ${
                      aktif ? (opt === "ya" ? "selected-ya" : "selected-tidak") : ""
                    }`}
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
              className="tv-btn-sec"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {"\u2190"} Sebelumnya
            </button>

            {!iniTerakhir ? (
              <button
                type="button"
                disabled={jawaban[itemAktif.no] == null}
                onClick={() => setLangkah((l) => Math.min(daftarSoal.length - 1, l + 1))}
                className="tv-btn-pri"
                style={{ flex: 1 }}
              >
                Selanjutnya {"\u2192"}
              </button>
            ) : (
              <button
                type="button"
                disabled={!semuaTerjawab}
                onClick={() => setSelesai(true)}
                className="tv-btn-pri"
                style={{ flex: 1 }}
              >
                Hitung Hasil KPSP
              </button>
            )}
          </div>

          {!semuaTerjawab && iniTerakhir && (
            <p style={{ fontSize: 11.5, color: "var(--tv-soft-teks, #98A2B3)", marginTop: 8, textAlign: "center" }}>
              Masih ada {daftarSoal.length - totalDijawab} pertanyaan belum dijawab — klik nomor di
              atas untuk melengkapinya.
            </p>
          )}
        </div>
      )}

      {/* Hasil Skrining */}
      {selesai && hasil && (
        <div className={`kartu tv-res-card ${hasil.kategori}`}>
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
                }}
              >
                Hasil KPSP {selectedAge} Bulan — Total {"'YA'"}: {hasil.totalYa} / {daftarSoal.length}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {hasil.label}
              </div>
            </div>
            <button
              type="button"
              onClick={ubahJawaban}
              className="tv-btn-sec"
              style={{ fontSize: 11.5, padding: "6px 12px", borderRadius: 999 }}
            >
              Ubah Jawaban
            </button>
          </div>

          <p style={{ fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
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
        Anak, Kementerian Kesehatan Republik Indonesia (Kemenkes 2022).
      </p>
    </div>
  );
}
