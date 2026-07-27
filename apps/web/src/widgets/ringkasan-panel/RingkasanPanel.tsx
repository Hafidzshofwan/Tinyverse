"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, ChangeEvent } from "react";
import {
  type RingkasanItem,
  type PasienRingkas,
  loadItems,
  removeItem,
  clearItems,
  loadPasienRingkas,
  savePasienRingkas,
  pasienFromProfil,
  buildRingkasanText,
  onRingkasanChange,
} from "@/shared/lib/ringkasan";
import { printSoapSummary } from "@/shared/lib/pdfExport";
import { KopSuratModal } from "@/shared/ui/KopSuratModal";

const wrapStyle: CSSProperties = { maxWidth: 860 };
const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 12,
};
const actionsRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 4,
};
const btnAuto: CSSProperties = { width: "auto" };
const itemCard: CSSProperties = {
  border: "1px solid var(--tv-line)",
  borderRadius: 12,
  padding: "12px 14px",
  background: "var(--tv-putih)",
};
const itemHead: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
};
const itemTitleStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: 14,
  color: "var(--tv-teks)",
};
const itemMeta: CSSProperties = {
  fontSize: 11.5,
  color: "var(--tv-soft-teks)",
  marginTop: 2,
};
const itemBody: CSSProperties = {
  whiteSpace: "pre-wrap",
  fontSize: 13.5,
  lineHeight: 1.55,
  marginTop: 8,
  color: "var(--tv-teks)",
};
const delBtn: CSSProperties = {
  flex: "0 0 auto",
  width: 28,
  height: 28,
  borderRadius: 8,
  border: "1px solid var(--tv-line)",
  background: "transparent",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  color: "var(--tv-soft-teks)",
};

export function RingkasanPanel() {
  const [items, setItems] = useState<RingkasanItem[]>([]);
  const [pasien, setPasien] = useState<PasienRingkas>({
    nama: "",
    noRm: "",
    usia: "",
    bbTb: "",
    catatan: "",
  });
  const [status, setStatus] = useState(
    "Ringkasan hanya menyimpan poin klinis utama tiap alat, bukan seluruh hitungan mentah.",
  );
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setPasien(loadPasienRingkas());
    setSiap(true);
    const off = onRingkasanChange(() => setItems(loadItems()));
    return off;
  }, []);

  useEffect(() => {
    if (!siap) return;
    savePasienRingkas(pasien);
  }, [pasien, siap]);

  const ubah =
    (k: keyof PasienRingkas) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setPasien((s) => ({ ...s, [k]: e.target.value }));

  const ambilProfil = useCallback(() => {
    const prof = pasienFromProfil();
    if (!prof.nama && !prof.usia && !prof.bbTb) {
      setStatus("Profil Pasien masih kosong. Isi lewat tombol Profil Pasien di atas.");
      return;
    }
    setPasien((s) => ({
      ...s,
      nama: prof.nama || s.nama,
      usia: prof.usia || s.usia,
      bbTb: prof.bbTb || s.bbTb,
    }));
    setStatus("Data pasien disinkron dari Profil Pasien.");
  }, []);

  const hapus = (id: string) => {
    setItems(removeItem(id));
    setStatus("Item dihapus.");
  };

  const bersihkan = () => {
    if (!items.length) return;
    if (!window.confirm("Hapus semua item ringkasan?")) return;
    clearItems();
    setItems([]);
    setStatus("Semua item ringkasan dihapus.");
  };

  const salin = async () => {
    const text = buildRingkasanText(pasien, items);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Ringkasan berhasil disalin.");
    } catch {
      setStatus("Clipboard tidak tersedia. Gunakan Export TXT.");
    }
  };

  const exportTxt = () => {
    const blob = new Blob([buildRingkasanText(pasien, items)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ringkasan-klinis-tinyverse-${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("File TXT ringkasan diunduh.");
  };

  const [kopModalOpen, setKopModalOpen] = useState(false);

  const cetak = () => {
    const rawText = buildRingkasanText(pasien, items);
    printSoapSummary({
      namaPasien: pasien.nama || "Anak",
      noRm: pasien.noRm || "-",
      umurBb: `${pasien.usia || "-"} / ${pasien.bbTb || "-"}`,
      rawText: rawText,
    });
    setStatus("Menyiapkan Cetak PDF ber-Kop Surat...");
  };

  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <div>
          <h2 className="tv-card-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#DBEAFE"/>
              <circle cx="12" cy="9" r="3.5" fill="#2563EB"/>
              <path d="M6 19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19" fill="#1D4ED8"/>
            </svg>
            Data Pasien
          </h2>
          <p className="tv-card-desc" style={{ margin: "4px 0 0" }}>
            Terisi otomatis dari Profil Pasien bila ada. Bisa disunting; tersimpan
            di perangkat ini (browser).
          </p>
        </div>
        <div style={gridStyle}>
          <div className="tv-field">
            <label htmlFor="rkNama">Nama / Inisial</label>
            <input id="rkNama" className="tv-input" value={pasien.nama} onChange={ubah("nama")} placeholder="cth: An. A" />
          </div>
          <div className="tv-field">
            <label htmlFor="rkRm">No. RM / ID</label>
            <input id="rkRm" className="tv-input" value={pasien.noRm} onChange={ubah("noRm")} placeholder="opsional" />
          </div>
          <div className="tv-field">
            <label htmlFor="rkUsia">Usia</label>
            <input id="rkUsia" className="tv-input" value={pasien.usia} onChange={ubah("usia")} placeholder="cth: 4 tahun 2 bulan" />
          </div>
          <div className="tv-field">
            <label htmlFor="rkBbTb">BB / TB</label>
            <input id="rkBbTb" className="tv-input" value={pasien.bbTb} onChange={ubah("bbTb")} placeholder="cth: 16 kg / 102 cm" />
          </div>
        </div>
        <div className="tv-field" style={{ marginBottom: 0 }}>
          <label htmlFor="rkCat">Catatan klinis singkat</label>
          <textarea id="rkCat" className="tv-input" value={pasien.catatan} onChange={ubah("catatan")} placeholder="cth: demam 2 hari, muntah, observasi intake-output..." style={{ minHeight: 84, resize: "vertical" }} />
        </div>
        <div style={actionsRow}>
          <button type="button" className="tv-rk-btn type-profil" onClick={ambilProfil}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.302 3 18.1884 4.77802 19.7212 7.4208" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M21 3V8H16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            Ambil dari Profil
          </button>
          <button type="button" className="tv-rk-btn type-salin" onClick={salin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="7" width="11" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M5 16H4C3.44772 16 3 15.5523 3 15V5C3 4.44772 3.44772 4 4 4H14C14.5523 4 15 4.44772 15 5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M11 11H16M11 14H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Salin
          </button>
          <button type="button" className="tv-rk-btn type-export" onClick={exportTxt}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 7V14M12 14L9 11M12 14L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Export TXT
          </button>
          <button type="button" className="tv-rk-btn type-cetak" onClick={cetak}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V4C6 3.44772 6.44772 3 7 3H17C17.5523 3 18 3.44772 18 4V9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
              <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="6" y="14" width="12" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 17H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Cetak PDF (Kop Surat)
          </button>
          <button type="button" className="tv-rk-btn type-kop" onClick={() => setKopModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
            </svg>
            Atur Kop Surat
          </button>
          <button type="button" className="tv-rk-btn type-hapus" onClick={bersihkan}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Bersihkan
          </button>
        </div>
        <p className="tv-card-desc" role="status" style={{ margin: 0 }}>{status}</p>
        <KopSuratModal isOpen={kopModalOpen} onClose={() => setKopModalOpen(false)} />
      </section>

      <section className="tv-card tv-stack" style={{ marginTop: 16 }}>
        <h2 className="tv-card-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#FCE7F3"/>
            <path d="M7 5H17C18.1 5 19 5.9 19 7V19L16.5 17.5L14 19L12 17.5L10 19L7.5 17.5L5 19V7C5 5.9 5.9 5 7 5Z" fill="#FFFFFF" stroke="#D936A6" strokeWidth="1.6"/>
            <path d="M8 9H16M8 12H14M8 15H11" stroke="#9333EA" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Daftar Hasil
        </h2>
        {items.length === 0 ? (
          <div className="tv-kosong">
            Belum ada hasil. Setelah menghitung di alat mana pun (Dosis, Cairan,
            Skoring, dan lainnya), klik <strong>“Tambahkan ke Ringkasan”</strong>
            pada hasilnya. Hanya poin klinis utama yang disimpan di sini.
          </div>
        ) : (
          <div className="tv-stack">
            {items.map((it) => (
              <div key={it.id} style={itemCard}>
                <div style={itemHead}>
                  <div>
                    <div style={itemTitleStyle}>{it.title}</div>
                    <div style={itemMeta}>
                      {it.source ? `${it.source} · ` : ""}
                      {it.time}
                    </div>
                  </div>
                  <button type="button" aria-label="Hapus item" style={delBtn} onClick={() => hapus(it.id)}>×</button>
                </div>
                <div style={itemBody}>{it.body}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
