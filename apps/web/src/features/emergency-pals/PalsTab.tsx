"use client";

import { useState } from "react";
import { computePals } from "@/entities/emergency";

interface PalsRow {
  label: string;
  note?: string;
  value: string;
}
interface PalsCat {
  cls: string;
  head: string;
  rows: PalsRow[];
}

export function PalsTab({
  bb,
  ub,
}: {
  bb: number | null;
  ub: number | null;
}) {
  const r = computePals({ bb, ub });
  // Semua kategori awalnya tertutup (seperti v17: kelas "tutup").
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  const cats: PalsCat[] = [
    {
      cls: "cat-obat",
      head: "💊 Obat Emergensi",
      rows: [
        {
          label: "Epinefrin (IV/IO)",
          note: "0,01 mg/kg · sediaan 1:10.000 (0,1 mL/kg) · ulang 3–5 mnt · maks 1 mg",
          value: r.epi,
        },
        {
          label: "Epinefrin (ET/via ETT)",
          note: "0,1 mg/kg · sediaan 1:1.000 (0,1 mL/kg) · HANYA bila akses IV/IO belum ada · bilas NaCl 0,9% lalu ventilasi · maks ±2,5 mg",
          value: r.epiET,
        },
      ],
    },
    {
      cls: "cat-listrik",
      head: "⚡ Energi Listrik",
      rows: [
        { label: "Defibrilasi", note: "2 J/kg → 4 J/kg", value: r.defib },
        {
          label: "Kardioversi",
          note: "0,5–1 J/kg → 2 J/kg",
          value: r.kardio,
        },
      ],
    },
    {
      cls: "cat-metabolik",
      head: "🍬 Koreksi Metabolik",
      rows: [
        {
          label: "Dextrose D10",
          note: "bayi/neonatus · 0,5 g/kg",
          value: r.d10,
        },
        {
          label: "Dextrose D25",
          note: "anak lebih besar · 0,5 g/kg",
          value: r.d25,
        },
      ],
    },
    {
      cls: "cat-napas",
      head: "🫁 Jalan Napas & Alat",
      rows: [
        { label: "ETT cuffed", note: "(usia/4)+3,5", value: r.ettC },
        { label: "ETT uncuffed", note: "(usia/4)+4", value: r.ettU },
        {
          label: "Kedalaman ETT",
          note: "≈ diameter ×3 (di bibir)",
          value: r.ettDepth,
        },
        { label: "Suction", note: "≈ diameter ×2", value: r.suction },
        { label: "Laryngoscope blade", value: r.blade },
      ],
    },
  ];

  return (
    <div className="drt-panel">
      <h3>💊 Dosis &amp; Alat (PALS)</h3>
      <p className="drt-sub">
        Otomatis dihitung dari Berat Badan &amp; usia pada Profil Pasien. Ketuk
        judul kategori untuk buka/tutup.
      </p>
      {!r.hasBb ? (
        <div className="pals-warn">
          ⚠️ Berat Badan belum terisi di Profil Pasien — sebagian nilai
          belum dapat dihitung.
        </div>
      ) : null}
      <div className="pals-grid">
        {cats.map((cat, i) => (
          <div
            key={cat.cls}
            className={"pals-cat " + cat.cls + (open[i] ? "" : " tutup")}
          >
            <div
              className="pals-cat-head"
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggle(i);
              }}
            >
              <span>{cat.head}</span>
              <span className="pals-cat-chevron">▾</span>
            </div>
            <div className="pals-cat-body">
              {cat.rows.map((row, j) => (
                <div className="pals-row" key={j}>
                  <span className="pals-label">
                    {row.label}
                    {row.note ? (
                      <span className="pals-note">{row.note}</span>
                    ) : null}
                  </span>
                  <span className="pals-val">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
