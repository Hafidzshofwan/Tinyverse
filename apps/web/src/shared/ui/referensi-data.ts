/**
 * Katalog daftar pustaka Tinyverse.
 *
 * WHY: sitasi disimpan terpusat, bukan ditulis ulang di tiap komponen, supaya
 * satu sumber yang dipakai beberapa alat tidak berbeda penulisannya.
 *
 * ATURAN ISI: hanya sumber yang benar-benar menjadi dasar angka yang dihitung
 * aplikasi, maksimal dua sitasi per alat. Bacaan pendamping sengaja tidak
 * dimuat agar setiap baris bisa dipertanggungjawabkan.
 *
 * Gaya penulisan: Vancouver.
 */

export type ReferensiItem = {
	/** Sitasi utuh, sudah siap tampil apa adanya. */
	teks: string;
	/** Pranala resmi bila ada (PubMed, DOI, atau repositori penerbit). */
	tautan?: string;
	/** Label pranala, mis. "PubMed" atau "NICE". */
	labelTautan?: string;
};

/** Dipakai dua kali: alat rumatan dan komponen rumatan pada luka bakar. */
const HOLLIDAY_SEGAR_1957: ReferensiItem = {
	teks: "Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957;19(5):823-32.",
	tautan: "https://pubmed.ncbi.nlm.nih.gov/13431307/",
	labelTautan: "PubMed",
};

/**
 * Rehidrasi WHO: Rencana Terapi A, B, dan C.
 * Tabel cairan tambahan Rencana A, dosis 75 mL/kg per 3 jam Rencana B, dan
 * pembagian 30/70 mL/kg Rencana C seluruhnya berasal dari buku saku ini,
 * sehingga satu sitasi sudah memadai.
 */
export const REFERENSI_REHIDRASI_WHO: ReadonlyArray<ReferensiItem> = [
	{
		teks: "Kementerian Kesehatan Republik Indonesia. Buku Saku Petugas Kesehatan: Lintas Diare (Lima Langkah Tuntaskan Diare). Edisi 2011. Jakarta: Kementerian Kesehatan RI; 2011.",
		tautan: "https://repository.kemkes.go.id/book/997",
		labelTautan: "Repositori Kemenkes",
	},
];

/**
 * Cairan rumatan.
 * NICE NG29 disertakan karena menyebut rumus 100/50/20 secara eksplisit pada
 * rekomendasi 1.4.1, jadi ia menegaskan angka yang dipakai aplikasi.
 */
export const REFERENSI_RUMATAN: ReadonlyArray<ReferensiItem> = [
	HOLLIDAY_SEGAR_1957,
	{
		teks: "National Institute for Health and Care Excellence. Intravenous fluid therapy in children and young people in hospital. NICE Guideline NG29. London: NICE; 2015 (pembaruan Juni 2020). Rekomendasi 1.4.1.",
		tautan: "https://www.nice.org.uk/guidance/ng29",
		labelTautan: "NICE",
	},
];

/** Luka bakar: chart Lund & Browder + volume Parkland. */
export const REFERENSI_LUKA_BAKAR_LUND: ReadonlyArray<ReferensiItem> = [
	{
		teks: "Lund CC, Browder NC. The estimation of areas of burns. Surg Gynecol Obstet. 1944;79:352-8.",
	},
	{
		teks: "Baxter CR, Shires T. Physiological response to crystalloid resuscitation of severe burns. Ann N Y Acad Sci. 1968;150(3):874-94.",
		tautan: "https://pubmed.ncbi.nlm.nih.gov/4973463/",
		labelTautan: "PubMed",
	},
];

/** Luka bakar: Rule of Nines + kerangka resusitasi ATLS. */
export const REFERENSI_LUKA_BAKAR_RULE9: ReadonlyArray<ReferensiItem> = [
	{
		teks: "Wallace AB. The exposure treatment of burns. Lancet. 1951;257(6653):501-4.",
		tautan: "https://pubmed.ncbi.nlm.nih.gov/14805109/",
		labelTautan: "PubMed",
	},
	{
		teks: "American College of Surgeons Committee on Trauma. Advanced Trauma Life Support (ATLS) Student Course Manual. Edisi ke-10. Chicago: American College of Surgeons; 2018. Bab 9: Cedera Termal.",
		tautan:
			"https://www.facs.org/quality-programs/trauma/education/advanced-trauma-life-support/",
		labelTautan: "ACS",
	},
];

/**
 * Faktor tetes.
 * WHY satu sitasi saja: angka 15/20/60 tetes/mL adalah spesifikasi produk
 * infus set, bukan temuan penelitian, sehingga tidak ada makalah yang layak
 * dikutip. Yang dirujuk hanyalah rumus tetes per menit pada buku prosedur.
 */
export const REFERENSI_FAKTOR_TETES: ReadonlyArray<ReferensiItem> = [
	{
		teks: "Perry AG, Potter PA, Ostendorf WR, Laplante N. Clinical Nursing Skills and Techniques. Edisi ke-10. St. Louis: Elsevier; 2021. Bab Terapi Intravena.",
	},
];

/**
 * Bilirubin Neonatus.
 */
export const REFERENSI_BILIRUBIN: ReadonlyArray<ReferensiItem> = [
	{
		teks: "American Academy of Pediatrics. Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation. 2022.",
		tautan: "https://doi.org/10.1542/peds.2022-058859",
		labelTautan: "DOI 10.1542/peds.2022-058859",
	},
];
