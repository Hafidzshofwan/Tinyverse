"use client";

import { useMemo, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { RedFlagCrossLink } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { MCHAT_ITEMS, hitungMchat, itemBerisiko, type MchatJawaban } from "./data";

function usiaTeks(bulan: number): string {
  if (bulan < 24) return bulan + " bulan";
  const th = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  return sisa ? th + " th " + sisa + " bln" : th + " tahun";
}

/**
 * Skrining M-CHAT-R (Modified Checklist for Autism in Toddlers, Revised) -
 * 20 item ya/tidak, usia sasaran 16-30 bulan. Item 2, 5, 12 diberi skor
 * terbalik. Sumber: Robins, Fein, & Barton (2009); teks item merupakan
 * parafrase Bahasa Indonesia, bukan terjemahan literal.
 *
 * Ditampilkan sebagai wizard satu pertanyaan per layar (bukan 20 item
 * ditumpuk) supaya scroll tidak panjang; ada dot-navigator untuk lompat
 * ke pertanyaan tertentu / mengubah jawaban.
 */
export function MchatForm({ onBack }: { onBack?: () => void } = {}) {
  const profil = usePatientProfile();
  const [jawaban, setJawaban] = useState<Record<number, MchatJawaban>>({});
  const [selesai, setSelesai] = useState(false);
  const [langkah, setLangkah] = useState(0); // index 0..19

  const totalDijawab = Object.values(jawaban).filter((v) => v != null).length;
  const semuaTerjawab = totalDijawab === MCHAT_ITEMS.length;

  const hasil = useMemo(() => (selesai ? hitungMchat(jawaban) : null), [selesai, jawaban]);
  const daftarBerisiko = useMemo(() => (selesai ? itemBerisiko(jawaban) : []), [selesai, jawaban]);

  const usiaDiLuarRentang =
    profil.usiaBulan != null && (profil.usiaBulan < 16 || profil.usiaBulan > 30);

  const itemAktif = MCHAT_ITEMS[langkah]!;
  const iniTerakhir = langkah === MCHAT_ITEMS.length - 1;

  function pilih(no: number, val: MchatJawaban) {
    setJawaban((prev) => ({ ...prev, [no]: val }));
    setSelesai(false);
    // Otomatis maju ke pertanyaan berikutnya supaya alur cepat.
    if (langkah < MCHAT_ITEMS.length - 1) {
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
    const risikoTeks = daftarBerisiko.map((it) => "#" + it.no).join(", ") || "-";
    addRingkasanItem({
      title: "Skrining M-CHAT-R",
      body:
        "Total item berisiko: " +
        hasil.totalRisiko +
        "/20 (" +
        hasil.label +
        "). Item berisiko: " +
        risikoTeks +
        ". " +
        hasil.saran,
      source: "M-CHAT-R (Robins, Fein & Barton 2009)",
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
            Skrining Autisme M-CHAT-R/F
          </h2>
          <p style={{ margin: "2px 0 0 0", fontSize: 12.5, color: "var(--tv-soft-teks, #667085)", fontWeight: 600 }}>
            Modified Checklist for Autism in Toddlers, Revised
          </p>
        </div>
      </div>



      {(profil.nama || profil.usiaBulan != null) && (
        <div className="tv-patient-active-banner">
          {"\uD83D\uDC64"} Pasien aktif: <strong>{profil.nama || "(tanpa nama)"}</strong>
          {profil.usiaBulan != null ? " \u00b7 " + usiaTeks(profil.usiaBulan) : ""}
        </div>
      )}

      {usiaDiLuarRentang && (
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "#92400E",
            background: "#FEF3C7",
            border: "1px solid #FCD34D",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 14,
          }}
        >
          {"\u26A0\uFE0F"} Usia pasien di luar rentang sasaran M-CHAT-R
          (16–30 bulan). Hasil skrining tetap bisa dipakai sebagai
          referensi, tapi interpretasikan dengan hati-hati.
        </div>
      )}

      {!selesai && (
        <div className="kartu tv-mchat-card" style={{ borderRadius: 20 }}>
          {/* Progress bar + counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--tv-soft-teks, #667085)" }}>
              Pertanyaan {langkah + 1} dari {MCHAT_ITEMS.length} · Terjawab {totalDijawab}
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
          <div className="tv-progress-bar-track" style={{ height: 6, background: "var(--tv-line, #F1F3F8)", borderRadius: 999, marginBottom: 14, overflow: "hidden" }}>
            <div
              className="tv-progress-bar-fill"
              style={{
                height: "100%",
                width: ((langkah + 1) / MCHAT_ITEMS.length) * 100 + "%",
                borderRadius: 999,
                transition: "width .2s ease",
              }}
            />
          </div>

          {/* Dot navigator: klik untuk lompat ke pertanyaan mana pun */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {MCHAT_ITEMS.map((it, idx) => {
              const terjawab = jawaban[it.no] != null;
              const aktifDot = idx === langkah;
              return (
                <button
                  key={it.no}
                  type="button"
                  onClick={() => setLangkah(idx)}
                  title={"Soal #" + it.no + (terjawab ? " (sudah dijawab)" : " (belum dijawab)")}
                  className={`tv-num-dot ${aktifDot ? "active-step" : ""} ${
                    terjawab ? (jawaban[it.no] === "ya" ? "ans-ya" : "ans-tidak") : ""
                  }`}
                >
                  {it.no}
                </button>
              );
            })}
          </div>

          {/* Pertanyaan aktif */}
          <div style={{ minHeight: 120 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--tv-teks, #0a0b4f)", marginBottom: 4, lineHeight: 1.5 }}>
              {itemAktif.no}. {itemAktif.teks}
            </div>
            {itemAktif.contoh && (
              <div style={{ fontSize: 12.5, color: "var(--tv-soft-teks, #667085)", marginBottom: 10 }}>{itemAktif.contoh}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
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

          {/* Navigasi Sebelumnya / Selanjutnya */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
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
                onClick={() => setLangkah((l) => Math.min(MCHAT_ITEMS.length - 1, l + 1))}
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
                Hitung Hasil Skrining
              </button>
            )}
          </div>
          {!semuaTerjawab && iniTerakhir && (
            <p style={{ fontSize: 11.5, color: "var(--tv-soft-teks, #98A2B3)", marginTop: 8, textAlign: "center" }}>
              Masih ada {MCHAT_ITEMS.length - totalDijawab} pertanyaan belum dijawab —
              klik nomor di atas untuk melengkapinya.
            </p>
          )}
        </div>
      )}

      {selesai && hasil && (
        <div className={`kartu tv-res-card tv-mchat-card ${hasil.kategori}`} style={{ borderRadius: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                Total item berisiko: {hasil.totalRisiko} / 20
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
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
          <p style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{hasil.saran}</p>

          {daftarBerisiko.length > 0 && (
            <div style={{ fontSize: 12.5, color: "#475467", marginTop: 8 }}>
              Item berisiko: {daftarBerisiko.map((it) => "#" + it.no).join(", ")}
            </div>
          )}

          {hasil.kategori !== "rendah" && (
            <RedFlagCrossLink
              title={hasil.kategori === "tinggi" ? "Risiko tinggi \u2014 rujuk segera" : "Risiko sedang \u2014 perlu tindak lanjut"}
              description={
                hasil.kategori === "tinggi"
                  ? "Rujuk untuk evaluasi diagnostik & layanan intervensi dini, tanpa perlu menunggu wawancara Follow-Up."
                  : "Lakukan wawancara Follow-Up untuk item yang berisiko. Bila skor Follow-Up tetap \u22652, rujuk untuk evaluasi diagnostik."
              }
              level={hasil.kategori === "tinggi" ? "crit" : "warn"}
              actions={[
                { label: "Tambahkan ke Ringkasan Klinis", onClick: simpanKeRingkasan, primary: true },
              ]}
            />
          )}

          {hasil.kategori === "rendah" && (
            <button
              type="button"
              onClick={simpanKeRingkasan}
              style={{
                marginTop: 12,
                padding: "9px 16px",
                borderRadius: 999,
                border: "none",
                background: "var(--tv-navy, #0a0b5f)",
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
        Sumber: M-CHAT-R™, Robins, Fein & Barton (2009). Alat
        skrining, bukan alat diagnostik — hasil positif tidak berarti
        anak pasti autisme; hasil negatif tidak menyingkirkan kemungkinan
        gangguan perkembangan lain.
      </p>
    </div>
  );
}
