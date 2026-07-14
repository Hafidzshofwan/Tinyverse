// P0 baseline capture: run v17's ACTUAL fluid calculators headlessly and record outputs.
// Portable: paths resolved relative to this script. Requires: playwright + chromium.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const HERE = __dirname;

const FILE = "file://" + path.resolve(HERE, "../v17/tinyverse-v17.html");

// Representative test vectors covering all Holliday-Segar tiers, drip types, and rehydration plans.
const vectors = [
  // --- Maintenance fluids (Holliday-Segar) ---
  { calc: "maintenance", label: "BB 5 kg", inputs: { cairanBerat: "5" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 8 kg", inputs: { cairanBerat: "8" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 10 kg", inputs: { cairanBerat: "10" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 12.5 kg", inputs: { cairanBerat: "12.5" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 15 kg", inputs: { cairanBerat: "15" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 20 kg", inputs: { cairanBerat: "20" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 25 kg", inputs: { cairanBerat: "25" }, boxId: "hasilCairanBox" },
  { calc: "maintenance", label: "BB 30 kg", inputs: { cairanBerat: "30" }, boxId: "hasilCairanBox" },
  // --- Drip factor ---
  { calc: "drip", label: "500mL/8j makro", inputs: { tetesVolume: "500", tetesLamaJam: "8" }, drip: "makro", boxId: "hasilFaktorTetes" },
  { calc: "drip", label: "1000mL/24j makro", inputs: { tetesVolume: "1000", tetesLamaJam: "24" }, drip: "makro", boxId: "hasilFaktorTetes" },
  { calc: "drip", label: "100mL/1j mikro", inputs: { tetesVolume: "100", tetesLamaJam: "1" }, drip: "mikro", boxId: "hasilFaktorTetes" },
  { calc: "drip", label: "500mL/8j mikro", inputs: { tetesVolume: "500", tetesLamaJam: "8" }, drip: "mikro", boxId: "hasilFaktorTetes" },
  // --- Rehydration Plan B ---
  { calc: "planB", label: "BB 8 kg", inputs: { cairanBeratB: "8" }, boxId: "hasilRencanaB" },
  { calc: "planB", label: "BB 12.5 kg", inputs: { cairanBeratB: "12.5" }, boxId: "hasilRencanaB" },
  { calc: "planB", label: "BB 15 kg", inputs: { cairanBeratB: "15" }, boxId: "hasilRencanaB" },
  // --- Rehydration Plan C ---
  { calc: "planC", label: "BB 8 kg bayi", inputs: { cairanBeratC: "8" }, usiaC: "bayi", boxId: "hasilRencanaC" },
  { calc: "planC", label: "BB 15 kg anak", inputs: { cairanBeratC: "15" }, usiaC: "anak", boxId: "hasilRencanaC" },
];

const fnByCalc = {
  maintenance: "hitungKebutuhanCairan",
  drip: "hitungFaktorTetes",
  planB: "hitungRencanaB",
  planC: "hitungRencanaC",
};

(async () => {
  let browser;
  const launchOpts = { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] };
  try {
    browser = await chromium.launch(launchOpts);
  } catch (e) {
    const execPath = process.env.CHROMIUM_PATH || "/usr/bin/chromium";
    browser = await chromium.launch({ ...launchOpts, executablePath: execPath });
  }
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  await page.goto(FILE, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const results = [];
  for (const v of vectors) {
    const fn = fnByCalc[v.calc];
    const res = await page.evaluate(
      ({ v, fn }) => {
        for (const [id, val] of Object.entries(v.inputs)) {
          const el = document.getElementById(id);
          if (!el) return { error: "missing input #" + id };
          el.value = val;
        }
        if (v.drip) {
          document.querySelectorAll("#tetesDripTab .segmented-btn").forEach((b) => b.classList.remove("aktif"));
          const btn = document.querySelector('#tetesDripTab .segmented-btn[data-drip="' + v.drip + '"]');
          if (btn) btn.classList.add("aktif");
        }
        if (v.usiaC) {
          document.querySelectorAll("#cairanUsiaCTab .segmented-btn").forEach((b) => b.classList.remove("aktif"));
          const btn = document.querySelector('#cairanUsiaCTab .segmented-btn[data-usia-c="' + v.usiaC + '"]');
          if (btn) btn.classList.add("aktif");
        }
        if (typeof window[fn] !== "function") return { error: "missing fn " + fn };
        try {
          window[fn]();
        } catch (e) {
          return { error: "threw: " + String(e) };
        }
        const box = document.getElementById(v.boxId);
        if (!box) return { error: "missing box #" + v.boxId };
        const dosis = box.querySelector(".hasil-dosis");
        return {
          dosis: dosis ? dosis.innerText.trim() : null,
          text: box.innerText.replace(/\n{2,}/g, "\n").trim(),
        };
      },
      { v, fn }
    );
    results.push({ calc: v.calc, fn, label: v.label, inputs: v.inputs, drip: v.drip || null, usiaC: v.usiaC || null, output: res });
  }

  await browser.close();
  const out = { pageErrors, results };
  fs.writeFileSync(path.join(HERE, "raw-capture.json"), JSON.stringify(out, null, 2));
  console.log("Captured " + results.length + " vectors. pageErrors: " + pageErrors.length);
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
