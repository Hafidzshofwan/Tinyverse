// Obat/Dosing bounded context — pengecekan plausibilitas input (bukan capping).
// Pure port dari blok "Pengecekan plausibilitas input" di akhir v17 `hitungDosisInti`.

import type { DoseAgeBand, Obat } from "./types"

function toFloat(input: string | number | undefined): number {
	return typeof input === "number" ? input : Number.parseFloat(String(input ?? ""))
}

/**
 * Peringatan berat badan sangat rendah/tinggi, dan berat vs usia yang
 * tampak tidak sesuai (kemungkinan salah ketik/satuan).
 */
export function checkWeightAgePlausibility(
	beratBadanInput: string | number | undefined,
	usiaBulanInput: string | number | undefined,
): string[] {
	const peringatan: string[] = []
	const bbCek = toFloat(beratBadanInput)
	const usiaCek = toFloat(usiaBulanInput)

	if (Number.isFinite(bbCek) && bbCek > 0) {
		if (bbCek < 2) {
			peringatan.push(`Berat badan ${bbCek} kg sangat rendah — pastikan satuannya kg (bukan gram) dan bukan salah ketik.`)
		} else if (bbCek > 60) {
			peringatan.push(
				`Berat badan ${bbCek} kg tergolong tinggi untuk pasien anak — pastikan bukan salah ketik (mis. 45 kg vs 4,5 kg) sebelum memberikan dosis.`,
			)
		}
		if (Number.isFinite(usiaCek) && usiaCek >= 0) {
			const perkiraanBB = usiaCek <= 12 ? (usiaCek + 9) / 2 : usiaCek <= 60 ? 2 * (usiaCek / 12) + 8 : 3 * (usiaCek / 12) + 7
			if (perkiraanBB > 0 && (bbCek > perkiraanBB * 2.2 || bbCek < perkiraanBB * 0.45)) {
				peringatan.push(
					`Berat ${bbCek} kg tampak tidak sesuai untuk usia ${usiaCek} bulan (perkiraan ±${perkiraanBB.toFixed(1)} kg). Periksa kembali input sebelum memakai hasil.`,
				)
			}
		}
	}
	return peringatan
}

/**
 * Peringatan bila obat tidak punya batas dosis maksimum absolut sama sekali,
 * padahal dosisnya diskalakan per kg berat badan (risiko overdosis pada anak
 * besar bila basis data belum lengkap).
 */
export function checkMissingDoseCap(obat: Obat, band: DoseAgeBand | null, beratBadan: number | null): string[] {
	const punyaCap = Boolean(
		obat.dosisMaksimalTunggalMg ||
			obat.dosisMaksimalHarianMg ||
			obat.dosisMaksimalHarianPerKg ||
			(band && (band.dosisMaksimalTunggalMg || band.dosisMaksimalHarianMg)),
	)
	const scalesPerKg =
		obat.doseType === "ageBands"
			? Boolean(band && band.tipe === "perKg")
			: obat.doseType !== "flat" && obat.doseType !== "byAge" && obat.doseType !== "perKgVolume"

	if (!punyaCap && scalesPerKg && beratBadan !== null && Number.isFinite(beratBadan)) {
		return [
			"Obat ini belum memiliki batas dosis maksimum absolut di basis data, padahal dosis dihitung per kg berat badan. Untuk anak dengan berat besar, verifikasi manual agar tidak melebihi dosis dewasa.",
		]
	}
	return []
}
