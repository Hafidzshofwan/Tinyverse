// P0: derive structured golden vectors from captured v17 output, with cross-check.
// Portable: all paths resolved relative to this script's location.
const fs = require("fs");
const path = require("path");
const HERE = __dirname;
const REF_DIR = path.resolve(HERE, "../reference-outputs");

const data = JSON.parse(fs.readFileSync(path.join(HERE, "raw-capture.json"), "utf8"));
const errors = [];
function find(calc, label) {
  return data.results.find((r) => r.calc === calc && r.label === label);
}
function check(cond, msg) {
  if (!cond) errors.push(msg);
}

// ---- Maintenance (Holliday-Segar) ----
const maintenance = [5, 8, 10, 12.5, 15, 20, 25, 30].map((bb) => {
  let total;
  if (bb <= 10) total = bb * 100;
  else if (bb <= 20) total = 1000 + (bb - 10) * 50;
  else total = 1500 + (bb - 20) * 20;
  const perHour = total / 24;
  const r = find("maintenance", `BB ${bb} kg`);
  check(!!r, `maintenance BB ${bb} not found`);
  check(r && r.output.dosis === `${total.toFixed(0)} ml/hari`, `maint ${bb} dosis: got ${r && r.output.dosis}`);
  check(r && r.output.text.includes(`\u2248 ${perHour.toFixed(1)} ml/jam`), `maint ${bb} perHour: ${r && r.output.text}`);
  return { weightKg: bb, totalMlPerDay: Number(total.toFixed(0)), mlPerHourDisplay: perHour.toFixed(1) };
});

// ---- Drip factor ----
const dripInputs = [
  { vol: 500, jam: 8, drip: "makro", label: "500mL/8j makro" },
  { vol: 1000, jam: 24, drip: "makro", label: "1000mL/24j makro" },
  { vol: 100, jam: 1, drip: "mikro", label: "100mL/1j mikro" },
  { vol: 500, jam: 8, drip: "mikro", label: "500mL/8j mikro" },
];
const drip = dripInputs.map((d) => {
  const faktor = d.drip === "mikro" ? 60 : 20;
  const lamaMenit = d.jam * 60;
  const mlPerJam = d.vol / d.jam;
  const tetes = (d.vol * faktor) / lamaMenit;
  const bulat = Math.round(tetes);
  const r = find("drip", d.label);
  check(!!r, `drip ${d.label} not found`);
  check(r && r.output.dosis === `${bulat} tetes/menit`, `drip ${d.label} dosis: got ${r && r.output.dosis}`);
  check(r && r.output.text.includes(`\u2248 ${mlPerJam.toFixed(1)} mL/jam`), `drip ${d.label} mlPerJam`);
  check(r && r.output.text.includes(`= ${tetes.toFixed(1)} tetes/menit`), `drip ${d.label} raw tetes`);
  return {
    volumeMl: d.vol,
    hours: d.jam,
    dripType: d.drip,
    dropFactor: faktor,
    gttPerMin: bulat,
    gttPerMinRawDisplay: tetes.toFixed(1),
    mlPerHourDisplay: mlPerJam.toFixed(1),
  };
});

// ---- Plan B ----
const planB = [8, 12.5, 15].map((bb) => {
  const total = bb * 75;
  const perHour = total / 3;
  const r = find("planB", `BB ${bb} kg`);
  check(!!r, `planB BB ${bb} not found`);
  check(r && r.output.dosis === `${total.toFixed(0)} mL`, `planB ${bb} dosis: got ${r && r.output.dosis}`);
  check(r && r.output.text.includes(`\u2248 ${perHour.toFixed(1)} mL/jam`), `planB ${bb} perHour`);
  return { weightKg: bb, totalMlDisplay: Number(total.toFixed(0)), totalMlExact: total, mlPerHourDisplay: perHour.toFixed(1), overHours: 3 };
});

// ---- Plan C ----
const planCInputs = [
  { bb: 8, cat: "bayi", t1: 1, t2: 5, total: 6 },
  { bb: 15, cat: "anak", t1: 0.5, t2: 2.5, total: 3 },
];
const planC = planCInputs.map((c) => {
  const v1 = c.bb * 30;
  const v2 = c.bb * 70;
  const vt = c.bb * 100;
  const r1 = v1 / c.t1;
  const r2 = v2 / c.t2;
  const label = `BB ${c.bb} kg ${c.cat}`;
  const r = find("planC", label);
  check(!!r, `planC ${label} not found`);
  check(r && r.output.dosis === `${vt.toFixed(0)} mL`, `planC ${label} dosis: got ${r && r.output.dosis}`);
  check(r && r.output.text.includes(`${v1.toFixed(0)} mL`), `planC ${label} v1`);
  check(r && r.output.text.includes(`\u2248 ${r1.toFixed(1)} mL/jam`), `planC ${label} r1`);
  check(r && r.output.text.includes(`${v2.toFixed(0)} mL`), `planC ${label} v2`);
  check(r && r.output.text.includes(`\u2248 ${r2.toFixed(1)} mL/jam`), `planC ${label} r2`);
  return {
    weightKg: c.bb,
    ageCategory: c.cat,
    totalMl: vt,
    stage1: { mlPerKg: 30, volumeMl: v1, hours: c.t1, mlPerHourDisplay: r1.toFixed(1) },
    stage2: { mlPerKg: 70, volumeMl: v2, hours: c.t2, mlPerHourDisplay: r2.toFixed(1) },
    totalHours: c.total,
  };
});

if (errors.length) {
  console.error("CROSS-CHECK FAILED:\n" + errors.join("\n"));
  process.exit(1);
}

const golden = {
  _meta: {
    source: "tinyverse-revisi-v17-interaksi-template.html",
    sha256: "2188dae3bb2e4671efcae9518d2ad1dbd4193f2bbc6159e6e764d64e5887e3af",
    frozenAt: "2026-07-12",
    method: "Playwright headless execution of v17's own functions; cross-checked against v17 formulas",
    note: "Do not hand-edit. Regenerate via baseline/capture/capture-fluids.js + gen-golden.js against the frozen snapshot.",
  },
  maintenance,
  drip,
  planB,
  planC,
};
fs.mkdirSync(REF_DIR, { recursive: true });
fs.writeFileSync(path.join(REF_DIR, "fluids.reference.json"), JSON.stringify(golden, null, 2));
console.log("CROSS-CHECK PASSED. Golden reference written.");
console.log(`maintenance: ${maintenance.length}, drip: ${drip.length}, planB: ${planB.length}, planC: ${planC.length}`);
