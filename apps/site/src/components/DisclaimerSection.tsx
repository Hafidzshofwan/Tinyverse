export function DisclaimerSection() {
	return (
		<section id="disclaimer" className="border-t border-white/10 bg-slate-900/40">
			<div className="mx-auto max-w-4xl px-6 py-16">
				<div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-8">
					<h2 className="flex items-center gap-2 text-xl font-semibold text-amber-200">
						<span>⚠️</span> Catatan penting
					</h2>
					<p className="mt-3 text-slate-300">
						Tinyverse adalah <strong>alat bantu</strong>, bukan pengganti penilaian
						klinis. Selalu verifikasi hasil perhitungan dan sesuaikan dengan kondisi
						pasien serta panduan resmi sebelum mengambil keputusan.
					</p>
				</div>
			</div>
		</section>
	)
}
