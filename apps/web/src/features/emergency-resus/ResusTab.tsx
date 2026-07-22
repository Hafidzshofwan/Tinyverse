"use client";

import { useEffect, useRef, useState } from "react";
import { tambahLog } from "@/entities/emergency";
import type { ResusLogItem } from "@/entities/emergency";

function fmt(d: number): string {
  const m = Math.floor(d / 60);
  const s = d % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
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

  const mulaiRef = useRef(0);
  const siklusRef = useRef(120);
  const tickRef = useRef<number | null>(null);
  const alarmRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const elapsed = () => Math.floor((Date.now() - mulaiRef.current) / 1000);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (alarmRef.current) clearTimeout(alarmRef.current);
    };
  }, []);

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
  };

  const mulaiResus = () => {
    mulaiRef.current = Date.now();
    runningRef.current = true;
    setRunning(true);
    setLog([]);
    siklusRef.current = 120;
    setJam("00:00");
    setSiklus({ text: "Siklus berikutnya dalam 02:00", alarm: false });
    catat("Resusitasi dimulai");
    tickRef.current = window.setInterval(tick, 1000);
  };

  const selesaiResus = () => {
    if (!runningRef.current) return;
    catat("Resusitasi dihentikan");
    runningRef.current = false;
    setRunning(false);
    if (tickRef.current) clearInterval(tickRef.current);
    setSiklus({
      text:
        "Selesai \u00b7 total " +
        fmt(elapsed()) +
        " \u2014 salin atau simpan kronologi",
      alarm: false,
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

  return (
    <div className="drt-panel">
      <h3>⏱️ Timer & Pencatat Resusitasi</h3>
      <p className="drt-sub">
        Stopwatch dengan pengingat siklus 2 menit dan pencatat tindakan
        ber-timestamp otomatis.
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

      <div className="resus-quick">
        {QUICK.map((q) => (
          <button
            key={q.aksi}
            type="button"
            onClick={() => catat(q.aksi)}
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
      </div>
    </div>
  );
}
