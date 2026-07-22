import type {
  GcsAgeEM,
  GcsAgeV,
  GcsKomp,
  GcsOption,
  GcsState,
  GcsResult,
} from "../model/types";

const DASH = "\u2013";

/** Opsi pGCS per komponen & kelompok usia — port verbatim dari v17. */
export const OPSI: Record<GcsKomp, Record<string, GcsOption[]>> = {
  eye: {
    lt1: [
      { s: 4, t: "Spontan" },
      { s: 3, t: "Terhadap teriakan" },
      { s: 2, t: "Terhadap nyeri" },
      { s: 1, t: "Tidak ada respon" },
    ],
    ge1: [
      { s: 4, t: "Spontan" },
      { s: 3, t: "Terhadap perintah verbal" },
      { s: 2, t: "Terhadap nyeri" },
      { s: 1, t: "Tidak ada respon" },
    ],
  },
  motor: {
    lt1: [
      { s: 6, t: "Gerak spontan" },
      { s: 5, t: "Melokalisir nyeri / menarik diri saat disentuh" },
      { s: 4, t: "Menarik diri terhadap nyeri" },
      { s: 3, t: "Fleksi abnormal (dekortikasi)" },
      { s: 2, t: "Ekstensi abnormal (deserebrasi)" },
      { s: 1, t: "Tidak ada respon" },
    ],
    ge1: [
      { s: 6, t: "Mengikuti perintah" },
      { s: 5, t: "Melokalisir nyeri" },
      { s: 4, t: "Fleksi-withdrawal" },
      { s: 3, t: "Fleksi abnormal (dekortikasi)" },
      { s: 2, t: "Ekstensi abnormal (deserebrasi)" },
      { s: 1, t: "Tidak ada respon" },
    ],
  },
  verbal: {
    lt2: [
      { s: 5, t: "Tersenyum, coos, atau babbling" },
      { s: 4, t: "Menangis tapi bisa ditenangkan" },
      { s: 3, t: "Menangis/menjerit terus-menerus" },
      { s: 2, t: "Grunts / agitated / gelisah" },
      { s: 1, t: "Tidak ada respon" },
    ],
    "2to5": [
      { s: 5, t: "Kata/frasa sesuai" },
      { s: 4, t: "Kata tidak sesuai" },
      { s: 3, t: "Menangis/menjerit terus-menerus" },
      { s: 2, t: "Grunts" },
      { s: 1, t: "Tidak ada respon" },
    ],
    gt5: [
      { s: 5, t: "Orientasi baik" },
      { s: 4, t: "Bingung / disorientasi" },
      { s: 3, t: "Kata tidak sesuai" },
      { s: 2, t: "Suara tak dapat dipahami" },
      { s: 1, t: "Tidak ada respon" },
    ],
  },
};

export function labelEM(a: GcsAgeEM): string {
  return a === "lt1" ? "<1 tahun" : ">1 tahun";
}
export function labelV(a: GcsAgeV): string {
  return a === "lt2" ? "<2 tahun" : a === "2to5" ? "2\u20135 tahun" : ">5 tahun";
}
export function gcsUsiaTeks(ub: number | null): string {
  if (ub == null || !isFinite(ub)) return "-";
  const th = Math.floor(ub / 12);
  const bl = ub % 12;
  return ub < 24 ? ub + " bln" : bl ? th + " th " + bl + " bln" : th + " th";
}

export function autoAgeEM(ub: number | null): GcsAgeEM | null {
  if (ub == null || !isFinite(ub)) return null;
  return ub < 12 ? "lt1" : "ge1";
}
export function autoAgeV(ub: number | null): GcsAgeV | null {
  if (ub == null || !isFinite(ub)) return null;
  return ub < 24 ? "lt2" : ub <= 60 ? "2to5" : "gt5";
}

export function gcsInfoText(
  ub: number | null,
  ageEM: GcsAgeEM,
  ageV: GcsAgeV,
): string {
  if (ub != null && isFinite(ub))
    return (
      "Usia " +
      gcsUsiaTeks(ub) +
      " \u00b7 Eye/Motor: " +
      labelEM(ageEM) +
      " \u00b7 Verbal: " +
      labelV(ageV)
    );
  return "Usia belum diisi di Profil Pasien \u2014 pilih kelompok usia manual.";
}

/** Hitung total & interpretasi pGCS — port verbatim dari v17. */
export function hitungGcs(state: GcsState): GcsResult {
  const e = state.eye;
  const m = state.motor;
  const v = state.tube ? null : state.verbal;
  const vTeks = state.tube ? "T" : v != null ? String(v) : DASH;
  const skorTeks =
    "E" + (e != null ? e : DASH) + " V" + vTeks + " M" + (m != null ? m : DASH);
  const lengkap = e != null && m != null && (state.tube || v != null);
  if (!lengkap) return { lengkap: false, skorTeks };
  const total = (e as number) + (m as number) + (state.tube ? 0 : (v as number));
  let lvl: "stabil" | "waspada" | "kritis";
  let kat: string;
  let saran: string;
  let totTeks: string;
  if (state.tube) {
    kat = "Verbal terintubasi (T)";
    saran =
      "E+M = " +
      total +
      " (verbal tidak dapat dinilai). Total GCS penuh tak dapat dihitung; pantau tren E & M.";
    lvl = total <= 4 ? "kritis" : total <= 8 ? "waspada" : "stabil";
    totTeks = skorTeks + " = " + total + "T";
  } else {
    if (total >= 13) {
      lvl = "stabil";
      kat = "Cedera ringan";
      saran = "cedera kepala ringan. Observasi & nilai ulang berkala.";
    } else if (total >= 9) {
      lvl = "waspada";
      kat = "Cedera sedang";
      saran =
        "cedera sedang. Pantau ketat, siapkan pencitraan & nilai ulang lebih sering.";
    } else {
      lvl = "kritis";
      kat = "Cedera berat";
      saran =
        "cedera berat. Pertimbangkan proteksi jalan napas/intubasi (GCS \u22648) & panggil bantuan segera.";
    }
    totTeks = skorTeks + " = " + total + "/15";
  }
  return { lengkap: true, total, lvl, kat, saran, totTeks, skorTeks };
}
