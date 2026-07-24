"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui/NumberField";
import { ResultList } from "@/shared/ui/ResultList";
import type { ResultRow } from "@/shared/ui/ResultList";
import { usePatientProfile, formatUsiaPasien } from "@/shared/lib/patient";
import { printResepPuyer } from "@/shared/lib/pdfExport";
import { KopSuratModal } from "@/shared/ui/KopSuratModal";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import { hitungPuyer } from "./hitungPuyer";

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const toNum = (s: string): number => (s.trim() === "" ? NaN : Number(s));

const fmt = (n: number): string => {
  const s = Number.isInteger(n)
    ? String(n)
    : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return s.replace(".", ",");
};

export function PuyerForm() {
  const profile = usePatientProfile();
  const [namaObat, setNamaObat] = useState("Parasetamol");
  const [dosis, setDosis] = useState("");
  const [tablet, setTablet] = useState("");
  const [frekuensi, setFrekuensi] = useState("3");
  const [hari, setHari] = useState("5");
  const [kopModalOpen, setKopModalOpen] = useState(false);
  const [ditambahkan, setDitambahkan] = useState(false);

  const handleTambahRingkasan = () => {
    if (!hasil.rawResult) return;
    addRingkasanItem({
      title: `Racik Puyer — ${namaObat || "Obat"}`,
      source: "Racik Puyer",
      body: `Dosis: ${dosis} mg (Tablet: ${tablet} mg/tab)\nAturan: ${frekuensi}x/hari selama ${hari} hari\nHasil: ${fmt(hasil.rawResult.tabletPerBungkus)} tab/bungkus | Total: ${hasil.rawResult.totalBungkus} bungkus (${fmt(hasil.rawResult.totalTablet)} tab digerus)`,
    });
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2200);
  };

  const hasil = useMemo(() => {
    const d = toNum(dosis);
    const t = toNum(tablet);
    const f = toNum(frekuensi);
    const h = toNum(hari);
    if ([d, t, f, h].some((v) => Number.isNaN(v))) {
      return {
        rows: [] as ResultRow[],
        rawResult: null,
        error: null as string | null,
        peringatan: [] as string[],
      };
    }
    try {
      const r = hitungPuyer({
        dosisPerKaliMg: d,
        kekuatanTabletMg: t,
        frekuensiPerHari: f,
        jumlahHari: h,
      });
      const rows: ResultRow[] = [
        { label: "Tablet per bungkus", value: `${fmt(r.tabletPerBungkus)} tablet` },
        { label: "Jumlah bungkus", value: `${r.totalBungkus} bungkus` },
        { label: "Total tablet digerus", value: `${fmt(r.totalTablet)} tablet` },
      ];
      return { rows, rawResult: r, error: null as string | null, peringatan: r.peringatan };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Input tidak valid.";
      return { rows: [] as ResultRow[], rawResult: null, error: msg, peringatan: [] as string[] };
    }
  }, [dosis, tablet, frekuensi, hari]);

  const cetakResep = () => {
    if (!hasil.rawResult) return;
    printResepPuyer({
      namaPasien: profile.nama || "Anak",
      noRm: profile.noRm || "-",
      umur: profile.usiaBulan ? formatUsiaPasien(profile.usiaBulan) : "-",
      bbKg: profile.bb ? String(profile.bb) : "-",
      daftarPuyer: [
        {
          namaObat: namaObat || "Racikan Puyer",
          dosisPerKali: `${dosis} mg (Kekuatan tab: ${tablet} mg/tab)`,
          jumlahBungkus: `${hasil.rawResult.totalBungkus} puyer`,
          aturanPakai: `${frekuensi}x1 puyer sehari (selama ${hari} hari)`,
          catatan: `Butuh ${fmt(hasil.rawResult.totalTablet)} tablet digerus. ${fmt(hasil.rawResult.tabletPerBungkus)} tab/bungkus.`,
        },
      ],
      catatanFarmasi: "Puyer disimpan di tempat kering & terlindung dari cahaya matahari.",
    });
  };

  return (
    <div className="tv-stack">
      <div className="tv-field" style={{ marginBottom: 8 }}>
        <label htmlFor="puyerNamaObat">Nama / Jenis Obat Racikan</label>
        <input
          id="puyerNamaObat"
          className="tv-input"
          value={namaObat}
          onChange={(e) => setNamaObat(e.target.value)}
          placeholder="cth: Parasetamol / Ambroxol / CTM"
        />
      </div>

      <div style={gridStyle}>
        <NumberField
          label="Dosis per kali"
          value={dosis}
          onValueChange={setDosis}
          suffix="mg"
          placeholder="mis. 125"
        />
        <NumberField
          label="Kekuatan tablet"
          value={tablet}
          onValueChange={setTablet}
          suffix="mg/tab"
          placeholder="mis. 500"
        />
        <NumberField
          label="Frekuensi"
          value={frekuensi}
          onValueChange={setFrekuensi}
          suffix="x/hari"
          step={1}
        />
        <NumberField
          label="Lama pemberian"
          value={hari}
          onValueChange={setHari}
          suffix="hari"
          step={1}
        />
      </div>
      <ResultList rows={hasil.rows} error={hasil.error} />

      {hasil.rawResult && !hasil.error && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#059669", color: "#FFFFFF", fontWeight: 700 }}
            onClick={handleTambahRingkasan}
          >
            {ditambahkan ? "✓ Ditambahkan ke Ringkasan!" : "📄 Tambahkan ke Ringkasan"}
          </button>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#2563EB", color: "#FFFFFF", fontWeight: 700 }}
            onClick={cetakResep}
          >
            📄 Cetak Resep Puyer PDF
          </button>
          <button
            type="button"
            className="tv-btn"
            style={{ background: "#F1F5F9", color: "#334155" }}
            onClick={() => setKopModalOpen(true)}
          >
            ⚙️ Atur Kop Surat
          </button>
        </div>
      )}

      {hasil.peringatan.length > 0 && !hasil.error ? (
        <div className="tv-warn">
          {hasil.peringatan.map((w) => (
            <p key={w}>
              <span aria-hidden>{"\u26A0\uFE0F"}</span> {w}
            </p>
          ))}
        </div>
      ) : null}

      <KopSuratModal isOpen={kopModalOpen} onClose={() => setKopModalOpen(false)} />
    </div>
  );
}
