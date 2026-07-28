"use client";

/*
 * Racik Puyer — versi React (menggantikan iframe ke /puyer-tool.html).
 *
 * Struktur DOM, urutan elemen, kelas CSS, teks, dan ikon disalin PERSIS dari
 * island. Yang berubah hanya cara kerjanya: state React menggantikan pembacaan
 * DOM manual, dan seluruh rumus dipindah ke fungsi murni yang diuji
 * (format.ts, hitungRacikan.ts, rentangDosis.ts, interaksi.ts).
 *
 * Tidak ada angka, ambang peringatan, atau kalimat klinis yang diubah.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
import "./puyer-tool.css";
import { usePatientProfile, useSyncedField, formatUsiaPasien } from "@/shared/lib/patient";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { fmt, fmtResepAngka } from "./format";
import {
	aturanMengikutiFrekuensi,
	hitungJumlahBungkus,
	hitungRacikan,
	type BarisObat,
	type HasilRacikan,
	type ModeDosis,
} from "./hitungRacikan";
import { cariPresetObat, namaObatUntukSaran } from "./presetObat";
import { PETUNJUK_AWAL_HTML, teksRentangDosis } from "./rentangDosis";
import {
	IkonCatatanInfo,
	IkonCatatanStop,
	IkonCatatanWarn,
	IkonDaftarObat,
	IkonDokumen,
	IkonHapus,
	IkonHitung,
	IkonHitungOtomatis,
	IkonJudulPuyer,
	IkonLup,
	IkonMap,
	IkonPakaiTemplate,
	IkonPasien,
	IkonPeringatanBesar,
	IkonReset,
	IkonResep,
	IkonRingkasan,
	IkonSalin,
	IkonSimpan,
	IkonTambah,
	IkonTimbangan,
	IkonUsia,
} from "./PuyerIcons";

/** Kunci penyimpanan template di perangkat — sama dengan island agar template lama tetap terbaca. */
const PUYER_TPL_KEY = "tv_puyer_templates_v1";

interface TemplatePuyer {
	id: string;
	nama: string;
	createdAt?: number;
	updatedAt?: number;
	data: {
		frekuensi?: string;
		durasi?: string;
		aturan?: string;
		rows?: Array<Partial<BarisObat>>;
	};
}

const JUDUL_H3: React.CSSProperties = {
	fontFamily: "'Fredoka', sans-serif",
	fontSize: "1rem",
	color: "var(--biru-tua)",
	marginBottom: 12,
	display: "flex",
	alignItems: "center",
	gap: 8,
};

const TOMBOL_IKON: React.CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 6,
};

function buatId(): string {
	return "rx" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function barisBaru(data?: Partial<BarisObat>): BarisObat {
	return {
		id: buatId(),
		nama: "",
		mode: "mgkg",
		dosis: "",
		sediaan: "",
		step: "0.25",
		aktual: "",
		...data,
	};
}

function muatTemplate(): TemplatePuyer[] {
	try {
		const mentah = window.localStorage.getItem(PUYER_TPL_KEY);
		const arr = JSON.parse(mentah || "[]");
		return Array.isArray(arr) ? (arr as TemplatePuyer[]) : [];
	} catch {
		return [];
	}
}

function simpanTemplate(arr: TemplatePuyer[]): boolean {
	try {
		window.localStorage.setItem(PUYER_TPL_KEY, JSON.stringify(arr));
		return true;
	} catch {
		window.alert("Gagal menyimpan template (penyimpanan browser penuh atau diblokir).");
		return false;
	}
}

export function PuyerToolNative(): JSX.Element {
	const profile = usePatientProfile();
	const [bb, setBb] = useSyncedField(profile.bb);
	const [usia, setUsia] = useSyncedField(profile.usiaBulan);
	const [frekuensi, setFrekuensi] = useState("3");
	const [durasi, setDurasi] = useState("3");
	const [jumlah, setJumlah] = useState("");
	const [aturan, setAturan] = useState("");
	const [rows, setRows] = useState<BarisObat[]>([]);
	const [hasil, setHasil] = useState<HasilRacikan | null>(null);
	const [hintPreset, setHintPreset] = useState<Record<string, string>>({});

	const [tplNama, setTplNama] = useState("");
	const [tplPilih, setTplPilih] = useState("");
	const [tplDaftar, setTplDaftar] = useState<TemplatePuyer[]>([]);

	const kotakHasil = useRef<HTMLDivElement | null>(null);

	const saranObat = useMemo(() => namaObatUntukSaran(), []);

	/* Template hanya tersedia di peramban, jadi dimuat setelah komponen terpasang. */
	useEffect(() => {
		setTplDaftar(muatTemplate());
	}, []);

	/* Isi otomatis jumlah bungkus + etiket, sama seperti autoJumlah() di island. */
	const isiOtomatis = useCallback(
		(f: string, d: string) => {
			const n = hitungJumlahBungkus(f, d);
			if (n !== null) setJumlah(String(n));
			setAturan((cur) => aturanMengikutiFrekuensi(cur, f));
		},
		[],
	);

	const ubahFrekuensi = (v: string) => {
		setFrekuensi(v);
		isiOtomatis(v, durasi);
	};
	const ubahDurasi = (v: string) => {
		setDurasi(v);
		isiOtomatis(frekuensi, v);
	};

	const ubahBaris = (id: string, tambalan: Partial<BarisObat>) => {
		setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...tambalan } : r)));
	};

	/* Saat nama obat dipilih/diketik lengkap, preset mengisi dosis & sediaan
	 * bila kolomnya masih kosong — perilaku terapkanPresetObat() di island. */
	const terapkanPreset = (baris: BarisObat, nilai: string) => {
		const preset = cariPresetObat(nilai);
		if (!preset) return;
		ubahBaris(baris.id, {
			nama: preset.nama,
			mode: preset.mode,
			dosis: baris.dosis ? baris.dosis : String(preset.dosis),
			sediaan: baris.sediaan ? baris.sediaan : String(preset.sediaan),
		});
		setHintPreset((prev) => ({
			...prev,
			[baris.id]: preset.catatan || "Preset dipilih. Tetap verifikasi dosis.",
		}));
	};

	const hitung = () => {
		isiOtomatis(frekuensi, durasi);
		const jumlahEfektif = jumlah || String(hitungJumlahBungkus(frekuensi, durasi) ?? "");
		const r = hitungRacikan({ bb, usia, frekuensi, durasi, jumlah: jumlahEfektif, aturan, rows });
		if (r.gagal) {
			window.alert(r.gagal);
			return;
		}
		setHasil(r);
		const dash = (window as unknown as { TVHomeDashboard?: { trackOpen: (n: string) => void } }).TVHomeDashboard;
		if (dash) dash.trackOpen("Racik Puyer");
	};

	const reset = () => {
		setRows([]);
		setBb(profile.bb != null ? String(profile.bb) : "");
		setUsia(profile.usiaBulan != null ? String(profile.usiaBulan) : "");
		setFrekuensi("3");
		setDurasi("3");
		setJumlah("");
		setAturan("");
		setHasil(null);
		setHintPreset({});
	};

	const simpanSebagaiTemplate = () => {
		const nama = tplNama.trim();
		if (!nama) {
			window.alert("Beri nama template terlebih dahulu.");
			return;
		}
		if (!rows.length) {
			window.alert("Tambahkan minimal 1 obat sebelum menyimpan template.");
			return;
		}
		const data = {
			frekuensi,
			durasi,
			aturan,
			rows: rows.map((r) => ({ nama: r.nama, mode: r.mode, dosis: r.dosis, sediaan: r.sediaan, step: r.step })),
		};
		const arr = muatTemplate();
		const ada = arr.find((t) => String(t.nama).toLowerCase() === nama.toLowerCase());
		if (ada) {
			if (!window.confirm('Template "' + nama + '" sudah ada. Timpa dengan racikan saat ini?')) return;
			ada.data = data;
			ada.updatedAt = Date.now();
		} else {
			arr.push({
				id: "tpl" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
				nama,
				data,
				createdAt: Date.now(),
			});
		}
		if (!simpanTemplate(arr)) return;
		setTplDaftar(arr);
		setTplNama("");
		window.alert('\u2705 Template "' + nama + '" tersimpan di perangkat ini.');
	};

	const pakaiTemplate = () => {
		if (!tplPilih) {
			window.alert("Pilih template yang ingin dipakai.");
			return;
		}
		const t = muatTemplate().find((x) => x.id === tplPilih);
		if (!t) {
			window.alert("Template tidak ditemukan.");
			setTplDaftar(muatTemplate());
			return;
		}
		const d = t.data || {};
		setFrekuensi(d.frekuensi || "");
		setDurasi(d.durasi || "");
		setAturan(d.aturan || "");
		setRows((d.rows || []).map((r) => barisBaru(r)));
		setHasil(null);
		const n = hitungJumlahBungkus(d.frekuensi || "", d.durasi || "");
		if (n !== null) setJumlah(String(n));
	};

	const hapusTemplate = () => {
		if (!tplPilih) {
			window.alert("Pilih template yang ingin dihapus.");
			return;
		}
		const arr = muatTemplate();
		const t = arr.find((x) => x.id === tplPilih);
		if (!t) {
			setTplDaftar(arr);
			return;
		}
		if (!window.confirm('Hapus template "' + t.nama + '"? Tindakan ini tidak bisa dibatalkan.')) return;
		const sisa = arr.filter((x) => x.id !== tplPilih);
		simpanTemplate(sisa);
		setTplDaftar(sisa);
		setTplPilih("");
	};

	const salinHasil = () => {
		if (hasil?.ringkasanText) void navigator.clipboard?.writeText(hasil.ringkasanText);
	};

	const tambahKeRingkasan = () => {
		const res = hasil || (() => {
			isiOtomatis(frekuensi, durasi);
			const jumlahEfektif = jumlah || String(hitungJumlahBungkus(frekuensi, durasi) ?? "");
			return hitungRacikan({ bb, usia, frekuensi, durasi, jumlah: jumlahEfektif, aturan, rows });
		})();

		if (res && !res.gagal && res.ringkasanText) {
			addRingkasanItem({
				title: `Racik Puyer${profile.nama ? ` — ${profile.nama}` : ""}`,
				source: "Racik Puyer",
				body: res.ringkasanText,
			});
			window.alert("✅ Hasil racik puyer telah ditambahkan ke Ringkasan.");
		} else {
			const fn = (window as unknown as { tvRingkasanTambahPuyer?: () => void }).tvRingkasanTambahPuyer;
			if (typeof fn === "function") fn();
			else window.alert(res?.gagal || "Belum ada hasil racikan yang dapat ditambahkan.");
		}
	};

	return (
		<div className="puyer-island-wrap">
			<div className="judul-section">
				<div
					className="ikon-bulat"
					style={{ background: "transparent", boxShadow: "none", border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
				>
					<IkonJudulPuyer />
				</div>
				<div>
					<h2>Racik Puyer</h2>
					<p>Kalkulator puyer multi-obat per bungkus</p>
				</div>
			</div>

			<div className="puyer-shell">
				<div className="puyer-alert" style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
					<IkonPeringatanBesar />
					<div>
						Fitur ini adalah alat bantu hitung. Pastikan dosis, kompatibilitas obat, stabilitas racikan, dan
						sediaan yang boleh digerus diverifikasi oleh tenaga kesehatan/apoteker. Hindari memasukkan
						identitas pasien.
					</div>
				</div>

				{/* ===== Data pasien & aturan puyer ===== */}
				<div className="kartu">
					<h3 style={JUDUL_H3}>
						<IkonPasien />
						Data Pasien &amp; Aturan Puyer
					</h3>

					{(profile.nama || profile.bb != null || profile.usiaBulan != null) && (
						<div className="tv-patient-active-banner" style={{ marginBottom: 14 }}>
							👤 Pasien aktif: <strong>{profile.nama || "(Tanpa Nama)"}</strong>
							{profile.noRm ? ` · RM: ${profile.noRm}` : ""}
							{profile.bb != null ? ` · BB ${profile.bb} kg` : ""}
							{profile.usiaBulan != null ? ` · Usia ${formatUsiaPasien(profile.usiaBulan)}` : ""}
							<span style={{ fontSize: "0.8rem", opacity: 0.8, marginLeft: 6 }}>(terisi otomatis)</span>
						</div>
					)}
					<div className="puyer-grid-3">
						<div className="form-group">
							<label htmlFor="puyerBb" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
								<IkonTimbangan />
								Berat Badan (kg)
							</label>
							<input id="puyerBb" inputMode="decimal" min="0" placeholder="cth: 12" step="0.1" type="number" value={bb} onChange={(e) => setBb(e.target.value)} />
						</div>
						<div className="form-group">
							<label htmlFor="puyerUsia" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
								<IkonUsia />
								Usia Anak (bulan)
							</label>
							<input id="puyerUsia" inputMode="numeric" min="0" placeholder="cth: 24" step="1" type="number" value={usia} onChange={(e) => setUsia(e.target.value)} />
						</div>
						<div className="form-group">
							<label htmlFor="puyerFrekuensi">Frekuensi per hari</label>
							<input id="puyerFrekuensi" inputMode="numeric" min="1" placeholder="cth: 3" step="1" type="number" value={frekuensi} onChange={(e) => ubahFrekuensi(e.target.value)} />
						</div>
						<div className="form-group">
							<label htmlFor="puyerDurasi">Durasi (hari)</label>
							<input id="puyerDurasi" inputMode="numeric" min="1" placeholder="cth: 3" step="1" type="number" value={durasi} onChange={(e) => ubahDurasi(e.target.value)} />
						</div>
					</div>
					<div className="puyer-grid-2">
						<div className="form-group">
							<label htmlFor="puyerJumlah">Jumlah bungkus / pulv</label>
							<input id="puyerJumlah" inputMode="numeric" min="1" placeholder="otomatis frekuensi × durasi" step="1" type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
						</div>
						<div className="form-group">
							<label htmlFor="puyerAturan">Aturan pakai / etiket</label>
							<input id="puyerAturan" placeholder="cth: S 3 dd 1 pulv p.c." type="text" value={aturan} onChange={(e) => setAturan(e.target.value)} />
						</div>
					</div>
					<div className="puyer-actions">
						<button className="puyer-btn yellow" id="puyerAutoBungkus" type="button" style={TOMBOL_IKON} onClick={() => isiOtomatis(frekuensi, durasi)}>
							<IkonHitungOtomatis />
							Isi otomatis jumlah bungkus
						</button>
					</div>
				</div>

				{/* ===== Daftar obat ===== */}
				<div className="kartu">
					<h3 style={JUDUL_H3}>
						<IkonDaftarObat />
						Daftar Obat dalam Puyer
					</h3>
					<div className="puyer-obat-list" id="puyerObatList">
						{!rows.length ? (
							<div className="puyer-empty">
								Belum ada obat. Klik <strong>Tambah Obat</strong> untuk mulai menyusun racikan.
							</div>
						) : (
							rows.map((r, idx) => {
								const rentang = teksRentangDosis(r.nama, bb, usia, frekuensi);
								const petunjuk = hintPreset[r.id];
								return (
									<div className="puyer-obat-card" key={r.id}>
										<div className="puyer-obat-head">
											<div className="puyer-obat-title">Obat {idx + 1}</div>
											<button
												className="puyer-remove"
												type="button"
												aria-label="Hapus obat"
												onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
											>
												×
											</button>
										</div>
										<div className="puyer-grid-2">
											<div className="form-group puyer-obat-search-wrap">
												<label>Nama obat</label>
												<input
													list="puyerObatOptions"
													type="search"
													autoComplete="off"
													placeholder="ketik: para, ctm, ambro... lalu pilih"
													value={r.nama}
													onChange={(e) => ubahBaris(r.id, { nama: e.target.value })}
													onBlur={(e) => terapkanPreset(r, e.target.value)}
												/>
												<small className="puyer-search-hint">
													{petunjuk ? (
														<>
															<span className="puyer-preset-chip">✓ {r.nama}</span> {petunjuk}
														</>
													) : (
														"Ketik beberapa huruf, lalu pilih obat dari saran. Dosis/sediaan akan terisi otomatis jika tersedia."
													)}
												</small>
											</div>
											<div className="form-group">
												<label>Dosis per kg / per bungkus</label>
												<select value={r.mode} onChange={(e) => ubahBaris(r.id, { mode: e.target.value as ModeDosis })}>
													<option value="mgkg">Dosis per kg (mg/kg/kali)</option>
													<option value="mgkali">Dosis per bungkus (mg/bungkus)</option>
												</select>
											</div>
										</div>
										<div className="puyer-grid-3">
											<div className="form-group">
												<label>Dosis yang diinginkan</label>
												<input inputMode="decimal" type="number" step="0.01" placeholder="cth: 10 mg/kg atau 1 mg/bungkus" value={r.dosis} onChange={(e) => ubahBaris(r.id, { dosis: e.target.value })} />
											</div>
											<div className="form-group">
												<label>Isi 1 tablet/kapsul (mg)</label>
												<input inputMode="decimal" type="number" step="0.01" placeholder="cth: 500" value={r.sediaan} onChange={(e) => ubahBaris(r.id, { sediaan: e.target.value })} />
											</div>
											<div className="form-group">
												<label>Bulatkan ke pecahan tablet</label>
												<select value={r.step} onChange={(e) => ubahBaris(r.id, { step: e.target.value })}>
													<option value="0.25">¼ tablet terdekat</option>
													<option value="0.5">½ tablet terdekat</option>
													<option value="1">1 tablet terdekat</option>
												</select>
											</div>
										</div>
										{/* Rentang dosis otomatis — markup diproduksi fungsi murni yang sudah meng-escape data. */}
										<div
											className={"puyer-dose-range " + (r.nama.trim() ? rentang.cls : "pdr-empty")}
											dangerouslySetInnerHTML={{ __html: r.nama.trim() ? rentang.html : PETUNJUK_AWAL_HTML }}
										/>
									</div>
								);
							})
						)}
					</div>
					<datalist id="puyerObatOptions">
						{saranObat.map((n) => (
							<option value={n} key={n} />
						))}
					</datalist>
					<div className="puyer-actions">
						<button className="puyer-btn" type="button" style={TOMBOL_IKON} onClick={() => setRows((prev) => [...prev, barisBaru()])}>
							<IkonTambah />
							Tambah Obat
						</button>
						<button className="puyer-btn green" type="button" style={TOMBOL_IKON} onClick={hitung}>
							<IkonHitung />
							Hitung Racikan
						</button>
						<button className="puyer-btn pink" type="button" style={TOMBOL_IKON} onClick={reset}>
							<IkonReset />
							Reset Form
						</button>
					</div>
				</div>

				{/* ===== Template resep ===== */}
				<div className="kartu">
					<h3 style={JUDUL_H3}>
						<IkonMap />
						Template Resep Puyer
					</h3>
					<p style={{ color: "var(--teks-lembut)", fontSize: ".85rem", margin: "-4px 0 12px" }}>
						Simpan kombinasi obat + aturan yang sering dipakai, lalu panggil ulang kapan saja. Tersimpan di
						perangkat ini (browser) — tanpa data pasien.
					</p>
					<div className="puyer-grid-2">
						<div className="form-group">
							<label htmlFor="puyerTplNama">Nama template</label>
							<input id="puyerTplNama" type="text" placeholder="cth: Batuk-pilek balita" autoComplete="off" value={tplNama} onChange={(e) => setTplNama(e.target.value)} />
						</div>
						<div className="form-group">
							<label htmlFor="puyerTplPilih">Template tersimpan</label>
							<select id="puyerTplPilih" value={tplPilih} onChange={(e) => setTplPilih(e.target.value)}>
								{!tplDaftar.length ? (
									<option value="">(belum ada template tersimpan)</option>
								) : (
									<>
										<option value="">— pilih template —</option>
										{tplDaftar.map((t) => (
											<option value={t.id} key={t.id}>
												{t.nama} ({t.data?.rows?.length ?? 0} obat)
											</option>
										))}
									</>
								)}
							</select>
						</div>
					</div>
					<div className="puyer-actions">
						<button className="puyer-btn green" type="button" style={TOMBOL_IKON} onClick={simpanSebagaiTemplate}>
							<IkonSimpan />
							Simpan sebagai template
						</button>
						<button className="puyer-btn" type="button" style={TOMBOL_IKON} onClick={pakaiTemplate}>
							<IkonPakaiTemplate />
							Pakai template
						</button>
						<button className="puyer-btn pink" type="button" style={TOMBOL_IKON} onClick={hapusTemplate}>
							<IkonHapus />
							Hapus template
						</button>
					</div>
				</div>

				{/* ===== Hasil ===== */}
				{hasil ? (
					<div className="kartu" ref={kotakHasil}>
						<h3 style={JUDUL_H3}>
							<IkonDokumen />
							Hasil Racik Puyer
						</h3>
						<div className="puyer-result">
							<div className="puyer-summary-grid">
								<div className="puyer-metric">
									<div className="label">Jumlah puyer</div>
									<div className="value">{fmt(hasil.jumlah, 0)} bungkus</div>
								</div>
								<div className="puyer-metric">
									<div className="label">Frekuensi</div>
									<div className="value">{Number.isFinite(hasil.frekuensi) ? fmt(hasil.frekuensi, 0) + "×/hari" : "—"}</div>
								</div>
								<div className="puyer-metric">
									<div className="label">Durasi</div>
									<div className="value">{Number.isFinite(hasil.durasi) ? fmt(hasil.durasi, 0) + " hari" : "—"}</div>
								</div>
								<div className="puyer-metric">
									<div className="label">Jumlah obat valid</div>
									<div className="value">{hasil.rows.length} obat</div>
								</div>
							</div>

							{hasil.interaksi.length ? (
								<div className="puyer-note-list">
									{hasil.interaksi.map((it) => {
										const keras = it.level === "hindari";
										return (
											<div
												className="puyer-note"
												key={it.pesan}
												style={{
													borderLeft: "4px solid " + (keras ? "#C0392B" : "#B26A00"),
													background: keras ? "#FDEDEC" : "#FEF5E7",
													color: keras ? "#922B21" : "#7E5109",
													fontWeight: 700,
												}}
											>
												{keras ? <IkonCatatanStop /> : <IkonCatatanWarn />} {it.pesan}
											</div>
										);
									})}
									<div className="puyer-note" style={{ fontWeight: 600, fontStyle: "italic", color: "var(--teks-lembut)" }}>
										<IkonLup /> Deteksi interaksi ini bersifat bantu-ingat &amp; belum lengkap — selalu verifikasi
										kompatibilitas/interaksi ke apoteker atau pedoman sebelum meracik.
									</div>
								</div>
							) : null}

							{hasil.terpisah.length ? (
								<div className="puyer-note-list">
									<div className="puyer-note" style={{ borderLeft: "4px solid #C0392B", background: "#FDEDEC", color: "#922B21", fontWeight: 700 }}>
										<IkonCatatanStop /> Diracik / diberikan TERPISAH (tidak digabung ke puyer{" "}
										{Number.isFinite(hasil.frekuensi) ? fmt(hasil.frekuensi, 0) : "?"}×/hari):{" "}
										{hasil.terpisah.join(", ")}. Obat ini butuh frekuensi berbeda — buat resep/racikan sendiri.
									</div>
								</div>
							) : null}

							<div className="puyer-table-wrap">
								<table className="puyer-table">
									<thead>
										<tr>
											<th>Obat</th>
											<th>Target / bungkus</th>
											<th>Total target</th>
											<th>Sediaan</th>
											<th>Tablet teoritis</th>
											<th>Tablet dipakai</th>
											<th>Isi aktual / bungkus</th>
											<th>Selisih</th>
										</tr>
									</thead>
									<tbody>
										{hasil.rows.map((r) => (
											<tr key={r.nama + String(r.sed) + String(r.target)}>
												<td>
													<strong>{r.nama}</strong>
													<br />
													<span style={{ color: "var(--teks-lembut)" }}>
														{r.mode === "mgkg" ? fmt(r.dosisInput, 2) + " mg/kg/kali" : fmt(r.dosisInput, 2) + " mg/bungkus"}
													</span>
												</td>
												<td>{fmt(r.target, 2)} mg</td>
												<td>{fmt(r.totalTarget, 2)} mg</td>
												<td>{fmt(r.sed, 2)} mg</td>
												<td>{fmt(r.teoritis, 2)} tab</td>
												<td>{fmt(r.aktual, 2)} tab</td>
												<td>{fmt(r.perBungkus, 2)} mg</td>
												<td className={r.cls}>
													{(r.selisih >= 0 ? "+" : "") + fmt(r.selisih, 2)} mg
													<br />({(r.pct >= 0 ? "+" : "") + fmt(r.pct, 1)}%)
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="puyer-note-list">
								{hasil.catatan.map((c) => (
									<div className="puyer-note" key={c.teks}>
										{c.jenis === "stop" ? <IkonCatatanStop /> : c.jenis === "info" ? <IkonCatatanInfo /> : <IkonCatatanWarn />} {c.teks}
									</div>
								))}
							</div>

							<div>
								<div className="puyer-resep-title" style={{ display: "flex", alignItems: "center" }}>
									<IkonResep />
									Draft Resep Racikan
								</div>
								<div className="puyer-resep-box">{hasil.resepText}</div>
							</div>

							<div className="puyer-output-text">{hasil.catatanText}</div>
						</div>

						<div className="puyer-actions">
							<button className="puyer-btn" type="button" style={TOMBOL_IKON} onClick={salinHasil}>
								<IkonSalin />
								Salin Hasil
							</button>
							<button className="puyer-btn green" type="button" style={TOMBOL_IKON} onClick={tambahKeRingkasan}>
								<IkonRingkasan />
								Tambahkan ke Ringkasan
							</button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

/* Dipakai draft resep pada tes; diekspor agar tidak ikut ter-tree-shake saat dites. */
export const _fmtResepAngka = fmtResepAngka;
