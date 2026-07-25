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

const KATEGORI_WARNA: Record<string, string> = {
  rendah: "#ECFDF5",
  sedang: "#FFFBEB",
  tinggi: "#FEF2F2",
};
const KATEGORI_TEKS: Record<string, string> = {
  rendah: "#047857",
  sedang: "#B45309",
  tinggi: "#B42318",
};

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

  const itemAktif = MCHAT_ITEMS[langkah];
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

      <div className="judul-section">
        <div className="ikon-bulat" style={{ background: "#D936A61A", color: "#D936A6" }} aria-hidden>
          {"\uD83E\uDDE9"}
        </div>
        <div>
          <h2>Skrining M-CHAT-R</h2>
          <p>
            20 pertanyaan ya/tidak untuk anak usia 16–30 bulan. Alat
            skrining, bukan alat diagnostik.
          </p>
        </div>
      </div>

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
        <div className="kartu">
          {/* Progress bar + counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#667085" }}>
              Pertanyaan {langkah + 1} dari {MCHAT_ITEMS.length} · Terjawab {totalDijawab}
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
          <div style={{ height: 6, background: "#F1F3F8", borderRadius: 999, marginBottom: 14, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: ((langkah + 1) / MCHAT_ITEMS.length) * 100 + "%",
                background: "#0a0b5f",
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
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    border: aktifDot ? "2px solid #0a0b5f" : "1px solid #E2E8F0",
                    background: terjawab ? "#0a0b5f" : "#fff",
                    color: terjawab ? "#fff" : "#98A2B3",
                    fontSize: 10.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {it.no}
                </button>
              );
            })}
          </div>

          {/* Pertanyaan aktif */}
          <div style={{ minHeight: 120 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0a0b4f", marginBottom: 4, lineHeight: 1.5 }}>
              {itemAktif.no}. {itemAktif.teks}
            </div>
            {itemAktif.contoh && (
              <div style={{ fontSize: 12.5, color: "#667085", marginBottom: 10 }}>{itemAktif.contoh}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
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
                      background: aktif ? "#0a0b5f" : "#fff",
                      color: aktif ? "#fff" : "#344054",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {opt}
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
                onClick={() => setLangkah((l) => Math.min(MCHAT_ITEMS.length - 1, l + 1))}
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
                  background: semuaTerjawab ? "var(--tv-navy, #0a0b5f)" : "#E2E8F0",
                  color: semuaTerjawab ? "#fff" : "#98A2B3",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: semuaTerjawab ? "pointer" : "not-allowed",
                }}
              >
                Hitung Hasil Skrining
              </button>
            )}
          </div>
          {!semuaTerjawab && iniTerakhir && (
            <p style={{ fontSize: 11.5, color: "#98A2B3", marginTop: 8, textAlign: "center" }}>
              Masih ada {MCHAT_ITEMS.length - totalDijawab} pertanyaan belum dijawab —
              klik nomor di atas untuk melengkapinya.
            </p>
          )}
        </div>
      )}

      {selesai && hasil && (
        <div
          className="kartu"
          style={{ marginTop: 14, background: KATEGORI_WARNA[hasil.kategori] }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: KATEGORI_TEKS[hasil.kategori] }}>
                Total item berisiko: {hasil.totalRisiko} / 20
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: KATEGORI_TEKS[hasil.kategori], marginTop: 4 }}>
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
          <p style={{ fontSize: 13, color: "#344054", marginTop: 8, lineHeight: 1.6 }}>{hasil.saran}</p>

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
