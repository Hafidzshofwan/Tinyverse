// P0: generate typed golden vectors (.ts) + human-readable table (.md).
// Portable: paths resolved relative to this script.
const fs = require("fs");
const path = require("path");
const REF_DIR = path.resolve(__dirname, "../reference-outputs");
const g = JSON.parse(fs.readFileSync(path.join(REF_DIR, "fluids.reference.json"), "utf8"));

// ---------- fluids.golden.ts ----------
const ts = `// AUTO-GENERATED from the frozen v17 snapshot. DO NOT EDIT BY HAND.
// Source: ${g._meta.source}
// sha256: ${g._meta.sha256}
// frozenAt: ${g._meta.frozenAt}
// method: ${g._meta.method}
//
// These are the \"answer key\" reference outputs captured from TinyVerse v17.
// Phase 5+ (clinical-core Fluids bounded context) must reproduce these values.

export interface MaintenanceGolden {
\tweightKg: number
\ttotalMlPerDay: number
\tmlPerHourDisplay: string // v17 toFixed(1)
}

export interface DripGolden {
\tvolumeMl: number
\thours: number
\tdripType: "makro" | "mikro"
\tdropFactor: number // gtt/mL
\tgttPerMin: number // v17 Math.round
\tgttPerMinRawDisplay: string // v17 toFixed(1)
\tmlPerHourDisplay: string
}

export interface PlanBGolden {
\tweightKg: number
\ttotalMlDisplay: number // v17 toFixed(0)
\ttotalMlExact: number
\tmlPerHourDisplay: string
\toverHours: number
}

export interface PlanCStage {
\tmlPerKg: number
\tvolumeMl: number
\thours: number
\tmlPerHourDisplay: string
}
export interface PlanCGolden {
\tweightKg: number
\tageCategory: "bayi" | "anak"
\ttotalMl: number
\tstage1: PlanCStage
\tstage2: PlanCStage
\ttotalHours: number
}

export const fluidGoldenMeta = ${JSON.stringify(g._meta, null, 2)} as const

export const maintenanceGolden: MaintenanceGolden[] = ${JSON.stringify(g.maintenance, null, 2)}

export const dripGolden: DripGolden[] = ${JSON.stringify(g.drip, null, 2)}

export const planBGolden: PlanBGolden[] = ${JSON.stringify(g.planB, null, 2)}

export const planCGolden: PlanCGolden[] = ${JSON.stringify(g.planC, null, 2)}
`;
fs.writeFileSync(path.join(REF_DIR, "fluids.golden.ts"), ts);

// ---------- fluids.md ----------
let md = `# Reference Outputs \u2014 Fluids (Cairan)\n\n`;
md += `> Ditangkap dari **v17 asli** (frozen ${g._meta.frozenAt}, sha256 \`${g._meta.sha256.slice(0, 16)}\u2026\`) dengan menjalankan fungsinya langsung via headless browser. **Jangan diedit manual.**\n\n`;
md += `## 1. Cairan Rumatan (Holliday\u2013Segar) \u2014 \`hitungKebutuhanCairan\`\n\n`;
md += `| Berat (kg) | Total (mL/hari) | \u2248 mL/jam |\n|---|---|---|\n`;
for (const m of g.maintenance) md += `| ${m.weightKg} | ${m.totalMlPerDay} | ${m.mlPerHourDisplay} |\n`;
md += `\n## 2. Faktor Tetes \u2014 \`hitungFaktorTetes\`\n\n`;
md += `| Volume (mL) | Lama (jam) | Drip | Faktor (gtt/mL) | tetes/menit | (raw) | mL/jam |\n|---|---|---|---|---|---|---|\n`;
for (const d of g.drip) md += `| ${d.volumeMl} | ${d.hours} | ${d.dripType} | ${d.dropFactor} | ${d.gttPerMin} | ${d.gttPerMinRawDisplay} | ${d.mlPerHourDisplay} |\n`;
md += `\n## 3. Rencana B (rehidrasi 3 jam) \u2014 \`hitungRencanaB\`\n\n`;
md += `| Berat (kg) | Total (mL) | \u2248 mL/jam | Durasi |\n|---|---|---|---|\n`;
for (const b of g.planB) md += `| ${b.weightKg} | ${b.totalMlDisplay} | ${b.mlPerHourDisplay} | ${b.overHours} jam |\n`;
md += `\n## 4. Rencana C (rehidrasi bertahap) \u2014 \`hitungRencanaC\`\n\n`;
md += `| Berat (kg) | Usia | Total (mL) | Tahap 1 (vol @ laju) | Tahap 2 (vol @ laju) | Total jam |\n|---|---|---|---|---|---|\n`;
for (const c of g.planC) md += `| ${c.weightKg} | ${c.ageCategory} | ${c.totalMl} | ${c.stage1.volumeMl} mL @ ${c.stage1.mlPerHourDisplay} mL/jam (${c.stage1.hours} j) | ${c.stage2.volumeMl} mL @ ${c.stage2.mlPerHourDisplay} mL/jam (${c.stage2.hours} j) | ${c.totalHours} |\n`;
fs.writeFileSync(path.join(REF_DIR, "fluids.md"), md);
console.log("OK wrote fluids.golden.ts and fluids.md");
