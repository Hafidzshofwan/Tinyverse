"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  OBAT_LIST,
  PETA_JENIS_OBAT,
  WARNA_JENIS_OBAT,
  warnaJenis,
  kategoriTagStyle,
  labelDosisObat,
  Obat,
  SediaanOption
} from "./dosisData";
import { hitungDosisInti, HasilPerhitungan, keteranganDosisAcuan } from "./hitungDosis";
import { usePatientProfile } from "@/shared/lib/patient";
import {
  RakObatHeaderIcon,
  KalkulatorHeaderIcon,
  SearchIconSvg,
  MedicineCardIcon
} from "./MedicineIcons";
import "./dosing-tool.css";

export function DosisToolNative() {
  const patient = usePatientProfile();

  const [obatTerpilihId, setObatTerpilihId] = useState<string>("paracetamol");
  const [kataKunci, setKataKunci] = useState<string>("");
  const [kategoriAktif, setKategoriAktif] = useState<string>("Semua");

  const [beratBadan, setBeratBadan] = useState<string>("");
  const [usiaBulan, setUsiaBulan] = useState<string>("");
  const [sediaanIndex, setSediaanIndex] = useState<number>(0);
  const [inputAlergi, setInputAlergi] = useState<string>("");

  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);

  const libraryRef = useRef<HTMLDivElement>(null);
  const kalkulatorRef = useRef<HTMLDivElement>(null);

  // Sync with patient profile if available
  useEffect(() => {
    if (patient) {
      if (patient.bb !== undefined && patient.bb !== null && !beratBadan) {
        setBeratBadan(String(patient.bb));
      }
      if (patient.usiaBulan !== undefined && patient.usiaBulan !== null && !usiaBulan) {
        setUsiaBulan(String(patient.usiaBulan));
      }
    }
  }, [patient]);


  // Selected drug object
  const obatTerpilih: Obat | undefined = useMemo(() => {
    return OBAT_LIST.find((o) => o.id === obatTerpilihId) || OBAT_LIST[0];
  }, [obatTerpilihId]);

  // Categories list
  const daftarKategori = useMemo(() => {
    const setKat = new Set<string>();
    OBAT_LIST.forEach((o) => {
      const kat = o.jenis || PETA_JENIS_OBAT[o.nama] || "Lainnya";
      setKat.add(kat);
    });
    return ["Semua", ...Array.from(setKat).sort((a, b) => a.localeCompare(b, "id"))];
  }, []);

  // Filtered drug grid
  const obatTerfilter = useMemo(() => {
    const q = kataKunci.trim().toLowerCase();
    return OBAT_LIST.filter((o) => {
      const kat = o.jenis || PETA_JENIS_OBAT[o.nama] || "Lainnya";
      if (kategoriAktif !== "Semua" && kat !== kategoriAktif) return false;
      if (!q) return true;
      const matchNama = o.nama.toLowerCase().includes(q);
      const matchIndikasi = o.indikasi ? o.indikasi.toLowerCase().includes(q) : false;
      const matchCatatan = o.catatan ? o.catatan.toLowerCase().includes(q) : false;
      const matchVarian = o.varian ? o.varian.toLowerCase().includes(q) : false;
      return matchNama || matchIndikasi || matchCatatan || matchVarian;
    });
  }, [kataKunci, kategoriAktif]);

  // Reset sediaan index when selected drug changes
  const handlePilihObat = (id: string) => {
    setObatTerpilihId(id);
    setSediaanIndex(0);
    setHasil(null);

    // Smooth scroll to kalkulator
    if (kalkulatorRef.current) {
      kalkulatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToLibrary = () => {
    if (libraryRef.current) {
      libraryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHitung = () => {
    if (!obatTerpilih) return;
    const res = hitungDosisInti(obatTerpilih, beratBadan, usiaBulan, sediaanIndex);
    setHasil(res);
  };

  // Check if sediaan options exist for selected drug
  const hasMultipleSediaan =
    Array.isArray(obatTerpilih?.sediaanOptions) && (obatTerpilih?.sediaanOptions?.length ?? 0) > 1;

  // Determine form input visibility
  const showUsia =
    obatTerpilih?.doseType === "byAge" || obatTerpilih?.doseType === "ageBands";
  const showBerat =
    obatTerpilih?.doseType !== "byAge" &&
    !(
      obatTerpilih?.doseType === "ageBands" &&
      hasil?.band &&
      hasil.band.tipe !== "perKg"
    );

  if (!obatTerpilih) {
    return null;
  }

  return (
    <div className="dosis-container" id="page-dosis">
      {/* Navigasi / Quick Nav */}
      <nav className="dosis-nav">
        <button
          type="button"
          className="dosis-nav-btn"
          onClick={handleScrollToLibrary}
        >
          <SearchIconSvg size={16} /> Cari Obat
        </button>
        <button
          type="button"
          className="dosis-nav-btn"
          onClick={() => {
            if (kalkulatorRef.current) {
              kalkulatorRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <KalkulatorHeaderIcon size={18} /> Kalkulator
        </button>
      </nav>

      {/* RAK OBAT / LIBRARY */}
      <div className="dosis-main-card" ref={libraryRef} id="library">
        <section className="dosis-section">
          <div className="dosis-judul-wrap">
            <div className="dosis-judul-icon">
              <RakObatHeaderIcon size={38} />
            </div>
            <div className="dosis-judul-teks">
              <h2>Rak Obat</h2>
              <p>Cari atau pilih obat dari rak di bawah</p>
            </div>
          </div>

          {/* Search input */}
          <div className="dosis-search-wrap">
            <span className="dosis-search-icon">
              <SearchIconSvg size={18} />
            </span>
            <input
              type="text"
              className="dosis-search-input"
              placeholder="Ketik nama obat... contoh: Paracetamol"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
            />
          </div>

          {/* Category filter chips */}
          <div className="dosis-filter-wrap">
            {daftarKategori.map((kat) => (
              <button
                key={kat}
                type="button"
                className={`dosis-chip ${kategoriAktif === kat ? "aktif" : ""}`}
                onClick={() => setKategoriAktif(kat)}
              >
                {kat}
              </button>
            ))}
          </div>

          {/* Drug Grid */}
          {obatTerfilter.length === 0 ? (
            <div className="dosis-pesan-kosong">
              Obat tidak ditemukan, coba kata kunci lain ya!
            </div>
          ) : (
            <div className="dosis-grid">
              {obatTerfilter.map((o) => {
                const terpilih = o.id === obatTerpilihId;
                const kat = o.jenis || PETA_JENIS_OBAT[o.nama] || "Lainnya";
                const tagStyle = kategoriTagStyle(kat);
                const sediaanCount = Array.isArray(o.sediaanOptions) ? o.sediaanOptions.length : 1;

                return (
                  <div
                    key={o.id}
                    className={`dosis-card ${terpilih ? "terpilih" : ""}`}
                    onClick={() => handlePilihObat(o.id)}
                  >
                    <div className="dosis-card-top-strip" />
                    {terpilih && <div className="dosis-card-glow-bg" />}
                    {terpilih && <div className="dosis-card-toggle-dot" />}
                    
                    <div className="dosis-card-header">
                      <span
                        className="dosis-jenis-tag"
                        style={{
                          backgroundColor: tagStyle.bg,
                          color: tagStyle.color,
                        }}
                      >
                        {kat}
                      </span>
                    </div>

                    <div className="dosis-card-body">
                      <div className="dosis-card-title-text">{o.nama}</div>
                      <div className="dosis-card-subtitle">
                        {sediaanCount} pilihan sediaan
                      </div>
                    </div>

                    <div className="dosis-card-footer">
                      <button type="button" className="dosis-btn-pilih-sediaan">
                        Pilih sediaan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* KALKULATOR DOSIS */}
      <div className="dosis-main-card" ref={kalkulatorRef} id="kalkulator">
        <section className="dosis-section">
          <div className="dosis-judul-wrap">
            <div className="dosis-judul-icon">
              <KalkulatorHeaderIcon size={38} />
            </div>
            <div className="dosis-judul-teks">
              <h2>Kalkulator Dosis</h2>
              <p>Masukkan berat badan/usia, lalu hitung dosisnya</p>
            </div>
          </div>

        <div className="dosis-kartu-kalkulator">
          {/* Selected drug info box */}
          <div className="dosis-obat-terpilih-box">
            <div className="dosis-obat-terpilih-info">
              <span className="dosis-obat-terpilih-icon">
                <MedicineCardIcon jenis={obatTerpilih.jenis} size={22} />
              </span>
              <div className="dosis-obat-terpilih-teks">
                <h4>{obatTerpilih.nama}</h4>
                <p>
                  {obatTerpilih.jenis || PETA_JENIS_OBAT[obatTerpilih.nama]}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="dosis-btn-ganti"
              onClick={handleScrollToLibrary}
            >
              🔄 Ganti Obat
            </button>
          </div>

          {/* Form inputs */}
          <div className="dosis-form-grid">
            {showBerat && (
              <div className="dosis-form-group">
                <label className="dosis-form-label">
                  ⚖️ Berat Badan Anak (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="dosis-form-input"
                  placeholder="contoh: 12.5"
                  value={beratBadan}
                  onChange={(e) => setBeratBadan(e.target.value)}
                />
              </div>
            )}

            {showUsia && (
              <div className="dosis-form-group">
                <label className="dosis-form-label">
                  👶 Usia Anak (bulan)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="dosis-form-input"
                  placeholder="contoh: 18"
                  value={usiaBulan}
                  onChange={(e) => setUsiaBulan(e.target.value)}
                />
              </div>
            )}

            {hasMultipleSediaan && (
              <div className="dosis-form-group">
                <label className="dosis-form-label">
                  🧴 Pilih Sediaan Obat
                </label>
                <select
                  className="dosis-form-select"
                  value={sediaanIndex}
                  onChange={(e) => setSediaanIndex(Number(e.target.value))}
                >
                  {obatTerpilih.sediaanOptions?.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.label || `Sediaan ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="dosis-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="dosis-form-label">
                🚫 Alergi pasien (opsional — pisahkan dengan koma)
              </label>
              <input
                type="text"
                className="dosis-form-input"
                placeholder="mis. penisilin, sulfa, NSAID"
                value={inputAlergi}
                onChange={(e) => setInputAlergi(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="dosis-btn-hitung"
            onClick={handleHitung}
          >
            ✨ Hitung Dosis
          </button>

          {/* Results Display */}
          {hasil && (
            <div
              className={`dosis-hasil-box ${hasil.error ? "error-box" : ""}`}
            >
              <h3 className="dosis-hasil-title">HASIL PERHITUNGAN</h3>

              {hasil.error ? (
                <p style={{ color: "#B33A3A", fontWeight: 700, margin: 0 }}>
                  ⚠️ {hasil.error}
                </p>
              ) : (
                <div className="hasil-card-dosis">
                  <div className="hasil-ringkasan">
                    <div className="hasil-label-kecil">
                      🧮{" "}
                      {hasil.doseBasisFinal === "perDay"
                        ? "Dosis per kali pemberian"
                        : hasil.doseBasisFinal === "singleDose"
                          ? "Dosis tunggal"
                          : hasil.doseBasisFinal === "perEpisode"
                            ? "Volume per episode"
                            : "Dosis per kali pemberian"}
                    </div>

                    <div className="hasil-dosis">
                      {obatTerpilih.doseType === "perKgVolume"
                        ? `${hasil.dosisMinMl?.toFixed(1)} - ${hasil.dosisMaxMl?.toFixed(1)} ml`
                        : `${hasil.dosisMinMg?.toFixed(1)} - ${hasil.dosisMaxMg?.toFixed(1)} ${obatTerpilih.satuanDosis || "mg"}`}
                    </div>

                    {hasil.dosisMinMl !== null &&
                      hasil.dosisMinMl !== undefined &&
                      obatTerpilih.doseType !== "perKgVolume" && (
                        <div className="hasil-volume">
                          ≈ {hasil.dosisMinMl.toFixed(1)} -{" "}
                          {hasil.dosisMaxMl?.toFixed(1)} ml
                        </div>
                      )}

                    {hasil.dosisMinTablet !== null &&
                      hasil.dosisMinTablet !== undefined &&
                      obatTerpilih.doseType !== "perKgVolume" && (
                        <div className="hasil-volume">
                          ≈ {hasil.dosisMinTablet.toFixed(1)} -{" "}
                          {hasil.dosisMaxTablet?.toFixed(1)}{" "}
                          {hasil.sedBentukFinal || "tablet"}
                        </div>
                      )}

                    <div className="hasil-subtext">
                      {hasil.doseBasisFinal === "perDay"
                        ? "Dihitung dari total dosis harian, lalu dibagi sesuai frekuensi."
                        : hasil.doseBasisFinal === "perEpisode"
                          ? "Diberikan per episode, bukan sebagai total harian."
                          : "Dihitung sebagai dosis per kali pemberian."}
                    </div>
                  </div>

                  {hasil.doseBasisFinal === "perDay" &&
                    hasil.dosisHarianMinMg !== null && (
                      <div className="hasil-daily">
                        <strong>Total dosis harian:</strong>{" "}
                        {hasil.dosisHarianMinMg.toFixed(1)} -{" "}
                        {hasil.dosisHarianMaxMg?.toFixed(1)}{" "}
                        {obatTerpilih.satuanDosis || "mg"}/hari
                        {hasil.dosesPerDayFinal ? (
                          <>
                            <br />
                            <strong>Pembagian:</strong> {hasil.dosesPerDayFinal}{" "}
                            kali sehari
                          </>
                        ) : null}
                      </div>
                    )}

                  {/* Detail Section */}
                  <div className="hasil-section">
                    <div className="hasil-section-title">
                      Detail perhitungan
                    </div>
                    <div className="hasil-row">
                      <span className="label">Obat</span>
                      <span className="value">
                        <strong>
                          {obatTerpilih.nama}
                          {obatTerpilih.varian ? ` — ${obatTerpilih.varian}` : ""}
                        </strong>
                      </span>
                    </div>
                    <div className="hasil-row">
                      <span className="label">Acuan dosis</span>
                      <span className="value">
                        <strong>
                          {keteranganDosisAcuan(obatTerpilih, hasil)}
                        </strong>
                      </span>
                    </div>
                    {obatTerpilih.indikasi && (
                      <div className="hasil-row">
                        <span className="label">Indikasi</span>
                        <span className="value">{obatTerpilih.indikasi}</span>
                      </div>
                    )}
                    {hasil.sediaanLabelFinal ||
                    obatTerpilih.sediaanCustomText ? (
                      <div className="hasil-row">
                        <span className="label">Sediaan</span>
                        <span className="value">
                          {hasil.sediaanLabelFinal ||
                            obatTerpilih.sediaanCustomText}
                        </span>
                      </div>
                    ) : null}
                    <div className="hasil-row">
                      <span className="label">Pasien</span>
                      <span className="value">
                        {obatTerpilih.doseType === "byAge"
                          ? `Usia ${hasil.usiaBulan} bulan`
                          : obatTerpilih.doseType === "ageBands" && hasil.band
                            ? `Usia ${hasil.usiaBulan} bulan (${hasil.band.labelUsia || ""}) ${hasil.band.tipe === "perKg" ? `; BB ${hasil.beratBadan} kg` : ""}`
                            : `BB ${hasil.beratBadan} kg`}
                      </span>
                    </div>
                  </div>

                  {/* Frequency Pills */}
                  <div className="hasil-pills">
                    <span className="hasil-frekuensi">
                      ⏰{" "}
                      {hasil.band?.frekuensi ||
                        obatTerpilih.frekuensi ||
                        "Sesuai aturan pakai"}
                    </span>
                  </div>

                  {/* Warnings */}
                  {hasil.peringatan.length > 0 && (
                    <div className="hasil-warning">
                      ⚠️{" "}
                      {hasil.peringatan.map((p, i) => (
                        <div key={i}>{p}</div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {obatTerpilih.catatan && (
                    <div className="hasil-note">
                      <strong>Catatan:</strong> {obatTerpilih.catatan}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Keamanan Sesi Panel */}
          {obatTerpilih && (
            <div className="keamanan-panel">
              <h3>🛡️ Informasi Keamanan Obat</h3>
              {obatTerpilih.kontraindikasi && obatTerpilih.kontraindikasi.length > 0 && (
                <div style={{ marginBottom: "10px", fontSize: "0.82rem" }}>
                  <strong>Kontraindikasi:</strong>
                  <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                    {obatTerpilih.kontraindikasi.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}

              {obatTerpilih.peringatan && obatTerpilih.peringatan.length > 0 && (
                <div style={{ marginBottom: "10px", fontSize: "0.82rem" }}>
                  <strong>Peringatan Tambahan:</strong>
                  <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
                    {obatTerpilih.peringatan.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {inputAlergi.trim() !== "" && (
                <div
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.8rem",
                    color: "#991B1B",
                    marginTop: "10px",
                  }}
                >
                  <strong>Pemeriksaan Alergi Pasien:</strong> Perhatikan input alergi ({inputAlergi}) sebelum memberikan {obatTerpilih.nama}.
                </div>
              )}

              <p className="keamanan-disclaimer">
                Deteksi berbasis aturan & data keselamatan yang tersedia — bukan pengganti telaah apoteker/dokter. Selalu verifikasi dosis & kondisi klinis pasien.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
  );
}