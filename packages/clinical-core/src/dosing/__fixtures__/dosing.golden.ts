// AUTO-GENERATED from the frozen v17 snapshot + real obat.json fixtures. DO NOT EDIT BY HAND.
// Source: tinyverse-revisi-v17-interaksi-template.html
// sha256: 2188dae3bb2e4671efcae9518d2ad1dbd4193f2bbc6159e6e764d64e5887e3af
// frozenAt: 2026-07-12
// method: Playwright headless execution of v17's own hitungDosisInti(); obat fixtures are a real anonymized snapshot (obat.json) provided by the user, not synthetic data
//
// These are the "answer key" reference outputs captured from TinyVerse v17's
// hitungDosisInti(), run headlessly against REAL obat documents (a snapshot
// of obat.json the user exported from Firestore). clinical-core's
// calculateDosing() must reproduce these values exactly.

import type { Obat } from "../types"

export const dosingGoldenMeta = {
  "source": "tinyverse-revisi-v17-interaksi-template.html",
  "sha256": "2188dae3bb2e4671efcae9518d2ad1dbd4193f2bbc6159e6e764d64e5887e3af",
  "frozenAt": "2026-07-12",
  "method": "Playwright headless execution of v17's own hitungDosisInti(); obat fixtures are a real anonymized snapshot (obat.json) provided by the user, not synthetic data",
  "note": "Do not hand-edit. Regenerate via capture-obat-dosing.js + gen-dosing-golden.js against the frozen v17 snapshot and obat-dosing-fixtures.json."
} as const

/** Obat fixtures — REAL drug documents (subset of engine-relevant fields), one per doseType/branch. */
export const obatFixtures = {
  "Albendazole_Flat": {
    "nama": "Albendazole (Flat)",
    "doseType": "flat",
    "doseBasis": "perDay",
    "unitLabel": "mg/hari",
    "satuanDosis": "mg",
    "frekuensi": "1× sehari selama 3–5 hari (CLM); untuk STH umumnya dosis tunggal",
    "catatan": "CLM (Perdoski 2024): albendazol 400 mg per oral, dapat sebagai dosis tunggal atau 400 mg/hari selama 3–5 hari. Untuk anak tersedia alternatif berbasis berat 10–15 mg/kg/hari (maks 800 mg/hari) pada kartu 'Albendazole (per kg)'. Anak 12–23 bulan pada program STH memakai 200 mg.",
    "indikasi": "Cutaneous larva migrans (CLM)/creeping eruption; juga obat cacing spektrum luas untuk STH (askariasis, cacing tambang, trichuriasis, enterobiasis).",
    "sediaanCustomText": "Tablet kunyah/tablet 400 mg; beberapa produk tersedia suspensi 200 mg/5 mL. Dapat dikunyah/dihancurkan sesuai sediaan.",
    "dosesPerDay": 1,
    "maxDosesPerDay": 1,
    "dosisFlatMin": 400,
    "dosisFlatMax": 400,
    "dosisMaksimalHarianMg": 800
  },
  "Ambroxol": {
    "nama": "Ambroxol",
    "doseType": "perKg",
    "doseBasis": "perDay",
    "unitLabel": "mg/kg/hari",
    "frekuensi": "dibagi 3 kali sehari",
    "catatan": "Dosis pada kalkulator dihitung sebagai total harian lalu dibagi 3 kali pemberian. Maksimum otomatis konservatif: 45 mg/hari; verifikasi sesuai usia dan produk.",
    "dosesPerDay": 3,
    "dosisMinPerKg": 1,
    "dosisMaxPerKg": 2,
    "dosisMaksimalHarianMg": 45,
    "sediaanMg": 15,
    "sediaanMl": 5
  },
  "Asetilsistein": {
    "nama": "Asetilsistein",
    "doseType": "ageBands",
    "doseBasis": "perDose",
    "unitLabel": "mg/kali",
    "frekuensi": "2–4 kali sehari sesuai usia dan produk",
    "catatan": "Dosis dihitung untuk indikasi mukolitik. Hindari penggunaan rutin pada anak <2 tahun kecuali atas instruksi dokter.",
    "indikasi": "Mukolitik untuk membantu mengencerkan dahak pada batuk berdahak.",
    "sediaanCustomText": "Granul/sachet 100 mg pediatric dan granul/kapsul/tablet 200 mg; larutkan/berikan sesuai petunjuk produk.",
    "bands": [
      {
        "frekuensi": "100 mg, 2–4 kali sehari",
        "labelUsia": "2–5 tahun",
        "tipe": "flat",
        "dosisFlatMax": 100,
        "usiaMinBulan": 24,
        "catatan": "Gunakan sediaan pediatric 100 mg; sesuaikan frekuensi dengan usia, berat gejala, dan instruksi dokter.",
        "dosisFlatMin": 100,
        "maxDosesPerDay": 4,
        "doseBasis": "perDose",
        "usiaMaxBulan": 71
      },
      {
        "tipe": "flat",
        "labelUsia": "≥6 tahun – remaja",
        "frekuensi": "200 mg, 2–3 kali sehari",
        "dosisFlatMax": 200,
        "catatan": "Batas lazim mukolitik oral total sekitar 600 mg/hari pada anak besar/dewasa; sesuaikan dengan produk.",
        "usiaMinBulan": 72,
        "doseBasis": "perDose",
        "maxDosesPerDay": 3,
        "usiaMaxBulan": 216,
        "dosisFlatMin": 200
      }
    ]
  },
  "Chlorpheniramine_Maleate_CTM": {
    "nama": "Chlorpheniramine Maleate (CTM)",
    "doseType": "ageBands",
    "doseBasis": "perDose",
    "unitLabel": "mg/kg atau mg (sesuai usia)",
    "frekuensi": "setiap 4–6 jam bila perlu",
    "catatan": "Antihistamin generasi pertama (sedatif). Dosis dan plafon maksimal berbeda di setiap kelompok usia — kalkulator otomatis menyesuaikan berdasarkan usia yang diinput.",
    "sediaanMg": 2,
    "sediaanMl": 5,
    "bands": [
      {
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "usiaMaxBulan": 24,
        "dosisMinPerKg": 0.1,
        "catatan": "0,1 mg/kgBB per kali dosis. Dosis maksimal untuk usia <2 tahun: 2 mg per kali.",
        "dosisMaxPerKg": 0.1,
        "usiaMinBulan": 0,
        "dosisMaksimalTunggalMg": 2,
        "tipe": "perKg",
        "labelUsia": "< 2 tahun",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 12
      },
      {
        "dosisFlatMax": 1,
        "tipe": "flat",
        "labelUsia": "2–5 tahun",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 6,
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "usiaMaxBulan": 60,
        "dosisFlatMin": 1,
        "catatan": "Dosis maksimal harian: 6 mg/hari.",
        "usiaMinBulan": 24
      },
      {
        "usiaMaxBulan": 144,
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "dosisFlatMin": 2,
        "catatan": "Dosis maksimal harian: 12 mg/hari.",
        "usiaMinBulan": 60,
        "dosisFlatMax": 2,
        "labelUsia": "6–12 tahun",
        "tipe": "flat",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 12
      },
      {
        "catatan": "Dosis maksimal harian: 24 mg/hari.",
        "usiaMinBulan": 144,
        "doseBasis": "perDose",
        "maxDosesPerDay": 6,
        "usiaMaxBulan": 216,
        "dosisFlatMin": 4,
        "labelUsia": "≥ 12 tahun",
        "tipe": "flat",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 24,
        "dosisFlatMax": 4
      }
    ]
  },
  "Ibuprofen": {
    "nama": "Ibuprofen",
    "doseType": "perKg",
    "doseBasis": "perDose",
    "unitLabel": "mg/kg/kali",
    "frekuensi": "tiap 6–8 jam bila perlu; maksimal 4 kali sehari",
    "catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 400 mg/kali dan tidak melebihi 40 mg/kgBB/hari.",
    "maxDosesPerDay": 4,
    "dosisMinPerKg": 5,
    "dosisMaxPerKg": 10,
    "dosisMaksimalTunggalMg": 400,
    "dosisMaksimalHarianMg": 1200,
    "dosisMaksimalHarianPerKg": 40,
    "sediaanMg": 100,
    "sediaanMl": 5
  },
  "Oral_Rehydration_Salt_ORS": {
    "nama": "Oral Rehydration Salt (ORS)",
    "doseType": "perKgVolume",
    "doseBasis": "perEpisode",
    "unitLabel": "mL/kg/episode",
    "frekuensi": "setelah setiap episode diare",
    "catatan": "Volume dihitung per episode diare/muntah, bukan dosis harian. Sesuaikan dengan derajat dehidrasi dan toleransi minum.",
    "volumeMinPerKg": 10,
    "volumeMaxPerKg": 20
  },
  "Paracetamol": {
    "nama": "Paracetamol",
    "doseType": "perKg",
    "doseBasis": "perDose",
    "unitLabel": "mg/kg/kali",
    "frekuensi": "tiap 4–6 jam bila perlu; maksimal 5 kali sehari",
    "catatan": "Dosis dihitung per kali pemberian. Maksimum 75 mg/kgBB/hari dan jangan lebih dari 5 kali pemberian per 24 jam. Pilih konsentrasi sirup agar hasil mL tepat.",
    "maxDosesPerDay": 5,
    "dosisMinPerKg": 10,
    "dosisMaxPerKg": 15,
    "dosisMaksimalTunggalMg": 1000,
    "dosisMaksimalHarianMg": 4000,
    "dosisMaksimalHarianPerKg": 75,
    "sediaanMg": 120,
    "sediaanMl": 5,
    "sediaanOptions": [
      {
        "sediaanMg": 120,
        "label": "Sirup 120 mg/5 ml",
        "sediaanMl": 5
      },
      {
        "sediaanMg": 160,
        "sediaanMl": 5,
        "label": "Sirup 160 mg/5 ml (Forte)"
      }
    ]
  },
  "Vitamin_A": {
    "nama": "Vitamin A",
    "doseType": "byAge",
    "doseBasis": "singleDose",
    "unitLabel": "IU (sesuai usia)",
    "satuanDosis": "IU",
    "frekuensi": "Dosis tunggal tiap 4–6 bulan sesuai program/sasaran",
    "catatan": "Dosis tunggal berdasarkan usia: 6–11 bulan 100.000 IU; 12–59 bulan 200.000 IU. Tidak untuk pemberian harian.",
    "sediaanCustomText": "Kapsul Biru (100.000 IU) untuk usia 6–11 bulan; Kapsul Merah (200.000 IU) untuk usia 12–59 bulan. Tidak ada sediaan sirup/tetes — berikan 1 kapsul sesuai kelompok usia.",
    "dosisMaksimalTunggalMg": 200000,
    "ambangUsiaBulan": 12,
    "dosisDibawahAmbangMg": 100000,
    "dosisDiatasAmbangMg": 200000,
    "catatanDibawahAmbang": "Usia 6–11 bulan: Kapsul Biru, dosis 100.000 IU.",
    "catatanDiatasAmbang": "Usia 12–59 bulan: Kapsul Merah, dosis 200.000 IU.",
    "usiaMinValidBulan": 6,
    "usiaMaxValidBulan": 59
  },
  "Ivermectin": {
    "nama": "Ivermectin",
    "doseType": "perKg",
    "doseBasis": "perDay",
    "unitLabel": "µg/kg/hari",
    "satuanDosis": "mcg",
    "frekuensi": "1× sehari selama 1–2 hari",
    "catatan": "CLM (Perdoski 2024): ivermectin 200 µg/kg/hari, atau 150 µg/kg untuk pasien anak, selama 1–2 hari. Umumnya tidak rutin diberikan pada anak <15 kg atau <12 bulan; konsultasikan ke dokter.",
    "indikasi": "Cutaneous larva migrans (CLM)/creeping eruption — terapi lini pertama.",
    "sediaanCustomText": "Tablet 12 mg (atau 3 mg tergantung produk). Tidak tersedia dalam bentuk sirup.",
    "dosesPerDay": 1,
    "maxDosesPerDay": 1,
    "dosisMinPerKg": 150,
    "dosisMaxPerKg": 200
  }
} as const satisfies Record<string, Obat>

export interface DosingGoldenVector {
	label: string
	obatKey: keyof typeof obatFixtures
	inputs: { bb: string; usia: string; sediaanIdx: string | null }
	expected: Record<string, unknown>
}

export const dosingGoldenVectors: DosingGoldenVector[] = [
  {
    "label": "Ambroxol BB10 (tanpa cap)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "10",
      "usia": "60",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 3.3333333333333335,
      "dosisMaxMg": 6.666666666666667,
      "dosisMinMl": 1.1111111111111112,
      "dosisMaxMl": 2.2222222222222223,
      "dosisHarianMinMg": 10,
      "dosisHarianMaxMg": 20,
      "beratBadan": 10,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 15,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Ambroxol BB30 (kena cap harian 45mg)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "30",
      "usia": "60",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Total dosis harian hasil perhitungan (60.0 mg/hari) melebihi batas harian (45.0 mg/hari), sehingga nilai atas dibatasi."
      ],
      "dosisMinMg": 10,
      "dosisMaxMg": 15,
      "dosisMinMl": 3.3333333333333335,
      "dosisMaxMl": 5,
      "dosisHarianMinMg": 30,
      "dosisHarianMaxMg": 45,
      "beratBadan": 30,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 15,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Ambroxol BB1.5 (peringatan BB sangat rendah)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "1.5",
      "usia": "12",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Berat badan 1.5 kg sangat rendah — pastikan satuannya kg (bukan gram) dan bukan salah ketik.",
        "Berat 1.5 kg tampak tidak sesuai untuk usia 12 bulan (perkiraan ±10.5 kg). Periksa kembali input sebelum memakai hasil."
      ],
      "dosisMinMg": 0.5,
      "dosisMaxMg": 1,
      "dosisMinMl": 0.16666666666666666,
      "dosisMaxMl": 0.3333333333333333,
      "dosisHarianMinMg": 1.5,
      "dosisHarianMaxMg": 3,
      "beratBadan": 1.5,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 15,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Ambroxol BB70 (peringatan BB tinggi)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "70",
      "usia": "120",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Total dosis harian hasil perhitungan (140.0 mg/hari) melebihi batas harian (45.0 mg/hari), sehingga nilai atas dibatasi.",
        "Berat badan 70 kg tergolong tinggi untuk pasien anak — pastikan bukan salah ketik (mis. 45 kg vs 4,5 kg) sebelum memberikan dosis."
      ],
      "dosisMinMg": 15,
      "dosisMaxMg": 15,
      "dosisMinMl": 5,
      "dosisMaxMl": 5,
      "dosisHarianMinMg": 45,
      "dosisHarianMaxMg": 45,
      "beratBadan": 70,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 15,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Ambroxol BB40/usia6bln (peringatan tak sesuai usia)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "40",
      "usia": "6",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Total dosis harian hasil perhitungan (80.0 mg/hari) melebihi batas harian (45.0 mg/hari), sehingga nilai atas dibatasi.",
        "Berat 40 kg tampak tidak sesuai untuk usia 6 bulan (perkiraan ±7.5 kg). Periksa kembali input sebelum memakai hasil."
      ],
      "dosisMinMg": 13.333333333333334,
      "dosisMaxMg": 15,
      "dosisMinMl": 4.444444444444445,
      "dosisMaxMl": 5,
      "dosisHarianMinMg": 40,
      "dosisHarianMaxMg": 45,
      "beratBadan": 40,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 15,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Ambroxol BB0 (error BB invalid)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "0",
      "usia": "60",
      "sediaanIdx": null
    },
    "expected": {
      "error": "Mohon masukkan berat badan yang valid (lebih dari 0 kg)."
    }
  },
  {
    "label": "Ambroxol BB200 (error BB tidak wajar)",
    "obatKey": "Ambroxol",
    "inputs": {
      "bb": "200",
      "usia": "60",
      "sediaanIdx": null
    },
    "expected": {
      "error": "Berat badan tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda."
    }
  },
  {
    "label": "Ibuprofen BB10 (tanpa cap)",
    "obatKey": "Ibuprofen",
    "inputs": {
      "bb": "10",
      "usia": "48",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 50,
      "dosisMaxMg": 100,
      "dosisMinMl": 2.5,
      "dosisMaxMl": 5,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 10,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 100,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 4
    }
  },
  {
    "label": "Ibuprofen BB45 (kena cap tunggal 400mg)",
    "obatKey": "Ibuprofen",
    "inputs": {
      "bb": "45",
      "usia": "144",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Hasil perhitungan (450.0 mg) melebihi dosis maksimal per kali (400 mg), sehingga nilai atas dibatasi.",
        "Jika dosis atas diberikan 4 kali/hari, totalnya dapat melebihi batas harian (1200.0 mg/hari). Kurangi jumlah pemberian atau gunakan dosis lebih rendah sesuai instruksi dokter."
      ],
      "dosisMinMg": 225,
      "dosisMaxMg": 400,
      "dosisMinMl": 11.25,
      "dosisMaxMl": 20,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 45,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 100,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 4
    }
  },
  {
    "label": "Paracetamol BB10 sediaan0 (120mg/5ml)",
    "obatKey": "Paracetamol",
    "inputs": {
      "bb": "10",
      "usia": "36",
      "sediaanIdx": "0"
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 100,
      "dosisMaxMg": 150,
      "dosisMinMl": 4.166666666666667,
      "dosisMaxMl": 6.25,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 10,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 120,
      "sedMlFinal": 5,
      "sediaanLabelFinal": "Sirup 120 mg/5 ml",
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 5
    }
  },
  {
    "label": "Paracetamol BB10 sediaan1 (160mg/5ml)",
    "obatKey": "Paracetamol",
    "inputs": {
      "bb": "10",
      "usia": "36",
      "sediaanIdx": "1"
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 100,
      "dosisMaxMg": 150,
      "dosisMinMl": 3.125,
      "dosisMaxMl": 4.6875,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 10,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 160,
      "sedMlFinal": 5,
      "sediaanLabelFinal": "Sirup 160 mg/5 ml (Forte)",
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 5
    }
  },
  {
    "label": "Paracetamol BB80 (kena cap tunggal 1000mg + peringatan BB tinggi)",
    "obatKey": "Paracetamol",
    "inputs": {
      "bb": "80",
      "usia": "156",
      "sediaanIdx": "0"
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Hasil perhitungan (1200.0 mg) melebihi dosis maksimal per kali (1000 mg), sehingga nilai atas dibatasi.",
        "Jika dosis atas diberikan 5 kali/hari, totalnya dapat melebihi batas harian (4000.0 mg/hari). Kurangi jumlah pemberian atau gunakan dosis lebih rendah sesuai instruksi dokter.",
        "Berat badan 80 kg tergolong tinggi untuk pasien anak — pastikan bukan salah ketik (mis. 45 kg vs 4,5 kg) sebelum memberikan dosis."
      ],
      "dosisMinMg": 800,
      "dosisMaxMg": 1000,
      "dosisMinMl": 33.333333333333336,
      "dosisMaxMl": 41.666666666666664,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 80,
      "usiaBulan": null,
      "band": null,
      "sedMgFinal": 120,
      "sedMlFinal": 5,
      "sediaanLabelFinal": "Sirup 120 mg/5 ml",
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 5
    }
  },
  {
    "label": "Albendazole flat (dosis tetap 400mg, tanpa ml)",
    "obatKey": "Albendazole_Flat",
    "inputs": {
      "bb": "20",
      "usia": "60",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 400,
      "dosisMaxMg": 400,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": 400,
      "dosisHarianMaxMg": 400,
      "beratBadan": 20,
      "usiaBulan": null,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDay",
      "dosesPerDayFinal": 1
    }
  },
  {
    "label": "Vitamin A usia8 (di bawah ambang, 100000 IU)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "8",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 100000,
      "dosisMaxMg": 100000,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 8,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "singleDose",
      "dosesPerDayFinal": null
    }
  },
  {
    "label": "Vitamin A usia24 (di atas ambang, 200000 IU)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "24",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 200000,
      "dosisMaxMg": 200000,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 24,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "singleDose",
      "dosesPerDayFinal": null
    }
  },
  {
    "label": "Vitamin A usia3 (peringatan di bawah rentang valid)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "3",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Usia di bawah rentang indikasi umum obat ini (mulai usia 6 bulan). Mohon konsultasikan ke dokter."
      ],
      "dosisMinMg": 100000,
      "dosisMaxMg": 100000,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 3,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "singleDose",
      "dosesPerDayFinal": null
    }
  },
  {
    "label": "Vitamin A usia70 (peringatan di atas rentang valid)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "70",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Usia di atas rentang indikasi umum obat ini (hingga usia 59 bulan). Mohon konsultasikan ke dokter."
      ],
      "dosisMinMg": 200000,
      "dosisMaxMg": 200000,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 70,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "singleDose",
      "dosesPerDayFinal": null
    }
  },
  {
    "label": "Vitamin A usia-1 (error usia invalid)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "-1",
      "sediaanIdx": null
    },
    "expected": {
      "error": "Mohon masukkan usia anak yang valid (dalam bulan)."
    }
  },
  {
    "label": "Vitamin A usia300 (error usia tidak wajar)",
    "obatKey": "Vitamin_A",
    "inputs": {
      "bb": "",
      "usia": "300",
      "sediaanIdx": null
    },
    "expected": {
      "error": "Usia tampak tidak wajar untuk pasien anak. Mohon periksa kembali input Anda."
    }
  },
  {
    "label": "Asetilsistein usia36 (band 2-5th, 100mg)",
    "obatKey": "Asetilsistein",
    "inputs": {
      "bb": "",
      "usia": "36",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 100,
      "dosisMaxMg": 100,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 36,
      "band": {
        "frekuensi": "100 mg, 2–4 kali sehari",
        "labelUsia": "2–5 tahun",
        "tipe": "flat",
        "dosisFlatMax": 100,
        "usiaMinBulan": 24,
        "catatan": "Gunakan sediaan pediatric 100 mg; sesuaikan frekuensi dengan usia, berat gejala, dan instruksi dokter.",
        "dosisFlatMin": 100,
        "maxDosesPerDay": 4,
        "doseBasis": "perDose",
        "usiaMaxBulan": 71
      },
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 4
    }
  },
  {
    "label": "Asetilsistein usia100 (band >=6th, 200mg)",
    "obatKey": "Asetilsistein",
    "inputs": {
      "bb": "",
      "usia": "100",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 200,
      "dosisMaxMg": 200,
      "dosisMinMl": null,
      "dosisMaxMl": null,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 100,
      "band": {
        "tipe": "flat",
        "labelUsia": "≥6 tahun – remaja",
        "frekuensi": "200 mg, 2–3 kali sehari",
        "dosisFlatMax": 200,
        "catatan": "Batas lazim mukolitik oral total sekitar 600 mg/hari pada anak besar/dewasa; sesuaikan dengan produk.",
        "usiaMinBulan": 72,
        "doseBasis": "perDose",
        "maxDosesPerDay": 3,
        "usiaMaxBulan": 216,
        "dosisFlatMin": 200
      },
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 3
    }
  },
  {
    "label": "Asetilsistein usia12 (error tidak ada band cocok)",
    "obatKey": "Asetilsistein",
    "inputs": {
      "bb": "",
      "usia": "12",
      "sediaanIdx": null
    },
    "expected": {
      "error": "Tidak ada rekomendasi dosis untuk usia tersebut pada kalkulator ini. Mohon konsultasikan ke dokter."
    }
  },
  {
    "label": "CTM usia12/BB10 (band perKg, tanpa cap)",
    "obatKey": "Chlorpheniramine_Maleate_CTM",
    "inputs": {
      "bb": "10",
      "usia": "12",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 1,
      "dosisMaxMg": 1,
      "dosisMinMl": 2.5,
      "dosisMaxMl": 2.5,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 10,
      "usiaBulan": 12,
      "band": {
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "usiaMaxBulan": 24,
        "dosisMinPerKg": 0.1,
        "catatan": "0,1 mg/kgBB per kali dosis. Dosis maksimal untuk usia <2 tahun: 2 mg per kali.",
        "dosisMaxPerKg": 0.1,
        "usiaMinBulan": 0,
        "dosisMaksimalTunggalMg": 2,
        "tipe": "perKg",
        "labelUsia": "< 2 tahun",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 12
      },
      "sedMgFinal": 2,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 6
    }
  },
  {
    "label": "CTM usia12/BB25 (band perKg, kena cap tunggal 2mg)",
    "obatKey": "Chlorpheniramine_Maleate_CTM",
    "inputs": {
      "bb": "25",
      "usia": "12",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [
        "Hasil perhitungan (2.5 mg) melebihi dosis maksimal per kali (2 mg), sehingga nilai atas dibatasi.",
        "Berat 25 kg tampak tidak sesuai untuk usia 12 bulan (perkiraan ±10.5 kg). Periksa kembali input sebelum memakai hasil."
      ],
      "dosisMinMg": 2,
      "dosisMaxMg": 2,
      "dosisMinMl": 5,
      "dosisMaxMl": 5,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 25,
      "usiaBulan": 12,
      "band": {
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "usiaMaxBulan": 24,
        "dosisMinPerKg": 0.1,
        "catatan": "0,1 mg/kgBB per kali dosis. Dosis maksimal untuk usia <2 tahun: 2 mg per kali.",
        "dosisMaxPerKg": 0.1,
        "usiaMinBulan": 0,
        "dosisMaksimalTunggalMg": 2,
        "tipe": "perKg",
        "labelUsia": "< 2 tahun",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 12
      },
      "sedMgFinal": 2,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 6
    }
  },
  {
    "label": "CTM usia36 (band flat 2-5th, 1mg)",
    "obatKey": "Chlorpheniramine_Maleate_CTM",
    "inputs": {
      "bb": "",
      "usia": "36",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 1,
      "dosisMaxMg": 1,
      "dosisMinMl": 2.5,
      "dosisMaxMl": 2.5,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 36,
      "band": {
        "dosisFlatMax": 1,
        "tipe": "flat",
        "labelUsia": "2–5 tahun",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 6,
        "maxDosesPerDay": 6,
        "doseBasis": "perDose",
        "usiaMaxBulan": 60,
        "dosisFlatMin": 1,
        "catatan": "Dosis maksimal harian: 6 mg/hari.",
        "usiaMinBulan": 24
      },
      "sedMgFinal": 2,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 6
    }
  },
  {
    "label": "CTM usia200 (band flat >=12th, 4mg)",
    "obatKey": "Chlorpheniramine_Maleate_CTM",
    "inputs": {
      "bb": "",
      "usia": "200",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": 4,
      "dosisMaxMg": 4,
      "dosisMinMl": 10,
      "dosisMaxMl": 10,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": null,
      "usiaBulan": 200,
      "band": {
        "catatan": "Dosis maksimal harian: 24 mg/hari.",
        "usiaMinBulan": 144,
        "doseBasis": "perDose",
        "maxDosesPerDay": 6,
        "usiaMaxBulan": 216,
        "dosisFlatMin": 4,
        "labelUsia": "≥ 12 tahun",
        "tipe": "flat",
        "frekuensi": "setiap 4–6 jam",
        "dosisMaksimalHarianMg": 24,
        "dosisFlatMax": 4
      },
      "sedMgFinal": 2,
      "sedMlFinal": 5,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perDose",
      "dosesPerDayFinal": 6
    }
  },
  {
    "label": "ORS BB12 (volume per episode)",
    "obatKey": "Oral_Rehydration_Salt_ORS",
    "inputs": {
      "bb": "12",
      "usia": "",
      "sediaanIdx": null
    },
    "expected": {
      "error": null,
      "peringatan": [],
      "dosisMinMg": null,
      "dosisMaxMg": null,
      "dosisMinMl": 120,
      "dosisMaxMl": 240,
      "dosisHarianMinMg": null,
      "dosisHarianMaxMg": null,
      "beratBadan": 12,
      "usiaBulan": null,
      "band": null,
      "sediaanLabelFinal": null,
      "doseBasisFinal": "perEpisode",
      "dosesPerDayFinal": null
    }
  }
]
