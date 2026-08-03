"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarIcon } from "@/shared/ui";

/**
 * Pencarian global (command palette).
 * Mencari di: nama menu + kata kunci/alias + teks di dalam tiap alat.
 * Sumber data: /search-index.json (dihasilkan scripts/build-search-index.mjs) + fallback baseline.
 * Hasil tampil sebagai dropdown yang bisa diklik langsung menuju alat.
 */

export interface SearchEntry {
  type: "menu" | "content";
  slug: string;
  label: string;
  icon: string;
  href: string;
  text: string;
  keywords?: string;
  anchor?: string;
}

const TYPE_LABEL: Record<SearchEntry["type"], string> = {
  menu: "Menu",
  content: "Isi",
};

// Entri baseline agar pencarian langsung berfungsi instan bahkan sebelum /search-index.json termuat
const BASELINE_ENTRIES: SearchEntry[] = [
  // Menu Utama
  { type: "menu", slug: "beranda", label: "Beranda", icon: "🏠", href: "/", text: "Beranda & Dashboard Utama", keywords: "home dashboard favorit rekam medis pasien" },
  { type: "menu", slug: "ai-assistant", label: "Asisten AI", icon: "🤖", href: "/preview/ai-assistant", text: "Asisten AI Klinis Pediatrik", keywords: "ai asisten gemini tanya konsultasi rekomendasi" },
  { type: "menu", slug: "darurat", label: "Mode Darurat", icon: "🚨", href: "/preview/darurat", text: "Mode Darurat & Resusitasi PALS", keywords: "darurat emergency pat gcs pals resusitasi epinefrin rjp cpr" },
  { type: "menu", slug: "alur", label: "Alur Tata Laksana", icon: "🧭", href: "/preview/alur", text: "Alur & Algoritma Tata Laksana", keywords: "alur algoritma asma kejang dbd hipoglikemia kad" },
  { type: "menu", slug: "dosis", label: "Dosis Obat", icon: "💊", href: "/preview/dosing", text: "Kalkulator Dosis Obat Anak", keywords: "dosis obat paracetamol mg/kg sediaan sirup" },
  { type: "menu", slug: "cairan", label: "Terapi Cairan", icon: "💧", href: "/preview/fluids", text: "Terapi Cairan Rumatan & Rehidrasi", keywords: "cairan rumatan holliday segar who rehidrasi luka bakar parkland tetesan infus" },
  { type: "menu", slug: "puyer", label: "Racik Puyer", icon: "⚗️", href: "/preview/puyer", text: "Kalkulator Racik Puyer Multi-Obat", keywords: "puyer pulveres racik dtd bagi tablet kapsul etiket" },
  { type: "menu", slug: "tumbuh-kembang", label: "Tumbuh Kembang", icon: "📊", href: "/preview/pertumbuhan", text: "Tumbuh Kembang, Kurva & Skrining KPSP", keywords: "tumbuh kembang kurva who cdc z-score persentil stunting longitudinal kpsp" },
  { type: "menu", slug: "skoring", label: "Skoring Klinis", icon: "🧮", href: "/preview/skoring", text: "8 Skoring & Kriteria Klinis Anak", keywords: "skor skoring cds croup pas downes pass kawasaki centor tbanak" },
  { type: "menu", slug: "lab", label: "Interpretasi Lab", icon: "🔬", href: "/preview/lab", text: "Interpretasi Lab, AGD & Elektrolit", keywords: "lab agd abg gas darah elektrolit natrium kalium hb trombosit rujukan" },
  { type: "menu", slug: "nutrisi", label: "Kalkulator Nutrisi", icon: "🍎", href: "/preview/nutrisi", text: "Kalkulator Kalori, Susu & MPASI", keywords: "nutrisi kalori energi bmr rda susu formula mpasi" },
  { type: "menu", slug: "protokol", label: "Guideline", icon: "🩺", href: "/preview/guideline", text: "Guideline & Panduan Pediatrik", keywords: "guideline protokol pedoman who idai pdf" },
  { type: "menu", slug: "imunisasi", label: "Jadwal Imunisasi", icon: "📅", href: "/preview/imunisasi", text: "Jadwal Imunisasi IDAI & Catch-Up", keywords: "imunisasi vaksin vaksinasi idai catch up kejar" },
  { type: "menu", slug: "ringkasan", label: "Ringkasan Klinis", icon: "📄", href: "/preview/ringkasan", text: "Ringkasan & Resume Catatan Medis", keywords: "ringkasan resume rekam medis copy salin" },
  { type: "menu", slug: "tekanan-darah", label: "Tekanan Darah", icon: "🫀", href: "/preview/tekanan-darah", text: "Kalkulator Persentil Tekanan Darah Anak (AAP 2017)", keywords: "tekanan darah td bp blood pressure hipertensi persentil aap 2017 sistolik diastolik sbp dbp elevated stage 1 stage 2 manset cuff" },
  { type: "menu", slug: "pasien", label: "Profil Pasien", icon: "👤", href: "/", text: "Profil & Data Pasien Aktif", keywords: "pasien profil rekam medis rm berat tinggi usia" },

  // Sub-fitur Spesifik Tumbuh Kembang
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Skrining Autisme (M-CHAT-R)",
    icon: "🧩",
    href: "/preview/pertumbuhan?tab=skrining&tool=mchat",
    text: "Skrining Risiko Autisme M-CHAT-R (Modified Checklist for Autism in Toddlers, Revised) - 20 Item Pertanyaan Usia 16–30 Bulan",
    keywords: "mchat m-chat mchatr m-chat-r mchat/r autisme asd kuesioner kuisoner kuisioner kuis skrining autisme toddler anak 16-30 bulan robins fein barton",
    anchor: "text:M-CHAT-R"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Skrining Perkembangan (KPSP)",
    icon: "🌱",
    href: "/preview/pertumbuhan?tab=skrining&tool=kpsp",
    text: "Kuesioner Pra Skrining Perkembangan (KPSP) Anak Usia 3 - 72 Bulan (Motorik Kasar, Halus, Bicara & Bahasa, Sosialisasi)",
    keywords: "kpsp kuesioner kuisoner kuisioner pra skrining perkembangan 3 6 9 12 15 18 21 24 30 36 42 48 54 60 66 72 bulan motorik kasar halus bicara bahasa sosialisasi kemandirian ppr penyimpangan meragukan sesuai",
    anchor: "text:Skrining Perkembangan"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Kurva Pertumbuhan WHO & CDC",
    icon: "📊",
    href: "/preview/pertumbuhan?tab=single",
    text: "Kurva Pertumbuhan WHO / CDC (BB/U, TB/U, BB/TB, IMT/U, Lingkar Kepala LK/U)",
    keywords: "kurva pertumbuhan who cdc z-score persentil bb/u tb/u bb/tb imt/u lingkar kepala grafik single visit",
    anchor: "text:Kurva"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Status Gizi & Stunting",
    icon: "🔍",
    href: "/preview/pertumbuhan?tab=single",
    text: "Penilaian Status Gizi, Stunting, Severely Stunted, Wasting, Underweight, & Obesitas",
    keywords: "status gizi stunting severely stunted gizi buruk gizi kurang wasting underweight gizi lebih obesitas",
    anchor: "text:Status Gizi"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Mid Parental Height (MPH)",
    icon: "📏",
    href: "/preview/pertumbuhan?tab=single",
    text: "Potensi Tinggi Genetik / Mid Parental Height (MPH) Anak",
    keywords: "mid parental height mph potensi tinggi genetik estimasi tinggi dewasa orang tua",
    anchor: "text:Mid Parental"
  },

  // Sub-fitur Terapi Cairan
  {
    type: "content",
    slug: "cairan",
    label: "Rumatan Cairan Holliday-Segar",
    icon: "🧃",
    href: "/preview/fluids?tab=holliday",
    text: "Rumatan Cairan Holliday-Segar (24 Jam & Kecepatan Tetesan Per Jam)",
    keywords: "cairan rumatan maintenance holliday segar kebutuhan24jam kecepatan per jam infus",
    anchor: "text:Holliday"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Rehidrasi Diare WHO",
    icon: "🩹",
    href: "/preview/fluids?tab=who",
    text: "Rehidrasi Diare WHO (Rencana A, Rencana B, Rencana C, Zinc, Oralit)",
    keywords: "rehidrasi diare who rencana a rencana b rencana c oralit zinc dehidrasi ringan sedang berat iv kristaloid",
    anchor: "text:Rehidrasi WHO"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Resusitasi Luka Bakar",
    icon: "🔥",
    href: "/preview/fluids?tab=burn",
    text: "Resusitasi Luka Bakar (Formula Parkland / Baxter & Chart Lund-Browder Anak)",
    keywords: "luka bakar burn parkland baxter lund browder luas luka bakar bsa % resusitasi cairan ringer laktat",
    anchor: "text:Luka Bakar"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Faktor Tetes & Drip",
    icon: "💉",
    href: "/preview/fluids?tab=drip",
    text: "Kalkulator Tetesan Infus & Drip Syringe Pump (Mikro & Makro Tetes)",
    keywords: "faktor tetes tetesan infus mpm dpm mikrotetes makrotetes kecepatan tetes syringe pump infus pump drip",
    anchor: "text:Faktor Tetes"
  },

  // Sub-fitur Mode Darurat
  {
    type: "content",
    slug: "darurat",
    label: "Pediatric Assessment Triangle (PAT)",
    icon: "📐",
    href: "/preview/darurat?tab=pat",
    text: "Pediatric Assessment Triangle (PAT) - Appearance, Work of Breathing, Circulation",
    keywords: "pat pediatric assessment triangle segitiga asesmen appearance breathing circulation kulit",
    anchor: "text:PAT"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Glasgow Coma Scale (pGCS)",
    icon: "👁️",
    href: "/preview/darurat?tab=gcs",
    text: "GCS (Glasgow Coma Scale) Anak & Bayi - Respon Mata, Verbal, Motorik",
    keywords: "gcs glasgow coma scale tingkat kesadaran mata verbal motorik bayi anak skor gcs",
    anchor: "text:Glasgow"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Dosis & Alat Resusitasi PALS",
    icon: "💊",
    href: "/preview/darurat?tab=pals",
    text: "Kalkulator Dosis & Alat Resusitasi PALS (Epinefrin, Defibrilasi, Kardioversi, ETT, Suction)",
    keywords: "pals dosis alat resusitasi endotracheal tube ett defibrilator obat emergensi epinefrin",
    anchor: "text:PALS"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Timer Resusitasi CPR",
    icon: "⚡",
    href: "/preview/darurat?tab=resus",
    text: "Timer & Log Algoritma Resusitasi Jantung Paru (CPR / RJP)",
    keywords: "pals resusitasi rjp cpr henti jantung epinefrin amiodaron defibrilasi shock joule asistol pea timer",
    anchor: "text:Resusitasi"
  },

  // Sub-fitur Interpretasi Lab
  {
    type: "content",
    slug: "lab",
    label: "Analisis Gas Darah (AGD)",
    icon: "🩺",
    href: "/preview/lab?tab=agd",
    text: "Analisis Gas Darah (AGD / ABG Analyzer) - pH, pCO2, HCO3, Base Excess, Kompensasi",
    keywords: "agd abg analisa gas darah ph pco2 hco3 base excess asidosis alkalosis metabolik respiratorik kompensasi",
    anchor: "text:Analisis Gas Darah"
  },
  {
    type: "content",
    slug: "lab",
    label: "Koreksi Elektrolit",
    icon: "⚡",
    href: "/preview/lab?tab=elektrolit",
    text: "Koreksi Elektrolit (Natrium & Kalium - Hiponatremia / Hipokalemia)",
    keywords: "elektrolit natrium kalium klorida koreksi hiponatremia hipokalemia nacl 3% kcl cairan",
    anchor: "text:Elektrolit"
  },
  {
    type: "content",
    slug: "lab",
    label: "Hematologi & Kimia Darah",
    icon: "🩸",
    href: "/preview/lab?tab=darah",
    text: "Pemeriksaan Hematologi & Kimia Darah (Hb, Leukosit, Trombosit, Hematokrit, CRP, LED)",
    keywords: "hematologi hb hemoglobin leukosit trombosit hematokrit crp led fungsi hati ginjal ureum kreatinin hitung darah",
    anchor: "text:Hematologi"
  },
  {
    type: "content",
    slug: "lab",
    label: "Nilai Rujukan Lab Pediatrik",
    icon: "📊",
    href: "/preview/lab?tab=rujukan",
    text: "Nilai Rujukan Normal Laboratorium Pediatrik Berdasarkan Usia",
    keywords: "nilai rujukan normal lab rentang acuan batas normal anak bayi neonatus",
    anchor: "text:Nilai Rujukan"
  },

  // Kalkulator Persentil Tekanan Darah Anak
  {
    type: "content",
    slug: "tekanan-darah",
    label: "Persentil Tekanan Darah Anak",
    icon: "🫀",
    href: "/preview/tekanan-darah",
    text: "Kategori Tekanan Darah Anak & Remaja Menurut AAP 2017 (Normal, Elevated BP, Stage 1 HTN range, Stage 2 HTN range)",
    keywords: "tekanan darah anak hipertensi persentil aap 2017 table 3 table 4 table 5 sistolik diastolik p90 p95 p95+12 elevated stage 1 stage 2 auskultasi osilometrik manset",
    anchor: "text:Tekanan Darah"
  }
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>(BASELINE_ENTRIES);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Muat indeks lengkap (dari file statis di /public/search-index.json) dan gabungkan
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const list: SearchEntry[] = Array.isArray(d) ? d : d.entries || [];
        if (list.length > 0) {
          // Gabungkan entri baseline dan fetched, hindari duplikasi berdasarkan href + text
          const seen = new Set<string>();
          const combined: SearchEntry[] = [];
          for (const item of [...list, ...BASELINE_ENTRIES]) {
            const key = `${item.slug}-${item.type}-${item.href}-${item.text.toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              combined.push(item);
            }
          }
          setEntries(combined);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Tutup dropdown saat klik di luar.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [] as SearchEntry[];
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored: Array<{ e: SearchEntry; score: number }> = [];
    for (const e of entries) {
      const label = e.label.toLowerCase();
      const kw = (e.keywords || "").toLowerCase();
      const text = e.text.toLowerCase();
      const rawHay = label + " " + kw + " " + text;
      const normHay = rawHay.replace(/[-_/.]/g, " ");
      const compactHay = rawHay.replace(/[-_/.\s]/g, "");

      // Harus mencakup semua token pencarian
      const matchesAll = tokens.every((t) => {
        const normT = t.replace(/[-_/.]/g, " ");
        const compactT = t.replace(/[-_/.\s]/g, "");
        if (rawHay.includes(t) || normHay.includes(normT) || compactHay.includes(compactT)) {
          return true;
        }
        // Toleransi ejaan (kuisoner -> kuesioner)
        if ((t === "kuisoner" || t === "kuisioner") && (rawHay.includes("kuesioner") || rawHay.includes("kpsp") || rawHay.includes("m-chat"))) {
          return true;
        }
        return false;
      });
      if (!matchesAll) continue;

      let score = 0;
      if (label.startsWith(q)) score += 120;
      else if (label.includes(q)) score += 80;
      if (e.type === "menu") score += 50;
      if (kw && tokens.every((t) => kw.includes(t))) score += 35;
      if (text.includes(q)) score += 20;
      score -= Math.min(15, Math.floor(e.text.length / 25)); // Utamakan yang ringkas & spesifik
      scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);

    // Batasi maksimal 4 hasil per slug/alat, total 12.
    const perTool: Record<string, number> = {};
    const out: SearchEntry[] = [];
    for (const { e } of scored) {
      const n = perTool[e.slug] || 0;
      if (n >= 4) continue;
      perTool[e.slug] = n + 1;
      out.push(e);
      if (out.length >= 12) break;
    }
    return out;
  }, [query, entries]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(e: SearchEntry) {
    setOpen(false);
    setQuery("");
    if (e.anchor) {
      try {
        sessionStorage.setItem("tv_search_target", JSON.stringify({ anchor: e.anchor, href: e.href }));
      } catch (error) {
        console.warn(error);
      }
    }
    const url = e.anchor
      ? (e.href.includes("#") ? e.href : e.href + "#tk=" + encodeURIComponent(e.anchor))
      : e.href;
    router.push(url);
  }

  function onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (ev.key === "Enter") {
      const r = results[active];
      if (r) {
        ev.preventDefault();
        go(r);
      }
    }
  }

  const showPanel = open && query.trim().length >= 2;

  return (
    <div className="tv-search" ref={boxRef}>
      <span className="tv-search-ico" aria-hidden>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        placeholder="Cari alat, fitur, atau kata kunci..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="Pencarian global"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="tv-search-list"
        autoComplete="off"
      />
      {showPanel && (
        <div className="tv-search-results" id="tv-search-list" role="listbox">
          {results.length === 0 ? (
            <div className="tv-search-empty">
              {"Tidak ada hasil untuk \u201C"}
              {query.trim()}
              {"\u201D."}
            </div>
          ) : (
            results.map((r, i) => {
              const showSnippet =
                r.type !== "menu" &&
                r.text &&
                r.text.toLowerCase() !== r.label.toLowerCase();
              return (
                <button
                  type="button"
                  key={r.type + "-" + r.slug + "-" + i}
                  className={"tv-search-item" + (i === active ? " aktif" : "")}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  <span className="tv-search-item-ico" aria-hidden style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <SidebarIcon slug={r.slug} size={18} />
                  </span>
                  <span className="tv-search-item-body">
                    <span className="tv-search-item-top">
                      <span className="tv-search-item-tool">{r.label}</span>
                      <span className="tv-search-item-type">
                        {TYPE_LABEL[r.type]}
                      </span>
                    </span>
                    {showSnippet && (
                      <span className="tv-search-item-snip">{r.text}</span>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
