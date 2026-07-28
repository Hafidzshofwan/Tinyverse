/*
 * Tes mesin Racik Puyer.
 *
 * Angka harapan di bawah diturunkan langsung dari rumus island:
 *   target      = mode 'mgkg' ? bb × dosis : dosis
 *   totalTarget = target × jumlah
 *   teoritis    = totalTarget / sediaan
 *   aktual      = pembulatan teoritis ke pecahan tablet
 *   perBungkus  = (aktual × sediaan) / jumlah
 *   selisih     = perBungkus − target ; pct = selisih / target × 100
 * Ambang status (>10% waspada, >15% bahaya) dan bunyi catatan juga dikunci.
 */
import { describe, expect, it } from "vitest";
import { fmt, fmtResepAngka, roundTo, statusClass } from "./format";
import { cekInteraksiPuyer } from "./interaksi";
import { aturanMengikutiFrekuensi, hitungJumlahBungkus, hitungRacikan, type BarisObat } from "./hitungRacikan";

function baris(p: Partial<BarisObat>): BarisObat {
	return { id: p.nama ?? "x", nama: "", mode: "mgkg", dosis: "", sediaan: "", step: "0.25", aktual: "", ...p };
}

describe("pembantu angka", () => {
	it("memakai koma sebagai pemisah desimal", () => {
		expect(fmt(2.16, 2)).toBe("2,16");
		expect(fmt(9, 0)).toBe("9");
		expect(fmt(NaN, 2)).toBe("—");
	});

	it("menulis jumlah tablet resep sebagai pecahan", () => {
		expect(fmtResepAngka(2.25)).toBe("2¼");
		expect(fmtResepAngka(0.5)).toBe("½");
		expect(fmtResepAngka(0.75)).toBe("¾");
		expect(fmtResepAngka(3)).toBe("3");
	});

	it("membulatkan ke pecahan tablet terdekat", () => {
		expect(roundTo(2.16, 0.25)).toBeCloseTo(2.25, 10);
		expect(roundTo(2.16, 0.5)).toBeCloseTo(2, 10);
		expect(roundTo(2.6, 1)).toBeCloseTo(3, 10);
	});

	it("memakai ambang status 10% dan 15%", () => {
		expect(statusClass(4.17)).toBe("puyer-ok");
		expect(statusClass(10)).toBe("puyer-ok");
		expect(statusClass(-12)).toBe("puyer-warn");
		expect(statusClass(16)).toBe("puyer-danger");
	});
});

describe("jumlah bungkus & etiket", () => {
	it("mengalikan frekuensi dengan durasi", () => {
		expect(hitungJumlahBungkus("3", "3")).toBe(9);
		expect(hitungJumlahBungkus("", "3")).toBeNull();
	});

	it("hanya memperbarui angka pada etiket standar", () => {
		expect(aturanMengikutiFrekuensi("", "3")).toBe("S 3 dd 1 pulv");
		expect(aturanMengikutiFrekuensi("S 2 dd 1 pulv p.c.", "4")).toBe("S 4 dd 1 pulv p.c.");
	});

	it("tidak menimpa catatan khusus dokter", () => {
		expect(aturanMengikutiFrekuensi("Habiskan, minum sesudah makan", "3")).toBe("Habiskan, minum sesudah makan");
	});
});

describe("hitungRacikan", () => {
	const dasar = { bb: "12", usia: "24", frekuensi: "3", durasi: "3", jumlah: "9", aturan: "" };

	it("menghitung satu obat mg/kg dengan pembulatan ¼ tablet", () => {
		const h = hitungRacikan({
			...dasar,
			rows: [baris({ nama: "Paracetamol", dosis: "10", sediaan: "500" })],
		});

		expect(h.gagal).toBeNull();
		expect(h.rows).toHaveLength(1);
		const r = h.rows[0]!;
		expect(r.target).toBeCloseTo(120, 10);
		expect(r.totalTarget).toBeCloseTo(1080, 10);
		expect(r.teoritis).toBeCloseTo(2.16, 10);
		expect(r.aktual).toBeCloseTo(2.25, 10);
		expect(r.perBungkus).toBeCloseTo(125, 10);
		expect(r.selisih).toBeCloseTo(5, 10);
		expect(r.pct).toBeCloseTo(4.1666667, 5);
		expect(r.cls).toBe("puyer-ok");
	});

	it("menyusun draft resep persis seperti island", () => {
		const h = hitungRacikan({
			...dasar,
			rows: [baris({ nama: "Paracetamol", dosis: "10", sediaan: "500" })],
		});
		expect(h.resepText).toBe(
			["R/", "  Paracetamol tab 500 mg  No. 2¼", "  m.f. pulv. dtd. No. 9", "  S 3 dd 1 pulv"].join("\n"),
		);
		expect(h.aturan).toBe("S 3 dd 1 pulv");
	});

	it("memakai dosis apa adanya pada mode mg/bungkus", () => {
		const h = hitungRacikan({
			...dasar,
			rows: [baris({ nama: "CTM", mode: "mgkali", dosis: "1", sediaan: "4" })],
		});
		const r = h.rows[0]!;
		expect(r.target).toBeCloseTo(1, 10);
		expect(r.teoritis).toBeCloseTo(2.25, 10);
		expect(r.aktual).toBeCloseTo(2.25, 10);
		expect(r.selisih).toBeCloseTo(0, 10);
	});

	it("memperingatkan bila selisih pembulatan melebihi 10%", () => {
		const h = hitungRacikan({
			...dasar,
			jumlah: "1",
			rows: [baris({ nama: "Obat Uji", mode: "mgkali", dosis: "100", sediaan: "500" })],
		});
		const r = h.rows[0]!;
		expect(r.aktual).toBeCloseTo(0.25, 10);
		expect(r.perBungkus).toBeCloseTo(125, 10);
		expect(r.pct).toBeCloseTo(25, 10);
		expect(r.cls).toBe("puyer-danger");
		expect(h.catatan.some((c) => c.teks.includes("Selisih dosis Obat Uji +25,0%"))).toBe(true);
	});

	it("menolak menghitung tanpa jumlah bungkus atau tanpa obat", () => {
		expect(hitungRacikan({ ...dasar, jumlah: "", rows: [] }).gagal).toBe(
			"Isi jumlah bungkus puyer terlebih dahulu.",
		);
		expect(hitungRacikan({ ...dasar, rows: [] }).gagal).toBe("Tambahkan minimal 1 obat.");
	});

	it("meminta BB bila dosis memakai mg/kg", () => {
		const h = hitungRacikan({
			...dasar,
			bb: "",
			usia: "",
			rows: [baris({ nama: "Obat Uji", dosis: "10", sediaan: "500" })],
		});
		expect(h.rows).toHaveLength(0);
		expect(h.catatan.some((c) => c.teks.includes("BB wajib diisi"))).toBe(true);
	});

	it("mengingatkan bila racikan berisi 4 obat atau lebih", () => {
		const h = hitungRacikan({
			...dasar,
			rows: ["A", "B", "C", "D"].map((n) =>
				baris({ id: n, nama: "Obat " + n, mode: "mgkali", dosis: "5", sediaan: "10" }),
			),
		});
		expect(h.catatan.some((c) => c.teks.startsWith("Racikan berisi 4 obat"))).toBe(true);
	});

	it("selalu menutup dengan catatan kompatibilitas", () => {
		const h = hitungRacikan({
			...dasar,
			rows: [baris({ nama: "Paracetamol", dosis: "10", sediaan: "500" })],
		});
		const penutup = h.catatan[h.catatan.length - 1]!;
		expect(penutup.jenis).toBe("info");
		expect(penutup.teks).toBe(
			"Pastikan semua obat kompatibel untuk dicampur dalam satu puyer dan boleh digerus.",
		);
	});

	it("mengeluarkan obat dosis tunggal dari puyer 3×/hari", () => {
		const h = hitungRacikan({
			...dasar,
			rows: [baris({ nama: "Albendazole", mode: "mgkali", dosis: "400", sediaan: "400" })],
		});
		expect(h.terpisah.length).toBe(1);
		expect(h.rows).toHaveLength(0);
		expect(h.catatan.some((c) => c.jenis === "stop")).toBe(true);
	});
});

describe("deteksi interaksi", () => {
	it("menandai obat yang sama tercatat dua kali", () => {
		const temuan = cekInteraksiPuyer([{ nama: "Paracetamol" }, { nama: "paracetamol" }]);
		expect(temuan.some((t) => t.level === "hindari" && t.pesan.includes("tercatat dua kali"))).toBe(true);
	});

	it("menandai kuinolon/tetrasiklin bersama mineral", () => {
		const temuan = cekInteraksiPuyer([{ nama: "Ciprofloxacin" }, { nama: "Zinc" }]);
		expect(temuan.some((t) => t.level === "hindari" && t.pesan.includes("khelasi"))).toBe(true);
	});

	it("menandai dua obat satu kelas dan tumpukan sedatif", () => {
		const temuan = cekInteraksiPuyer([{ nama: "Cetirizine" }, { nama: "CTM" }]);
		expect(temuan.some((t) => t.pesan.includes("Antihistamin"))).toBe(true);
		expect(temuan.some((t) => t.pesan.includes("sedatif"))).toBe(true);
	});

	it("tidak menandai apa pun untuk satu obat tunggal", () => {
		expect(cekInteraksiPuyer([{ nama: "Paracetamol" }])).toEqual([]);
	});
});
