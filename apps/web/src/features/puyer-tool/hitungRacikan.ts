/*
 * Mesin hitung Racik Puyer — PORT 1:1 dari fungsi `hitung()` di
 * public/puyer-tool.html.
 *
 * WHY fungsi murni: di island, perhitungan dan penulisan HTML tercampur dalam
 * satu fungsi yang membaca DOM. Di sini rumusnya dipisah menjadi fungsi tanpa
 * efek samping supaya bisa dikunci oleh tes. RUMUS, URUTAN OPERASI, AMBANG
 * PERINGATAN, dan BUNYI TEKS tidak diubah sedikit pun.
 */
import { fmt, fmtResepAngka, num, roundTo, statusClass } from "./format";
import { cekInteraksiPuyer, type TemuanInteraksi } from "./interaksi";
import { klasifikasiFrekObat } from "./presetObat";
import { hitungRentangPuyer } from "./rentangDosis";

export type ModeDosis = "mgkg" | "mgkali";

/** Satu baris obat sebagaimana diisi pengguna pada formulir. */
export interface BarisObat {
	id: string;
	nama: string;
	mode: ModeDosis;
	dosis: string;
	sediaan: string;
	step: string;
	aktual: string;
}

export interface InputRacikan {
	bb: string;
	usia: string;
	frekuensi: string;
	durasi: string;
	jumlah: string;
	aturan: string;
	rows: ReadonlyArray<BarisObat>;
}

/** Satu baris hasil perhitungan yang tampil di tabel hasil. */
export interface BarisHasil {
	nama: string;
	mode: ModeDosis;
	dosisInput: number;
	sed: number;
	target: number;
	totalTarget: number;
	teoritis: number;
	aktual: number;
	totalAktual: number;
	perBungkus: number;
	selisih: number;
	pct: number;
	cls: "puyer-danger" | "puyer-warn" | "puyer-ok";
}

export type JenisCatatan = "warn" | "stop" | "info";

export interface Catatan {
	jenis: JenisCatatan;
	teks: string;
}

export interface HasilRacikan {
	/** Diisi bila perhitungan dibatalkan (di island berupa alert). */
	gagal: string | null;
	bb: number;
	jumlah: number;
	frekuensi: number;
	durasi: number;
	aturan: string;
	rows: BarisHasil[];
	terpisah: string[];
	catatan: Catatan[];
	interaksi: TemuanInteraksi[];
	resepText: string;
	catatanText: string;
	ringkasanText: string;
}

const RISKY = /(digoxin|fenitoin|phenytoin|teofilin|theophylline|warfarin|levotiroksin|levothyroxine|carbamazepine|valproat|valproate)/i;
const FORBIDDEN = /(sr|xr|er|retard|lepas lambat|extended|sustained|enteric|ec\b|salut enterik)/i;

export const CATATAN_PENUTUP =
	"Catatan: verifikasi dosis, kompatibilitas, stabilitas, dan apakah sediaan boleh digerus.";

/**
 * Hitung jumlah bungkus dari frekuensi × durasi (tombol "hitung otomatis").
 * Mengembalikan null bila input belum lengkap, persis seperti island.
 */
export function hitungJumlahBungkus(frekuensi: string, durasi: string): number | null {
	const f = num(frekuensi);
	const d = num(durasi);
	if (Number.isFinite(f) && Number.isFinite(d) && f > 0 && d > 0) return Math.round(f * d);
	return null;
}

/**
 * Perbarui teks aturan pakai mengikuti frekuensi.
 * Etiket standar "S N dd ..." hanya diperbarui angkanya; catatan khusus dokter
 * SENGAJA tidak ditimpa agar aman.
 */
export function aturanMengikutiFrekuensi(aturanSekarang: string, frekuensi: string): string {
	const f = num(frekuensi);
	const cur = (aturanSekarang || "").trim();
	if (!Number.isFinite(f)) return aturanSekarang;
	if (!cur) return "S " + fmt(f, 0) + " dd 1 pulv";
	if (/^S\s*\d+(?:[.,]\d+)?\s*dd\b/i.test(cur)) {
		return cur.replace(/^(S\s*)\d+(?:[.,]\d+)?(\s*dd\b)/i, "$1" + fmt(f, 0) + "$2");
	}
	return aturanSekarang;
}

function jenisDari(prefix: string): JenisCatatan {
	if (prefix === "\u{1F6AB}") return "stop";
	if (prefix === "\u2139\uFE0F") return "info";
	return "warn";
}

export function hitungRacikan(input: InputRacikan): HasilRacikan {
	const bb = num(input.bb);
	const f = num(input.frekuensi);
	const d = num(input.durasi);
	const jumlah = num(input.jumlah);
	const aturan =
		(input.aturan || "").trim() ||
		(Number.isFinite(f) ? "S " + fmt(f, 0) + " dd 1 pulv" : "Sesuai instruksi");

	/* Catatan dikumpulkan bersama penanda emoji seperti island, lalu penanda itu
	 * diterjemahkan menjadi jenis ikon saat dirender. */
	const notes: string[] = [];
	const kosong = (pesan: string): HasilRacikan => ({
		gagal: pesan, bb, jumlah, frekuensi: f, durasi: d, aturan,
		rows: [], terpisah: [], catatan: [], interaksi: [],
		resepText: "", catatanText: CATATAN_PENUTUP, ringkasanText: "",
	});

	if (!Number.isFinite(jumlah) || jumlah <= 0) return kosong("Isi jumlah bungkus puyer terlebih dahulu.");
	if (!input.rows.length) return kosong("Tambahkan minimal 1 obat.");

	if (input.rows.length >= 4) {
		notes.push(
			"\u26A0\uFE0F Racikan berisi " + input.rows.length +
				" obat. Pertimbangkan kembali kebutuhan dan kompatibilitas tiap obat.",
		);
	}

	const rows: BarisHasil[] = [];
	const terpisah: string[] = [];

	for (const r of input.rows) {
		const nama = (r.nama || "").trim() || "Obat tanpa nama";

		const infoFrek = hitungRentangPuyer(r.nama, input.bb, input.usia);
		if (infoFrek.state === "ok") {
			const kl = klasifikasiFrekObat(infoFrek.hasil);
			if (kl.single && Number.isFinite(f) && f > 1) {
				terpisah.push(nama + (kl.native === 1 ? " (1×/hari)" : " (dosis tunggal)"));
				notes.push(
					"\u{1F6AB} " + nama + " TIDAK dimasukkan ke puyer " + fmt(f, 0) +
						"×/hari karena harus diberikan " +
						(kl.native === 1 ? "1×/hari" : "sebagai dosis tunggal") +
						". Racik / berikan TERPISAH.",
				);
				continue;
			}
			if (kl.native && Number.isFinite(f) && kl.native !== f) {
				notes.push(
					"\u26A0\uFE0F " + nama + " lazimnya " + fmt(kl.native, 0) +
						"×/hari; dalam puyer " + fmt(f, 0) + "×/hari dosis hariannya dibagi " +
						fmt(f, 0) + ". Pastikan sesuai klinis.",
				);
			}
		}

		const dosisInput = num(r.dosis);
		const sed = num(r.sediaan);
		const step = num(r.step) || 0.25;

		if (!Number.isFinite(dosisInput) || dosisInput <= 0 || !Number.isFinite(sed) || sed <= 0) {
			notes.push("\u26A0\uFE0F Data belum lengkap untuk " + nama + ".");
			continue;
		}
		if (r.mode === "mgkg" && (!Number.isFinite(bb) || bb <= 0)) {
			notes.push("\u26A0\uFE0F BB wajib diisi untuk dosis mg/kg/kali pada " + nama + ".");
			continue;
		}

		const target = r.mode === "mgkg" ? bb * dosisInput : dosisInput;
		const totalTarget = target * jumlah;
		const teoritis = totalTarget / sed;
		const aktualManual = num(r.aktual);
		const aktual =
			Number.isFinite(aktualManual) && aktualManual > 0 ? aktualManual : roundTo(teoritis, step);
		const totalAktual = aktual * sed;
		const perBungkus = totalAktual / jumlah;
		const selisih = perBungkus - target;
		const pct = target ? (selisih / target) * 100 : 0;
		const cls = statusClass(pct);

		if (Math.abs(pct) > 10) {
			notes.push(
				"\u26A0\uFE0F Selisih dosis " + nama + " " + (pct > 0 ? "+" : "") + fmt(pct, 1) +
					"%. Periksa ulang pembulatan atau gunakan sediaan lain.",
			);
		}
		if (RISKY.test(nama)) {
			notes.push(
				"\u26A0\uFE0F " + nama +
					" termasuk obat yang perlu kehati-hatian tinggi. Hindari pembulatan tanpa verifikasi.",
			);
		}
		if (FORBIDDEN.test(nama)) {
			notes.push(
				"\u26A0\uFE0F Pastikan " + nama +
					" bukan sediaan lepas lambat/enteric-coated yang tidak boleh digerus.",
			);
		}

		rows.push({
			nama, mode: r.mode, dosisInput, sed, target, totalTarget,
			teoritis, aktual, totalAktual, perBungkus, selisih, pct, cls,
		});
	}

	notes.push(
		"\u2139\uFE0F Pastikan semua obat kompatibel untuk dicampur dalam satu puyer dan boleh digerus.",
	);

	const interaksi = cekInteraksiPuyer(input.rows);

	/* Draft resep — susunan baris dipertahankan apa adanya. */
	const resepLines: string[] = ["R/"];
	for (const r of rows) {
		resepLines.push(
			"  " + r.nama + " tab " + fmt(r.sed, 2).replace(/,00$/, "") + " mg  No. " + fmtResepAngka(r.aktual),
		);
	}
	resepLines.push("  m.f. pulv. dtd. No. " + fmt(jumlah, 0));
	resepLines.push("  S " + aturan.replace(/^S\s*/i, ""));
	const resepText = resepLines.join("\n");

	/* Teks salin/ringkasan — sama persis dengan island. */
	const lines: string[] = ["RACIK PUYER"];
	if (Number.isFinite(bb) && bb > 0) lines.push("BB: " + fmt(bb, 1) + " kg");
	lines.push("Jumlah: " + fmt(jumlah, 0) + " bungkus");
	lines.push("Aturan: " + aturan);
	lines.push("");
	for (const r of rows) {
		lines.push(
			"- " + r.nama + ": target " + fmt(r.target, 2) + " mg/bungkus; pakai " + fmt(r.aktual, 2) +
				" tab @ " + fmt(r.sed, 2) + " mg; aktual " + fmt(r.perBungkus, 2) +
				" mg/bungkus; selisih " + (r.selisih >= 0 ? "+" : "") + fmt(r.selisih, 2) +
				" mg (" + (r.pct >= 0 ? "+" : "") + fmt(r.pct, 1) + "%).",
		);
	}
	lines.push("");
	if (terpisah.length) {
		lines.push("DIRACIK TERPISAH (tidak digabung): " + terpisah.join(", "));
		lines.push("");
	}
	if (interaksi.length) {
		lines.push("PERINGATAN INTERAKSI:");
		for (const it of interaksi) {
			lines.push("- [" + (it.level === "hindari" ? "HINDARI" : "HATI-HATI") + "] " + it.pesan);
		}
		lines.push("");
	}
	lines.push("DRAFT RESEP");
	lines.push(resepText);
	lines.push("");
	lines.push(CATATAN_PENUTUP);

	/* Duplikat catatan dibuang persis seperti island (Set atas teks penuh). */
	const catatan: Catatan[] = Array.from(new Set(notes)).map((n) => {
		const m = /^(\u26A0\uFE0F|\u{1F6AB}|\u2139\uFE0F)\s*/u.exec(n);
		const prefix = m?.[1] ?? "";
		return { jenis: jenisDari(prefix), teks: prefix ? n.slice(m?.[0]?.length ?? 0) : n };
	});

	return {
		gagal: null, bb, jumlah, frekuensi: f, durasi: d, aturan,
		rows, terpisah, catatan, interaksi,
		resepText, catatanText: CATATAN_PENUTUP, ringkasanText: lines.join("\n"),
	};
}
