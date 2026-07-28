/*
 * Tes kunci kesetaraan mesin dosis.
 *
 * Layar Racik Puyer versi island memakai salinan `hitungDosisInti` di dalam
 * public/puyer-tool.html. Versi React memakai `calculateDosing` dari
 * @tinyverse/clinical-core. Tes ini MEMBUKTIKAN keduanya menghasilkan angka
 * yang sama, bukan mengasumsikannya.
 *
 * Isi rentangDosis.golden.json dibangkitkan dengan MENJALANKAN fungsi asli
 * milik island (bukan mengetik ulang hasilnya): 35 obat × 12 kombinasi
 * berat/usia = 420 vektor, mencakup cabang perKg, flat, byAge, ageBands,
 * perKgVolume, pembatasan dosis maksimum, dan pesan galat.
 *
 * Jika tes ini gagal, JANGAN memperbarui berkas golden. Artinya ada perilaku
 * yang berubah dan harus ditelusuri lebih dulu.
 */
import { describe, expect, it } from "vitest";
import { calculateDosing, isDosingError, type Obat } from "@tinyverse/clinical-core";
import golden from "./__fixtures__/rentangDosis.golden.json";
import { KATALOG_OBAT_PUYER } from "./obatKatalog";

interface VektorGolden {
	id: string;
	bb: string;
	usia: string;
	error?: string;
	nul?: boolean;
	dosisMinMg?: number | null;
	dosisMaxMg?: number | null;
	dosisMinMl?: number | null;
	dosisMaxMl?: number | null;
	dosisHarianMinMg?: number | null;
	dosisHarianMaxMg?: number | null;
	doseBasisFinal?: string | null;
	dosesPerDayFinal?: number | null;
	peringatan?: string[];
}

const vektor = golden as VektorGolden[];

/** Pembulatan tampilan yang sama dengan saat vektor dibangkitkan. */
function bulat(v: unknown): number | null {
	return typeof v === "number" && Number.isFinite(v) ? Math.round(v * 1e6) / 1e6 : null;
}

function cariObat(id: string): Obat {
	const o = KATALOG_OBAT_PUYER.find((x) => x.id === id);
	if (!o) throw new Error("obat tidak ada di katalog: " + id);
	return o;
}

describe("calculateDosing setara dengan hitungDosisInti milik island", () => {
	it("menyediakan vektor uji yang lengkap", () => {
		expect(vektor.length).toBe(420);
		expect(KATALOG_OBAT_PUYER.length).toBe(35);
	});

	it.each(vektor.map((v, i) => [i, v] as const))("vektor %i: %o", (_i, v) => {
		const hasil = calculateDosing(cariObat(v.id), v.bb, v.usia, undefined);

		if (v.error) {
			expect(isDosingError(hasil)).toBe(true);
			if (isDosingError(hasil)) expect(hasil.error).toBe(v.error);
			return;
		}

		expect(isDosingError(hasil)).toBe(false);
		if (isDosingError(hasil)) return;

		expect(bulat(hasil.dosisMinMg)).toBe(v.dosisMinMg ?? null);
		expect(bulat(hasil.dosisMaxMg)).toBe(v.dosisMaxMg ?? null);
		expect(bulat(hasil.dosisMinMl)).toBe(v.dosisMinMl ?? null);
		expect(bulat(hasil.dosisMaxMl)).toBe(v.dosisMaxMl ?? null);
		expect(bulat(hasil.dosisHarianMinMg)).toBe(v.dosisHarianMinMg ?? null);
		expect(bulat(hasil.dosisHarianMaxMg)).toBe(v.dosisHarianMaxMg ?? null);
		expect(hasil.doseBasisFinal ?? null).toBe(v.doseBasisFinal ?? null);
		expect(hasil.dosesPerDayFinal ?? null).toBe(v.dosesPerDayFinal ?? null);
		expect(hasil.peringatan ?? []).toEqual(v.peringatan ?? []);
	});
});
