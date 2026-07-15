import type { Pasien } from "./tipe";

export type HasilDosis = {
  ringkas: string;
  detail?: string;
  peringatan?: string;
};

export type ObatDef = {
  id: string;
  nama: string;
  rute: string;
  hitung: (p: Pasien) => HasilDosis;
};

function fmt(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1).replace(".", ",");
}

function perKg(
  p: Pasien,
  opt: { low: number; high: number; maks?: number; satuan?: string; suffix?: string },
): HasilDosis {
  const satuan = opt.satuan ?? "mg";
  const suffix = opt.suffix ?? "/hari";
  const aturan = `${fmt(opt.low)}\u2013${fmt(opt.high)} ${satuan}/kgBB${suffix}${
    opt.maks != null ? `, maks ${fmt(opt.maks)} ${satuan}${suffix}` : ""
  }`;
  const bb = p.bb;
  if (!bb || bb <= 0) {
    return { ringkas: aturan, peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis." };
  }
  let low = opt.low * bb;
  let high = opt.high * bb;
  let dibatasi = false;
  if (opt.maks != null) {
    if (low > opt.maks) low = opt.maks;
    if (high > opt.maks) {
      high = opt.maks;
      dibatasi = true;
    }
  }
  const nilai =
    fmt(low) === fmt(high) ? `${fmt(low)} ${satuan}${suffix}` : `${fmt(low)}\u2013${fmt(high)} ${satuan}${suffix}`;
  return {
    ringkas: `${nilai} (BB ${fmt(bb)} kg)`,
    detail: aturan,
    peringatan:
      dibatasi && opt.maks != null ? `Dosis dibatasi maksimal ${fmt(opt.maks)} ${satuan}${suffix}.` : undefined,
  };
}

export const OBAT: Record<string, ObatDef> = {
  oksigen: {
    id: "oksigen",
    nama: "Oksigen",
    rute: "sesuai kondisi",
    hitung: () => ({ ringkas: "Berikan sesuai kondisi pasien (target SpO\u2082 \u226594%)." }),
  },
  salbutamolNeb: {
    id: "salbutamolNeb",
    nama: "Salbutamol (SABA) nebulizer",
    rute: "nebulizer",
    hitung: () => ({
      ringkas: "2,5 mg (1 ampul) per kali.",
      detail: "Diulang tiap 20 menit pada 1 jam pertama; lalu tiap 1\u20132 jam pada serangan berat.",
    }),
  },
  salbutamolMDI: {
    id: "salbutamolMDI",
    nama: "Salbutamol (SABA) pMDI + spacer",
    rute: "inhalasi",
    hitung: () => ({
      ringkas: "200\u2013400 \u00b5g (2\u20134 semprot).",
      detail:
        "Saat serangan sampai 4 semprot, diulang tiap 20 menit pada 1 jam pertama. Tiap 1 semprot diikuti 5\u201310 kali napas.",
    }),
  },
  ipratropium: {
    id: "ipratropium",
    nama: "Ipratropium bromida (kombinasi SABA)",
    rute: "nebulizer",
    hitung: (p) => {
      const bln = p.usiaBulan;
      const dasar = "Nebulisasi s/d 3\u00d7 tiap 20 menit (1 jam pertama), lalu tiap 4\u20136 jam atau dihentikan.";
      if (bln == null) {
        return {
          ringkas: "<4 th: 125\u2013250 \u00b5g \u00b7 \u22654 th: 250\u2013500 \u00b5g per dosis.",
          detail: dasar,
          peringatan: "Isi usia pasien untuk saran otomatis.",
        };
      }
      const th = bln / 12;
      const dosis =
        th < 4 ? "125\u2013250 \u00b5g per dosis (usia <4 th)" : "250\u2013500 \u00b5g per dosis (usia \u22654 th)";
      return { ringkas: dosis, detail: dasar };
    },
  },
  prednison: {
    id: "prednison",
    nama: "Prednison / Prednisolon (steroid sistemik oral)",
    rute: "oral",
    hitung: (p) => perKg(p, { low: 1, high: 2, maks: 40 }),
  },
  metilprednisolonIV: {
    id: "metilprednisolonIV",
    nama: "Metilprednisolon suksinat (steroid sistemik IV)",
    rute: "IV",
    hitung: (p) => perKg(p, { low: 1, high: 2, maks: 125 }),
  },
  kiDosisTinggi: {
    id: "kiDosisTinggi",
    nama: "Kortikosteroid inhalasi dosis tinggi",
    rute: "nebulizer",
    hitung: () => ({
      ringkas: "0,5\u20131 mg per kali, diulang tiap 20 menit.",
      detail: "Dapat diulang hingga 2 dosis berikutnya (total 1,5\u20133 mg).",
    }),
  },
  aminofilin: {
    id: "aminofilin",
    nama: "Aminofilin IV (serangan berat / tak respons)",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "Bolus 6\u20138 mg/kgBB dalam 20 menit \u2192 rumatan drip 0,5\u20131 mg/kgBB/jam.";
      if (!bb || bb <= 0)
        return { ringkas: aturan, peringatan: "Rentang keamanan sempit \u2014 pantau ketat. Isi BB untuk hitung." };
      return {
        ringkas: `Bolus ${fmt(6 * bb)}\u2013${fmt(8 * bb)} mg (20 mnt) \u2192 drip ${fmt(0.5 * bb)}\u2013${fmt(
          1 * bb,
        )} mg/jam (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: "Rentang keamanan sempit \u2014 berikan perlahan & pantau ketat.",
      };
    },
  },
  mgso4: {
    id: "mgso4",
    nama: "Magnesium sulfat (MgSO\u2084 IV) \u2014 ancaman henti napas",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "Bolus 40\u201350 mg/kgBB IV dalam 60 menit (maks 1.500 mg bila BB >30 kg).";
      if (!bb || bb <= 0) return { ringkas: aturan, peringatan: "Isi BB untuk hitung otomatis." };
      let low = 40 * bb;
      let high = 50 * bb;
      let dibatasi = false;
      if (bb > 30) {
        if (low > 1500) low = 1500;
        if (high > 1500) {
          high = 1500;
          dibatasi = true;
        }
      }
      return {
        ringkas: `Bolus ${fmt(low)}\u2013${fmt(high)} mg IV dalam 60 menit (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: dibatasi ? "Dibatasi maksimal 1.500 mg (BB >30 kg)." : undefined,
      };
    },
  },
};

export function hitungObat(id: string, p: Pasien): { def: ObatDef; hasil: HasilDosis } | null {
  const def = OBAT[id];
  if (!def) return null;
  return { def, hasil: def.hitung(p) };
}
