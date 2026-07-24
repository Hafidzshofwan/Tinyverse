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
          <div className="tv-pas-head-row">
            <div>
              <h3>{"\uD83D\uDC64"} Pasien Bangsal &amp; Poliklinik</h3>
              <p className="tv-pas-sub">
                Kelola banyak pasien, switch pasien aktif 1-klik untuk semua alat klinis.
              </p>
            </div>
            <button
              type="button"
              className="tv-pas-btn tv-pas-reset"
              style={{ padding: "4px 10px", fontSize: "1rem" }}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
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

          {/* Navigation Tabs */}
          <div className="tv-pas-tabs">
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
              ➕ {editingId ? "Edit Pasien" : "Tambah Pasien"}
            </button>
          </div>

          {/* TAB 1: LIST PASIEN */}
          {tab === "list" && (
            <>
              {/* Active Patient Highlight Banner */}
              {activeProfile.nama || activeProfile.bb || activeProfile.usiaBulan ? (
                <div className="tv-pas-active-banner">
                  <div className="tv-pas-active-info">
                    <span className="tv-pas-active-tag">🟢 Pasien Aktif Sekarang</span>
                    <strong style={{ fontSize: "1.02rem", color: "#0A0B4F", marginTop: "2px" }}>
                      {activeProfile.nama || "An. Tanpa Nama"}{" "}
                      {activeProfile.noRm ? `(${activeProfile.noRm})` : ""}
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "#475467", marginTop: "2px" }}>
                      {activeProfile.jk === "male" ? "👦 Laki-laki" : activeProfile.jk === "female" ? "👧 Perempuan" : "👶"}{" "}
                      • BB: <b>{activeProfile.bb != null ? `${activeProfile.bb} kg` : "-"}</b> • Usia:{" "}
                      <b>{formatUsiaPasien(activeProfile.usiaBulan)}</b>
                      {activeProfile.tb != null && ` • TB: ${activeProfile.tb} cm`}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="tv-pas-btn-sm tv-pas-btn-del"
                    title="Kosongkan Pasien Aktif"
                    onClick={resetActive}
                  >
                    Kosongkan
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: "#FFFAEB",
                    border: "1px solid #FEDF89",
                    color: "#B54708",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    marginBottom: "12px",
                  }}
                >
                  ℹ️ Belum ada pasien aktif terpilih. Klik <b&quot;Pilih &amp; Aktifkan&quot;</b> di daftar bawah untuk mengisi otomatis seluruh kalkulator.
                </div>
              )}

              {patientList.length > 0 && (
                <input
                  type="text"
                  className="tv-pas-search"
                  placeholder="🔍 Cari nama, No. RM, atau kamar/catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}

              <div className="tv-pas-list">
                {filteredList.length === 0 ? (
                  <div className="tv-kosong">
                    {patientList.length === 0 ? (
                      <>
                        <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🏥</div>
                        <b>Daftar Pasien Kosong</b>
                        <p style={{ margin: "4px 0 12px", fontSize: "0.82rem" }}>
                          Simpan 10-15 pasien bangsal untuk berpindah dosis &amp; cairan secara instan.
                        </p>
                        <button
                          type="button"
                          className="tv-pas-btn tv-pas-save"
                          onClick={() => {
                            muatFormDariPasien(null);
                            setTab("form");
                          }}
                        >
                          ➕ Tambah Pasien Pertama
                        </button>
                      </>
                    ) : (
                      "Tidak ada pasien sesuai pencarian."
                    )}
                  </div>
                ) : (
                  filteredList.map((p) => {
                    const isAktif = activeProfile.id === p.id || (activeProfile.nama && activeProfile.nama === p.nama && activeProfile.bb === p.bb);
                    return (
                      <div
                        key={p.id || p.nama}
                        className={`tv-pas-item ${isAktif ? "is-active" : ""}`}
                      >
                        <div className="tv-pas-item-top">
                          <div>
                            <span className="tv-pas-item-nama">
                              {p.jk === "male" ? "👦 " : p.jk === "female" ? "👧 " : "👶 "}
                              {p.nama || "An. Tanpa Nama"}
                            </span>
                            {p.noRm && <span className="tv-pas-item-rm" style={{ marginLeft: "8px" }}>{p.noRm}</span>}
                          </div>
                          {isAktif && (
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                background: "#D1E9FF",
                                color: "#1570EF",
                                padding: "2px 8px",
                                borderRadius: "999px",
                              }}
                            >
                              ✓ Aktif
                            </span>
                          )}
                        </div>

                        <div className="tv-pas-vitals">
                          <span className="tv-pas-vital-pill">⚖️ {p.bb != null ? `${p.bb} kg` : "BB -"}</span>
                          <span className="tv-pas-vital-pill">🎂 {formatUsiaPasien(p.usiaBulan)}</span>
                          {p.tb != null && <span className="tv-pas-vital-pill">📏 {p.tb} cm</span>}
                          {p.catatan && <span className="tv-pas-vital-pill">📝 {p.catatan}</span>}
                        </div>

                        <div className="tv-pas-item-actions">
                          {!isAktif ? (
                            <button
                              type="button"
                              className="tv-pas-btn-sm tv-pas-btn-switch"
                              onClick={() => handleSwitchItem(p)}
                            >
                              ⚡ Pilih &amp; Aktifkan
                            </button>
                          ) : (
                            <span style={{ fontSize: "0.76rem", color: "#175CD3", fontWeight: 600, marginRight: "auto" }}>
                              Tersinkron di semua alat
                            </span>
                          )}

                          <button
                            type="button"
                            className="tv-pas-btn-sm tv-pas-btn-edit"
                            onClick={() => handleEditItem(p)}
                          >
                            ✏️ Edit
                          </button>

                          {confirmDeleteId === p.id ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <button
                                type="button"
                                className="tv-pas-btn-sm"
                                style={{
                                  background: "#D92D20",
                                  color: "#ffffff",
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
                                ✓ Ya, Hapus
                              </button>
                              <button
                                type="button"
                                className="tv-pas-btn-sm"
                                style={{
                                  background: "#F2F4F7",
                                  color: "#344054",
                                  border: "1px solid #D0D5DD",
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
                              className="tv-pas-btn-sm tv-pas-btn-del"
                              title="Hapus pasien dari daftar"
                              style={{
                                background: "#FEF2F2",
                                color: "#B42318",
                                border: "1px solid #FECDCA",
                                fontWeight: 600,
                                padding: "4px 8px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                              }}
                              onClick={() => setConfirmDeleteId(p.id || null)}
                            >
                              🗑️ Hapus
                            </button>
                          )}
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
                return (
                  <div
                    key={p.id || p.nama}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: "10px",
                      border: isAktif ? "1.5px solid #93C5FD" : "1px solid #F1F5F9",
                      background: isAktif ? "#EFF6FF" : "#FFFFFF",
                      gap: "6px",
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
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>
                          {p.nama || "An. Tanpa Nama"} {p.noRm ? `(${p.noRm})` : ""}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          BB: <b>{p.bb != null ? `${p.bb} kg` : "-"}</b> • Usia: <b>{formatUsiaPasien(p.usiaBulan)}</b>
                        </div>
                      </div>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {isAktif && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1D4ED8", background: "#DBEAFE", padding: "2px 6px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                          ✓ Aktif
                        </span>
                      )}
                      <button
                        type="button"
                        title="Hapus pasien dari daftar"
                        style={{
                          background: "#FEF2F2",
                          border: "1px solid #FCA5A5",
                          color: "#991B1B",
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

