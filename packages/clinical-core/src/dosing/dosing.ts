// Obat/Dosing bounded context — mesin utama perhitungan dosis.
// Pure port 1:1 dari v17 `hitungDosisInti` (baris ~7619–7745).
//
// CATATAN DESAIN: fungsi ini mengembalikan `DosingOutput` (union sukses/
// error), TIDAK throw, meniru kontrak asli v17 apa adanya. `bangunHtmlHasil`
// (presentasi/DOM) SENGAJA tidak diport — itu adalah tanggung jawab lapisan
// UI pada fase berikutnya, bukan clinical-core.

import { batasiDosisHarian, batasiDosisTunggal, cekBatasHarianDariDosisPerKali } from "./capping"
import { checkMissingDoseCap, checkWeightAgePlausibility } from "./plausibility"
import { findMatchingBand, validateAgeInput, validateWeightInput } from "./guards"
import { hitungMlDariSediaan, pilihSediaanAktif } from "./sediaan"
import type { DoseAgeBand, DoseBasis, DosingOutput, Obat } from "./types"

export function calculateDosing(
	obat: Obat,
	beratBadanInput?: string | number,
	usiaBulanInput?: string | number,
	sediaanIndexInput?: string | number,
): DosingOutput {
	const peringatan: string[] = []
	let dosisMinMg: number | null = null
	let dosisMaxMg: number | null = null
	let dosisMinMl: number | null = null
	let dosisMaxMl: number | null = null
	let dosisHarianMinMg: number | null = null
	let dosisHarianMaxMg: number | null = null
	let beratBadan: number | null = null
	let usiaBulan: number | null = null
	let band: DoseAgeBand | null = null

	const sediaanAktif = pilihSediaanAktif(obat, sediaanIndexInput)
	let sedMgFinal: number | undefined = sediaanAktif ? sediaanAktif.sediaanMg : obat.sediaanMg
	let sedMlFinal: number | undefined = sediaanAktif ? sediaanAktif.sediaanMl : obat.sediaanMl
	let sediaanLabelFinal: string | null = sediaanAktif ? sediaanAktif.label ?? null : null
	let doseBasisFinal: DoseBasis =
		obat.doseBasis || (String(obat.unitLabel || "").toLowerCase().includes("/hari") ? "perDay" : "perDose")
	let dosesPerDayFinal: number | null = obat.dosesPerDay || obat.maxDosesPerDay || null

	if (obat.doseType === "byAge") {
		const ageCheck = validateAgeInput(usiaBulanInput)
		if ("error" in ageCheck) return { error: ageCheck.error }
		usiaBulan = ageCheck.usiaBulan

		if (obat.usiaMinValidBulan !== undefined && usiaBulan < obat.usiaMinValidBulan) {
			peringatan.push(
				`Usia di bawah rentang indikasi umum obat ini (mulai usia ${obat.usiaMinValidBulan} bulan). Mohon konsultasikan ke dokter.`,
			)
		}
		if (obat.usiaMaxValidBulan !== undefined && usiaBulan > obat.usiaMaxValidBulan) {
			peringatan.push(
				`Usia di atas rentang indikasi umum obat ini (hingga usia ${obat.usiaMaxValidBulan} bulan). Mohon konsultasikan ke dokter.`,
			)
		}

		const dosisTetapMg = usiaBulan < (obat.ambangUsiaBulan ?? 0) ? obat.dosisDibawahAmbangMg ?? null : obat.dosisDiatasAmbangMg ?? null

		if (doseBasisFinal === "perDay") {
			dosisHarianMinMg = dosisTetapMg
			dosisHarianMaxMg = dosisTetapMg
			const capped = batasiDosisHarian(obat, band, beratBadan, dosisHarianMinMg, dosisHarianMaxMg)
			dosisHarianMinMg = capped.dosisHarianMinMg
			dosisHarianMaxMg = capped.dosisHarianMaxMg
			peringatan.push(...capped.peringatan)
			dosisMinMg = dosisHarianMinMg
			dosisMaxMg = dosisHarianMaxMg
		} else {
			dosisMinMg = dosisTetapMg
			dosisMaxMg = dosisTetapMg
			const single = batasiDosisTunggal(obat, band, dosisMinMg, dosisMaxMg)
			dosisMinMg = single.dosisMinMg
			dosisMaxMg = single.dosisMaxMg
			peringatan.push(...single.peringatan)
			peringatan.push(...cekBatasHarianDariDosisPerKali(obat, band, beratBadan, dosisMaxMg))
		}
		const ml = hitungMlDariSediaan(sedMgFinal, sedMlFinal, dosisMinMg, dosisMaxMg)
		dosisMinMl = ml.dosisMinMl
		dosisMaxMl = ml.dosisMaxMl
	} else if (obat.doseType === "ageBands") {
		const ageCheck = validateAgeInput(usiaBulanInput)
		if ("error" in ageCheck) return { error: ageCheck.error }
		usiaBulan = ageCheck.usiaBulan

		const foundBand = findMatchingBand(obat.bands, usiaBulan)
		if (!foundBand) {
			return { error: "Tidak ada rekomendasi dosis untuk usia tersebut pada kalkulator ini. Mohon konsultasikan ke dokter." }
		}
		band = foundBand
		doseBasisFinal = band.doseBasis || doseBasisFinal
		dosesPerDayFinal = band.dosesPerDay || band.maxDosesPerDay || dosesPerDayFinal
		if (band.sediaanMg || band.sediaanMl) {
			sedMgFinal = band.sediaanMg || sedMgFinal
			sedMlFinal = band.sediaanMl || sedMlFinal
			sediaanLabelFinal = band.sediaanLabel || null
		}

		if (band.tipe === "perKg") {
			const weightCheck = validateWeightInput(beratBadanInput, true)
			if ("error" in weightCheck) return { error: weightCheck.error }
			beratBadan = weightCheck.beratBadan

			if (doseBasisFinal === "perDay") {
				dosisHarianMinMg = (band.dosisMinPerKg ?? 0) * beratBadan
				dosisHarianMaxMg = (band.dosisMaxPerKg ?? 0) * beratBadan
				const capped = batasiDosisHarian(obat, band, beratBadan, dosisHarianMinMg, dosisHarianMaxMg)
				dosisHarianMinMg = capped.dosisHarianMinMg
				dosisHarianMaxMg = capped.dosisHarianMaxMg
				peringatan.push(...capped.peringatan)
				const pembagi = dosesPerDayFinal || 1
				dosisMinMg = (dosisHarianMinMg ?? 0) / pembagi
				dosisMaxMg = (dosisHarianMaxMg ?? 0) / pembagi
			} else {
				dosisMinMg = (band.dosisMinPerKg ?? 0) * beratBadan
				dosisMaxMg = (band.dosisMaxPerKg ?? 0) * beratBadan
				const single = batasiDosisTunggal(obat, band, dosisMinMg, dosisMaxMg)
				dosisMinMg = single.dosisMinMg
				dosisMaxMg = single.dosisMaxMg
				peringatan.push(...single.peringatan)
				peringatan.push(...cekBatasHarianDariDosisPerKali(obat, band, beratBadan, dosisMaxMg))
			}
		} else {
			if (doseBasisFinal === "perDay") {
				dosisHarianMinMg = band.dosisFlatMin ?? null
				dosisHarianMaxMg = band.dosisFlatMax ?? null
				const capped = batasiDosisHarian(obat, band, beratBadan, dosisHarianMinMg, dosisHarianMaxMg)
				dosisHarianMinMg = capped.dosisHarianMinMg
				dosisHarianMaxMg = capped.dosisHarianMaxMg
				peringatan.push(...capped.peringatan)
				const pembagi = dosesPerDayFinal || 1
				dosisMinMg = (dosisHarianMinMg ?? 0) / pembagi
				dosisMaxMg = (dosisHarianMaxMg ?? 0) / pembagi
			} else {
				dosisMinMg = band.dosisFlatMin ?? null
				dosisMaxMg = band.dosisFlatMax ?? null
				const single = batasiDosisTunggal(obat, band, dosisMinMg, dosisMaxMg)
				dosisMinMg = single.dosisMinMg
				dosisMaxMg = single.dosisMaxMg
				peringatan.push(...single.peringatan)
				peringatan.push(...cekBatasHarianDariDosisPerKali(obat, band, beratBadan, dosisMaxMg))
			}
		}
		const ml = hitungMlDariSediaan(sedMgFinal, sedMlFinal, dosisMinMg, dosisMaxMg)
		dosisMinMl = ml.dosisMinMl
		dosisMaxMl = ml.dosisMaxMl
	} else {
		const weightCheck = validateWeightInput(beratBadanInput)
		if ("error" in weightCheck) return { error: weightCheck.error }
		beratBadan = weightCheck.beratBadan

		if (obat.doseType === "flat") {
			if (doseBasisFinal === "perDay") {
				dosisHarianMinMg = obat.dosisFlatMin ?? null
				dosisHarianMaxMg = obat.dosisFlatMax ?? null
				const capped = batasiDosisHarian(obat, band, beratBadan, dosisHarianMinMg, dosisHarianMaxMg)
				dosisHarianMinMg = capped.dosisHarianMinMg
				dosisHarianMaxMg = capped.dosisHarianMaxMg
				peringatan.push(...capped.peringatan)
				const pembagi = dosesPerDayFinal || 1
				dosisMinMg = (dosisHarianMinMg ?? 0) / pembagi
				dosisMaxMg = (dosisHarianMaxMg ?? 0) / pembagi
			} else {
				dosisMinMg = obat.dosisFlatMin ?? null
				dosisMaxMg = obat.dosisFlatMax ?? null
				const single = batasiDosisTunggal(obat, band, dosisMinMg, dosisMaxMg)
				dosisMinMg = single.dosisMinMg
				dosisMaxMg = single.dosisMaxMg
				peringatan.push(...single.peringatan)
				peringatan.push(...cekBatasHarianDariDosisPerKali(obat, band, beratBadan, dosisMaxMg))
			}
			const ml = hitungMlDariSediaan(sedMgFinal, sedMlFinal, dosisMinMg, dosisMaxMg)
			dosisMinMl = ml.dosisMinMl
			dosisMaxMl = ml.dosisMaxMl
		} else if (obat.doseType === "perKgVolume") {
			dosisMinMl = (obat.volumeMinPerKg ?? 0) * beratBadan
			dosisMaxMl = (obat.volumeMaxPerKg ?? 0) * beratBadan
			doseBasisFinal = obat.doseBasis || "perEpisode"
		} else {
			// default branch — doseType "perKg"
			if (doseBasisFinal === "perDay") {
				dosisHarianMinMg = (obat.dosisMinPerKg ?? 0) * beratBadan
				dosisHarianMaxMg = (obat.dosisMaxPerKg ?? 0) * beratBadan
				const capped = batasiDosisHarian(obat, band, beratBadan, dosisHarianMinMg, dosisHarianMaxMg)
				dosisHarianMinMg = capped.dosisHarianMinMg
				dosisHarianMaxMg = capped.dosisHarianMaxMg
				peringatan.push(...capped.peringatan)
				const pembagi = dosesPerDayFinal || 1
				dosisMinMg = (dosisHarianMinMg ?? 0) / pembagi
				dosisMaxMg = (dosisHarianMaxMg ?? 0) / pembagi
			} else {
				dosisMinMg = (obat.dosisMinPerKg ?? 0) * beratBadan
				dosisMaxMg = (obat.dosisMaxPerKg ?? 0) * beratBadan
				const single = batasiDosisTunggal(obat, band, dosisMinMg, dosisMaxMg)
				dosisMinMg = single.dosisMinMg
				dosisMaxMg = single.dosisMaxMg
				peringatan.push(...single.peringatan)
				peringatan.push(...cekBatasHarianDariDosisPerKali(obat, band, beratBadan, dosisMaxMg))
			}
			const ml = hitungMlDariSediaan(sedMgFinal, sedMlFinal, dosisMinMg, dosisMaxMg)
			dosisMinMl = ml.dosisMinMl
			dosisMaxMl = ml.dosisMaxMl
		}
	}

	peringatan.push(...checkWeightAgePlausibility(beratBadanInput, usiaBulanInput))
	peringatan.push(...checkMissingDoseCap(obat, band, beratBadan))

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
	}
}
