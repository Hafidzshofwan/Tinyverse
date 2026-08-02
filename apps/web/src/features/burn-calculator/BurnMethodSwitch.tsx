"use client";

import { useState } from "react";
import { BurnForm } from "./BurnForm";
import { Rule9Form } from "./Rule9Form";

type Metode = "lund" | "rule9";

const METODE: ReadonlyArray<{ id: Metode; label: string }> = [
  { id: "lund", label: "Lund & Browder" },
  { id: "rule9", label: "Rule of Nines" },
];

/*
 * Pemilih metode penilaian luas luka bakar.
 * WHY: kedua metode berdiri sendiri dari ujung ke ujung. Lund & Browder tetap
 * memakai Parkland seperti sebelumnya dan tidak diubah sebaris pun. Rule of
 * Nines memakai kerangka ATLS. Keduanya sengaja tidak berbagi state supaya
 * pilihan area milik satu metode tidak pernah bocor ke metode lain.
 */
export function BurnMethodSwitch() {
  const [metode, setMetode] = useState<Metode>("lund");

  return (
    <div>
      <div className="segmented-toggle" style={{ marginBottom: 18 }}>
        {METODE.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`segmented-btn ${metode === m.id ? "aktif" : ""}`}
            onClick={() => setMetode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {metode === "lund" ? <BurnForm /> : <Rule9Form />}
    </div>
  );
}
