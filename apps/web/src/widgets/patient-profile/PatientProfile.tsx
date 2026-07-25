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
} from "@/shared/lib/patient";

type Jk = "male" | "female" | null;

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

  const bbN = num(bb);
  const t2 = num(thn);
  const b2 = num(bln);
  const ubN = t2 != null || b2 != null ? (t2 || 0) * 12 + (b2 || 0) : null;
  const warn: string[] = [];
  if (bbN != null && (bbN <= 0 || bbN > 150))
    warn.push("Berat badan tampak tidak wajar untuk pasien anak.");
  if (ubN != null && ubN > 216) warn.push("Usia melebihi 18 tahun — periksa kembali.");

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
        {"\uD83D\uDC64"}
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
          <div style={{ marginBottom: "14px", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
              <h3 style={{ margin: 0, fontFamily: "'Fredoka', sans-serif", color: "#1B2A6B", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "6px" }}>
                {"\uD83D\uDC64"} Pasien Bangsal &amp; Poliklinik
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* 2 Tombol Tab Navigation sejajar dengan tombol silang */}
                <div className="tv-pas-tabs" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={tab === "list" ? "tv-pas-tab-btn aktif" : "tv-pas-tab-btn"}
                    onClick={() => setTab("list")}
                  >
                    👥 Pasien Tersimpan ({patientList.length})
                  </button>

                  <button
                    type="button"
                    className={tab === "form" ? "tv-pas-tab-btn aktif" : "tv-pas-tab-btn"}
                    onClick={() => {
                      muatFormDariPasien(null);
                      setTab("form");
                    }}
                  >
                    ➕ {editingId ? "Edit" : "Tambah Pasien"}
                  </button>
                </div>

                <button
                  type="button"
                  className="tv-pas-btn tv-pas-reset"
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

            <p className="tv-pas-sub" style={{ margin: 0 }}>
              Kelola banyak pasien, switch pasien aktif 1-klik untuk semua alat klinis.
            </p>
          </div>

          {toastMsg && (
            <div
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
              }}
            >
              ✓ {toastMsg}
            </div>
          )}

          {/* TAB 1: LIST PASIEN */}
          {tab === "list" && (
            <>
              {/* Active Patient Highlight Banner */}
              {activeProfile.nama || activeProfile.bb || activeProfile.usiaBulan ? (
                <div
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
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: "999px" }}>
                        ● Pasien Aktif
                      </span>
                      <strong style={{ fontSize: "0.92rem", color: "#0F172A" }}>
                        {activeProfile.nama || "An. Tanpa Nama"}{" "}
                        {activeProfile.noRm ? `(${activeProfile.noRm})` : ""}
                      </strong>
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#475467", marginTop: "3px" }}>
                      {activeProfile.jk === "male" ? "Laki-laki" : activeProfile.jk === "female" ? "Perempuan" : "-"} • BB: <b>{activeProfile.bb != null ? `${activeProfile.bb} kg` : "-"}</b> • Usia: <b>{formatUsiaPasien(activeProfile.usiaBulan)}</b>
                      {activeProfile.tb != null && ` • TB: ${activeProfile.tb} cm`}
                    </div>
                  </div>
                  <button
                    type="button"
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
                        <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>🏥</div>
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
                          + Tambah Pasien Baru
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
                            <span style={{ fontSize: "1.2rem" }}>
                              {p.jk === "male" ? "👦" : p.jk === "female" ? "👧" : "👶"}
                            </span>
                            <div>
                              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                                {p.nama || "An. Tanpa Nama"}
                              </div>
                              <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: "2px" }}>
                                {p.jk === "male" ? "Laki-laki" : p.jk === "female" ? "Perempuan" : "Anak"}
                                {p.noRm && ` • RM: ${p.noRm}`}
                              </div>
                            </div>
                          </div>

                          {isAktif && (
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#DCFCE7", color: "#15803D", border: "1px solid #86EFAC", padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                              ● Aktif
                            </span>
                          )}
                        </div>

                        {/* Vitals Pills Row */}
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}>
                          <span style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                            BB: <b>{p.bb != null ? `${p.bb} kg` : "-"}</b>
                          </span>
                          <span style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                            Usia: <b>{formatUsiaPasien(p.usiaBulan)}</b>
                          </span>
                          {p.tb != null && (
                            <span style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "3px 8px", borderRadius: "6px", color: "#334155" }}>
                              TB: <b>{p.tb} cm</b>
                            </span>
                          )}
                        </div>

                        {/* Catatan if any */}
                        {p.catatan && (
                          <div style={{ fontSize: "0.75rem", color: "#475467", background: "rgba(255,255,255,0.7)", border: "1px solid #E2E8F0", padding: "4px 8px", borderRadius: "6px" }}>
                            📝 {p.catatan}
                          </div>
                        )}

                        {/* Action Row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid rgba(226, 232, 240, 0.7)", marginTop: "2px" }}>
                          {isAktif ? (
                            <span style={{ fontSize: "0.75rem", color: "#15803D", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                              ✓ Terhubung di kalkulator
                            </span>
                          ) : (
                            <button
                              type="button"
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
                    {"\uD83D\uDC66"} Laki-laki
                  </button>
                  <button
                    type="button"
                    className={jk === "female" ? "tv-jk-btn aktif" : "tv-jk-btn"}
                    onClick={() => setJk("female")}
                  >
                    {"\uD83D\uDC67"} Perempuan
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

              {warn.length > 0 && (
                <div className="tv-safety warn">
                  <b>⚠️ Periksa data</b>
                  {warn.map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </div>
              )}

              <div className="tv-pas-act" style={{ flexDirection: "column", gap: "8px" }}>
                <button
                  type="button"
                  className="tv-pas-btn tv-pas-save"
                  onClick={() => simpan(true)}
                >
                  💾 Simpan &amp; Aktifkan Pasien
                </button>
                <button
                  type="button"
                  className="tv-pas-btn"
                  style={{ background: "#F2F4F7", color: "#344054" }}
                  onClick={() => simpan(false)}
                >
                  ➕ Simpan Saja (Ke Daftar)
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

          <p className="tv-pas-note" style={{ marginTop: "14px" }}>
            🔒 Seluruh daftar pasien tersimpan lokal (localStorage) di browser Anda, tidak dikirim ke server luar.
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
        <span className="tv-pas-topchip-ic">
          {hasActive
            ? activeProfile.jk === "female"
              ? "👧"
              : "👦"
            : "👶"}
        </span>
        <span className="tv-pas-topchip-txt">
          {hasActive ? (
            <>
              <strong>{activeProfile.nama || "Pasien Aktif"}</strong>
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
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🏥 Pasien Bangsal / Poliklinik
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
                      <span style={{ fontSize: "1.1rem" }}>
                        {p.jk === "female" ? "👧" : p.jk === "male" ? "👦" : "👶"}
                      </span>
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
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.id) {
                            hapusPasienFromList(p.id);
                          }
                        }}
                      >
                        🗑️
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
              ➕ Kelola / Tambah Pasien Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

