"use client";

import type { ReferensiItem } from "./referensi-data";
import s from "./ReferensiBlok.module.css";

export type ReferensiBlokProps = {
	/** Daftar sitasi yang ditampilkan, urut sesuai penomoran yang diinginkan. */
	sumber: ReadonlyArray<ReferensiItem>;
	/** Judul blok. Default sudah cukup untuk hampir semua alat. */
	judul?: string;
	/** Catatan tambahan di bawah daftar, mis. keterbatasan sumber. */
	catatan?: string;
	/** Buka otomatis saat halaman dimuat. Default tertutup agar tidak ramai. */
	terbukaAwal?: boolean;
};

/**
 * Blok daftar pustaka yang bisa dibuka-tutup.
 *
 * WHY <details>: daftar sitasi jarang dibaca saat sedang bekerja cepat di
 * bangsal, tetapi harus tetap ada dan bisa disalin. Elemen bawaan peramban
 * sudah membawa perilaku buka-tutup yang benar untuk pembaca layar tanpa
 * perlu state React.
 */
export function ReferensiBlok({
	sumber,
	judul = "Referensi",
	catatan,
	terbukaAwal = false,
}: ReferensiBlokProps) {
	if (sumber.length === 0) return null;
	return (
		<details className={s.blok} open={terbukaAwal}>
			<summary className={s.ringkasan}>
				<span className={s.ikon} aria-hidden="true">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path
							d="M4 5.5C4 4.7 4.7 4 5.5 4H10C11.1 4 12 4.9 12 6V20C12 19 11.1 18.5 10 18.5H5.5C4.7 18.5 4 17.8 4 17V5.5Z"
							stroke="currentColor"
							strokeWidth="1.7"
							strokeLinejoin="round"
						/>
						<path
							d="M20 5.5C20 4.7 19.3 4 18.5 4H14C12.9 4 12 4.9 12 6V20C12 19 12.9 18.5 14 18.5H18.5C19.3 18.5 20 17.8 20 17V5.5Z"
							stroke="currentColor"
							strokeWidth="1.7"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
				{judul}
				<span className={s.jumlah}>{sumber.length} sumber</span>
				<span className={s.panah} aria-hidden="true">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
						<path
							d="M6 9L12 15L18 9"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</summary>
			<div className={s.isi}>
				<ol className={s.daftar}>
					{sumber.map((item) => (
						<li key={item.teks}>
							{item.teks}
							{item.tautan ? (
								<>
									{" "}
									<a
										className={s.tautan}
										href={item.tautan}
										target="_blank"
										rel="noopener noreferrer"
									>
										[{item.labelTautan ?? "Tautan"}]
									</a>
								</>
							) : null}
						</li>
					))}
				</ol>
				{catatan ? <p className={s.catatan}>{catatan}</p> : null}
			</div>
		</details>
	);
}
