export function SiteFooter() {
	const tahun = new Date().getFullYear()
	return (
		<footer className="border-t border-white/10">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-400 sm:flex-row">
				<p>© {tahun} Tinyverse. Dibuat oleh dr. Hafidzuddin.</p>
				<p>Alat bantu klinis pediatri — gunakan dengan penilaian profesional.</p>
			</div>
		</footer>
	)
}
