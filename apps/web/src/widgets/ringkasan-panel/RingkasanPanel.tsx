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

  const cetak = () => {
    const text = buildRingkasanText(pasien, items);
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) {
      setStatus("Popup diblokir. Izinkan popup untuk Print / PDF.");
      return;
    }
    const esc = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    w.document.write(
      `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Ringkasan Klinis Tinyverse</title><style>body{font-family:system-ui,Segoe UI,sans-serif;padding:28px;color:#111}h1{font-size:18px;margin:0 0 12px}pre{white-space:pre-wrap;font:13px/1.55 ui-monospace,Menlo,Consolas,monospace}</style></head><body><h1>Ringkasan Klinis Tinyverse</h1><pre>${esc}</pre></body></html>`,
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
    setStatus("Menyiapkan Print / PDF...");
  };

  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <div>
          <h2 className="tv-card-title" style={{ margin: 0 }}>
            👤 Data Pasien
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
          <button type="button" className="tv-btn" style={btnAuto} onClick={ambilProfil}>🔄 Ambil dari Profil</button>
          <button type="button" className="tv-btn" style={btnAuto} onClick={salin}>📋 Salin</button>
          <button type="button" className="tv-btn" style={btnAuto} onClick={exportTxt}>⬇️ Export TXT</button>
          <button type="button" className="tv-btn" style={btnAuto} onClick={cetak}>🖨️ Print / PDF</button>
          <button type="button" className="tv-btn" style={btnAuto} onClick={bersihkan}>🗑️ Bersihkan</button>
        </div>
        <p className="tv-card-desc" role="status" style={{ margin: 0 }}>{status}</p>
      </section>

      <section className="tv-card tv-stack" style={{ marginTop: 16 }}>
        <h2 className="tv-card-title" style={{ margin: 0 }}>🧾 Daftar Hasil</h2>
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
