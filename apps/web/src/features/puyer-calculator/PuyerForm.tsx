"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { NumberField } from "@/shared/ui/NumberField";
import { ResultList } from "@/shared/ui/ResultList";
import type { ResultRow } from "@/shared/ui/ResultList";
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
  const [dosis, setDosis] = useState("");
  const [tablet, setTablet] = useState("");
  const [frekuensi, setFrekuensi] = useState("3");
  const [hari, setHari] = useState("5");

  const hasil = useMemo(() => {
    const d = toNum(dosis);
    const t = toNum(tablet);
    const f = toNum(frekuensi);
    const h = toNum(hari);
    if ([d, t, f, h].some((v) => Number.isNaN(v))) {
      return {
        rows: [] as ResultRow[],
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
      return { rows, error: null as string | null, peringatan: r.peringatan };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Input tidak valid.";
      return { rows: [] as ResultRow[], error: msg, peringatan: [] as string[] };
    }
  }, [dosis, tablet, frekuensi, hari]);

  return (
    <div className="tv-stack">
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
      {hasil.peringatan.length > 0 && !hasil.error ? (
        <div className="tv-warn">
          {hasil.peringatan.map((w) => (
            <p key={w}>
              <span aria-hidden>{"\u26A0\uFE0F"}</span> {w}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
