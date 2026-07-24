"use client";

import { useEffect, useMemo, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { RedFlagCrossLink } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { DAFTAR_SKOR } from "./data";
import { hitungSkor } from "./hitungSkor";

function tandaPoin(n: number): string {
  return (n >= 0 ? "+" : "") + n;
}

function usiaTeks(bulan: number): string {
  if (bulan < 24) return bulan + " bulan";
  const th = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  return sisa ? th + " th " + sisa + " bln" : th + " tahun";
}

/**
 * Untuk parameter "Usia" pada Skor Centor (index opsi: 0="3–14 tahun",
 * 1="15–44 tahun", 2="≥ 45 tahun"), tentukan indeks opsi yang sesuai dengan
 * usia profil pasien aktif. Mengembalikan null bila usia di luar cakupan
 * ketiga opsi (mis. balita <3 tahun) atau usia belum diisi di profil.
 */
function opsiUsiaCentorDariProfil(usiaBulan: number | null | undefined): number | null {
  if (usiaBulan == null) return null;
  const tahun = usiaBulan / 12;
  if (tahun >= 3 && tahun < 15) return 0;
  if (tahun >= 15 && tahun < 45) return 1;
  if (tahun >= 45) return 2;
  return null;
}

export function ScoreCatalog() {
  const profil = usePatientProfile();
  const [aktifId, setAktifId] = useState<string | null>(null);
  const [pilihan, setPilihan] = useState<number[]>([]);
  const [usiaAutoDariProfil, setUsiaAutoDariProfil] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  const def = useMemo(
    () => DAFTAR_SKOR.find((s) => s.id === aktifId) ?? null,
    [aktifId]
  );
  const hasil = useMemo(
    () =>
      def && pilihan.length === def.items.length
        ? hitungSkor(def.id, pilihan)
        : null,
    [def, pilihan]
  );

  const adaInfoPasien = Boolean(
    profil.nama || profil.usiaBulan != null || profil.bb != null
  );

  const buka = (id: string) => {
    const d = DAFTAR_SKOR.find((s) => s.id === id);
    if (!d) return;
    setAktifId(id);
    const nilaiAwal = d.items.map(() => 0);
    // Skor Centor: prasi otomatis kategori usia dari profil pasien aktif
    // (parameter pertama), tetap dapat diubah manual oleh pengguna.
    let autoUsia = false;
    if (id === "centor") {
      const idx = opsiUsiaCentorDariProfil(profil.usiaBulan);
      if (idx != null) {
        nilaiAwal[0] = idx;
        autoUsia = true;
      }
    }
    setUsiaAutoDariProfil(autoUsia);
    setPilihan(nilaiAwal);
  };
  const pilih = (i: number, opt: number) => {
    setPilihan((prev) => prev.map((v, idx) => (idx === i ? opt : v)));
    if (i === 0) setUsiaAutoDariProfil(false);
  };

  // Deep-link dari pencarian global: gulir & sorot kartu skor yang dituju.
  useEffect(() => {
    const h = window.location.hash || "";
    const m = h.match(/[#&]tk=([^&]+)/);
    if (!m) return;
    const tk = decodeURIComponent(m[1] ?? "");
    const bersih = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
    let el: HTMLElement | null = null;
    if (tk.indexOf("id:") === 0) {
      el = document.getElementById(tk.slice(3));
    } else if (tk.indexOf("text:") === 0) {
      const needle = bersih(tk.slice(5));
      const nodes = document.querySelectorAll<HTMLElement>(".tv-skor-card");
      nodes.forEach((n) => {
        if (!el && bersih(n.textContent || "").indexOf(needle) !== -1) el = n;
      });
    }
    const target = el;
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const lama = target.style.boxShadow;
      target.style.transition = "box-shadow .25s ease";
      target.style.boxShadow =
        "0 0 0 3px #E5006D, 0 0 0 8px rgba(229,0,109,.22)";
      window.setTimeout(() => {
        target.style.boxShadow = lama;
      }, 2000);
    }, 220);
  }, []);

  const bannerPasien = adaInfoPasien ? (
    <div className="tv-skor-pasien-aktif">
      👤 Pasien aktif: <strong>{profil.nama || "(tanpa nama)"}</strong>
      {profil.usiaBulan != null ? " · " + usiaTeks(profil.usiaBulan) : ""}
      {profil.bb != null ? " · " + profil.bb + " kg" : ""}
    </div>
  ) : null;

  if (!def || !hasil) {
    return (
      <div className="tv-stack">
        {bannerPasien}
        <div className="tv-skor-galeri">
          {DAFTAR_SKOR.map((s) => (
            <button
              key={s.id}
              id={"skor-" + s.id}
              type="button"
              className="tv-skor-card"
              onClick={() => buka(s.id)}
            >
              <span className="tv-skor-card-ic" aria-hidden>
                {s.emoji}
              </span>
              <span className="tv-skor-card-tx">
                <span className="tv-skor-card-nama">{s.nama}</span>
                <span className="tv-skor-card-ket">{s.ringkas}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tv-stack">
      {bannerPasien}
      <button
        type="button"
        className="tv-skor-back"
        onClick={() => setAktifId(null)}
      >
        {"\u2190"} Kembali ke daftar skoring
      </button>
      <div className="tv-skor-detail-head">
        <h2 className="tv-skor-detail-nama">
          <span aria-hidden>{def.emoji}</span> {def.nama}
        </h2>
        <p className="tv-skor-detail-ket">{def.ket}</p>
      </div>
      {def.items.map((p, i) => (
        <div key={p.label} className="tv-skor-param">
          <div className="tv-skor-label">
            {p.label}
            {def.id === "centor" && i === 0 && usiaAutoDariProfil && (
              <span className="tv-skor-auto-tag">
                otomatis dari profil pasien
              </span>
            )}
          </div>
          <div className="tv-skor-opsi">
            {p.opsi.map((o, oi) => (
              <button
                key={o.teks}
                type="button"
                className={"tv-skor-opt" + (pilihan[i] === oi ? " aktif" : "")}
                aria-pressed={pilihan[i] === oi}
                onClick={() => pilih(i, oi)}
              >
                <span>{o.teks}</span>
                <span className="tv-skor-poin">{tandaPoin(o.nilai)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={"tv-skor-hasil " + hasil.level}>
        {!def.hideTotal && (
          <div className="tv-skor-total">
            Total skor: <strong>{hasil.total}</strong> / {def.maxTotal}
          </div>
        )}
        <div className="tv-skor-kat">{hasil.kategori}</div>
        <p className="tv-skor-saran">{hasil.saran}</p>
        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
            onClick={() => {
              const bodyText = [
                def.hideTotal ? "" : `Total Skor: ${hasil.total} / ${def.maxTotal}`,
                `Kategori: ${hasil.kategori}`,
                `Rekomendasi / Saran: ${hasil.saran}`,
              ].filter(Boolean).join("\n");

              addRingkasanItem({
                title: `Skor Klinis — ${def.nama}`,
                source: "Skor Klinis",
                body: bodyText,
              });
              setDitambahkan(true);
              setTimeout(() => setDitambahkan(false), 2200);
            }}
          >
            {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
          </button>
        </div>
      </div>

      {/* Auto-suggest Red Flag Cross-Links berdasarkan temuan klinis */}
      {def.id === "cds" && hasil.total >= 5 && (
        <RedFlagCrossLink
          badge="CROSS-LINK REHIDRASI PARENTERAL"
          title="Rekomendasi Lanjutan: Terapi Cairan Rencana C (IV)"
          description="Skor dehidrasi sedang-berat mengindikasikan perlunya resusitasi cairan parenteral cepat dan pemantauan ketat hemodinamik."
          actions={[
            {
              label: "Buka Terapi Cairan Rencana C",
              href: "/preview/fluids",
              primary: true,
              icon: "💧",
            },
            {
              label: "Mode Darurat Resusitasi",
              href: "/preview/darurat",
              icon: "⚡",
            },
          ]}
        />
      )}

      {def.id === "downes" && hasil.total >= 6 && (
        <RedFlagCrossLink
          badge="RED-FLAG DISTRES NAPAS NEONATUS"
          title="Ancaman Gagal Napas — Bantuan Napas Lanjut & AGD"
          description="Downes score ≥6 berisiko tinggi gagal napas. Pertimbangkan pendorongan CPAP/Ventilator & evaluasi Analisa Gas Darah."
          actions={[
            {
              label: "Cek Analisa Gas Darah (AGD)",
              href: "/preview/agd",
              primary: true,
              icon: "🩺",
            },
            {
              label: "Mode Darurat Resusitasi PALS",
              href: "/preview/darurat",
              icon: "⚡",
            },
          ]}
        />
      )}

      {def.id === "croup" && hasil.total >= 6 && (
        <RedFlagCrossLink
          badge="RED-FLAG CROUP BERAT"
          title="Nebulisasi Epinefrin & Deksametason Sistemik"
          description="Croup berat (skor ≥6) berisiko obstruksi jalan napas atas. Berikan Nebul Epinefrin 1:1000 & Deksametason 0.6 mg/kg IV/IM."
          actions={[
            {
              label: "Hitung Dosis Obat",
              href: "/preview/dosing",
              primary: true,
              icon: "💊",
            },
            {
              label: "Mode Darurat PALS",
              href: "/preview/darurat",
              icon: "⚡",
            },
          ]}
        />
      )}

      {def.id === "pass" && hasil.total >= 5 && (
        <RedFlagCrossLink
          badge="RED-FLAG ASMA AKUT BERAT"
          title="Buka Alur Tatalaksana Asma Akut & Nebulisasi Kontinyu"
          description="Skor PASS tinggi memerlukan nebulisasi Salbutamol + Ipratropium berulang/kontinyu, Steroid IV, & Oksigenasi."
          actions={[
            {
              label: "Buka Alur Tatalaksana Asma",
              href: "/preview/alur",
              primary: true,
              icon: "📘",
            },
            {
              label: "Hitung Dosis Salbutamol & Steroid",
              href: "/preview/dosing",
              icon: "💊",
            },
          ]}
        />
      )}

      {def.id === "pas" && hasil.total >= 7 && (
        <RedFlagCrossLink
          badge="INDIKASI KONSULTASI BEDAH"
          title="Kecurigaan Apendisitis Tinggi — Persiapan Pre-Op"
          description="Skor PAS ≥7 mengindikasikan kecurigaan tinggi apendisitis. Puasakan pasien, pasang IV line, & siapkan profilaksis antibiotik."
          actions={[
            {
              label: "Hitung Dosis Antibiotik Pre-Op",
              href: "/preview/dosing",
              primary: true,
              icon: "💊",
            },
            {
              label: "Lihat Guideline Klinis",
              href: "/preview/guideline",
              icon: "📘",
            },
          ]}
        />
      )}

      {def.id === "tbanak" && hasil.total >= 6 && (
        <RedFlagCrossLink
          badge="DIAGNOSIS KLINIS TB ANAK TEGAK"
          title="Registrasi & Dosis Obat Anti-Tuberkulosis (OAT)"
          description="Skor TB ≥6 menegakkan diagnosis TB anak. Mulai terapi OAT kategori anak (2HRZE / 4HR) sesuai berat badan."
          actions={[
            {
              label: "Hitung Dosis OAT Anak",
              href: "/preview/dosing",
              primary: true,
              icon: "💊",
            },
            {
              label: "Buka Alur Tatalaksana TB",
              href: "/preview/alur",
              icon: "📘",
            },
          ]}
        />
      )}

      {def.id === "kawasaki" && hasil.level === "crit" && (
        <RedFlagCrossLink
          badge="DIAGNOSIS KAWASAKI KLASIK"
          title="Pemberian IVIG & Aspirin Dosis Tinggi"
          description="Memenuhi kriteria Kawasaki klasik. Berikan IVIG 2 g/kg tunggal + Aspirin dosis anti-inflamasi (80–100 mg/kg/hari) & Rujuk Ekokardiografi."
          actions={[
            {
              label: "Hitung Dosis IVIG & Aspirin",
              href: "/preview/dosing",
              primary: true,
              icon: "💊",
            },
          ]}
        />
      )}

      <p className="tv-skor-sumber">
        Sumber: {def.sumber} Alat bantu, bukan pengganti penilaian klinis.
      </p>
    </div>
  );
}
