/**
 * Model data untuk alur koreksi elektrolit.
 *
 * Aturan rancangan yang dipegang di sini: setiap angka klinis disimpan
 * berpasangan dengan sumbernya. Nilai dan sitasi berada dalam satu struktur
 * agar sitasi tidak bisa terlepas dari angkanya ketika kode berubah. Itulah
 * sebabnya modul ini tidak memakai untaian HTML seperti DxLine.
 */

export type Sumber = { label: string; url: string };

/** Seluruh rujukan yang dipakai mesin koreksi elektrolit. */
export const SUMBER = {
  rchHipoNa: {
    label: "RCH Melbourne - Hyponatraemia (Nov 2023)",
    url: "https://www.rch.org.au/clinicalguide/guideline_index/hyponatraemia/",
  },
  chq: {
    label: "CHQ-GDL-04112 - Treatment of Severe Hyponatraemia in Children v4.0",
    url: "https://www.childrens.health.qld.gov.au/__data/assets/pdf_file/0014/180212/gdl-04112.pdf",
  },
  bcehs: {
    label: "BCEHS - monografi NaCl 3% hipertonik",
    url: "https://handbook.bcehs.ca/drug-monographs/3-hypertonic-saline/",
  },
  nejm: {
    label: "NEJM Evidence 2023 - koreksi hiponatremia berat, mortalitas & mielinolisis pontin sentral",
    url: "https://evidence.nejm.org/doi/full/10.1056/EVIDoa2300107",
  },
  medscapeNaCairan: {
    label: "Medscape - Pediatric Hyponatremia (kadar natrium tiap cairan)",
    url: "https://emedicine.medscape.com/article/907841-treatment",
  },
  rchHiperNa: {
    label: "RCH Melbourne - Hypernatraemia (Okt 2020)",
    url: "https://www.rch.org.au/clinicalguide/guideline_index/hypernatraemia/",
  },
  medscapeHiperNa: {
    label: "Medscape - Pediatric Hypernatremia",
    url: "https://emedicine.medscape.com/article/907653-treatment",
  },
  picuHiperNa: {
    label: "PICU Doc On Call - Hypernatremia in the PICU",
    url: "https://picudoconcall.org/episodes/24-2/",
  },
  fwNeo: {
    label: "Hypernatremia in Newborns: A Practical Approach to Management (PMC9247442)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9247442/",
  },
  rchHipoK: {
    label: "RCH Melbourne - Hypokalaemia",
    url: "https://www.rch.org.au/clinicalguide/guideline_index/hypokalaemia/",
  },
  achK: {
    label: "Parsons S. - Neonatal and Pediatric Potassium Administration (2021)",
    url: "https://achpccg.com/wp-content/uploads/2021/01/tms-picuc-physician-neonatal-ped-potassium-admin-3.pdf",
  },
  pier: {
    label: "PIER Network - Management of Hypokalaemia",
    url: "https://www.piernetwork.org/uploads/4/7/8/1/47810883/hypokalaemia_flowsheet_afmcc15-12-16.pdf",
  },
  rchHiperK: {
    label: "RCH Melbourne - Hyperkalaemia",
    url: "https://www.rch.org.au/clinicalguide/guideline_index/hyperkalaemia/",
  },
  medscapeHiperK: {
    label: "Medscape - Hyperkalemia Treatment & Management",
    url: "https://emedicine.medscape.com/article/240903-treatment",
  },
  medscapeHiperKDerajat: {
    label: "Medscape - Hyperkalemia (derajat & rentang usia)",
    url: "https://emedicine.medscape.com/article/240903-overview",
  },
  medscapePedHiperK: {
    label: "Medscape - Pediatric Hyperkalemia (konsultasi)",
    url: "https://emedicine.medscape.com/article/907543-treatment",
  },
  daly: {
    label: "Daly K, dkk. Hypokalemia and Hyperkalemia in Infants and Children (2013)",
    url: "https://www.jpedhc.org/article/S0891-5245(13)00281-2/fulltext",
  },
  pem: {
    label: "Pediatric EM Morsels - Hyperkalemia",
    url: "https://pedemmorsels.com/hyperkalemia/",
  },
  ggcEkg: {
    label: "NHS GGC - Hyperkalaemia, Emergency Management, PICU (387)",
    url: "https://www.rightdecisions.scot.nhs.uk/shared-content/ggc-clinical-guidelines/paediatrics/intensive-and-critical-care/hyperkalaemia-emergency-management-paediatric-intensive-care-unit-387/",
  },
  fdaCa: {
    label: "FDA label - Calcium Gluconate Injection",
    url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2017/208418s000lbl.pdf",
  },
  dosisCa: {
    label: "Calcium Gluconate - dosis pediatri untuk hipokalsemia akut",
    url: "https://www.drugs.com/dosage/calcium-gluconate.html",
  },
  aapMg: {
    label: "AAP Pediatric Care Online - Magnesium Sulfate",
    url: "https://publications.aap.org/pediatriccare/drug-monograph/18/5097/Magnesium-Sulfate",
  },
  medscapeMg: {
    label: "Medscape - Hypomagnesemia Treatment & Management",
    url: "https://emedicine.medscape.com/article/2038394-treatment",
  },
  rchPO4: {
    label: "RCH Melbourne - Hypophosphataemia",
    url: "https://www.rch.org.au/clinicalguide/guideline_index/Hypophosphataemia/",
  },
  aspenRefeeding: {
    label: "ASPEN 2020 - Consensus Recommendations for Refeeding Syndrome",
    url: "https://aspenjournals.onlinelibrary.wiley.com/doi/abs/10.1002/ncp.10474",
  },
} as const satisfies Record<string, Sumber>;

export type GangguanId =
  | "hipoNa"
  | "hiperNa"
  | "hipoK"
  | "hiperK"
  | "hipoCa"
  | "hipoMg"
  | "hipoPO4";

export type Gangguan = {
  id: GangguanId;
  label: string;
  /** Nama parameter labnya, untuk label kolom masukan. */
  parameter: string;
  satuan: string;
  contoh: string;
};

/**
 * Nada sebuah baris rencana.
 * - aksi   : tindakan yang dikerjakan
 * - info   : penjelasan atau rumus
 * - bahaya : pagar yang bisa mencederai bila dilanggar
 * - blokir : hal yang secara tegas tidak boleh dilakukan di jalur ini
 */
export type NadaBaris = "aksi" | "info" | "bahaya" | "blokir";

export type Baris = {
  nada: NadaBaris;
  judul: string;
  isi: string;
  sumber: Sumber[];
};

export type Derajat = {
  label: string;
  nada: NadaBaris;
  rentang: string;
  catatan: string | null;
  sumber: Sumber[];
};

export type Kronisitas = "akut" | "kronis" | "takTahu";
export type StatusCairan = "hipovolemik" | "euvolemik" | "hipervolemik";
export type JalurOral = "bisa" | "tidak";

/** Jawaban yang terkumpul sepanjang alur bertahap. */
export type JawabanAlur = {
  gangguan: GangguanId | null;
  bbKg: number | null;
  nilai: number | null;
  usiaBulan: number | null;
  /** Hanya untuk hipokalsemia. */
  albuminGdl: number | null;
  /** Kejang atau penurunan kesadaran. */
  gejalaBerat: boolean | null;
  /** Perubahan EKG atau hemodinamik tidak stabil. */
  ekgAtauInstabil: boolean | null;
  /** Hanya untuk hiperkalemia. */
  digoksin: boolean | null;
  kronisitas: Kronisitas | null;
  statusCairan: StatusCairan | null;
  oral: JalurOral | null;
};

export type Rencana = {
  derajat: Derajat | null;
  gawat: boolean;
  langkah: Baris[];
  pagar: Baris[];
  pemantauan: Baris[];
  rujuk: Baris[];
};

export type HasilLaju = {
  delta: number;
  jam: number;
  perJam: number;
  proyeksi24: number;
  batas24: number;
  lampau: boolean;
  nada: NadaBaris;
  pesan: string;
  sumber: Sumber[];
};

export const JAWABAN_KOSONG: JawabanAlur = {
  gangguan: null,
  bbKg: null,
  nilai: null,
  usiaBulan: null,
  albuminGdl: null,
  gejalaBerat: null,
  ekgAtauInstabil: null,
  digoksin: null,
  kronisitas: null,
  statusCairan: null,
  oral: null,
};
