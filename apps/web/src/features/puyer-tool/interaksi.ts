/*
 * Deteksi interaksi antar-obat dalam satu racikan — PORT 1:1 dari
 * public/puyer-tool.html (PUYER_KELAS, PUYER_SEDATIF, PUYER_PASANGAN,
 * _puyerNamaGabung, _puyerKelas, cekInteraksiPuyer).
 *
 * Seluruh kata kunci dan bunyi pesan disalin apa adanya. Daftar ini bersifat
 * BANTU-INGAT dan belum lengkap; setiap temuan tetap wajib diverifikasi ke
 * apoteker atau pedoman.
 */
import { normObat } from "./format";
import { cariObatKatalog } from "./presetObat";

export type LevelInteraksi = "hindari" | "hati";

export interface TemuanInteraksi {
	level: LevelInteraksi;
	pesan: string;
}

interface KelompokKelas {
	kelas: string;
	match: string[];
}

const PUYER_KELAS: KelompokKelas[] = [
	{
		kelas: "Antihistamin",
		match: [
			"chlorpheniramine",
			"chlorphenamine",
			"ctm",
			"cetirizine",
			"loratadine",
			"loratadin",
			"desloratadine",
			"fexofenadine",
			"diphenhydramine",
			"difenhidramin",
			"ketotifen",
			"mebhydrolin",
			"mebhidrolin",
			"dexchlorpheniramine",
			"deksklorfeniramin",
			"cyproheptadine",
			"siproheptadin",
		],
	},
	{
		kelas: "NSAID (anti-inflamasi non-steroid)",
		match: [
			"ibuprofen",
			"asam mefenamat",
			"mefenamic",
			"ketoprofen",
			"diclofenac",
			"diklofenak",
			"naproxen",
			"piroxicam",
			"aspirin",
			"asetosal",
			"asam asetilsalisilat",
		],
	},
	{
		kelas: "Kortikosteroid",
		match: [
			"prednisone",
			"prednison",
			"prednisolone",
			"prednisolon",
			"methylprednisolone",
			"metilprednisolon",
			"dexamethasone",
			"deksametason",
			"betamethasone",
			"betametason",
			"triamcinolone",
		],
	},
	{
		kelas: "Prokinetik/antiemetik dopaminergik",
		match: ["domperidone", "domperidon", "metoclopramide", "metoklopramid"],
	},
	{
		kelas: "Bronkodilator beta-2",
		match: ["salbutamol", "albuterol", "terbutaline", "terbutalin", "procaterol", "prokaterol"],
	},
	{ kelas: "Xantin", match: ["theophylline", "teofilin", "aminophylline", "aminofilin"] },
	{
		kelas: "Dekongestan oral",
		match: ["pseudoephedrine", "pseudoefedrin", "phenylephrine", "fenilefrin"],
	},
	{
		kelas: "Antitusif sentral/opioid",
		match: ["codeine", "codein", "kodein", "dihydrocodeine", "dextromethorphan", "dekstrometorfan"],
	},
];

const PUYER_SEDATIF: string[] = [
	"chlorpheniramine",
	"chlorphenamine",
	"ctm",
	"diphenhydramine",
	"difenhidramin",
	"ketotifen",
	"cyproheptadine",
	"siproheptadin",
	"mebhydrolin",
	"mebhidrolin",
	"codeine",
	"codein",
	"kodein",
	"phenobarbital",
	"fenobarbital",
	"luminal",
	"diazepam",
	"cetirizine",
];

interface PasanganInteraksi {
	grupA: string[];
	grupB: string[];
	level: LevelInteraksi;
	pesan: string;
}

const PUYER_PASANGAN: PasanganInteraksi[] = [
	{
		grupA: [
			"ciprofloxacin",
			"siprofloksasin",
			"levofloxacin",
			"ofloxacin",
			"tetracycline",
			"tetrasiklin",
			"doxycycline",
			"doksisiklin",
		],
		grupB: [
			"calcium",
			"kalsium",
			"calcii",
			"zinc",
			"zink",
			"ferrous",
			"fero",
			"besi",
			"iron",
			"sulfas ferrosus",
			"antasida",
			"antacid",
			"magnesium",
			"aluminium",
			"alumunium",
		],
		level: "hindari",
		pesan:
			"Antibiotik kuinolon/tetrasiklin + mineral (Ca/Fe/Zn/Mg/Al): terjadi khelasi yang menurunkan penyerapan antibiotik secara drastis. Jangan digabung dalam satu puyer — beri jeda pemberian minimal 2 jam.",
	},
	{
		grupA: ["domperidone", "domperidon", "metoclopramide", "metoklopramid"],
		grupB: [
			"hyoscine",
			"hiosin",
			"scopolamine",
			"skopolamin",
			"atropine",
			"atropin",
			"dicycloverine",
			"dicyclomine",
			"papaverine",
			"papaverin",
			"belladonna",
			"beladona",
		],
		level: "hindari",
		pesan:
			"Prokinetik (domperidon/metoklopramid) + antikolinergik/antispasmodik: efeknya saling meniadakan (motilitas naik vs turun). Hindari dalam satu racikan.",
	},
	{
		grupA: ["salbutamol", "albuterol", "terbutaline", "terbutalin", "procaterol", "prokaterol"],
		grupB: ["theophylline", "teofilin", "aminophylline", "aminofilin"],
		level: "hati",
		pesan:
			"Beta-2 agonis (mis. salbutamol) + xantin (teofilin): efek stimulasi jantung dan risiko hipokalemia bertambah. Pantau ketat bila terpaksa digabung.",
	},
];

/** Gabungkan nama yang diketik dengan nama resmi katalog agar alias ikut terdeteksi. */
function namaGabung(nama: string | undefined): string {
	let base = String(nama || "").toLowerCase();
	try {
		const db = cariObatKatalog(nama || "");
		if (db && db.nama) base += " " + String(db.nama).toLowerCase();
	} catch {
		/* katalog tidak wajib ada — sama seperti island */
	}
	return base;
}

function kelasDari(full: string): string[] {
	const hits: string[] = [];
	for (const g of PUYER_KELAS) {
		if (g.match.some((kw) => full.indexOf(kw) >= 0)) hits.push(g.kelas);
	}
	return hits;
}

export interface BarisNamaObat {
	nama?: string;
}

/** Urutan temuan dan pembuangan duplikat mengikuti island persis. */
export function cekInteraksiPuyer(rows: ReadonlyArray<BarisNamaObat>): TemuanInteraksi[] {
	const res: TemuanInteraksi[] = [];
	const items = (rows || [])
		.map((r) => {
			const full = namaGabung(r.nama);
			return {
				nama: String(r.nama || "").trim() || "(tanpa nama)",
				full,
				norm: normObat(r.nama || ""),
				kelas: kelasDari(full),
			};
		})
		.filter((x) => x.norm);

	for (let i = 0; i < items.length; i++) {
		for (let j = i + 1; j < items.length; j++) {
			if (items[i]!.norm === items[j]!.norm) {
				res.push({
					level: "hindari",
					pesan:
						"Obat sama tercatat dua kali (" +
						items[i]!.nama +
						"): risiko dosis ganda. Gabungkan menjadi satu baris.",
				});
			}
		}
	}

	const kelasMap: Record<string, string[]> = {};
	for (const x of items) {
		for (const k of x.kelas) {
			(kelasMap[k] = kelasMap[k] || []).push(x.nama);
		}
	}
	for (const k of Object.keys(kelasMap)) {
		const u = Array.from(new Set(kelasMap[k]!));
		if (u.length >= 2) {
			res.push({
				level: "hati",
				pesan:
					"Dua obat satu kelas — " +
					k +
					": " +
					u.join(" + ") +
					". Efek aditif / duplikasi terapi; tinjau perlunya keduanya.",
			});
		}
	}

	const sed = items
		.filter((x) => PUYER_SEDATIF.some((kw) => x.full.indexOf(kw) >= 0))
		.map((x) => x.nama);
	const sedU = Array.from(new Set(sed));
	if (sedU.length >= 2) {
		res.push({
			level: "hati",
			pesan:
				"Beberapa obat berefek mengantuk/sedatif digabung (" +
				sedU.join(" + ") +
				"): risiko depresi SSP aditif. Pertimbangkan ulang.",
		});
	}

	for (const p of PUYER_PASANGAN) {
		const a = items.filter((x) => p.grupA.some((kw) => x.full.indexOf(kw) >= 0));
		const b = items.filter((x) => p.grupB.some((kw) => x.full.indexOf(kw) >= 0));
		let found = false;
		for (const x of a) {
			for (const y of b) {
				if (x !== y) found = true;
			}
		}
		if (found) res.push({ level: p.level, pesan: p.pesan });
	}

	const seen: Record<string, boolean> = {};
	return res.filter((r) => {
		if (seen[r.pesan]) return false;
		seen[r.pesan] = true;
		return true;
	});
}
