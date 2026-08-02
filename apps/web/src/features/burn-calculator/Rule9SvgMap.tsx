"use client";

import type { ReactNode } from "react";
import type { RuleOfNinesArea } from "@tinyverse/clinical-core";
import {
  ruleOfNinesAreaLabel,
  ruleOfNinesAreaPercent,
} from "@tinyverse/clinical-core";

import s from "./Rule9.module.css";

interface Rule9SvgMapProps {
  selected: ReadonlyArray<RuleOfNinesArea>;
  onToggle: (area: RuleOfNinesArea) => void;
  ageYears: number;
}

interface RegioProps {
  area: RuleOfNinesArea;
  aktif: boolean;
  ageYears: number;
  onToggle: (area: RuleOfNinesArea) => void;
  labelX: number;
  labelY: number;
  children: ReactNode;
}

function formatPersen(nilai: number): string {
  return String(Math.round(nilai * 100) / 100).replace(".", ",");
}

function Regio({
  area,
  aktif,
  ageYears,
  onToggle,
  labelX,
  labelY,
  children,
}: RegioProps) {
  const persen = ruleOfNinesAreaPercent(area, ageYears);
  const nama = ruleOfNinesAreaLabel(area);
  return (
    <g
      className={`${s.regio} ${aktif ? s.aktif : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={aktif}
      aria-label={`${nama}, ${formatPersen(persen)} persen`}
      onClick={() => onToggle(area)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(area);
        }
      }}
    >
      {children}
      <text className={s.angka} x={labelX} y={labelY}>
        {formatPersen(persen)}%
      </text>
    </g>
  );
}

export function Rule9SvgMap({
  selected,
  onToggle,
  ageYears,
}: Rule9SvgMapProps) {
  const set = new Set(selected);
  const p = (area: RuleOfNinesArea) => ({
    area,
    aktif: set.has(area),
    ageYears,
    onToggle,
  });

  return (
    <div className="burn-map-card">
      <div className="burn-map-title">Rule of Nines - Depan &amp; Belakang</div>
      <div className="burn-chart-stage">
        <div className="burn-chart-hint">
          Klik bidang besar. Angka menyesuaikan usia pasien.
        </div>
        <svg
          className={s.badan}
          viewBox="0 0 760 680"
          role="group"
          aria-label="Peta tubuh Rule of Nines"
        >
          <defs>
            <linearGradient id="rule9SelectedFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF7A45" />
              <stop offset="100%" stopColor="#FF4F8B" />
            </linearGradient>
            <filter id="rule9Shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="11"
                stdDeviation="10"
                flood-color="#24265E"
                flood-opacity="0.16"
              />
            </filter>
          </defs>

          <g filter="url(#rule9Shadow)">
            <text className={s.judulSisi} x="195" y="28">
              DEPAN
            </text>
            <Regio {...p("headFront")} labelX={195} labelY={78}>
              <ellipse cx={195} cy={70} rx={44} ry={48} />
              <path d="M168 114 L222 114 L216 146 L174 146 Z" />
            </Regio>
            <Regio {...p("chest")} labelX={195} labelY={210}>
              <path d="M132 150 L258 150 L262 240 L128 240 Z" />
            </Regio>
            <Regio {...p("abdomen")} labelX={195} labelY={300}>
              <path d="M128 244 L262 244 L256 336 L134 336 Z" />
            </Regio>
            <Regio {...p("armRightFront")} labelX={100} labelY={250}>
              <rect x={80} y={152} width={42} height={228} rx={21} />
            </Regio>
            <Regio {...p("armLeftFront")} labelX={290} labelY={250}>
              <rect x={268} y={152} width={42} height={228} rx={21} />
            </Regio>
            <Regio {...p("legRightFront")} labelX={165} labelY={480}>
              <path d="M134 344 L191 344 L189 636 L146 636 Z" />
            </Regio>
            <Regio {...p("legLeftFront")} labelX={226} labelY={480}>
              <path d="M199 344 L256 344 L244 636 L201 636 Z" />
            </Regio>
            <Regio {...p("perineum")} labelX={195} labelY={368}>
              <circle cx={195} cy={344} r={15} />
            </Regio>
          </g>

          <g transform="translate(370 0)" filter="url(#rule9Shadow)">
            <text className={s.judulSisi} x="195" y="28">
              BELAKANG
            </text>
            <Regio {...p("headBack")} labelX={195} labelY={78}>
              <ellipse cx={195} cy={70} rx={44} ry={48} />
              <path d="M168 114 L222 114 L216 146 L174 146 Z" />
            </Regio>
            <Regio {...p("upperBack")} labelX={195} labelY={210}>
              <path d="M132 150 L258 150 L262 240 L128 240 Z" />
            </Regio>
            <Regio {...p("lowerBack")} labelX={195} labelY={300}>
              <path d="M128 244 L262 244 L256 344 L134 344 Z" />
            </Regio>
            <Regio {...p("armLeftBack")} labelX={100} labelY={250}>
              <rect x={80} y={152} width={42} height={228} rx={21} />
            </Regio>
            <Regio {...p("armRightBack")} labelX={290} labelY={250}>
              <rect x={268} y={152} width={42} height={228} rx={21} />
            </Regio>
            <Regio {...p("legLeftBack")} labelX={165} labelY={480}>
              <path d="M134 352 L191 352 L189 636 L146 636 Z" />
            </Regio>
            <Regio {...p("legRightBack")} labelX={226} labelY={480}>
              <path d="M199 352 L256 352 L244 636 L201 636 Z" />
            </Regio>
          </g>

          <text className={s.catatanSisi} x="555" y="664">
            Tampak belakang: kanan pasien di sisi kanan gambar
          </text>
        </svg>
      </div>
    </div>
  );
}
