// Generator indeks pencarian global Tinyverse (pure Node, tanpa dependency).
// Membaca tiap island HTML di public/, data obat (scripts/obat.json), dan
// katalog skoring (src/features/clinical-scores/data.ts), lalu menulis
// public/search-index.json. Setiap entri konten menyimpan "anchor" agar saat
// diklik, alat bisa auto-scroll & membuka bagian tepatnya (lihat tv-deeplink.js).
// Jalankan dari folder apps/web:  node scripts/build-search-index.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const SRC = join(__dirname, "..", "src");

// Peta island -> menu/route + kata kunci/alias (bahasa Indonesia + istilah medis).
const TOOLS = [
  { file: "darurat-tool.html", slug: "darurat", label: "Mode Darurat", icon: "\uD83D\uDEA8", href: "/preview/darurat",
    keywords: ["gcs","glasgow","pat","pediatric assessment triangle","pals","resusitasi","henti jantung","rjp","cpr","kejang","syok","triase","kegawatan","emergency","gawat darurat","epinefrin","defibrilasi","kardioversi"] },
  { file: "cairan-tool.html", slug: "cairan", label: "Terapi Cairan", icon: "\uD83D\uDCA7", href: "/preview/fluids",
    keywords: ["dehidrasi","rumatan","maintenance","holliday","segar","resusitasi cairan","bolus","kristaloid","rehidrasi","defisit","tetesan","infus","cairan"] },
  { file: "dosis-tool.html", slug: "dosis", label: "Dosis Obat", icon: "\uD83D\uDC8A", href: "/preview/dosing",
    keywords: ["dosis obat","antibiotik","paracetamol","mg/kg","obat","kalkulator dosis","sediaan","dosing"] },
  { file: "puyer-tool.html", slug: "puyer", label: "Racik Puyer", icon: "\u2697\uFE0F", href: "/preview/puyer",
    keywords: ["racik","puyer","pulveres","bagi","tablet","kapsul","racikan","serbuk"] },
  { file: "growth-tool.html", slug: "tumbuh-kembang", label: "Tumbuh Kembang", icon: "\uD83D\uDCC8", href: "/preview/pertumbuhan",
    keywords: ["pertumbuhan","tinggi badan","berat badan","who","cdc","z-score","persentil","stunting","mph","mid parental height","kurva","grafik","tumbuh kembang"] },
  { file: "lab-tool.html", slug: "lab", label: "Interpretasi Lab", icon: "\uD83D\uDD2C", href: "/preview/lab",
    keywords: ["natrium","kalium","elektrolit","agd","analisa gas darah","ph","hb","hemoglobin","leukosit","trombosit","darah","interpretasi lab","asidosis","alkalosis"] },
  { file: "nutrisi-tool.html", slug: "nutrisi", label: "Kalkulator Nutrisi", icon: "\uD83C\uDF4E", href: "/preview/nutrisi",
    keywords: ["kalori","protein","kebutuhan energi","susu formula","mpasi","gizi","holliday","rda","takaran susu","sendok takar","nutrisi"] },
  { file: "guideline-tool.html", slug: "protokol", label: "Guideline", icon: "\uD83E\uDE7A", href: "/preview/guideline",
    keywords: ["guideline","protokol","panduan","pedoman","who","idai","referensi","pdf"] },
];

// Menu tambahan (tanpa island / halaman placeholder) agar tetap bisa ditemukan.
const EXTRA_MENUS = [
  { slug: "beranda", label: "Beranda", icon: "\uD83C\uDFE0", href: "/", keywords: ["home","utama","dashboard"] },
  { slug: "skoring", label: "Skoring Klinis", icon: "\uD83E\uDDEE", href: "/preview/skoring", keywords: ["skor","skoring","scoring","kriteria","penilaian klinis"] },
  { slug: "imunisasi", label: "Jadwal Imunisasi", icon: "\uD83D\uDCC5", href: "/preview/imunisasi", keywords: ["imunisasi","vaksin","vaksinasi","jadwal","idai"] },
  { slug: "ringkasan", label: "Ringkasan Klinis", icon: "\uD83D\uDCC4", href: "/preview/ringkasan", keywords: ["ringkasan","resume","catatan","dokumentasi"] },
];

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", deg: "\u00B0", times: "\u00D7", plusmn: "\u00B1", micro: "\u00B5", mu: "\u03BC", ge: "\u2265", le: "\u2264", rarr: "\u2192", larr: "\u2190", ndash: "\u2013", mdash: "\u2014", hellip: "\u2026", trade: "\u2122", copy: "\u00A9", eacute: "\u00E9" };

function decode(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return " "; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return " "; } })
    .replace(/&([a-zA-Z]+);/g, (m, n) => (n in ENTITIES ? ENTITIES[n] : " "));
}

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

const entries = [];

// 1) Island tools: entri menu + konten (dengan anchor text: untuk deep-link).
for (const t of TOOLS) {
  entries.push({ type: "menu", slug: t.slug, label: t.label, icon: t.icon, href: t.href, text: t.label, keywords: t.keywords.join(" ") });
  let html = "";
  try { html = readFileSync(join(PUBLIC, t.file), "utf8"); } catch { html = ""; }
  const phrases = extractPhrases(html);
  for (const p of phrases) {
    entries.push({ type: "content", slug: t.slug, label: t.label, icon: t.icon, href: t.href, text: p, anchor: "text:" + p.slice(0, 70) });
  }
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

// 3b) Guideline/protokol dari TV_GUIDELINE_LIST di guideline-tool.html.
// Datanya berada di dalam <script> (dibuang oleh extractPhrases), sehingga
// diparse khusus agar tiap penyakit (pneumonia, kejang demam, alergi susu
// sapi, dll.) bisa ditemukan lewat judul & tags. Anchor "text:<judul>" membuat
// tv-deeplink.js menyorot kartu <h3> yang cocok di dalam island.
try {
  const gl = readFileSync(join(PUBLIC, "guideline-tool.html"), "utf8");
  const blok = gl.match(/TV_GUIDELINE_LIST\s*=\s*\[([\s\S]*?)\n\s*\];/);
  if (blok) {
    const parts = blok[1].split(/id:\s*'/).slice(1);
    let n = 0;
    for (const part of parts) {
      const pick = (re) => {
        const m = part.match(re);
        return m ? m[1] : "";
      };
      const title = pick(/title:\s*'([^']+)'/);
      if (!title) continue;
      const category = pick(/category:\s*'([^']+)'/);
      const source = pick(/source:\s*'([^']+)'/);
      const year = pick(/year:\s*'([^']+)'/);
      const description = pick(/description:\s*'([^']+)'/);
      const tagsRaw = pick(/tags:\s*\[([^\]]*)\]/);
      const tags = (tagsRaw.match(/'[^']+'/g) || []).map((s) => s.slice(1, -1));
      const kw = [title, category, source, year, description, ...tags, "guideline", "protokol", "panduan", "pedoman"]
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
  } else {
    console.warn("TV_GUIDELINE_LIST tidak ditemukan di guideline-tool.html");
  }
} catch (e) {
  console.warn("guideline-tool.html tidak terbaca:", e.message);
}

// 4) Menu tambahan.
for (const m of EXTRA_MENUS) {
  entries.push({ type: "menu", slug: m.slug, label: m.label, icon: m.icon, href: m.href, text: m.label, keywords: m.keywords.join(" ") });
}

const payload = { generatedAt: new Date().toISOString(), count: entries.length, entries };
writeFileSync(join(PUBLIC, "search-index.json"), JSON.stringify(payload));
const byType = entries.reduce((a, e) => ((a[e.type] = (a[e.type] || 0) + 1), a), {});
console.log(`search-index.json ditulis: ${entries.length} entri`, byType);
