"use client";

import { useEffect, useState } from "react";
import { usePatientProfile } from "@/shared/lib/patient";
import { NumberField } from "@/shared/ui";
import { BANDS, bandFromMonths, interpretCbc } from "@/entities/lab";
import type { BandId, DxLine } from "@/entities/lab";

function num(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return isFinite(n) ? n : null;
}

export function BloodTab() {
  const profile = usePatientProfile();
  const profBand = bandFromMonths(profile.usiaBulan);
  const [band, setBand] = useState<BandId>(profBand ?? "anak");
  useEffect(() => {
    if (profBand) setBand(profBand);
  }, [profBand]);

  const [hb, setHb] = useState("");
  const [mcv, setMcv] = useState("");
  const [leuko, setLeuko] = useState("");
  const [trombo, setTrombo] = useState("");
  const [lines, setLines] = useState<DxLine[] | null>(null);

  function hitung() {
    setLines(interpretCbc(band, num(hb), num(mcv), num(leuko), num(trombo)));
  }

  return (
    <div className="kartu">
      <div className="form-group">
        <label>Kelompok usia</label>
        <select value={band} onChange={(e) => setBand(e.target.value as BandId)}>
          {BANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
      <NumberField
        label="Hemoglobin (g/dL)"
        value={hb}
        onValueChange={setHb}
        placeholder="mis. 11.2"
      />
      <NumberField
        label="MCV (fL)"
        value={mcv}
        onValueChange={setMcv}
        placeholder="opsional"
      />
      <NumberField
        label="Leukosit (×10³/µL)"
        value={leuko}
        onValueChange={setLeuko}
        placeholder="opsional"
      />
      <NumberField
        label="Trombosit (×10³/µL)"
        value={trombo}
        onValueChange={setTrombo}
        placeholder="opsional"
        step={1}
      />
      <button type="button" className="btn-hitung" onClick={hitung}>
        Interpretasi
      </button>
      {lines ? (
        lines.length ? (
          lines.map((l, i) => (
            <div
              key={i}
              className={"dx-res " + l.cls}
              dangerouslySetInnerHTML={{ __html: l.html }}
            />
          ))
        ) : (
          <div className="dx-res dx-neutral">Isi minimal Hemoglobin.</div>
        )
      ) : null}
    </div>
  );
}
