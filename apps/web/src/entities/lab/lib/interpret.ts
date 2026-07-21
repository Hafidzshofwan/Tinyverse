import type { BandId, DxLine } from "../model/types";
import { bandLabel, esc, fmt, labByKey } from "./reference";

/**
 * Cek cepat satu nilai lab terhadap rujukan usia (port labCek v17).
 * html = konten dalam kotak dx-res.
 */
export function checkValue(
  band: BandId,
  key: string,
  v: number | null,
): DxLine {
  const t = labByKey(key);
  if (!t || v == null)
    return { cls: "dx-neutral", html: "Pilih parameter &amp; isi nilai hasil." };
  const r = t.r[band];
  let st: string;
  let cls: DxLine["cls"];
  if (v < r[0]) {
    st = "RENDAH \u2b07";
    cls = "dx-low";
  } else if (v > r[1]) {
    st = "TINGGI \u2b06";
    cls = "dx-high";
  } else {
    st = "NORMAL \u2713";
    cls = "dx-ok";
  }
  return {
    cls,
    html:
      "<b>" +
      esc(t.name) +
      " = " +
      fmt(v, 2) +
      " " +
      esc(t.unit) +
      '</b><span class="dx-badge" style="background:rgba(0,0,0,.06)">' +
      st +
      "</span><br>Rujukan (" +
      esc(bandLabel(band)) +
      "): " +
      fmt(r[0], 2) +
      " \u2013 " +
      fmt(r[1], 2) +
      " " +
      esc(t.unit),
  };
}

/** Interpretasi hitung darah (port labDarah v17). Kembalikan daftar baris. */
export function interpretCbc(
  band: BandId,
  hb: number | null,
  mcv: number | null,
  leu: number | null,
  tr: number | null,
): DxLine[] {
  const out: DxLine[] = [];
  const hbR = labByKey("hb")!.r[band];
  if (hb != null) {
    if (hb < hbR[0]) {
      const sev = hb < 7 ? "berat" : hb < 10 ? "sedang" : "ringan";
      let morf = "normositik";
      let kem = "penyakit kronis, perdarahan akut, hemolisis";
      if (mcv != null) {
        const mR = labByKey("mcv")!.r[band];
        if (mcv < mR[0]) {
          morf = "mikrositik";
          kem = "defisiensi besi, talasemia, penyakit kronis";
        } else if (mcv > mR[1]) {
          morf = "makrositik";
          kem = "defisiensi B12/folat, hipotiroid, penyakit hati";
        }
      }
      out.push({
        cls: "dx-low",
        html:
          "<b>Anemia " +
          sev +
          "</b> (Hb " +
          fmt(hb, 1) +
          " g/dL; rujukan \u2265" +
          hbR[0] +
          "). Morfologi: <b>" +
          morf +
          "</b> \u2192 pikirkan " +
          kem +
          ".",
      });
    } else if (hb > hbR[1]) {
      out.push({
        cls: "dx-high",
        html:
          "<b>Hb tinggi</b> (" +
          fmt(hb, 1) +
          " g/dL) \u2192 pikirkan hemokonsentrasi/polisitemia.",
      });
    } else {
      out.push({ cls: "dx-ok", html: "Hemoglobin normal (" + fmt(hb, 1) + " g/dL)." });
    }
  }
  if (leu != null) {
    const lR = labByKey("leuko")!.r[band];
    if (leu < lR[0])
      out.push({
        cls: "dx-low",
        html:
          "<b>Leukopenia</b> (" +
          fmt(leu, 1) +
          ") \u2192 infeksi viral berat, supresi sumsum, sepsis.",
      });
    else if (leu > lR[1])
      out.push({
        cls: "dx-high",
        html:
          "<b>Leukositosis</b> (" +
          fmt(leu, 1) +
          ") \u2192 infeksi/inflamasi, stres.",
      });
    else out.push({ cls: "dx-ok", html: "Leukosit normal (" + fmt(leu, 1) + ")." });
  }
  if (tr != null) {
    if (tr < 150) {
      const s =
        tr < 20
          ? "berat (risiko perdarahan spontan)"
          : tr < 50
            ? "sedang"
            : "ringan";
      out.push({
        cls: "dx-low",
        html: "<b>Trombositopenia " + s + "</b> (" + fmt(tr, 0) + ").",
      });
    } else if (tr > 450)
      out.push({
        cls: "dx-high",
        html: "<b>Trombositosis</b> (" + fmt(tr, 0) + ") \u2192 reaktif/inflamasi.",
      });
    else out.push({ cls: "dx-ok", html: "Trombosit normal (" + fmt(tr, 0) + ")." });
  }
  return out;
}

const WASPADA = 'color:#8a2f26';

/** Koreksi natrium (port korNa v17). */
export function correctSodium(
  bb: number | null,
  na: number | null,
  tg: number | null,
): DxLine {
  if (bb == null || na == null)
    return { cls: "dx-neutral", html: "Isi berat badan &amp; natrium aktual." };
  if (na < 135) {
    const target = tg != null ? tg : 135;
    const def = 0.6 * bb * (target - na);
    return {
      cls: "dx-low",
      html:
        "<b>Dx</b> \u00b7 Hiponatremia (Na " +
        fmt(na, 1) +
        " mmol/L)<br><b>Target</b> \u00b7 " +
        fmt(target, 0) +
        " mmol/L \u00b7 defisit Na \u2248 " +
        fmt(def, 0) +
        " mmol<br><b>Dosis</b> \u00b7 bila simptomatik akut: NaCl 3% " +
        fmt(2 * bb, 0) +
        "\u2013" +
        fmt(4 * bb, 0) +
        ' mL (2\u20134 mL/kg)<br><span style="' +
        WASPADA +
        '"><b>Waspada</b> \u00b7 koreksi \u22648 mmol/L/24 jam (risiko mielinolisis)</span>',
    };
  } else if (na > 145) {
    const fwd = 0.6 * bb * (na / 145 - 1) * 1000;
    return {
      cls: "dx-high",
      html:
        "<b>Dx</b> \u00b7 Hipernatremia (Na " +
        fmt(na, 1) +
        " mmol/L)<br><b>Tindakan</b> \u00b7 ganti defisit cairan bebas \u2248 " +
        fmt(fwd, 0) +
        ' mL bertahap (+ rumatan)<br><span style="' +
        WASPADA +
        '"><b>Waspada</b> \u00b7 turunkan Na \u22640,5 mmol/L/jam (\u226410\u201312 mmol/L/24 jam)</span>',
    };
  }
  return { cls: "dx-ok", html: "<b>Natrium normal</b> \u00b7 " + fmt(na, 1) + " mmol/L" };
}

/** Koreksi kalium (port korK v17). */
export function correctPotassium(bb: number | null, k: number | null): DxLine {
  if (bb == null || k == null)
    return { cls: "dx-neutral", html: "Isi berat badan &amp; kalium aktual." };
  if (k < 3.5) {
    const dK = Math.min(1 * bb, 20);
    const dK2 = Math.min(2 * bb, 20);
    return {
      cls: "dx-low",
      html:
        "<b>Dx</b> \u00b7 Hipokalemia (K " +
        fmt(k, 1) +
        " mmol/L)<br><b>Dosis</b> \u00b7 KCl oral " +
        fmt(dK, 1) +
        "\u2013" +
        fmt(dK2, 1) +
        ' mmol/dosis (1\u20132 mmol/kg; maks 20 mmol/dosis, 5 mmol/kg/hari)<br><span style="' +
        WASPADA +
        '"><b>Waspada</b> \u00b7 utamakan oral. IV: \u22640,2 mmol/kg/jam (tanpa EKG) atau \u22640,5 (dengan EKG); perifer \u226440 mmol/L</span>',
    };
  } else if (k > 5.1) {
    return {
      cls: "dx-high",
      html:
        "<b>Dx</b> \u00b7 Hiperkalemia (K " +
        fmt(k, 1) +
        " mmol/L)<br><b>Tindakan</b> \u00b7 cek EKG segera<br><b>Terapi</b> \u00b7 Ca glukonas (stabilisasi) \u2192 insulin+glukosa / \u03b2-agonis / bikarbonat (shift) \u2192 diuretik / resin / dialisis (eliminasi)",
    };
  }
  return { cls: "dx-ok", html: "<b>Kalium normal</b> \u00b7 " + fmt(k, 1) + " mmol/L" };
}

/** Koreksi kalsium (port korCa v17). */
export function correctCalcium(
  ca: number | null,
  alb: number | null,
  bb: number | null,
): DxLine {
  if (ca == null) return { cls: "dx-neutral", html: "Isi kalsium total." };
  let corr = ca;
  let cLbl = "Ca " + fmt(ca, 1) + " mg/dL";
  if (alb != null) {
    corr = ca + 0.8 * (4 - alb);
    cLbl = "Ca terkoreksi " + fmt(corr, 1) + " mg/dL";
  }
  if (corr < 8.5) {
    const dose =
      bb != null
        ? "<br><b>Dosis</b> \u00b7 Ca glukonas 10% " +
          fmt(Math.min(1 * bb, 20), 1) +
          "\u2013" +
          fmt(Math.min(2 * bb, 20), 1) +
          " mL (1\u20132 mL/kg = elemental 10\u201320 mg/kg, maks 20 mL) IV pelan"
        : "<br><b>Dosis</b> \u00b7 isi berat badan untuk menghitung Ca glukonas";
    return {
      cls: "dx-low",
      html:
        "<b>Dx</b> \u00b7 Hipokalsemia (" +
        cLbl +
        ")" +
        dose +
        '<br><span style="' +
        WASPADA +
        '"><b>Waspada</b> \u00b7 IV pelan + monitor EKG; ekstravasasi berbahaya</span>',
    };
  } else if (corr > 10.8) {
    return {
      cls: "dx-high",
      html:
        "<b>Dx</b> \u00b7 Hiperkalsemia (" +
        cLbl +
        ")<br><b>Tindakan</b> \u00b7 hidrasi NaCl 0,9% \u00b1 terapi penyebab",
    };
  }
  return { cls: "dx-ok", html: "<b>Kalsium normal</b> \u00b7 " + cLbl };
}
