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

// Rumatan cairan harian (Holliday-Segar).
function holliday(bb: number): number {
  if (bb <= 10) return 100 * bb;
  if (bb <= 20) return 1000 + 50 * (bb - 10);
  return 1500 + 20 * (bb - 20);
}

// Hitung kebutuhan cairan KAD untuk 48 jam (defisit + rumatan).
// Kelompok Bayi (<12 bln) / Anak ditentukan otomatis dari usia pasien.
function hitungCairanKad(
  p: Pasien,
  derajat: "ringan" | "sedang" | "berat",
): HasilDosis {
  const bb = p.bb;
  const bln = p.usiaBulan;
  const persenBayi = { ringan: 5, sedang: 10, berat: 15 };
  const persenAnak = { ringan: 3, sedang: 6, berat: 9 };
  if (bln == null) {
    return {
      ringkas: "Isi USIA pasien di Profil untuk menentukan kelompok Bayi/Anak.",
      peringatan: "Butuh usia (Bayi <12 bln) & BB untuk hitung otomatis.",
    };
  }
  const bayi = bln < 12;
  const kelompok = bayi ? "Bayi" : "Anak";
  const persen = (bayi ? persenBayi : persenAnak)[derajat];
  if (!bb || bb <= 0) {
    return {
      ringkas: `${kelompok} \u00b7 dehidrasi ${persen}% (defisit ${persen * 10} mL/kgBB).`,
      peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
    };
  }
  const defisit = (persen / 100) * bb * 1000;
  const rumatanHari = holliday(bb);
  const rumatan48 = rumatanHari * 2;
  const totalHitung = defisit + rumatan48;

  // Batas otomatis 4 L/m\u00b2/hari untuk 48 jam.
  // BSA (Mosteller) = akar((TB[cm] \u00d7 BB[kg]) / 3600). Butuh TB dari profil.
  const tb = p.tb;
  let total = totalHitung;
  let catatanCap = "";
  const punyaTb = tb != null && tb > 0;
  if (punyaTb) {
    const bsa = Math.sqrt((tb! * bb) / 3600);
    const batas48 = 4000 * bsa * 2;
    if (totalHitung > batas48) {
      total = batas48;
      catatanCap = ` Dibatasi otomatis ke maks 4 L/m\u00b2/hari (BSA ${fmt(bsa)} m\u00b2 \u2192 maks ${fmt(batas48)} mL/48 jam) dari hitungan ${fmt(totalHitung)} mL.`;
    } else {
      catatanCap = ` Masih di bawah batas 4 L/m\u00b2/hari (BSA ${fmt(bsa)} m\u00b2 \u2192 maks ${fmt(batas48)} mL/48 jam).`;
    }
  }
  const tetesan = total / 48;

  return {
    ringkas: `\u2248 ${fmt(tetesan)} mL/jam \u00b7 total 48 jam ${fmt(total)} mL (BB ${fmt(bb)} kg)`,
    detail: `${kelompok} \u00b7 dehidrasi ${persen}%. Defisit ${fmt(defisit)} mL + rumatan 48 jam ${fmt(rumatan48)} mL (rumatan/hari ${fmt(rumatanHari)} mL) = total ${fmt(totalHitung)} mL, dibagi 48 jam.${catatanCap}`,
    peringatan: punyaTb
      ? "Batas 4 L/m\u00b2/hari diterapkan otomatis dari TB & BB profil; kurangi volume yang sudah dipakai untuk atasi syok."
      : "Isi TINGGI BADAN di Profil agar batas 4 L/m\u00b2/hari diterapkan otomatis. Kurangi volume yang sudah dipakai untuk atasi syok.",
  };
}

export const OBAT: Record<string, ObatDef> = {
  // ===== Ketoasidosis Diabetik / KAD (Pedoman Pelayanan Medis, IDAI 2022) =====
  naclBolusKad: {
    id: "naclBolusKad",
    nama: "NaCl 0,9% / RL \u2014 bolus syok",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "20 mL/kgBB/jam, ulang sampai renjatan teratasi.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
        };
      }
      return {
        ringkas: `${fmt(20 * bb)} mL/jam (BB ${fmt(bb)} kg)`,
        detail: aturan,
      };
    },
  },
  insulinReguler: {
    id: "insulinReguler",
    nama: "Insulin reguler \u2014 drip IV",
    rute: "IV (jalur terpisah)",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "0,1 U/kgBB/jam IV, jalur terpisah dari cairan.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan:
            "Masukkan BB pasien di Profil untuk hitung otomatis. GD turun maks 100 mg/dL/jam.",
        };
      }
      return {
        ringkas: `${fmt(0.1 * bb)} U/jam (BB ${fmt(bb)} kg)`,
        detail: aturan,
        peringatan:
          "Penurunan GD \u2264100 mg/dL/jam; jangan hentikan mendadak.",
      };
    },
  },
  bikarbonatKad: {
    id: "bikarbonatKad",
    nama: "Natrium bikarbonat (hanya bila pH <6,9)",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "1\u20132 mEq/kgBB, berikan perlahan.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan:
            "HANYA bila pH <6,9 + gangguan perfusi / hiperkalemia mengancam nyawa.",
        };
      }
      return {
        ringkas: `${fmt(1 * bb)}\u2013${fmt(2 * bb)} mEq (BB ${fmt(bb)} kg)`,
        detail: aturan,
        peringatan:
          "HANYA bila pH <6,9 + gangguan perfusi / hiperkalemia mengancam nyawa.",
      };
    },
  },
  kaliumKad: {
    id: "kaliumKad",
    nama: "Kalium (mulai sejak awal, kecuali anuria)",
    rute: "IV",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "Konsentrasi 40 mEq/L; maks 0,5 mEq/kgBB/jam.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Mulai sejak awal resusitasi, kecuali anuria.",
        };
      }
      return {
        ringkas: `Maks ${fmt(0.5 * bb)} mEq/jam (BB ${fmt(bb)} kg) \u00b7 konsentrasi 40 mEq/L`,
        detail: aturan,
        peringatan: "Mulai sejak awal resusitasi, kecuali anuria.",
      };
    },
  },
  cairanKadRingan: {
    id: "cairanKadRingan",
    nama: "Kebutuhan cairan KAD \u2014 dehidrasi ringan",
    rute: "IV \u00b7 48 jam",
    hitung: (p) => hitungCairanKad(p, "ringan"),
  },
  cairanKadSedang: {
    id: "cairanKadSedang",
    nama: "Kebutuhan cairan KAD \u2014 dehidrasi sedang",
    rute: "IV \u00b7 48 jam",
    hitung: (p) => hitungCairanKad(p, "sedang"),
  },
  cairanKadBerat: {
    id: "cairanKadBerat",
    nama: "Kebutuhan cairan KAD \u2014 dehidrasi berat",
    rute: "IV \u00b7 48 jam",
    hitung: (p) => hitungCairanKad(p, "berat"),
  },
  // ===== Hipoglikemia (PNPK Tata Laksana DM pada Anak, Kemenkes 2024) =====
  glukosaOral: {
    id: "glukosaOral",
    nama: "Glukosa oral (anak sadar)",
    rute: "oral",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "0,3 g/kgBB per pemberian (setara \u00b110\u201320 g).";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
        };
      }
      return {
        ringkas: `${fmt(0.3 * bb)} g glukosa (BB ${fmt(bb)} kg)`,
        detail: aturan,
      };
    },
  },
  dekstrosaBolus: {
    id: "dekstrosaBolus",
    nama: "Dekstrosa 10% (D10) \u2014 bolus IV",
    rute: "IV bolus",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "2\u20135 mL/kgBB (0,2\u20130,5 g/kgBB) IV bolus.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
        };
      }
      return {
        ringkas: `${fmt(2 * bb)}\u2013${fmt(5 * bb)} mL D10 IV bolus (BB ${fmt(bb)} kg)`,
        detail: aturan,
      };
    },
  },
  glukagon: {
    id: "glukagon",
    nama: "Glukagon (bila akses IV belum tersedia)",
    rute: "IM/SC",
    hitung: (p) => {
      const bb = p.bb;
      const aturan = "<25 kg: 0,5 mg \u00b7 \u226525 kg: 1 mg (IM/SC).";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Isi BB pasien untuk saran otomatis.",
        };
      }
      const dosis = bb < 25 ? "0,5 mg" : "1 mg";
      return { ringkas: `${dosis} IM/SC (BB ${fmt(bb)} kg)`, detail: aturan };
    },
  },
  dekstrosaInfus: {
    id: "dekstrosaInfus",
    nama: "Infus rumatan Dekstrosa 10%",
    rute: "IV drip",
    hitung: (p) => {
      const bb = p.bb;
      const aturan =
        "6\u201310 mg/kgBB/menit \u2014 sesuaikan dengan hasil glukosa darah.";
      if (!bb || bb <= 0) {
        return {
          ringkas: aturan,
          peringatan: "Masukkan BB pasien di Profil untuk hitung otomatis.",
        };
      }
      const mgMinLow = 6 * bb;
      const mgMinHigh = 10 * bb;
      // D10 = 100 mg/mL -> mL/jam = mg/menit x 60 / 100 = mg/menit x 0,6
      const mlJamLow = mgMinLow * 0.6;
      const mlJamHigh = mgMinHigh * 0.6;
      return {
        ringkas: `${fmt(mgMinLow)}\u2013${fmt(mgMinHigh)} mg/menit (BB ${fmt(bb)} kg)`,
        detail: `6\u201310 mg/kgBB/menit. Dengan D10 \u2248 ${fmt(mlJamLow)}\u2013${fmt(mlJamHigh)} mL/jam.`,
      };
    },
  },
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
