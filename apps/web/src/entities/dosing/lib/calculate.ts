import {
  calculateDosing,
  isDosingError,
  type Obat,
} from "@tinyverse/clinical-core";
import type { DisplayRow, DosingView } from "../model/types";

function bulat1(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

function rentang(
  min: number | null,
  max: number | null,
  satuan: string,
): string {
  if (min === null && max === null) return "—";
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? 0;
  if (lo === hi) return `${bulat1(lo)} ${satuan}`;
  return `${bulat1(lo)}–${bulat1(hi)} ${satuan}`;
}

function labelBasis(basis: string | undefined): string {
  switch (basis) {
    case "perDay":
      return "per hari";
    case "singleDose":
      return "dosis tunggal";
    case "perEpisode":
      return "per episode";
    case "perDose":
      return "per kali";
    default:
      return "";
  }
}

export function viewDosing(
  obat: Obat,
  beratBadanInput: string,
  usiaBulanInput: string,
  sediaanIndexInput: string,
): DosingView {
  const output = calculateDosing(
    obat,
    beratBadanInput,
    usiaBulanInput,
    sediaanIndexInput,
  );

  if (isDosingError(output)) {
    return { rows: [], peringatan: [], error: output.error };
  }

  const basis = labelBasis(output.doseBasisFinal);
  const rows: DisplayRow[] = [];

  if (output.dosisMinMg !== null || output.dosisMaxMg !== null) {
    rows.push({
      label: basis ? `Dosis (${basis})` : "Dosis",
      value: rentang(output.dosisMinMg, output.dosisMaxMg, "mg"),
    });
  }

  if (output.dosisMinMl !== null || output.dosisMaxMl !== null) {
    const sediaan = output.sediaanLabelFinal
      ? ` — ${output.sediaanLabelFinal}`
      : "";
    rows.push({
      label: basis ? `Volume (${basis})` : "Volume",
      value: rentang(output.dosisMinMl, output.dosisMaxMl, "mL") + sediaan,
    });
  }

  if (output.dosisHarianMinMg !== null || output.dosisHarianMaxMg !== null) {
    rows.push({
      label: "Total per hari",
      value: rentang(output.dosisHarianMinMg, output.dosisHarianMaxMg, "mg"),
    });
  }

  if (output.dosesPerDayFinal) {
    rows.push({
      label: "Frekuensi",
      value: `${output.dosesPerDayFinal}× sehari`,
    });
  }

  if (output.band?.labelUsia) {
    rows.push({
      label: "Kelompok usia terpakai",
      value: output.band.labelUsia,
    });
  }

  return { rows, peringatan: output.peringatan, error: null };
}
