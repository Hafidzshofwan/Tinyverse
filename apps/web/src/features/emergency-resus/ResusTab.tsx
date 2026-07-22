"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { tambahLog } from "@/entities/emergency";
import type { CSSProperties } from "react";
import type { ResusLogItem } from "@/entities/emergency";

function fmt(d: number): string {
  const m = Math.floor(d / 60);
  const s = d % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );
}

const QUICK = [
  { aksi: "Epinefrin diberikan", label: "💉 Epinefrin" },
  { aksi: "Syok / Defibrilasi", label: "⚡ Syok / Defibrilasi" },
  { aksi: "Cek nadi / ritme", label: "🩺 Cek Nadi / Ritme" },
  { aksi: "Intubasi", label: "💨 Intubasi" },
];

export function ResusTab({
  nama,
  noRm,
  bb,
}: {
  nama: string;
  noRm: string;
  bb: number | null;
}) {
  const [jam, setJam] = useState("00:00");
  const [siklus, setSiklus] = useState({
    text: "Tekan \u201cMulai\u201d untuk memulai pencatatan",
    alarm: false,
  });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<ResusLogItem[]>([]);
  const [catatan, setCatatan] = useState("");
  const [salinLabel, setSalinLabel] = useState("📋 Salin Kronologi");
  const [simpanLabel, setSimpanLabel] = useState("💾 Simpan ke Pasien");

  const [metroOn, setMetroOn] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [epiInterval, setEpiIntervalState] = useState(240);
  const [epiInfo, setEpiInfo] = useState<{ text: string; alarm: boolean } | null>(
    null,
  );

  const mulaiRef = useRef(0);
  const siklusRef = useRef(120);
  const tickRef = useRef<number | null>(null);
  const alarmRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const metroRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const epiRef = useRef(0);
  const epiAlarmRef = useRef(false);
  const epiIntervalRef = useRef(240);

  const elapsed = () => Math.floor((Date.now() - mulaiRef.current) / 1000);

  const ensureAudio = useCallback(() => {
    try {
      let ctx = audioCtxRef.current;
      if (!ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === "suspended") void ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  }, []);

  const beep = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 1000;
      const t0 = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.08);
    } catch {
      /* abaikan */
    }
  }, []);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (alarmRef.current) clearTimeout(alarmRef.current);
      if (metroRef.current) clearInterval(metroRef.current);
      const ctx = audioCtxRef.current;
      if (ctx) {
        try {
          void ctx.close();
        } catch {
          /* abaikan */
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!metroOn) return;
    beep();
    const id = window.setInterval(beep, Math.max(300, Math.round(60000 / bpm)));
    metroRef.current = id;
    return () => {
      clearInterval(id);
      metroRef.current = null;
    };
  }, [metroOn, bpm, beep]);

  const catat = (teks: string) => {
    if (!runningRef.current || !teks) return;
    setLog((prev) => [...prev, { jam: fmt(elapsed()), teks, t: Date.now() }]);
  };

  const tick = () => {
    const d = elapsed();
    setJam(fmt(d));
    if (d >= siklusRef.current) {
      siklusRef.current += 120;
      setSiklus({
        text: "\u23f0 Siklus 2 menit! Ganti kompresor & cek ritme",
        alarm: true,
      });
      try {
        if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
      } catch {
        /* abaikan */
      }
      if (alarmRef.current) clearTimeout(alarmRef.current);
      alarmRef.current = window.setTimeout(
        () => setSiklus((s) => ({ ...s, alarm: false })),
        8000,
      );
    } else {
      setSiklus((s) => {
        if (s.alarm) return s;
        return {
          text: "Siklus berikutnya dalam " + fmt(siklusRef.current - d),
          alarm: false,
        };
      });
    }

    if (epiRef.current > 0) {
      const sejak = Math.floor((Date.now() - epiRef.current) / 1000);
      const sisa = epiIntervalRef.current - sejak;
      if (sisa <= 0) {
        if (!epiAlarmRef.current) {
          epiAlarmRef.current = true;
          try {
            if (navigator.vibrate) navigator.vibrate([300, 120, 300]);
          } catch {
            /* abaikan */
          }
        }
        setEpiInfo({ text: "⏰ Saatnya dosis epinefrin berikutnya", alarm: true });
      } else {
        setEpiInfo({
          text: "💉 Epinefrin berikutnya dalam " + fmt(sisa),
          alarm: false,
        });
      }
    }
  };

  const mulaiResus = () => {
    mulaiRef.current = Date.now();
    runningRef.current = true;
    setRunning(true);
    setLog([]);
    siklusRef.current = 120;
    setJam("00:00");
    setSiklus({ text: "Siklus berikutnya dalam 02:00", alarm: false });
    epiRef.current = 0;
    epiAlarmRef.current = false;
    setEpiInfo(null);
    catat("Resusitasi dimulai");
    tickRef.current = window.setInterval(tick, 1000);
  };

  const selesaiResus = () => {
    if (!runningRef.current) return;
    catat("Resusitasi dihentikan");
    runningRef.current = false;
    setRunning(false);
    setMetroOn(false);
    if (tickRef.current) clearInterval(tickRef.current);
    setSiklus({
      text:
        "Selesai \u00b7 total " +
        fmt(elapsed()) +
        " \u2014 salin, simpan, atau cetak kronologi",
      alarm: false,
    });
  };

  const aksiCepat = (aksi: string) => {
    if (!runningRef.current) return;
    if (aksi === "Epinefrin diberikan") {
      epiRef.current = Date.now();
      epiAlarmRef.current = false;
      setEpiInfo({
        text: "💉 Epinefrin berikutnya dalam " + fmt(epiIntervalRef.current),
        alarm: false,
      });
    }
    catat(aksi);
  };

  const setEpi = (v: number) => {
    epiIntervalRef.current = v;
    setEpiIntervalState(v);
  };

  const toggleMetro = () => {
    setMetroOn((on) => {
      const next = !on;
      if (next) ensureAudio();
      return next;
    });
  };

  const catatKustom = () => {
    const v = catatan.trim();
    if (v) {
      catat(v);
      setCatatan("");
    }
  };

  const teksKronologi = () => {
    const head =
      "KRONOLOGI RESUSITASI\nPasien: " +
      (nama || "-") +
      (bb ? " (" + bb + " kg)" : "") +
      "\nNo. RM: " +
      (noRm || "-") +
      "\nTanggal: " +
      new Date().toLocaleString("id-ID") +
      "\n----------------------------------\n";
    const body = log.map((e) => e.jam + " " + e.teks).join("\n");
    return head + (body || "(tidak ada tindakan tercatat)");
  };

  const salin = () => {
    try {
      navigator.clipboard.writeText(teksKronologi());
    } catch {
      /* abaikan */
    }
    setSalinLabel("\u2713 Tersalin");
    window.setTimeout(() => setSalinLabel("📋 Salin Kronologi"), 1400);
  };

  const simpan = () => {
    tambahLog({
      tipe: "Resusitasi",
      pasien: nama || "-",
      noRm: noRm || "",
      durasi: log.length ? (log[log.length - 1]?.jam ?? "00:00") : "00:00",
      kronologi: teksKronologi(),
      t: Date.now(),
    });
    setSimpanLabel("\u2713 Tersimpan ke pasien");
    window.setTimeout(() => setSimpanLabel("💾 Simpan ke Pasien"), 1600);
  };

  const cetakLembarKode = () => {
    const win = window.open("", "_blank", "width=820,height=920");
    if (!win) return;
    const nEpi = log.filter((e) => e.teks === "Epinefrin diberikan").length;
    const nSyok = log.filter((e) => e.teks === "Syok / Defibrilasi").length;
    const totalDurasi = log.length ? (log[log.length - 1]?.jam ?? "00:00") : jam;
    const baris = log.length
      ? log
          .map(
            (e) =>
              "<tr><td class=\"j\">" +
              escapeHtml(e.jam) +
              "</td><td>" +
              escapeHtml(e.teks) +
              "</td></tr>",
          )
          .join("")
      : '<tr><td colspan="2" class="kosong">Tidak ada tindakan tercatat</td></tr>';
    const tgl = new Date().toLocaleString("id-ID");
    const html =
      '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">' +
      "<title>Lembar Kode Resusitasi</title><style>" +
      "*{box-sizing:border-box;}" +
      "body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#2A0A0C;margin:28px;}" +
      ".kop{display:flex;align-items:center;gap:12px;border-bottom:3px solid #E11D2A;padding-bottom:12px;}" +
      ".kop .logo{width:44px;height:44px;border-radius:12px;background:#E11D2A;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;}" +
      ".kop h1{font-size:20px;margin:0;color:#B00C1A;}" +
      ".kop p{margin:2px 0 0;font-size:12px;color:#8a7f80;}" +
      ".info{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:16px 0;font-size:13px;}" +
      ".info div{border-bottom:1px dotted #ddd;padding:4px 0;}" +
      ".info b{color:#8a7f80;font-weight:600;}" +
      ".ring{display:flex;gap:10px;margin:14px 0;}" +
      ".ring .kartu{flex:1;border:1px solid #FDECEC;border-radius:12px;padding:10px;text-align:center;}" +
      ".ring .angka{font-size:22px;font-weight:800;color:#E11D2A;}" +
      ".ring .ket{font-size:11px;color:#8a7f80;}" +
      "table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px;}" +
      "th{text-align:left;background:#FDECEC;color:#B00C1A;padding:8px;font-size:12px;}" +
      "td{padding:7px 8px;border-bottom:1px solid #eee;}" +
      "td.j{font-variant-numeric:tabular-nums;font-weight:700;width:70px;color:#B00C1A;}" +
      "td.kosong{text-align:center;color:#999;font-style:italic;}" +
      ".ttd{margin-top:36px;display:flex;justify-content:flex-end;}" +
      ".ttd .box{text-align:center;font-size:12px;}" +
      ".ttd .garis{margin-top:48px;border-top:1px solid #333;padding-top:4px;min-width:200px;}" +
      ".disc{margin-top:24px;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:8px;}" +
      "@media print{body{margin:12mm;}}" +
      "</style></head><body>" +
      '<div class="kop"><div class="logo">🚨</div><div><h1>Lembar Kode Resusitasi</h1><p>TinyVerse · Mode Darurat</p></div></div>' +
      '<div class="info">' +
      "<div><b>Nama/Inisial:</b> " +
      escapeHtml(nama || "-") +
      "</div>" +
      "<div><b>No. RM/ID:</b> " +
      escapeHtml(noRm || "-") +
      "</div>" +
      "<div><b>Berat Badan:</b> " +
      (bb ? escapeHtml(String(bb)) + " kg" : "-") +
      "</div>" +
      "<div><b>Tanggal & Jam:</b> " +
      escapeHtml(tgl) +
      "</div></div>" +
      '<div class="ring">' +
      '<div class="kartu"><div class="angka">' +
      escapeHtml(totalDurasi) +
      '</div><div class="ket">Total durasi</div></div>' +
      '<div class="kartu"><div class="angka">' +
      nEpi +
      '</div><div class="ket">Dosis epinefrin</div></div>' +
      '<div class="kartu"><div class="angka">' +
      nSyok +
      '</div><div class="ket">Syok/defibrilasi</div></div>' +
      '<div class="kartu"><div class="angka">' +
      log.length +
      '</div><div class="ket">Total kejadian</div></div>' +
      "</div>" +
      "<table><thead><tr><th>Waktu</th><th>Tindakan / Kejadian</th></tr></thead><tbody>" +
      baris +
      "</tbody></table>" +
      '<div class="ttd"><div class="box"><div>Dokumentasi oleh,</div><div class="garis">Nama &amp; Tanda tangan</div></div></div>' +
      '<div class="disc">⚠️ Lembar ini alat bantu dokumentasi &amp; penilaian cepat, bukan pengganti penilaian klinis. Verifikasi setiap tindakan, dosis, dan waktu sesuai protokol resusitasi yang berlaku.</div>' +
      "</body></html>";
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.setTimeout(() => {
      try {
        win.print();
      } catch {
        /* abaikan */
      }
    }, 350);
  };

  const kotak: CSSProperties = {
    border: "1px solid #FDECEC",
    background: "#fff",
    borderRadius: 14,
    padding: "10px 12px",
  };
  const judulKotak: CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "#2A0A0C",
    marginBottom: 6,
  };

  return (
    <div className="drt-panel">
      <h3>⏱️ Timer &amp; Pencatat Resusitasi</h3>
      <p className="drt-sub">
        Stopwatch + metronom CPR (100–120/menit), pengingat siklus 2 menit &amp;
        dosis epinefrin, pencatat tindakan ber-timestamp, dan cetak Lembar Kode.
      </p>

      <div className="resus-timer">
        <div className="resus-jam">{jam}</div>
        <div className={"resus-siklus" + (siklus.alarm ? " alarm" : "")}>
          {siklus.text}
        </div>
      </div>

      <div className="resus-ctrl">
        <button
          className="mulai"
          type="button"
          onClick={mulaiResus}
          disabled={running}
        >
          ▶️ Mulai Resusitasi
        </button>
        <button
          className="selesai"
          type="button"
          onClick={selesaiResus}
          disabled={!running}
        >
          ⏹️ Selesai
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "1fr 1fr",
          margin: "12px 0",
        }}
      >
        <div style={kotak}>
          <div style={judulKotak}>🥁 Metronom CPR</div>
          <button
            type="button"
            onClick={toggleMetro}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 10,
              fontWeight: 800,
              cursor: "pointer",
              border: metroOn ? "none" : "1px solid #E11D2A",
              background: metroOn ? "#1F9D55" : "#fff",
              color: metroOn ? "#fff" : "#E11D2A",
            }}
          >
            {metroOn ? "⏸️ Metronom aktif" : "▶️ Nyalakan metronom"}
          </button>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[100, 110, 120].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBpm(b)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: bpm === b ? "none" : "1px solid #f0c9cc",
                  background: bpm === b ? "#E11D2A" : "#fff",
                  color: bpm === b ? "#fff" : "#B00C1A",
                }}
              >
                {b}
              </button>
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#8a7f80",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {bpm}/menit · target 100–120
          </div>
        </div>

        <div style={kotak}>
          <div style={judulKotak}>💉 Interval epinefrin</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[180, 240, 300].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setEpi(s)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: epiInterval === s ? "none" : "1px solid #f0c9cc",
                  background: epiInterval === s ? "#E11D2A" : "#fff",
                  color: epiInterval === s ? "#fff" : "#B00C1A",
                }}
              >
                {s / 60} mnt
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 13,
              borderRadius: 10,
              padding: "8px 6px",
              background: epiInfo?.alarm ? "#E11D2A" : "#FDECEC",
              color: epiInfo?.alarm ? "#fff" : "#B00C1A",
            }}
          >
            {epiInfo ? epiInfo.text : "Tekan 💉 Epinefrin saat memberi dosis"}
          </div>
        </div>
      </div>

      <div className="resus-quick">
        {QUICK.map((q) => (
          <button
            key={q.aksi}
            type="button"
            onClick={() => aksiCepat(q.aksi)}
            disabled={!running}
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="resus-catatan-row">
        <input
          type="text"
          placeholder="Catatan tindakan lain…"
          value={catatan}
          disabled={!running}
          onChange={(e) => setCatatan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              catatKustom();
            }
          }}
        />
        <button type="button" onClick={catatKustom} disabled={!running}>
          + Catat
        </button>
      </div>

      <div className="resus-log">
        {log.length === 0 ? (
          <div className="log-kosong">Belum ada tindakan tercatat.</div>
        ) : (
          log.map((e, i) => (
            <div className="log-item" key={i}>
              <span className="log-jam">{e.jam}</span>
              <span className="log-teks">{e.teks}</span>
            </div>
          ))
        )}
      </div>

      <div className="resus-out-actions">
        <button className="salin" type="button" onClick={salin}>
          {salinLabel}
        </button>
        <button className="simpan" type="button" onClick={simpan}>
          {simpanLabel}
        </button>
        <button
          type="button"
          onClick={cetakLembarKode}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 800,
            cursor: "pointer",
            border: "1px solid #E11D2A",
            background: "#fff",
            color: "#E11D2A",
          }}
        >
          🖨️ Cetak Lembar Kode
        </button>
      </div>
    </div>
  );
}
