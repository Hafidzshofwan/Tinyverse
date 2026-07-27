export type ValidationAlert = {
  field: "bb" | "tb" | "format";
  level: "warning" | "error";
  title: string;
  message: string;
  suggestedValue?: string;
  suggestionLabel?: string;
};

export function validateAntropometri(
  bbInput: string,
  tbInput: string,
  usiaBulanInput?: string | number | null
): ValidationAlert[] {
  const alerts: ValidationAlert[] = [];
  const uBulan =
    typeof usiaBulanInput === "number"
      ? usiaBulanInput
      : usiaBulanInput
      ? parseFloat(String(usiaBulanInput))
      : null;

  // 1. Format check: Comma used instead of dot
  if (bbInput.includes(",")) {
    const fixed = bbInput.replace(",", ".");
    if (!isNaN(parseFloat(fixed))) {
      alerts.push({
        field: "bb",
        level: "warning",
        title: "Format Angka Desimal Koma (,)",
        message: "Sistem mendeteksi karakter koma pada Berat Badan.",
        suggestedValue: fixed,
        suggestionLabel: `Konversi BB ke ${fixed} kg`,
      });
    }
  }

  if (tbInput.includes(",")) {
    const fixed = tbInput.replace(",", ".");
    if (!isNaN(parseFloat(fixed))) {
      alerts.push({
        field: "tb",
        level: "warning",
        title: "Format Angka Desimal Koma (,)",
        message: "Sistem mendeteksi karakter koma pada Tinggi Badan.",
        suggestedValue: fixed,
        suggestionLabel: `Konversi TB ke ${fixed} cm`,
      });
    }
  }

  const bbVal = parseFloat(bbInput.replace(",", "."));
  const tbVal = parseFloat(tbInput.replace(",", "."));

  // 2. BB Outlier / Typo Checks
  if (!isNaN(bbVal)) {
    if (bbVal <= 0) {
      alerts.push({
        field: "bb",
        level: "error",
        title: "Berat Badan Tidak Valid",
        message: "Berat badan harus bernilai lebih besar dari 0 kg.",
      });
    } else if (bbVal > 150) {
      const divided10 = (bbVal / 10).toFixed(1).replace(/\.0$/, "");
      const divided100 = (bbVal / 100).toFixed(1).replace(/\.0$/, "");
      const suggested = bbVal > 500 ? divided100 : divided10;
      alerts.push({
        field: "bb",
        level: "warning",
        title: "Peringatan Outlier Berat Badan",
        message: `Berat badan ${bbVal} kg terdeteksi sangat tinggi/outlier. Periksa kesalahan ketik desimal.`,
        suggestedValue: suggested,
        suggestionLabel: `Perbaiki BB ke ${suggested} kg`,
      });
    } else if (uBulan !== null && !isNaN(uBulan)) {
      if (uBulan < 12 && bbVal > 25) {
        const div = (bbVal / 10).toFixed(1).replace(/\.0$/, "");
        alerts.push({
          field: "bb",
          level: "warning",
          title: "Periksa Nilai Berat Badan",
          message: `BB ${bbVal} kg sangat tinggi untuk bayi usia ${uBulan} bulan.`,
          suggestedValue: div,
          suggestionLabel: `Ubah BB ke ${div} kg`,
        });
      } else if (uBulan < 60 && bbVal > 60) {
        const div = (bbVal / 10).toFixed(1).replace(/\.0$/, "");
        alerts.push({
          field: "bb",
          level: "warning",
          title: "Periksa Nilai Berat Badan",
          message: `BB ${bbVal} kg melebihi perkiraan wajar untuk anak usia ${Math.floor(
            uBulan / 12
          )} tahun.`,
          suggestedValue: div,
          suggestionLabel: `Ubah BB ke ${div} kg`,
        });
      } else if (uBulan > 12 && bbVal < 1) {
        alerts.push({
          field: "bb",
          level: "warning",
          title: "BB Terlalu Rendah",
          message: `BB ${bbVal} kg tampak sangat kecil untuk anak usia ${uBulan} bulan.`,
        });
      }
    }
  }

  // 3. TB Outlier / Typo Checks
  if (!isNaN(tbVal)) {
    if (tbVal <= 0) {
      alerts.push({
        field: "tb",
        level: "error",
        title: "Tinggi Badan Tidak Valid",
        message: "Tinggi/Panjang badan harus bernilai lebih besar dari 0 cm.",
      });
    } else if (tbVal > 220) {
      const div10 = (tbVal / 10).toFixed(1).replace(/\.0$/, "");
      alerts.push({
        field: "tb",
        level: "warning",
        title: "Peringatan Outlier Tinggi Badan",
        message: `Tinggi/panjang badan ${tbVal} cm terdeteksi melampaui batas wajar. Periksa kemungkinan typo.`,
        suggestedValue: div10,
        suggestionLabel: `Perbaiki TB ke ${div10} cm`,
      });
    } else if (tbVal < 20) {
      alerts.push({
        field: "tb",
        level: "warning",
        title: "Tinggi Badan Sangat Pendek",
        message: `Tinggi/panjang badan ${tbVal} cm tampak sangat kecil. Pastikan satuan dalam centimeter (cm).`,
      });
    } else if (uBulan !== null && !isNaN(uBulan)) {
      if (uBulan < 12 && tbVal > 110) {
        const div10 = (tbVal / 10).toFixed(1).replace(/\.0$/, "");
        alerts.push({
          field: "tb",
          level: "warning",
          title: "Periksa Tinggi Badan",
          message: `TB/PB ${tbVal} cm sangat tinggi untuk bayi usia ${uBulan} bulan.`,
          suggestedValue: div10,
          suggestionLabel: `Ubah TB ke ${div10} cm`,
        });
      }
    }
  }

  // 4. Implausible Weight / Height Ratio Check
  if (!isNaN(bbVal) && !isNaN(tbVal) && bbVal > 0 && tbVal > 0) {
    const imt = bbVal / ((tbVal / 100) * (tbVal / 100));
    if (imt > 60) {
      alerts.push({
        field: "format",
        level: "warning",
        title: "Rasio BB vs TB Outlier",
        message: `Indeks Massa Tubuh (${imt.toFixed(
          1
        )} kg/m²) terhitung ekstrem. Harap periksa ulang rasio BB (${bbVal} kg) dan TB (${tbVal} cm).`,
      });
    }
  }

  return alerts;
}
