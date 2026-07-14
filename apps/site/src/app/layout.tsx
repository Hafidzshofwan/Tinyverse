import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
	title: "Tinyverse — Alat Bantu Klinis Pediatri",
	description:
		"Tinyverse membantu dokter dan tenaga kesehatan menghitung dosis, cairan, dan skor klinis anak dengan cepat, akurat, dan bisa dipakai offline.",
}

export const viewport: Viewport = {
	themeColor: "#0b1f3a",
	width: "device-width",
	initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="id">
			<body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
		</html>
	)
}
