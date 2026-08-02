import {
  calculateAtlsBurnResuscitation,
  calculateBurnResuscitation,
  dripRate,
  DRIP_LABEL,
  DROP_FACTOR,
  type BurnArea,
  type DripType,
} from "@tinyverse/clinical-core";
import type {
  BurnAtlsOptions,
  BurnAtlsView,
  BurnView,
  DisplayRow,
} from "../model/types";

function bulat0(n: number): string {
  return Math.round(n).toString();
}

function bulat1(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

function maintenanceRincian(weightKg: number): string[] {
  const rincian: string[] = [];
  if (weightKg <= 10) {
    rincian.push(
      `${bulat0(weightKg)} kg \u00d7 100 mL = ${bulat0(weightKg * 100)} mL`,
    );
  } else if (weightKg <= 20) {
    rincian.push(`10 kg \u00d7 100 mL = 1000 mL`);
    rincian.push(
      `${bulat0(weightKg - 10)} kg \u00d7 50 mL = ${bulat0((weightKg - 10) * 50)} mL`,
    );
  } else {
    rincian.push(`10 kg \u00d7 100 mL = 1000 mL`);
    rincian.push(`10 kg \u00d7 50 mL = 500 mL`);
    rincian.push(
      `${bulat0(weightKg - 20)} kg \u00d7 20 mL = ${bulat0((weightKg - 20) * 20)} mL`,
    );
  }
  return rincian;
}

/** Rincian 4-2-1 sebagai satu baris pendek, mis. "4x10 + 2x5 = 50 mL/jam". */
function rincian421(weightKg: number): string {
  if (weightKg <= 10) {
    return `4 \u00d7 ${bulat1(weightKg)} = ${bulat0(weightKg * 4)} mL/jam`;
  }
  if (weightKg <= 20) {
    const sisa = weightKg - 10;
    return `4 \u00d7 10 + 2 \u00d7 ${bulat1(sisa)} = ${bulat0(40 + sisa * 2)} mL/jam`;
  }
  const sisa = weightKg - 20;
  return `4 \u00d7 10 + 2 \u00d7 10 + 1 \u00d7 ${bulat1(sisa)} = ${bulat0(60 + sisa)} mL/jam`;
}

/** Tetes per menit, atau null bila volume/lama tidak masuk akal. */
function tetes(volumeMl: number, jam: number, dripType: DripType): number | null {
  if (!(volumeMl > 0) || !(jam > 0)) return null;
  try {
    return dripRate(volumeMl, jam, dripType).gttPerMin;
  } catch {
    return null;
  }
}

function angkaOpsional(teks: string | undefined): number {
  if (teks === undefined) return 0;
  const trim = teks.trim();
  if (trim === "") return 0;
  const n = Number(trim);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/**
 * Adapter lapisan entity: membungkus calculateBurnResuscitation (clinical-core)
 * menjadi baris tampilan siap-render. Pembulatan tampilan (mL bulat, %TBSA 1
 * desimal) hidup DI SINI, bukan di core (core tetap murni, angka mentah).
 *
 * Blok `atls` ditambahkan berdampingan dengan blok Parkland lama. Parkland
 * TIDAK dihapus dari core karena dikunci golden fixture, tetapi UI kini
 * menampilkan kerangka ATLS sebagai angka utama.
 */
export function viewBurn(
  areas: ReadonlyArray<BurnArea>,
  ageInput: string,
  weightInput: string,
  opts: BurnAtlsOptions = {},
): BurnView {
  const ageTrim = ageInput.trim();
  const weightTrim = weightInput.trim();

  const empty: BurnView = {
    rows: [],
    tbsaPercent: 0,
    selectedCount: areas.length,
    error: null,
    chart: null,
    areas: [],
    parkland: 0,
    first8h: 0,
    next16h: 0,
    maintenance: 0,
    maintenanceRincian: [],
    total24h: 0,
    urineMin: 0,
    urineMax: 0,
    urineLabel: "",
    weightKg: 0,
    atls: null,
  };

  if (ageTrim === "" || weightTrim === "") {
    return empty;
  }

  const ageYears = Number(ageTrim);
  const weightKg = Number(weightTrim);

  try {
    const r = calculateBurnResuscitation(areas, ageYears, weightKg);

    const mekanisme = opts.mekanisme ?? "termal";
    const dripType: DripType = opts.dripType ?? "makro";
    const faktorTetes = DROP_FACTOR[dripType];

    let atls: BurnAtlsView | null = null;
    if (r.tbsaPercent > 0) {
      const a = calculateAtlsBurnResuscitation({
        weightKg: r.weightKg,
        tbsaPercent: r.tbsaPercent,
        ageYears,
        mechanism: mekanisme,
        hoursSinceInjury: angkaOpsional(opts.jamSejakKejadian),
        preHospitalMl: angkaOpsional(opts.praRsMl),
      });
      const jamFase1 = a.remainingFirstPhaseHours > 0 ? a.remainingFirstPhaseHours : 1;
      atls = {
        faktor: a.factorMlPerKgPerTbsa,
        faktorAlasan: a.factorReason,
        mekanisme: a.mechanism,
        total24h: a.totalMlPer24h,
        fase1Ml: a.firstPhaseMl,
        fase2Ml: a.secondPhaseMl,
        jamSejakKejadian: a.hoursSinceInjury,
        sisaJamFase1: a.remainingFirstPhaseHours,
        fase1Terlewat: a.firstPhaseElapsed,
        praRsMl: a.preHospitalMl,
        fase1SisaMl: a.firstPhaseRemainingMl,
        fase1LajuMlPerJam: a.firstPhaseRateMlPerHour,
        fase2LajuMlPerJam: a.secondPhaseRateMlPerHour,
        rumatanBerlaku: a.maintenanceApplies,
        rumatanMlPerJam: a.maintenanceMlPerHour,
        rumatanRincian: a.maintenanceApplies ? rincian421(r.weightKg) : "",
        urinMin: a.urineTargetMinMlPerHour,
        urinMax: a.urineTargetMaxMlPerHour,
        urinLabel: a.urineTargetLabel,
        batasCreepMlPerJam: a.fluidCreepRateMlPerHour,
        melampauiCreep: a.exceedsFluidCreep,
        faktorTetes,
        dripLabel: DRIP_LABEL[dripType],
        tetesFase1: tetes(a.firstPhaseRemainingMl, jamFase1, dripType),
        tetesFase2: tetes(a.secondPhaseMl, 16, dripType),
        tetesRumatan: a.maintenanceApplies
          ? tetes(a.maintenanceMlPerHour, 1, dripType)
          : null,
      };
    }

    const rows: DisplayRow[] = [
      { label: "Chart Lund-Browder", value: r.chart.label },
      { label: "Luas luka (%TBSA)", value: `${bulat1(r.tbsaPercent)}%` },
    ];
    if (atls) {
      rows.push(
        {
          label: "Faktor ATLS",
          value: `${atls.faktor} mL/kg/%TBSA \u2014 ${atls.faktorAlasan}`,
        },
        { label: "Resusitasi 24 jam", value: `${bulat0(atls.total24h)} mL` },
        { label: "Cairan pilihan", value: "Ringer Laktat (RL) hangat" },
        {
          label: "Laju 8 jam pertama",
          value: `${bulat0(atls.fase1LajuMlPerJam)} mL/jam`,
        },
        {
          label: "Laju 16 jam berikutnya",
          value: `${bulat0(atls.fase2LajuMlPerJam)} mL/jam`,
        },
      );
      if (atls.rumatanBerlaku) {
        rows.push({
          label: "Rumatan dekstrosa (4-2-1)",
          value: `${bulat0(atls.rumatanMlPerJam)} mL/jam, jalur terpisah`,
        });
      }
      rows.push({
        label: "Target produksi urin",
        value: `${atls.urinLabel} (${bulat1(atls.urinMin)}\u2013${bulat1(atls.urinMax)} mL/jam)`,
      });
    }

    return {
      rows,
      tbsaPercent: r.tbsaPercent,
      selectedCount: areas.length,
      error: null,
      chart: r.chart,
      areas: r.contributions.map((c) => ({
        label: c.label,
        percent: c.percent,
      })),
      parkland: r.parklandMlPer24h,
      first8h: r.first8hMl,
      next16h: r.next16hMl,
      maintenance: r.maintenanceMlPerDay,
      maintenanceRincian: maintenanceRincian(r.weightKg),
      total24h: r.total24hMl,
      urineMin: r.urineTargetMinMlPerHour,
      urineMax: r.urineTargetMaxMlPerHour,
      urineLabel: r.urineTargetLabel,
      weightKg: r.weightKg,
      atls,
    };
  } catch (e) {
    const pesan = e instanceof Error ? e.message : "Input tidak valid.";
    return { ...empty, error: pesan };
  }
}
