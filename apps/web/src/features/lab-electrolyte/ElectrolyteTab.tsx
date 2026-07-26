"use client";

import { useState } from "react";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { NumberField } from "@/shared/ui";
import { correctCalcium, correctPotassium, correctSodium } from "@/entities/lab";
import type { DxLine } from "@/entities/lab";
import { addRingkasanItem } from "@/shared/lib/ringkasan";

function num(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return isFinite(n) ? n : null;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function Hasil({ r, title }: { r: DxLine | null; title: string }) {
  const [ditambahkan, setDitambahkan] = useState(false);
  if (!r) return null;
  return (
    <>
      <div
        className={"dx-res " + r.cls}
        dangerouslySetInnerHTML={{ __html: r.html }}
      />
      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          className="tv-btn"
          style={{ background: "#0A0B5F", color: "#FFFFFF", fontWeight: 700 }}
          onClick={() => {
            addRingkasanItem({
              title,
              source: "Koreksi Elektrolit",
              body: stripTags(r.html),
            });
            setDitambahkan(true);
            setTimeout(() => setDitambahkan(false), 2200);
          }}
        >
          {ditambahkan ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Ditambahkan ke Ringkasan!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}>
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Tambahkan ke Ringkasan
            </>
          )}
        </button>
      </div>
    </>
  );
}

export function ElectrolyteTab() {
  const profile = usePatientProfile();
  const [naBB, setNaBB] = useSyncedField(profile.bb);
  const [kBB, setKBB] = useSyncedField(profile.bb);
  const [caBB, setCaBB] = useSyncedField(profile.bb);

  const [na, setNa] = useState("");
  const [naTg, setNaTg] = useState("");
  const [k, setK] = useState("");
  const [ca, setCa] = useState("");
  const [alb, setAlb] = useState("");

  const [rNa, setRNa] = useState<DxLine | null>(null);
  const [rK, setRK] = useState<DxLine | null>(null);
  const [rCa, setRCa] = useState<DxLine | null>(null);

  return (
    <>
      <div className="kartu">
        <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#2563EB" }}>
            <circle cx="12" cy="12" r="9"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
          Koreksi Natrium
        </div>
        <NumberField
          label="Berat badan (kg)"
          value={naBB}
          onValueChange={setNaBB}
          placeholder="mis. 12"
        />
        <NumberField
          label="Natrium aktual (mmol/L)"
          value={na}
          onValueChange={setNa}
          placeholder="mis. 128"
          step={1}
        />
        <NumberField
          label="Target Na (mmol/L, opsional)"
          value={naTg}
          onValueChange={setNaTg}
          placeholder="default 135"
          step={1}
        />
        <button
          type="button"
          className="btn-hitung"
          onClick={() => setRNa(correctSodium(num(naBB), num(na), num(naTg)))}
        >
          Hitung Koreksi Na
        </button>
        <Hasil r={rNa} title={`Koreksi Natrium (Na ${na} mmol/L)`} />
      </div>

      <div className="kartu">
        <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#EAB308" }}>
            <path d="M12 2v20"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Koreksi Kalium
        </div>
        <NumberField
          label="Berat badan (kg)"
          value={kBB}
          onValueChange={setKBB}
          placeholder="mis. 12"
        />
        <NumberField
          label="Kalium aktual (mmol/L)"
          value={k}
          onValueChange={setK}
          placeholder="mis. 3.0"
        />
        <button
          type="button"
          className="btn-hitung"
          onClick={() => setRK(correctPotassium(num(kBB), num(k)))}
        >
          Hitung Koreksi K
        </button>
        <Hasil r={rK} title={`Koreksi Kalium (K ${k} mmol/L)`} />
      </div>

      <div className="kartu">
        <div className="dx-sub-h" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6366F1" }}>
            <path d="M17 10c.7-.7 1.69-1 2.5-1a2.5 2.5 0 1 1 0 5c-.81 0-1.8-.3-2.5-1l-10 0c-.7.7-1.69 1-2.5 1a2.5 2.5 0 1 1 0-5c.81 0 1.8.3 2.5 1z"/>
          </svg>
          Koreksi Kalsium
        </div>
        <NumberField
          label="Berat badan (kg, opsional)"
          value={caBB}
          onValueChange={setCaBB}
          placeholder="mis. 12"
        />
        <NumberField
          label="Kalsium total (mg/dL)"
          value={ca}
          onValueChange={setCa}
          placeholder="mis. 7.8"
        />
        <NumberField
          label="Albumin (g/dL, opsional)"
          value={alb}
          onValueChange={setAlb}
          placeholder="untuk koreksi"
        />
        <button
          type="button"
          className="btn-hitung"
          onClick={() => setRCa(correctCalcium(num(ca), num(alb), num(caBB)))}
        >
          Hitung Koreksi Ca
        </button>
        <Hasil r={rCa} title={`Koreksi Kalsium (Ca ${ca} mg/dL)`} />
      </div>
    </>
  );
}
