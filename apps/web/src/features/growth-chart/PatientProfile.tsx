"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PatientProfile as PatientProfileType,
  usePatientProfile,
  usePatientList,
  pilihPasienAktif,
  tambahAtauUpdatePasienInList,
  hapusPasienFromList,
  formatUsiaPasien,
  validateAntropometri,
} from "@/shared/lib/patient";

type Jk = "male" | "female" | null;

export function MaleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#E0E7FF" />
      <path d="M7 11C7 7.5 9 6 12 6C15 6 17 7.5 17 11C17 11 15 9.5 12 9.5C9 9.5 7 11 7 11Z" fill="#1D4ED8" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#2563EB" />
    </svg>
  );
}

export function FemaleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
      <path d="M6 13C5.5 9 8 6 12 6C16 6 18.5 9 18 13C17 10 15 9 12 9C9 9 7 10 6 13Z" fill="#BE185D" />
      <circle cx="6.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="17.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#DB2777" />
    </svg>
  );
}

export function BabyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#F3E8FF" />
      <circle cx="12" cy="12" r="5" fill="#FDE68A" />
      <path d="M12 7C12.8 6 13.5 6.2 13 7" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10.2" cy="11.5" r="0.7" fill="#1E293B" />
      <circle cx="13.8" cy="11.5" r="0.7" fill="#1E293B" />
      <circle cx="9.2" cy="13" r="0.8" fill="#F43F5E" opacity="0.5" />
      <circle cx="14.8" cy="13" r="0.8" fill="#F43F5E" opacity="0.5" />
      <path d="M11 14C11.5 14.5 12.5 14.5 13 14" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M7 20C7 18 9 16.5 12 16.5C15 16.5 17 18 17 20" fill="#8B5CF6" />
    </svg>
  );
}

export function GenderAvatar({ jk, size = 20 }: { jk?: string | null; size?: number }) {
  if (jk === "male") return <MaleIcon size={size} />;
  if (jk === "female") return <FemaleIcon size={size} />;
  return <BabyIcon size={size} />;
}

function PatientFabIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#FFFFFF"/>
      <path d="M12 14C7.58172 14 4 16.6863 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 16.6863 16.4183 14 12 14Z" fill="#FFFFFF" fillOpacity="0.88"/>
    </svg>
  );
}

function PatientHeaderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <rect width="24" height="24" rx="6" fill="#EEF2FF"/>
      <circle cx="12" cy="9" r="3.5" fill="#3B82F6"/>
      <path d="M6 19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19" fill="#1D4ED8"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
      <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 3.13C17.7699 3.60312 19.0125 5.18322 19.0125 7C19.0125 8.81678 17.7699 10.3969 16 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "3px" }}>
      <path d="M12 2C10 5 8 7 8 10C8 13.3 10.2 16 12 16C13.8 16 16 13.3 16 10C16 8.5 15.5 7 14.5 5.8C14.3 8.5 13 10 12 10C11 10 10.2 9 10.5 7.5C10.7 6.2 11.5 4.5 12 2Z" fill="#F59E0B"/>
      <path d="M12 11C11 11 10 12.2 10 13.5C10 15 11 16 12 16C13 16 14 15 14 13.5C14 12.5 13.2 11.5 12 11Z" fill="#EF4444"/>
    </svg>
  );
}

function CheckToastIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
      <circle cx="12" cy="12" r="10" fill="#10B981"/>
      <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HospitalIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "6px" }}>
      <rect width="24" height="24" rx="6" fill="#EFF6FF"/>
      <path d="M5 20V8C5 6.89543 5.89543 6 7 6H17C18.1046 6 19 6.89543 19 8V20" stroke="#2563EB" strokeWidth="1.8"/>
      <path d="M12 10V16M9 13H15" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
      <rect x="9" y="17" width="6" height="3" fill="#3B82F6"/>
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
      <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H18C18.5523 21 19 20.5523 19 20V12" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M18.5 2.50001C19.3284 1.67158 20.6716 1.67158 21.5 2.50001C22.3284 3.32844 22.3284 4.67157 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5"/>
    </svg>
  );
}

function LinkConnectedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
      <circle cx="12" cy="12" r="9" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5"/>
      <path d="M8 12L11 15L16 9" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "4px" }}>
      <path d="M12 3L22 20H2L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px" }}>
      <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5"/>
      <path d="M17 21V13H7V21" fill="#FFFFFF"/>
      <path d="M7 3V8H14V3" fill="#93C5FD"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.8"/>
      <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#475467" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="#0284C7"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-2px" }}>
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

function num(v: string): number | null {
  const n = parseFloat(v);
  return isFinite(n) ? n : null;
}

export function PatientProfile() {
  const activeProfile = usePatientProfile();
  const patientList = usePatientList();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // State Form
  const [nama, setNama] = useState("");
  const [noRm, setNoRm] = useState("");
  const [thn, setThn] = useState("");
  const [bln, setBln] = useState("");
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [jk, setJk] = useState<Jk>(null);
  const [catatan, setCatatan] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const terisi = !!(activeProfile.bb || activeProfile.usiaBulan || activeProfile.nama);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const muatFormDariPasien = useCallback((p?: PatientProfileType | null) => {
    if (!p) {
      setEditingId(null);
      setNama("");
      setNoRm("");
      setThn("");
      setBln("");
      setBb("");
      setTb("");
      setJk(null);
      setCatatan("");
      return;
    }
    setEditingId(p.id || null);
    setNama(p.nama || "");
    setNoRm(p.noRm || "");
    const ub = p.usiaBulan;
    setThn(ub != null ? String(Math.floor(ub / 12)) : "");
    setBln(ub != null ? String(ub % 12) : "");
    setBb(p.bb != null ? String(p.bb) : "");
    setTb(p.tb != null ? String(p.tb) : "");
    setJk((p.jk as Jk) || null);
    setCatatan(p.catatan || "");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const buka = (tabAwal: "list" | "form" = "list") => {
    setTab(tabAwal);
    if (tabAwal === "form" && !editingId) {
      muatFormDariPasien(activeProfile.nama ? activeProfile : null);
    }
    setOpen(true);
  };

  const simpan = (andActivate = true) => {
    if (!nama.trim() && !bb && !thn && !bln) {
      showToast("Isi setidaknya Nama/Inisial, Berat, atau Usia.");
      return;
    }

    const t = num(thn);
    const b = num(bln);
    const ub = t != null || b != null ? (t || 0) * 12 + (b || 0) : null;

    const dataPasien: PatientProfileType = {
      id: editingId || undefined,
      nama: nama.trim(),
      noRm: noRm.trim(),
      usiaBulan: ub,
      bb: num(bb),
      tb: num(tb),
      jk,
      catatan: catatan.trim(),
    };

    const saved = tambahAtauUpdatePasienInList(dataPasien, andActivate);
    showToast(andActivate ? `Aktif: ${saved.nama || "Pasien Baru"}` : "Pasien disimpan ke daftar!");

    setEditingId(null);
    setTab("list");
  };

  const handleEditItem = (p: PatientProfileType) => {
    muatFormDariPasien(p);
    setTab("form");
  };

  const handleSwitchItem = (p: PatientProfileType) => {
    pilihPasienAktif(p);
    showToast(`Aktif: ${p.nama || "Pasien"}`);
  };

  const handleHapusItem = (id: string, namaPasien?: string) => {
    hapusPasienFromList(id);
    showToast(`Pasien ${namaPasien || ""} berhasil dihapus.`);
    setConfirmDeleteId(null);
  };

  const resetActive = () => {
    pilihPasienAktif({});
    showToast("Slot pasien aktif dikosongkan.");
  };

  const t2 = num(thn);
  const b2 = num(bln);
  const ubN = t2 != null || b2 != null ? (t2 || 0) * 12 + (b2 || 0) : null;
  const valAlerts = validateAntropometri(bb, tb, ubN);
  if (ubN != null && ubN > 216) {
    valAlerts.push({
      field: "format",
      level: "warning",
      title: "Usia Dewasa",
      message: "Usia pasien melebihi 18 tahun (216 bulan) — periksa kembali jika dimaksudkan untuk pediatri.",
    });
  }

  const filteredList = patientList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.nama || "").toLowerCase().includes(q) ||
      (p.noRm || "").toLowerCase().includes(q) ||
      (p.catatan || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        id="tvPasienFab"
        className={terisi ? "terisi" : undefined}
        aria-label="Profil Pasien Bangsal"
        title="Kelola Pasien Bangsal / Active Patient"
        onClick={() => buka("list")}
      >
        <PatientFabIcon />
      </button>

      {/* Modal Dialog */}
      <div
        id="tvPasienOverlay"
        className={open ? "tampil" : undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="tv-pas-card" role="dialog" aria-label="Profil Pasien">
          {/* Header Row dengan Tab Navigation & Close Button di baris yang sama */}
          <div className="tv-pas-hdr-border" style={{ marginBottom: "14px", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h3 className="tv-pas-title" style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", color: "#1B2A6B", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <PatientHeaderIcon /> Pasien Bangsal &amp; Poliklinik
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* 2 Tombol Tab Navigation sejajar dengan tombol silang */}
                <div className="tv-pas-tabs" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={tab === "list" ? "tv-pas-tab-btn aktif" : "tv-pas-tab-btn"}
                    onClick={() => setTab("list")}
                  >
                    <UsersIcon />Pasien Tersimpan ({patientList.length})
                  </button>

                  <button
                    type="button"
                    className={tab === "form" ? "tv-pas-tab-btn aktif" : "tv-pas-tab-btn"}
                    onClick={() => {
                      muatFormDariPasien(null);
                      setTab("form");
                    }}
                  >
                    <PlusIcon />{editingId ? "Edit" : "Tambah Pasien"}
                  </button>
                </div>

                <button
                  type="button"
                  className="tv-pas-btn tv-pas-reset tv-pas-close"
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.95rem",
                    borderRadius: "10px",
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    color: "#475467",
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                  onClick={() => setOpen(false)}
                  title="Tutup Modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", margin: 0 }}>
              <p className="tv-pas-sub" style={{ margin: 0 }}>
                Kelola banyak pasien, switch pasien aktif 1-klik untuk semua alat klinis.
              </p>
              <span
                className="tv-pas-cloud-badge"
                style={{
                  fontSize: "0.72rem",
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  color: "#047857",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
                title="Tersambung ke Firebase Firestore untuk sinkronisasi otomatis antar-perangkat"
              >
                <FlameIcon /> Firebase Cloud Sync
              </span>
            </div>
          </div>

          {toastMsg && (
            <div
              className="tv-pas-toast"
              style={{
                background: "#ECFDF3",
                border: "1px solid #ABEFC6",
                color: "#067647",
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "10px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckToastIcon />{toastMsg}
            </div>
          )}

          {/* TAB 1: LIST PASIEN */}
          {tab === "list" && (
            <>
              {/* Active Patient Highlight Banner */}
              {activeProfile.nama || activeProfile.bb || activeProfile.usiaBulan ? (
                <div
                  className="tv-pas-active-banner"
                  style={{
                    background: "#F0FDF4",
                    border: "1.5px solid #86EFAC",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="tv-pas-active-tag" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: "999px" }}>
                        ● Pasien Aktif
                      </span>
                      <strong className="tv-pas-active-name" style={{ fontSize: "0.92rem", color: "#0F172A" }}>
                        {activeProfile.nama || "An. Tanpa Nama"}{" "}
                        {activeProfile.noRm ? `(${activeProfile.noRm})` : ""}
                      </strong>
                    </div>
                    <div className="tv-pas-active-info" style={{ fontSize: "0.76rem", color: "#475467", marginTop: "3px" }}>
                      {activeProfile.jk === "male" ? "Laki-laki" : activeProfile.jk === "female" ? "Perempuan" : "-"} • BB: <b>{activeProfile.bb != null ? `${activeProfile.bb} kg` : "-"}</b> • Usia: <b>{formatUsiaPasien(activeProfile.usiaBulan)}</b>
                      {activeProfile.tb != null && ` • TB: ${activeProfile.tb} cm`}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="tv-pas-active-clear-btn"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      color: "#475467",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      padding: "5px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Kosongkan Pasien Aktif"
                    onClick={resetActive}
                  >
                    Kosongkan
                  </button>
                </div>
              ) : (
                <div
                  className="tv-pas-empty-box"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    color: "#475467",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    marginBottom: "12px",
                  }}
                >
                  Pilih pasien dari daftar untuk mengisi seluruh kalkulator secara otomatis.
                </div>
              )}

              {patientList.length > 0 && (
                <input
                  type="text"
                  className="tv-pas-search-input"
                  placeholder="🔍 Cari nama, No. RM, atau catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #E2E8F0",
                    fontSize: "0.84rem",
                    marginBottom: "12px",
                    outline: "none",
                    background: "#F8FAFC",
                    fontFamily: "inherit",
                    color: "#0F172A",
                  }}
                />
              )}

              <div className="tv-pas-list" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "360px", overflowY: "auto" }}>
                {filteredList.length === 0 ? (
                  <div className="tv-kosong" style={{ padding: "20px 10px", textAlign: "center" }}>
                    {patientList.length === 0 ? (
                      <>
                        <HospitalIcon />
                        <b>Daftar Pasien Kosong</b>
                        <p style={{ margin: "4px 0 12px", fontSize: "0.82rem", color: "#64748B" }}>
                          Simpan pasien bangsal/poliklinik Anda untuk switch kalkulator dosis &amp; cairan 1-klik.
                        </p>
                        <button
                          type="button"
                          className="tv-pas-btn tv-pas-save"
                          onClick={() => {
                            muatFormDariPasien(null);
                            setTab("form");
                          }}
                        >
                          <PlusIcon /> Tambah Pasien Baru
                        </button>
                      </>
                    ) : (
                      "Tidak ada pasien sesuai pencarian."
                    )}
                  </div>
                ) : (
                  filteredList.map((p) => {
                    const isAktif = activeProfile.id === p.id || (activeProfile.nama && activeProfile.nama === p.nama && activeProfile.bb === p.bb);
                    const isMale = p.jk === "male";
                    const isFemale = p.jk === "female";

                    let itemBg = "#FFFFFF";
                    let itemBorder = "#E2E8F0";

                    if (isMale) {
                      itemBg = isAktif ? "#EBF5FF" : "#F0F7FF";
                      itemBorder = isAktif ? "#10B981" : "#DBEAFE";
                    } else if (isFemale) {
                      itemBg = isAktif ? "#FDF2F8" : "#FFF5F7";
                      itemBorder = isAktif ? "#10B981" : "#FCE7F3";
                    } else if (isAktif) {
                      itemBg = "#F0FDF4";
                      itemBorder = "#10B981";
                    }

                    return (
                      <div
                        key={p.id || p.nama}
                        className={`tv-pas-card-item ${isMale ? "male" : isFemale ? "female" : "neutral"} ${isAktif ? "aktif" : ""}`}
                        style={{
                          backgroundColor: itemBg,
                          borderColor: itemBorder,
                          borderStyle: "solid",
                          borderWidth: "1.5px",
                          borderRadius: "14px",
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
                        }}
                      >
                        {/* Top Row: Name & Active Badge */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <GenderAvatar jk={p.jk} size={24} />
                            <div>
                              <div className="tv-pas-item-name" style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                                {p.nama || "An. Tanpa Nama"}
                              </div>
                              <div className="tv-pas-item-sub" style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "2px" }}>
                                {p.jk === "male" ? "Laki-laki" : p.jk === "female" ? "Perempuan" : "Anak"}
                                {p.noRm && ` • RM: ${p.noRm}`}
                              </div>
                            </div>
                          </div>

                          {isAktif && (
                            <span className="tv-pas-item-active-pill" style={{ fontSize: "0.7rem", fontWeight: 700, background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC", padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                              ● Aktif
                            </span>
                          )}
                        </div>

                        {/* Vitals Pills Row */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}>
                          <span className="tv-pas-vital-pill" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                            BB: <b>{p.bb != null ? `${p.bb} kg` : "-"}</b>
                          </span>
                          <span className="tv-pas-vital-pill" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                            Usia: <b>{formatUsiaPasien(p.usiaBulan)}</b>
                          </span>
                          {p.tb != null && (
                            <span className="tv-pas-vital-pill" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                              TB: <b>{p.tb} cm</b>
                            </span>
                          )}
                        </div>

                        {/* Catatan if any */}
                        {p.catatan && (
                          <div className="tv-pas-note-box" style={{ fontSize: "0.75rem", color: "#475467", background: "rgba(255,255,255,0.7)", border: "1px solid #E2E8F0", padding: "4px 8px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <NoteIcon /> {p.catatan}
                          </div>
                        )}

                        {/* Action Row */}
                        <div className="tv-pas-card-action-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid rgba(226, 232, 240, 0.7)", marginTop: "2px" }}>
                          {isAktif ? (
                            <span className="tv-pas-connected-text" style={{ fontSize: "0.75rem", color: "#15803D", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                              <LinkConnectedIcon /> Terhubung di kalkulator
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="tv-pas-use-btn"
                              style={{
                                background: "#0F766E",
                                color: "#FFFFFF",
                                border: "none",
                                fontWeight: 700,
                                padding: "5px 12px",
                                borderRadius: "8px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                              onClick={() => handleSwitchItem(p)}
                            >
                              Gunakan Pasien
                            </button>
                          )}

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
                            <button
                              type="button"
                              className="tv-pas-edit-btn"
                              style={{
                                background: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                color: "#334155",
                                fontWeight: 600,
                                padding: "4px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                              }}
                              onClick={() => handleEditItem(p)}
                            >
                              Edit
                            </button>

                            {confirmDeleteId === p.id ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <button
                                  type="button"
                                  className="tv-pas-del-confirm-btn"
                                  style={{
                                    background: "#DC2626",
                                    color: "#FFFFFF",
                                    border: "none",
                                    fontWeight: 700,
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                  }}
                                  onClick={() => {
                                    if (p.id) handleHapusItem(p.id, p.nama);
                                  }}
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  type="button"
                                  className="tv-pas-del-cancel-btn"
                                  style={{
                                    background: "#F1F5F9",
                                    color: "#475467",
                                    border: "1px solid #CBD5E1",
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                  }}
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="tv-pas-del-btn"
                                style={{
                                  background: "#FEF2F2",
                                  color: "#991B1B",
                                  border: "1px solid #FCA5A5",
                                  fontWeight: 600,
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.75rem",
                                }}
                                onClick={() => setConfirmDeleteId(p.id || null)}
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* TAB 2: FORM TAMBAH / EDIT */}
          {tab === "form" && (
            <div className="tv-stack" style={{ gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="tv-pas-f">
                  <label>Nama / Inisial Pasien *</label>
                  <input
                    type="text"
                    placeholder="cth: An. Budi"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>

                <div className="tv-pas-f">
                  <label>No. RM / Kamar / Bed</label>
                  <input
                    type="text"
                    placeholder="cth: RM-49201 / Bed 3B"
                    value={noRm}
                    onChange={(e) => setNoRm(e.target.value)}
                  />
                </div>
              </div>

              <div className="tv-pas-f">
                <label>Jenis Kelamin</label>
                <div className="tv-jk">
                  <button
                    type="button"
                    className={jk === "male" ? "tv-jk-btn aktif" : "tv-jk-btn"}
                    onClick={() => setJk("male")}
                  >
                    <MaleIcon size={18} /> Laki-laki
                  </button>
                  <button
                    type="button"
                    className={jk === "female" ? "tv-jk-btn aktif" : "tv-jk-btn"}
                    onClick={() => setJk("female")}
                  >
                    <FemaleIcon size={18} /> Perempuan
                  </button>
                </div>
              </div>

              <div className="tv-pas-row">
                <div className="tv-pas-f">
                  <label>Usia (tahun)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                    value={thn}
                    onChange={(e) => setThn(e.target.value)}
                  />
                </div>
                <div className="tv-pas-f">
                  <label>+ bulan</label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    step={1}
                    placeholder="0"
                    value={bln}
                    onChange={(e) => setBln(e.target.value)}
                  />
                </div>
              </div>

              <div className="tv-pas-row">
                <div className="tv-pas-f">
                  <label>Berat (kg)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="cth: 12.5"
                    value={bb}
                    onChange={(e) => setBb(e.target.value)}
                  />
                </div>
                <div className="tv-pas-f">
                  <label>Tinggi (cm)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="opsional"
                    value={tb}
                    onChange={(e) => setTb(e.target.value)}
                  />
                </div>
              </div>

              <div className="tv-pas-f">
                <label>Catatan Klinis / Dx Singkat (Opsional)</label>
                <input
                  type="text"
                  placeholder="cth: Kamar 302 - Bronkopneumonia"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>

              {valAlerts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "4px 0" }}>
                  {valAlerts.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: alt.level === "error" ? "#FEF2F2" : "#FFFBEB",
                        border: `1px solid ${alt.level === "error" ? "#FCA5A5" : "#FDE68A"}`,
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.82rem",
                        color: alt.level === "error" ? "#991B1B" : "#B45309",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <WarnIcon /> <span>{alt.title}</span>
                      </div>
                      <div>{alt.message}</div>
                      {alt.suggestedValue && alt.suggestionLabel && (
                        <button
                          type="button"
                          style={{
                            alignSelf: "flex-start",
                            background: alt.level === "error" ? "#DC2626" : "#D97706",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 10px",
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            marginTop: "2px",
                          }}
                          onClick={() => {
                            if (alt.field === "bb") setBb(alt.suggestedValue!);
                            if (alt.field === "tb") setTb(alt.suggestedValue!);
                          }}
                        >
                          💡 {alt.suggestionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="tv-pas-act" style={{ flexDirection: "column", gap: "8px" }}>
                <button
                  type="button"
                  className="tv-pas-btn tv-pas-save"
                  onClick={() => simpan(true)}
                >
                  <SaveIcon /> Simpan &amp; Aktifkan Pasien
                </button>
                <button
                  type="button"
                  className="tv-pas-btn tv-pas-btn-secondary"
                  style={{ background: "#F2F4F7", color: "#344054" }}
                  onClick={() => simpan(false)}
                >
                  <PlusIcon /> Simpan Saja (Ke Daftar)
                </button>
                <button
                  type="button"
                  className="tv-pas-btn tv-pas-reset"
                  onClick={() => setTab("list")}
                >
                  Batal / Kembali
                </button>
              </div>
            </div>
          )}

          <p className="tv-pas-note" style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
            <LockIcon /> Seluruh daftar pasien tersimpan lokal (localStorage) di browser Anda, tidak dikirim ke server luar.
          </p>
        </div>
      </div>
    </>
  );
}

/**
 * Chip TopBar untuk menampilkan pasien aktif & membuka dialog/dropdown pasien dalam 1 klik dari Header.
 */
export function PatientTopBarChip() {
  const activeProfile = usePatientProfile();
  const patientList = usePatientList();
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(false);
    const fab = document.getElementById("tvPasienFab");
    if (fab) fab.click();
  };

  const handleSelectPatient = (p: PatientProfileType) => {
    pilihPasienAktif(p);
    setOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    pilihPasienAktif({});
    setOpen(false);
  };

  const hasActive = !!(activeProfile.nama || activeProfile.bb || activeProfile.usiaBulan);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".tv-pas-topchip-wrap")) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="tv-pas-topchip-wrap" style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        className="tv-pas-topchip"
        onClick={() => setOpen(!open)}
        title="Klik untuk switch pasien aktif atau kelola pasien bangsal"
      >
        <span className="tv-pas-topchip-ic" style={{ display: "inline-flex", alignItems: "center" }}>
          <GenderAvatar jk={hasActive ? activeProfile.jk : null} size={20} />
        </span>
        <span className="tv-pas-topchip-txt">
          {hasActive ? (
            <>
              <strong className="tv-pas-chip-nama">{activeProfile.nama || "Pasien Aktif"}</strong>
              {activeProfile.bb != null && ` • ${activeProfile.bb} kg`}
              {activeProfile.noRm && ` (${activeProfile.noRm})`}
            </>
          ) : (
            `Pilih Pasien ${patientList.length > 0 ? `(${patientList.length})` : ""}`
          )}
        </span>
        <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          className="tv-pas-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 9999,
            width: "300px",
            maxHeight: "420px",
            overflowY: "auto",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 12px 32px rgba(10,11,95,0.18), 0 2px 6px rgba(0,0,0,0.06)",
            border: "1.5px solid #E2E8F0",
            padding: "8px",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              padding: "8px 10px 10px",
              borderBottom: "1px solid #F1F5F9",
              marginBottom: "6px",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
              <PatientHeaderIcon /> Pasien Bangsal / Poliklinik
            </div>
            {hasActive ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                <div>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A" }}>
                    {activeProfile.nama || "An. Tanpa Nama"}
                  </span>
                  <div style={{ fontSize: "0.75rem", color: "#475467" }}>
                    BB: <b>{activeProfile.bb != null ? `${activeProfile.bb} kg` : "-"}</b> • Usia: <b>{formatUsiaPasien(activeProfile.usiaBulan)}</b>
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FCA5A5",
                    color: "#991B1B",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={handleReset}
                >
                  Kosongkan
                </button>
              </div>
            ) : (
              <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "3px" }}>
                Pilih pasien dari daftar tersimpan di bawah untuk mengisi otomatis seluruh alat klinis:
              </div>
            )}
          </div>

          {/* Quick List of Saved Patients */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {patientList.length === 0 ? (
              <div style={{ padding: "12px", textAlign: "center", fontSize: "0.8rem", color: "#64748B" }}>
                Belum ada pasien tersimpan.<br />
                Simpan daftar pasien bangsal Anda untuk switch 1-klik!
              </div>
            ) : (
              patientList.map((p) => {
                const isAktif =
                  activeProfile.id === p.id ||
                  (activeProfile.nama && activeProfile.nama === p.nama && activeProfile.bb === p.bb);
                const isMale = p.jk === "male";
                const isFemale = p.jk === "female";

                let dropBg = "#FFFFFF";
                let dropBorder = "#F1F5F9";

                if (isMale) {
                  dropBg = isAktif ? "#EBF5FF" : "#F0F7FF";
                  dropBorder = isAktif ? "#10B981" : "#DBEAFE";
                } else if (isFemale) {
                  dropBg = isAktif ? "#FDF2F8" : "#FFF5F7";
                  dropBorder = isAktif ? "#10B981" : "#FCE7F3";
                } else if (isAktif) {
                  dropBg = "#F0FDF4";
                  dropBorder = "#10B981";
                }

                return (
                  <div
                    key={p.id || p.nama}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      border: `1.5px solid ${dropBorder}`,
                      background: dropBg,
                      gap: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onClick={() => handleSelectPatient(p)}
                    >
                      <GenderAvatar jk={p.jk} size={20} />
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                          {p.nama || "An. Tanpa Nama"}
                        </div>
                        <div style={{ fontSize: "0.73rem", color: "#64748B", marginTop: "1px" }}>
                          {p.jk === "male" ? "Laki-laki" : p.jk === "female" ? "Perempuan" : "Anak"}
                          {p.noRm && ` • ${p.noRm}`}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#334155", marginTop: "2px" }}>
                          BB: <b>{p.bb != null ? `${p.bb} kg` : "-"}</b> • Usia: <b>{formatUsiaPasien(p.usiaBulan)}</b>
                        </div>
                      </div>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {isAktif && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 6px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                          ● Aktif
                        </span>
                      )}
                      <button
                        type="button"
                        title="Hapus pasien dari daftar"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #FECDCA",
                          color: "#B42318",
                          fontSize: "0.75rem",
                          padding: "3px 6px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          lineHeight: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.id) {
                            hapusPasienFromList(p.id);
                          }
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          <div style={{ borderTop: "1px solid #F1F5F9", marginTop: "6px", paddingTop: "6px" }}>
            <button
              type="button"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid #CBD5E1",
                background: "#F8FAFC",
                color: "#0F172A",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
              onClick={handleOpenModal}
            >
              <PlusIcon /> Kelola / Tambah Pasien Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

