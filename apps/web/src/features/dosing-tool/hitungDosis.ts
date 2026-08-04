import { Obat, AgeBand, SediaanOption, pilihSediaanAktif } from "./dosisData";

export { pilihSediaanAktif };

export interface HasilPerhitungan {
  error: string | null;
  peringatan: string[];
  dosisMinMg: number | null;
  dosisMaxMg: number | null;
  dosisMinMl: number | null;
  dosisMaxMl: number | null;
  dosisHarianMinMg: number | null;
  dosisHarianMaxMg: number | null;
  beratBadan: number | null;
  usiaBulan: number | null;
  band: AgeBand | null;
  sedMgFinal?: number;
  sedMlFinal?: number;
  sediaanLabelFinal: string | null;
  doseBasisFinal: string;
  dosesPerDayFinal: number | null;
  dosisMinTablet: number | null;
  dosisMaxTablet: number | null;
  sedKekuatanMgFinal?: number;
  sedBentukFinal?: string | null;
}

/*
 * Hasil gagal yang bertipe penuh.
 *
 * WHY: sembilan cabang validasi dulu mengembalikan objek separuh isi lalu
 * dipaksa lolos dengan "as any". Cast itu mematikan pemeriksaan tipe justru di
 * jalur yang paling sering dilalui pengguna. Semua medan angka diisi null;
 * pemanggil memang wajib memeriksa "error" lebih dulu sebelum membaca medan
 * lain. Tidak ada satu pun angka, rumus, atau ambang dosis yang berubah.
 */
function hasilGagal(pesan: string): HasilPerhitungan {
  return {
    error: pesan,
    peringatan: [],
    dosisMinMg: null,
    dosisMaxMg: null,
    dosisMinMl: null,
    dosisMaxMl: null,
    dosisHarianMinMg: null,
    dosisHarianMaxMg: null,
    beratBadan: null,
    usiaBulan: null,
    band: null,
    sediaanLabelFinal: null,
    doseBasisFinal: "perDose",
    dosesPerDayFinal: null,
    dosisMinTablet: null,
    dosisMaxTablet: null,
  };
}

export function formatRentangDosis(
  min?: number | null,
  max?: number | null,
  unit: string = ""
): string {
  if (min === undefined || min === null || max === undefined || max === null) {
    return "Sesuai aturan dosis";
  }
  const fmt = (v: number) =>
    Number(v).toLocaleString("id-ID", { maximumFractionDigits: 2 });
  if (min === max) {
    return `${fmt(min)} ${unit}`.trim();
  }
  return `${fmt(min)}–${fmt(max)} ${unit}`.trim();
}

export function keteranganDosisAcuan(
  obat: Obat,
  hasil?: Partial<HasilPerhitungan>
): string {
  const band = hasil?.band;
  const basis = hasil?.doseBasisFinal || obat.doseBasis || "perDose";
  const basisLabel =
    basis === "perDay"
      ? "per hari"
      : basis === "singleDose"
        ? "dosis tunggal"
        : basis === "perEpisode"
          ? "per episode"
          : "per kali pemberian";

  if (obat.doseType === "perKg") {
    return formatRentangDosis(
      obat.dosisMinPerKg,
      obat.dosisMaxPerKg,
      obat.unitLabel || (basis === "perDay" ? "mg/kg/hari" : "mg/kg/kali")
    );
  }
  if (obat.doseType === "perKgVolume") {
    return formatRentangDosis(
      obat.volumeMinPerKg,
      obat.volumeMaxPerKg,
      obat.unitLabel || "mL/kg/episode"
    );
  }
  if (obat.doseType === "flat") {
    return formatRentangDosis(
      obat.dosisFlatMin,
      obat.dosisFlatMax,
      obat.unitLabel || ((obat.satuanDosis || "mg") + "/" + basisLabel)
    );
  }
  if (obat.doseType === "byAge") {
    const satuan = obat.satuanDosis || "mg";
    const ambang = obat.ambangUsiaBulan;
    return `<${ambang} bulan: ${formatRentangDosis(obat.dosisDibawahAmbangMg, obat.dosisDibawahAmbangMg, satuan)}; ≥${ambang} bulan: ${formatRentangDosis(obat.dosisDiatasAmbangMg, obat.dosisDiatasAmbangMg, satuan)} (${basisLabel})`;
  }
  if (obat.doseType === "ageBands" && band) {
    const label = band.labelUsia ? `${band.labelUsia}: ` : "";
    const bandBasis = band.doseBasis || basis;
    const bandBasisLabel =
      bandBasis === "perDay"
        ? "per hari"
        : bandBasis === "singleDose"
          ? "dosis tunggal"
          : bandBasis === "perEpisode"
            ? "per episode"
            : "per kali pemberian";
    if (band.tipe === "perKg") {
      return (
        label +
        formatRentangDosis(
          band.dosisMinPerKg,
          band.dosisMaxPerKg,
          band.unitLabel ||
            obat.unitLabel ||
            (bandBasis === "perDay" ? "mg/kg/hari" : "mg/kg/kali")
        )
      );
    }
    return (
      label +
      formatRentangDosis(
        band.dosisFlatMin,
        band.dosisFlatMax,
        band.unitLabel ||
          obat.unitLabel ||
          ((obat.satuanDosis || "mg") + "/" + bandBasisLabel)
      )
    );
  }
  return `Sesuai aturan dosis (${basisLabel})`;
}

export function hitungDosisInti(
  obat: Obat,
  beratBadanInput?: string | number,
  usiaBulanInput?: string | number,
  sediaanIndexInput?: string | number
): HasilPerhitungan {
  const peringatan: string[] = [];
  let dosisMinMg: number | null = null;
  let dosisMaxMg: number | null = null;
  let dosisMinMl: number | null = null;
  let dosisMaxMl: number | null = null;
  let dosisHarianMinMg: number | null = null;
  let dosisHarianMaxMg: number | null = null;
  let dosisMinTablet: number | null = null;
  let dosisMaxTablet: number | null = null;

  let beratBadan: number | null = null;
  let usiaBulan: number | null = null;
  let band: AgeBand | null = null;

  const sediaanAktif: SediaanOption | null = pilihSediaanAktif(obat, sediaanIndexInput);
  // Bila sebuah sediaan dipilih, pakai HANYA nilai milik sediaan tersebut.
  // Memakai "??" membuat opsi tablet mewarisi mL sirup sehingga volume salah dihitung.
  let sedMgFinal: number | undefined = sediaanAktif
    ? sediaanAktif.sediaanMg
    : obat.sediaanMg;
  let sedMlFinal: number | undefined = sediaanAktif
    ? sediaanAktif.sediaanMl
    : obat.sediaanMl;
  const sedKekuatanMgFinal: number | undefined = sediaanAktif?.kekuatanMg;
  const sedBentukFinal: string | null = sediaanAktif?.bentuk || null;
  let sediaanLabelFinal: string | null = sediaanAktif?.label || null;

  let doseBasisFinal =
    obat.doseBasis ||
    (String(obat.unitLabel || "").toLowerCase().includes("/hari")
      ? "perDay"
      : "perDose");
  let dosesPerDayFinal = obat.dosesPerDay || obat.maxDosesPerDay || null;

  const batasHarianMg = (): number | null => {
    // Semua batas yang berlaku dikumpulkan, lalu diambil yang TERKECIL.
    const batas: number[] = [];
    if (obat.dosisMaksimalHarianMg) batas.push(obat.dosisMaksimalHarianMg);
    if (obat.dosisMaksimalHarianPerKg && isFinite(beratBadan as number))
      batas.push(obat.dosisMaksimalHarianPerKg * (beratBadan as number));
    if (band && band.dosisMaksimalHarianMg) batas.push(band.dosisMaksimalHarianMg);
    return batas.length ? Math.min(...batas) : null;
  };

  const batasTunggalMg = (): number | null => {
    // Batas milik kelompok usia (band) diutamakan di atas batas umum obat.
    return (
      (band && band.dosisMaksimalTunggalMg) || obat.dosisMaksimalTunggalMg || null
    );
  };

  const batasiDosisTunggal = () => {
    const maxSingle = batasTunggalMg();
    if (maxSingle && dosisMaxMg !== null && dosisMaxMg > maxSingle) {
      peringatan.push(
        `Hasil perhitungan (${dosisMaxMg.toFixed(1)} ${obat.satuanDosis || "mg"}) melebihi dosis maksimal per kali (${maxSingle} ${obat.satuanDosis || "mg"}), sehingga nilai atas dibatasi.`
      );
      dosisMaxMg = maxSingle;
      if (dosisMinMg !== null && dosisMinMg > dosisMaxMg) dosisMinMg = dosisMaxMg;
    }
  };

  const batasiDosisHarian = () => {
    const maxDaily = batasHarianMg();
    if (maxDaily && dosisHarianMaxMg !== null && dosisHarianMaxMg > maxDaily) {
      peringatan.push(
        `Total dosis harian hasil perhitungan (${dosisHarianMaxMg.toFixed(1)} ${obat.satuanDosis || "mg"}/hari) melebihi batas harian (${maxDaily.toFixed(1)} ${obat.satuanDosis || "mg"}/hari), sehingga nilai atas dibatasi.`
      );
      dosisHarianMaxMg = maxDaily;
      if (dosisHarianMinMg !== null && dosisHarianMinMg > dosisHarianMaxMg)
        dosisHarianMinMg = dosisHarianMaxMg;
    }
  };

  const hitungMlDariSediaan = () => {
    if (sedKekuatanMgFinal && !sedMlFinal && dosisMinMg !== null && dosisMaxMg !== null) {
      dosisMinTablet = dosisMinMg / sedKekuatanMgFinal;
      dosisMaxTablet = dosisMaxMg / sedKekuatanMgFinal;
      return;
    }
    if (sedMgFinal && sedMlFinal && dosisMinMg !== null && dosisMaxMg !== null) {
      const mgPerMl = sedMgFinal / sedMlFinal;
      dosisMinMl = dosisMinMg / mgPerMl;
      dosisMaxMl = dosisMaxMg / mgPerMl;
    }
  };

  const cekBatasHarianDariDosisPerKali = () => {
    const maxDaily = batasHarianMg();
    const maxDoses = obat.maxDosesPerDay || (band && band.maxDosesPerDay) || null;
    if (maxDaily && maxDoses && dosisMaxMg !== null && dosisMaxMg * maxDoses > maxDaily) {
      peringatan.push(
        `Jika dosis atas diberikan ${maxDoses} kali/hari, totalnya dapat melebihi batas harian (${maxDaily.toFixed(1)} ${obat.satuanDosis || "mg"}/hari). Kurangi jumlah pemberian atau gunakan dosis lebih rendah sesuai instruksi dokter.`
      );
    }
  };

  if (obat.doseType === "byAge") {
    usiaBulan = parseFloat(String(usiaBulanInput ?? ""));
    if (isNaN(usiaBulan) || usiaBulan < 0) {
      return hasilGagal("Mohon masukkan usia anak yang valid (dalam bulan).");
    }
    if (usiaBulan > 216) {
      return hasilGagal("Usia tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.");
    }
    if (obat.usiaMinValidBulan !== undefined && usiaBulan < obat.usiaMinValidBulan) {
      peringatan.push(
        `Usia di bawah rentang indikasi umum obat ini (mulai usia ${obat.usiaMinValidBulan} bulan). Mohon konsultasikan ke dokter.`
      );
    }
    if (obat.usiaMaxValidBulan !== undefined && usiaBulan > obat.usiaMaxValidBulan) {
      peringatan.push(
        `Usia di atas rentang indikasi umum obat ini (hingga usia ${obat.usiaMaxValidBulan} bulan). Mohon konsultasikan ke dokter.`
      );
    }

    const dosisTetapMg =
      usiaBulan < (obat.ambangUsiaBulan || 0)
        ? (obat.dosisDibawahAmbangMg || 0)
        : (obat.dosisDiatasAmbangMg || 0);

    if (doseBasisFinal === "perDay") {
      dosisHarianMinMg = dosisTetapMg;
      dosisHarianMaxMg = dosisTetapMg;
      batasiDosisHarian();
      dosisMinMg = dosisHarianMinMg;
      dosisMaxMg = dosisHarianMaxMg;
    } else {
      dosisMinMg = dosisTetapMg;
      dosisMaxMg = dosisTetapMg;
      batasiDosisTunggal();
      cekBatasHarianDariDosisPerKali();
    }
    hitungMlDariSediaan();
  } else if (obat.doseType === "ageBands") {
    usiaBulan = parseFloat(String(usiaBulanInput ?? ""));
    if (isNaN(usiaBulan) || usiaBulan < 0) {
      return hasilGagal("Mohon masukkan usia anak yang valid (dalam bulan).");
    }
    if (usiaBulan > 216) {
      return hasilGagal("Usia tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.");
    }
    band = (obat.bands || []).find(
      (b) => usiaBulan! >= b.usiaMinBulan && usiaBulan! <= b.usiaMaxBulan
    ) || null;

    if (!band) {
      return hasilGagal(
        "Tidak ada rekomendasi dosis untuk usia tersebut pada kalkulator ini. Mohon konsultasikan ke dokter.",
      );
    }
    doseBasisFinal = band.doseBasis || doseBasisFinal;
    dosesPerDayFinal = band.dosesPerDay || band.maxDosesPerDay || dosesPerDayFinal;
    if (band.sediaanMg || band.sediaanMl) {
      sedMgFinal = band.sediaanMg || sedMgFinal;
      sedMlFinal = band.sediaanMl || sedMlFinal;
      sediaanLabelFinal = band.sediaanLabel || null;
    }

    if (band.tipe === "perKg") {
      beratBadan = parseFloat(String(beratBadanInput ?? ""));
      if (isNaN(beratBadan) || beratBadan <= 0) {
        return hasilGagal("Mohon masukkan berat badan yang valid (lebih dari 0 kg) untuk kelompok usia ini.");
      }
      if (beratBadan > 150) {
        return hasilGagal("Berat badan tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.");
      }
      if (doseBasisFinal === "perDay") {
        dosisHarianMinMg = (band.dosisMinPerKg || 0) * beratBadan;
        dosisHarianMaxMg = (band.dosisMaxPerKg || 0) * beratBadan;
        batasiDosisHarian();
        const pembagi = dosesPerDayFinal || 1;
        dosisMinMg = dosisHarianMinMg! / pembagi;
        dosisMaxMg = dosisHarianMaxMg! / pembagi;
      } else {
        dosisMinMg = (band.dosisMinPerKg || 0) * beratBadan;
        dosisMaxMg = (band.dosisMaxPerKg || 0) * beratBadan;
        batasiDosisTunggal();
        cekBatasHarianDariDosisPerKali();
      }
    } else {
      if (doseBasisFinal === "perDay") {
        dosisHarianMinMg = band.dosisFlatMin || 0;
        dosisHarianMaxMg = band.dosisFlatMax || 0;
        batasiDosisHarian();
        const pembagi = dosesPerDayFinal || 1;
        dosisMinMg = dosisHarianMinMg! / pembagi;
        dosisMaxMg = dosisHarianMaxMg! / pembagi;
      } else {
        dosisMinMg = band.dosisFlatMin || 0;
        dosisMaxMg = band.dosisFlatMax || 0;
        batasiDosisTunggal();
        cekBatasHarianDariDosisPerKali();
      }
    }
    hitungMlDariSediaan();
  } else {
    beratBadan = parseFloat(String(beratBadanInput ?? ""));
    if (isNaN(beratBadan) || beratBadan <= 0) {
      return hasilGagal("Mohon masukkan berat badan yang valid (lebih dari 0 kg).");
    }
    if (beratBadan > 150) {
      return hasilGagal("Berat badan tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda.");
    }

    if (obat.doseType === "flat") {
      if (doseBasisFinal === "perDay") {
        dosisHarianMinMg = obat.dosisFlatMin || 0;
        dosisHarianMaxMg = obat.dosisFlatMax || 0;
        batasiDosisHarian();
        const pembagi = dosesPerDayFinal || 1;
        dosisMinMg = dosisHarianMinMg! / pembagi;
        dosisMaxMg = dosisHarianMaxMg! / pembagi;
      } else {
        dosisMinMg = obat.dosisFlatMin || 0;
        dosisMaxMg = obat.dosisFlatMax || 0;
        batasiDosisTunggal();
        cekBatasHarianDariDosisPerKali();
      }
      hitungMlDariSediaan();
    } else if (obat.doseType === "perKgVolume") {
      dosisMinMl = (obat.volumeMinPerKg || 0) * beratBadan;
      dosisMaxMl = (obat.volumeMaxPerKg || 0) * beratBadan;
      doseBasisFinal = obat.doseBasis || "perEpisode";
    } else {
      if (doseBasisFinal === "perDay") {
        dosisHarianMinMg = (obat.dosisMinPerKg || 0) * beratBadan;
        dosisHarianMaxMg = (obat.dosisMaxPerKg || 0) * beratBadan;
        batasiDosisHarian();
        const pembagi = dosesPerDayFinal || 1;
        dosisMinMg = dosisHarianMinMg! / pembagi;
        dosisMaxMg = dosisHarianMaxMg! / pembagi;
      } else {
        dosisMinMg = (obat.dosisMinPerKg || 0) * beratBadan;
        dosisMaxMg = (obat.dosisMaxPerKg || 0) * beratBadan;
        batasiDosisTunggal();
        cekBatasHarianDariDosisPerKali();
      }
      hitungMlDariSediaan();
    }
  }

  const bbCek = parseFloat(String(beratBadanInput ?? ""));
  const usiaCek = parseFloat(String(usiaBulanInput ?? ""));
  if (isFinite(bbCek) && bbCek > 0) {
    if (bbCek < 2) {
      peringatan.push(`Berat badan ${bbCek} kg sangat rendah — pastikan satuannya kg (bukan gram) dan bukan salah ketik.`);
    } else if (bbCek > 60) {
      peringatan.push(`Berat badan ${bbCek} kg tergolong tinggi untuk pasien anak — pastikan bukan salah ketik (mis. 45 kg vs 4,5 kg) sebelum memberikan dosis.`);
    }
    if (isFinite(usiaCek) && usiaCek >= 0) {
      const perkiraanBB =
        usiaCek <= 12
          ? (usiaCek + 9) / 2
          : usiaCek <= 60
            ? 2 * (usiaCek / 12) + 8
            : 3 * (usiaCek / 12) + 7;
      if (perkiraanBB > 0 && (bbCek > perkiraanBB * 2.2 || bbCek < perkiraanBB * 0.45)) {
        peringatan.push(`Berat ${bbCek} kg tampak tidak sesuai untuk usia ${usiaCek} bulan (perkiraan ±${perkiraanBB.toFixed(1)} kg). Periksa kembali input sebelum memakai hasil.`);
      }
    }
  }

  const punyaCap = !!(
    obat.dosisMaksimalTunggalMg ||
    obat.dosisMaksimalHarianMg ||
    obat.dosisMaksimalHarianPerKg ||
    (band && (band.dosisMaksimalTunggalMg || band.dosisMaksimalHarianMg))
  );
  const scalesPerKg =
    obat.doseType === "ageBands"
      ? band && band.tipe === "perKg"
      : obat.doseType !== "flat" && obat.doseType !== "byAge" && obat.doseType !== "perKgVolume";

  if (!punyaCap && scalesPerKg && beratBadan !== null && isFinite(beratBadan)) {
    peringatan.push("Obat ini belum memiliki batas dosis maksimum absolut di basis data, padahal dosis dihitung per kg berat badan. Untuk anak dengan berat besar, verifikasi manual agar tidak melebihi dosis dewasa.");
  }

  return {
    error: null,
    peringatan,
    dosisMinMg,
    dosisMaxMg,
    dosisMinMl,
    dosisMaxMl,
    dosisHarianMinMg,
    dosisHarianMaxMg,
    beratBadan,
    usiaBulan,
    band,
    sedMgFinal,
    sedMlFinal,
    sediaanLabelFinal,
    doseBasisFinal,
    dosesPerDayFinal,
    dosisMinTablet,
    dosisMaxTablet,
    sedKekuatanMgFinal,
    sedBentukFinal
  };
}
