import { APP_URL, TOOLS } from "@/config/site"

export function ToolsSection() {
	return (
		<section id="alat" className="border-t border-white/10 bg-slate-900/40">
			<div className="mx-auto max-w-6xl px-6 py-20">
				<div className="max-w-2xl">
					<h2 className="text-3xl font-bold tracking-tight">Alat yang tersedia</h2>
					<p className="mt-3 text-slate-300">
						Semua alat berbasis rumus yang sudah diverifikasi dari versi Tinyverse
						sebelumnya.
					</p>
				</div>
				<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{TOOLS.map((tool) => (
						<a
							key={tool.href}
							href={`${APP_URL}${tool.href}`}
							className="group rounded-2xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-sky-400/40 hover:bg-slate-900"
						>
							<div className="text-3xl">{tool.ikon}</div>
							<h3 className="mt-4 text-lg font-semibold transition group-hover:text-sky-300">
								{tool.nama}
							</h3>
							<p className="mt-2 text-sm text-slate-400">{tool.deskripsi}</p>
						</a>
					))}
				</div>
			</div>
		</section>
	)
}
