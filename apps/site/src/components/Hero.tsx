import { APP_URL } from "@/config/site"

export function Hero() {
	return (
		<section id="beranda" className="relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent" />
			<div className="mx-auto max-w-6xl px-6 py-24 text-center">
				<span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-sky-300">
					Alat bantu klinis pediatri
				</span>
				<h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
					Keputusan klinis anak jadi lebih cepat dan percaya diri
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
					Tinyverse mengumpulkan kalkulator dosis, cairan, skoring, dan panduan
					pediatri dalam satu tempat — ringan, akurat, dan bisa dipasang untuk
					dipakai offline.
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<a
						href={APP_URL}
						className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
					>
						Buka Aplikasi
					</a>
					<a
						href="#alat"
						className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/5"
					>
						Lihat Fitur
					</a>
				</div>
			</div>
		</section>
	)
}
