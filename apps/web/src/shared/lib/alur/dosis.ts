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
  opt: {
    low: number;
    high: number;
    maks?: number;
    satuan?: string;
    suffix?: string;
  },
): HasilDosis {
  const satuan = opt.satuan ?? "mg";
  const suffix = opt.suffix ?? "/hari";
  const aturan = `${fmt(opt.low)}\u2013${fmt(opt.high)} ${satuan}/kgBB${suffix}${
    opt.maks != null ? `, maks ${fmt(opt.maks)} ${satuan}${suffix}` : ""
  }`;
  const bb = p.bb;
  if (!bb || bb <= 0) {
    return {
      ringkas: aturan,
      peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
    };
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
    fmt(low) === fmt(high)
      ? `${fmt(low)} ${satuan}${suffix}`
      : `${fmt(low)}\u2013${fmt(high)} ${satuan}${suffix}`;
  return {
    ringkas: `${nilai} (BB ${fmt(bb)} kg)`,
    detail: aturan,
    peringatan:
      dibatasi && opt.maks != null
        ? `Dosis dibatasi maksimal ${fmt(opt.maks)} ${satuan}${suffix}.`
        : undefined,
  };
}

function cairanPerJam(
  p: Pasien,
  opt: { low: number; high: number; lama: string },
): HasilDosis {
  const aturan = `${fmt(opt.low)}\u2013${fmt(opt.high)} ml/kgBB/jam selama ${opt.lama}`;
  const bb = p.bb;
  if (!bb || bb <= 0) {
    return {
      ringkas: aturan,
      peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
    };
  }
  const low = opt.low * bb;
  const high = opt.high * bb;
  return {
    ringkas: `${fmt(low)}\u2013${fmt(high)} ml/jam selama ${opt.lama} (BB ${fmt(bb)} kg)`,
    detail: aturan,
  };
}

function bolusCairan(
  p: Pasien,
  opt: { low: number; high: number; lama: string },
): HasilDosis {
  const rentang =
    fmt(opt.low) === fmt(opt.high)
      ? `${fmt(opt.low)} ml/kgBB`
      : `${fmt(opt.low)}–${fmt(opt.high)} ml/kgBB`;
  const aturan = `${rentang} dalam ${opt.lama}`;
  const bb = p.bb;
  if (!bb || bb <= 0) {
    return {
      ringkas: aturan,
      peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
    };
  }
  const low = opt.low * bb;
  const high = opt.high * bb;
  const nilai =
    fmt(low) === fmt(high) ? `${fmt(low)} ml` : `${fmt(low)}–${fmt(high)} ml`;
  return {
    ringkas: `${nilai} dalam ${opt.lama} (BB ${fmt(bb)} kg)`,
    detail: aturan,
  };
}

function transfusi(
  p: Pasien,
  opt: { low: number; high: number; komponen: string },
): HasilDosis {
  const rentang =
    fmt(opt.low) === fmt(opt.high)
      ? `${fmt(opt.low)} ml/kgBB`
      : `${fmt(opt.low)}–${fmt(opt.high)} ml/kgBB`;
  const aturan = `${rentang} ${opt.komponen}, berikan segera`;
  const bb = p.bb;
  if (!bb || bb <= 0) {
    return {
      ringkas: aturan,
      peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
    };
  }
  const nilai = `${fmt(opt.low * bb)}–${fmt(opt.high * bb)} ml`;
  return {
    ringkas: `${nilai} ${opt.komponen} (BB ${fmt(bb)} kg), berikan segera.`,
    detail: aturan,
  };
}

export const OBAT: Record<string, ObatDef> = {
  oksigen: {
    id: "oksigen",
    nama: "Oksigen",
    rute: "sesuai kondisi",
    hitung: () => ({
      ringkas: "Berikan sesuai kondisi pasien (target SpO\u2082 \u226594%).",
    }),
  },
  salbutamolNeb: {
    id: "salbutamolNeb",
    nama: "Salbutamol (SABA) nebulizer",
    rute: "nebulizer",
    hitung: () => ({
      ringkas: "2,5 mg (1 ampul) per kali.",
      detail:
        "Diulang tiap 20 menit pada 1 jam pertama; lalu tiap 1\u20132 jam pada serangan berat.",
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
      const dasar =
        "Nebulisasi s/d 3\u00d7 tiap 20 menit (1 jam pertama), lalu tiap 4\u20136 jam atau dihentikan.";
      if (bln == null) {
        return {
          ringkas:
            "<4 th: 125\u2013250 \u00b5g \u00b7 \u22654 th: 250\u2013500 \u00b5g per dosis.",
          detail: dasar,
          peringatan: "Isi usia pasien untuk saran otomatis.",
        };
      }
      const th = bln / 12;
      const dosis =
        th < 4
          ? "125\u2013250 \u00b5g per dosis (usia <4 th)"
          : "250\u2013500 \u00b5g per dosis (usia \u22654 th)";
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
      const aturan =
        "Bolus 6\u20138 mg/kgBB dalam 20 menit \u2192 rumatan drip 0,5\u20131 mg/kgBB/jam.";
      if (!bb || bb <= 0)
        return {
          ringkas: aturan,
          peringatan:
            "Rentang keamanan sempit \u2014 pantau ketat. Isi BB untuk hitung.",
        };
      return {
        ringkas: `Bolus ${fmt(6 * bb)}\u2013${fmt(8 * bb)} mg (20 mnt) \u2192 drip ${fmt(0.5 * bb)}\u2013${fmt(
          1 * bb,
        )} mg/jam (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan:
          "Rentang keamanan sempit \u2014 berikan perlahan & pantau ketat.",
      };
    },
  },
  mgso4: {
    id: "mgso4",
    nama: "Magnesium sulfat (MgSO\u2084 IV) \u2014 ancaman henti napas",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "Bolus 40\u201350 mg/kgBB IV dalam 60 menit (maks 1.500 mg bila BB >30 kg).";
      if (!bb || bb <= 0)
        return { ringkas: aturan, peringatan: "Isi BB untuk hitung otomatis." };
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
        peringatan: dibatasi
          ? "Dibatasi maksimal 1.500 mg (BB >30 kg)."
          : undefined,
      };
    },
  },

  // ===== Kejang / Status Epileptikus =====
  diazepamRektal: {
    id: "diazepamRektal",
    nama: "Diazepam per rektal",
    rute: "rektal",
    hitung: (p) => {
      const bb = p.bb;
      const detail = "Maksimal 2\u00d7 pemberian, jarak 5 menit.";
      if (!bb || bb <= 0) {
        return {
          ringkas: "5 mg (BB <12 kg) atau 10 mg (BB \u226512 kg) supositoria.",
          detail,
          peringatan: "Isi BB pasien di Profil untuk saran otomatis.",
        };
      }
      const dosis = bb < 12 ? "5 mg" : "10 mg";
      const ket = bb < 12 ? "BB <12 kg" : "BB \u226512 kg";
      return {
        ringkas: `${dosis} supositoria (${ket}, BB ${fmt(bb)} kg).`,
        detail,
      };
    },
  },
  diazepamIV: {
    id: "diazepamIV",
    nama: "Diazepam IV",
    rute: "IV",
    hitung: (p) => {
      const r = perKg(p, {
        low: 0.2,
        high: 0.5,
        maks: 10,
        suffix: " per dosis",
      });
      const dasar = r.detail ?? "0,2\u20130,5 mg/kgBB per dosis (maks 10 mg)";
      return { ...r, detail: `${dasar} \u00b7 Kecepatan 2 mg/menit.` };
    },
  },
  midazolamIMBuccal: {
    id: "midazolamIMBuccal",
    nama: "Midazolam (IM / buccal)",
    rute: "IM / buccal",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "0,2 mg/kgBB per dosis (maks 10 mg).";
      if (!bb || bb <= 0)
        return {
          ringkas: aturan,
          peringatan: "Isi BB pasien untuk hitung otomatis.",
        };
      let d = 0.2 * bb;
      let dibatasi = false;
      if (d > 10) {
        d = 10;
        dibatasi = true;
      }
      return {
        ringkas: `${fmt(d)} mg per dosis (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: dibatasi ? "Dosis dibatasi maksimal 10 mg." : undefined,
      };
    },
  },
  fenitoin: {
    id: "fenitoin",
    nama: "Fenitoin IV",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "20 mg/kgBB per dosis (maks 1000 mg). Diencerkan dalam 50 ml NaCl 0,9%, diberikan selama 20 menit (\u22482 mg/menit).";
      if (!bb || bb <= 0)
        return {
          ringkas: "20 mg/kgBB per dosis (maks 1000 mg).",
          detail: aturan,
          peringatan: "Isi BB pasien untuk hitung otomatis.",
        };
      let d = 20 * bb;
      let dibatasi = false;
      if (d > 1000) {
        d = 1000;
        dibatasi = true;
      }
      return {
        ringkas: `${fmt(d)} mg per dosis (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: dibatasi ? "Dosis dibatasi maksimal 1000 mg." : undefined,
      };
    },
  },
  fenitoinTambahan: {
    id: "fenitoinTambahan",
    nama: "Fenitoin tambahan (bila perlu)",
    rute: "IV",
    hitung: (p) => perKg(p, { low: 5, high: 10, suffix: " per dosis" }),
  },
  fenobarbital: {
    id: "fenobarbital",
    nama: "Fenobarbital IV",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "20 mg/kgBB per dosis (maks 1000 mg). Kecepatan 10\u201320 mg/menit.";
      if (!bb || bb <= 0)
        return {
          ringkas: "20 mg/kgBB per dosis (maks 1000 mg).",
          detail: aturan,
          peringatan: "Isi BB pasien untuk hitung otomatis.",
        };
      let d = 20 * bb;
      let dibatasi = false;
      if (d > 1000) {
        d = 1000;
        dibatasi = true;
      }
      return {
        ringkas: `${fmt(d)} mg per dosis (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: dibatasi ? "Dosis dibatasi maksimal 1000 mg." : undefined,
      };
    },
  },
  fenobarbitalTambahan: {
    id: "fenobarbitalTambahan",
    nama: "Fenobarbital tambahan (bila perlu)",
    rute: "IV",
    hitung: (p) => perKg(p, { low: 5, high: 10, suffix: " per dosis" }),
  },
  rumatanFenitoin: {
    id: "rumatanFenitoin",
    nama: "Rumatan Fenitoin",
    rute: "oral / IV",
    hitung: (p) => {
      const r = perKg(p, { low: 5, high: 10 });
      const dasar = r.detail ?? "5\u201310 mg/kgBB/hari";
      return {
        ...r,
        detail: `${dasar} \u00b7 Dibagi 2 dosis; mulai 12 jam setelah dosis awal.`,
      };
    },
  },
  rumatanFenobarbital: {
    id: "rumatanFenobarbital",
    nama: "Rumatan Fenobarbital",
    rute: "oral / IV",
    hitung: (p) => {
      const r = perKg(p, { low: 3, high: 5 });
      const dasar = r.detail ?? "3\u20135 mg/kgBB/hari";
      return {
        ...r,
        detail: `${dasar} \u00b7 Dibagi 2 dosis; mulai 12 jam setelah dosis awal.`,
      };
    },
  },
  midazolamDrip: {
    id: "midazolamDrip",
    nama: "Midazolam (drip ICU)",
    rute: "IV kontinyu",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "Bolus 100\u2013200 mcg/kgBB (maks 10 mg) \u2192 infus kontinyu 100 mcg/kgBB/jam; dapat dinaikkan 50 mcg/kg tiap 15 menit (maks 2 mg/kgBB/jam).";
      if (!bb || bb <= 0)
        return { ringkas: aturan, peringatan: "Isi BB untuk hitung otomatis." };
      let bLow = (100 * bb) / 1000;
      let bHigh = (200 * bb) / 1000;
      if (bLow > 10) bLow = 10;
      if (bHigh > 10) bHigh = 10;
      const infus = (100 * bb) / 1000;
      return {
        ringkas: `Bolus ${fmt(bLow)}\u2013${fmt(bHigh)} mg IV (maks 10 mg) \u2192 infus ${fmt(infus)} mg/jam (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: "Rawat ICU; siapkan intubasi & ventilasi mekanik.",
      };
    },
  },
  propofolDrip: {
    id: "propofolDrip",
    nama: "Propofol (drip ICU)",
    rute: "IV kontinyu",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "Bolus 1\u20133 mg/kgBB \u2192 infus kontinyu 2\u201310 mg/kgBB/jam.";
      if (!bb || bb <= 0)
        return { ringkas: aturan, peringatan: "Isi BB untuk hitung otomatis." };
      return {
        ringkas: `Bolus ${fmt(1 * bb)}\u2013${fmt(3 * bb)} mg \u2192 infus ${fmt(2 * bb)}\u2013${fmt(10 * bb)} mg/jam (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: "Rawat ICU; siapkan intubasi & ventilasi mekanik.",
      };
    },
  },
  pentobarbitalDrip: {
    id: "pentobarbitalDrip",
    nama: "Pentobarbital (drip ICU)",
    rute: "IV kontinyu",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "Bolus 5\u201315 mg/kgBB \u2192 infus kontinyu 0,5\u20135 mg/kgBB/jam.";
      if (!bb || bb <= 0)
        return { ringkas: aturan, peringatan: "Isi BB untuk hitung otomatis." };
      return {
        ringkas: `Bolus ${fmt(5 * bb)}\u2013${fmt(15 * bb)} mg \u2192 infus ${fmt(0.5 * bb)}\u2013${fmt(5 * bb)} mg/jam (BB ${fmt(bb)} kg).`,
        detail: aturan,
        peringatan: "Rawat ICU; siapkan intubasi & ventilasi mekanik.",
      };
    },
  },

  // ===== Demam Berdarah Dengue (cairan & suportif) =====
  parasetamol: {
    id: "parasetamol",
    nama: "Parasetamol (antipiretik)",
    rute: "oral",
    hitung: (p) => {
      const r = perKg(p, {
        low: 10,
        high: 15,
        maks: 500,
        suffix: " per dosis",
      });
      const dasar = r.detail ?? "10\u201315 mg/kgBB per dosis (maks 500 mg)";
      return {
        ...r,
        detail: `${dasar} \u00b7 tiap 4\u20136 jam, maksimal 4\u00d7/hari.`,
      };
    },
  },
  kristaloid5_7: {
    id: "kristaloid5_7",
    nama: "Kristaloid isotonis (NaCl 0,9% / Ringer laktat)",
    rute: "IV",
    hitung: (p) => cairanPerJam(p, { low: 5, high: 7, lama: "1\u20132 jam" }),
  },
  kristaloid3_5: {
    id: "kristaloid3_5",
    nama: "Kristaloid isotonis (NaCl 0,9% / Ringer laktat)",
    rute: "IV",
    hitung: (p) => cairanPerJam(p, { low: 3, high: 5, lama: "2\u20134 jam" }),
  },
  kristaloid2_3: {
    id: "kristaloid2_3",
    nama: "Kristaloid isotonis (NaCl 0,9% / Ringer laktat)",
    rute: "IV",
    hitung: (p) => cairanPerJam(p, { low: 2, high: 3, lama: "2\u20134 jam" }),
  },
  kristaloid5_10: {
    id: "kristaloid5_10",
    nama: "Kristaloid isotonis (NaCl 0,9% / Ringer laktat)",
    rute: "IV",
    hitung: (p) => cairanPerJam(p, { low: 5, high: 10, lama: "1\u20132 jam" }),
  },
  // ===== DBD Grup C — resusitasi syok (bolus, koloid, transfusi) =====
  bolusKristaloid10: {
    id: "bolusKristaloid10",
    nama: "Kristaloid isotonis (bolus/infus) — NaCl 0,9% / Ringer laktat",
    rute: "IV",
    hitung: (p) => bolusCairan(p, { low: 10, high: 10, lama: "1 jam" }),
  },
  bolusKristaloidKoloid20: {
    id: "bolusKristaloidKoloid20",
    nama: "Kristaloid isotonis atau koloid (bolus cepat)",
    rute: "IV",
    hitung: (p) => bolusCairan(p, { low: 20, high: 20, lama: "15 menit" }),
  },
  bolusKristaloidKoloid10_20: {
    id: "bolusKristaloidKoloid10_20",
    nama: "Kristaloid isotonis (bolus kedua) atau koloid",
    rute: "IV",
    hitung: (p) => bolusCairan(p, { low: 10, high: 20, lama: "1 jam" }),
  },
  koloid10_20: {
    id: "koloid10_20",
    nama: "Koloid (bolus)",
    rute: "IV",
    hitung: (p) => bolusCairan(p, { low: 10, high: 20, lama: "½–1 jam" }),
  },
  koloid7_10: {
    id: "koloid7_10",
    nama: "Koloid (penyapihan)",
    rute: "IV",
    hitung: (p) => cairanPerJam(p, { low: 7, high: 10, lama: "1–2 jam" }),
  },
  transfusiPRC5_10: {
    id: "transfusiPRC5_10",
    nama: "Transfusi PRC (packed red cell)",
    rute: "IV",
    hitung: (p) => transfusi(p, { low: 5, high: 10, komponen: "PRC" }),
  },
  transfusiWRC10_20: {
    id: "transfusiWRC10_20",
    nama: "Transfusi WRC",
    rute: "IV",
    hitung: (p) => transfusi(p, { low: 10, high: 20, komponen: "WRC" }),
  },
  transfusiWholeBlood10_20: {
    id: "transfusiWholeBlood10_20",
    nama: "Transfusi darah lengkap (whole blood)",
    rute: "IV",
    hitung: (p) =>
      transfusi(p, { low: 10, high: 20, komponen: "darah lengkap" }),
  },
};

export function hitungObat(
  id: string,
  p: Pasien,
): { def: ObatDef; hasil: HasilDosis } | null {
  const def = OBAT[id];
  if (!def) return null;
  return { def, hasil: def.hitung(p) };
}
