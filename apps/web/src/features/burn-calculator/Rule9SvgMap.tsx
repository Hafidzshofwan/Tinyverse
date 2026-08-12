"use client";

import type { ReactNode } from "react";
import type { RuleOfNinesArea } from "@tinyverse/clinical-core";
import {
  ruleOfNinesAreaLabel,
  ruleOfNinesAreaPercent,
} from "@tinyverse/clinical-core";

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
  extra?: string;
  children: ReactNode;
}

const QUICK_PAIRS: ReadonlyArray<{
  pair: readonly [RuleOfNinesArea, RuleOfNinesArea];
  label: string;
}> = [
  { pair: ["armRightFront", "armRightBack"], label: "Seluruh lengan kanan" },
  { pair: ["armLeftFront", "armLeftBack"], label: "Seluruh lengan kiri" },
  { pair: ["legRightFront", "legRightBack"], label: "Seluruh tungkai kanan" },
  { pair: ["legLeftFront", "legLeftBack"], label: "Seluruh tungkai kiri" },
];

function formatPersen(nilai: number): string {
  return String(Math.round(nilai * 100) / 100).replace(".", ",");
}

/*
 * WHY memakai kelas .burn-area / .burn-body-svg milik chart Lund & Browder:
 * warna isian, garis tepi, ukuran huruf, keadaan terpilih, dan seluruh
 * penyesuaian mode gelap sudah didefinisikan sekali di v17-cairan.css. Dengan
 * memakai kelas yang sama, Rule of Nines otomatis identik dengan Lund dan
 * tidak akan menyimpang lagi setiap kali gaya Lund disetel.
 */
function Regio({
  area,
  aktif,
  ageYears,
  onToggle,
  labelX,
  labelY,
  extra,
  children,
}: RegioProps) {
  const persen = ruleOfNinesAreaPercent(area, ageYears);
  const nama = ruleOfNinesAreaLabel(area);
  return (
    <g
      className={`burn-area burn-area-svg ${extra ?? ""} ${aktif ? "aktif" : ""}`}
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
      <text x={labelX} y={labelY}>
        {formatPersen(persen)}%
      </text>
    </g>
  );
}

function Defs({ gradientId }: { gradientId: string }) {
  return (
    <defs>
      <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FFF2F7" />
      </linearGradient>
      <linearGradient id="burnSelectedFill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#FF7A45" />
        <stop offset="100%" stopColor="#FF4F8B" />
      </linearGradient>
      <filter id="burnSoftShadow" x="-35%" y="-35%" width="170%" height="170%">
        <feDropShadow
          dx="0"
          dy="11"
          stdDeviation="10"
          floodColor="#24265E"
          floodOpacity=".16"
        />
      </filter>
    </defs>
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
    <>
      <div className="burn-map-wrap">
        <div className="burn-map-card">
          <div className="burn-map-title">Bagian Depan (Anterior)</div>
          <div className="burn-chart-stage">
            <div className="burn-chart-hint">
              Klik bidang besar. Angka menyesuaikan usia.
            </div>
            <svg
              className="burn-body-svg burn-body-front burn-body-detailed"
              viewBox="0 0 390 680"
              role="group"
              aria-label="Peta Rule of Nines bagian depan"
            >
              <Defs gradientId="burnBodyFillFront" />
              <g className="burn-anatomy" filter="url(#burnSoftShadow)">
            <Regio {...p("headFront")} labelX={195} labelY={72}>
              <ellipse cx={195} cy={64} rx={42} ry={46} />
              <path d="M164 112 L226 112 L219 150 L171 150 Z" />
            </Regio>

            <Regio {...p("chest")} labelX={195} labelY={207}>
              <path d="M136 151 C154 137 236 137 254 151 L268 255 C235 269 155 269 122 255 Z" />
            </Regio>

            <Regio {...p("abdomen")} labelX={195} labelY={315}>
              <path d="M122 259 C155 273 235 273 268 259 L252 350 C225 368 165 368 138 350 Z" />
            </Regio>

            <Regio {...p("armRightFront")} labelX={104} labelY={220}>
              <path d="M133 164 C103 175 88 207 82 248 L119 255 C124 222 133 196 148 177 Z" />
              <path d="M81 253 L118 260 L103 343 C100 361 88 371 75 368 C62 365 56 351 60 333 Z" />
              <path d="M72 371 C61 378 58 392 64 405 C70 418 85 420 96 411 C104 404 107 390 101 379 C96 369 83 365 72 371 Z" />
              <path className="burn-digit" d="M64 393 C52 388 48 397 57 404" />
              <path className="burn-digit" d="M72 374 C68 360 78 357 82 371" />
              <path className="burn-digit" d="M82 371 C82 356 94 356 94 373" />
              <path className="burn-digit" d="M91 376 C101 364 111 371 101 383" />
            </Regio>

            <Regio {...p("armLeftFront")} labelX={286} labelY={220}>
              <path d="M257 164 C287 175 302 207 308 248 L271 255 C266 222 257 196 242 177 Z" />
              <path d="M309 253 L272 260 L287 343 C290 361 302 371 315 368 C328 365 334 351 330 333 Z" />
              <path d="M318 371 C329 378 332 392 326 405 C320 418 305 420 294 411 C286 404 283 390 289 379 C294 369 307 365 318 371 Z" />
              <path className="burn-digit" d="M326 393 C338 388 342 397 333 404" />
              <path className="burn-digit" d="M318 374 C322 360 312 357 308 371" />
              <path className="burn-digit" d="M308 371 C308 356 296 356 296 373" />
              <path className="burn-digit" d="M299 376 C289 364 279 371 289 383" />
            </Regio>

            <Regio {...p("legRightFront")} labelX={161} labelY={445}>
              <path d="M140 363 C158 375 178 377 193 366 L187 485 L141 485 C132 434 130 394 140 363 Z" />
              <path d="M141 490 L187 490 L179 593 L131 593 Z" />
              <path d="M130 598 L180 598 C184 617 173 632 151 632 C132 632 121 621 130 598 Z" />
              <path className="burn-digit" d="M134 624 C129 635 141 638 145 628" />
              <path className="burn-digit" d="M147 628 C146 641 160 641 159 628" />
              <path className="burn-digit" d="M160 627 C164 638 176 634 171 624" />
            </Regio>

            <Regio {...p("legLeftFront")} labelX={229} labelY={445}>
              <path d="M250 363 C232 375 212 377 197 366 L203 485 L249 485 C258 434 260 394 250 363 Z" />
              <path d="M249 490 L203 490 L211 593 L259 593 Z" />
              <path d="M260 598 L210 598 C206 617 217 632 239 632 C258 632 269 621 260 598 Z" />
              <path className="burn-digit" d="M256 624 C261 635 249 638 245 628" />
              <path className="burn-digit" d="M243 628 C244 641 230 641 231 628" />
              <path className="burn-digit" d="M230 627 C226 638 214 634 219 624" />
            </Regio>

            <Regio {...p("perineum")} labelX={195} labelY={363} extra="burn-perineum">
              <circle cx={195} cy={357} r={17} />
            </Regio>
              </g>
            </svg>
          </div>
        </div>

        <div className="burn-map-card">
          <div className="burn-map-title">Bagian Belakang (Posterior)</div>
          <div className="burn-chart-stage">
            <div className="burn-chart-hint">
              Punggung bawah sudah termasuk bokong.
            </div>
            <svg
              className="burn-body-svg burn-body-back burn-body-detailed"
              viewBox="0 0 390 680"
              role="group"
              aria-label="Peta Rule of Nines bagian belakang"
            >
              <Defs gradientId="burnBodyFillBack" />
              <g className="burn-anatomy" filter="url(#burnSoftShadow)">
            <Regio {...p("headBack")} labelX={195} labelY={72}>
              <ellipse cx={195} cy={64} rx={42} ry={46} />
              <path d="M164 112 L226 112 L219 150 L171 150 Z" />
            </Regio>

            <Regio {...p("upperBack")} labelX={195} labelY={207}>
              <path d="M136 151 C154 137 236 137 254 151 L268 255 C235 269 155 269 122 255 Z" />
            </Regio>

            <Regio {...p("lowerBack")} labelX={195} labelY={310}>
              <path d="M122 259 C155 273 235 273 268 259 L252 348 C225 360 165 360 138 348 Z" />
              <path d="M138 350 C165 363 184 361 196 350 L190 411 C161 416 140 400 128 374 Z" />
              <path d="M252 350 C225 363 206 361 194 350 L200 411 C229 416 250 400 262 374 Z" />
            </Regio>

            <Regio {...p("armRightBack")} labelX={104} labelY={220}>
              <path d="M133 164 C103 175 88 207 82 248 L119 255 C124 222 133 196 148 177 Z" />
              <path d="M81 253 L118 260 L103 343 C100 361 88 371 75 368 C62 365 56 351 60 333 Z" />
              <path d="M72 371 C61 378 58 392 64 405 C70 418 85 420 96 411 C104 404 107 390 101 379 C96 369 83 365 72 371 Z" />
              <path className="burn-digit" d="M64 393 C52 388 48 397 57 404" />
              <path className="burn-digit" d="M72 374 C68 360 78 357 82 371" />
              <path className="burn-digit" d="M82 371 C82 356 94 356 94 373" />
              <path className="burn-digit" d="M91 376 C101 364 111 371 101 383" />
            </Regio>

            <Regio {...p("armLeftBack")} labelX={286} labelY={220}>
              <path d="M257 164 C287 175 302 207 308 248 L271 255 C266 222 257 196 242 177 Z" />
              <path d="M309 253 L272 260 L287 343 C290 361 302 371 315 368 C328 365 334 351 330 333 Z" />
              <path d="M318 371 C329 378 332 392 326 405 C320 418 305 420 294 411 C286 404 283 390 289 379 C294 369 307 365 318 371 Z" />
              <path className="burn-digit" d="M326 393 C338 388 342 397 333 404" />
              <path className="burn-digit" d="M318 374 C322 360 312 357 308 371" />
              <path className="burn-digit" d="M308 371 C308 356 296 356 296 373" />
              <path className="burn-digit" d="M299 376 C289 364 279 371 289 383" />
            </Regio>

            <Regio {...p("legRightBack")} labelX={161} labelY={460}>
              <path d="M140 414 C158 424 178 424 190 412 L187 485 L141 485 C134 456 133 432 140 414 Z" />
              <path d="M141 490 L187 490 L179 593 L131 593 Z" />
              <path d="M130 598 L180 598 C184 617 173 632 151 632 C132 632 121 621 130 598 Z" />
              <path className="burn-digit" d="M134 624 C129 635 141 638 145 628" />
              <path className="burn-digit" d="M147 628 C146 641 160 641 159 628" />
              <path className="burn-digit" d="M160 627 C164 638 176 634 171 624" />
            </Regio>

            <Regio {...p("legLeftBack")} labelX={229} labelY={460}>
              <path d="M250 414 C232 424 212 424 200 412 L203 485 L249 485 C256 456 257 432 250 414 Z" />
              <path d="M249 490 L203 490 L211 593 L259 593 Z" />
              <path d="M260 598 L210 598 C206 617 217 632 239 632 C258 632 269 621 260 598 Z" />
              <path className="burn-digit" d="M256 624 C261 635 249 638 245 628" />
              <path className="burn-digit" d="M243 628 C244 641 230 641 231 628" />
              <path className="burn-digit" d="M230 627 C226 638 214 634 219 624" />
            </Regio>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <p className="catatan-metode" style={{ marginTop: 8 }}>
        Sisi kanan pasien digambar di sebelah kiri layar, sama seperti chart Lund
        &amp; Browder.
      </p>

      <div className="burn-quick-panel">
        <div className="burn-quick-grid">
          {QUICK_PAIRS.map((q) => {
            const isFull = set.has(q.pair[0]) && set.has(q.pair[1]);
            return (
              <button
                key={q.label}
                type="button"
                className={`burn-quick-btn ${isFull ? "aktif" : ""}`}
                aria-pressed={isFull}
                onClick={() => {
                  q.pair.forEach((area) => {
                    const sudahAktif = set.has(area);
                    if (isFull && sudahAktif) onToggle(area);
                    if (!isFull && !sudahAktif) onToggle(area);
                  });
                }}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
