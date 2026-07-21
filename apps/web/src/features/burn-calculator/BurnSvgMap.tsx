"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { BurnArea } from "@tinyverse/clinical-core";

interface BurnSvgMapProps {
  selected: ReadonlyArray<BurnArea>;
  onToggle: (area: BurnArea) => void;
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
  gap: 18,
  alignItems: "stretch",
  marginTop: 12,
};

const cardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.95), transparent 30%), linear-gradient(145deg, #FFF9FC 0%, #F4F8FF 54%, #FFF4EA 100%)",
  border: "1px solid rgba(99, 102, 241, 0.14)",
  borderRadius: 28,
  padding: 14,
};

const titleStyle: CSSProperties = {
  fontFamily: "'Fredoka', sans-serif",
  fontWeight: 700,
  color: "#F0791C",
  marginBottom: 10,
  textAlign: "center",
  fontSize: "0.95rem",
};

const stageStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 430,
  padding: "8px 4px 2px",
};

const hintStyle: CSSProperties = {
  position: "absolute",
  top: 6,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.82)",
  color: "#0A0B5F",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "0.72rem",
  fontWeight: 700,
};

const svgStyle: CSSProperties = {
  width: "min(100%, 310px)",
  height: "auto",
  filter: "drop-shadow(0 22px 30px rgba(31, 41, 95, 0.16))",
  overflow: "visible",
};

const svgStyleString = `
  .burn-body-svg { width: min(100%, 310px); height: auto; overflow: visible; }
  .burn-area-svg { cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; }
  .burn-area-svg > path, .burn-area-svg > ellipse, .burn-area-svg > circle { fill: url(#burnBodyFillFront); stroke: #6D4CBB; stroke-width: 4; transition: all 0.22s ease; transform-box: fill-box; }
  .burn-area-svg:hover > path, .burn-area-svg:hover > ellipse, .burn-area-svg:hover > circle { filter: drop-shadow(0 0 6px rgba(255,73,128,0.35)); transform: scale(1.02); }
  .burn-area-svg.aktif > path, .burn-area-svg.aktif > ellipse, .burn-area-svg.aktif > circle { fill: url(#burnSelectedFill); stroke: #C62828; }
  .burn-area-svg text { fill: #0A0B5F; font-size: 14px; font-weight: 700; font-family: 'Fredoka', sans-serif; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
  .burn-area-svg.aktif text { fill: #FFFFFF; }
  .burn-digit { fill: none; stroke: #6D4CBB; stroke-width: 2; }
  .burn-area-svg.aktif .burn-digit { stroke: #C62828; }
`;

interface SvgViewProps {
  url: string;
  selected: ReadonlySet<BurnArea>;
  onToggle: (area: BurnArea) => void;
  title: string;
  hint: string;
  suffix: string;
}

function SvgView({
  url,
  selected,
  onToggle,
  title,
  hint,
  suffix,
}: SvgViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        // Make IDs unique so two maps can coexist on one page.
        const unique = text
          .replace(/id="burnBodyFillFront"/g, `id="burnBodyFillFront${suffix}"`)
          .replace(/id="burnSelectedFill"/g, `id="burnSelectedFill${suffix}"`)
          .replace(/id="burnSoftShadow"/g, `id="burnSoftShadow${suffix}"`)
          .replace(
            /url\(#burnBodyFillFront\)/g,
            `url(#burnBodyFillFront${suffix})`,
          )
          .replace(
            /url\(#burnSelectedFill\)/g,
            `url(#burnSelectedFill${suffix})`,
          )
          .replace(/url\(#burnSoftShadow\)/g, `url(#burnSoftShadow${suffix})`);
        setSvg(unique);
      })
      .catch(() => setSvg(""));
  }, [url, suffix]);

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
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={stageStyle}>
        <div style={hintStyle}>{hint}</div>
        <div
          ref={ref}
          style={svgStyle}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <style>{svgStyleString}</style>
      </div>
    </div>
  );
}

export function BurnSvgMap({ selected, onToggle }: BurnSvgMapProps) {
  const selectedSet = new Set(selected);
  return (
    <div style={wrapStyle}>
      <SvgView
        url="/burn-front.svg"
        selected={selectedSet}
        onToggle={onToggle}
        title="Bagian Depan (Anterior)"
        hint="Klik area tubuh secara detail"
        suffix="Front"
      />
      <SvgView
        url="/burn-back.svg"
        selected={selectedSet}
        onToggle={onToggle}
        title="Bagian Belakang (Posterior)"
        hint="Klik area tubuh secara detail"
        suffix="Back"
      />
    </div>
  );
}
