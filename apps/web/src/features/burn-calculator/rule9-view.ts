import {
  calculateAtlsBurnResuscitation,
  dripRate,
  DRIP_LABEL,
  ruleOfNinesTbsa,
  type BurnMechanism,
  type DripType,
  type RuleOfNinesArea,
} from "@tinyverse/clinical-core";

/*
 * WHY berkas ini duduk di lapisan fitur, bukan di entities/burn:
 * entities/burn adalah milik alur Lund & Browder dan tidak boleh ikut
 * berubah. Rule of Nines punya jalur hitung sendiri dari ujung ke ujung.
 */

export type Rule9Options = {
  mekanisme?: BurnMechanism;
  jamSejakKejadian?: string;
  praRsMl?: string;
  dripType?: DripType;
};

export type Rule9Atls = {
  faktor: number;
  faktorAlasan: string;
  total24h: number;
  fase1Ml: number;
  fase2Ml: number;
  jamSejakKejadian: number;
  sisaJamFase1: number;
  fase1Terlewat: boolean;
  praRsMl: number;
  fase1SisaMl: number;
  fase1LajuMlPerJam: number;
  fase2LajuMlPerJam: number;
  rumatanBerlaku: boolean;
  rumatanMlPerJam: number;
  rumatanRincian: string;
  urinMin: number;
  urinMax: number;
  urinLabel: string;
  batasCreepMlPerJam: number;
  melampauiCreep: boolean;
  dripLabel: string;
  tetesFase1: number | null;
  tetesFase2: number | null;
  tetesRumatan: number | null;
};

export type Rule9View = {
  error: string | null;
  chartLabel: string;
  tbsaPercent: number;
  kontribusi: ReadonlyArray<{ label: string; percent: number }>;
  atls: Rule9Atls | null;
  rows: ReadonlyArray<{ label: string; value: string }>;
};

function bulat0(n: number): number {
  return Math.round(n);
}

function angkaOpsional(teks: string | undefined): number {
  if (teks == null || teks.trim() === "") return 0;
  const n = Number(teks);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function rincian421(weightKg: number): string {
  if (weightKg <= 10) return `4 x ${weightKg}`;
  if (weightKg <= 20) return `4 x 10 + 2 x ${Math.round((weightKg - 10) * 10) / 10}`;
  return `4 x 10 + 2 x 10 + 1 x ${Math.round((weightKg - 20) * 10) / 10}`;
}

function tetes(
  volumeMl: number,
  jam: number,
  dripType: DripType,
): number | null {
  try {
    return dripRate(volumeMl, jam, dripType).gttPerMin;
  } catch {
    return null;
  }
}

export function viewRule9(
  areas: ReadonlyArray<RuleOfNinesArea>,
  ageInput: string,
  weightInput: string,
  opts: Rule9Options = {},
): Rule9View {
  const usia = Number(ageInput);
  const berat = Number(weightInput);
  const mekanisme: BurnMechanism = opts.mekanisme ?? "termal";
  const dripType: DripType = opts.dripType ?? "makro";

  const luas = ruleOfNinesTbsa(areas, usia);
  const kontribusi = luas.contributions.map((c) => ({
    label: c.label,
    percent: c.percent,
  }));

  const kosong: Rule9View = {
    error: null,
    chartLabel: luas.chart.label,
    tbsaPercent: luas.tbsaPercent,
    kontribusi,
    atls: null,
    rows: [],
  };

  if (ageInput.trim() === "" || weightInput.trim() === "") return kosong;
  if (!Number.isFinite(usia) || usia < 0) {
    return { ...kosong, error: "Usia belum diisi dengan benar." };
  }
  if (!Number.isFinite(berat) || berat <= 0) {
    return { ...kosong, error: "Berat badan harus lebih dari 0 kg." };
  }
  if (luas.tbsaPercent === 0) return kosong;

  try {
    const r = calculateAtlsBurnResuscitation({
      weightKg: berat,
      tbsaPercent: luas.tbsaPercent,
      ageYears: usia,
      mechanism: mekanisme,
      hoursSinceInjury: angkaOpsional(opts.jamSejakKejadian),
      preHospitalMl: angkaOpsional(opts.praRsMl),
    });

    const atls: Rule9Atls = {
      faktor: r.factorMlPerKgPerTbsa,
      faktorAlasan: r.factorReason,
      total24h: r.totalMlPer24h,
      fase1Ml: r.firstPhaseMl,
      fase2Ml: r.secondPhaseMl,
      jamSejakKejadian: r.hoursSinceInjury,
      sisaJamFase1: r.remainingFirstPhaseHours,
      fase1Terlewat: r.firstPhaseElapsed,
      praRsMl: r.preHospitalMl,
      fase1SisaMl: r.firstPhaseRemainingMl,
      fase1LajuMlPerJam: r.firstPhaseRateMlPerHour,
      fase2LajuMlPerJam: r.secondPhaseRateMlPerHour,
      rumatanBerlaku: r.maintenanceApplies,
      rumatanMlPerJam: r.maintenanceMlPerHour,
      rumatanRincian: `${rincian421(berat)} = ${Math.round(r.maintenanceMlPerHour * 10) / 10} mL/jam`,
      urinMin: r.urineTargetMinMlPerHour,
      urinMax: r.urineTargetMaxMlPerHour,
      urinLabel: r.urineTargetLabel,
      batasCreepMlPerJam: r.fluidCreepRateMlPerHour,
      melampauiCreep: r.exceedsFluidCreep,
      dripLabel: DRIP_LABEL[dripType],
      tetesFase1: tetes(
        r.firstPhaseRemainingMl,
        r.remainingFirstPhaseHours > 0 ? r.remainingFirstPhaseHours : 1,
        dripType,
      ),
      tetesFase2: tetes(r.secondPhaseMl, 16, dripType),
      tetesRumatan: r.maintenanceApplies
        ? tetes(r.maintenanceMlPerHour * 24, 24, dripType)
        : null,
    };

    const rows: Array<{ label: string; value: string }> = [
      { label: "Metode luas luka", value: `Rule of Nines (${luas.chart.label})` },
      { label: "Luas luka bakar (TBSA)", value: `${luas.tbsaPercent}%` },
      {
        label: "Faktor ATLS",
        value: `${atls.faktor} mL/kg/%TBSA (${atls.faktorAlasan})`,
      },
      { label: "Resusitasi 24 jam", value: `${bulat0(atls.total24h)} mL` },
      {
        label: "Laju 8 jam pertama",
        value: `${bulat0(atls.fase1LajuMlPerJam)} mL/jam`,
      },
      {
        label: "Laju 16 jam berikutnya",
        value: `${bulat0(atls.fase2LajuMlPerJam)} mL/jam`,
      },
    ];
    if (atls.rumatanBerlaku) {
      rows.push({
        label: "Rumatan dekstrosa (4-2-1)",
        value: `${bulat0(atls.rumatanMlPerJam)} mL/jam, jalur terpisah`,
      });
    }
    rows.push({ label: "Target urin", value: atls.urinLabel });

    return {
      error: null,
      chartLabel: luas.chart.label,
      tbsaPercent: luas.tbsaPercent,
      kontribusi,
      atls,
      rows,
    };
  } catch (e) {
    const pesan = e instanceof Error ? e.message : "Perhitungan gagal.";
    return { ...kosong, error: pesan };
  }
}
