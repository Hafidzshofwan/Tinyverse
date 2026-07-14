/**
 * Referensi design tokens TinyVerse (Phase 2).
 * Nilai asli ada di ./tokens.css (sumber kebenaran). File ini hanya memberi
 * REFERENSI bertipe ke CSS variable, agar kode UI tidak hard-code hex.
 */

export const colorTokens = {
	kuning: "var(--kuning)",
	kuningTua: "var(--kuning-tua)",
	biru: "var(--biru)",
	biruTua: "var(--biru-tua)",
	hijau: "var(--hijau)",
	hijauTua: "var(--hijau-tua)",
	oranye: "var(--oranye)",
	oranyeTua: "var(--oranye-tua)",
	pink: "var(--pink)",
	pinkTua: "var(--pink-tua)",
	krem: "var(--krem)",
	putih: "var(--putih)",
	teks: "var(--teks)",
	teksLembut: "var(--teks-lembut)",
	merahLembut: "var(--merah-lembut)",
	etailNavy: "var(--etail-navy)",
	etailNavy2: "var(--etail-navy-2)",
	etailMagenta: "var(--etail-magenta)",
	etailSoft: "var(--etail-soft)",
	etailLine: "var(--etail-line)",
} as const

export const shadowTokens = {
	etail: "var(--etail-shadow)",
	etailSoft: "var(--etail-soft-shadow)",
} as const

export type ColorTokenName = keyof typeof colorTokens
export type ShadowTokenName = keyof typeof shadowTokens
