/*
 * Preset obat & pencarian katalog — PORT 1:1 dari public/puyer-tool.html
 * (getPresetPuyer, isiDatalistPuyer, cariPresetObat, puyerCariObatDb,
 * klasifikasiFrekObat).
 *
 * Urutan pencarian dipertahankan persis: cocok tepat dulu, baru cocok sebagian.
 * Mengubah urutan ini akan mengubah obat mana yang preset-nya terpakai.
 */
import { normObat } from "./format";
import { KATALOG_OBAT_PUYER, type ObatPuyer } from "./obatKatalog";

export interface PresetPuyer {
	nama: string;
	alias: string[];
	mode: "mgkg" | "mgkali";
	dosis: number;
	sediaan: number;
	catatan: string;
}

/** Hanya obat yang punya blok `puyer` yang muncul sebagai preset. */
export function getPresetPuyer(): PresetPuyer[] {
	return KATALOG_OBAT_PUYER.filter((o) => o && o.puyer).map((o) => ({
		nama: o.nama,
		alias: o.puyer?.alias || [],
		mode: o.puyer?.mode || "mgkg",
		dosis: o.puyer?.dosis as number,
		sediaan: o.puyer?.sediaan as number,
		catatan: o.puyer?.catatan || "",
	}));
}

/** Isi daftar saran (dulu <datalist> yang diisi isiDatalistPuyer). */
export function namaObatUntukSaran(): string[] {
	return KATALOG_OBAT_PUYER.filter((o) => o && o.puyer).map((o) => o.nama);
}

/** Cocok tepat pada nama/alias lebih dulu, baru cocok sebagian. */
export function cariPresetObat(q: string): PresetPuyer | null {
	const nq = normObat(q);
	if (!nq) return null;
	const LIST = getPresetPuyer();
	return (
		LIST.find((o) => normObat(o.nama) === nq || (o.alias || []).some((a) => normObat(a) === nq)) ||
		LIST.find(
			(o) => normObat(o.nama).includes(nq) || (o.alias || []).some((a) => normObat(a).includes(nq)),
		) ||
		null
	);
}

/** Padanan puyerCariObatDb: nama persis → lewat preset → cocok sebagian dua arah. */
export function cariObatKatalog(nama: string): ObatPuyer | null {
	const q = normObat(nama);
	if (!q) return null;
	const db = KATALOG_OBAT_PUYER;
	if (!db.length) return null;

	let hit = db.find((o) => normObat(o.nama) === q);
	if (hit) return hit;

	const pre = cariPresetObat(nama);
	if (pre) {
		const h2 = db.find((o) => normObat(o.nama) === normObat(pre.nama));
		if (h2) return h2;
	}

	hit = db.find((o) => {
		const n = normObat(o.nama);
		return !!n && (n.indexOf(q) >= 0 || q.indexOf(n) >= 0);
	});
	return hit || null;
}

export interface KlasifikasiFrek {
	/** Frekuensi lazim obat per hari menurut katalog, bila diketahui. */
	native: number | null;
	basis: string | null;
	/** Obat dosis tunggal / sekali episode — tidak boleh dicampur ke puyer multi-dosis. */
	single: boolean;
}

/*
 * Bentuk masukan sengaja dibuat minimal (structural), bukan `DosingResult`.
 *
 * WHY: island hanya membaca dua bidang ini, dan pemanggilnya berbeda-beda —
 * `rentangDosis.ts` mengirim `HasilDosisRentang` miliknya sendiri, sedangkan
 * pemanggil lain bisa mengirim hasil `calculateDosing`. Mensyaratkan
 * `DosingResult` utuh akan menolak keduanya tanpa alasan klinis.
 */
export interface SumberFrekuensi {
	dosesPerDayFinal?: number | null;
	doseBasisFinal?: string | null;
}

export function klasifikasiFrekObat(h: SumberFrekuensi | null | undefined): KlasifikasiFrek {
	if (!h) return { native: null, basis: null, single: false };
	const native = Number.isFinite(h.dosesPerDayFinal as number) ? (h.dosesPerDayFinal as number) : null;
	const basis = h.doseBasisFinal || null;
	const single = basis === "perEpisode" || (native !== null && native <= 1);
	return { native, basis, single };
}
