"use client";

import { useEffect, useRef, useState } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";

interface BurnSvgMapProps {
  selected: ReadonlyArray<BurnArea>;
  onToggle: (area: BurnArea) => void;
}

interface SvgViewProps {
  url: string;
  selected: ReadonlySet<BurnArea>;
  onToggle: (area: BurnArea) => void;
  title: string;
  hint: string;
  extraClass: string;
}

const QUICK_AREAS: ReadonlyArray<{ area: BurnArea; label: string }> = [
  { area: "armRightFull", label: "Seluruh lengan kanan" },
  { area: "armLeftFull", label: "Seluruh lengan kiri" },
  { area: "legRightFull", label: "Seluruh tungkai kanan" },
  { area: "legLeftFull", label: "Seluruh tungkai kiri" },
];

function SvgView({
  url,
  selected,
  onToggle,
  title,
  hint,
  extraClass,
}: SvgViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then((text) => setSvg(text))
      .catch(() => setSvg(""));
  }, [url]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const groups = el.querySelectorAll<SVGGElement>("[data-burn-area]");
    const handlers: Array<{
      el: SVGGElement;
      click: (e: Event) => void;
      key: (e: KeyboardEvent) => void;
    }> = [];
    groups.forEach((g) => {
      const area = g.getAttribute("data-burn-area") as BurnArea;
      const isSelected = selected.has(area);
      g.classList.toggle("aktif", isSelected);
      g.setAttribute("aria-pressed", String(isSelected));
      const click = (e: Event) => {
        e.preventDefault();
        onToggle(area);
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(area);
        }
      };
      g.addEventListener("click", click);
      g.addEventListener("keydown", key);
      handlers.push({ el: g, click, key });
    });
    return () => {
      handlers.forEach(({ el, click, key }) => {
        el.removeEventListener("click", click);
        el.removeEventListener("keydown", key);
      });
    };
  }, [selected, onToggle, svg]);

  return (
    <div className="burn-map-card">
      <div className="burn-map-title">{title}</div>
      <div className="burn-chart-stage">
        <div className="burn-chart-hint">{hint}</div>
        <div
          ref={ref}
          className={`burn-body-svg ${extraClass}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}

export function BurnSvgMap({ selected, onToggle }: BurnSvgMapProps) {
  const selectedSet = new Set(selected);
  return (
    <>
      <div className="burn-map-wrap">
        <SvgView
          url="/burn-front.svg"
          selected={selectedSet}
          onToggle={onToggle}
          title="Bagian Depan (Anterior)"
          hint="Klik area tubuh secara detail"
          extraClass="burn-body-front"
        />
        <SvgView
          url="/burn-back.svg"
          selected={selectedSet}
          onToggle={onToggle}
          title="Bagian Belakang (Posterior)"
          hint="Detail sampai tangan & kaki"
          extraClass="burn-body-back"
        />
      </div>

      <div className="burn-quick-panel">
        <div className="burn-quick-grid">
          {QUICK_AREAS.map((q) => (
            <button
              key={q.area}
              type="button"
              className={`burn-quick-btn ${
                selectedSet.has(q.area) ? "aktif" : ""
              }`}
              aria-pressed={selectedSet.has(q.area)}
              onClick={() => onToggle(q.area)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
