"use client";

import { useState } from "react";
import { hitungPAT } from "@/entities/emergency";
import type { PatSide, PatState } from "@/entities/emergency";
import { PatTriangleIcon } from "@/shared/ui";

const SISI: { key: keyof PatState; nama: string; hint: string }[] = [
  {
    key: "appearance",
    nama: "1. Appearance (Penampilan)",
    hint: "Tonus otot, interaksi/kontak mata, kemampuan ditenangkan, tatapan, kualitas tangisan/bicara.",
  },
  {
    key: "breathing",
    nama: "2. Work of Breathing (Usaha Napas)",
    hint: "Suara napas abnormal (stridor/wheezing/grunting), retraksi, napas cuping hidung, posisi tripod, takipnea.",
  },
  {
    key: "circulation",
    nama: "3. Circulation to Skin (Sirkulasi Kulit)",
    hint: "Pucat, mottling (kulit belang), atau sianosis.",
  },
];

export function PatTab() {
  const [state, setState] = useState<PatState>({
    appearance: null,
    breathing: null,
    circulation: null,
  });
  const r = hitungPAT(state);
  const setSisi = (key: keyof PatState, val: PatSide) =>
    setState((s) => ({ ...s, [key]: val }));

  return (
    <div className="drt-panel" id="patPanel">
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PatTriangleIcon size={24} /> Penilaian Cepat PAT
      </h3>
      <p className="drt-sub">
        Pediatric Assessment Triangle — kesan pertama tanpa alat (lihat &amp;
        dengar). Tandai tiap sisi Normal / Abnormal.
      </p>
      {SISI.map((s) => (
        <div className="pat-sisi" key={s.key}>
          <div className="pat-sisi-top">
            <span className="pat-sisi-nama">{s.nama}</span>
            <div className="pat-toggle">
              <button
                type="button"
                className={
                  "normal" + (state[s.key] === "normal" ? " aktif" : "")
                }
                onClick={() => setSisi(s.key, "normal")}
              >
                Normal
              </button>
              <button
                type="button"
                className={
                  "abnormal" + (state[s.key] === "abnormal" ? " aktif" : "")
                }
                onClick={() => setSisi(s.key, "abnormal")}
              >
                Abnormal
              </button>
            </div>
          </div>
          <div className="pat-sisi-hint">{s.hint}</div>
        </div>
      ))}
      <div className={"pat-hasil" + (r ? " lvl-" + r.lvl : "")} id="patHasil">
        {r ? (
          <>
            <div className="pat-kategori">{r.kat}</div>
            <div className="pat-saran">{r.saran}</div>
          </>
        ) : (
          <>
            <div className="pat-kategori">Lengkapi 3 sisi</div>
            <div className="pat-saran">
              Hasil kategori akan muncul setelah ketiga sisi dinilai.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
