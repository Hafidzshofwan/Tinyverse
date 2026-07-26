"use client";

import { useEffect, useState } from "react";
import {
  OPSI,
  autoAgeEM,
  autoAgeV,
  gcsInfoText,
  gcsUsiaTeks,
  labelEM,
  labelV,
  hitungGcs,
  tambahLog,
} from "@/entities/emergency";
import type { GcsAgeEM, GcsAgeV, GcsState } from "@/entities/emergency";

import {
  BrainGcsIcon,
  GcsEyeIcon,
  GcsVerbalIcon,
  GcsMotorIcon,
  SaveDataIcon,
  CopyDataIcon,
} from "@/shared/ui";

export function GcsTab({
  ub,
  nama,
  noRm,
}: {
  ub: number | null;
  nama: string;
  noRm: string;
}) {
  const [state, setState] = useState<GcsState>({
    ageEM: "ge1",
    ageV: "gt5",
    eye: null,
    motor: null,
    verbal: null,
    tube: false,
    manualEM: false,
    manualV: false,
  });
  const [simpanLabel, setSimpanLabel] = useState("Simpan ke Pasien");
  const [salinLabel, setSalinLabel] = useState("Salin Hasil");

  // Turunkan kelompok usia dari profil, kecuali sudah dipilih manual.
  useEffect(() => {
    const em = autoAgeEM(ub);
    const v = autoAgeV(ub);
    if (em == null || v == null) return;
    setState((s) => ({
      ...s,
      ageEM: s.manualEM ? s.ageEM : em,
      ageV: s.manualV ? s.ageV : v,
    }));
  }, [ub]);

  const info = gcsInfoText(ub, state.ageEM, state.ageV);
  const r = hitungGcs(state);

  const pilihAgeEM = (age: GcsAgeEM) =>
    setState((s) => ({ ...s, ageEM: age, manualEM: true }));
  const pilihAgeV = (age: GcsAgeV) =>
    setState((s) => ({ ...s, ageV: age, manualV: true }));
  const pilihSkor = (komp: "eye" | "motor" | "verbal", skor: number) =>
    setState((s) => ({ ...s, [komp]: skor }));

  const teksHasil = () => {
    return (
      "PENILAIAN pGCS (Pediatric Glasgow Coma Scale)\n" +
      "Pasien : " +
      (nama || "-") +
      "\n" +
      "No. RM : " +
      (noRm || "-") +
      "\n" +
      "Usia   : " +
      gcsUsiaTeks(ub) +
      "  (Eye/Motor " +
      labelEM(state.ageEM) +
      " \u00b7 Verbal " +
      labelV(state.ageV) +
      ")\n" +
      "Tanggal: " +
      new Date().toLocaleString("id-ID") +
      "\n" +
      "----------------------------------\n" +
      "Skor   : " +
      (r.lengkap ? r.totTeks : r.skorTeks) +
      "\n" +
      "Interpretasi: " +
      (r.lengkap ? r.kat + " \u2014 " + r.saran : "(belum lengkap)") +
      "\n"
    );
  };

  const salin = () => {
    try {
      navigator.clipboard.writeText(teksHasil());
    } catch {
      /* abaikan */
    }
    setSalinLabel("\u2713 Tersalin");
    window.setTimeout(() => setSalinLabel("Salin Hasil"), 1400);
  };

  const simpan = () => {
    tambahLog({
      tipe: "GCS",
      pasien: nama || "-",
      noRm: noRm || "",
      skor: r.lengkap ? r.totTeks : r.skorTeks,
      kronologi: teksHasil(),
      t: Date.now(),
    });
    setSimpanLabel("\u2713 Tersimpan ke pasien");
    window.setTimeout(() => setSimpanLabel("Simpan ke Pasien"), 1600);
  };

  const renderOpsi = (
    komp: "eye" | "motor" | "verbal",
    age: string,
  ) => {
    const arr = (OPSI[komp] && OPSI[komp][age]) || [];
    return arr.map((o) => (
      <button
        key={o.s}
        type="button"
        className={state[komp] === o.s ? "aktif" : undefined}
        onClick={() => pilihSkor(komp, o.s)}
      >
        <span className="gcs-poin">{o.s}</span>
        <span>{o.t}</span>
      </button>
    ));
  };

  const emAges: { id: GcsAgeEM; label: string }[] = [
    { id: "lt1", label: "<1 th" },
    { id: "ge1", label: ">1 th" },
  ];
  const vAges: { id: GcsAgeV; label: string }[] = [
    { id: "lt2", label: "<2 th" },
    { id: "2to5", label: "2–5" },
    { id: "gt5", label: ">5 th" },
  ];

  return (
    <div className="drt-panel" id="gcsPanel">
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <BrainGcsIcon size={24} /> Penilaian pGCS
      </h3>
      <p className="drt-sub">
        Pediatric Glasgow Coma Scale. Pilihan otomatis menyesuaikan kelompok
        usia dari Profil Pasien (bisa diubah manual). Total skor 3–15.
      </p>
      <div className="gcs-usia-bar">
        <span className="gcs-usia-info">{info}</span>
      </div>

      <div className="gcs-grid">
        <div className="gcs-komp" data-komp="eye">
          <div className="gcs-komp-head">
            <span className="gcs-komp-nama" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <GcsEyeIcon size={20} /> Eye (E)
            </span>
            <div className="gcs-age-toggle">
              {emAges.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={state.ageEM === a.id ? "aktif" : undefined}
                  onClick={() => pilihAgeEM(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="gcs-opsi">{renderOpsi("eye", state.ageEM)}</div>
        </div>

        <div
          className={"gcs-komp" + (state.tube ? " terbatas" : "")}
          data-komp="verbal"
        >
          <div className="gcs-komp-head">
            <span className="gcs-komp-nama" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <GcsVerbalIcon size={20} /> Verbal (V)
            </span>
            <div className="gcs-age-toggle">
              {vAges.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={state.ageV === a.id ? "aktif" : undefined}
                  onClick={() => pilihAgeV(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="gcs-opsi">{renderOpsi("verbal", state.ageV)}</div>
          <label className="gcs-tube">
            <input
              type="checkbox"
              checked={state.tube}
              onChange={(e) =>
                setState((s) => ({ ...s, tube: e.target.checked }))
              }
            />{" "}
            Terintubasi (V=T)
          </label>
        </div>

        <div className="gcs-komp" data-komp="motor">
          <div className="gcs-komp-head">
            <span className="gcs-komp-nama" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <GcsMotorIcon size={20} /> Motor (M)
            </span>
            <div className="gcs-age-toggle">
              {emAges.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={state.ageEM === a.id ? "aktif" : undefined}
                  onClick={() => pilihAgeEM(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="gcs-opsi">{renderOpsi("motor", state.ageEM)}</div>
        </div>
      </div>

      <div className={"gcs-hasil" + (r.lengkap ? " lvl-" + r.lvl : "")}>
        {r.lengkap ? (
          <>
            <div className="gcs-skor">{r.totTeks}</div>
            <div className="gcs-total">
              <strong>{r.kat}</strong>
              <br />
              {r.saran}
            </div>
          </>
        ) : (
          <>
            <div className="gcs-skor">{r.skorTeks}</div>
            <div className="gcs-total">
              Pilih komponen Eye, Verbal
              {state.tube ? " (terintubasi)" : ""} &amp; Motor untuk melihat
              total.
            </div>
          </>
        )}
      </div>
      <div className="gcs-out-actions">
        <button className="salin" type="button" onClick={salin} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <CopyDataIcon size={16} />
          <span>{salinLabel}</span>
        </button>
        <button className="simpan" type="button" onClick={simpan} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <SaveDataIcon size={16} />
          <span>{simpanLabel}</span>
        </button>
      </div>
    </div>
  );
}
