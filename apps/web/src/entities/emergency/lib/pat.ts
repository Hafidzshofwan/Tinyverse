import type { PatState, PatResult } from "../model/types";

/** Kategori PAT (Pediatric Assessment Triangle) — port verbatim dari v17. */
export function hitungPAT(state: PatState): PatResult | null {
  const a = state.appearance;
  const b = state.breathing;
  const c = state.circulation;
  if (!a || !b || !c) return null;
  const A = a === "abnormal";
  const B = b === "abnormal";
  const C = c === "abnormal";
  if (!A && !B && !C)
    return {
      kat: "Stabil",
      lvl: "stabil",
      saran:
        "Penampilan, napas, dan sirkulasi normal. Lanjutkan penilaian primer (ABCDE) sesuai indikasi.",
    };
  if (A && !B && !C)
    return {
      kat: "Disfungsi SSP / Metabolik",
      lvl: "waspada",
      saran:
        "Penampilan terganggu dengan napas & sirkulasi normal. Pikirkan gangguan SSP, hipoglikemia, intoksikasi, sepsis awal. Cek gula darah & status neurologis.",
    };
  if (!A && B && !C)
    return {
      kat: "Distres Napas",
      lvl: "waspada",
      saran:
        "Usaha napas meningkat, masih terkompensasi. Beri oksigen, posisikan nyaman, siapkan bantuan napas, cari penyebab.",
    };
  if (A && B && !C)
    return {
      kat: "Gagal Napas",
      lvl: "kritis",
      saran:
        "Penampilan + usaha napas abnormal. Dukungan napas segera (BVM/oksigen agresif), siapkan jalan napas lanjut & bantuan.",
    };
  if (!A && !B && C)
    return {
      kat: "Syok Terkompensasi",
      lvl: "waspada",
      saran:
        "Sirkulasi kulit abnormal, penampilan masih baik. Akses IV/IO, pertimbangkan bolus cairan, cari & atasi penyebab.",
    };
  if (A && !B && C)
    return {
      kat: "Syok Dekompensata",
      lvl: "kritis",
      saran:
        "Penampilan + sirkulasi abnormal. Resusitasi syok segera: akses IV/IO, bolus cairan, panggil bantuan, monitor ketat.",
    };
  if (!A && B && C)
    return {
      kat: "Distres Napas + Gangguan Sirkulasi",
      lvl: "kritis",
      saran:
        "Kombinasi gangguan napas & sirkulasi. Dukung oksigenasi/ventilasi dan sirkulasi bersamaan; eskalasi segera.",
    };
  return {
    kat: "Gagal Kardiopulmoner",
    lvl: "kritis",
    saran:
      "Ketiga sisi abnormal \u2014 kondisi paling kritis. Aktifkan resusitasi penuh segera & panggil bantuan. Gunakan Timer Resusitasi di samping.",
  };
}
