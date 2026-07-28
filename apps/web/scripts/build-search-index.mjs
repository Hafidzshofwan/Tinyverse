// Generator indeks pencarian global Tinyverse (pure Node, tanpa dependency).
// Membaca island HTML yang MASIH tersisa di public/, sumber React (src/) untuk
// alat yang sudah dimigrasi, data obat (scripts/obat.json),
// katalog skoring (src/features/clinical-scores/data.ts), alur, guideline,
// serta modul-modul fitur React, lalu menulis public/search-index.json.
// Setiap entri konten menyimpan "anchor" agar saat diklik, alat bisa
// auto-scroll & membuka bagian tepatnya (lihat tv-deeplink.js).
// Jalankan dari folder apps/web:  node scripts/build-search-index.mjs

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const SRC = join(__dirname, "..", "src");

// Peta alat -> menu/route + kata kunci/alias (bahasa Indonesia + istilah medis).
//
// Sumber frasa konten:
//   - `file`    : island HTML v17 di public/ (alat yang BELUM dimigrasi).
//   - `srcDirs` : folder sumber React di src/ (alat yang SUDAH dimigrasi).
// Alat tanpa keduanya hanya menyumbang entri menu; konten detailnya diambil
// dari FEATURE_MODULES di bawah.
const TOOLS = [
  { srcDirs: ["widgets/darurat-panel", "features/emergency-pat", "features/emergency-gcs", "features/emergency-pals", "features/emergency-resus", "entities/emergency"],
    slug: "darurat", label: "Mode Darurat", icon: "\uD83D\uDEA8", href: "/preview/darurat",
    keywords: ["gcs","glasgow","pat","pediatric assessment triangle","pals","resusitasi","henti jantung","rjp","cpr","kejang","syok","triase","kegawatan","emergency","gawat darurat","epinefrin","defibrilasi","kardioversi"] },
  { srcDirs: ["widgets/fluids-panel", "features/fluid-maintenance", "features/fluid-drip", "features/burn-calculator", "entities/fluid", "entities/burn"],
    slug: "cairan", label: "Terapi Cairan", icon: "\uD83D\uDCA7", href: "/preview/fluids",
    keywords: ["dehidrasi","rumatan","maintenance","holliday","segar","resusitasi cairan","bolus","kristaloid","rehidrasi","defisit","tetesan","infus","cairan","luka bakar","parkland","lund browder"] },
  { file: "dosis-tool.html", slug: "dosis", label: "Dosis Obat", icon: "\uD83D\uDC8A", href: "/preview/dosing",
    keywords: ["dosis obat","antibiotik","paracetamol","mg/kg","obat","kalkulator dosis","sediaan","dosing"] },
  { file: "puyer-tool.html", slug: "puyer", label: "Racik Puyer", icon: "\u2697\uFE0F", href: "/preview/puyer",
    keywords: ["racik","puyer","pulveres","bagi","tablet","kapsul","racikan","serbuk"] },
  { srcDirs: ["widgets/growth-panel", "features/growth-chart", "widgets/developmental-screening-panel", "features/developmental-screening"],
    slug: "tumbuh-kembang", label: "Tumbuh Kembang", icon: "\uD83D\uDCC8", href: "/preview/pertumbuhan",
    keywords: ["pertumbuhan","tinggi badan","berat badan","who","cdc","z-score","persentil","stunting","mph","mid parental height","kurva","grafik","tumbuh kembang"] },
  { srcDirs: ["widgets/lab-panel", "features/lab-reference", "features/lab-blood", "features/lab-electrolyte", "features/abg-analyzer", "entities/lab", "entities/abg"],
    slug: "lab", label: "Interpretasi Lab", icon: "\uD83D\uDD2C", href: "/preview/lab",
    keywords: ["natrium","kalium","elektrolit","agd","analisa gas darah","abg","ph","hb","hemoglobin","leukosit","trombosit","darah","interpretasi lab","asidosis","alkalosis"] },
  { srcDirs: ["widgets/nutrition-panel", "features/nutrition-calculator", "entities/nutrition"],
    slug: "nutrisi", label: "Kalkulator Nutrisi", icon: "🍎", href: "/preview/nutrisi",
    keywords: ["kalori","protein","kebutuhan energi","susu formula","mpasi","gizi","holliday","rda","takaran susu","sendok takar","nutrisi"] },
];

// Menu tambahan agar seluruh navigasi dapat ditemukan.
const EXTRA_MENUS = [
  { slug: "protokol", label: "Guideline", icon: "🩺", href: "/preview/guideline", keywords: ["guideline","protokol","panduan","pedoman","who","idai","referensi","pdf"] },
  { slug: "beranda", label: "Beranda", icon: "🏠", href: "/", keywords: ["home","utama","dashboard","kalkulator","favorit","akses cepat"] },
  { slug: "ai-assistant", label: "Asisten AI", icon: "🤖", href: "/preview/ai-assistant", keywords: ["ai","asisten","tanya","konsultasi","chat","bantuan","prompt","gemini","klinis","pertanyaan","jawaban"] },
  { slug: "skoring", label: "Skoring Klinis", icon: "\uD83E\uDDEE", href: "/preview/skoring", keywords: ["skor","skoring","scoring","kriteria","penilaian klinis","cds","croup","pas","downes","pass","kawasaki","centor","tbanak"] },
  { slug: "imunisasi", label: "Jadwal Imunisasi", icon: "\uD83D\uDCC5", href: "/preview/imunisasi", keywords: ["imunisasi","vaksin","vaksinasi","jadwal","idai","catch up","kejar","katalog vaksin","efek samping","kontraindikasi"] },
  { slug: "alur", label: "Alur Tata Laksana", icon: "\uD83E\uDDED", href: "/preview/alur", keywords: ["alur","tata laksana","tatalaksana","algoritma","protokol","kegawatan","penanganan","asma","kejang","dbd","dengue","hipoglikemia","kad"] },
  { slug: "ringkasan", label: "Ringkasan Klinis", icon: "\uD83D\uDCC4", href: "/preview/ringkasan", keywords: ["ringkasan","resume","catatan","dokumentasi","copy","salin"] },
  { slug: "pasien", label: "Profil & Pasien", icon: "👤", href: "/", keywords: ["pasien","bangsal","poliklinik","rekam medis","rm","daftar pasien","simpan pasien","no rm"] },
];

// Modul-modul fitur spesifik agar langsung dapat ditemukan di pencarian global
const FEATURE_MODULES = [
  // Asisten AI
  {
    type: "content",
    slug: "ai-assistant",
    label: "Asisten AI Klinis",
    icon: "🤖",
    href: "/preview/ai-assistant",
    text: "Konsultasi pediatrik, rekomendasi dosis, panduan klinis & tanya jawab AI interaktif",
    keywords: "ai asisten tanya jawab konsultasi pediatrik dosis rekomendasi gemini gawat darurat terapi",
    anchor: "text:Asisten AI"
  },
  // Terapi Cairan Sub-features
  {
    type: "content",
    slug: "cairan",
    label: "Terapi Cairan",
    icon: "🧃",
    href: "/preview/fluids?tab=holliday",
    text: "Rumatan Cairan Holliday-Segar (24 Jam & Kecepatan Tetesan Per Jam)",
    keywords: "cairan rumatan maintenance holliday segar kebutuhan24jam kecepatan per jam infus",
    anchor: "text:Holliday"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Terapi Cairan",
    icon: "🩹",
    href: "/preview/fluids?tab=who",
    text: "Rehidrasi Diare WHO (Rencana A, Rencana B, Rencana C, Zinc, Oralit)",
    keywords: "rehidrasi diare who rencana a rencana b rencana c oralit zinc dehidrasi ringan sedang berat iv kristaloid",
    anchor: "text:Rehidrasi WHO"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Terapi Cairan",
    icon: "🔥",
    href: "/preview/fluids?tab=burn",
    text: "Resusitasi Luka Bakar (Formula Parkland / Baxter & Chart Lund-Browder Anak)",
    keywords: "luka bakar burn parkland baxter lund browder luas luka bakar bsa % resusitasi cairan ringer laktat",
    anchor: "text:Luka Bakar"
  },
  {
    type: "content",
    slug: "cairan",
    label: "Terapi Cairan",
    icon: "💉",
    href: "/preview/fluids?tab=drip",
    text: "Kalkulator Tetesan Infus & Drip Syringe Pump (Mikro & Makro Tetes)",
    keywords: "faktor tetes tetesan infus mpm dpm mikrotetes makrotetes kecepatan tetes syringe pump infus pump drip",
    anchor: "text:Faktor Tetes"
  },
  // Mode Darurat Sub-features
  {
    type: "content",
    slug: "darurat",
    label: "Mode Darurat",
    icon: "📐",
    href: "/preview/darurat?tab=pat",
    text: "Pediatric Assessment Triangle (PAT) - Appearance, Work of Breathing, Circulation",
    keywords: "pat pediatric assessment triangle segitiga asesmen appearance breathing circulation kulit",
    anchor: "text:PAT"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Mode Darurat",
    icon: "👁️",
    href: "/preview/darurat?tab=gcs",
    text: "GCS (Glasgow Coma Scale) Anak & Bayi - Respon Mata, Verbal, Motorik",
    keywords: "gcs glasgow coma scale tingkat kesadaran mata verbal motorik bayi anak skor gcs",
    anchor: "text:Glasgow"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Mode Darurat",
    icon: "💊",
    href: "/preview/darurat?tab=pals",
    text: "Kalkulator Dosis & Alat Resusitasi PALS (PALS Doses & Equipment)",
    keywords: "pals dosis alat resusitasi endotracheal tube ett defibrilator obat emergensi epinefrin",
    anchor: "text:PALS"
  },
  {
    type: "content",
    slug: "darurat",
    label: "Mode Darurat",
    icon: "⚡",
    href: "/preview/darurat?tab=resus",
    text: "Timer & Log Algoritma Resusitasi Jantung Paru (CPR / RJP)",
    keywords: "pals resusitasi rjp cpr henti jantung epinefrin amiodaron defibrilasi shock joule asistol pea timer",
    anchor: "text:Resusitasi"
  },
  // Lab Sub-features
  {
    type: "content",
    slug: "lab",
    label: "Interpretasi Lab",
    icon: "🩺",
    href: "/preview/lab?tab=agd",
    text: "Analisis Gas Darah (AGD / ABG Analyzer) - pH, pCO2, HCO3, Base Excess, Kompensasi",
    keywords: "agd abg analisa gas darah ph pco2 hco3 base excess asidosis alkalosis metabolik respiratorik kompensasi",
    anchor: "text:Analisis Gas Darah"
  },
  {
    type: "content",
    slug: "lab",
    label: "Interpretasi Lab",
    icon: "⚡",
    href: "/preview/lab?tab=elektrolit",
    text: "Koreksi Elektrolit (Natrium & Kalium - Hiponatremia / Hipokalemia)",
    keywords: "elektrolit natrium kalium klorida koreksi hiponatremia hipokalemia nacl 3% kcl cairan",
    anchor: "text:Elektrolit"
  },
  {
    type: "content",
    slug: "lab",
    label: "Interpretasi Lab",
    icon: "🩸",
    href: "/preview/lab?tab=darah",
    text: "Pemeriksaan Hematologi & Kimia Darah (Hb, Leukosit, Trombosit, Hematokrit, CRP, LED)",
    keywords: "hematologi hb hemoglobin leukosit trombosit hematokrit crp led fungsi hati ginjal ureum kreatinin hitung darah",
    anchor: "text:Hematologi"
  },
  {
    type: "content",
    slug: "lab",
    label: "Interpretasi Lab",
    icon: "📊",
    href: "/preview/lab?tab=rujukan",
    text: "Nilai Rujukan Normal Laboratorium Pediatrik Berdasarkan Usia",
    keywords: "nilai rujukan normal lab rentang acuan batas normal anak bayi neonatus",
    anchor: "text:Nilai Rujukan"
  },
  // Tumbuh Kembang Sub-features & Longitudinal Monitoring
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Skrining Autisme (M-CHAT-R)",
    icon: "🧩",
    href: "/preview/pertumbuhan?tab=skrining&tool=mchat",
    text: "Skrining Risiko Autisme M-CHAT-R (Modified Checklist for Autism in Toddlers, Revised) - 20 Pertanyaan Usia 16–30 Bulan",
    keywords: "mchat m-chat mchatr m-chat-r mchat/r autisme asd kuesioner kuisoner kuis skrining autisme toddler anak 16-30 bulan robins fein barton",
    anchor: "text:M-CHAT-R"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Skrining Perkembangan (KPSP)",
    icon: "🧩",
    href: "/preview/pertumbuhan?tab=skrining",
    text: "Kuesioner Pra Skrining Perkembangan (KPSP) Anak Usia 3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72 Bulan",
    keywords: "kpsp kuesioner pra skrining perkembangan 3 6 9 12 15 18 21 24 30 36 42 48 54 60 66 72 bulan motorik kasar halus bicara bahasa sosialisasi kemandirian ppr penyimpangan meragukan sesuai",
    anchor: "text:Skrining Perkembangan"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Pemantauan Longitudinal",
    icon: "📈",
    href: "/preview/pertumbuhan?tab=longitudinal",
    text: "Pemantauan Pertumbuhan Longitudinal & Trend Grafik Anak Berkala (Multiple Visit / Rekam Pertumbuhan)",
    keywords: "longitudinal pemantauan pertumbuhan grafik trend berkala multiple visit rekam pertumbuhan z-score grafik berat tinggi usia kunjungan riwayat stunting rekam medis",
    anchor: "text:Pemantauan Longitudinal"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Tumbuh Kembang",
    icon: "📊",
    href: "/preview/pertumbuhan?tab=single",
    text: "Kurva Pertumbuhan WHO / CDC (BB/U, TB/U, BB/TB, IMT/U, Lingkar Kepala LK/U)",
    keywords: "kurva pertumbuhan who cdc z-score persentil bb/u tb/u bb/tb imt/u lingkar kepala grafik single visit",
    anchor: "text:Kurva"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Tumbuh Kembang",
    icon: "🔍",
    href: "/preview/pertumbuhan?tab=single",
    text: "Penilaian Status Gizi, Stunting, Wasting, Underweight, & Obesitas",
    keywords: "status gizi stunting gizi buruk gizi kurang wasting underweight gizi lebih obesitas",
    anchor: "text:Status Gizi"
  },
  {
    type: "content",
    slug: "tumbuh-kembang",
    label: "Tumbuh Kembang",
    icon: "📏",
    href: "/preview/pertumbuhan?tab=single",
    text: "Potensi Tinggi Genetik / Mid Parental Height (MPH)",
    keywords: "mid parental height mph potensi tinggi genetik estimasi tinggi dewasa orang tua",
    anchor: "text:Mid Parental"
  },
  // Kalkulator Nutrisi Sub-features
  {
    type: "content",
    slug: "nutrisi",
    label: "Kalkulator Nutrisi",
    icon: "⚡",
    href: "/preview/nutrisi",
    text: "Estimasi Kebutuhan Kalori & Energi Harian Anak (BMR / TEE / RDA)",
    keywords: "kebutuhan kalori energi harian bmr tee rda kecukupan gizi target kalori",
    anchor: "text:Kebutuhan Energi"
  },
  {
    type: "content",
    slug: "nutrisi",
    label: "Kalkulator Nutrisi",
    icon: "🍼",
    href: "/preview/nutrisi",
    text: "Kalkulator Takaran Susu Formula & Porsi MPASI Bayi",
    keywords: "susu formula mpasi takaran susu sendok takar porsi mpasi frekuensi minum susu",
    anchor: "text:Susu Formula"
  },
  // Skoring Klinis 8 Skor
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "💧",
    href: "/preview/skoring?skor=cds",
    text: "Clinical Dehydration Score (CDS) - Penilaian Derajat Dehidrasi Diare",
    keywords: "cds clinical dehydration score dehidrasi diare mata air mata mukosa mulut derajat dehidrasi",
    anchor: "id:skor-cds"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "🗣️",
    href: "/preview/skoring?skor=croup",
    text: "Westley Croup Score - Evaluasi Derajat Croup / Laringotrakeobronkitis",
    keywords: "westley croup score croup stridor retraksi sianosis batuk menggonggong laringitis",
    anchor: "id:skor-croup"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "🫁",
    href: "/preview/skoring?skor=pas",
    text: "Pediatric Asthma Score (PAS) - Derajat Serangan Asma Anak",
    keywords: "pas pediatric asthma score serangan asma wheezing mengi retraksi frekuensi napas otot bantu",
    anchor: "id:skor-pas"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "👶",
    href: "/preview/skoring?skor=downes",
    text: "Downes Score - Evaluasi Distres Napas Bayi & Neonatus",
    keywords: "downes score distres napas bayi neonatus gawat napas rds grunting sianosis air entry",
    anchor: "id:skor-downes"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "🩺",
    href: "/preview/skoring?skor=pass",
    text: "Pediatric Asthma Severity Score (PASS) - Skor Keparahan Asma",
    keywords: "pass pediatric asthma severity score keparahan asma bronkospasme auskultasi",
    anchor: "id:skor-pass"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "❤️",
    href: "/preview/skoring?skor=kawasaki",
    text: "Kriteria Diagnosis Penyakit Kawasaki (Demam, Konjungtivitis, Ruam, Limfadenopati)",
    keywords: "kawasaki disease kriteria diagnosis demam >5 hari strawberry tongue konjungtivitis limfadenopati vaskulitis",
    anchor: "id:skor-kawasaki"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "🧫",
    href: "/preview/skoring?skor=centor",
    text: "Centor Score (Modified) - Skoring Tonsilofaringitis Akut Streptokokus",
    keywords: "centor score tonsilitis faringitis eksudat streptokokus grup a eksudat tonsil nyeri telan",
    anchor: "id:skor-centor"
  },
  {
    type: "content",
    slug: "skoring",
    label: "Skoring Klinis",
    icon: "🦠",
    href: "/preview/skoring?skor=tbanak",
    text: "Sistem Skoring TB Anak (Tuberkulosis IDAI - Mantoux, Kontak, Limfadenitis)",
    keywords: "skor tb anak tuberkulosis idai uji tuberkulin mantoux kontak tb gizi buruk demam batuk lama",
    anchor: "id:skor-tbanak"
  },
];

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", deg: "\u00B0", times: "\u00D7", plusmn: "\u00B1", micro: "\u00B5", mu: "\u03BC", ge: "\u2265", le: "\u2264", rarr: "\u2192", larr: "\u2190", ndash: "\u2013", mdash: "\u2014", hellip: "\u2026", trade: "\u2122", copy: "\u00A9", eacute: "\u00E9" };

function decode(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return " "; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return " "; } })
    .replace(/&([a-zA-Z]+);/g, (m, n) => (n in ENTITIES ? ENTITIES[n] : " "));
}

// Ubah escape \uXXXX (mis. pada ikon/ringkas di daftar.ts) menjadi karakter asli.
function decodeUnicodeEscapes(s) {
  return String(s).replace(/\\u([0-9a-fA-F]{4})/g, (_, h) =>
    String.fromCharCode(parseInt(h, 16))
  );
}

// Kunci pencocokan longgar (samakan dengan tv-deeplink.js): huruf/angka saja.
function kunciCocok(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

// Alias kata kunci per penyakit alur agar mudah ditemukan.
const ALUR_ALIAS = {
  asma: "sesak napas wheezing mengi bronkospasme serangan asma nebulisasi salbutamol",
  "kejang-demam": "kejang step konvulsi status epileptikus bangkitan diazepam demam",
  dbd: "demam berdarah dengue dhf syok dengue trombosit hematokrit grup a b c ns1",
  hipoglikemia: "gula darah rendah hipo hipoglikemi dekstrosa d10 glukagon glukosa oral diabetes melitus dm insulin",
  kad: "ketoasidosis diabetik diabetikum dka asidosis keton ketonemia hiperglikemia insulin bikarbonat kalium resusitasi cairan diabetes melitus dm",
};

function extractPhrases(html) {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  s = s.replace(/<br\s*\/?>(?=)/gi, "\n");
  s = s.replace(/<\/(h1|h2|h3|h4|h5|p|li|button|label|div|option|td|th|a|span|strong|em|summary)>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = decode(s);
  const seen = new Set();
  const out = [];
  for (let line of s.split("\n")) {
    line = line.replace(/\s+/g, " ").trim();
    if (line.length < 3 || line.length > 90) continue;
    if (!/[a-zA-Z\u00C0-\u024F]/.test(line)) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
    if (out.length >= 320) break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Ekstraksi frasa dari SUMBER REACT (untuk alat yang islandnya sudah dihapus).
//
// WHY: dulu frasa konten dipanen dari island HTML v17 di public/. Setelah alat
// dimigrasi ke React, HTML-nya dihapus — kalau tidak diganti sumbernya, entri
// pencarian alat tersebut ikut hilang. Fungsi di bawah memanen teks JSX dan
// properti teks manusiawi (label/judul/deskripsi) dari file .ts/.tsx sehingga
// jumlah & kualitas entri tetap setara.
// ---------------------------------------------------------------------------

function listSourceFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === "__tests__" || name === "__fixtures__") continue;
      out.push(...listSourceFiles(p));
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;
    if (/\.(test|spec)\.tsx?$/.test(name) || /\.d\.ts$/.test(name)) continue;
    out.push(p);
  }
  return out;
}

const BUKAN_FRASA = /^(true|false|null|undefined|use client|use server|button|submit|number|string|boolean|none|auto|center|flex|div|span)$/i;

// Potongan yang terlihat seperti kode, bukan kalimat untuk pengguna.
// WHY: literal string juga dipanen dari dalam ekspresi (mis. daftar obat PALS),
// sehingga sisa-sisa sintaks bisa ikut terjaring bila tidak disaring di sini.
function tampakKode(line) {
  if (/[[\]]/.test(line)) return true;
  if (/=>|&&|\|\||\+\+/.test(line)) return true;
  if (/(^|\s)\+(\s|$)/.test(line)) return true;
  if (/\w\(/.test(line)) return true;                 // pemanggilan fungsi
  if (/^[,:;.+)?]/.test(line) || /[,:+(&?]$/.test(line)) return true;
  if (/\b(const|let|return|function|export|import|typeof|await)\b/.test(line)) return true;
  if (/\.(map|filter|push|join|slice|concat|toFixed|key)\b/.test(line)) return true;
  const buka = (line.match(/\(/g) || []).length;
  const tutup = (line.match(/\)/g) || []).length;
  if (buka !== tutup) return true;                    // tanda kurung tidak seimbang
  return false;
}

// Saring kandidat agar hanya kalimat/label yang benar-benar dibaca pengguna.
function frasaLayak(raw) {
  const line = String(raw || "").replace(/\s+/g, " ").trim();
  if (line.length < 3 || line.length > 90) return "";
  if (!/[a-zA-Z\u00C0-\u024F]/.test(line)) return "";
  if (BUKAN_FRASA.test(line)) return "";
  if (/[{}<>$`|=\\]/.test(line)) return "";        // ekspresi/JSX/template
  if (/^[#./]/.test(line) || /^https?:/i.test(line)) return ""; // selector/path/URL
  if (/_/.test(line)) return "";                    // KONSTANTA_SNAKE / kelas internal
  if (/^[a-z0-9-]+$/.test(line)) return "";         // slug / nama kelas css
  if (/^[a-z]+([A-Z][a-zA-Z0-9]*)+$/.test(line)) return ""; // camelCase identifier
  if (/\d\s*(px|rem|em|vh|vw|deg)\b/.test(line)) return "";  // nilai styling
  if (/^[\d\s.,%+-]+$/.test(line)) return "";       // angka murni
  if (/#[0-9a-fA-F]{3,8}\b/.test(line)) return "";  // kode warna
  if (/sans-serif|system-ui|monospace|cubic-bezier|rgba?\(|var\(--|\bsvg\b/i.test(line)) return "";
  // Frasa untuk pengguna selalu punya huruf kapital atau karakter non-ASCII
  // (emoji/simbol medis). Tanpa itu hampir pasti nama kelas atau utility CSS
  // seperti "tv-card tv-stack" atau "flex items-center".
  if (!/[A-Z\u00C0-\u024F]/.test(line) && !/[^\x00-\x7F]/.test(line)) return "";
  if (tampakKode(line)) return "";
  return line;
}

// Teks JSX boleh melintasi baris (mis. <label>\n  Kelompok Usia\n</label>),
// jadi hasil tangkapan dipecah per baris sebelum disaring.
const POLA_TEKS_JSX = />([^<>{}]+)</g;
const POLA_PROP_GANDA =
  /(?:label|text|nama|judul|title|desc|deskripsi|ringkas|keterangan|placeholder|aria-label)\s*[:=]\s*"([^"\\]+)"/g;
const POLA_PROP_TUNGGAL =
  /(?:label|text|nama|judul|title|desc|deskripsi|ringkas|keterangan)\s*:\s*'([^'\\]+)'/g;
// Literal string umum: menangkap teks di dalam ekspresi/array data, mis.
// useState("Salin Kronologi") atau hint pada daftar penilaian PAT.
// Wajib mengandung spasi supaya identifier & slug tidak ikut terjaring.
// Hanya tanda kutip ganda: apostrof pada teks Indonesia bikin pasangan kutip
// tunggal meleset dan menggeser seluruh hasil tangkapan berikutnya.
const POLA_STRING_UMUM = /"([^"\\\n]*\s[^"\\\n]*)"/g;

function extractPhrasesFromSource(dirs) {
  const seen = new Set();
  const out = [];
  for (const rel of dirs) {
    for (const file of listSourceFiles(join(SRC, ...rel.split("/")))) {
      const s = readFileSync(file, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/.*$/gm, " ");
      const kandidat = [];
      for (const m of s.matchAll(POLA_TEKS_JSX)) {
        for (const baris of String(m[1]).split("\n")) kandidat.push(baris);
      }
      for (const m of s.matchAll(POLA_PROP_GANDA)) kandidat.push(m[1]);
      for (const m of s.matchAll(POLA_PROP_TUNGGAL)) kandidat.push(m[1]);
      for (const m of s.matchAll(POLA_STRING_UMUM)) kandidat.push(m[1]);
      for (const c of kandidat) {
        const line = frasaLayak(decode(c));
        if (!line) continue;
        const key = line.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(line);
        if (out.length >= 320) return out;
      }
    }
  }
  return out;
}

const entries = [];

// 1) Alat utama: entri menu + konten (dengan anchor text: untuk deep-link).
//    Sumber frasa = island HTML (belum migrasi) ATAU sumber React (sudah migrasi).
for (const t of TOOLS) {
  entries.push({ type: "menu", slug: t.slug, label: t.label, icon: t.icon, href: t.href, text: t.label, keywords: t.keywords.join(" ") });

  let phrases = [];
  if (t.file) {
    let html = "";
    try {
      html = readFileSync(join(PUBLIC, t.file), "utf8");
    } catch {
      // WHY berisik: island yang hilang dulu ditelan diam-diam, sehingga alat
      // yang sudah dimigrasi ke React tetap menunjuk berkas HTML yang sudah
      // dihapus dan kehilangan SELURUH entri kontennya tanpa peringatan.
      // Bila ini muncul, ubah entri alat tersebut dari `file` menjadi `srcDirs`.
      console.warn("island tidak ditemukan untuk alat:", t.slug, "->", t.file, "(entri konten kosong)");
      html = "";
    }
    if (html) phrases = extractPhrases(html);
    else if (!phrases.length) console.warn("frasa island kosong untuk alat:", t.slug);
  } else if (t.srcDirs) {
    phrases = extractPhrasesFromSource(t.srcDirs);
    if (!phrases.length) console.warn("frasa React kosong untuk alat:", t.slug);
  }

  for (const p of phrases) {
    entries.push({ type: "content", slug: t.slug, label: t.label, icon: t.icon, href: t.href, text: p, anchor: "text:" + p.slice(0, 70) });
  }
  if (t.srcDirs) console.log(`frasa React ${t.slug}:`, phrases.length);
}

// 2) Nama obat (Dosis Obat) dari scripts/obat.json -> deep-link ke kartu obat.
try {
  const obat = JSON.parse(readFileSync(join(__dirname, "obat.json"), "utf8"));
  for (const o of obat) {
    const nama = String(o.nama || "").trim();
    if (!nama) continue;
    const core = nama.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim() || nama;
    const kw = [o.jenis, o.indikasi, o.id, "obat", "dosis"].filter(Boolean).join(" ").slice(0, 200);
    entries.push({
      type: "content",
      slug: "dosis",
      label: "Dosis Obat",
      icon: "\uD83D\uDC8A",
      href: "/preview/dosing",
      text: nama + (o.jenis ? " \u00B7 " + o.jenis : ""),
      keywords: kw,
      anchor: "text:" + core,
    });
  }
} catch (e) {
  console.warn("obat.json tidak terbaca:", e.message);
}

// 3) Skoring klinis (React) dari data.ts -> deep-link ke kartu skor.
try {
  const dts = readFileSync(join(SRC, "features", "clinical-scores", "data.ts"), "utf8");
  const re = /id:\s*"([^"]+)"[\s\S]{0,400}?nama:\s*"([^"]+)"(?:[\s\S]{0,300}?ringkas:\s*"([^"]+)")?/g;
  let m;
  const idSkor = new Set(["cds","croup","pas","downes","pass","kawasaki","centor","tbanak"]);
  while ((m = re.exec(dts))) {
    const id = m[1];
    if (!idSkor.has(id)) continue;
    const nama = m[2];
    const ringkas = (m[3] || "").replace(/\\u[0-9a-fA-F]{4}/g, " ");
    entries.push({
      type: "content",
      slug: "skoring",
      label: "Skoring Klinis",
      icon: "\uD83E\uDDEE",
      href: "/preview/skoring",
      text: nama,
      keywords: ["skor", "skoring", "scoring", "kriteria", ringkas].filter(Boolean).join(" "),
      anchor: "id:skor-" + id,
    });
  }
} catch (e) {
  console.warn("data.ts skoring tidak terbaca:", e.message);
}

// 3b) Guideline/protokol dari data.ts di features/guideline-tool.
try {
  const gts = readFileSync(join(SRC, "features", "guideline-tool", "data.ts"), "utf8");
  const re = /title:\s*"([^"]+)"[\s\S]{0,300}?category:\s*"([^"]+)"[\s\S]{0,300}?year:\s*"([^"]+)"[\s\S]{0,300}?source:\s*"([^"]+)"[\s\S]{0,300}?description:\s*"([^"]+)"/g;
  let m;
  let n = 0;
  while ((m = re.exec(gts))) {
    const title = m[1];
    const category = m[2];
    const year = m[3];
    const source = m[4];
    const description = m[5];
    const kw = [title, category, source, year, description, "guideline", "protokol", "panduan", "pedoman"]
      .filter(Boolean)
      .join(" ")
      .slice(0, 300);
    entries.push({
      type: "content",
      slug: "protokol",
      label: "Guideline",
      icon: "\uD83E\uDE7A",
      href: "/preview/guideline",
      text: title + (category ? " \u00B7 " + category : ""),
      keywords: kw,
      anchor: "text:" + title,
    });
    n += 1;
  }
  console.log("guideline diindeks:", n);
} catch (e) {
  console.warn("data.ts guideline tidak terbaca:", e.message);
}

// 3c) Alur Tata Laksana (React) dari daftar.ts -> deep-link buka penyakit.
try {
  const dsrc = readFileSync(join(SRC, "shared", "lib", "alur", "daftar.ts"), "utf8");
  const blok = dsrc.match(/DAFTAR_KONDISI[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (blok) {
    const parts = blok[1].split(/\bid:\s*"/).slice(1);
    let n = 0;
    for (const part of parts) {
      const id = (part.match(/^([^"]+)"/) || [])[1];
      if (!id) continue;
      const nama = (part.match(/nama:\s*"([^"]+)"/) || [])[1] || "";
      const ikon = decodeUnicodeEscapes((part.match(/ikon:\s*"([^"]+)"/) || [])[1] || "");
      const ringkas = decodeUnicodeEscapes((part.match(/ringkas:\s*"([^"]+)"/) || [])[1] || "");
      const kategori = (part.match(/kategori:\s*"([^"]+)"/) || [])[1] || "";
      const tersedia = /tersedia:\s*true/.test(part);
      if (!nama || !tersedia) continue;
      const kw = [nama, kategori, ringkas, ALUR_ALIAS[id] || "", "alur", "tata laksana", "tatalaksana", "algoritma", "protokol", "penanganan"]
        .filter(Boolean)
        .join(" ")
        .slice(0, 300);
      entries.push({
        type: "content",
        slug: "alur",
        label: "Alur Tata Laksana",
        icon: ikon || "\uD83E\uDDED",
        href: "/preview/alur",
        text: nama,
        keywords: kw,
        anchor: "alur:" + id,
      });
      n += 1;
    }
    console.log("alur diindeks:", n);
  } else {
    console.warn("DAFTAR_KONDISI tidak ditemukan di daftar.ts");
  }
} catch (e) {
  console.warn("daftar.ts alur tidak terbaca:", e.message);
}

// 3d) Materi vaksin (Jadwal Imunisasi) dari VACCINES di entities/immunization.
//     Sumber sebelumnya adalah array VAKSIN di public/imunisasi-tool.html; island
//     itu sudah digantikan panel React, dan data ini adalah port 1:1-nya.
try {
  const vsrc = readFileSync(join(SRC, "entities", "immunization", "data", "vaccines.ts"), "utf8");
  const re = /id:\s*"([^"]+)"[\s\S]{0,200}?nama:\s*"([^"]+)"[\s\S]{0,200}?mencegah:\s*"([^"]+)"/g;
  const cocok = [...vsrc.matchAll(re)];
  if (cocok.length) {
    let n = 0;
    for (const m of cocok) {
      const nama = String(m[2] || "").replace(/\s+/g, " ").trim();
      const cegah = String(m[3] || "").replace(/\s+/g, " ").trim();
      if (!nama) continue;
      // Anchor tetap memakai kunci dari NAMA (bukan id) agar skema deep-link
      // "vaksin:<kunci>" identik dengan indeks lama & cocok dengan VaccineCatalog.
      const slug = kunciCocok(nama);
      if (!slug) continue;
      const kw = [nama, cegah, "imunisasi", "vaksin", "vaksinasi", "jadwal", "idai"]
        .filter(Boolean)
        .join(" ")
        .slice(0, 300);
      entries.push({
        type: "content",
        slug: "imunisasi",
        label: "Jadwal Imunisasi",
        icon: "\uD83D\uDCC5",
        href: "/preview/imunisasi",
        text: nama + (cegah ? " \u00B7 mencegah " + cegah : ""),
        keywords: kw,
        anchor: "vaksin:" + slug,
      });
      n += 1;
    }
    console.log("vaksin diindeks:", n);
  } else {
    console.warn("VACCINES tidak ditemukan di entities/immunization/data/vaccines.ts");
  }
} catch (e) {
  console.warn("vaccines.ts tidak terbaca:", e.message);
}

// 4) Modul-modul fitur spesifik
for (const fm of FEATURE_MODULES) {
  entries.push(fm);
}

// 5) Menu tambahan.
for (const m of EXTRA_MENUS) {
  entries.push({ type: "menu", slug: m.slug, label: m.label, icon: m.icon, href: m.href, text: m.label, keywords: m.keywords.join(" ") });
}

const payload = { generatedAt: new Date().toISOString(), count: entries.length, entries };
writeFileSync(join(PUBLIC, "search-index.json"), JSON.stringify(payload));
const byType = entries.reduce((a, e) => ((a[e.type] = (a[e.type] || 0) + 1), a), {});
console.log(`search-index.json ditulis: ${entries.length} entri`, byType);
