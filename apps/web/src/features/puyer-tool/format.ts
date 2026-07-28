/*
 * Helper angka & teks layar Racik Puyer — PORT 1:1 dari public/puyer-tool.html.
 *
 * WHY dipisah: fungsi-fungsi ini menentukan ANGKA dan TULISAN yang tampil di
 * layar (termasuk draft resep). Dengan berdiri sendiri sebagai fungsi murni,
 * hasilnya bisa dikunci oleh tes sehingga migrasi iframe -> React terbukti
 * tidak menggeser satu digit pun.
 */

/** Baca input pengguna; koma diperlakukan sebagai titik desimal, seperti v17. */
export function num(v: unknown): number {
	const n = parseFloat(String(v || "").replace(",", "."));
	return Number.isFinite(n) ? n : NaN;
}

/** Pembulatan tampilan v17: desimal default 2, pemisah desimal koma. */
export function fmt(n: number, d?: number): string {
	if (!Number.isFinite(n)) return "—";
	const pangkat = Math.pow(10, d == null ? 2 : d);
	const x = Math.round(n * pangkat) / pangkat;
	return String(x).replace(".", ",");
}

/** Angka pada draft resep memakai pecahan ¼ ½ ¾ bila pas kelipatan seperempat. */
export function fmtResepAngka(n: number): string {
	if (!Number.isFinite(n)) return "—";
	const q = Math.round(n * 4);
	if (Math.abs(n - q / 4) < 0.01) {
		const whole = Math.floor(q / 4);
		const rem = q % 4;
		const frac = rem === 1 ? "¼" : rem === 2 ? "½" : rem === 3 ? "¾" : "";
		return (whole ? String(whole) : "") + frac || "0";
	}
	return fmt(n, 2).replace(/,00$/, "");
}

/** Pembulatan jumlah tablet ke pecahan tablet terdekat (¼ / ½ / 1). */
export function roundTo(n: number, step: number | string): number {
	const s = Number(step) || 0.25;
	return Math.round(n / s) * s;
}

/** Normalisasi nama obat untuk pencocokan preset/alias. */
export function normObat(s: unknown): string {
	return String(s || "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "");
}

/** Rentang "a–b"; bila selisihnya < 0,01 ditampilkan satu angka saja. */
export function fmtRange(a: number | null, b: number | null): string {
	const A = Number.isFinite(a as number);
	const B = Number.isFinite(b as number);
	if (!A && !B) return "—";
	if (A && B) {
		const x = a as number;
		const y = b as number;
		return Math.abs(x - y) < 0.01 ? fmt(x, 2) : fmt(x, 2) + "–" + fmt(y, 2);
	}
	return fmt((A ? a : b) as number, 2);
}

/** Warna status selisih dosis: >15% bahaya, >10% waspada, sisanya aman. */
export function statusClass(pct: number): "puyer-danger" | "puyer-warn" | "puyer-ok" {
	const a = Math.abs(pct);
	if (a > 15) return "puyer-danger";
	if (a > 10) return "puyer-warn";
	return "puyer-ok";
}
