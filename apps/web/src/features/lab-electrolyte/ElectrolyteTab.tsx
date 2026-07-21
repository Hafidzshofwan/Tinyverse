"use client";

import { useState } from "react";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { NumberField } from "@/shared/ui";
import { correctCalcium, correctPotassium, correctSodium } from "@/entities/lab";
import type { DxLine } from "@/entities/lab";

function num(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return isFinite(n) ? n : null;
}

function Hasil({ r }: { r: DxLine | null }) {
  if (!r) return null;
  return (
    <div
      className={"dx-res " + r.cls}
      dangerouslySetInnerHTML={{ __html: r.html }}
    />
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
        <div className="dx-sub-h">🧂 Koreksi Natrium</div>
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
        <Hasil r={rNa} />
      </div>

      <div className="kartu">
        <div className="dx-sub-h">🍌 Koreksi Kalium</div>
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
        <Hasil r={rK} />
      </div>

      <div className="kartu">
        <div className="dx-sub-h">🦴 Koreksi Kalsium</div>
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
        <Hasil r={rCa} />
      </div>
    </>
  );
}
