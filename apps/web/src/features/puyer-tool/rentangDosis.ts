/*
 * Rentang dosis otomatis pada kartu obat — PORT dari `hitungRentangPuyer` dan
 * `renderRentangText` di public/puyer-tool.html.
 *
 * PERBEDAAN YANG DISENGAJA (hanya satu, dan bukan pada angka):
 * Island menyalin fungsi `hitungDosisInti` dari island Dosis ke dalam dirinya
 * sendiri. Di sini mesin itu diambil dari paket `@tinyverse/clinical-core`
 * (`calculateDosing`) yang merupakan port 1:1 dari fungsi v17 yang sama.
 * Kesetaraannya TIDAK diasumsikan: berkas `rentangDosis.golden.test.ts`
 * membandingkan `calculateDosing` dengan 420 vektor hasil eksekusi fungsi
 * ASLI milik island. Bila suatu saat menyimpang, tes gagal.
 *
 * Teks, ikon, warna, dan susunan kalimat disalin apa adanya.
 */
import { calculateDosing, isDosingError } from "@tinyverse/clinical-core";
import { fmt, fmtRange, num } from "./format";
import { cariObatKatalog, klasifikasiFrekObat } from "./presetObat";
import type { ObatPuyer } from "./obatKatalog";

/** Bentuk hasil yang dipakai layar puyer (bagian yang memang dibaca island). */
export interface HasilDosisRentang {
	dosisMinMg: number | null;
	dosisMaxMg: number | null;
	dosisHarianMinMg: number | null;
	dosisHarianMaxMg: number | null;
	beratBadan: number | null;
	doseBasisFinal: string | null;
	dosesPerDayFinal: number | null;
	peringatan: string[];
}

export type StatusRentang =
	| { state: "nodb" }
	| { state: "noinput"; obat: ObatPuyer }
	| { state: "error"; obat: ObatPuyer; msg: string }
	| { state: "ok"; obat: ObatPuyer; hasil: HasilDosisRentang };

/** Hitung rentang dosis lazim obat untuk pasien ini (tanpa menyentuh DOM). */
export function hitungRentangPuyer(nama: string, bbRaw: string, usiaRaw: string): StatusRentang {
	const obat = cariObatKatalog(nama);
	if (!obat) return { state: "nodb" };
	if (!String(bbRaw ?? "").trim() && !String(usiaRaw ?? "").trim()) return { state: "noinput", obat };

	let keluaran;
	try {
		keluaran = calculateDosing(obat, bbRaw, usiaRaw, undefined);
	} catch {
		return { state: "error", obat, msg: "Gagal menghitung rentang." };
	}
	if (!keluaran) return { state: "error", obat, msg: "Gagal menghitung rentang." };
	if (isDosingError(keluaran)) return { state: "error", obat, msg: keluaran.error };

	return {
		state: "ok",
		obat,
		hasil: {
			dosisMinMg: keluaran.dosisMinMg ?? null,
			dosisMaxMg: keluaran.dosisMaxMg ?? null,
			dosisHarianMinMg: keluaran.dosisHarianMinMg ?? null,
			dosisHarianMaxMg: keluaran.dosisHarianMaxMg ?? null,
			beratBadan: keluaran.beratBadan ?? null,
			doseBasisFinal: keluaran.doseBasisFinal ?? null,
			dosesPerDayFinal: keluaran.dosesPerDayFinal ?? null,
			peringatan: keluaran.peringatan ?? [],
		},
	};
}

/* ===== Ikon sebaris; disalin persis dari island agar tampilannya sama ===== */
const BULB_SVG =
	'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M12 2C8.1 2 5 5.1 5 9C5 11.4 6.2 13.5 8 14.7V17C8 17.6 8.4 18 9 18H15C15.6 18 16 17.6 16 17V14.7C17.8 13.5 19 11.4 19 9C19 5.1 15.9 2 12 2Z" fill="#FEF08A" stroke="#CA8A04" stroke-width="1.5"/><path d="M9 21H15" stroke="#CA8A04" stroke-width="1.5" stroke-linecap="round"/></svg>';
const WARN_SVG =
	'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9V14M12 17H12.01" stroke="#B45309" stroke-width="2" stroke-linecap="round"/></svg>';
const STOP_SVG =
	'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="display:inline-block;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="9" fill="#FCA5A5" stroke="#DC2626" stroke-width="1.8"/><path d="M7 12H17" stroke="#991B1B" stroke-width="2" stroke-linecap="round"/></svg>';

export const PETUNJUK_AWAL_HTML =
	BULB_SVG +
	" Isi <strong>Berat Badan</strong> &amp; <strong>Usia</strong> pasien di atas, lalu pilih nama obat untuk melihat rentang dosis anak ini.";

/** Semua nilai yang berasal dari data dilewatkan fungsi ini sebelum dirangkai. */
function esc(s: unknown): string {
	return String(s == null ? "" : s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export interface TeksRentang {
	cls: string;
	html: string;
}

/** Susun kalimat rentang dosis untuk satu kartu obat. */
export function teksRentangDosis(nama: string, bb: string, usia: string, frekuensi: string): TeksRentang {
	const r = hitungRentangPuyer(nama, bb, usia);

	if (r.state === "nodb") {
		return {
			cls: "pdr-empty",
			html: BULB_SVG + " Rentang dosis otomatis belum tersedia untuk obat ini — isi dosis manual &amp; verifikasi ke pedoman.",
		};
	}
	if (r.state === "noinput") {
		return {
			cls: "pdr-empty",
			html:
				BULB_SVG + " Isi <strong>Berat Badan</strong> &amp; <strong>Usia</strong> pasien di atas untuk melihat rentang dosis <strong>" +
				esc(r.obat.nama) + "</strong>.",
		};
	}
	if (r.state === "error") {
		return { cls: "pdr-warn", html: WARN_SVG + " " + esc(r.msg) };
	}

	const h = r.hasil;
	const sat = r.obat.satuanDosis || "mg";
	const parts: string[] = [];
	const fRaw = num(frekuensi);
	const fPuyer = Number.isFinite(fRaw) && fRaw > 0 ? fRaw : null;
	const kl = klasifikasiFrekObat(h);

	if (kl.single && fPuyer && fPuyer > 1) {
		return {
			cls: "pdr-warn",
			html:
				STOP_SVG + " <strong>" + esc(r.obat.nama) + "</strong> lazimnya diberikan " +
				(kl.native === 1 ? "1×/hari" : "sebagai dosis tunggal") +
				", sehingga <strong>tidak boleh dicampur</strong> ke puyer " + fmt(fPuyer, 0) +
				"×/hari (dosisnya akan salah). Racik / berikan <strong>TERPISAH</strong> — mis. puyer sendiri " +
				(kl.native === 1 ? "1×/hari" : "sebagai dosis tunggal") + ".",
		};
	}

	parts.push(
		BULB_SVG + " Dosis lazim <strong>" + esc(r.obat.nama) + "</strong> untuk anak ini: <strong>" +
			fmtRange(h.dosisMinMg, h.dosisMaxMg) + " " + esc(sat) + "/kali</strong>",
	);

	const bbNilai = h.beratBadan;
	if (
		Number.isFinite(bbNilai as number) && (bbNilai as number) > 0 &&
		Number.isFinite(h.dosisMinMg as number) && Number.isFinite(h.dosisMaxMg as number)
	) {
		parts.push(
			' <span style="color:var(--teks-lembut);font-weight:600;">(≈ ' +
				fmtRange((h.dosisMinMg as number) / (bbNilai as number), (h.dosisMaxMg as number) / (bbNilai as number)) +
				" " + esc(sat) + "/kg)</span>",
		);
	}

	/* Dosis harian: pakai nilai harian bila ada; jika tidak, turunkan dari
	 * (dosis per-kali × frekuensi lazim). */
	let dHarMin: number | null = Number.isFinite(h.dosisHarianMinMg as number) ? h.dosisHarianMinMg : null;
	let dHarMax: number | null = Number.isFinite(h.dosisHarianMaxMg as number) ? h.dosisHarianMaxMg : null;
	let harianDiturunkan = false;
	if (dHarMin === null && dHarMax === null && kl.native && Number.isFinite(h.dosisMinMg as number)) {
		dHarMin = (h.dosisMinMg as number) * kl.native;
		dHarMax = Number.isFinite(h.dosisMaxMg as number) ? (h.dosisMaxMg as number) * kl.native : dHarMin;
		harianDiturunkan = true;
	}

	/* Pengaman: jangan lampaui batas dosis harian obat. */
	if (Number.isFinite(dHarMax as number)) {
		const caps: number[] = [];
		if (r.obat.dosisMaksimalHarianMg) caps.push(r.obat.dosisMaksimalHarianMg);
		if (r.obat.dosisMaksimalHarianPerKg && Number.isFinite(h.beratBadan as number)) {
			caps.push(r.obat.dosisMaksimalHarianPerKg * (h.beratBadan as number));
		}
		if (caps.length) {
			const cap = Math.min(...caps);
			if ((dHarMax as number) > cap) {
				dHarMax = cap;
				if (Number.isFinite(dHarMin as number) && (dHarMin as number) > dHarMax) dHarMin = dHarMax;
			}
		}
	}

	const adaHarian = Number.isFinite(dHarMin as number) || Number.isFinite(dHarMax as number);
	if (adaHarian) {
		parts.push(
			'<br><span style="color:var(--teks-lembut);font-weight:700;">Total dosis harian: ' +
				fmtRange(dHarMin, dHarMax) + " " + esc(sat) + "/hari" +
				(kl.native ? " (lazimnya " + fmt(kl.native, 0) + "×/hari)" : "") +
				(harianDiturunkan
					? ' <span style="font-weight:600;font-style:italic;">(perkiraan dari dosis per-kali × frekuensi)</span>'
					: "") +
				".</span>",
		);
	}

	if (adaHarian && fPuyer && fPuyer > 0) {
		const pbMin = Number.isFinite(dHarMin as number) ? (dHarMin as number) / fPuyer : null;
		const pbMax = Number.isFinite(dHarMax as number) ? (dHarMax as number) / fPuyer : null;
		parts.push(
			'<br><span style="color:var(--utama,#2AA37A);font-weight:700;">Puyer ' + fmt(fPuyer, 0) +
				"×/hari → isi <em>per bungkus</em>: " + fmtRange(pbMin, pbMax) + " " + esc(sat) +
				'/bungkus (mode "mg/bungkus") · total harian ≈ ' + fmtRange(dHarMin, dHarMax) + " " +
				esc(sat) + "/hari.</span>",
		);
		if (kl.native && kl.native !== fPuyer) {
			parts.push(
				'<br><span style="color:#B26A00;font-weight:700;">' + WARN_SVG + " Obat ini lazimnya " +
					fmt(kl.native, 0) + "×/hari, tetapi puyer ini " + fmt(fPuyer, 0) +
					"×/hari. Total harian tetap dijaga (dibagi " + fmt(fPuyer, 0) +
					"); pastikan sesuai klinis.</span>",
			);
		}
	} else if (adaHarian) {
		parts.push(
			'<br><span style="color:var(--teks-lembut);font-weight:600;">Isi <strong>Frekuensi per hari</strong> puyer di atas untuk melihat dosis per bungkus.</span>',
		);
	} else {
		parts.push(
			'<br><span style="color:var(--teks-lembut);font-weight:600;">Pilih dosis dari rentang ini, lalu isi kolom dosis di bawah.</span>',
		);
	}

	const peringatanPertama = h.peringatan[0];
	if (peringatanPertama) {
		return {
			cls: "pdr-warn",
			html:
				parts.join("") + '<br><span style="color:#B26A00;font-weight:700;">' + WARN_SVG + " " +
				esc(peringatanPertama) + "</span>",
		};
	}
	return { cls: "pdr-ok", html: parts.join("") };
}
