"use client";

import { useEffect, useState } from "react";
import { VACCINES } from "@/entities/immunization";

function bersih(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function baris(label: string, value: string) {
  if (!value) return null;
  return (
    <div className="imn-row" key={label}>
      <div className="imn-k">{label}</div>
      <div className="imn-v">{value}</div>
    </div>
  );
}

/**
 * Materi Vaksin (port 1:1 dari island v17): dropdown pilih vaksin lalu
 * tampilkan detail (mencegah, jenis, cara pemberian, jadwal & dosis, KIPI,
 * kontraindikasi, catatan). Mendukung deep-link pencarian global lewat
 * anchor "vaksin:<kunci>" (skema sama seperti sebelumnya di
 * scripts/build-search-index.mjs), memilih + menggulir + menyorot vaksin
 * yang dituju — menggantikan mekanisme postMessage __tkScrollTo iframe v17.
 */
export function VaccineCatalog() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function evaluateVaksin() {
      if (typeof window === "undefined") return;

      let needle = "";

      // 1) Cek URL search parameter ?vaksin=dpt
      const params = new URLSearchParams(window.location.search);
      const vParam = params.get("vaksin");
      if (vParam) {
        needle = bersih(vParam);
      }

      // 2) Cek hash #tk=vaksin:dpt
      if (!needle) {
        const h = window.location.hash || "";
        const m = h.match(/[#&]tk=([^&]+)/);
        if (m) {
          const tk = decodeURIComponent(m[1] ?? "");
          if (tk.indexOf("vaksin:") === 0) {
            needle = bersih(tk.slice(7));
          }
        }
      }

      // 3) Cek sessionStorage
      if (!needle) {
        try {
          const rawTarget = sessionStorage.getItem("tv_search_target");
          if (rawTarget) {
            const parsed = JSON.parse(rawTarget);
            const anchor = String(parsed.anchor || "");
            if (anchor.startsWith("vaksin:")) {
              needle = bersih(anchor.slice(7));
            }
          }
        } catch {}
      }

      if (!needle || needle.length < 2) return;

      let idx = -1;
      for (let q = 0; q < VACCINES.length; q++) {
        const vk = bersih(VACCINES[q]?.nama ?? "");
        if (vk && (vk.indexOf(needle) !== -1 || needle.indexOf(vk) !== -1)) {
          idx = q;
          break;
        }
      }
      if (idx < 0) return;
      setIndex(idx);

      window.setTimeout(() => {
        const head = document.getElementById("vaksinAktif");
        if (!head) return;
        head.scrollIntoView({ behavior: "smooth", block: "center" });
        const lama = head.style.boxShadow;
        head.style.transition = "box-shadow .25s ease";
        head.style.boxShadow = "0 0 0 3px #E5006D, 0 0 0 8px rgba(229,0,109,.22)";
        window.setTimeout(() => {
          head.style.boxShadow = lama;
        }, 2200);
      }, 450);
    }

    evaluateVaksin();
    window.addEventListener("hashchange", evaluateVaksin);
    return () => window.removeEventListener("hashchange", evaluateVaksin);
  }, []);

  const v = VACCINES[index];
  if (!v) return null;

  return (
    <>
      <div className="imn-select-wrap">
        <select
          className="imn-select"
          aria-label="Pilih vaksin"
          value={index}
          onChange={(e) => setIndex(parseInt(e.target.value, 10) || 0)}
        >
          {VACCINES.map((vak, i) => (
            <option key={vak.id} value={i}>
              {vak.nama}
            </option>
          ))}
        </select>
      </div>

      <div id="vaksinDetail">
        <div className="imn-detail-head" id="vaksinAktif">
          <h3>{v.nama}</h3>
          <div className="imn-badges">
            {v.badges.map((b, i) => (
              <span key={i} className={"imn-badge " + b.kind}>
                {b.label}
              </span>
            ))}
          </div>
        </div>
        <div className="imn-rows">
          {baris("Mencegah", v.mencegah)}
          {baris("Jenis vaksin", v.jenis)}
          {baris("Cara pemberian", v.caraPemberian)}
          {baris("Jadwal & dosis", v.jadwalDosis)}
          {baris("KIPI umum", v.kipi)}
          {baris("Kontraindikasi", v.kontraindikasi)}
          {baris("Catatan", v.catatan)}
        </div>
      </div>

      <p className="imn-disclaimer">
        Ringkasan mengacu rekomendasi IDAI 2024. Selalu sesuaikan dengan
        kondisi klinis pasien, sediaan vaksin yang tersedia, dan pedoman
        terbaru.
      </p>
    </>
  );
}
