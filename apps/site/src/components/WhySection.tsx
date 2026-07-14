type Poin = { ikon: string; judul: string; teks: string }

const POIN: Poin[] = [
	{ ikon: "⚡", judul: "Cepat", teks: "Perhitungan berjalan di sisi klien tanpa menunggu server." },
	{ ikon: "📶", judul: "Bisa offline", teks: "Pasang sebagai aplikasi (PWA) dan pakai tanpa internet." },
	{ ikon: "✅", judul: "Terverifikasi", teks: "Rumus dipertahankan sama persis dari versi sebelumnya." },
	{ ikon: "🎯", judul: "Fokus anak", teks: "Dirancang khusus untuk kebutuhan klinis pediatri." },
]

export function WhySection() {
	return (
		<section id="kenapa" className="border-t border-white/10">
			<div className="mx-auto max-w-6xl px-6 py-20">
				<h2 className="text-3xl font-bold tracking-tight">Kenapa Tinyverse</h2>
				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{POIN.map((poin) => (
						<div
							key={poin.judul}
							className="rounded-2xl border border-white/10 bg-slate-900/40 p-6"
						>
							<div className="text-2xl">{poin.ikon}</div>
							<h3 className="mt-3 font-semibold">{poin.judul}</h3>
							<p className="mt-2 text-sm text-slate-400">{poin.teks}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
