/*
 * Katalog obat untuk Racik Puyer — DISALIN VERBATIM dari literal `daftarObat`
 * di dalam public/puyer-tool.html (island v17).
 *
 * WHY disalin, bukan diimpor dari katalog lain:
 * Mesin puyer memakai katalog ini untuk preset dosis/sediaan, rentang dosis
 * otomatis, dan klasifikasi frekuensi. Memakai katalog lain (mis. katalog
 * contoh di entities/dosing) akan MENGUBAH ANGKA yang keluar di layar.
 * Isi berkas ini dibangkitkan secara mekanis — tidak ada nilai yang diketik
 * ulang atau disunting tangan.
 *
 * Sumber: public/puyer-tool.html
 * Diverifikasi identik terhadap apps/web/scripts/obat.json pada seluruh bidang.
 */
import type { Obat } from "@tinyverse/clinical-core";

/** Bentuk katalog v17: Obat clinical-core + metadata khusus layar puyer. */
export interface ObatPuyer extends Obat {
	id: string;
	bisaDipuyer?: boolean;
	puyerSediaanMg?: number;
	puyer?: {
		mode: "mgkg" | "mgkali";
		dosis: number;
		sediaan: number;
		alias?: string[];
		catatan?: string;
	};
}

export const KATALOG_OBAT_PUYER: ReadonlyArray<ObatPuyer> = [
	{
		"id": "albendazole",
		"nama": "Albendazole (Flat)",
		"jenis": "Anthelmintik",
		"icon": "🪱",
		"doseType": "flat",
		"doseBasis": "perDay",
		"dosisFlatMin": 400,
		"dosisFlatMax": 400,
		"satuanDosis": "mg",
		"unitLabel": "mg/hari",
		"maxDosesPerDay": 1,
		"dosesPerDay": 1,
		"dosisMaksimalHarianMg": 800,
		"frekuensi": "1× sehari selama 3–5 hari (CLM); untuk STH umumnya dosis tunggal",
		"indikasi": "Cutaneous larva migrans (CLM)/creeping eruption; juga obat cacing spektrum luas untuk STH (askariasis, cacing tambang, trichuriasis, enterobiasis).",
		"sediaanCustomText": "Tablet kunyah/tablet 400 mg; beberapa produk tersedia suspensi 200 mg/5 mL. Dapat dikunyah/dihancurkan sesuai sediaan.",
		"catatan": "CLM (Perdoski 2024): albendazol 400 mg per oral, dapat sebagai dosis tunggal atau 400 mg/hari selama 3–5 hari. Untuk anak tersedia alternatif berbasis berat 10–15 mg/kg/hari (maks 800 mg/hari) pada kartu 'Albendazole (per kg)'. Anak 12–23 bulan pada program STH memakai 200 mg.",
		"kelasAlergi": [
			"benzimidazol"
		],
		"interaksiTags": [
			"hepatotoksik-dosis-tinggi"
		],
		"kontraindikasi": [
			"Kehamilan (trimester 1)",
			"Hipersensitivitas benzimidazol"
		],
		"peringatan": [
			"Hati-hati usia <2 tahun (data terbatas)",
			"Pantau fungsi hati pada terapi lama/dosis tinggi"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 400,
		"puyer": {
			"mode": "mgkali",
			"dosis": 400,
			"sediaan": 400,
			"alias": [
				"albendazol"
			],
			"catatan": "Dosis tetap 400 mg; tablet 400 mg. Verifikasi."
		}
	},
	{
		"id": "ambroxol",
		"sediaanMl": 5,
		"nama": "Ambroxol",
		"dosesPerDay": 3,
		"frekuensi": "dibagi 3 kali sehari",
		"dosisMaxPerKg": 2,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosisMaksimalHarianMg": 45,
		"sediaanMg": 15,
		"dosisMinPerKg": 1,
		"doseBasis": "perDay",
		"icon": "💧",
		"jenis": "Mukolitik & Ekspektoran",
		"catatan": "Dosis pada kalkulator dihitung sebagai total harian lalu dibagi 3 kali pemberian. Maksimum otomatis konservatif: 45 mg/hari; verifikasi sesuai usia dan produk.",
		"kelasAlergi": [
			"ambroxol"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Tidak dianjurkan pada anak <2 tahun (restriksi mukolitik)",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hati-hati ulkus peptikum",
			"Laporan reaksi kulit berat (jarang)"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 30,
		"puyer": {
			"mode": "mgkali",
			"dosis": 7.5,
			"sediaan": 30,
			"alias": [
				"ambroksol"
			],
			"catatan": "Contoh manual mg/kali."
		}
	},
	{
		"id": "amoxicillin",
		"frekuensi": "dibagi 3 kali sehari",
		"dosesPerDay": 3,
		"nama": "Amoxicillin",
		"sediaanMl": 5,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosisMaxPerKg": 50,
		"sediaanMg": 250,
		"dosisMaksimalHarianMg": 2000,
		"catatan": "Dosis dihitung sebagai total harian berdasarkan komponen amoxicillin, lalu dibagi 3 kali pemberian. Dosis dapat berbeda sesuai indikasi/berat infeksi.",
		"jenis": "Antibiotik",
		"doseBasis": "perDay",
		"icon": "🦠",
		"dosisMinPerKg": 25,
		"kelasAlergi": [
			"penisilin",
			"beta-laktam"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Alergi penisilin/beta-laktam"
		],
		"peringatan": [
			"Ruam pada infeksi mononukleosis (EBV)",
			"Sesuaikan pada gangguan ginjal berat"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 500,
		"puyer": {
			"mode": "mgkg",
			"dosis": 15,
			"sediaan": 500,
			"alias": [
				"amoksisilin",
				"amox",
				"amoxicilin"
			],
			"catatan": "Contoh awal; sesuaikan indikasi dan regimen."
		}
	},
	{
		"id": "asetilsistein",
		"indikasi": "Mukolitik untuk membantu mengencerkan dahak pada batuk berdahak.",
		"sediaanCustomText": "Granul/sachet 100 mg pediatric dan granul/kapsul/tablet 200 mg; larutkan/berikan sesuai petunjuk produk.",
		"nama": "Asetilsistein",
		"frekuensi": "2–4 kali sehari sesuai usia dan produk",
		"bands": [
			{
				"frekuensi": "100 mg, 2–4 kali sehari",
				"labelUsia": "2–5 tahun",
				"tipe": "flat",
				"dosisFlatMax": 100,
				"usiaMinBulan": 24,
				"catatan": "Gunakan sediaan pediatric 100 mg; sesuaikan frekuensi dengan usia, berat gejala, dan instruksi dokter.",
				"dosisFlatMin": 100,
				"maxDosesPerDay": 4,
				"doseBasis": "perDose",
				"usiaMaxBulan": 71
			},
			{
				"tipe": "flat",
				"labelUsia": "≥6 tahun – remaja",
				"frekuensi": "200 mg, 2–3 kali sehari",
				"dosisFlatMax": 200,
				"catatan": "Batas lazim mukolitik oral total sekitar 600 mg/hari pada anak besar/dewasa; sesuaikan dengan produk.",
				"usiaMinBulan": 72,
				"doseBasis": "perDose",
				"maxDosesPerDay": 3,
				"usiaMaxBulan": 216,
				"dosisFlatMin": 200
			}
		],
		"icon": "🫧",
		"doseBasis": "perDose",
		"jenis": "Mukolitik & Ekspektoran",
		"unitLabel": "mg/kali",
		"doseType": "ageBands",
		"catatan": "Dosis dihitung untuk indikasi mukolitik. Hindari penggunaan rutin pada anak <2 tahun kecuali atas instruksi dokter.",
		"kelasAlergi": [
			"asetilsistein"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hati-hati asma (risiko bronkospasme)",
			"Hati-hati ulkus peptikum"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 200,
		"puyer": {
			"mode": "mgkali",
			"dosis": 100,
			"sediaan": 200,
			"alias": [
				"acetylcysteine",
				"asetil"
			],
			"catatan": "±100 mg/kali (anak); granul 100/200 mg. Verifikasi."
		}
	},
	{
		"id": "asiklovir",
		"sediaanMl": 10,
		"nama": "Asiklovir",
		"frekuensi": "5 kali sehari tiap ±4 jam saat terjaga, selama 5–10 hari",
		"dosisMaxPerKg": 15,
		"doseType": "perKg",
		"unitLabel": "mg/kg/kali",
		"dosisMaksimalTunggalMg": 800,
		"dosisMaksimalHarianMg": 4000,
		"sediaanMg": 200,
		"dosisMinPerKg": 10,
		"maxDosesPerDay": 5,
		"doseBasis": "perDose",
		"icon": "🧬",
		"jenis": "Antivirus",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 800 mg/kali; indikasi tertentu dapat memerlukan regimen berbeda.",
		"kelasAlergi": [
			"asiklovir"
		],
		"interaksiTags": [
			"nefrotoksik"
		],
		"kontraindikasi": [
			"Hipersensitivitas asiklovir/valasiklovir"
		],
		"peringatan": [
			"Jaga hidrasi cukup (risiko kristaluria)",
			"Sesuaikan dosis pada gangguan ginjal"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 400,
		"puyer": {
			"mode": "mgkg",
			"dosis": 10,
			"sediaan": 200,
			"alias": [
				"acyclovir",
				"asiklovir"
			],
			"catatan": "±10 mg/kg/kali; tablet 200 mg. Verifikasi."
		}
	},
	{
		"id": "azithromycin",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari",
		"nama": "Azithromycin",
		"sediaanMl": 5,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosisMaxPerKg": 10,
		"sediaanMg": 200,
		"dosisMaksimalHarianMg": 500,
		"catatan": "Dosis dihitung sebagai total harian. Regimen 10 mg/kg hari pertama lalu 5 mg/kg/hari hari berikutnya dapat dipakai sesuai indikasi.",
		"jenis": "Antibiotik",
		"doseBasis": "perDay",
		"icon": "🫁",
		"dosisMinPerKg": 5,
		"kelasAlergi": [
			"makrolida"
		],
		"interaksiTags": [
			"qt",
			"makrolida"
		],
		"kontraindikasi": [
			"Alergi makrolida",
			"Riwayat penyakit hati/kolestasis akibat makrolida"
		],
		"peringatan": [
			"Hati-hati sindrom QT panjang / obat pemanjang QT"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 250,
		"puyer": {
			"mode": "mgkg",
			"dosis": 10,
			"sediaan": 250,
			"alias": [
				"azitromisin",
				"azitro"
			],
			"catatan": "10 mg/kg/hari 1×; tablet 250/500 mg. Verifikasi."
		}
	},
	{
		"id": "cefixime",
		"dosisMaxPerKg": 8,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari atau dibagi 2 kali sehari",
		"sediaanMl": 5,
		"nama": "Cefixime",
		"jenis": "Antibiotik",
		"catatan": "Dosis dihitung sebagai total harian; bila dipilih 2 kali sehari, bagi total harian menjadi 2 pemberian.",
		"dosisMinPerKg": 8,
		"doseBasis": "perDay",
		"icon": "💊",
		"dosisMaksimalHarianMg": 400,
		"sediaanMg": 100,
		"kelasAlergi": [
			"sefalosporin",
			"beta-laktam"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Alergi sefalosporin",
			"Hati-hati alergi penisilin berat (reaksi silang)"
		],
		"peringatan": [
			"Sesuaikan pada gangguan ginjal berat"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 100,
		"puyer": {
			"mode": "mgkg",
			"dosis": 4,
			"sediaan": 100,
			"alias": [
				"sefiksim",
				"cefixim"
			],
			"catatan": "Contoh awal; verifikasi dosis sesuai indikasi."
		}
	},
	{
		"id": "cetirizine",
		"dosisMaxPerKg": 0.25,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"sediaanMl": 5,
		"nama": "Cetirizine",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari",
		"dosisMinPerKg": 0.2,
		"doseBasis": "perDay",
		"icon": "🌼",
		"jenis": "Antihistamin",
		"catatan": "Dosis dihitung sebagai dosis harian. Maksimum otomatis 10 mg/hari; pada praktik sering memakai dosis berbasis usia.",
		"dosisMaksimalHarianMg": 10,
		"sediaanMg": 5,
		"kelasAlergi": [
			"antihistamin"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas cetirizine/hidroksizin"
		],
		"peringatan": [
			"Dapat menyebabkan kantuk",
			"Sesuaikan pada gangguan ginjal"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 10,
		"puyer": {
			"mode": "mgkali",
			"dosis": 5,
			"sediaan": 10,
			"alias": [
				"setirizin",
				"cetirizin"
			],
			"catatan": "Sesuaikan usia/BB."
		}
	},
	{
		"id": "chlorpheniramine-maleate-ctm",
		"sediaanMl": 5,
		"nama": "Chlorpheniramine Maleate (CTM)",
		"frekuensi": "setiap 4–6 jam bila perlu",
		"bands": [
			{
				"maxDosesPerDay": 6,
				"doseBasis": "perDose",
				"usiaMaxBulan": 24,
				"dosisMinPerKg": 0.1,
				"catatan": "0,1 mg/kgBB per kali dosis. Dosis maksimal untuk usia <2 tahun: 2 mg per kali.",
				"dosisMaxPerKg": 0.1,
				"usiaMinBulan": 0,
				"dosisMaksimalTunggalMg": 2,
				"tipe": "perKg",
				"labelUsia": "< 2 tahun",
				"frekuensi": "setiap 4–6 jam",
				"dosisMaksimalHarianMg": 12
			},
			{
				"dosisFlatMax": 1,
				"tipe": "flat",
				"labelUsia": "2–5 tahun",
				"frekuensi": "setiap 4–6 jam",
				"dosisMaksimalHarianMg": 6,
				"maxDosesPerDay": 6,
				"doseBasis": "perDose",
				"usiaMaxBulan": 60,
				"dosisFlatMin": 1,
				"catatan": "Dosis maksimal harian: 6 mg/hari.",
				"usiaMinBulan": 24
			},
			{
				"usiaMaxBulan": 144,
				"maxDosesPerDay": 6,
				"doseBasis": "perDose",
				"dosisFlatMin": 2,
				"catatan": "Dosis maksimal harian: 12 mg/hari.",
				"usiaMinBulan": 60,
				"dosisFlatMax": 2,
				"labelUsia": "6–12 tahun",
				"tipe": "flat",
				"frekuensi": "setiap 4–6 jam",
				"dosisMaksimalHarianMg": 12
			},
			{
				"catatan": "Dosis maksimal harian: 24 mg/hari.",
				"usiaMinBulan": 144,
				"doseBasis": "perDose",
				"maxDosesPerDay": 6,
				"usiaMaxBulan": 216,
				"dosisFlatMin": 4,
				"labelUsia": "≥ 12 tahun",
				"tipe": "flat",
				"frekuensi": "setiap 4–6 jam",
				"dosisMaksimalHarianMg": 24,
				"dosisFlatMax": 4
			}
		],
		"sediaanMg": 2,
		"doseBasis": "perDose",
		"icon": "🤧💤",
		"jenis": "Antihistamin",
		"catatan": "Antihistamin generasi pertama (sedatif). Dosis dan plafon maksimal berbeda di setiap kelompok usia — kalkulator otomatis menyesuaikan berdasarkan usia yang diinput.",
		"doseType": "ageBands",
		"unitLabel": "mg/kg atau mg (sesuai usia)",
		"kelasAlergi": [
			"antihistamin"
		],
		"interaksiTags": [
			"ssp-depresan",
			"antikolinergik"
		],
		"kontraindikasi": [
			"Neonatus & bayi <2 tahun (risiko sedasi/apnea)",
			"Glaukoma sudut sempit",
			"Retensi urin/obstruksi"
		],
		"peringatan": [
			"Efek antikolinergik & sedasi",
			"Hindari kombinasi depresan SSP lain"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 4,
		"puyer": {
			"mode": "mgkali",
			"dosis": 1,
			"sediaan": 4,
			"alias": [
				"ctm",
				"chlorpheniramine",
				"klorfeniramin",
				"chlorpheniramin"
			],
			"catatan": "Contoh manual mg/kali."
		}
	},
	{
		"id": "co-amoxiclav",
		"dosisMaxPerKg": 50,
		"unitLabel": "mg/kg/hari",
		"doseType": "perKg",
		"dosesPerDay": 2,
		"frekuensi": "dibagi 2 kali sehari",
		"sediaanMl": 5,
		"nama": "Co-Amoxiclav",
		"jenis": "Antibiotik",
		"catatan": "Dosis dihitung sebagai total harian berdasarkan komponen amoxicillin, lalu dibagi 2 kali pemberian. Perhatikan rasio clavulanate pada produk.",
		"dosisMinPerKg": 25,
		"icon": "🛡️",
		"doseBasis": "perDay",
		"dosisMaksimalHarianMg": 2000,
		"sediaanMg": 156,
		"kelasAlergi": [
			"penisilin",
			"beta-laktam"
		],
		"interaksiTags": [
			"hepatotoksik-dosis-tinggi"
		],
		"kontraindikasi": [
			"Alergi penisilin/beta-laktam",
			"Riwayat jaundice/disfungsi hati akibat co-amoxiclav"
		],
		"peringatan": [
			"Batasi komponen klavulanat (~10 mg/kg/hari)",
			"Diare terkait antibiotik"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkg",
			"dosis": 12.5,
			"sediaan": 156,
			"alias": [
				"coamoxiclav",
				"augmentin"
			],
			"catatan": "Berdasarkan komponen amoksisilin; verifikasi rasio sediaan."
		}
	},
	{
		"id": "cotrimoxazole",
		"sediaanMl": 5,
		"nama": "Cotrimoxazole",
		"frekuensi": "2 kali sehari",
		"dosisMaxPerKg": 6,
		"unitLabel": "mg TMP/kg/kali",
		"doseType": "perKg",
		"dosisMaksimalTunggalMg": 160,
		"dosisMaksimalHarianMg": 320,
		"sediaanMg": 200,
		"dosisMinPerKg": 4,
		"icon": "🦠⚔️",
		"maxDosesPerDay": 2,
		"doseBasis": "perDose",
		"jenis": "Antibiotik",
		"catatan": "Dosis dihitung berdasarkan komponen trimethoprim (TMP) per kali pemberian. Maksimum otomatis 160 mg TMP/kali.",
		"kelasAlergi": [
			"sulfonamida",
			"sulfa"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Alergi sulfonamida",
			"Bayi <2 bulan (risiko kernikterus)",
			"Defisiensi G6PD (risiko hemolisis)",
			"Gangguan hati/ginjal berat"
		],
		"peringatan": [
			"Risiko reaksi kulit berat (SJS/TEN)",
			"Jaga hidrasi"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 480,
		"puyer": {
			"mode": "mgkg",
			"dosis": 5,
			"sediaan": 480,
			"alias": [
				"kotrimoksazol",
				"trimetoprim",
				"cotrimoxazol"
			],
			"catatan": "Dosis = trimetoprim 4–6 mg/kg/kali; tablet 480 mg. Verifikasi."
		}
	},
	{
		"id": "dexamethasone",
		"nama": "Dexamethasone",
		"sediaanMl": 0.5,
		"frekuensi": "dosis tunggal; dapat diulang sesuai instruksi dokter",
		"doseType": "perKg",
		"unitLabel": "mg/kg/kali",
		"dosisMaxPerKg": 0.6,
		"dosisMaksimalTunggalMg": 16,
		"sediaanMg": 5,
		"maxDosesPerDay": 1,
		"doseBasis": "singleDose",
		"icon": "🔥💊",
		"dosisMinPerKg": 0.15,
		"catatan": "Dosis dihitung per kali pemberian/dosis tunggal. Bukan regimen rutin 3x sehari. Maksimum otomatis 16 mg/kali.",
		"jenis": "Kortikosteroid",
		"kelasAlergi": [
			"kortikosteroid"
		],
		"interaksiTags": [
			"kortikosteroid",
			"gastro-erosif",
			"imunosupresan"
		],
		"kontraindikasi": [
			"Infeksi jamur sistemik",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hindari vaksin hidup",
			"Kombinasi NSAID meningkatkan risiko GI",
			"Jangan hentikan mendadak pada pemakaian lama"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 0.5,
		"puyer": {
			"mode": "mgkg",
			"dosis": 0.15,
			"sediaan": 0.5,
			"alias": [
				"deksametason",
				"dexa"
			],
			"catatan": "Contoh awal; verifikasi regimen."
		}
	},
	{
		"id": "domperidone",
		"jenis": "Antiemetik",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 10 mg/kali dan 30 mg/hari. Perhatikan kontraindikasi dan risiko gangguan irama jantung.",
		"dosisMinPerKg": 0.2,
		"icon": "🚫🤮",
		"doseBasis": "perDose",
		"maxDosesPerDay": 3,
		"dosisMaksimalHarianMg": 30,
		"sediaanMg": 5,
		"dosisMaksimalTunggalMg": 10,
		"dosisMaxPerKg": 0.4,
		"unitLabel": "mg/kg/kali",
		"doseType": "perKg",
		"frekuensi": "3 kali sehari sebelum makan",
		"sediaanMl": 5,
		"nama": "Domperidone",
		"kelasAlergi": [
			"domperidone"
		],
		"interaksiTags": [
			"qt"
		],
		"kontraindikasi": [
			"Gangguan konduksi jantung / QT panjang",
			"Gangguan hati sedang-berat",
			"Umumnya dihindari pada BB <35 kg / anak kecil",
			"Obstruksi/perdarahan GI"
		],
		"peringatan": [
			"Gunakan dosis efektif terendah, durasi sesingkat mungkin"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 10,
		"puyer": {
			"mode": "mgkg",
			"dosis": 0.25,
			"sediaan": 10,
			"alias": [
				"domperidon"
			],
			"catatan": "Perhatikan kehati-hatian penggunaan."
		}
	},
	{
		"id": "eritromisin",
		"dosisMinPerKg": 40,
		"icon": "🛡️",
		"doseBasis": "perDay",
		"jenis": "Antibiotik",
		"catatan": "Dosis dihitung sebagai total harian, lalu dibagi sesuai frekuensi.",
		"dosisMaksimalHarianMg": 2000,
		"sediaanMg": 200,
		"dosisMaxPerKg": 50,
		"unitLabel": "mg/kg/hari",
		"doseType": "perKg",
		"sediaanMl": 5,
		"nama": "Eritromisin",
		"dosesPerDay": 4,
		"frekuensi": "dibagi dalam 3–4 dosis per hari",
		"kelasAlergi": [
			"makrolida"
		],
		"interaksiTags": [
			"qt",
			"cyp3a4-inhibitor",
			"makrolida"
		],
		"kontraindikasi": [
			"Alergi makrolida",
			"Penyakit hati",
			"Bersamaan obat substrat CYP3A4 berisiko toksik"
		],
		"peringatan": [
			"Risiko stenosis pilorus hipertrofik (IHPS) pada bayi",
			"Penghambat CYP3A4 kuat"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 500,
		"puyer": {
			"mode": "mgkg",
			"dosis": 12.5,
			"sediaan": 250,
			"alias": [
				"erythromycin",
				"eritromicin"
			],
			"catatan": "40–50 mg/kg/hari terbagi; tablet 250/500 mg. Verifikasi."
		}
	},
	{
		"id": "ibuprofen",
		"dosisMaxPerKg": 10,
		"unitLabel": "mg/kg/kali",
		"doseType": "perKg",
		"frekuensi": "tiap 6–8 jam bila perlu; maksimal 4 kali sehari",
		"sediaanMl": 5,
		"nama": "Ibuprofen",
		"jenis": "Antipiretik & Analgesik",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 400 mg/kali dan tidak melebihi 40 mg/kgBB/hari.",
		"dosisMinPerKg": 5,
		"icon": "🧴",
		"maxDosesPerDay": 4,
		"doseBasis": "perDose",
		"dosisMaksimalHarianMg": 1200,
		"sediaanMg": 100,
		"dosisMaksimalTunggalMg": 400,
		"dosisMaksimalHarianPerKg": 40,
		"kelasAlergi": [
			"nsaid",
			"ibuprofen"
		],
		"interaksiTags": [
			"nsaid",
			"nefrotoksik",
			"gastro-erosif"
		],
		"kontraindikasi": [
			"Usia <6 bulan",
			"Dehidrasi/hipovolemia atau gangguan ginjal",
			"Ulkus/perdarahan saluran cerna aktif",
			"Asma yang dipicu NSAID",
			"Kecurigaan dengue/perdarahan"
		],
		"peringatan": [
			"Berikan bersama makanan",
			"Hindari kombinasi kortikosteroid/NSAID lain"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 200,
		"puyer": {
			"mode": "mgkg",
			"dosis": 5,
			"sediaan": 200,
			"alias": [
				"ibu"
			],
			"catatan": "Contoh umum: 5 mg/kg/kali; perhatikan kontraindikasi."
		}
	},
	{
		"id": "ketoconazole",
		"frekuensi": "1 kali sehari",
		"dosesPerDay": 1,
		"nama": "Ketoconazole",
		"sediaanMl": 5,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosisMaxPerKg": 6,
		"sediaanMg": 200,
		"dosisMaksimalHarianMg": 400,
		"catatan": "Dosis dihitung sebagai total harian. Perhatikan risiko hepatotoksisitas; penggunaan sistemik perlu indikasi dan pemantauan dokter.",
		"jenis": "Antijamur",
		"doseBasis": "perDay",
		"icon": "🍄🛑",
		"dosisMinPerKg": 3,
		"kelasAlergi": [
			"azol"
		],
		"interaksiTags": [
			"qt",
			"cyp3a4-inhibitor",
			"hepatotoksik"
		],
		"kontraindikasi": [
			"Penyakit hati akut/kronik",
			"Ketokonazol ORAL sistemik tidak dianjurkan (hepatotoksisitas serius) - pertimbangkan alternatif/topikal",
			"Bersamaan obat pemanjang QT / substrat CYP3A4 sensitif"
		],
		"peringatan": [
			"Pantau fungsi hati bila tetap digunakan"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 200,
		"puyer": {
			"mode": "mgkg",
			"dosis": 5,
			"sediaan": 200,
			"alias": [
				"ketokonazol"
			],
			"catatan": "3–6 mg/kg/hari; tablet 200 mg. Verifikasi."
		}
	},
	{
		"id": "loratadine",
		"dosisMaxPerKg": 0.2,
		"unitLabel": "mg/kg/hari",
		"doseType": "perKg",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari",
		"sediaanMl": 5,
		"nama": "Loratadine",
		"jenis": "Antihistamin",
		"catatan": "Dosis dihitung sebagai dosis harian. Maksimum otomatis 10 mg/hari; praktik umum sering memakai dosis berbasis usia/berat.",
		"dosisMinPerKg": 0.1,
		"icon": "🤧",
		"doseBasis": "perDay",
		"dosisMaksimalHarianMg": 10,
		"sediaanMg": 5,
		"kelasAlergi": [
			"antihistamin"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Sesuaikan pada gangguan hati"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 10,
		"puyer": {
			"mode": "mgkali",
			"dosis": 5,
			"sediaan": 10,
			"alias": [
				"loratadin"
			],
			"catatan": "Sesuaikan usia/BB."
		}
	},
	{
		"id": "mebendazole",
		"icon": "🪱💊",
		"doseBasis": "perDose",
		"jenis": "Anthelmintik",
		"unitLabel": "mg/kali",
		"doseType": "ageBands",
		"catatan": "Regimen umum: cacing kremi 100 mg dosis tunggal dan ulang setelah ±2 minggu bila perlu; cacing gelang/tambang/cambuk dapat 100 mg 2 kali sehari selama 3 hari. WHO juga merekomendasikan mebendazole 500 mg dosis tunggal untuk deworming preventif di daerah endemis. Kalkulator ini memakai regimen 100 mg/kali agar cocok untuk cacing kremi dan regimen 3 hari; sesuaikan regimen dengan diagnosis.",
		"indikasi": "Obat cacing untuk enterobiasis/cacing kremi, askariasis/cacing gelang, cacing tambang, dan trichuriasis/cacing cambuk. Cocok dipakai bila diagnosis/dugaan klinis sesuai dan tersedia di Indonesia.",
		"sediaanCustomText": "Tablet kunyah 100 mg atau 500 mg tergantung produk. Untuk regimen 500 mg dosis tunggal, gunakan sediaan 500 mg bila tersedia dan sesuai instruksi dokter/program.",
		"nama": "Mebendazole",
		"frekuensi": "tergantung jenis cacing",
		"bands": [
			{
				"dosisFlatMax": 100,
				"frekuensi": "cacing kremi: dosis tunggal; cacing gelang/tambang/cambuk: 2 kali sehari selama 3 hari",
				"labelUsia": "≥2 tahun – remaja",
				"tipe": "flat",
				"dosisFlatMin": 100,
				"usiaMaxBulan": 216,
				"maxDosesPerDay": 2,
				"doseBasis": "perDose",
				"usiaMinBulan": 24,
				"catatan": "Untuk cacing kremi, terapi anggota serumah dan pengulangan dosis sering diperlukan. Untuk STH selain kremi, gunakan 100 mg 2 kali sehari selama 3 hari atau regimen program sesuai kebijakan."
			}
		],
		"kelasAlergi": [
			"benzimidazol"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Kehamilan (trimester 1)",
			"Hipersensitivitas benzimidazol"
		],
		"peringatan": [
			"Hati-hati usia <2 tahun (data terbatas)"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 500,
		"puyer": {
			"mode": "mgkali",
			"dosis": 100,
			"sediaan": 100,
			"alias": [
				"mebendazol"
			],
			"catatan": "100 mg 2×/hari 3 hari, atau 500 mg dosis tunggal; tablet kunyah 100/500 mg."
		}
	},
	{
		"id": "metronidazole",
		"jenis": "Antibiotik",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 500 mg/kali; regimen dapat berbeda sesuai indikasi.",
		"dosisMinPerKg": 7.5,
		"maxDosesPerDay": 3,
		"doseBasis": "perDose",
		"icon": "🦠🛑",
		"dosisMaksimalHarianMg": 1500,
		"sediaanMg": 200,
		"dosisMaksimalTunggalMg": 500,
		"dosisMaxPerKg": 10,
		"doseType": "perKg",
		"unitLabel": "mg/kg/kali",
		"frekuensi": "3 kali sehari",
		"sediaanMl": 5,
		"nama": "Metronidazole",
		"kelasAlergi": [
			"nitroimidazol",
			"metronidazole"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas nitroimidazol",
			"Trimester 1 kehamilan (hati-hati)"
		],
		"peringatan": [
			"Hindari alkohol (reaksi disulfiram)",
			"Efek SSP/neuropati pada pemakaian lama"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 250,
		"puyer": {
			"mode": "mgkg",
			"dosis": 7.5,
			"sediaan": 200,
			"alias": [
				"metronidazol"
			],
			"catatan": "7,5 mg/kg/kali; tablet 200/500 mg. Verifikasi."
		}
	},
	{
		"id": "nystatin",
		"sediaanIU": 100000,
		"unitLabel": "IU/kali",
		"doseType": "flat",
		"satuanDosis": "IU",
		"nama": "Nystatin",
		"sediaanMl": 1,
		"frekuensi": "4 kali sehari",
		"icon": "🍄",
		"doseBasis": "perDose",
		"dosisFlatMin": 100000,
		"catatan": "Satuan dalam IU, bukan mg. Dosis dihitung per kali pemberian. Umumnya suspensi 100.000 IU/mL; oles/pertahankan di mulut sebelum ditelan bila untuk kandidiasis oral.",
		"jenis": "Antijamur",
		"dosisFlatMax": 100000,
		"dosisMaksimalTunggalMg": 100000,
		"kelasAlergi": [
			"nystatin"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Kerja lokal, absorpsi minimal"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkali",
			"dosis": 100000,
			"sediaan": 500000,
			"alias": [
				"nistatin"
			],
			"catatan": "Satuan IU; umumnya drop/suspensi oral — TIDAK lazim dipuyer. Verifikasi."
		}
	},
	{
		"id": "ondansetron",
		"jenis": "Antiemetik",
		"catatan": "Dosis dihitung per kali pemberian. Gastroenteritis akut biasanya cukup dosis tunggal. Maksimum otomatis 8 mg/kali.",
		"dosisMinPerKg": 0.1,
		"icon": "🤢",
		"maxDosesPerDay": 3,
		"doseBasis": "perDose",
		"dosisMaksimalHarianMg": 24,
		"sediaanMg": 4,
		"dosisMaksimalTunggalMg": 8,
		"dosisMaxPerKg": 0.15,
		"unitLabel": "mg/kg/kali",
		"doseType": "perKg",
		"frekuensi": "bila perlu tiap 8 jam",
		"sediaanMl": 5,
		"nama": "Ondansetron",
		"kelasAlergi": [
			"ondansetron"
		],
		"interaksiTags": [
			"qt",
			"serotonergik"
		],
		"kontraindikasi": [
			"Sindrom QT panjang bawaan",
			"Bersamaan apomorfin"
		],
		"peringatan": [
			"Hati-hati obat pemanjang QT & gangguan elektrolit"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 4,
		"puyer": {
			"mode": "mgkg",
			"dosis": 0.15,
			"sediaan": 4,
			"alias": [
				"ondansetron"
			],
			"catatan": "Contoh awal; verifikasi indikasi."
		}
	},
	{
		"id": "oral-rehydration-salt-ors",
		"volumeMinPerKg": 10,
		"nama": "Oral Rehydration Salt (ORS)",
		"volumeMaxPerKg": 20,
		"frekuensi": "setelah setiap episode diare",
		"doseBasis": "perEpisode",
		"icon": "💦",
		"jenis": "Rehidrasi / Cairan & Elektrolit",
		"doseType": "perKgVolume",
		"catatan": "Volume dihitung per episode diare/muntah, bukan dosis harian. Sesuaikan dengan derajat dehidrasi dan toleransi minum.",
		"unitLabel": "mL/kg/episode",
		"kelasAlergi": [],
		"interaksiTags": [],
		"kontraindikasi": [
			"Ileus/obstruksi usus",
			"Muntah hebat tak teratasi / penurunan kesadaran (risiko aspirasi)"
		],
		"peringatan": [
			"Gunakan formula osmolaritas rendah sesuai WHO"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkali",
			"dosis": 0,
			"sediaan": 0,
			"alias": [
				"oralit",
				"ors",
				"rehidrasi"
			],
			"catatan": "Cairan rehidrasi — TIDAK dipuyer."
		}
	},
	{
		"id": "oseltamivir",
		"dosisMaxPerKg": 3,
		"unitLabel": "mg/kg/kali",
		"doseType": "perKg",
		"frekuensi": "2 kali sehari",
		"sediaanMl": 5,
		"nama": "Oseltamivir",
		"jenis": "Antivirus",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum otomatis 75 mg/kali. Regimen dapat memakai weight-band sesuai pedoman influenza.",
		"dosisMinPerKg": 2,
		"icon": "🦠❄️",
		"maxDosesPerDay": 2,
		"doseBasis": "perDose",
		"dosisMaksimalHarianMg": 150,
		"sediaanMg": 30,
		"dosisMaksimalTunggalMg": 75,
		"kelasAlergi": [
			"oseltamivir"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Sesuaikan dosis pada gangguan ginjal",
			"Pantau gejala neuropsikiatri"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 75,
		"puyer": {
			"mode": "mgkg",
			"dosis": 3,
			"sediaan": 30,
			"alias": [
				"tamiflu"
			],
			"catatan": "3 mg/kg/kali 2×/hari; kapsul 30/45/75 mg. Verifikasi."
		}
	},
	{
		"id": "paracetamol",
		"dosisMinPerKg": 10,
		"doseBasis": "perDose",
		"maxDosesPerDay": 5,
		"icon": "🌡️",
		"jenis": "Antipiretik & Analgesik",
		"catatan": "Dosis dihitung per kali pemberian. Maksimum 75 mg/kgBB/hari dan jangan lebih dari 5 kali pemberian per 24 jam. Pilih konsentrasi sirup agar hasil mL tepat.",
		"dosisMaksimalTunggalMg": 1000,
		"dosisMaksimalHarianPerKg": 75,
		"dosisMaksimalHarianMg": 4000,
		"sediaanMg": 120,
		"sediaanOptions": [
			{
				"sediaanMg": 120,
				"label": "Sirup 120 mg/5 ml",
				"sediaanMl": 5
			},
			{
				"sediaanMg": 160,
				"sediaanMl": 5,
				"label": "Sirup 160 mg/5 ml (Forte)"
			}
		],
		"dosisMaxPerKg": 15,
		"doseType": "perKg",
		"unitLabel": "mg/kg/kali",
		"sediaanMl": 5,
		"nama": "Paracetamol",
		"frekuensi": "tiap 4–6 jam bila perlu; maksimal 5 kali sehari",
		"kelasAlergi": [
			"paracetamol"
		],
		"interaksiTags": [
			"hepatotoksik-dosis-tinggi"
		],
		"kontraindikasi": [
			"Penyakit hati berat",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Perhatikan total dosis harian dari semua sumber",
			"Maks 75 mg/kg/hari & 4000 mg/hari"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 500,
		"puyer": {
			"mode": "mgkg",
			"dosis": 10,
			"sediaan": 500,
			"alias": [
				"parasetamol",
				"pct",
				"pamol"
			],
			"catatan": "Contoh umum: 10 mg/kg/kali; sesuaikan pedoman."
		}
	},
	{
		"id": "prednisolone",
		"jenis": "Kortikosteroid",
		"catatan": "Dosis dihitung sebagai total harian. Maksimum otomatis 60 mg/hari untuk banyak regimen eksaserbasi asma; indikasi lain dapat berbeda.",
		"dosisMinPerKg": 1,
		"doseBasis": "perDay",
		"icon": "🫁🔥",
		"dosisMaksimalHarianMg": 60,
		"sediaanMg": 15,
		"dosisMaxPerKg": 2,
		"doseType": "perKg",
		"unitLabel": "mg/kg/hari",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari atau dibagi 2 dosis sesuai instruksi dokter",
		"sediaanMl": 5,
		"nama": "Prednisolone",
		"kelasAlergi": [
			"kortikosteroid"
		],
		"interaksiTags": [
			"kortikosteroid",
			"gastro-erosif",
			"imunosupresan"
		],
		"kontraindikasi": [
			"Infeksi jamur sistemik",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hindari vaksin hidup",
			"Kombinasi NSAID meningkatkan risiko GI",
			"Tapering pada pemakaian lama"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 5,
		"puyer": {
			"mode": "mgkg",
			"dosis": 1,
			"sediaan": 5,
			"alias": [
				"prednisolon"
			],
			"catatan": "1–2 mg/kg/hari; tablet 5 mg. Verifikasi."
		}
	},
	{
		"id": "prednison",
		"dosisMinPerKg": 2,
		"icon": "🫘",
		"doseBasis": "perDay",
		"jenis": "Kortikosteroid",
		"dosisMaxPerKg": 2,
		"unitLabel": "mg/kg/hari",
		"doseType": "perKg",
		"catatan": "Dosis inisial sindrom nefrotik: 2 mg/kgBB/hari, selama 2 minggu, dilanjutkan tapering sesuai protokol yang berlaku di fasilitas. Tidak tersedia sediaan sirup standar — gunakan sediaan tablet (umumnya tablet 5 mg) sesuai ketersediaan apotek. Dosis dihitung sebagai total harian; maksimum otomatis 60 mg/hari kecuali ada instruksi spesialis.",
		"nama": "Prednison",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari (pagi hari) selama 2 minggu fase inisial",
		"dosisMaksimalHarianMg": 60,
		"kelasAlergi": [
			"kortikosteroid"
		],
		"interaksiTags": [
			"kortikosteroid",
			"gastro-erosif",
			"imunosupresan"
		],
		"kontraindikasi": [
			"Infeksi jamur sistemik",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hindari vaksin hidup",
			"Kombinasi NSAID meningkatkan risiko GI",
			"Tapering pada pemakaian lama"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 5,
		"puyer": {
			"mode": "mgkg",
			"dosis": 1,
			"sediaan": 5,
			"alias": [
				"prednisone"
			],
			"catatan": "Contoh awal; verifikasi regimen."
		}
	},
	{
		"id": "pyrantel-pamoate",
		"catatan": "CLM/cacingan (Perdoski 2024): pirantel pamoat 10 mg/kg sebagai dosis tunggal, maksimum 1 gram. Untuk cacing kremi sering diulang setelah ±2 minggu; higiene dan terapi kontak serumah penting.",
		"jenis": "Anthelmintik",
		"doseBasis": "singleDose",
		"maxDosesPerDay": 1,
		"icon": "🐛",
		"dosisMinPerKg": 10,
		"sediaanMg": 125,
		"dosisMaksimalTunggalMg": 1000,
		"doseType": "perKg",
		"unitLabel": "mg/kg dosis tunggal",
		"dosisMaxPerKg": 10,
		"sediaanOptions": [
			{
				"sediaanMl": 5,
				"label": "Suspensi 125 mg/5 mL",
				"sediaanMg": 125
			},
			{
				"sediaanMl": 5,
				"label": "Suspensi 250 mg/5 mL",
				"sediaanMg": 250
			}
		],
		"frekuensi": "dosis tunggal; dapat diulang sesuai jenis cacing/instruksi dokter",
		"nama": "Pyrantel Pamoate",
		"indikasi": "Enterobiasis/cacing kremi, askariasis/cacing gelang, dan cacing tambang; di Indonesia juga tercantum sebagai pilihan pada cutaneous larva migrans (CLM)/creeping eruption.",
		"sediaanMl": 5,
		"kelasAlergi": [
			"pirantel"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hati-hati gangguan hati",
			"Antagonis dengan piperazin"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 125,
		"puyer": {
			"mode": "mgkg",
			"dosis": 10,
			"sediaan": 125,
			"alias": [
				"pirantel",
				"pyrantel"
			],
			"catatan": "10 mg/kg dosis tunggal; umumnya suspensi. Verifikasi bila dipuyer."
		}
	},
	{
		"id": "salbutamol",
		"icon": "🫁💨",
		"maxDosesPerDay": 4,
		"doseBasis": "perDose",
		"dosisMinPerKg": 0.1,
		"catatan": "Dosis oral dihitung per kali pemberian. Maksimum otomatis 4 mg/kali. Untuk asma akut, rute inhalasi umumnya lebih disarankan; perhatikan tremor dan takikardia.",
		"jenis": "Bronkodilator",
		"dosisMaksimalTunggalMg": 4,
		"sediaanMg": 2,
		"dosisMaksimalHarianMg": 16,
		"unitLabel": "mg/kg/kali",
		"doseType": "perKg",
		"dosisMaxPerKg": 0.2,
		"nama": "Salbutamol",
		"sediaanMl": 5,
		"frekuensi": "3–4 kali sehari",
		"kelasAlergi": [
			"salbutamol"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Takiaritmia",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Dapat menyebabkan takikardia/tremor/hipokalemia",
			"Rute inhalasi lebih dipilih daripada oral"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 2,
		"puyer": {
			"mode": "mgkali",
			"dosis": 1,
			"sediaan": 2,
			"alias": [
				"salbu"
			],
			"catatan": "Contoh manual; verifikasi dosis dan indikasi."
		}
	},
	{
		"id": "vitamin-a",
		"frekuensi": "Dosis tunggal tiap 4–6 bulan sesuai program/sasaran",
		"catatanDibawahAmbang": "Usia 6–11 bulan: Kapsul Biru, dosis 100.000 IU.",
		"usiaMinValidBulan": 6,
		"satuanDosis": "IU",
		"nama": "Vitamin A",
		"catatanDiatasAmbang": "Usia 12–59 bulan: Kapsul Merah, dosis 200.000 IU.",
		"unitLabel": "IU (sesuai usia)",
		"doseType": "byAge",
		"ambangUsiaBulan": 12,
		"usiaMaxValidBulan": 59,
		"dosisMaksimalTunggalMg": 200000,
		"sediaanCustomText": "Kapsul Biru (100.000 IU) untuk usia 6–11 bulan; Kapsul Merah (200.000 IU) untuk usia 12–59 bulan. Tidak ada sediaan sirup/tetes — berikan 1 kapsul sesuai kelompok usia.",
		"dosisDibawahAmbangMg": 100000,
		"jenis": "Vitamin & Suplemen",
		"catatan": "Dosis tunggal berdasarkan usia: 6–11 bulan 100.000 IU; 12–59 bulan 200.000 IU. Tidak untuk pemberian harian.",
		"dosisDiatasAmbangMg": 200000,
		"icon": "🟦🟥",
		"doseBasis": "singleDose",
		"kelasAlergi": [],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipervitaminosis A",
			"Kehamilan (dosis tinggi teratogenik)"
		],
		"peringatan": [
			"Ikuti jadwal dosis WHO sesuai usia"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkali",
			"dosis": 0,
			"sediaan": 0,
			"alias": [
				"vit a",
				"vita"
			],
			"catatan": "Kapsul 100.000/200.000 IU dosis tunggal — TIDAK dipuyer."
		}
	},
	{
		"id": "vitamin-d",
		"dosisDiatasAmbangMg": 600,
		"icon": "☀️",
		"doseBasis": "perDay",
		"dosisDibawahAmbangMg": 400,
		"jenis": "Vitamin & Suplemen",
		"catatan": "Dosis suplementasi rutin harian: <1 tahun 400 IU/hari, ≥1 tahun 600 IU/hari. Kalkulator ini menampilkan dosis suplementasi rutin, bukan terapi defisiensi dosis tinggi.",
		"dosisMaksimalHarianMg": 600,
		"ambangUsiaBulan": 12,
		"unitLabel": "IU/hari",
		"doseType": "byAge",
		"satuanDosis": "IU",
		"nama": "Vitamin D",
		"dosesPerDay": 1,
		"frekuensi": "1 kali sehari",
		"kelasAlergi": [],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hiperkalsemia",
			"Hipervitaminosis D"
		],
		"peringatan": [
			"Dosis tercantum bersifat PROFILAKSIS; terapi rakhitis butuh dosis lebih tinggi"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkali",
			"dosis": 400,
			"sediaan": 400,
			"alias": [
				"vit d",
				"vitd"
			],
			"catatan": "Satuan IU; umumnya tetes/tablet, tidak lazim dipuyer. Verifikasi."
		}
	},
	{
		"id": "zat-besi",
		"bands": [
			{
				"tipe": "perKg",
				"labelUsia": "1 bulan – 2 tahun",
				"dosesPerDay": 1,
				"frekuensi": "1 kali sehari, diberikan rutin",
				"doseBasis": "perDay",
				"usiaMaxBulan": 24,
				"dosisMinPerKg": 2,
				"catatan": "2 mg/kgBB/hari untuk bayi cukup bulan; 3 mg/kgBB/hari untuk bayi berat badan lahir rendah (BBLR, <2.500 g).",
				"unitLabel": "mg/kg/hari",
				"dosisMaxPerKg": 3,
				"usiaMinBulan": 1
			},
			{
				"catatan": "1 mg/kgBB/hari zat besi elemental, diberikan secara intermiten untuk anak usia 2–5 tahun (balita) dan >5–12 tahun (usia sekolah).",
				"unitLabel": "mg/kg/hari",
				"dosisMaxPerKg": 1,
				"usiaMinBulan": 24,
				"doseBasis": "perDay",
				"usiaMaxBulan": 144,
				"dosisMinPerKg": 1,
				"tipe": "perKg",
				"labelUsia": "2–12 tahun (balita & usia sekolah)",
				"dosesPerDay": 1,
				"frekuensi": "2 kali per minggu, selama 3 bulan berturut-turut setiap tahun"
			},
			{
				"labelUsia": "12–18 tahun (remaja)",
				"tipe": "flat",
				"frekuensi": "2 kali per minggu, selama 3 bulan berturut-turut setiap tahun",
				"dosesPerDay": 1,
				"dosisMaksimalHarianMg": 60,
				"dosisFlatMax": 60,
				"catatan": "Dosis tetap 60 mg/hari zat besi elemental, tidak dihitung dari berat badan. Khusus remaja perempuan: tambahkan asam folat 400   g.",
				"usiaMinBulan": 144,
				"usiaMaxBulan": 216,
				"doseBasis": "perDay",
				"dosisFlatMin": 60
			}
		],
		"sediaanMg": 15,
		"frekuensi": "1 kali sehari",
		"sediaanCustomText": "Sirup 15 mg/5 ml; Tetes (Maltofer) 2,5 mg/tetes — sesuaikan dengan sediaan yang tersedia. Untuk dosis tetap 60 mg/hari (remaja 12–18 tahun), pada praktiknya umumnya memakai sediaan tablet.",
		"nama": "Zat Besi",
		"sediaanMl": 5,
		"catatan": "Rekomendasi IDAI untuk suplementasi zat besi rutin pada anak. Dosis, frekuensi, dan cara pemberian berbeda di setiap kelompok usia — kalkulator otomatis menyesuaikan berdasarkan usia yang diinput.",
		"doseType": "ageBands",
		"unitLabel": "mg/kg atau mg (sesuai usia)",
		"jenis": "Vitamin & Suplemen",
		"doseBasis": "perDay",
		"icon": "🩸",
		"kelasAlergi": [],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hemokromatosis / kelebihan besi",
			"Anemia bukan defisiensi besi"
		],
		"peringatan": [
			"Dosis tercantum umumnya PROFILAKSIS; terapi IDA 3-6 mg/kg/hari",
			"Absorpsi turun bersama susu/antasida"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkali",
			"dosis": 15,
			"sediaan": 30,
			"alias": [
				"besi",
				"iron",
				"ferrous",
				"fe"
			],
			"catatan": "Berdasarkan besi elemental; verifikasi sediaan (tablet/sirup/tetes)."
		}
	},
	{
		"id": "zinc",
		"jenis": "Vitamin & Suplemen",
		"dosisDibawahAmbangMg": 10,
		"catatan": "Diberikan selama 10–14 hari pada diare akut. Maksimum otomatis 20 mg/hari.",
		"dosisDiatasAmbangMg": 20,
		"doseBasis": "perDay",
		"icon": "⚡",
		"dosisMaksimalHarianMg": 20,
		"sediaanMg": 20,
		"doseType": "byAge",
		"unitLabel": "mg/hari berdasarkan usia",
		"ambangUsiaBulan": 6,
		"frekuensi": "1 kali sehari selama 10–14 hari",
		"dosesPerDay": 1,
		"sediaanMl": 5,
		"nama": "Zinc",
		"kelasAlergi": [],
		"interaksiTags": [],
		"kontraindikasi": [
			"Hipersensitivitas"
		],
		"peringatan": [
			"Standar diare: 10-14 hari"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 20,
		"puyer": {
			"mode": "mgkali",
			"dosis": 20,
			"sediaan": 20,
			"alias": [
				"zn"
			],
			"catatan": "Sesuaikan usia dan pedoman diare."
		}
	},
	{
		"id": "ivermectin",
		"nama": "Ivermectin",
		"jenis": "Anthelmintik",
		"icon": "🪱",
		"doseType": "perKg",
		"doseBasis": "perDay",
		"dosisMinPerKg": 150,
		"dosisMaxPerKg": 200,
		"satuanDosis": "mcg",
		"unitLabel": "µg/kg/hari",
		"maxDosesPerDay": 1,
		"dosesPerDay": 1,
		"frekuensi": "1× sehari selama 1–2 hari",
		"indikasi": "Cutaneous larva migrans (CLM)/creeping eruption — terapi lini pertama.",
		"sediaanCustomText": "Tablet 12 mg (atau 3 mg tergantung produk). Tidak tersedia dalam bentuk sirup.",
		"catatan": "CLM (Perdoski 2024): ivermectin 200 µg/kg/hari, atau 150 µg/kg untuk pasien anak, selama 1–2 hari. Umumnya tidak rutin diberikan pada anak <15 kg atau <12 bulan; konsultasikan ke dokter.",
		"kelasAlergi": [
			"ivermectin"
		],
		"interaksiTags": [],
		"kontraindikasi": [
			"Berat badan <15 kg",
			"Kehamilan",
			"Hipersensitivitas"
		],
		"peringatan": [
			"Hati-hati ko-infeksi Loa loa (risiko ensefalopati)"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 12,
		"puyer": {
			"mode": "mgkg",
			"dosis": 0.2,
			"sediaan": 12,
			"alias": [
				"ivermectin"
			],
			"catatan": "200 µg/kg = 0,2 mg/kg; tablet 12 mg. Verifikasi satuan (mg)."
		}
	},
	{
		"id": "albendazole-perkg",
		"nama": "Albendazole (per kg)",
		"jenis": "Anthelmintik",
		"icon": "🪱",
		"doseType": "perKg",
		"doseBasis": "perDay",
		"dosisMinPerKg": 10,
		"dosisMaxPerKg": 15,
		"satuanDosis": "mg",
		"unitLabel": "mg/kg/hari",
		"maxDosesPerDay": 1,
		"dosesPerDay": 1,
		"dosisMaksimalHarianMg": 800,
		"frekuensi": "1× sehari selama 3–5 hari",
		"indikasi": "Cutaneous larva migrans (CLM)/creeping eruption pada pasien anak (dosis berbasis berat badan).",
		"sediaanCustomText": "Tablet kunyah/tablet 400 mg; beberapa produk tersedia suspensi 200 mg/5 mL.",
		"catatan": "CLM pada anak (Perdoski 2024): albendazol 10–15 mg/kg/hari dengan dosis maksimal 800 mg/hari, diberikan selama 3–5 hari. Alternatif dosis flat 400 mg lihat kartu 'Albendazole (Flat)'.",
		"kelasAlergi": [
			"benzimidazol"
		],
		"interaksiTags": [
			"hepatotoksik-dosis-tinggi"
		],
		"kontraindikasi": [
			"Kehamilan (trimester 1)",
			"Hipersensitivitas benzimidazol"
		],
		"peringatan": [
			"Hati-hati usia <2 tahun (data terbatas)",
			"Pantau fungsi hati pada terapi lama/dosis tinggi"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"puyer": {
			"mode": "mgkg",
			"dosis": 10,
			"sediaan": 400,
			"alias": [
				"albendazol"
			],
			"catatan": "10–15 mg/kg/hari; tablet 400 mg. Verifikasi."
		}
	},
	{
		"id": "metoclopramide",
		"nama": "Metoclopramide",
		"jenis": "Antiemetik",
		"icon": "🤢",
		"doseType": "perKg",
		"doseBasis": "perDose",
		"dosisMinPerKg": 0.1,
		"dosisMaxPerKg": 0.15,
		"unitLabel": "mg/kg/kali",
		"satuanDosis": "mg",
		"maxDosesPerDay": 3,
		"dosisMaksimalTunggalMg": 10,
		"dosisMaksimalHarianPerKg": 0.5,
		"sediaanMg": 5,
		"sediaanMl": 5,
		"sediaanOptions": [
			{
				"sediaanMg": 5,
				"sediaanMl": 5,
				"label": "Sirup 5 mg/5 ml"
			}
		],
		"frekuensi": "tiap 8 jam bila perlu; batasi maksimal 5 hari",
		"catatan": "Risiko efek ekstrapiramidal/distonia akut pada anak. Gunakan dosis terendah, durasi sesingkat mungkin. Hindari usia <1 tahun. Verifikasi indikasi & alternatif (mis. ondansetron/domperidone).",
		"usiaMinValidBulan": 12,
		"kelasAlergi": [
			"metoclopramide"
		],
		"interaksiTags": [
			"qt",
			"ssp-depresan",
			"antikolinergik"
		],
		"kontraindikasi": [
			"Obstruksi/perforasi/perdarahan saluran cerna",
			"Feokromositoma",
			"Riwayat tardive dyskinesia / reaksi ekstrapiramidal",
			"Epilepsi",
			"Neonatus"
		],
		"peringatan": [
			"Risiko reaksi ekstrapiramidal/distonia akut pada anak",
			"Batasi maksimal 5 hari pemakaian",
			"Hindari pada usia <1 tahun",
			"Maks 0,5 mg/kg/hari & 10 mg/kali"
		],
		"keselamatanVersi": "v1-starter",
		"keselamatanCatatan": "Data keselamatan awal konservatif - WAJIB telaah klinis/apoteker sebelum produksi",
		"bisaDipuyer": true,
		"puyerSediaanMg": 10,
		"puyer": {
			"mode": "mgkg",
			"dosis": 0.1,
			"sediaan": 10,
			"alias": [
				"metoklopramid",
				"metoclopramid"
			],
			"catatan": "Perhatikan efek samping dan kontraindikasi."
		}
	}
] as ReadonlyArray<ObatPuyer>;
