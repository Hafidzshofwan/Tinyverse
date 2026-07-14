// Data statis untuk situs marketing Tinyverse.
// Dipisah agar mudah diubah tanpa menyentuh komponen.

export const APP_URL =
	process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export type Tool = {
	nama: string
	deskripsi: string
	ikon: string
	href: string
}

// Daftar alat sesuai fitur yang sudah dimigrasi ke aplikasi.
export const TOOLS: Tool[] = [
	{
		nama: "Obat Darurat",
		deskripsi: "Dosis obat gawat darurat anak berdasarkan berat badan.",
		ikon: "🚨",
		href: "/preview/darurat",
	},
	{
		nama: "Dosis Obat",
		deskripsi: "Hitung dosis obat pediatri dengan cepat dan aman.",
		ikon: "💊",
		href: "/preview/dosing",
	},
	{
		nama: "Terapi Cairan",
		deskripsi: "Kebutuhan rumatan dan resusitasi cairan berbasis berat badan.",
		ikon: "💧",
		href: "/preview/fluids",
	},
	{
		nama: "Racikan Puyer",
		deskripsi: "Bantu menghitung komposisi racikan puyer.",
		ikon: "⚗️",
		href: "/preview/puyer",
	},
	{
		nama: "Tumbuh Kembang",
		deskripsi: "Nilai status pertumbuhan dan perkembangan anak.",
		ikon: "📈",
		href: "/preview/pertumbuhan",
	},
	{
		nama: "Skoring Klinis",
		deskripsi: "Skor klinis pediatri yang sering dipakai.",
		ikon: "🧮",
		href: "/preview/skoring",
	},
	{
		nama: "Interpretasi Lab",
		deskripsi: "Bantu membaca nilai laboratorium anak.",
		ikon: "🧪",
		href: "/preview/lab",
	},
	{
		nama: "Nutrisi",
		deskripsi: "Perhitungan kebutuhan dan dukungan nutrisi.",
		ikon: "🍎",
		href: "/preview/nutrisi",
	},
	{
		nama: "Protokol & Panduan",
		deskripsi: "Rujukan protokol klinis dengan pencarian cepat.",
		ikon: "📚",
		href: "/preview/guideline",
	},
]
