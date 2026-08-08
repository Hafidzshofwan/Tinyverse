"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  getKopSuratConfig,
  saveKopSuratConfig,
  DEFAULT_KOP_SURAT,
  type KopSuratConfig,
} from "@/shared/lib/pdfExport";

interface KopSuratModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (cfg: KopSuratConfig) => void;
}

export function KopSuratModal({ isOpen, onClose, onSaved }: KopSuratModalProps) {
  const [config, setConfig] = useState<KopSuratConfig>(() => getKopSuratConfig());
  const [isSaved, setIsSaved] = useState(false);

  /*
   * WHY portal: .tv-topbar memakai backdrop-filter, dan properti itu
   * menjadikan elemen sebagai containing block bagi keturunan
   * position: fixed. Modal ini dirender di dalam menu pengguna yang
   * berada di dalam topbar, sehingga lapisan latarnya terkurung di kotak
   * topbar dan panel muncul melayang tanpa latar gelap. Merender ke
   * document.body memutus rantai itu. Jangan kembalikan ke render biasa.
   */
  const [terpasang, setTerpasang] = useState(false);
  useEffect(() => {
    setTerpasang(true);
  }, []);

  if (!isOpen || !terpasang) return null;

  const handleChange = (key: keyof KopSuratConfig, val: string) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
    setIsSaved(false);
  };

  const handleSave = () => {
    saveKopSuratConfig(config);
    setIsSaved(true);
    if (onSaved) onSaved(config);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setConfig(DEFAULT_KOP_SURAT);
    saveKopSuratConfig(DEFAULT_KOP_SURAT);
  };

  const backdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };

  const cardStyle: CSSProperties = {
    backgroundColor: "var(--tv-card, #FFFFFF)",
    color: "var(--tv-teks, #0F172A)",
    borderRadius: 20,
    maxWidth: 540,
    width: "100%",
    padding: 24,
    border: "1px solid var(--tv-border, var(--tv-line, rgba(10, 11, 95, 0.12)))",
    boxShadow: "var(--tv-chunky, 0 20px 40px -5px rgba(0, 0, 0, 0.35))",
    animation: "tvMuncul 0.2s ease-out",
  };

  return createPortal(
    <div style={backdropStyle} onClick={onClose} className="tv-kop-surat-modal-backdrop">
      <div style={cardStyle} onClick={(e) => e.stopPropagation()} className="tv-kop-surat-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--tv-navy, #1E3A8A)", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="var(--tv-soft, #EEF2FF)"/>
                <rect x="5" y="4" width="14" height="16" rx="2" fill="var(--tv-card, #FFFFFF)" stroke="var(--tv-navy-2, #3730A3)" strokeWidth="1.8"/>
                <path d="M12 8V14M9 11H15" stroke="var(--tv-magenta, #4F46E5)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Pengaturan Kop Surat (Letterhead PDF)
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--tv-soft-teks, #64748B)", lineHeight: 1.4 }}>
              Kop surat ini akan otomatis digunakan pada cetak Resep, Growth Chart, dan Ringkasan SOAP.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tv-kop-surat-close-btn"
            style={{
              background: "var(--tv-soft, #F1F5F9)",
              border: "1px solid var(--tv-line, transparent)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              fontWeight: 800,
              color: "var(--tv-soft-teks, #64748B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>
              Nama Klinik / Rumah Sakit / Puskesmas
            </label>
            <input
              type="text"
              value={config.namaFaskes}
              onChange={(e) => handleChange("namaFaskes", e.target.value)}
              placeholder="cth: KLINIK PEDIATRI TINYVERSE"
              className="tv-input"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>
              Sub-Judul / Unit Pelayanan
            </label>
            <input
              type="text"
              value={config.subFaskes}
              onChange={(e) => handleChange("subFaskes", e.target.value)}
              placeholder="cth: Pusat Pelayanan Kesehatan Anak & Tumbuh Kembang"
              className="tv-input"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>
              Alamat Lengkap Faskes
            </label>
            <input
              type="text"
              value={config.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              placeholder="Jl. Kesehatan Pediatri No. 108"
              className="tv-input"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>Telepon / Kontak</label>
              <input
                type="text"
                value={config.telepon}
                onChange={(e) => handleChange("telepon", e.target.value)}
                placeholder="021-7890123"
                className="tv-input"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>Kota Faskes</label>
              <input
                type="text"
                value={config.kota}
                onChange={(e) => handleChange("kota", e.target.value)}
                placeholder="Jakarta"
                className="tv-input"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>Nama Dokter DPJP</label>
              <input
                type="text"
                value={config.namaDokter}
                onChange={(e) => handleChange("namaDokter", e.target.value)}
                placeholder="dr. Alex Wijaya, Sp.A"
                className="tv-input"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--tv-teks, #334155)" }}>No. SIP Dokter</label>
              <input
                type="text"
                value={config.sipDokter}
                onChange={(e) => handleChange("sipDokter", e.target.value)}
                placeholder="SIP: 446/1082/SIP.D/2025"
                className="tv-input"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--tv-line, #E2E8F0)" }}>
          <button
            type="button"
            onClick={handleReset}
            className="tv-kop-surat-reset-btn"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid var(--tv-border, #CBD5E1)",
              background: "var(--tv-soft, #F8FAFC)",
              color: "var(--tv-teks, #475569)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Default
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isSaved && <span style={{ fontSize: "0.8rem", color: "var(--tv-safety-ok-text, #16A34A)", fontWeight: 700 }}>✓ Tersimpan!</span>}
            <button
              type="button"
              onClick={handleSave}
              className="tv-kop-surat-save-btn"
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "none",
                background: "var(--tv-btn-primary-bg, #2563EB)",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
              }}
            >
              Simpan Kop Surat
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
