"use client";

import { useEffect, useMemo, useState } from "react";
import { DAFTAR_SKOR } from "./data";
import { hitungSkor } from "./hitungSkor";

function tandaPoin(n: number): string {
  return (n >= 0 ? "+" : "") + n;
}

export function ScoreCatalog() {
  const [aktifId, setAktifId] = useState<string | null>(null);
  const [pilihan, setPilihan] = useState<number[]>([]);

  const def = useMemo(
    () => DAFTAR_SKOR.find((s) => s.id === aktifId) ?? null,
    [aktifId]
  );
  const hasil = useMemo(
    () =>
      def && pilihan.length === def.items.length
        ? hitungSkor(def.id, pilihan)
        : null,
    [def, pilihan]
  );

  const buka = (id: string) => {
    const d = DAFTAR_SKOR.find((s) => s.id === id);
    if (!d) return;
    setAktifId(id);
    setPilihan(d.items.map(() => 0));
  };
  const pilih = (i: number, opt: number) =>
    setPilihan((prev) => prev.map((v, idx) => (idx === i ? opt : v)));

  // Deep-link dari pencarian global: gulir & sorot kartu skor yang dituju.
  useEffect(() => {
    const h = window.location.hash || "";
    const m = h.match(/[#&]tk=([^&]+)/);
    if (!m) return;
    const tk = decodeURIComponent(m[1] ?? "");
    const bersih = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
    let el: HTMLElement | null = null;
    if (tk.indexOf("id:") === 0) {
      el = document.getElementById(tk.slice(3));
    } else if (tk.indexOf("text:") === 0) {
      const needle = bersih(tk.slice(5));
      const nodes = document.querySelectorAll<HTMLElement>(".tv-skor-card");
      nodes.forEach((n) => {
        if (!el && bersih(n.textContent || "").indexOf(needle) !== -1) el = n;
      });
    }
    const target = el;
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      const lama = target.style.boxShadow;
      target.style.transition = "box-shadow .25s ease";
      target.style.boxShadow =
        "0 0 0 3px #E5006D, 0 0 0 8px rgba(229,0,109,.22)";
      window.setTimeout(() => {
        target.style.boxShadow = lama;
      }, 2000);
    }, 220);
  }, []);

  if (!def || !hasil) {
    return (
      <div className="tv-skor-galeri">
        {DAFTAR_SKOR.map((s) => (
          <button
            key={s.id}
            id={"skor-" + s.id}
            type="button"
            className="tv-skor-card"
            onClick={() => buka(s.id)}
          >
            <span className="tv-skor-card-ic" aria-hidden>
              {s.emoji}
            </span>
            <span className="tv-skor-card-tx">
              <span className="tv-skor-card-nama">{s.nama}</span>
              <span className="tv-skor-card-ket">{s.ringkas}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="tv-stack">
      <button
        type="button"
        className="tv-skor-back"
        onClick={() => setAktifId(null)}
      >
        {"\u2190"} Kembali ke daftar skoring
      </button>
      <div className="tv-skor-detail-head">
        <h2 className="tv-skor-detail-nama">
          <span aria-hidden>{def.emoji}</span> {def.nama}
        </h2>
        <p className="tv-skor-detail-ket">{def.ket}</p>
      </div>
      {def.items.map((p, i) => (
        <div key={p.label} className="tv-skor-param">
          <div className="tv-skor-label">{p.label}</div>
          <div className="tv-skor-opsi">
            {p.opsi.map((o, oi) => (
              <button
                key={o.teks}
                type="button"
                className={"tv-skor-opt" + (pilihan[i] === oi ? " aktif" : "")}
                aria-pressed={pilihan[i] === oi}
                onClick={() => pilih(i, oi)}
              >
                <span>{o.teks}</span>
                <span className="tv-skor-poin">{tandaPoin(o.nilai)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={"tv-skor-hasil " + hasil.level}>
        {!def.hideTotal && (
          <div className="tv-skor-total">
            Total skor: <strong>{hasil.total}</strong> / {def.maxTotal}
          </div>
        )}
        <div className="tv-skor-kat">{hasil.kategori}</div>
        <p className="tv-skor-saran">{hasil.saran}</p>
      </div>
      <p className="tv-skor-sumber">
        Sumber: {def.sumber} Alat bantu, bukan pengganti penilaian klinis.
      </p>
    </div>
  );
}
