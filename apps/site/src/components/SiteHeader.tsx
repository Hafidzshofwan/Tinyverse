import { APP_URL } from "@/config/site"

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<a href="#beranda" className="flex items-center gap-2 font-semibold tracking-tight">
					<span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/20 text-lg">🩺</span>
					<span className="text-lg">Tinyverse</span>
				</a>
				<nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
					<a href="#alat" className="transition hover:text-white">Alat</a>
					<a href="#kenapa" className="transition hover:text-white">Kenapa</a>
					<a href="#disclaimer" className="transition hover:text-white">Catatan</a>
				</nav>
				<a
					href={APP_URL}
					className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
				>
					Buka Aplikasi
				</a>
			</div>
		</header>
	)
}
