// Obat/Dosing bounded context — pembatasan (capping) dosis maksimum & peringatan.
// Pure port dari v17 `batasHarianMg`, `batasiDosisTunggal`, `batasiDosisHarian`,
// `cekBatasHarianDariDosisPerKali`. Direstrukturisasi jadi fungsi murni tanpa
// closure/mutable-state bersama, agar masing-masing dapat diuji terpisah.

import type { DoseAgeBand, Obat } from "./types"

/** Batas dosis harian efektif (mg) = nilai TERKECIL dari semua batas yang berlaku. */
export function batasHarianMg(obat: Obat, band: DoseAgeBand | null, beratBadan: number | null): number | null {
	const batas: number[] = []
	if (obat.dosisMaksimalHarianMg) batas.push(obat.dosisMaksimalHarianMg)
	if (obat.dosisMaksimalHarianPerKg && beratBadan !== null && Number.isFinite(beratBadan)) {
		batas.push(obat.dosisMaksimalHarianPerKg * beratBadan)
	}
	if (band?.dosisMaksimalHarianMg) batas.push(band.dosisMaksimalHarianMg)
	return batas.length ? Math.min(...batas) : null
}

export interface SingleCapOutcome {
	dosisMinMg: number | null
	dosisMaxMg: number | null
	peringatan: string[]
}

/** Batasi dosis TUNGGAL (per kali) terhadap `dosisMaksimalTunggalMg`. */
export function batasiDosisTunggal(
	obat: Obat,
	band: DoseAgeBand | null,
	dosisMinMg: number | null,
	dosisMaxMg: number | null,
): SingleCapOutcome {
	const peringatan: string[] = []
	const maxSingle = band?.dosisMaksimalTunggalMg || obat.dosisMaksimalTunggalMg
	const satuan = obat.satuanDosis || "mg"
	if (maxSingle && dosisMaxMg !== null && dosisMaxMg > maxSingle) {
		peringatan.push(
			`Hasil perhitungan (${dosisMaxMg.toFixed(1)} ${satuan}) melebihi dosis maksimal per kali (${maxSingle} ${satuan}), sehingga nilai atas dibatasi.`,
		)
		dosisMaxMg = maxSingle
		if (dosisMinMg !== null && dosisMinMg > dosisMaxMg) dosisMinMg = dosisMaxMg
	}
	return { dosisMinMg, dosisMaxMg, peringatan }
}

export interface DailyCapOutcome {
	dosisHarianMinMg: number | null
	dosisHarianMaxMg: number | null
	peringatan: string[]
}

/** Batasi dosis HARIAN terhadap batas harian efektif (lihat `batasHarianMg`). */
export function batasiDosisHarian(
	obat: Obat,
	band: DoseAgeBand | null,
	beratBadan: number | null,
	dosisHarianMinMg: number | null,
	dosisHarianMaxMg: number | null,
): DailyCapOutcome {
	const peringatan: string[] = []
	const maxDaily = batasHarianMg(obat, band, beratBadan)
	const satuan = obat.satuanDosis || "mg"
	if (maxDaily && dosisHarianMaxMg !== null && dosisHarianMaxMg > maxDaily) {
		peringatan.push(
			`Total dosis harian hasil perhitungan (${dosisHarianMaxMg.toFixed(1)} ${satuan}/hari) melebihi batas harian (${maxDaily.toFixed(1)} ${satuan}/hari), sehingga nilai atas dibatasi.`,
		)
		dosisHarianMaxMg = maxDaily
		if (dosisHarianMinMg !== null && dosisHarianMinMg > dosisHarianMaxMg) dosisHarianMinMg = dosisHarianMaxMg
	}
	return { dosisHarianMinMg, dosisHarianMaxMg, peringatan }
}

/**
 * Peringatan (bukan capping): bila dosis-per-kali ATAS dikali frekuensi
 * maksimum per hari BISA melampaui batas harian efektif.
 */
export function cekBatasHarianDariDosisPerKali(
	obat: Obat,
	band: DoseAgeBand | null,
	beratBadan: number | null,
	dosisMaxMg: number | null,
): string[] {
	const maxDaily = batasHarianMg(obat, band, beratBadan)
	const maxDoses = obat.maxDosesPerDay || band?.maxDosesPerDay || null
	const satuan = obat.satuanDosis || "mg"
	if (maxDaily && maxDoses && dosisMaxMg !== null && dosisMaxMg * maxDoses > maxDaily) {
		return [
			`Jika dosis atas diberikan ${maxDoses} kali/hari, totalnya dapat melebihi batas harian (${maxDaily.toFixed(1)} ${satuan}/hari). Kurangi jumlah pemberian atau gunakan dosis lebih rendah sesuai instruksi dokter.`,
		]
	}
	return []
}
