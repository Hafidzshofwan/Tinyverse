"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { RedFlagCrossLink } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { DAFTAR_SKOR } from "./data";
import { hitungSkor } from "./hitungSkor";
import { OptionIllustration } from "./ScoreVisualGuide";
import { ClinicalScoreIcon, ClinicalScoreIconId } from "./ClinicalScoreIcon";

function tandaPoin(n: number): string {
  return (n >= 0 ? "+" : "") + n;
}

function NeuromuscularTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="tv-ballard-tab-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tvNeuroGradInactive" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A0B5F" />
          <stop offset="100%" stopColor="#D936A6" />
        </linearGradient>
      </defs>
      <path
        d="M9.5 2A2.5 2.5 0 0 0 7 4.5A2.5 2.5 0 0 0 4.5 7A2.5 2.5 0 0 0 2 9.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 2 14.5A2.5 2.5 0 0 0 4.5 17A2.5 2.5 0 0 0 7 19.5a2.5 2.5 0 0 0 2.5 2.5c.2 0 .39-.02.58-.07"
        stroke={active ? "#FFFFFF" : "url(#tvNeuroGradInactive)"}
        strokeWidth="2"
        strokeLinecap="round"
        fill={active ? "rgba(255, 255, 255, 0.2)" : "rgba(10, 11, 95, 0.08)"}
      />
      <path
        d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5a2.5 2.5 0 0 1 2.5 2.5a2.5 2.5 0 0 1 2.5 2.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1 2.5 2.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5 2.5c-.19 0-.38-.02-.58-.07"
        stroke={active ? "#FFFFFF" : "url(#tvNeuroGradInactive)"}
        strokeWidth="2"
        strokeLinecap="round"
        fill={active ? "rgba(255, 255, 255, 0.2)" : "rgba(217, 54, 166, 0.08)"}
      />
      <path
        d="M12 2v20"
        stroke={active ? "#FDE047" : "#D936A6"}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1.5" fill={active ? "#FFFFFF" : "#0A0B5F"} />
      <circle cx="12" cy="12" r="1.5" fill={active ? "#FFFFFF" : "#D936A6"} />
      <circle cx="12" cy="17" r="1.5" fill={active ? "#FFFFFF" : "#0A0B5F"} />
    </svg>
  );
}

function PhysicalTabIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="tv-ballard-tab-icon"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tvPhysGradInactive" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D936A6" />
          <stop offset="100%" stopColor="#0A0B5F" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="8"
        r="4.5"
        stroke={active ? "#FFFFFF" : "url(#tvPhysGradInactive)"}
        strokeWidth="2"
        fill={active ? "rgba(255, 255, 255, 0.25)" : "rgba(217, 54, 166, 0.1)"}
      />
      <path
        d="M9 13a3 3 0 0 0-3 3v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2a3 3 0 0 0-3-3H9z"
        stroke={active ? "#FFFFFF" : "url(#tvPhysGradInactive)"}
        strokeWidth="2"
        fill={active ? "rgba(255, 255, 255, 0.2)" : "rgba(10, 11, 95, 0.08)"}
      />
      <path
        d="M12 6a1 1 0 0 1 1 1"
        stroke={active ? "#FDE047" : "#D936A6"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="18" cy="6" r="1.5" fill={active ? "#FDE047" : "#D936A6"} />
    </svg>
  );
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
  const [ballardTab, setBallardTab] = useState<"neuromuscular" | "physical">("neuromuscular");

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

  const buka = useCallback((id: string) => {
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
  }, [profil.usiaBulan]);
  const pilih = (i: number, opt: number) => {
    setPilihan((prev) => prev.map((v, idx) => (idx === i ? opt : v)));
    if (i === 0) setUsiaAutoDariProfil(false);
  };

  // Deep-link dari pencarian global: buka / sorot kartu skor yang dituju.
  useEffect(() => {
    function evaluateSkor() {
      if (typeof window === "undefined") return;

      // 1) Cek URL search parameter: ?skor=cds
      const params = new URLSearchParams(window.location.search);
      const skorParam = params.get("skor");
      if (skorParam) {
        buka(skorParam);
        return;
      }

      // 2) Cek hash: #tk=id:skor-cds
      const h = window.location.hash || "";
      const m = h.match(/[#&]tk=([^&]+)/);
      if (m) {
        const tk = decodeURIComponent(m[1] ?? "");
        if (tk.indexOf("id:skor-") === 0) {
          const id = tk.slice(8);
          buka(id);
          return;
        }
      }

      // 3) Cek sessionStorage
      try {
        const rawTarget = sessionStorage.getItem("tv_search_target");
        if (rawTarget) {
          const parsed = JSON.parse(rawTarget);
          const anchor = String(parsed.anchor || "");
          const href = String(parsed.href || "");
          const matchHref = href.match(/[?&]skor=([^&]+)/);
          if (matchHref && matchHref[1]) {
            buka(matchHref[1]);
            return;
          }
          if (anchor.startsWith("id:skor-")) {
            buka(anchor.replace("id:skor-", ""));
            return;
          }
        }
      } catch (error) {
                   console.warn(error);
              }
    }

    evaluateSkor();
    window.addEventListener("hashchange", evaluateSkor);
    return () => window.removeEventListener("hashchange", evaluateSkor);
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
                <ClinicalScoreIcon
                  id={s.id as ClinicalScoreIconId}
                  size={28}
                  fallbackEmoji={s.emoji}
                />
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
        <h2 className="tv-skor-detail-nama" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden style={{ display: "inline-flex", alignItems: "center" }}>
            <ClinicalScoreIcon
              id={def.id as ClinicalScoreIconId}
              size={32}
              fallbackEmoji={def.emoji}
            />
          </span>
          <span>{def.nama}</span>
        </h2>
        <p className="tv-skor-detail-ket">{def.ket}</p>
      </div>

      {def.id === "ballard" && (
        <div className="tv-ballard-tab-container">
          <div className="tv-ballard-tabs">
            <button
              type="button"
              className={"tv-ballard-tab" + (ballardTab === "neuromuscular" ? " active" : "")}
              onClick={() => setBallardTab("neuromuscular")}
            >
              <span className="tv-ballard-tab-title">
                <NeuromuscularTabIcon active={ballardTab === "neuromuscular"} />
                <span>Maturitas Neuromuskular</span>
              </span>
              <span className="tv-ballard-tab-sub">6 Parameter</span>
            </button>
            <button
              type="button"
              className={"tv-ballard-tab" + (ballardTab === "physical" ? " active" : "")}
              onClick={() => setBallardTab("physical")}
            >
              <span className="tv-ballard-tab-title">
                <PhysicalTabIcon active={ballardTab === "physical"} />
                <span>Maturitas Fisik</span>
              </span>
              <span className="tv-ballard-tab-sub">6 Parameter</span>
            </button>
          </div>
        </div>
      )}

      {def.items
        .map((p, i) => ({ p, i }))
        .filter(({ i }) =>
          def.id === "ballard"
            ? ballardTab === "neuromuscular"
              ? i < 6
              : i >= 6
            : true
        )
        .map(({ p, i }) => (
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
                  <OptionIllustration
                    scoreId={def.id}
                    paramIndex={i}
                    optionIndex={oi}
                  />
                  <div className="tv-skor-opt-body">
                    <span className="tv-skor-opt-teks">{o.teks}</span>
                    <span className="tv-skor-poin">{tandaPoin(o.nilai)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

      {def.id === "ballard" && (
        <div className="tv-ballard-nav">
          {ballardTab === "neuromuscular" ? (
            <button
              type="button"
              className="tv-btn tv-ballard-nav-next"
              onClick={() => setBallardTab("physical")}
            >
              Lanjut ke Maturitas Fisik (6 Parameter) →
            </button>
          ) : (
            <button
              type="button"
              className="tv-btn tv-ballard-nav-prev"
              onClick={() => setBallardTab("neuromuscular")}
            >
              ← Kembali ke Maturitas Neuromuskular
            </button>
          )}
        </div>
      )}
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
            style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
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

      {def.id === "apgar" && hasil.total <= 6 && (
        <RedFlagCrossLink
          badge="RED-FLAG ASFIKSIA NEONATUS"
          title="Resusitasi Bayi Baru Lahir (NRP / PALS)"
          description="Skor APGAR ≤6 mengindikasikan asfiksia neonatus. Segera lakukan langkah awal resusitasi: hangatkan, atur posisi, bersihkan jalan napas, rangsang taktil, dan Ventilasi Tekanan Positif (VTP) bila perlu."
          actions={[
            {
              label: "Alur Darurat Resusitasi PALS",
              href: "/preview/darurat",
              primary: true,
              icon: "⚡",
            },
            {
              label: "Hitung Dosis Obat Resusitasi (Epinefrin)",
              href: "/preview/dosing",
              icon: "💊",
            },
          ]}
        />
      )}

      {def.id === "ballard" && (hasil.level === "crit" || hasil.level === "warn") && (
        <RedFlagCrossLink
          badge="TATALAKSANA BAYI PREMATUR"
          title="Perawatan Khusus Neonatus (NICU / Perinatologi)"
          description="Penilaian Ballard menunjukkan kondisi prematuritas / usia gestasi &lt;37 minggu. Diperlukan pemantauan suhu (inkubator/KMC), bantuan napas CPAP, dan nutrisi enteral/parenteral."
          actions={[
            {
              label: "Cek Dosis Antibiotik & Surfaktan Neonatus",
              href: "/preview/dosing",
              primary: true,
              icon: "💊",
            },
          ]}
        />
      )}

      <div className="tv-skor-sumber-box" style={{
        marginTop: 16,
        padding: "12px 14px",
        borderRadius: "12px",
        background: "var(--tv-soft, #f8fafc)",
        border: "1px solid var(--tv-line, #e2e8f0)",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}>
        <span style={{ fontSize: "18px", lineHeight: 1 }}>📚</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <strong style={{ fontSize: "12px", color: "var(--tv-teks, #0f172a)" }}>
            Referensi Ilmiah &amp; Landasan Medis:
          </strong>
          <p className="tv-skor-sumber" style={{ margin: 0 }}>
            {def.sumber} — <em>(Alat bantu keputusan klinis; keputusan akhir tetap berdasarkan pertimbangan medis DPJP).</em>
          </p>
        </div>
      </div>
    </div>
  );
}
