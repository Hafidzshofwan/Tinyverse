import type { ReactNode } from "react";

export interface SediaanOption {
  label?: string;
  bentuk?: "sirup" | "suspensi" | "tetes" | "tablet" | "kapsul" | "kaplet" | string;
  sediaanMg?: number;
  sediaanMl?: number;
  kekuatanMg?: number;
}

export interface AgeBand {
  usiaMinBulan: number;
  usiaMaxBulan: number;
  tipe: "flat" | "perKg" | string;
  labelUsia?: string;
  dosisMinPerKg?: number;
  dosisMaxPerKg?: number;
  dosisFlatMin?: number;
  dosisFlatMax?: number;
  dosisMaksimalTunggalMg?: number;
  dosisMaksimalHarianMg?: number;
  maxDosesPerDay?: number;
  dosesPerDay?: number;
  doseBasis?: "perDose" | "perDay" | "singleDose" | "perEpisode" | string;
  frekuensi?: string;
  catatan?: string;
  sediaanMg?: number;
  sediaanMl?: number;
  sediaanLabel?: string;
  unitLabel?: string;
}

export interface Obat {
  id: string;
  nama: string;
  jenis?: string;
  icon?: string;
  doseType: "flat" | "perKg" | "perKgVolume" | "byAge" | "ageBands" | string;
  doseBasis?: "perDose" | "perDay" | "singleDose" | "perEpisode" | string;
  satuanDosis?: string;
  unitLabel?: string;

  dosisMinPerKg?: number;
  dosisMaxPerKg?: number;
  volumeMinPerKg?: number;
  volumeMaxPerKg?: number;
  dosisFlatMin?: number;
  dosisFlatMax?: number;
  ambangUsiaBulan?: number;
  dosisDibawahAmbangMg?: number;
  dosisDiatasAmbangMg?: number;
  usiaMinValidBulan?: number;
  usiaMaxValidBulan?: number;
  catatanDibawahAmbang?: string;
  catatanDiatasAmbang?: string;
  maxDosesPerDay?: number;
  dosesPerDay?: number;
  dosisMaksimalTunggalMg?: number;
  dosisMaksimalHarianMg?: number;
  dosisMaksimalHarianPerKg?: number;
  sediaanMg?: number;
  sediaanMl?: number;
  sediaanIU?: number;
  sediaanCustomText?: string;
  frekuensi?: string;
  indikasi?: string;
  catatan?: string;
  varian?: string;
  kelasAlergi?: string[];
  interaksiTags?: string[];
  kontraindikasi?: string[];
  peringatan?: string[];
  keselamatanVersi?: string;
  keselamatanCatatan?: string;
  bisaDipuyer?: boolean;
  puyerSediaanMg?: number;
  puyer?: {
    mode: "mgkg" | "mgkali" | string;
    dosis: number;
    sediaan: number;
    alias: string[];
    catatan: string;
  };

  bands?: AgeBand[];
  sediaanOptions?: SediaanOption[];
}

export const PETA_JENIS_OBAT: Record<string, string> = {
  "Ambroxol": "Mukolitik & Ekspektoran",
  "Asetilsistein": "Mukolitik & Ekspektoran",
  "Albendazole (Flat)": "Anthelmintik",
  "Albendazole (per kg)": "Anthelmintik",
  "Pyrantel Pamoate": "Anthelmintik",
  "Mebendazole": "Anthelmintik",
  "Ivermectin": "Anthelmintik",
  "Amoxicillin": "Antibiotik",
  "Azithromycin": "Antibiotik",
  "Cefixime": "Antibiotik",
  "Co-Amoxiclav": "Antibiotik",
  "Cotrimoxazole": "Antibiotik",
  "Eritromisin": "Antibiotik",
  "Metronidazole": "Antibiotik",
  "Asiklovir": "Antivirus",
  "Oseltamivir": "Antivirus",
  "Cetirizine": "Antihistamin",
  "Chlorpheniramine Maleate (CTM)": "Antihistamin",
  "Loratadine": "Antihistamin",
  "Dexamethasone": "Kortikosteroid",
  "Prednisolone": "Kortikosteroid",
  "Prednison": "Kortikosteroid",
  "Domperidone": "Antiemetik",
  "Ondansetron": "Antiemetik",
  "Metoclopramide": "Antiemetik",
  "Ketoconazole": "Antijamur",
  "Nystatin": "Antijamur",
  "Ibuprofen": "Antipiretik & Analgesik",
  "Paracetamol": "Antipiretik & Analgesik",
  "Oral Rehydration Salt (ORS)": "Rehidrasi / Cairan & Elektrolit",
  "Salbutamol": "Bronkodilator",
  "Vitamin A": "Vitamin & Suplemen",
  "Vitamin D": "Vitamin & Suplemen",
  "Zat Besi": "Vitamin & Suplemen",
  "Zinc": "Vitamin & Suplemen"
};

export const WARNA_JENIS_OBAT: Record<string, string> = {
  "Mukolitik & Ekspektoran": "#54C6EB",
  "Anthelmintik": "#7DBE8C",
  "Antibiotik": "#FF85A1",
  "Antivirus": "#A385FF",
  "Antihistamin": "#FFD666",
  "Kortikosteroid": "#FF6B6B",
  "Antiemetik": "#FF9F43",
  "Antijamur": "#54A0FF",
  "Antipiretik & Analgesik": "#EE5253",
  "Rehidrasi / Cairan & Elektrolit": "#48DBFB",
  "Bronkodilator": "#1DD1A1",
  "Vitamin & Suplemen": "#FCA5A5",
  "Lainnya": "#9AA4B0"
};

const WARNA_DEFAULT = "#999999";

export function warnaJenis(jenis?: string): string {
  if (!jenis) return WARNA_JENIS_OBAT["Lainnya"] ?? WARNA_DEFAULT;
  return WARNA_JENIS_OBAT[jenis] || WARNA_JENIS_OBAT["Lainnya"] || WARNA_DEFAULT;
}

export function kategoriTagStyle(jenis?: string): { bg: string; color: string } {
  if (!jenis) return { bg: "#F1F5F9", color: "#475569" };
  const lower = jenis.toLowerCase();
  if (lower.includes("anthelmintik")) {
    return { bg: "#F7EFE5", color: "#8C6A4B" };
  }
  if (lower.includes("tuberkulosis")) {
    return { bg: "#FDF4E7", color: "#9A3412" };
  }
  if (lower.includes("mukolitik") || lower.includes("bronkodilator") || lower.includes("ekspektoran")) {
    return { bg: "#E0F2FE", color: "#0284C7" };
  }
  if (lower.includes("antibiotik")) {
    return { bg: "#DCFCE7", color: "#16A34A" };
  }
  if (lower.includes("vitamin") || lower.includes("suplemen")) {
    return { bg: "#FEF9C3", color: "#A16207" };
  }
  if (lower.includes("antivirus") || lower.includes("antikonvulsan")) {
    return { bg: "#F3E8FF", color: "#7E22CE" };
  }
  if (lower.includes("antipiretik") || lower.includes("antiemetik") || lower.includes("analgesik")) {
    return { bg: "#FFE4E6", color: "#BE123C" };
  }
  if (lower.includes("antihistamin") || lower.includes("rehidrasi")) {
    return { bg: "#CFFAFE", color: "#0891B2" };
  }
  if (lower.includes("kortikosteroid")) {
    return { bg: "#FEF3C7", color: "#D97706" };
  }
  if (lower.includes("antijamur")) {
    return { bg: "#CCFBF1", color: "#0D9488" };
  }
  if (lower.includes("cerna")) {
    return { bg: "#E0F2FE", color: "#1D4ED8" };
  }
  return { bg: "#F1F5F9", color: "#475569" };
}

export function pilihSediaanAktif(
  obat: Obat,
  indexInput?: string | number
): SediaanOption | null {
  if (!Array.isArray(obat.sediaanOptions) || obat.sediaanOptions.length === 0) {
    return null;
  }
  const idx =
    typeof indexInput === "number"
      ? indexInput
      : parseInt(String(indexInput || "0"), 10);
  if (!isNaN(idx) && idx >= 0 && idx < obat.sediaanOptions.length) {
    return obat.sediaanOptions[idx];
  }
  return obat.sediaanOptions[0];
}


export function labelDosisObat(obat: Obat): string {
  if (Array.isArray(obat.sediaanOptions) && obat.sediaanOptions.length > 1) return "Pilih sediaan";
  return obat.doseType === "flat"
    ? `${obat.dosisFlatMin}${obat.dosisFlatMax !== obat.dosisFlatMin ? "-" + obat.dosisFlatMax : ""} ${obat.unitLabel || "mg"}`
    : obat.doseType === "perKgVolume"
      ? `${obat.volumeMinPerKg}-${obat.volumeMaxPerKg} ${obat.unitLabel}`
      : obat.doseType === "byAge"
        ? `${obat.dosisDibawahAmbangMg}/${obat.dosisDiatasAmbangMg} ${obat.unitLabel}`
        : obat.doseType === "ageBands"
          ? "Sesuai usia"
          : `${obat.dosisMinPerKg}-${obat.dosisMaxPerKg} ${obat.unitLabel}`;
}

export const OBAT_LIST: Obat[] = [
  {
    id: "albendazole",
    nama: "Albendazole (Flat)",
    jenis: "Anthelmintik",
    icon: "🪱",
    doseType: "flat",
    doseBasis: "perDay",
    dosisFlatMin: 400,
    dosisFlatMax: 400,
    satuanDosis: "mg",
    unitLabel: "mg/hari",
    maxDosesPerDay: 1,
    dosesPerDay: 1,
    dosisMaksimalHarianMg: 800,
    frekuensi: "1× sehari selama 3–5 hari (CLM); untuk STH umumnya dosis tunggal",
    indikasi: "Cutaneous larva migrans (CLM)/creeping eruption; juga obat cacing spektrum luas untuk STH (askariasis, cacing tambang, trichuriasis, enterobiasis).",
    sediaanCustomText: "Tablet kunyah/tablet 400 mg; beberapa produk tersedia suspensi 200 mg/5 mL. Dapat dikunyah/dihancurkan sesuai sediaan.",
    catatan: "CLM (Perdoski 2024): albendazol 400 mg per oral, dapat sebagai dosis tunggal atau 400 mg/hari selama 3–5 hari. Untuk anak tersedia alternatif berbasis berat 10–15 mg/kg/hari (maks 800 mg/hari) pada kartu 'Albendazole (per kg)'. Anak 12–23 bulan pada program STH memakai 200 mg.",
    kelasAlergi: ["benzimidazol"],
    interaksiTags: ["hepatotoksik-dosis-tinggi"],
    kontraindikasi: ["Kehamilan (trimester 1)", "Hipersensitivitas benzimidazol"],
    peringatan: ["Hati-hati usia <2 tahun (data terbatas)", "Pantau fungsi hati pada terapi lama/dosis tinggi"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 400,
    puyer: { mode: "mgkali", dosis: 400, sediaan: 400, alias: ["albendazol"], catatan: "Dosis tetap 400 mg; tablet 400 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Tablet kunyah 400 mg", bentuk: "tablet", kekuatanMg: 400 },
      { label: "Suspensi 200 mg/5 mL", bentuk: "suspensi", sediaanMg: 200, sediaanMl: 5 }
    ]
  },
  {
    id: "ambroxol",
    sediaanMl: 5,
    nama: "Ambroxol",
    dosesPerDay: 3,
    frekuensi: "dibagi 3 kali sehari",
    dosisMaxPerKg: 2,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosisMaksimalHarianMg: 45,
    sediaanMg: 15,
    dosisMinPerKg: 1,
    doseBasis: "perDay",
    icon: "💧",
    jenis: "Mukolitik & Ekspektoran",
    catatan: "Dosis pada kalkulator dihitung sebagai total harian lalu dibagi 3 kali pemberian. Maksimum otomatis konservatif: 45 mg/hari; verifikasi sesuai usia dan produk.",
    kelasAlergi: ["ambroxol"],
    interaksiTags: [],
    kontraindikasi: ["Tidak dianjurkan pada anak <2 tahun (restriksi mukolitik)", "Hipersensitivitas"],
    peringatan: ["Hati-hati ulkus peptikum", "Laporan reaksi kulit berat (jarang)"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 30,
    puyer: { mode: "mgkali", dosis: 7.5, sediaan: 30, alias: ["ambroksol"], catatan: "Contoh manual mg/kali." },
    sediaanOptions: [
      { label: "Sirup 15 mg/5 mL", bentuk: "sirup", sediaanMg: 15, sediaanMl: 5 },
      { label: "Sirup forte 30 mg/5 mL", bentuk: "sirup", sediaanMg: 30, sediaanMl: 5 },
      { label: "Tablet 30 mg", bentuk: "tablet", kekuatanMg: 30 }
    ]
  },
  {
    id: "amoxicillin",
    frekuensi: "dibagi 3 kali sehari",
    dosesPerDay: 3,
    nama: "Amoxicillin",
    sediaanMl: 5,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosisMaxPerKg: 50,
    sediaanMg: 250,
    dosisMaksimalHarianMg: 2000,
    catatan: "Dosis dihitung sebagai total harian berdasarkan komponen amoxicillin, lalu dibagi 3 kali pemberian. Dosis dapat berbeda sesuai indikasi/berat infeksi.",
    jenis: "Antibiotik",
    doseBasis: "perDay",
    icon: "🦠",
    dosisMinPerKg: 25,
    kelasAlergi: ["penisilin", "beta-laktam"],
    interaksiTags: [],
    kontraindikasi: ["Alergi penisilin/beta-laktam"],
    peringatan: ["Ruam pada infeksi mononukleosis (EBV)", "Sesuaikan pada gangguan ginjal berat"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 500,
    puyer: { mode: "mgkg", dosis: 15, sediaan: 500, alias: ["amoksisilin", "amox", "amoxicilin"], catatan: "Contoh awal; sesuaikan indikasi dan regimen." },
    sediaanOptions: [
      { label: "Sirup kering 125 mg/5 mL", bentuk: "sirup", sediaanMg: 125, sediaanMl: 5 },
      { label: "Sirup kering 250 mg/5 mL", bentuk: "sirup", sediaanMg: 250, sediaanMl: 5 },
      { label: "Drops 100 mg/mL", bentuk: "tetes", sediaanMg: 100, sediaanMl: 1 },
      { label: "Kapsul 250 mg", bentuk: "kapsul", kekuatanMg: 250 },
      { label: "Kaplet 500 mg", bentuk: "kaplet", kekuatanMg: 500 }
    ]
  },
  {
    id: "asetilsistein",
    indikasi: "Mukolitik untuk membantu mengencerkan dahak pada batuk berdahak.",
    sediaanCustomText: "Granul/sachet 100 mg pediatric dan granul/kapsul/tablet 200 mg; larutkan/berikan sesuai petunjuk produk.",
    nama: "Asetilsistein",
    frekuensi: "2–4 kali sehari sesuai usia dan produk",
    bands: [
      { frekuensi: "100 mg, 2–4 kali sehari", labelUsia: "2–5 tahun", tipe: "flat", dosisFlatMax: 100, usiaMinBulan: 24, catatan: "Gunakan sediaan pediatric 100 mg; sesuaikan frekuensi dengan usia, berat gejala, dan instruksi dokter.", dosisFlatMin: 100, maxDosesPerDay: 4, doseBasis: "perDose", usiaMaxBulan: 71 },
      { tipe: "flat", labelUsia: "≥6 tahun – remaja", frekuensi: "200 mg, 2–3 kali sehari", dosisFlatMax: 200, catatan: "Batas lazim mukolitik oral total sekitar 600 mg/hari pada anak besar/dewasa; sesuaikan dengan produk.", usiaMinBulan: 72, doseBasis: "perDose", maxDosesPerDay: 3, usiaMaxBulan: 216, dosisFlatMin: 200 }
    ],
    icon: "🫧",
    doseBasis: "perDose",
    jenis: "Mukolitik & Ekspektoran",
    unitLabel: "mg/kali",
    doseType: "ageBands",
    catatan: "Dosis dihitung untuk indikasi mukolitik. Hindari penggunaan rutin pada anak <2 tahun kecuali atas instruksi dokter.",
    kelasAlergi: ["asetilsistein"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Hati-hati asma (risiko bronkospasme)", "Hati-hati ulkus peptikum"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 200,
    puyer: { mode: "mgkali", dosis: 100, sediaan: 200, alias: ["acetylcysteine", "asetil"], catatan: "±100 mg/kali (anak); granul 100/200 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Sachet/granul 100 mg (pediatrik)", bentuk: "tablet", kekuatanMg: 100 },
      { label: "Dry syrup 100 mg/5 mL", bentuk: "sirup", sediaanMg: 100, sediaanMl: 5 },
      { label: "Sachet/granul 200 mg", bentuk: "tablet", kekuatanMg: 200 },
      { label: "Kapsul 200 mg", bentuk: "kapsul", kekuatanMg: 200 }
    ]
  },
  {
    id: "asiklovir",
    sediaanMl: 10,
    nama: "Asiklovir",
    frekuensi: "5 kali sehari tiap ±4 jam saat terjaga, selama 5–10 hari",
    dosisMaxPerKg: 15,
    doseType: "perKg",
    unitLabel: "mg/kg/kali",
    dosisMaksimalTunggalMg: 800,
    dosisMaksimalHarianMg: 4000,
    sediaanMg: 200,
    dosisMinPerKg: 10,
    maxDosesPerDay: 5,
    doseBasis: "perDose",
    icon: "🧬",
    jenis: "Antivirus",
    catatan: "Dosis dihitung per kali pemberian. Maksimum otomatis 800 mg/kali; indikasi tertentu dapat memerlukan regimen berbeda.",
    kelasAlergi: ["asiklovir"],
    interaksiTags: ["nefrotoksik"],
    kontraindikasi: ["Hipersensitivitas asiklovir/valasiklovir"],
    peringatan: ["Jaga hidrasi cukup (risiko kristaluria)", "Sesuaikan dosis pada gangguan ginjal"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 400,
    puyer: { mode: "mgkg", dosis: 10, sediaan: 200, alias: ["acyclovir", "asiklovir"], catatan: "±10 mg/kg/kali; tablet 200 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Sirup 200 mg/5 mL", bentuk: "sirup", sediaanMg: 200, sediaanMl: 5 },
      { label: "Tablet 200 mg", bentuk: "tablet", kekuatanMg: 200 },
      { label: "Tablet 400 mg", bentuk: "tablet", kekuatanMg: 400 },
      { label: "Tablet 800 mg", bentuk: "tablet", kekuatanMg: 800 }
    ]
  },
  {
    id: "azithromycin",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari",
    nama: "Azithromycin",
    sediaanMl: 5,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosisMaxPerKg: 10,
    sediaanMg: 200,
    dosisMaksimalHarianMg: 500,
    catatan: "Dosis dihitung sebagai total harian. Regimen 10 mg/kg hari pertama lalu 5 mg/kg/hari hari berikutnya dapat dipakai sesuai indikasi.",
    jenis: "Antibiotik",
    doseBasis: "perDay",
    icon: "🫁",
    dosisMinPerKg: 5,
    kelasAlergi: ["makrolida"],
    interaksiTags: ["qt", "makrolida"],
    kontraindikasi: ["Alergi makrolida", "Riwayat penyakit hati/kolestasis akibat makrolida"],
    peringatan: ["Hati-hati sindrom QT panjang / obat pemanjang QT"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 250,
    puyer: { mode: "mgkg", dosis: 10, sediaan: 250, alias: ["azitromisin", "azitro"], catatan: "10 mg/kg/hari 1×; tablet 250/500 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Sirup kering 200 mg/5 mL", bentuk: "sirup", sediaanMg: 200, sediaanMl: 5 },
      { label: "Tablet 250 mg", bentuk: "tablet", kekuatanMg: 250 },
      { label: "Tablet 500 mg", bentuk: "tablet", kekuatanMg: 500 }
    ]
  },
  {
    id: "cefixime",
    dosisMaxPerKg: 8,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari atau dibagi 2 kali sehari",
    sediaanMl: 5,
    nama: "Cefixime",
    jenis: "Antibiotik",
    catatan: "Dosis dihitung sebagai total harian; bila dipilih 2 kali sehari, bagi total harian menjadi 2 pemberian.",
    dosisMinPerKg: 8,
    doseBasis: "perDay",
    icon: "💊",
    dosisMaksimalHarianMg: 400,
    sediaanMg: 100,
    kelasAlergi: ["sefalosporin", "beta-laktam"],
    interaksiTags: [],
    kontraindikasi: ["Alergi sefalosporin", "Hati-hati alergi penisilin berat (reaksi silang)"],
    peringatan: ["Sesuaikan pada gangguan ginjal berat"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 100,
    puyer: { mode: "mgkg", dosis: 4, sediaan: 100, alias: ["sefiksim", "cefixim"], catatan: "Contoh awal; verifikasi dosis sesuai indikasi." },
    sediaanOptions: [
      { label: "Sirup kering 100 mg/5 mL", bentuk: "sirup", sediaanMg: 100, sediaanMl: 5 },
      { label: "Kapsul 100 mg", bentuk: "kapsul", kekuatanMg: 100 },
      { label: "Kapsul 200 mg", bentuk: "kapsul", kekuatanMg: 200 }
    ]
  },
  {
    id: "cetirizine",
    dosisMaxPerKg: 0.25,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    sediaanMl: 5,
    nama: "Cetirizine",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari",
    dosisMinPerKg: 0.2,
    doseBasis: "perDay",
    icon: "🌼",
    jenis: "Antihistamin",
    catatan: "Dosis dihitung sebagai dosis harian. Maksimum otomatis 10 mg/hari; pada praktik sering memakai dosis berbasis usia.",
    dosisMaksimalHarianMg: 10,
    sediaanMg: 5,
    kelasAlergi: ["antihistamin"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas cetirizine/hidroksizin"],
    peringatan: ["Dapat menyebabkan kantuk", "Sesuaikan pada gangguan ginjal"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 10,
    puyer: { mode: "mgkali", dosis: 5, sediaan: 10, alias: ["setirizin", "cetirizin"], catatan: "Sesuaikan usia/BB." },
    sediaanOptions: [
      { label: "Sirup 5 mg/5 mL", bentuk: "sirup", sediaanMg: 5, sediaanMl: 5 },
      { label: "Drops 10 mg/mL", bentuk: "tetes", sediaanMg: 10, sediaanMl: 1 },
      { label: "Tablet 10 mg", bentuk: "tablet", kekuatanMg: 10 }
    ]
  },
  {
    id: "chlorpheniramine-maleate-ctm",
    sediaanMl: 5,
    nama: "Chlorpheniramine Maleate (CTM)",
    frekuensi: "setiap 4–6 jam bila perlu",
    bands: [
      { maxDosesPerDay: 6, doseBasis: "perDose", usiaMaxBulan: 24, dosisMinPerKg: 0.1, catatan: "0,1 mg/kgBB per kali dosis. Dosis maksimal untuk usia <2 tahun: 2 mg per kali.", dosisMaxPerKg: 0.1, usiaMinBulan: 0, dosisMaksimalTunggalMg: 2, tipe: "perKg", labelUsia: "< 2 tahun", frekuensi: "setiap 4–6 jam", dosisMaksimalHarianMg: 12 },
      { dosisFlatMax: 1, tipe: "flat", labelUsia: "2–5 tahun", frekuensi: "setiap 4–6 jam", dosisMaksimalHarianMg: 6, maxDosesPerDay: 6, doseBasis: "perDose", usiaMaxBulan: 60, dosisFlatMin: 1, catatan: "Dosis maksimal harian: 6 mg/hari.", usiaMinBulan: 24 },
      { usiaMaxBulan: 144, maxDosesPerDay: 6, doseBasis: "perDose", dosisFlatMin: 2, catatan: "Dosis maksimal harian: 12 mg/hari.", usiaMinBulan: 60, dosisFlatMax: 2, labelUsia: "6–12 tahun", tipe: "flat", frekuensi: "setiap 4–6 jam", dosisMaksimalHarianMg: 12 },
      { catatan: "Dosis maksimal harian: 24 mg/hari.", usiaMinBulan: 144, doseBasis: "perDose", maxDosesPerDay: 6, usiaMaxBulan: 216, dosisFlatMin: 4, labelUsia: "≥ 12 tahun", tipe: "flat", frekuensi: "setiap 4–6 jam", dosisMaksimalHarianMg: 24, dosisFlatMax: 4 }
    ],
    sediaanMg: 2,
    doseBasis: "perDose",
    icon: "🤧💤",
    jenis: "Antihistamin",
    catatan: "Antihistamin generasi pertama (sedatif). Dosis dan plafon maksimal berbeda di setiap kelompok usia — kalkulator otomatis menyesuaikan berdasarkan usia yang diinput.",
    doseType: "ageBands",
    unitLabel: "mg/kg atau mg (sesuai usia)",
    kelasAlergi: ["antihistamin"],
    interaksiTags: ["ssp-depresan", "antikolinergik"],
    kontraindikasi: ["Neonatus & bayi <2 tahun (risiko sedasi/apnea)", "Glaukoma sudut sempit", "Retensi urin/obstruksi"],
    peringatan: ["Efek antikolinergik & sedasi", "Hindari kombinasi depresan SSP lain"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 4,
    puyer: { mode: "mgkali", dosis: 1, sediaan: 4, alias: ["ctm", "chlorpheniramine", "klorfeniramin", "chlorpheniramin"], catatan: "Contoh manual mg/kali." },
    sediaanOptions: [
      { label: "Sirup 2 mg/5 mL", bentuk: "sirup", sediaanMg: 2, sediaanMl: 5 },
      { label: "Tablet 4 mg", bentuk: "tablet", kekuatanMg: 4 }
    ]
  },
  {
    id: "co-amoxiclav",
    dosisMaxPerKg: 50,
    unitLabel: "mg/kg/hari",
    doseType: "perKg",
    dosesPerDay: 2,
    frekuensi: "dibagi 2 kali sehari",
    sediaanMl: 5,
    nama: "Co-Amoxiclav",
    jenis: "Antibiotik",
    catatan: "Dosis dihitung sebagai total harian berdasarkan komponen amoxicillin, lalu dibagi 2 kali pemberian. Perhatikan rasio clavulanate pada produk.",
    dosisMinPerKg: 25,
    icon: "🛡️",
    doseBasis: "perDay",
    dosisMaksimalHarianMg: 2000,
    sediaanMg: 156,
    kelasAlergi: ["penisilin", "beta-laktam"],
    interaksiTags: ["hepatotoksik-dosis-tinggi"],
    kontraindikasi: ["Alergi penisilin/beta-laktam", "Riwayat jaundice/disfungsi hati akibat co-amoxiclav"],
    peringatan: ["Batasi komponen klavulanat (~10 mg/kg/hari)", "Diare terkait antibiotik"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkg", dosis: 12.5, sediaan: 156, alias: ["coamoxiclav", "augmentin"], catatan: "Berdasarkan komponen amoksisilin; verifikasi rasio sediaan." },
    sediaanOptions: [
      { label: "Sirup 125 mg/5 mL (amoksisilin)", bentuk: "sirup", sediaanMg: 125, sediaanMl: 5 },
      { label: "Sirup 250 mg/5 mL (amoksisilin)", bentuk: "sirup", sediaanMg: 250, sediaanMl: 5 },
      { label: "Tablet 375 mg (amoksisilin 250 mg)", bentuk: "tablet", kekuatanMg: 250 },
      { label: "Kaplet 625 mg (amoksisilin 500 mg)", bentuk: "kaplet", kekuatanMg: 500 }
    ]
  },
  {
    id: "cotrimoxazole",
    sediaanMl: 5,
    nama: "Cotrimoxazole",
    frekuensi: "2 kali sehari",
    dosisMaxPerKg: 6,
    unitLabel: "mg TMP/kg/kali",
    doseType: "perKg",
    dosisMaksimalTunggalMg: 160,
    dosisMaksimalHarianMg: 320,
    sediaanMg: 200,
    dosisMinPerKg: 4,
    icon: "🦠⚔️",
    maxDosesPerDay: 2,
    doseBasis: "perDose",
    jenis: "Antibiotik",
    catatan: "Dosis dihitung berdasarkan komponen trimethoprim (TMP) per kali pemberian. Maksimum otomatis 160 mg TMP/kali.",
    kelasAlergi: ["sulfonamida", "sulfa"],
    interaksiTags: [],
    kontraindikasi: ["Alergi sulfonamida", "Bayi <2 bulan (risiko kernikterus)", "Defisiensi G6PD (risiko hemolisis)", "Gangguan hati/ginjal berat"],
    peringatan: ["Risiko reaksi kulit berat (SJS/TEN)", "Jaga hidrasi"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 480,
    puyer: { mode: "mgkg", dosis: 5, sediaan: 480, alias: ["kotrimoksazol", "trimetoprim", "cotrimoxazol"], catatan: "Dosis = trimetoprim 4–6 mg/kg/kali; tablet 480 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Suspensi 240 mg/5 mL (TMP 40 mg)", bentuk: "sirup", sediaanMg: 40, sediaanMl: 5 },
      { label: "Tablet 480 mg (TMP 80 mg)", bentuk: "tablet", kekuatanMg: 80 },
      { label: "Tablet forte 960 mg (TMP 160 mg)", bentuk: "tablet", kekuatanMg: 160 }
    ]
  },
  {
    id: "dexamethasone",
    nama: "Dexamethasone",
    sediaanMl: 0.5,
    frekuensi: "dosis tunggal; dapat diulang sesuai instruksi dokter",
    doseType: "perKg",
    unitLabel: "mg/kg/kali",
    dosisMaxPerKg: 0.6,
    dosisMaksimalTunggalMg: 16,
    sediaanMg: 5,
    maxDosesPerDay: 1,
    doseBasis: "singleDose",
    icon: "🔥💊",
    dosisMinPerKg: 0.15,
    catatan: "Dosis dihitung per kali pemberian/dosis tunggal. Bukan regimen rutin 3x sehari. Maksimum otomatis 16 mg/kali.",
    jenis: "Kortikosteroid",
    kelasAlergi: ["kortikosteroid"],
    interaksiTags: ["kortikosteroid", "gastro-erosif", "imunosupresan"],
    kontraindikasi: ["Infeksi jamur sistemik", "Hipersensitivitas"],
    peringatan: ["Hindari vaksin hidup", "Kombinasi NSAID meningkatkan risiko GI", "Jangan hentikan mendadak pada pemakaian lama"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 0.5,
    puyer: { mode: "mgkg", dosis: 0.15, sediaan: 0.5, alias: ["deksametason", "dexa"], catatan: "Contoh awal; verifikasi regimen." },
    sediaanOptions: [
      { label: "Tablet 0,5 mg", bentuk: "tablet", kekuatanMg: 0.5 },
      { label: "Tablet 0,75 mg", bentuk: "tablet", kekuatanMg: 0.75 },
      { label: "Sirup/eliksir 0,5 mg/5 mL", bentuk: "sirup", sediaanMg: 0.5, sediaanMl: 5 },
      { label: "Injeksi 5 mg/mL", bentuk: "sirup", sediaanMg: 5, sediaanMl: 1 }
    ]
  },
  {
    id: "domperidone",
    jenis: "Antiemetik",
    catatan: "Dosis dihitung per kali pemberian. Maksimum otomatis 10 mg/kali dan 30 mg/hari. Perhatikan kontraindikasi dan risiko gangguan irama jantung.",
    dosisMinPerKg: 0.2,
    icon: "🚫🤮",
    doseBasis: "perDose",
    maxDosesPerDay: 3,
    dosisMaksimalHarianMg: 30,
    sediaanMg: 5,
    dosisMaksimalTunggalMg: 10,
    dosisMaxPerKg: 0.4,
    unitLabel: "mg/kg/kali",
    doseType: "perKg",
    frekuensi: "3 kali sehari sebelum makan",
    sediaanMl: 5,
    nama: "Domperidone",
    kelasAlergi: ["domperidone"],
    interaksiTags: ["qt"],
    kontraindikasi: ["Gangguan konduksi jantung / QT panjang", "Gangguan hati sedang-berat", "Umumnya dihindari pada BB <35 kg / anak kecil", "Obstruksi/perdarahan GI"],
    peringatan: ["Gunakan dosis efektif terendah, durasi sesingkat mungkin"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 10,
    puyer: { mode: "mgkg", dosis: 0.25, sediaan: 10, alias: ["domperidon"], catatan: "Perhatikan kehati-hatian penggunaan." },
    sediaanOptions: [
      { label: "Sirup 5 mg/5 mL", bentuk: "sirup", sediaanMg: 5, sediaanMl: 5 },
      { label: "Drops 5 mg/mL", bentuk: "tetes", sediaanMg: 5, sediaanMl: 1 },
      { label: "Tablet 10 mg", bentuk: "tablet", kekuatanMg: 10 }
    ]
  },
  {
    id: "eritromisin",
    dosisMinPerKg: 40,
    icon: "🛡️",
    doseBasis: "perDay",
    jenis: "Antibiotik",
    catatan: "Dosis dihitung sebagai total harian, lalu dibagi sesuai frekuensi.",
    dosisMaksimalHarianMg: 2000,
    sediaanMg: 200,
    dosisMaxPerKg: 50,
    unitLabel: "mg/kg/hari",
    doseType: "perKg",
    sediaanMl: 5,
    nama: "Eritromisin",
    dosesPerDay: 4,
    frekuensi: "dibagi dalam 3–4 dosis per hari",
    kelasAlergi: ["makrolida"],
    interaksiTags: ["qt", "cyp3a4-inhibitor", "makrolida"],
    kontraindikasi: ["Alergi makrolida", "Penyakit hati", "Bersamaan obat substrat CYP3A4 berisiko toksik"],
    peringatan: ["Risiko stenosis pilorus hipertrofik (IHPS) pada bayi", "Penghambat CYP3A4 kuat"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 500,
    puyer: { mode: "mgkg", dosis: 12.5, sediaan: 250, alias: ["erythromycin", "eritromicin"], catatan: "40–50 mg/kg/hari terbagi; tablet 250/500 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Sirup kering 125 mg/5 mL", bentuk: "sirup", sediaanMg: 125, sediaanMl: 5 },
      { label: "Sirup kering 200 mg/5 mL", bentuk: "sirup", sediaanMg: 200, sediaanMl: 5 },
      { label: "Tablet/Kapsul 250 mg", bentuk: "tablet", kekuatanMg: 250 },
      { label: "Tablet 500 mg", bentuk: "tablet", kekuatanMg: 500 }
    ]
  },
  {
    id: "ibuprofen",
    dosisMaxPerKg: 10,
    unitLabel: "mg/kg/kali",
    doseType: "perKg",
    frekuensi: "tiap 6–8 jam bila perlu; maksimal 4 kali sehari",
    sediaanMl: 5,
    nama: "Ibuprofen",
    jenis: "Antipiretik & Analgesik",
    catatan: "Dosis dihitung per kali pemberian. Maksimum otomatis 400 mg/kali dan tidak melebihi 40 mg/kgBB/hari.",
    dosisMinPerKg: 5,
    icon: "🧴",
    maxDosesPerDay: 4,
    doseBasis: "perDose",
    dosisMaksimalHarianMg: 1200,
    sediaanMg: 100,
    dosisMaksimalTunggalMg: 400,
    dosisMaksimalHarianPerKg: 40,
    kelasAlergi: ["nsaid", "ibuprofen"],
    interaksiTags: ["nsaid", "nefrotoksik", "gastro-erosif"],
    kontraindikasi: ["Usia <6 bulan", "Dehidrasi/hipovolemia atau gangguan ginjal", "Ulkus/perdarahan saluran cerna aktif", "Asma yang dipicu NSAID", "Kecurigaan dengue/perdarahan"],
    peringatan: ["Berikan bersama makanan", "Hindari kombinasi kortikosteroid/NSAID lain"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 200,
    puyer: { mode: "mgkg", dosis: 5, sediaan: 200, alias: ["ibu"], catatan: "Contoh umum: 5 mg/kg/kali; perhatikan kontraindikasi." },
    sediaanOptions: [
      { label: "Sirup 100 mg/5 mL", bentuk: "sirup", sediaanMg: 100, sediaanMl: 5 },
      { label: "Sirup forte 200 mg/5 mL", bentuk: "sirup", sediaanMg: 200, sediaanMl: 5 },
      { label: "Drops 40 mg/mL", bentuk: "tetes", sediaanMg: 40, sediaanMl: 1 },
      { label: "Tablet 200 mg", bentuk: "tablet", kekuatanMg: 200 },
      { label: "Tablet 400 mg", bentuk: "tablet", kekuatanMg: 400 }
    ]
  },
  {
    id: "ketoconazole",
    frekuensi: "1 kali sehari",
    dosesPerDay: 1,
    nama: "Ketoconazole",
    sediaanMl: 5,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosisMaxPerKg: 6,
    sediaanMg: 200,
    dosisMaksimalHarianMg: 400,
    catatan: "Dosis dihitung sebagai total harian. Perhatikan risiko hepatotoksisitas; penggunaan sistemik perlu indikasi dan pemantauan dokter. Sediaan oral di Indonesia umumnya tablet 200 mg (bukan sirup).",
    jenis: "Antijamur",
    doseBasis: "perDay",
    icon: "🍄🛑",
    dosisMinPerKg: 3,
    kelasAlergi: ["azol"],
    interaksiTags: ["qt", "cyp3a4-inhibitor", "hepatotoksik"],
    kontraindikasi: ["Penyakit hati akut/kronik", "Ketokonazol ORAL sistemik tidak dianjurkan (hepatotoksisitas serius) - pertimbangkan alternatif/topikal", "Bersamaan obat pemanjang QT / substrat CYP3A4 sensitif"],
    peringatan: ["Pantau fungsi hati bila tetap digunakan"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 200,
    puyer: { mode: "mgkg", dosis: 5, sediaan: 200, alias: ["ketokonazol"], catatan: "3–6 mg/kg/hari; tablet 200 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Tablet 200 mg", bentuk: "tablet", kekuatanMg: 200 }
    ]
  },
  {
    id: "loratadine",
    dosisMaxPerKg: 0.2,
    unitLabel: "mg/kg/hari",
    doseType: "perKg",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari",
    sediaanMl: 5,
    nama: "Loratadine",
    jenis: "Antihistamin",
    catatan: "Dosis dihitung sebagai dosis harian. Maksimum otomatis 10 mg/hari; praktik umum sering memakai dosis berbasis usia/berat.",
    dosisMinPerKg: 0.1,
    icon: "🤧",
    doseBasis: "perDay",
    dosisMaksimalHarianMg: 10,
    sediaanMg: 5,
    kelasAlergi: ["antihistamin"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Sesuaikan pada gangguan hati"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 10,
    puyer: { mode: "mgkali", dosis: 5, sediaan: 10, alias: ["loratadin"], catatan: "Sesuaikan usia/BB." },
    sediaanOptions: [
      { label: "Sirup 5 mg/5 mL", bentuk: "sirup", sediaanMg: 5, sediaanMl: 5 },
      { label: "Tablet 10 mg", bentuk: "tablet", kekuatanMg: 10 }
    ]
  },
  {
    id: "mebendazole",
    icon: "🪱💊",
    doseBasis: "perDose",
    jenis: "Anthelmintik",
    unitLabel: "mg/kali",
    doseType: "ageBands",
    catatan: "Regimen umum: cacing kremi 100 mg dosis tunggal dan ulang setelah ±2 minggu bila perlu; cacing gelang/tambang/cambuk dapat 100 mg 2 kali sehari selama 3 hari. WHO juga merekomendasikan mebendazole 500 mg dosis tunggal untuk deworming preventif di daerah endemis. Kalkulator ini memakai regimen 100 mg/kali agar cocok untuk cacing kremi dan regimen 3 hari; sesuaikan regimen dengan diagnosis.",
    indikasi: "Obat cacing untuk enterobiasis/cacing kremi, askariasis/cacing gelang, cacing tambang, dan trichuriasis/cacing cambuk. Cocok dipakai bila diagnosis/dugaan klinis sesuai dan tersedia di Indonesia.",
    sediaanCustomText: "Tablet kunyah 100 mg atau 500 mg tergantung produk. Untuk regimen 500 mg dosis tunggal, gunakan sediaan 500 mg bila tersedia dan sesuai instruksi dokter/program.",
    nama: "Mebendazole",
    frekuensi: "tergantung jenis cacing",
    bands: [
      { dosisFlatMax: 100, frekuensi: "cacing kremi: dosis tunggal; cacing gelang/tambang/cambuk: 2 kali sehari selama 3 hari", labelUsia: "≥2 tahun – remaja", tipe: "flat", dosisFlatMin: 100, usiaMaxBulan: 216, maxDosesPerDay: 2, doseBasis: "perDose", usiaMinBulan: 24, catatan: "Untuk cacing kremi, terapi anggota serumah dan pengulangan dosis sering diperlukan. Untuk STH selain kremi, gunakan 100 mg 2 kali sehari selama 3 hari atau regimen program sesuai kebijakan." }
    ],
    kelasAlergi: ["benzimidazol"],
    interaksiTags: [],
    kontraindikasi: ["Kehamilan (trimester 1)", "Hipersensitivitas benzimidazol"],
    peringatan: ["Hati-hati usia <2 tahun (data terbatas)"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 500,
    puyer: { mode: "mgkali", dosis: 100, sediaan: 100, alias: ["mebendazol"], catatan: "100 mg 2×/hari 3 hari, atau 500 mg dosis tunggal; tablet kunyah 100/500 mg." },
    sediaanOptions: [
      { label: "Tablet kunyah 100 mg", bentuk: "tablet", kekuatanMg: 100 },
      { label: "Tablet 500 mg", bentuk: "tablet", kekuatanMg: 500 }
    ]
  },
  {
    id: "metronidazole",
    jenis: "Antibiotik",
    catatan: "Dosis dihitung per kali pemberian. Maksimum otomatis 500 mg/kali; regimen dapat berbeda sesuai indikasi.",
    dosisMinPerKg: 7.5,
    maxDosesPerDay: 3,
    doseBasis: "perDose",
    icon: "🦠🛑",
    dosisMaksimalHarianMg: 1500,
    sediaanMg: 200,
    dosisMaksimalTunggalMg: 500,
    dosisMaxPerKg: 10,
    doseType: "perKg",
    unitLabel: "mg/kg/kali",
    frekuensi: "3 kali sehari",
    sediaanMl: 5,
    nama: "Metronidazole",
    kelasAlergi: ["nitroimidazol", "metronidazole"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas nitroimidazol", "Trimester 1 kehamilan (hati-hati)"],
    peringatan: ["Hindari alkohol (reaksi disulfiram)", "Efek SSP/neuropati pada pemakaian lama"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 250,
    puyer: { mode: "mgkg", dosis: 7.5, sediaan: 200, alias: ["metronidazol"], catatan: "7,5 mg/kg/kali; tablet 200/500 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Suspensi 125 mg/5 mL", bentuk: "sirup", sediaanMg: 125, sediaanMl: 5 },
      { label: "Tablet 250 mg", bentuk: "tablet", kekuatanMg: 250 },
      { label: "Tablet 500 mg", bentuk: "tablet", kekuatanMg: 500 }
    ]
  },
  {
    id: "nystatin",
    sediaanIU: 100000,
    unitLabel: "IU/kali",
    doseType: "flat",
    satuanDosis: "IU",
    nama: "Nystatin",
    sediaanMl: 1,
    frekuensi: "4 kali sehari",
    icon: "🍄",
    doseBasis: "perDose",
    dosisFlatMin: 100000,
    catatan: "Satuan dalam IU, bukan mg. Dosis dihitung per kali pemberian. Umumnya suspensi 100.000 IU/mL; oles/pertahankan di mulut sebelum ditelan bila untuk kandidiasis oral.",
    jenis: "Antijamur",
    dosisFlatMax: 100000,
    dosisMaksimalTunggalMg: 100000,
    kelasAlergi: ["nystatin"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Kerja lokal, absorpsi minimal"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkali", dosis: 100000, sediaan: 500000, alias: ["nistatin"], catatan: "Satuan IU; umumnya drop/suspensi oral — TIDAK lazim dipuyer. Verifikasi." },
    sediaanOptions: [
      { label: "Suspensi/Drops 100.000 IU/mL", bentuk: "sirup", sediaanMg: 100000, sediaanMl: 1 }
    ]
  },
  {
    id: "ondansetron",
    jenis: "Antiemetik",
    catatan: "Dosis dihitung per kali pemberian. Gastroenteritis akut biasanya cukup dosis tunggal. Maksimum otomatis 8 mg/kali.",
    dosisMinPerKg: 0.1,
    icon: "🤢",
    maxDosesPerDay: 3,
    doseBasis: "perDose",
    dosisMaksimalHarianMg: 24,
    sediaanMg: 4,
    dosisMaksimalTunggalMg: 8,
    dosisMaxPerKg: 0.15,
    unitLabel: "mg/kg/kali",
    doseType: "perKg",
    frekuensi: "bila perlu tiap 8 jam",
    sediaanMl: 5,
    nama: "Ondansetron",
    kelasAlergi: ["ondansetron"],
    interaksiTags: ["qt", "serotonergik"],
    kontraindikasi: ["Sindrom QT panjang bawaan", "Bersamaan apomorfin"],
    peringatan: ["Hati-hati obat pemanjang QT & gangguan elektrolit"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 4,
    puyer: { mode: "mgkg", dosis: 0.15, sediaan: 4, alias: ["ondansetron"], catatan: "Contoh awal; verifikasi indikasi." },
    sediaanOptions: [
      { label: "Sirup 4 mg/5 mL", bentuk: "sirup", sediaanMg: 4, sediaanMl: 5 },
      { label: "Tablet 4 mg", bentuk: "tablet", kekuatanMg: 4 },
      { label: "Tablet 8 mg", bentuk: "tablet", kekuatanMg: 8 }
    ]
  },
  {
    id: "oral-rehydration-salt-ors",
    volumeMinPerKg: 10,
    nama: "Oral Rehydration Salt (ORS)",
    volumeMaxPerKg: 20,
    frekuensi: "setelah setiap episode diare",
    doseBasis: "perEpisode",
    icon: "💦",
    jenis: "Rehidrasi / Cairan & Elektrolit",
    doseType: "perKgVolume",
    catatan: "Volume dihitung per episode diare/muntah, bukan dosis harian. Sesuaikan dengan derajat dehidrasi dan toleransi minum.",
    unitLabel: "mL/kg/episode",
    kelasAlergi: [],
    interaksiTags: [],
    kontraindikasi: ["Ileus/obstruksi usus", "Muntah hebat tak teratasi / penurunan kesadaran (risiko aspirasi)"],
    peringatan: ["Gunakan formula osmolaritas rendah sesuai WHO"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkali", dosis: 0, sediaan: 0, alias: ["oralit", "ors", "rehidrasi"], catatan: "Cairan rehidrasi — TIDAK dipuyer." },
    sediaanCustomText: "Sachet oralit formula WHO osmolaritas rendah; larutkan 1 sachet dalam 200 mL air matang (ikuti label). Berikan bertahap dengan sendok/cangkir sesuai volume (mL) yang dihitung."
  },
  {
    id: "oseltamivir",
    dosisMaxPerKg: 3,
    unitLabel: "mg/kg/kali",
    doseType: "perKg",
    frekuensi: "2 kali sehari",
    sediaanMl: 5,
    nama: "Oseltamivir",
    jenis: "Antivirus",
    catatan: "Dosis dihitung per kali pemberian. Maksimum otomatis 75 mg/kali. Regimen dapat memakai weight-band sesuai pedoman influenza.",
    dosisMinPerKg: 2,
    icon: "🦠❄️",
    maxDosesPerDay: 2,
    doseBasis: "perDose",
    dosisMaksimalHarianMg: 150,
    sediaanMg: 30,
    dosisMaksimalTunggalMg: 75,
    kelasAlergi: ["oseltamivir"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Sesuaikan dosis pada gangguan ginjal", "Pantau gejala neuropsikiatri"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 75,
    puyer: { mode: "mgkg", dosis: 3, sediaan: 30, alias: ["tamiflu"], catatan: "3 mg/kg/kali 2×/hari; kapsul 30/45/75 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Suspensi 6 mg/mL", bentuk: "sirup", sediaanMg: 6, sediaanMl: 1 },
      { label: "Kapsul 30 mg", bentuk: "kapsul", kekuatanMg: 30 },
      { label: "Kapsul 45 mg", bentuk: "kapsul", kekuatanMg: 45 },
      { label: "Kapsul 75 mg", bentuk: "kapsul", kekuatanMg: 75 }
    ]
  },
  {
    id: "paracetamol",
    dosisMinPerKg: 10,
    doseBasis: "perDose",
    maxDosesPerDay: 5,
    icon: "🌡️",
    jenis: "Antipiretik & Analgesik",
    catatan: "Dosis dihitung per kali pemberian. Maksimum 75 mg/kgBB/hari dan jangan lebih dari 5 kali pemberian per 24 jam. Pilih konsentrasi sirup agar hasil mL tepat.",
    dosisMaksimalTunggalMg: 1000,
    dosisMaksimalHarianPerKg: 75,
    dosisMaksimalHarianMg: 4000,
    sediaanMg: 120,
    sediaanMl: 5,
    dosisMaxPerKg: 15,
    doseType: "perKg",
    unitLabel: "mg/kg/kali",
    nama: "Paracetamol",
    frekuensi: "tiap 4–6 jam bila perlu; maksimal 5 kali sehari",
    kelasAlergi: ["paracetamol"],
    interaksiTags: ["hepatotoksik-dosis-tinggi"],
    kontraindikasi: ["Penyakit hati berat", "Hipersensitivitas"],
    peringatan: ["Perhatikan total dosis harian dari semua sumber", "Maks 75 mg/kg/hari & 4000 mg/hari"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 500,
    puyer: { mode: "mgkg", dosis: 10, sediaan: 500, alias: ["parasetamol", "pct", "pamol"], catatan: "Contoh umum: 10 mg/kg/kali; sesuaikan pedoman." },
    sediaanOptions: [
      { label: "Drops 100 mg/mL", bentuk: "tetes", sediaanMg: 100, sediaanMl: 1 },
      { label: "Sirup 120 mg/5 mL", bentuk: "sirup", sediaanMg: 120, sediaanMl: 5 },
      { label: "Sirup 160 mg/5 mL", bentuk: "sirup", sediaanMg: 160, sediaanMl: 5 },
      { label: "Sirup forte 250 mg/5 mL", bentuk: "sirup", sediaanMg: 250, sediaanMl: 5 },
      { label: "Tablet 500 mg", bentuk: "tablet", kekuatanMg: 500 }
    ]
  },
  {
    id: "prednisolone",
    jenis: "Kortikosteroid",
    catatan: "Dosis dihitung sebagai total harian. Maksimum otomatis 60 mg/hari untuk banyak regimen eksaserbasi asma; indikasi lain dapat berbeda.",
    dosisMinPerKg: 1,
    doseBasis: "perDay",
    icon: "🫁🔥",
    dosisMaksimalHarianMg: 60,
    sediaanMg: 15,
    dosisMaxPerKg: 2,
    doseType: "perKg",
    unitLabel: "mg/kg/hari",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari atau dibagi 2 dosis sesuai instruksi dokter",
    sediaanMl: 5,
    nama: "Prednisolone",
    kelasAlergi: ["kortikosteroid"],
    interaksiTags: ["kortikosteroid", "gastro-erosif", "imunosupresan"],
    kontraindikasi: ["Infeksi jamur sistemik", "Hipersensitivitas"],
    peringatan: ["Hindari vaksin hidup", "Kombinasi NSAID meningkatkan risiko GI", "Tapering pada pemakaian lama"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 5,
    puyer: { mode: "mgkg", dosis: 1, sediaan: 5, alias: ["prednisolon"], catatan: "1–2 mg/kg/hari; tablet 5 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Sirup 15 mg/5 mL", bentuk: "sirup", sediaanMg: 15, sediaanMl: 5 },
      { label: "Tablet 5 mg", bentuk: "tablet", kekuatanMg: 5 }
    ]
  },
  {
    id: "prednison",
    dosisMinPerKg: 2,
    icon: "🫘",
    doseBasis: "perDay",
    jenis: "Kortikosteroid",
    dosisMaxPerKg: 2,
    unitLabel: "mg/kg/hari",
    doseType: "perKg",
    catatan: "Dosis inisial sindrom nefrotik: 2 mg/kgBB/hari, selama 2 minggu, dilanjutkan tapering sesuai protokol yang berlaku di fasilitas. Tidak tersedia sediaan sirup standar — gunakan sediaan tablet (umumnya tablet 5 mg) sesuai ketersediaan apotek. Dosis dihitung sebagai total harian; maksimum otomatis 60 mg/hari kecuali ada instruksi spesialis.",
    nama: "Prednison",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari (pagi hari) selama 2 minggu fase inisial",
    dosisMaksimalHarianMg: 60,
    kelasAlergi: ["kortikosteroid"],
    interaksiTags: ["kortikosteroid", "gastro-erosif", "imunosupresan"],
    kontraindikasi: ["Infeksi jamur sistemik", "Hipersensitivitas"],
    peringatan: ["Hindari vaksin hidup", "Kombinasi NSAID meningkatkan risiko GI", "Tapering pada pemakaian lama"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 5,
    puyer: { mode: "mgkg", dosis: 1, sediaan: 5, alias: ["prednisone"], catatan: "Contoh awal; verifikasi regimen." },
    sediaanOptions: [
      { label: "Tablet 5 mg", bentuk: "tablet", kekuatanMg: 5 }
    ]
  },
  {
    id: "pyrantel-pamoate",
    catatan: "CLM/cacingan (Perdoski 2024): pirantel pamoat 10 mg/kg sebagai dosis tunggal, maksimum 1 gram. Untuk cacing kremi sering diulang setelah ±2 minggu; higiene dan terapi kontak serumah penting.",
    jenis: "Anthelmintik",
    doseBasis: "singleDose",
    maxDosesPerDay: 1,
    icon: "🐛",
    dosisMinPerKg: 10,
    sediaanMg: 125,
    dosisMaksimalTunggalMg: 1000,
    doseType: "perKg",
    unitLabel: "mg/kg dosis tunggal",
    dosisMaxPerKg: 10,
    frekuensi: "dosis tunggal; dapat diulang sesuai jenis cacing/instruksi dokter",
    nama: "Pyrantel Pamoate",
    indikasi: "Enterobiasis/cacing kremi, askariasis/cacing gelang, dan cacing tambang; di Indonesia juga tercantum sebagai pilihan pada cutaneous larva migrans (CLM)/creeping eruption.",
    sediaanMl: 5,
    kelasAlergi: ["pirantel"],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Hati-hati gangguan hati", "Antagonis dengan piperazin"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 125,
    puyer: { mode: "mgkg", dosis: 10, sediaan: 125, alias: ["pirantel", "pyrantel"], catatan: "10 mg/kg dosis tunggal; umumnya suspensi. Verifikasi bila dipuyer." },
    sediaanOptions: [
      { label: "Suspensi 125 mg/5 mL", bentuk: "suspensi", sediaanMg: 125, sediaanMl: 5 },
      { label: "Suspensi 250 mg/5 mL", bentuk: "suspensi", sediaanMg: 250, sediaanMl: 5 },
      { label: "Tablet 125 mg", bentuk: "tablet", kekuatanMg: 125 },
      { label: "Tablet 250 mg", bentuk: "tablet", kekuatanMg: 250 }
    ]
  },
  {
    id: "salbutamol",
    icon: "🫁💨",
    maxDosesPerDay: 4,
    doseBasis: "perDose",
    dosisMinPerKg: 0.1,
    catatan: "Dosis oral dihitung per kali pemberian. Maksimum otomatis 4 mg/kali. Untuk asma akut, rute inhalasi umumnya lebih disarankan; perhatikan tremor dan takikardia.",
    jenis: "Bronkodilator",
    dosisMaksimalTunggalMg: 4,
    sediaanMg: 2,
    dosisMaksimalHarianMg: 16,
    unitLabel: "mg/kg/kali",
    doseType: "perKg",
    dosisMaxPerKg: 0.2,
    nama: "Salbutamol",
    sediaanMl: 5,
    frekuensi: "3–4 kali sehari",
    kelasAlergi: ["salbutamol"],
    interaksiTags: [],
    kontraindikasi: ["Takiaritmia", "Hipersensitivitas"],
    peringatan: ["Dapat menyebabkan takikardia/tremor/hipokalemia", "Rute inhalasi lebih dipilih daripada oral"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 2,
    puyer: { mode: "mgkali", dosis: 1, sediaan: 2, alias: ["salbu"], catatan: "Contoh manual; verifikasi dosis dan indikasi." },
    sediaanOptions: [
      { label: "Sirup 2 mg/5 mL", bentuk: "sirup", sediaanMg: 2, sediaanMl: 5 },
      { label: "Tablet 2 mg", bentuk: "tablet", kekuatanMg: 2 },
      { label: "Tablet 4 mg", bentuk: "tablet", kekuatanMg: 4 }
    ]
  },
  {
    id: "vitamin-a",
    frekuensi: "Dosis tunggal tiap 4–6 bulan sesuai program/sasaran",
    catatanDibawahAmbang: "Usia 6–11 bulan: Kapsul Biru, dosis 100.000 IU.",
    usiaMinValidBulan: 6,
    satuanDosis: "IU",
    nama: "Vitamin A",
    catatanDiatasAmbang: "Usia 12–59 bulan: Kapsul Merah, dosis 200.000 IU.",
    unitLabel: "IU (sesuai usia)",
    doseType: "byAge",
    ambangUsiaBulan: 12,
    usiaMaxValidBulan: 59,
    dosisMaksimalTunggalMg: 200000,
    sediaanCustomText: "Kapsul Biru (100.000 IU) untuk usia 6–11 bulan; Kapsul Merah (200.000 IU) untuk usia 12–59 bulan. Tidak ada sediaan sirup/tetes — berikan 1 kapsul sesuai kelompok usia.",
    dosisDibawahAmbangMg: 100000,
    jenis: "Vitamin & Suplemen",
    catatan: "Dosis tunggal berdasarkan usia: 6–11 bulan 100.000 IU; 12–59 bulan 200.000 IU. Tidak untuk pemberian harian.",
    dosisDiatasAmbangMg: 200000,
    icon: "🟦🟥",
    doseBasis: "singleDose",
    kelasAlergi: [],
    interaksiTags: [],
    kontraindikasi: ["Hipervitaminosis A", "Kehamilan (dosis tinggi teratogenik)"],
    peringatan: ["Ikuti jadwal dosis WHO sesuai usia"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkali", dosis: 0, sediaan: 0, alias: ["vit a", "vita"], catatan: "Kapsul 100.000/200.000 IU dosis tunggal — TIDAK dipuyer." }
  },
  {
    id: "vitamin-d",
    dosisDiatasAmbangMg: 600,
    icon: "☀️",
    doseBasis: "perDay",
    dosisDibawahAmbangMg: 400,
    jenis: "Vitamin & Suplemen",
    catatan: "Dosis suplementasi rutin harian: <1 tahun 400 IU/hari, ≥1 tahun 600 IU/hari. Kalkulator ini menampilkan dosis suplementasi rutin, bukan terapi defisiensi dosis tinggi.",
    dosisMaksimalHarianMg: 600,
    ambangUsiaBulan: 12,
    unitLabel: "IU/hari",
    doseType: "byAge",
    satuanDosis: "IU",
    nama: "Vitamin D",
    dosesPerDay: 1,
    frekuensi: "1 kali sehari",
    kelasAlergi: [],
    interaksiTags: [],
    kontraindikasi: ["Hiperkalsemia", "Hipervitaminosis D"],
    peringatan: ["Dosis tercantum bersifat PROFILAKSIS; terapi rakhitis butuh dosis lebih tinggi"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkali", dosis: 400, sediaan: 400, alias: ["vit d", "vitd"], catatan: "Satuan IU; umumnya tetes/tablet, tidak lazim dipuyer. Verifikasi." },
    sediaanCustomText: "Tetes/drops 400 IU per tetes (mis. Prove D3, Imedco Kid) atau tablet/kapsul 400 IU & 1000 IU. Berikan sesuai IU target harian; ikuti label produk (satuan IU, bukan mL/tablet baku)."
  },
  {
    id: "zat-besi",
    bands: [
      { tipe: "perKg", labelUsia: "1 bulan – 2 tahun", dosesPerDay: 1, frekuensi: "1 kali sehari, diberikan rutin", doseBasis: "perDay", usiaMaxBulan: 24, dosisMinPerKg: 2, catatan: "2 mg/kgBB/hari untuk bayi cukup bulan; 3 mg/kgBB/hari untuk bayi berat badan lahir rendah (BBLR, <2.500 g).", unitLabel: "mg/kg/hari", dosisMaxPerKg: 3, usiaMinBulan: 1 },
      { catatan: "1 mg/kgBB/hari zat besi elemental, diberikan secara intermiten untuk anak usia 2–5 tahun (balita) dan >5–12 tahun (usia sekolah).", unitLabel: "mg/kg/hari", dosisMaxPerKg: 1, usiaMinBulan: 24, doseBasis: "perDay", usiaMaxBulan: 144, dosisMinPerKg: 1, tipe: "perKg", labelUsia: "2–12 tahun (balita & usia sekolah)", dosesPerDay: 1, frekuensi: "2 kali per minggu, selama 3 bulan berturut-turut setiap tahun" },
      { labelUsia: "12–18 tahun (remaja)", tipe: "flat", frekuensi: "2 kali per minggu, selama 3 bulan berturut-turut setiap tahun", dosesPerDay: 1, dosisMaksimalHarianMg: 60, dosisFlatMax: 60, catatan: "Dosis tetap 60 mg/hari zat besi elemental, tidak dihitung dari berat badan. Khusus remaja perempuan: tambahkan asam folat 400 µg.", usiaMinBulan: 144, usiaMaxBulan: 216, doseBasis: "perDay", dosisFlatMin: 60 }
    ],
    sediaanMg: 15,
    frekuensi: "1 kali sehari",
    sediaanCustomText: "Sirup 15 mg/5 ml; Tetes (Maltofer) 2,5 mg/tetes — sesuaikan dengan sediaan yang tersedia. Untuk dosis tetap 60 mg/hari (remaja 12–18 tahun), pada praktiknya umumnya memakai sediaan tablet.",
    nama: "Zat Besi",
    sediaanMl: 5,
    catatan: "Rekomendasi IDAI untuk suplementasi zat besi rutin pada anak. Dosis, frekuensi, dan cara pemberian berbeda di setiap kelompok usia — kalkulator otomatis menyesuaikan berdasarkan usia yang diinput.",
    doseType: "ageBands",
    unitLabel: "mg/kg atau mg (sesuai usia)",
    jenis: "Vitamin & Suplemen",
    doseBasis: "perDay",
    icon: "🩸",
    kelasAlergi: [],
    interaksiTags: [],
    kontraindikasi: ["Hemokromatosis / kelebihan besi", "Anemia bukan defisiensi besi"],
    peringatan: ["Dosis tercantum umumnya PROFILAKSIS; terapi IDA 3-6 mg/kg/hari", "Absorpsi turun bersama susu/antasida"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    puyer: { mode: "mgkali", dosis: 15, sediaan: 30, alias: ["besi", "iron", "ferrous", "fe"], catatan: "Berdasarkan besi elemental; verifikasi sediaan (tablet/sirup/tetes)." }
  },
  {
    id: "zinc",
    jenis: "Vitamin & Suplemen",
    dosisDibawahAmbangMg: 10,
    catatan: "Diberikan selama 10–14 hari pada diare akut. Maksimum otomatis 20 mg/hari.",
    dosisDiatasAmbangMg: 20,
    doseBasis: "perDay",
    icon: "⚡",
    dosisMaksimalHarianMg: 20,
    sediaanMg: 20,
    doseType: "byAge",
    unitLabel: "mg/hari berdasarkan usia",
    ambangUsiaBulan: 6,
    frekuensi: "1 kali sehari selama 10–14 hari",
    dosesPerDay: 1,
    sediaanMl: 5,
    nama: "Zinc",
    kelasAlergi: [],
    interaksiTags: [],
    kontraindikasi: ["Hipersensitivitas"],
    peringatan: ["Standar diare: 10-14 hari"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 20,
    puyer: { mode: "mgkali", dosis: 20, sediaan: 20, alias: ["zn"], catatan: "Sesuaikan usia dan pedoman diare." },
    sediaanOptions: [
      { label: "Sirup 20 mg/5 mL", bentuk: "sirup", sediaanMg: 20, sediaanMl: 5 },
      { label: "Tablet dispersible 20 mg", bentuk: "tablet", kekuatanMg: 20 },
      { label: "Drops 10 mg/mL", bentuk: "tetes", sediaanMg: 10, sediaanMl: 1 }
    ]
  },
  {
    id: "ivermectin",
    nama: "Ivermectin",
    jenis: "Anthelmintik",
    icon: "🪱",
    doseType: "perKg",
    doseBasis: "perDay",
    dosisMinPerKg: 150,
    dosisMaxPerKg: 200,
    satuanDosis: "mcg",
    unitLabel: "µg/kg/hari",
    maxDosesPerDay: 1,
    dosesPerDay: 1,
    frekuensi: "1× sehari selama 1–2 hari",
    indikasi: "Cutaneous larva migrans (CLM)/creeping eruption — terapi lini pertama.",
    sediaanCustomText: "Tablet 12 mg (atau 3 mg tergantung produk). Tidak tersedia dalam bentuk sirup.",
    catatan: "CLM (Perdoski 2024): ivermectin 200 µg/kg/hari, atau 150 µg/kg untuk pasien anak, selama 1–2 hari. Umumnya tidak rutin diberikan pada anak <15 kg atau <12 bulan; konsultasikan ke dokter.",
    kelasAlergi: ["ivermectin"],
    interaksiTags: [],
    kontraindikasi: ["Berat badan <15 kg", "Kehamilan", "Hipersensitivitas"],
    peringatan: ["Hati-hati ko-infeksi Loa loa (risiko ensefalopati)"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 12,
    puyer: { mode: "mgkg", dosis: 0.2, sediaan: 12, alias: ["ivermectin"], catatan: "200 µg/kg = 0,2 mg/kg; tablet 12 mg. Verifikasi satuan (mg)." }
  },
  {
    id: "albendazole-perkg",
    nama: "Albendazole (per kg)",
    jenis: "Anthelmintik",
    icon: "🪱",
    doseType: "perKg",
    doseBasis: "perDay",
    dosisMinPerKg: 10,
    dosisMaxPerKg: 15,
    satuanDosis: "mg",
    unitLabel: "mg/kg/hari",
    maxDosesPerDay: 1,
    dosesPerDay: 1,
    dosisMaksimalHarianMg: 800,
    frekuensi: "1× sehari selama 3–5 hari",
    indikasi: "Cutaneous larva migrans (CLM)/creeping eruption pada pasien anak (dosis berbasis berat badan).",
    sediaanCustomText: "Tablet kunyah/tablet 400 mg; beberapa produk tersedia suspensi 200 mg/5 mL.",
    catatan: "CLM pada anak (Perdoski 2024): albendazol 10–15 mg/kg/hari dengan dosis maksimal 800 mg/hari, diberikan selama 3–5 hari. Alternatif dosis flat 400 mg lihat kartu 'Albendazole (Flat)'.",
    kelasAlergi: ["benzimidazol"],
    interaksiTags: ["hepatotoksik-dosis-tinggi"],
    kontraindikasi: ["Kehamilan (trimester 1)", "Hipersensitivitas benzimidazol"],
    peringatan: ["Hati-hati usia <2 tahun (data terbatas)", "Pantau fungsi hati pada terapi lama/dosis tinggi"],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 400,
    puyer: { mode: "mgkg", dosis: 10, sediaan: 400, alias: ["albendazol"], catatan: "10–15 mg/kg/hari; tablet 400 mg. Verifikasi." },
    sediaanOptions: [
      { label: "Tablet kunyah 400 mg", bentuk: "tablet", kekuatanMg: 400 },
      { label: "Suspensi 200 mg/5 mL", bentuk: "suspensi", sediaanMg: 200, sediaanMl: 5 }
    ]
  },
  {
    id: "metoclopramide",
    nama: "Metoclopramide",
    jenis: "Antiemetik",
    icon: "🤢",
    doseType: "perKg",
    doseBasis: "perDose",
    dosisMinPerKg: 0.1,
    dosisMaxPerKg: 0.15,
    unitLabel: "mg/kg/kali",
    satuanDosis: "mg",
    maxDosesPerDay: 3,
    dosisMaksimalTunggalMg: 10,
    dosisMaksimalHarianPerKg: 0.5,
    sediaanMg: 5,
    sediaanMl: 5,
    sediaanOptions: [
      { label: "Sirup 5 mg/5 mL", bentuk: "sirup", sediaanMg: 5, sediaanMl: 5 },
      { label: "Tablet 10 mg", bentuk: "tablet", kekuatanMg: 10 }
    ],
    frekuensi: "tiap 8 jam bila perlu; batasi maksimal 5 hari",
    catatan: "Risiko efek ekstrapiramidal/distonia akut pada anak. Gunakan dosis terendah, durasi sesingkat mungkin. Hindari usia <1 tahun. Verifikasi indikasi & alternatif (mis. ondansetron/domperidone).",
    usiaMinValidBulan: 12,
    kelasAlergi: ["metoclopramide"],
    interaksiTags: ["qt", "ssp-depresan", "antikolinergik"],
    kontraindikasi: [
      "Obstruksi/perforasi/perdarahan saluran cerna",
      "Feokromositoma",
      "Riwayat tardive dyskinesia / reaksi ekstrapiramidal",
      "Epilepsi",
      "Neonatus"
    ],
    peringatan: [
      "Risiko reaksi ekstrapiramidal/distonia akut pada anak",
      "Batasi maksimal 5 hari pemakaian",
      "Hindari pada usia <1 tahun",
      "Maks 0,5 mg/kg/hari & 10 mg/kali"
    ],
    keselamatanVersi: "v1-starter",
    keselamatanCatatan: "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
    bisaDipuyer: true,
    puyerSediaanMg: 10,
    puyer: { mode: "mgkg", dosis: 0.1, sediaan: 10, alias: ["metoklopramid"], catatan: "0,1–0,15 mg/kg/kali; tablet 10 mg. Perhatikan risiko distonia." }
  }
].sort((a, b) => String(a.nama || "").localeCompare(String(b.nama || ""), "id", { sensitivity: "base" }));
