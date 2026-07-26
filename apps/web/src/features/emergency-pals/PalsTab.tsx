"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { computePals } from "@/entities/emergency";
import {
  PillCapsuleIcon,
  HeartBeatPulseIcon,
  LightningShockIcon,
  LungsIcon,
  IvFluidBagIcon,
  SyringeInfiltrationIcon,
  EmergencyDrugIcon,
  BookRefIcon,
  AlertWarnIcon,
  DrugEpiIvIcon,
  DrugEpiEtIcon,
  DrugAmiodaroneIcon,
  DrugLidocaineIcon,
  DrugAdenosine1Icon,
  DrugAdenosine2Icon,
  DrugAtropineIcon,
  DrugMgSO4Icon,
  DrugCaGluconateIcon,
  DrugNaBicarbIcon,
  EnergyDefibIcon,
  EnergyCardioversionIcon,
  DeviceEttCuffedIcon,
  DeviceEttUncuffedIcon,
  DeviceEttDepthIcon,
  DeviceSuctionCatheterIcon,
  DeviceLaryngoscopeIcon,
  FluidIsotonicSalineIcon,
  FluidPediatricBolusIcon,
  DrugKetamineIcon,
  DrugMidazolamIcon,
  DrugFentanylIcon,
  DrugRocuroniumIcon,
  DrugSuccinylcholineIcon,
} from "@/shared/ui";

interface PalsRow {
  label: string;
  note?: string;
  ref?: string;
  value: string;
  icon?: ReactNode;
}
interface PalsCat {
  head: ReactNode;
  rows: PalsRow[];
}

const DASH = "\u2013";

function num(v: number, dec: number): string {
  const p = Math.pow(10, dec);
  return (Math.round(v * p) / p).toFixed(dec).replace(".", ",");
}

export function PalsTab({
  bb,
  ub,
}: {
  bb: number | null;
  ub: number | null;
}) {
  const r = computePals({ bb, ub });

  const valid = bb != null && isFinite(bb) && bb > 0;
  const d = (
    perKg: number,
    o?: { maks?: number; dec?: number; unit?: string },
  ): string => {
    if (!valid || bb == null) return DASH;
    const dec = o?.dec ?? 1;
    const unit = o?.unit ?? "mg";
    let v = perKg * bb;
    if (o?.maks != null) v = Math.min(v, o.maks);
    return num(v, dec) + " " + unit;
  };
  const dr = (
    lo: number,
    hi: number,
    o?: { maks?: number; dec?: number; unit?: string },
  ): string => {
    if (!valid || bb == null) return DASH;
    const dec = o?.dec ?? 1;
    const unit = o?.unit ?? "mg";
    let vlo = lo * bb;
    let vhi = hi * bb;
    if (o?.maks != null) {
      vlo = Math.min(vlo, o.maks);
      vhi = Math.min(vhi, o.maks);
    }
    return num(vlo, dec) + "\u2013" + num(vhi, dec) + " " + unit;
  };

  // Semua kategori awalnya tertutup; ketuk judul untuk membuka.
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  const cats: PalsCat[] = [
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <PillCapsuleIcon size={18} /> Obat Emergensi
        </span>
      ),
      rows: [
        {
          label: "Epinefrin (IV/IO)",
          note: "0,01 mg/kg \u00B7 sediaan 1:10.000 (0,1 mL/kg) \u00B7 ulang tiap 3\u20135 mnt \u00B7 maks 1 mg",
          ref: "AHA PALS 2020",
          value: r.epi,
          icon: <DrugEpiIvIcon size={18} />,
        },
        {
          label: "Epinefrin (ET / via ETT)",
          note: "0,1 mg/kg \u00B7 sediaan 1:1.000 (0,1 mL/kg) \u00B7 HANYA bila akses IV/IO belum ada \u00B7 bilas NaCl 0,9% lalu ventilasi",
          ref: "AHA PALS 2020",
          value: r.epiET,
          icon: <DrugEpiEtIcon size={18} />,
        },
      ],
    },
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <HeartBeatPulseIcon size={18} /> Obat Henti Jantung &amp; Aritmia
        </span>
      ),
      rows: [
        {
          label: "Amiodaron",
          note: "5 mg/kg IV/IO bolus (VF/VT tanpa nadi) \u00B7 boleh ulang s/d 15 mg/kg \u00B7 maks 300 mg/dosis",
          ref: "AHA PALS 2020",
          value: d(5, { maks: 300, dec: 0 }),
          icon: <DrugAmiodaroneIcon size={18} />,
        },
        {
          label: "Lidokain",
          note: "1 mg/kg IV/IO bolus (alternatif amiodaron pada VF/VT tanpa nadi)",
          ref: "AHA PALS 2020",
          value: d(1, { maks: 100, dec: 1 }),
          icon: <DrugLidocaineIcon size={18} />,
        },
        {
          label: "Adenosin \u2014 dosis ke-1",
          note: "0,1 mg/kg IV cepat + bilas NaCl (SVT) \u00B7 maks 6 mg",
          ref: "AHA PALS 2020",
          value: d(0.1, { maks: 6, dec: 2 }),
          icon: <DrugAdenosine1Icon size={18} />,
        },
        {
          label: "Adenosin \u2014 dosis ke-2",
          note: "0,2 mg/kg bila dosis ke-1 gagal \u00B7 maks 12 mg",
          ref: "AHA PALS 2020",
          value: d(0.2, { maks: 12, dec: 2 }),
          icon: <DrugAdenosine2Icon size={18} />,
        },
        {
          label: "Atropin",
          note: "0,02 mg/kg IV/IO (bradikardia simtomatik/blok AV) \u00B7 maks 0,5 mg/dosis \u00B7 boleh ulang 1\u00D7",
          ref: "AHA PALS 2020",
          value: d(0.02, { maks: 0.5, dec: 2 }),
          icon: <DrugAtropineIcon size={18} />,
        },
        {
          label: "Magnesium sulfat",
          note: "25\u201350 mg/kg IV/IO (torsades / hipomagnesemia) \u00B7 maks 2 g",
          ref: "AHA PALS 2020",
          value: dr(25, 50, { maks: 2000, dec: 0 }),
          icon: <DrugMgSO4Icon size={18} />,
        },
        {
          label: "Kalsium glukonas 10%",
          note: "60 mg/kg (0,6 mL/kg) IV lambat \u2014 hiperkalemia / hipokalsemia / OD Ca-blocker \u00B7 maks 2 g",
          ref: "Nelson ed.21",
          value:
            d(0.6, { maks: 20, dec: 1, unit: "mL" }) +
            " 10% (\u2248 " +
            d(60, { maks: 2000, dec: 0 }) +
            ")",
          icon: <DrugCaGluconateIcon size={18} />,
        },
        {
          label: "Natrium bikarbonat 8,4%",
          note: "1 mEq/kg IV/IO lambat \u2014 henti berkepanjangan / asidosis metabolik berat / hiperkalemia",
          ref: "AHA PALS 2020",
          value:
            d(1, { maks: 50, dec: 0, unit: "mEq" }) +
            " (\u2248 " +
            d(1, { maks: 50, dec: 0, unit: "mL" }) +
            ")",
          icon: <DrugNaBicarbIcon size={18} />,
        },
      ],
    },
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <LightningShockIcon size={18} /> Energi Listrik
        </span>
      ),
      rows: [
        {
          label: "Defibrilasi",
          note: "2 J/kg \u2192 4 J/kg (dosis berikutnya \u2265 4 J/kg, maks 10 J/kg atau dosis dewasa)",
          ref: "AHA PALS 2020",
          value: r.defib,
          icon: <EnergyDefibIcon size={18} />,
        },
        {
          label: "Kardioversi tersinkron",
          note: "0,5\u20131 J/kg \u2192 naikkan ke 2 J/kg bila perlu",
          ref: "AHA PALS 2020",
          value: r.kardio,
          icon: <EnergyCardioversionIcon size={18} />,
        },
      ],
    },
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <LungsIcon size={18} /> Jalan Napas &amp; Alat
        </span>
      ),
      rows: [
        {
          label: "ETT cuffed",
          note: "(usia thn / 4) + 3,5",
          ref: "AHA PALS 2020",
          value: r.ettC,
          icon: <DeviceEttCuffedIcon size={18} />,
        },
        {
          label: "ETT uncuffed",
          note: "(usia thn / 4) + 4",
          ref: "AHA PALS 2020",
          value: r.ettU,
          icon: <DeviceEttUncuffedIcon size={18} />,
        },
        {
          label: "Kedalaman ETT",
          note: "\u2248 diameter ETT \u00D7 3 (diukur di bibir)",
          ref: "AHA PALS 2020",
          value: r.ettDepth,
          icon: <DeviceEttDepthIcon size={18} />,
        },
        {
          label: "Kateter suction",
          note: "\u2248 diameter ETT \u00D7 2",
          ref: "AHA PALS 2020",
          value: r.suction,
          icon: <DeviceSuctionCatheterIcon size={18} />,
        },
        {
          label: "Bilah laringoskop",
          ref: "AHA PALS 2020",
          value: r.blade,
          icon: <DeviceLaryngoscopeIcon size={18} />,
        },
      ],
    },
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <IvFluidBagIcon size={18} /> Cairan Resusitasi
        </span>
      ),
      rows: [
        {
          label: "Bolus kristaloid isotonik",
          note: "20 mL/kg IV/IO cepat (NaCl 0,9% / Ringer Laktat) \u00B7 nilai ulang tiap bolus",
          ref: "AHA PALS 2020",
          value: d(20, { dec: 0, unit: "mL" }),
          icon: <FluidIsotonicSalineIcon size={18} />,
        },
        {
          label: "Bolus \u2014 neonatus / trauma / kardiogenik",
          note: "10 mL/kg untuk neonatus, trauma, syok kardiogenik, atau penyakit demam di fasilitas terbatas",
          ref: "WHO 2013",
          value: d(10, { dec: 0, unit: "mL" }),
          icon: <FluidPediatricBolusIcon size={18} />,
        },
      ],
    },
    {
      head: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <SyringeInfiltrationIcon size={18} /> Obat RSI / Intubasi
        </span>
      ),
      rows: [
        {
          label: "Ketamin (induksi)",
          note: "1\u20132 mg/kg IV \u00B7 pilihan pada syok / asma",
          ref: "Frank Shann 2017",
          value: dr(1, 2, { dec: 1 }),
          icon: <DrugKetamineIcon size={18} />,
        },
        {
          label: "Midazolam (sedasi)",
          note: "0,1\u20130,2 mg/kg IV",
          ref: "Frank Shann 2017",
          value: dr(0.1, 0.2, { maks: 10, dec: 2 }),
          icon: <DrugMidazolamIcon size={18} />,
        },
        {
          label: "Fentanil (analgesia)",
          note: "1\u20132 mcg/kg IV lambat",
          ref: "Frank Shann 2017",
          value: dr(1, 2, { dec: 0, unit: "mcg" }),
          icon: <DrugFentanylIcon size={18} />,
        },
        {
          label: "Rokuronium (pelumpuh otot)",
          note: "1 mg/kg IV \u00B7 non-depolarisasi",
          ref: "Nelson ed.21",
          value: d(1, { dec: 1 }),
          icon: <DrugRocuroniumIcon size={18} />,
        },
        {
          label: "Suksinilkolin (pelumpuh otot)",
          note: "1\u20132 mg/kg IV \u00B7 bayi cenderung 2 mg/kg",
          ref: "Nelson ed.21",
          value: dr(1, 2, { dec: 1 }),
          icon: <DrugSuccinylcholineIcon size={18} />,
        },
      ],
    },
  ];

  // Skema "seragam lembut": kartu putih dengan aksen garis kiri + emoji.
  const ACCENT = "#E11D2A";
  const catBox: CSSProperties = {
    background: "#fff",
    border: "1px solid #F1DADB",
    borderLeft: "4px solid " + ACCENT,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(42,10,12,0.04)",
  };
  const catHead: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "12px 14px",
    cursor: "pointer",
    background: "#fff",
    color: "#2A0A0C",
    fontWeight: 800,
    fontSize: 14,
    userSelect: "none",
  };
  const catBody: CSSProperties = { padding: "2px 14px 12px" };
  const refStyle: CSSProperties = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    color: "#B00C1A",
    opacity: 0.72,
    marginTop: 3,
    letterSpacing: 0.2,
  };
  const sumberBox: CSSProperties = {
    marginTop: 16,
    borderTop: "1px solid #FDECEC",
    paddingTop: 12,
    fontSize: 11,
    color: "#8a7f80",
    lineHeight: 1.5,
  };

  return (
    <div className="drt-panel">
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PillCapsuleIcon size={24} /> Dosis &amp; Alat (PALS)
      </h3>
      <p className="drt-sub">
        Otomatis dihitung dari Berat Badan &amp; usia pada Profil Pasien. Ketuk
        judul kategori untuk buka/tutup. Tiap baris mencantumkan sumber
        rujukannya.
      </p>
      {!r.hasBb ? (
        <div className="pals-warn" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertWarnIcon size={18} />
          <span>Berat Badan belum terisi di Profil Pasien — sebagian nilai belum dapat dihitung.</span>
        </div>
      ) : null}
      <div className="pals-grid">
        {cats.map((cat, i) => (
          <div style={catBox} key={i}>
            <div
              style={catHead}
              onClick={() => toggle(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggle(i);
              }}
            >
              <span>{cat.head}</span>
              <span
                style={{
                  color: "#B00C1A",
                  opacity: 0.6,
                  fontSize: 12,
                  transition: "transform .18s ease",
                  transform: open[i] ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                {"\u25BE"}
              </span>
            </div>
            {open[i] ? (
              <div style={catBody}>
                {cat.rows.map((row, j) => (
                  <div className="pals-row" key={j}>
                    <div className="pals-label" style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      {row.icon ? (
                        <span style={{ flexShrink: 0, marginTop: "2px", display: "inline-flex" }}>
                          {row.icon}
                        </span>
                      ) : null}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "13px" }}>{row.label}</div>
                        {row.note ? (
                          <span className="pals-note">{row.note}</span>
                        ) : null}
                        {row.ref ? (
                          <span style={refStyle}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <BookRefIcon size={12} /> {row.ref}
                            </span>
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="pals-val">{row.value}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={sumberBox}>
        <div
          style={{
            fontWeight: 800,
            color: "#B00C1A",
            marginBottom: 6,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <BookRefIcon size={16} /> Referensi
        </div>
        <div>
          {
            "1. American Heart Association. 2020 AHA Guidelines for CPR & ECC \u2014 Pediatric Advanced Life Support (PALS). Circulation. 2020;142(16 suppl 2):S469\u2013S523."
          }
        </div>
        <div>
          2. Kliegman RM, dkk. Nelson Textbook of Pediatrics. Edisi ke-21.
          Elsevier; 2020.
        </div>
        <div>
          3. World Health Organization. Pocket Book of Hospital Care for
          Children. Edisi ke-2. Jenewa: WHO; 2013.
        </div>
        <div>
          4. Shann F. Drug Doses. Edisi ke-17. Melbourne: Collective Pty Ltd;
          2017.
        </div>
        <div style={{ marginTop: 8, fontStyle: "italic", display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <AlertWarnIcon size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>
            Nilai dihitung dari BB &amp; usia sebagai alat bantu. Selalu verifikasi dosis, konsentrasi sediaan, dan indikasi sesuai protokol setempat sebelum pemberian.
          </span>
        </div>
      </div>
    </div>
  );
}
