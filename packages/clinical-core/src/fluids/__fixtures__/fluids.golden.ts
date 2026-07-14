// SALINAN dari baseline/reference-outputs/fluids.golden.ts (P0). JANGAN diedit manual.
// Sumber kebenaran ada di folder baseline/ hasil Phase 0.
// AUTO-GENERATED from the frozen v17 snapshot. DO NOT EDIT BY HAND.
// Source: tinyverse-revisi-v17-interaksi-template.html
// sha256: 2188dae3bb2e4671efcae9518d2ad1dbd4193f2bbc6159e6e764d64e5887e3af
// frozenAt: 2026-07-12
// method: Playwright headless execution of v17's own functions; cross-checked against v17 formulas
//
// These are the "answer key" reference outputs captured from TinyVerse v17.
// Phase 5+ (clinical-core Fluids bounded context) must reproduce these values.

export interface MaintenanceGolden {
	weightKg: number
	totalMlPerDay: number
	mlPerHourDisplay: string // v17 toFixed(1)
}

export interface DripGolden {
	volumeMl: number
	hours: number
	dripType: "makro" | "mikro"
	dropFactor: number // gtt/mL
	gttPerMin: number // v17 Math.round
	gttPerMinRawDisplay: string // v17 toFixed(1)
	mlPerHourDisplay: string
}

export interface PlanBGolden {
	weightKg: number
	totalMlDisplay: number // v17 toFixed(0)
	totalMlExact: number
	mlPerHourDisplay: string
	overHours: number
}

export interface PlanCStage {
	mlPerKg: number
	volumeMl: number
	hours: number
	mlPerHourDisplay: string
}
export interface PlanCGolden {
	weightKg: number
	ageCategory: "bayi" | "anak"
	totalMl: number
	stage1: PlanCStage
	stage2: PlanCStage
	totalHours: number
}

export const fluidGoldenMeta = {
  "source": "tinyverse-revisi-v17-interaksi-template.html",
  "sha256": "2188dae3bb2e4671efcae9518d2ad1dbd4193f2bbc6159e6e764d64e5887e3af",
  "frozenAt": "2026-07-12",
  "method": "Playwright headless execution of v17's own functions; cross-checked against v17 formulas",
  "note": "Do not hand-edit. Regenerate via baseline/capture/capture-fluids.js + gen-golden.js against the frozen snapshot."
} as const

export const maintenanceGolden: MaintenanceGolden[] = [
  {
    "weightKg": 5,
    "totalMlPerDay": 500,
    "mlPerHourDisplay": "20.8"
  },
  {
    "weightKg": 8,
    "totalMlPerDay": 800,
    "mlPerHourDisplay": "33.3"
  },
  {
    "weightKg": 10,
    "totalMlPerDay": 1000,
    "mlPerHourDisplay": "41.7"
  },
  {
    "weightKg": 12.5,
    "totalMlPerDay": 1125,
    "mlPerHourDisplay": "46.9"
  },
  {
    "weightKg": 15,
    "totalMlPerDay": 1250,
    "mlPerHourDisplay": "52.1"
  },
  {
    "weightKg": 20,
    "totalMlPerDay": 1500,
    "mlPerHourDisplay": "62.5"
  },
  {
    "weightKg": 25,
    "totalMlPerDay": 1600,
    "mlPerHourDisplay": "66.7"
  },
  {
    "weightKg": 30,
    "totalMlPerDay": 1700,
    "mlPerHourDisplay": "70.8"
  }
]

export const dripGolden: DripGolden[] = [
  {
    "volumeMl": 500,
    "hours": 8,
    "dripType": "makro",
    "dropFactor": 20,
    "gttPerMin": 21,
    "gttPerMinRawDisplay": "20.8",
    "mlPerHourDisplay": "62.5"
  },
  {
    "volumeMl": 1000,
    "hours": 24,
    "dripType": "makro",
    "dropFactor": 20,
    "gttPerMin": 14,
    "gttPerMinRawDisplay": "13.9",
    "mlPerHourDisplay": "41.7"
  },
  {
    "volumeMl": 100,
    "hours": 1,
    "dripType": "mikro",
    "dropFactor": 60,
    "gttPerMin": 100,
    "gttPerMinRawDisplay": "100.0",
    "mlPerHourDisplay": "100.0"
  },
  {
    "volumeMl": 500,
    "hours": 8,
    "dripType": "mikro",
    "dropFactor": 60,
    "gttPerMin": 63,
    "gttPerMinRawDisplay": "62.5",
    "mlPerHourDisplay": "62.5"
  }
]

export const planBGolden: PlanBGolden[] = [
  {
    "weightKg": 8,
    "totalMlDisplay": 600,
    "totalMlExact": 600,
    "mlPerHourDisplay": "200.0",
    "overHours": 3
  },
  {
    "weightKg": 12.5,
    "totalMlDisplay": 938,
    "totalMlExact": 937.5,
    "mlPerHourDisplay": "312.5",
    "overHours": 3
  },
  {
    "weightKg": 15,
    "totalMlDisplay": 1125,
    "totalMlExact": 1125,
    "mlPerHourDisplay": "375.0",
    "overHours": 3
  }
]

export const planCGolden: PlanCGolden[] = [
  {
    "weightKg": 8,
    "ageCategory": "bayi",
    "totalMl": 800,
    "stage1": {
      "mlPerKg": 30,
      "volumeMl": 240,
      "hours": 1,
      "mlPerHourDisplay": "240.0"
    },
    "stage2": {
      "mlPerKg": 70,
      "volumeMl": 560,
      "hours": 5,
      "mlPerHourDisplay": "112.0"
    },
    "totalHours": 6
  },
  {
    "weightKg": 15,
    "ageCategory": "anak",
    "totalMl": 1500,
    "stage1": {
      "mlPerKg": 30,
      "volumeMl": 450,
      "hours": 0.5,
      "mlPerHourDisplay": "900.0"
    },
    "stage2": {
      "mlPerKg": 70,
      "volumeMl": 1050,
      "hours": 2.5,
      "mlPerHourDisplay": "420.0"
    },
    "totalHours": 3
  }
]
