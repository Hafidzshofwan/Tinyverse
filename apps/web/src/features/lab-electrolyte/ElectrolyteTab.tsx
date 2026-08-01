"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { usePatientProfile, useSyncedField } from "@/shared/lib/patient";
import { NumberField } from "@/shared/ui";
import { addRingkasanItem } from "@/shared/lib/ringkasan";
import {
  KATALOG_ELEKTROLIT,
  derajatElektrolit,
  gangguanById,
  hitungLajuKoreksi,
  kalsiumTerkoreksi,
  perluAlbumin,
  perluDigoksin,
  perluJalurOral,
  perluPelacakLaju,
  perluStatusCairan,
  rencanaElektrolit,
  ringkasRencanaTeks,
} from "@/entities/lab";
import type {
  Baris,
  Derajat,
  GangguanId,
  JalurOral,
  JawabanAlur,
  Kronisitas,
  NadaBaris,
  Rencana,
  StatusCairan,
} from "@/entities/lab";

function num(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return isFinite(n) ? n : null;
}

// --- gaya -------------------------------------------------------------------

const TEKS_UTAMA = "var(--tv-text-primary, var(--tv-teks, #0a0b4f))";
const TEKS_LEMBUT = "var(--tv-text-secondary, var(--tv-soft-teks, #667085))";
const GARIS = "var(--tv-border, var(--tv-line, rgba(10,11,95,0.09)))";

const WARNA: Record<NadaBaris, { garis: string; latar: string; nama: string }> = {
  aksi: { garis: "#3B82F6", latar: "rgba(59,130,246,0.10)", nama: "Tatalaksana" },
  info: { garis: "#8497B0", latar: "rgba(132,151,176,0.10)", nama: "Catatan klinis" },
  bahaya: { garis: "#E08A0B", latar: "rgba(224,138,11,0.12)", nama: "Perhatian" },
  blokir: { garis: "#EF4444", latar: "rgba(239,68,68,0.12)", nama: "Kontraindikasi" },
};

const gayaChip: CSSProperties = {
  display: "inline-block",
  fontSize: "10.5px",
  lineHeight: 1.35,
  padding: "3px 8px",
  marginRight: "5px",
  marginTop: "5px",
  borderRadius: "999px",
  border: "1px solid " + GARIS,
  color: TEKS_LEMBUT,
  textDecoration: "none",
};

const gayaPilihan = (aktif: boolean): CSSProperties => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "11px 13px",
  marginTop: "7px",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: aktif ? 700 : 500,
  border: aktif ? "2px solid var(--tv-navy-2, #0A0B5F)" : "1px solid " + GARIS,
  background: aktif ? "var(--tv-hover, rgba(10,11,95,0.05))" : "var(--tv-card, #FFFFFF)",
  color: TEKS_UTAMA,
});

const gayaTanya: CSSProperties = {
  fontSize: "14.5px",
  fontWeight: 700,
  lineHeight: 1.4,
  color: TEKS_UTAMA,
};

const gayaBantu: CSSProperties = {
  fontSize: "11.5px",
  lineHeight: 1.5,
  marginTop: "4px",
  color: TEKS_LEMBUT,
};

// --- potongan tampilan ------------------------------------------------------

function Sumber({ daftar }: { daftar: Baris["sumber"] }) {
  if (daftar.length === 0) return null;
  return (
    <div>
      {daftar.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer" style={gayaChip}>
          {s.label}
        </a>
      ))}
    </div>
  );
}

function KartuBaris({ x }: { x: Baris }) {
  const w = WARNA[x.nada];
  return (
    <div
      style={{
        borderLeft: "3px solid " + w.garis,
        background: w.latar,
        borderRadius: "12px",
        padding: "11px 13px",
        marginTop: "9px",
      }}
    >
      <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.06em", color: w.garis, textTransform: "uppercase" }}>
        {w.nama}
      </div>
      <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "3px", color: TEKS_UTAMA, lineHeight: 1.4 }}>{x.judul}</div>
      <div style={{ fontSize: "12.5px", marginTop: "4px", lineHeight: 1.6, color: TEKS_UTAMA }}>{x.isi}</div>
      <Sumber daftar={x.sumber} />
    </div>
  );
}

function KartuDerajat({ d }: { d: Derajat | null }) {
  if (d == null) return null;
  const w = WARNA[d.nada];
  return (
    <div
      style={{
        border: "1.5px solid " + w.garis,
        background: w.latar,
        borderRadius: "14px",
        padding: "12px 14px",
        marginTop: "12px",
      }}
    >
      <div style={{ fontSize: "14.5px", fontWeight: 800, color: TEKS_UTAMA }}>{d.label}</div>
      <div style={{ fontSize: "12px", marginTop: "3px", color: TEKS_LEMBUT }}>Rentang: {d.rentang}</div>
      {d.catatan != null && (
        <div style={{ fontSize: "12.5px", marginTop: "6px", lineHeight: 1.6, color: TEKS_UTAMA }}>{d.catatan}</div>
      )}
      <Sumber daftar={d.sumber} />
    </div>
  );
}

function Bagian({ judul, daftar }: { judul: string; daftar: Baris[] }) {
  if (daftar.length === 0) return null;
  return (
    <div style={{ marginTop: "16px" }}>
      <div className="dx-sub-h" style={{ color: TEKS_UTAMA }}>{judul}</div>
      {daftar.map((x, i) => (
        <KartuBaris key={judul + "-" + String(i)} x={x} />
      ))}
    </div>
  );
}

function Tanya({
  teks,
  bantu,
  anak,
}: {
  teks: string;
  bantu?: string;
  anak: ReactNode;
}) {
  return (
    <div>
      <div style={gayaTanya}>{teks}</div>
      {bantu != null && <div style={gayaBantu}>{bantu}</div>}
      <div style={{ marginTop: "10px" }}>{anak}</div>
    </div>
  );
}

function TombolRingkasan({ judul, teks }: { judul: string; teks: string }) {
  const [ditambahkan, setDitambahkan] = useState(false);
  return (
    <button
      type="button"
      className="tv-btn"
      style={{ background: "var(--tv-navy-2, #0A0B5F)", color: "var(--tv-card, #FFFFFF)", fontWeight: 700, marginTop: "14px" }}
      onClick={() => {
        addRingkasanItem({ title: judul, source: "Koreksi Elektrolit", body: teks });
        setDitambahkan(true);
        setTimeout(() => setDitambahkan(false), 2200);
      }}
    >
      {ditambahkan ? "Ditambahkan ke Ringkasan!" : "Tambahkan rencana ke Ringkasan"}
    </button>
  );
}

// --- alur -------------------------------------------------------------------

type LangkahId = "gangguan" | "angka" | "darurat" | "kronis" | "jalur" | "rencana" | "laju" | "pantau";

// --- pemilih gangguan: satu kartu per elektrolit, dua arah di dalamnya ------

type WarnaZat = { utama: string; muda: string; lambang: string };

const ZAT: Record<string, WarnaZat> = {
  Natrium: { utama: "#2563EB", muda: "#60A5FA", lambang: "Na" },
  Kalium: { utama: "#7C3AED", muda: "#A78BFA", lambang: "K" },
  "Kalsium total": { utama: "#0D9488", muda: "#2DD4BF", lambang: "Ca" },
  Magnesium: { utama: "#D97706", muda: "#FBBF24", lambang: "Mg" },
  Fosfat: { utama: "#DB2777", muda: "#F472B6", lambang: "PO₄" },
};

const ZAT_BAKU: WarnaZat = { utama: "#475569", muda: "#94A3B8", lambang: "?" };

function kabut(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

type ArahZat = { id: GangguanId; label: string; tanda: string; panah: string };
type Zat = { nama: string; satuan: string; w: WarnaZat; arah: ArahZat[] };

const KELOMPOK_ZAT: Zat[] = (() => {
  const keluar: Zat[] = [];
  for (const g of KATALOG_ELEKTROLIT) {
    let z = keluar.find((x) => x.nama === g.parameter);
    if (z == null) {
      z = { nama: g.parameter, satuan: g.satuan, w: ZAT[g.parameter] ?? ZAT_BAKU, arah: [] };
      keluar.push(z);
    }
    const turun = g.id.startsWith("hipo");
    z.arah.push({ id: g.id, label: g.label, tanda: turun ? "Rendah" : "Tinggi", panah: turun ? "↓" : "↑" });
  }
  return keluar;
})();

function KartuZat({ z, dipilih, pilih }: { z: Zat; dipilih: GangguanId | null; pilih: (id: GangguanId) => void }) {
  const [sorot, setSorot] = useState<string | null>(null);
  const [atas, setAtas] = useState(false);
  const aktif = z.arah.some((a) => a.id === dipilih);
  const w = z.w;
  return (
    <div
      onMouseEnter={() => setAtas(true)}
      onMouseLeave={() => setAtas(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "18px",
        padding: "14px 13px 13px",
        border: aktif ? "2px solid " + w.utama : "1px solid " + kabut(w.utama, 0.22),
        background:
          "linear-gradient(180deg, " + kabut(w.utama, aktif ? 0.16 : 0.08) + " 0%, " + kabut(w.utama, 0) + " 68%), var(--tv-card, #FFFFFF)",
        boxShadow: aktif
          ? "0 10px 24px " + kabut(w.utama, 0.28)
          : atas
            ? "0 8px 18px " + kabut(w.utama, 0.18)
            : "0 1px 3px rgba(10,11,95,0.06)",
        transform: aktif || atas ? "translateY(-2px)" : "none",
        transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, " + w.utama + ", " + w.muda + ")",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            flex: "0 0 auto",
            borderRadius: "13px",
            background: "linear-gradient(135deg, " + w.utama + ", " + w.muda + ")",
            boxShadow: "0 5px 12px " + kabut(w.utama, 0.38),
            color: "#FFFFFF",
            fontSize: "13.5px",
            fontWeight: 800,
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {w.lambang}
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: TEKS_UTAMA, lineHeight: 1.25 }}>
            {z.nama.replace(" total", "")}
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: "3px",
              padding: "1px 7px",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              background: kabut(w.utama, 0.14),
              color: w.utama,
            }}
          >
            {z.satuan}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        {z.arah.map((a) => {
          const on = a.id === dipilih;
          const hover = sorot === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => pilih(a.id)}
              onMouseEnter={() => setSorot(a.id)}
              onMouseLeave={() => setSorot(null)}
              style={{
                flex: 1,
                padding: "9px 8px",
                borderRadius: "13px",
                cursor: "pointer",
                textAlign: "center",
                border: on ? "1px solid transparent" : "1px solid " + kabut(w.utama, 0.28),
                background: on
                  ? "linear-gradient(135deg, " + w.utama + ", " + w.muda + ")"
                  : kabut(w.utama, hover ? 0.16 : 0.07),
                boxShadow: on ? "0 5px 14px " + kabut(w.utama, 0.32) : "none",
                color: on ? "#FFFFFF" : TEKS_UTAMA,
                transition: "background .16s ease, box-shadow .16s ease",
              }}
            >
              <div style={{ fontSize: "12.5px", fontWeight: 800 }}>
                <span style={{ marginRight: "3px", color: on ? "#FFFFFF" : w.utama }}>{a.panah}</span>
                {a.tanda}
              </div>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  marginTop: "2px",
                  color: on ? "rgba(255,255,255,0.88)" : TEKS_LEMBUT,
                }}
              >
                {a.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const JUDUL_LANGKAH: Record<LangkahId, string> = {
  gangguan: "Gangguan",
  angka: "Angka lab",
  darurat: "Kegawatan",
  kronis: "Kronisitas",
  jalur: "Jalur pemberian",
  rencana: "Tatalaksana",
  laju: "Laju koreksi",
  pantau: "Monitoring",
};

export function ElectrolyteTab() {
  const profile = usePatientProfile();
  const [bb, setBb] = useSyncedField(profile.bb);

  const [gangguan, setGangguan] = useState<GangguanId | null>(null);
  const [nilai, setNilai] = useState("");
  const [albumin, setAlbumin] = useState("");
  const [gejalaBerat, setGejalaBerat] = useState<boolean | null>(null);
  const [ekgAtauInstabil, setEkg] = useState<boolean | null>(null);
  const [digoksin, setDigoksin] = useState<boolean | null>(null);
  const [kronisitas, setKronisitas] = useState<Kronisitas | null>(null);
  const [statusCairan, setStatusCairan] = useState<StatusCairan | null>(null);
  const [oral, setOral] = useState<JalurOral | null>(null);
  const [posisi, setPosisi] = useState(0);

  const [lajuAwal, setLajuAwal] = useState("");
  const [lajuSekarang, setLajuSekarang] = useState("");
  const [lajuJam, setLajuJam] = useState("");

  const usiaBulan = profile.usiaBulan ?? null;
  const info = gangguanById(gangguan);

  const langkahAlur = useMemo<LangkahId[]>(() => {
    const s: LangkahId[] = ["gangguan", "angka", "darurat"];
    if (gangguan != null && perluStatusCairan(gangguan)) s.push("kronis");
    if (gangguan != null && perluJalurOral(gangguan)) s.push("jalur");
    s.push("rencana");
    if (gangguan != null && perluPelacakLaju(gangguan)) s.push("laju");
    s.push("pantau");
    return s;
  }, [gangguan]);

  const kini: LangkahId = langkahAlur[Math.min(posisi, langkahAlur.length - 1)] ?? "gangguan";

  const jawaban: JawabanAlur = {
    gangguan,
    bbKg: num(bb),
    nilai: num(nilai),
    usiaBulan,
    albuminGdl: num(albumin),
    gejalaBerat,
    ekgAtauInstabil,
    digoksin,
    kronisitas,
    statusCairan,
    oral,
  };

  const rencana: Rencana | null = useMemo(() => {
    if (kini === "gangguan" || kini === "angka" || kini === "darurat") return null;
    return rencanaElektrolit(jawaban);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kini, gangguan, bb, nilai, albumin, gejalaBerat, ekgAtauInstabil, digoksin, kronisitas, statusCairan, oral, usiaBulan]);

  const nilaiDinilai =
    gangguan === "hipoCa" && num(nilai) != null ? kalsiumTerkoreksi(num(nilai) as number, num(albumin)) : num(nilai);
  const derajat = gangguan != null ? derajatElektrolit(gangguan, nilaiDinilai, usiaBulan) : null;

  function langkahLengkap(id: LangkahId): boolean {
    if (id === "gangguan") return gangguan != null;
    if (id === "angka") return num(bb) != null && num(bb)! > 0 && num(nilai) != null;
    if (id === "darurat") {
      if (gejalaBerat == null || ekgAtauInstabil == null) return false;
      if (gangguan != null && perluDigoksin(gangguan) && digoksin == null) return false;
      return true;
    }
    if (id === "kronis") return kronisitas != null && statusCairan != null;
    if (id === "jalur") return oral != null;
    return true;
  }

  function bisaLanjut(): boolean {
    return langkahLengkap(kini);
  }

  // langkah sebelumnya selalu boleh dibuka; melompat ke depan hanya bila semua
  // langkah di antaranya sudah terisi lengkap.
  function bolehKe(tujuan: number): boolean {
    if (tujuan <= posisi) return true;
    for (let k = posisi; k < tujuan; k++) {
      const s = langkahAlur[k];
      if (s == null || !langkahLengkap(s)) return false;
    }
    return true;
  }

  function ulangi() {
    setGangguan(null);
    setNilai("");
    setAlbumin("");
    setGejalaBerat(null);
    setEkg(null);
    setDigoksin(null);
    setKronisitas(null);
    setStatusCairan(null);
    setOral(null);
    setLajuAwal("");
    setLajuSekarang("");
    setLajuJam("");
    setPosisi(0);
  }

  const hasilLaju =
    gangguan != null && perluPelacakLaju(gangguan)
      ? hitungLajuKoreksi({
          gangguan,
          awal: num(lajuAwal),
          sekarang: num(lajuSekarang),
          jam: num(lajuJam),
          kejang: gejalaBerat === true,
        })
      : null;

  return (
    <div className="kartu">
      {/* penanda langkah */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
        {langkahAlur.map((id, i) => {
          const lewat = i < posisi;
          const aktif = i === posisi;
          const boleh = bolehKe(i);
          return (
            <button
              key={id}
              type="button"
              disabled={!boleh}
              title={boleh ? "Buka langkah " + JUDUL_LANGKAH[id] : "Lengkapi dulu langkah sebelumnya"}
              onClick={() => {
                if (boleh) setPosisi(i);
              }}
              style={{
                fontSize: "10.5px",
                fontWeight: aktif ? 800 : 600,
                padding: "4px 10px",
                borderRadius: "999px",
                background: aktif ? "var(--tv-navy-2, #0A0B5F)" : lewat ? "var(--tv-hover, rgba(10,11,95,0.09))" : "transparent",
                color: aktif ? "var(--tv-card, #FFFFFF)" : lewat ? TEKS_UTAMA : TEKS_LEMBUT,
                border: aktif ? "1px solid transparent" : "1px solid " + GARIS,
                cursor: boleh ? "pointer" : "not-allowed",
                opacity: boleh ? 1 : 0.5,
                transition: "background .16s ease, color .16s ease, opacity .16s ease",
              }}
            >
              {String(i + 1)}. {JUDUL_LANGKAH[id]}
            </button>
          );
        })}
      </div>

      {kini === "gangguan" && (
        <Tanya
          teks="Gangguan elektrolit apa yang sedang dihadapi?"
          bantu="Pilih elektrolitnya lebih dulu, lalu arah gangguannya. Pertanyaan berikutnya menyesuaikan pilihan ini."
          anak={
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {KELOMPOK_ZAT.map((z) => (
                <KartuZat key={z.nama} z={z} dipilih={gangguan} pilih={setGangguan} />
              ))}
            </div>
          }
        />
      )}

      {kini === "angka" && info != null && (
        <Tanya
          teks={"Berapa " + info.parameter.toLowerCase() + " dan berat badannya?"}
          bantu="Berat badan diambil dari profil pasien aktif dan dipakai untuk seluruh perhitungan di alur ini."
          anak={
            <div>
              <NumberField label="Berat badan (kg)" value={bb} onValueChange={setBb} placeholder="mis. 12" />
              <NumberField
                label={info.parameter + " (" + info.satuan + ")"}
                value={nilai}
                onValueChange={setNilai}
                placeholder={info.contoh}
              />
              {perluAlbumin(info.id) && (
                <NumberField
                  label="Albumin (g/dL, opsional)"
                  value={albumin}
                  onValueChange={setAlbumin}
                  placeholder="untuk koreksi"
                />
              )}
              {usiaBulan == null && (
                <div style={{ ...gayaBantu, marginTop: "8px" }}>
                  Usia pasien belum terisi di profil. Beberapa penilaian yang bergantung usia akan ditampilkan seadanya.
                </div>
              )}
              <KartuDerajat d={derajat} />
            </div>
          }
        />
      )}

      {kini === "darurat" && (
        <div>
          <Tanya
            teks="Apakah ada kejang atau penurunan kesadaran?"
            bantu="Jawaban ini menentukan apakah alur masuk ke jalur kegawatan atau jalur bertahap."
            anak={
              <div>
                <button type="button" style={gayaPilihan(gejalaBerat === true)} onClick={() => setGejalaBerat(true)}>
                  Ya, ada kejang atau kesadaran menurun
                </button>
                <button type="button" style={gayaPilihan(gejalaBerat === false)} onClick={() => setGejalaBerat(false)}>
                  Tidak ada
                </button>
              </div>
            }
          />
          <div style={{ marginTop: "18px" }}>
            <Tanya
              teks="Ada perubahan EKG atau hemodinamik tidak stabil?"
              anak={
                <div>
                  <button type="button" style={gayaPilihan(ekgAtauInstabil === true)} onClick={() => setEkg(true)}>
                    Ya
                  </button>
                  <button type="button" style={gayaPilihan(ekgAtauInstabil === false)} onClick={() => setEkg(false)}>
                    Tidak
                  </button>
                </div>
              }
            />
          </div>
          {gangguan != null && perluDigoksin(gangguan) && (
            <div style={{ marginTop: "18px" }}>
              <Tanya
                teks="Apakah pasien memakai digoksin atau dicurigai keracunan digoksin?"
                bantu="Pertanyaan ini memblokir pemberian kalsium bila jawabannya ya."
                anak={
                  <div>
                    <button type="button" style={gayaPilihan(digoksin === true)} onClick={() => setDigoksin(true)}>
                      Ya, atau dicurigai
                    </button>
                    <button type="button" style={gayaPilihan(digoksin === false)} onClick={() => setDigoksin(false)}>
                      Tidak
                    </button>
                  </div>
                }
              />
            </div>
          )}
        </div>
      )}

      {kini === "kronis" && (
        <div>
          <Tanya
            teks="Sudah berapa lama gangguan ini berlangsung?"
            bantu="Batas 48 jam memisahkan gangguan akut dari kronis, dan menentukan seberapa ketat batas aman laju koreksinya."
            anak={
              <div>
                <button type="button" style={gayaPilihan(kronisitas === "akut")} onClick={() => setKronisitas("akut")}>
                  Akut, jelas kurang dari 48 jam
                </button>
                <button type="button" style={gayaPilihan(kronisitas === "kronis")} onClick={() => setKronisitas("kronis")}>
                  Kronis, lebih dari 48 jam
                </button>
                <button type="button" style={gayaPilihan(kronisitas === "takTahu")} onClick={() => setKronisitas("takTahu")}>
                  Tidak diketahui
                </button>
              </div>
            }
          />
          <div style={{ marginTop: "18px" }}>
            <Tanya
              teks="Bagaimana status cairan pasien?"
              bantu="Status cairan adalah kunci penentu penyebab sekaligus terapinya."
              anak={
                <div>
                  <button type="button" style={gayaPilihan(statusCairan === "hipovolemik")} onClick={() => setStatusCairan("hipovolemik")}>
                    Hipovolemik
                  </button>
                  <button type="button" style={gayaPilihan(statusCairan === "euvolemik")} onClick={() => setStatusCairan("euvolemik")}>
                    Euvolemik
                  </button>
                  <button type="button" style={gayaPilihan(statusCairan === "hipervolemik")} onClick={() => setStatusCairan("hipervolemik")}>
                    Hipervolemik
                  </button>
                </div>
              }
            />
          </div>
        </div>
      )}

      {kini === "jalur" && (
        <Tanya
          teks="Apakah jalur oral atau enteral bisa dipakai?"
          bantu="Jalur oral diutamakan. Jalur intravena hanya muncul bila jalur oral memang tidak bisa dipakai."
          anak={
            <div>
              <button type="button" style={gayaPilihan(oral === "bisa")} onClick={() => setOral("bisa")}>
                Bisa, pasien toleran jalur enteral
              </button>
              <button type="button" style={gayaPilihan(oral === "tidak")} onClick={() => setOral("tidak")}>
                Tidak bisa, atau kondisi menuntut jalur intravena
              </button>
            </div>
          }
        />
      )}

      {kini === "rencana" && rencana != null && info != null && (
        <div>
          <div style={gayaTanya}>Rencana untuk {info.label.toLowerCase()}</div>
          <KartuDerajat d={rencana.derajat} />
          <Bagian judul="Tatalaksana" daftar={rencana.langkah} />
          <Bagian judul="Batas aman & kewaspadaan" daftar={rencana.pagar} />
        </div>
      )}

      {kini === "laju" && (
        <Tanya
          teks="Pelacak laju koreksi"
          bantu="Masukkan natrium pada dua titik waktu untuk melihat laju yang benar-benar terjadi dan proyeksinya dalam 24 jam."
          anak={
            <div>
              <NumberField label="Natrium awal (mmol/L)" value={lajuAwal} onValueChange={setLajuAwal} placeholder="mis. 118" />
              <NumberField
                label="Natrium sekarang (mmol/L)"
                value={lajuSekarang}
                onValueChange={setLajuSekarang}
                placeholder="mis. 124"
              />
              <NumberField label="Selang waktu (jam)" value={lajuJam} onValueChange={setLajuJam} placeholder="mis. 6" />
              {hasilLaju != null && (
                <div>
                  <KartuBaris
                    x={{
                      nada: hasilLaju.nada,
                      judul:
                        "Laju " +
                        (Math.round(Math.abs(hasilLaju.perJam) * 100) / 100).toString() +
                        " mmol/L per jam, proyeksi 24 jam " +
                        (Math.round(Math.abs(hasilLaju.proyeksi24) * 10) / 10).toString() +
                        " mmol/L",
                      isi: hasilLaju.pesan,
                      sumber: hasilLaju.sumber,
                    }}
                  />
                </div>
              )}
            </div>
          }
        />
      )}

      {kini === "pantau" && rencana != null && info != null && (
        <div>
          <div style={gayaTanya}>Pemantauan dan titik rujukan</div>
          <Bagian judul="Monitoring" daftar={rencana.pemantauan} />
          <Bagian judul="Indikasi rujukan" daftar={rencana.rujuk} />
          <TombolRingkasan
            judul={info.label + " (" + info.parameter + " " + nilai + " " + info.satuan + ")"}
            teks={ringkasRencanaTeks(info.label, rencana)}
          />
        </div>
      )}

      {/* navigasi */}
      <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
        {posisi > 0 && (
          <button type="button" className="tv-btn" onClick={() => setPosisi(posisi - 1)}>
            Kembali
          </button>
        )}
        {posisi < langkahAlur.length - 1 && (
          <button
            type="button"
            className="btn-hitung"
            disabled={!bisaLanjut()}
            style={{ opacity: bisaLanjut() ? 1 : 0.45, cursor: bisaLanjut() ? "pointer" : "not-allowed" }}
            onClick={() => {
              if (bisaLanjut()) setPosisi(posisi + 1);
            }}
          >
            Lanjut
          </button>
        )}
        {posisi > 0 && (
          <button type="button" className="tv-btn" onClick={ulangi}>
            Ulangi dari awal
          </button>
        )}
      </div>

      <div style={{ ...gayaBantu, marginTop: "14px" }}>
        Setiap angka pada alur ini membawa sumbernya sendiri. Alur ini adalah alat bantu hitung dan pengingat urutan, bukan
        pengganti penilaian klinis.
      </div>
    </div>
  );
}
