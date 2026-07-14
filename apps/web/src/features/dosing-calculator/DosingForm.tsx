"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { NumberField, ResultList } from "@/shared/ui";
import { DOSING_CATALOG, viewDosing } from "@/entities/dosing";

function butuhUsia(doseType: string): boolean {
  return doseType === "ageBands" || doseType === "byAge";
}

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const labelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const captionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--teks)",
};
const selectStyle: CSSProperties = {
  padding: "10px 12px",
  fontSize: 15,
  color: "var(--teks)",
  background: "var(--putih)",
  border: "1px solid var(--etail-line)",
  borderRadius: 10,
};
const catatanStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "var(--teks-lembut)",
};
const peringatanListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};
const peringatanItemStyle: CSSProperties = {
  fontSize: 13,
  color: "var(--pink-tua)",
};

export function DosingForm() {
  const [obatId, setObatId] = useState(DOSING_CATALOG[0]?.id ?? "");
  const [beratBadan, setBeratBadan] = useState("");
  const [usiaBulan, setUsiaBulan] = useState("");
  const [sediaanIndex, setSediaanIndex] = useState("0");

  const entry = useMemo(
    () =>
      DOSING_CATALOG.find((item) => item.id === obatId) ?? DOSING_CATALOG[0],
    [obatId],
  );
  const obat = entry?.obat;
  const sediaanOptions = obat?.sediaanOptions ?? [];

  const view = useMemo(
    () =>
      obat
        ? viewDosing(obat, beratBadan, usiaBulan, sediaanIndex)
        : { rows: [], peringatan: [], error: "Pilih obat terlebih dahulu." },
    [obat, beratBadan, usiaBulan, sediaanIndex],
  );

  if (!obat) {
    return <p style={catatanStyle}>Katalog obat contoh belum tersedia.</p>;
  }

  return (
    <div style={wrapStyle}>
      <label style={labelStyle}>
        <span style={captionStyle}>Obat</span>
        <select
          value={obatId}
          onChange={(e) => setObatId(e.target.value)}
          style={selectStyle}
        >
          {DOSING_CATALOG.map((item) => (
            <option key={item.id} value={item.id}>
              {item.obat.nama}
            </option>
          ))}
        </select>
      </label>

      {obat.frekuensi ? <p style={catatanStyle}>{obat.frekuensi}</p> : null}

      <NumberField
        label="Berat badan"
        value={beratBadan}
        onValueChange={setBeratBadan}
        suffix="kg"
      />

      {butuhUsia(obat.doseType) ? (
        <NumberField
          label="Usia"
          value={usiaBulan}
          onValueChange={setUsiaBulan}
          step={1}
          suffix="bulan"
        />
      ) : null}

      {sediaanOptions.length > 1 ? (
        <label style={labelStyle}>
          <span style={captionStyle}>Sediaan</span>
          <select
            value={sediaanIndex}
            onChange={(e) => setSediaanIndex(e.target.value)}
            style={selectStyle}
          >
            {sediaanOptions.map((opt, idx) => (
              <option key={idx} value={String(idx)}>
                {opt.label ??
                  `${opt.sediaanMg ?? "?"} mg / ${opt.sediaanMl ?? "?"} mL`}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <ResultList rows={view.rows} error={view.error} />

      {view.peringatan.length > 0 ? (
        <ul style={peringatanListStyle}>
          {view.peringatan.map((pesan, idx) => (
            <li key={idx} style={peringatanItemStyle}>
              {pesan}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
