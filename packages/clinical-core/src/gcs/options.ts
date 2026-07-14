// GCS bounded context — tabel OPSI skor per komponen & kelompok usia.
// Port SETIA (verbatim) dari v17 (darurat-gcs-script > OPSI).

import type { GcsOption, EyeMotorAgeGroup, VerbalAgeGroup } from "./types"

export const EYE_OPTIONS: Record<EyeMotorAgeGroup, ReadonlyArray<GcsOption>> = {
	lt1: [
		{ score: 4, label: "Spontan" },
		{ score: 3, label: "Terhadap teriakan" },
		{ score: 2, label: "Terhadap nyeri" },
		{ score: 1, label: "Tidak ada respon" },
	],
	ge1: [
		{ score: 4, label: "Spontan" },
		{ score: 3, label: "Terhadap perintah verbal" },
		{ score: 2, label: "Terhadap nyeri" },
		{ score: 1, label: "Tidak ada respon" },
	],
}

export const MOTOR_OPTIONS: Record<EyeMotorAgeGroup, ReadonlyArray<GcsOption>> = {
	lt1: [
		{ score: 6, label: "Gerak spontan" },
		{ score: 5, label: "Melokalisir nyeri / menarik diri saat disentuh" },
		{ score: 4, label: "Menarik diri terhadap nyeri" },
		{ score: 3, label: "Fleksi abnormal (dekortikasi)" },
		{ score: 2, label: "Ekstensi abnormal (deserebrasi)" },
		{ score: 1, label: "Tidak ada respon" },
	],
	ge1: [
		{ score: 6, label: "Mengikuti perintah" },
		{ score: 5, label: "Melokalisir nyeri" },
		{ score: 4, label: "Fleksi-withdrawal" },
		{ score: 3, label: "Fleksi abnormal (dekortikasi)" },
		{ score: 2, label: "Ekstensi abnormal (deserebrasi)" },
		{ score: 1, label: "Tidak ada respon" },
	],
}

export const VERBAL_OPTIONS: Record<VerbalAgeGroup, ReadonlyArray<GcsOption>> = {
	lt2: [
		{ score: 5, label: "Tersenyum, coos, atau babbling" },
		{ score: 4, label: "Menangis tapi bisa ditenangkan" },
		{ score: 3, label: "Menangis/menjerit terus-menerus" },
		{ score: 2, label: "Grunts / agitated / gelisah" },
		{ score: 1, label: "Tidak ada respon" },
	],
	"2to5": [
		{ score: 5, label: "Kata/frasa sesuai" },
		{ score: 4, label: "Kata tidak sesuai" },
		{ score: 3, label: "Menangis/menjerit terus-menerus" },
		{ score: 2, label: "Grunts" },
		{ score: 1, label: "Tidak ada respon" },
	],
	gt5: [
		{ score: 5, label: "Orientasi baik" },
		{ score: 4, label: "Bingung / disorientasi" },
		{ score: 3, label: "Kata tidak sesuai" },
		{ score: 2, label: "Suara tak dapat dipahami" },
		{ score: 1, label: "Tidak ada respon" },
	],
}
