"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { tambahLog } from "@/entities/emergency";
import type { ResusLogItem } from "@/entities/emergency";
import {
  ResusStopwatchIcon,
  EmergencyDrugIcon,
  DefibIcon,
  StethoscopeIcon,
  LungsIcon,
  MetronomeIcon,
  PlayTimerIcon,
  StopTimerIcon,
  MicVoiceIcon,
  SaveDataIcon,
  CopyDataIcon,
  PrintReportIcon,
} from "@/shared/ui";

type SpeechRecError = { error?: string };
type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onerror: ((e: SpeechRecError) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

// Item log lokal: ResusLogItem + waktu tindakan (durasi sejak mulai).
type LogItem = ResusLogItem & { lewat: string };

function fmt(d: number): string {
  const m = Math.floor(d / 60);
  const s = d % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function jamDevice(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => (n < 10 ? "0" : "") + n;
  return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
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
  { aksi: "Epinefrin diberikan", label: "Epinefrin", icon: <EmergencyDrugIcon size={16} /> },
  { aksi: "Syok / Defibrilasi", label: "Syok / Defibrilasi", icon: <DefibIcon size={16} /> },
  { aksi: "Cek nadi / ritme", label: "Cek Nadi / Ritme", icon: <StethoscopeIcon size={16} /> },
  { aksi: "Intubasi", label: "Intubasi", icon: <LungsIcon size={16} /> },
];

const VOICE_MAP: Array<{ kata: string[]; aksi: string }> = [
  { kata: ["epinefrin", "epi", "adrenalin"], aksi: "Epinefrin diberikan" },
  {
    kata: ["syok", "defib", "defibrilasi", "kejut"],
    aksi: "Syok / Defibrilasi",
  },
  { kata: ["nadi", "ritme", "cek nadi"], aksi: "Cek nadi / ritme" },
  { kata: ["intubasi", "tube", "napas buatan"], aksi: "Intubasi" },
];

const HT_LIST = [
  "Hipoksia",
  "Hipovolemia",
  "Ion Hidrogen (asidosis)",
  "Hipo-/Hiperkalemia",
  "Hipoglikemia",
  "Hipotermia",
  "Tension pneumothorax",
  "Tamponade jantung",
  "Toksin",
  "Trombosis (paru/koroner)",
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
  const [detik, setDetik] = useState(0);
  const [siklus, setSiklus] = useState({
    text: "Tekan \u201cMulai\u201d untuk memulai pencatatan",
    alarm: false,
  });
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogItem[]>([]);
  const [catatan, setCatatan] = useState("");
  const [salinLabel, setSalinLabel] = useState("Salin Kronologi");
  const [simpanLabel, setSimpanLabel] = useState("Simpan ke Pasien");

  const [metroOn, setMetroOn] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [epiInterval, setEpiIntervalState] = useState(240);
  const [epiInfo, setEpiInfo] = useState<{ text: string; alarm: boolean } | null>(
    null,
  );

  const [coachOpen, setCoachOpen] = useState(false);
  const [beat, setBeat] = useState(false);
  const [ratio, setRatio] = useState(30);
  const [compCount, setCompCount] = useState(0);
  const [ventFlash, setVentFlash] = useState(false);
  const [htChecked, setHtChecked] = useState<boolean[]>(() =>
    HT_LIST.map(() => false),
  );

  const [voiceOn, setVoiceOn] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceHeard, setVoiceHeard] = useState("");
  const [voiceErr, setVoiceErr] = useState("");
  const [voiceDiag, setVoiceDiag] = useState("");

  const mulaiRef = useRef(0);
  const siklusRef = useRef(120);
  const tickRef = useRef<number | null>(null);
  const alarmRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const epiRef = useRef(0);
  const epiAlarmRef = useRef(false);
  const epiIntervalRef = useRef(240);
  const compRef = useRef(0);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const voiceOnRef = useRef(false);

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
      voiceOnRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        /* abaikan */
      }
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
    const active = metroOn || coachOpen;
    if (!active) return;
    const interval = Math.max(300, Math.round(60000 / bpm));
    let flashT: number | undefined;
    const doBeat = () => {
      if (metroOn) beep();
      setBeat(true);
      if (flashT) clearTimeout(flashT);
      flashT = window.setTimeout(
        () => setBeat(false),
        Math.min(160, Math.round(interval * 0.45)),
      );
      if (coachOpen && runningRef.current) {
        compRef.current += 1;
        setCompCount(compRef.current);
        if (compRef.current % ratio === 0) {
          setVentFlash(true);
          window.setTimeout(() => setVentFlash(false), 1200);
        }
      }
    };
    doBeat();
    const id = window.setInterval(doBeat, interval);
    return () => {
      clearInterval(id);
      if (flashT) clearTimeout(flashT);
    };
  }, [metroOn, coachOpen, bpm, ratio, beep]);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    setVoiceSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    if (!coachOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCoachOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [coachOpen]);

  const catat = (teks: string) => {
    if (!runningRef.current || !teks) return;
    const now = Date.now();
    const lewatDetik = Math.max(0, Math.floor((now - mulaiRef.current) / 1000));
    setLog((prev) => [
      ...prev,
      { jam: jamDevice(now), teks, t: now, lewat: fmt(lewatDetik) },
    ]);
  };

  const tick = () => {
    const d = elapsed();
    setJam(fmt(d));
    setDetik(d);
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
        setEpiInfo({ text: "\u23f0 Saatnya dosis epinefrin berikutnya", alarm: true });
      } else {
        setEpiInfo({
          text: "\uD83D\uDC89 Epinefrin berikutnya dalam " + fmt(sisa),
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
    setDetik(0);
    setSiklus({ text: "Siklus berikutnya dalam 02:00", alarm: false });
    epiRef.current = 0;
    epiAlarmRef.current = false;
    setEpiInfo(null);
    compRef.current = 0;
    setCompCount(0);
    setVentFlash(false);
    setHtChecked(HT_LIST.map(() => false));
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
        text: "\uD83D\uDC89 Epinefrin berikutnya dalam " + fmt(epiIntervalRef.current),
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

  const bukaCoach = () => {
    compRef.current = 0;
    setCompCount(0);
    setVentFlash(false);
    setCoachOpen(true);
  };

  const prosesSuara = (txt: string) => {
    const low = txt.toLowerCase();
    setVoiceHeard(txt);
    const found = VOICE_MAP.find((v) => v.kata.some((k) => low.includes(k)));
    if (found) {
      aksiCepat(found.aksi);
    } else if (runningRef.current) {
      catat("\uD83C\uDF99\uFE0F " + txt);
    }
  };

  const mulaiSuara = async () => {
    setVoiceErr("");
    setVoiceDiag("");
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    const inFrame = window.top !== window.self;
    const secure = window.isSecureContext;
    if (!Ctor) {
      setVoiceErr(
        "Browser ini tidak mendukung pengenalan suara. Gunakan Chrome/Edge (Android/desktop) atau Safari (iOS).",
      );
      return;
    }
    if (!secure) {
      setVoiceErr("Halaman harus diakses lewat HTTPS agar mikrofon bisa dipakai.");
      return;
    }
    if (inFrame) {
      setVoiceErr(
        "Aplikasi sedang berjalan di dalam bingkai (iframe); Chrome memblokir mikrofon di sana. Buka situs langsung di tab tersendiri.",
      );
      return;
    }
    // Panggil getUserMedia PALING AWAL (sebelum await apa pun) agar aktivasi
    // gesture pengguna masih aktif -> prompt izin Chrome muncul, seperti Safari.
    const md = navigator.mediaDevices;
    if (md && md.getUserMedia) {
      try {
        const stream = await md.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        const nm = (err as { name?: string } | undefined)?.name ?? "";
        let permState = "?";
        try {
          const perms = (
            navigator as unknown as {
              permissions?: {
                query: (d: { name: string }) => Promise<{ state: string }>;
              };
            }
          ).permissions;
          if (perms?.query) {
            const st = await perms.query({ name: "microphone" });
            permState = st.state;
          }
        } catch {
          permState = "n/a";
        }
        let micCount = -1;
        try {
          const devs = await navigator.mediaDevices.enumerateDevices();
          micCount = devs.filter((d) => d.kind === "audioinput").length;
        } catch {
          /* abaikan */
        }
        setVoiceDiag(
          "Diagnostik \u2192 HTTPS: ya \u00b7 frame: tidak \u00b7 izin situs: " +
            permState +
            " \u00b7 mic terdeteksi: " +
            (micCount < 0 ? "?" : String(micCount)) +
            " \u00b7 error: " +
            (nm || "tak dikenal"),
        );
        if (
          nm === "NotFoundError" ||
          nm === "DevicesNotFoundError" ||
          micCount === 0
        ) {
          setVoiceErr(
            "Tidak ada mikrofon aktif yang terdeteksi. Pastikan mikrofon terpasang & aktif di Windows (Settings \u2192 System \u2192 Sound \u2192 Input).",
          );
        } else if (permState === "denied") {
          setVoiceErr(
            "Izin mikrofon untuk situs ini diblokir di Chrome. Klik ikon gembok \u2192 Site settings \u2192 Microphone \u2192 Allow, lalu muat ulang halaman.",
          );
        } else if (nm === "NotAllowedError" || nm === "SecurityError") {
          setVoiceErr(
            "Mikrofon diblokir di level sistem operasi (bukan di situs ini). Windows: Settings \u2192 Privacy & security \u2192 Microphone \u2192 aktifkan \u201cMicrophone access\u201d dan \u201cLet desktop apps access your microphone\u201d, pastikan Chrome diizinkan, lalu tutup & buka lagi Chrome.",
          );
        } else {
          setVoiceErr(
            "Mikrofon gagal diakses (" + (nm || "tak dikenal") + "). Lihat baris diagnostik.",
          );
        }
        return;
      }
    }
    try {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* abaikan */
      }
      const rec = new Ctor();
      rec.lang = "id-ID";
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (e: SpeechResultEvent) => {
        const res = e.results;
        const last = res[res.length - 1];
        const txt = last?.[0]?.transcript;
        if (txt) prosesSuara(txt);
      };
      rec.onerror = (ev: SpeechRecError) => {
        const err = ev?.error ?? "";
        if (err === "not-allowed" || err === "service-not-allowed") {
          setVoiceErr(
            "Izin mikrofon belum aktif. Ketuk ikon gembok/kamera di bilah alamat, pilih Izinkan untuk Mikrofon, lalu coba lagi.",
          );
          voiceOnRef.current = false;
          setVoiceOn(false);
        } else if (err === "audio-capture") {
          setVoiceErr("Mikrofon tidak terdeteksi pada perangkat ini.");
          voiceOnRef.current = false;
          setVoiceOn(false);
        } else if (err === "network") {
          setVoiceErr("Pengenalan suara membutuhkan koneksi internet aktif.");
        }
        // "no-speech" / "aborted" dibiarkan: akan dimulai ulang lewat onend.
      };
      rec.onend = () => {
        if (!voiceOnRef.current) return;
        window.setTimeout(() => {
          if (!voiceOnRef.current) return;
          try {
            rec.start();
          } catch {
            /* abaikan */
          }
        }, 350);
      };
      recognitionRef.current = rec;
      voiceOnRef.current = true;
      setVoiceOn(true);
      rec.start();
    } catch {
      setVoiceErr("Gagal memulai pengenalan suara. Coba lagi.");
      voiceOnRef.current = false;
      setVoiceOn(false);
    }
  };

  const hentiSuara = () => {
    voiceOnRef.current = false;
    setVoiceOn(false);
    try {
      recognitionRef.current?.stop();
    } catch {
      /* abaikan */
    }
  };

  const toggleSuara = () => {
    if (voiceOnRef.current) hentiSuara();
    else void mulaiSuara();
  };

  const toggleHt = (i: number) => {
    setHtChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
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
      "\n----------------------------------\n" +
      "Jam      Waktu    Tindakan\n";
    const body = log
      .map((e) => e.jam + "  +" + e.lewat + "  " + e.teks)
      .join("\n");
    return head + (body || "(tidak ada tindakan tercatat)");
  };

  const salin = () => {
    try {
      navigator.clipboard.writeText(teksKronologi());
    } catch {
      /* abaikan */
    }
    setSalinLabel("\u2713 Tersalin");
    window.setTimeout(() => setSalinLabel("Salin Kronologi"), 1400);
  };

  const simpan = () => {
    tambahLog({
      tipe: "Resusitasi",
      pasien: nama || "-",
      noRm: noRm || "",
      durasi: jam,
      kronologi: teksKronologi(),
      t: Date.now(),
    });
    setSimpanLabel("\u2713 Tersimpan ke pasien");
    window.setTimeout(() => setSimpanLabel("Simpan ke Pasien"), 1600);
  };

  const cetakLembarKode = () => {
    const win = window.open("", "_blank", "width=820,height=920");
    if (!win) return;
    const nEpi = log.filter((e) => e.teks === "Epinefrin diberikan").length;
    const nSyok = log.filter((e) => e.teks === "Syok / Defibrilasi").length;
    const totalDurasi = jam;
    const baris = log.length
      ? log
          .map(
            (e) =>
              "<tr><td class=\"j\">" +
              escapeHtml(e.jam) +
              " <span style=\"color:#8a7f80;font-weight:600\">+" +
              escapeHtml(e.lewat) +
              "</span></td><td>" +
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
      "td.j{font-variant-numeric:tabular-nums;font-weight:700;width:140px;color:#B00C1A;}" +
      "td.kosong{text-align:center;color:#999;font-style:italic;}" +
      ".ttd{margin-top:36px;display:flex;justify-content:flex-end;}" +
      ".ttd .box{text-align:center;font-size:12px;}" +
      ".ttd .garis{margin-top:48px;border-top:1px solid #333;padding-top:4px;min-width:200px;}" +
      ".disc{margin-top:24px;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:8px;}" +
      "@media print{body{margin:12mm;}}" +
      "</style></head><body>" +
      '<div class="kop"><div class="logo">\uD83D\uDEA8</div><div>' +
      "<h1>Lembar Kode Resusitasi</h1><p>TinyVerse \u00b7 Mode Darurat</p></div></div>" +
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
      '</div><div class="ket">Total kejadian</div></div></div>' +
      "<table><tr><th>Jam \u00b7 +durasi</th><th>Tindakan / Kejadian</th></tr>" +
      baris +
      "</table>" +
      '<div class="ttd"><div class="box"><div>Dokumentasi oleh,</div>' +
      '<div class="garis">Nama &amp; Tanda tangan</div></div></div>' +
      '<div class="disc">\u26A0\uFE0F Lembar ini alat bantu dokumentasi & penilaian cepat, bukan pengganti penilaian klinis. Verifikasi setiap tindakan, dosis, dan waktu sesuai protokol resusitasi yang berlaku.</div>' +
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
    marginBottom: 10,
  };
  const judulKotak: CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "#2A0A0C",
    marginBottom: 6,
  };
  const coachBtn: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    border: "none",
    color: "#fff",
    background: "linear-gradient(135deg,#E11D2A,#B00C1A)",
  };
  const overlay: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "linear-gradient(160deg,#B00C1A,#E11D2A 70%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "18px 16px",
    overflowY: "auto",
  };
  const coachQuick: CSSProperties = {
    padding: "10px 8px",
    borderRadius: 12,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
  };
  const caption: CSSProperties = { marginTop: 8, fontSize: 12, color: "#8a7f80" };
  const voiceWarn: CSSProperties = {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 600,
    color: "#B00C1A",
    background: "#FDECEC",
    border: "1px solid #f5cfd2",
    borderRadius: 10,
    padding: "8px 10px",
  };

  return (
    <div className="drt-panel">
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ResusStopwatchIcon size={24} /> Timer &amp; Pencatat Resusitasi
      </h3>
      <p className="drt-sub">
        Stopwatch + metronom CPR, CPR Coach layar penuh, catat tindakan lewat
        suara, pengingat siklus &amp; epinefrin, dan cetak Lembar Kode.
      </p>

      <div
        style={{
          textAlign: "center",
          margin: "8px 0 14px",
          padding: "16px 12px",
          borderRadius: 14,
          background: "#FFF5F5",
          border: "1px solid #ebdfe0",
          boxShadow: "0 2px 8px rgba(176, 12, 26, 0.05)",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#B00C1A",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            letterSpacing: "1px",
          }}
        >
          {jam}
        </div>
        <div
          style={
            siklus.alarm
              ? {
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  background: "#E11D2A",
                  borderRadius: 8,
                  padding: "4px 10px",
                  display: "inline-block",
                }
              : { marginTop: 8, fontSize: 13, fontWeight: 600, color: "#8a7f80" }
          }
        >
          {siklus.text}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={mulaiResus}
          disabled={running}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 12,
            fontWeight: 800,
            cursor: running ? "default" : "pointer",
            border: "none",
            color: "#fff",
            background: "linear-gradient(135deg,#1F9D55,#178048)",
            opacity: running ? 0.5 : 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <PlayTimerIcon size={16} />
          <span>Mulai Resusitasi</span>
        </button>
        <button
          onClick={selesaiResus}
          disabled={!running}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 12,
            fontWeight: 800,
            cursor: running ? "pointer" : "default",
            border: "1px solid #E11D2A",
            color: "#B00C1A",
            background: "#fff",
            opacity: running ? 1 : 0.5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <StopTimerIcon size={16} />
          <span>Selesai</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      <div style={{ ...kotak, marginBottom: 0 }}>
        <div style={{ ...judulKotak, display: "flex", alignItems: "center", gap: "6px" }}>
          <MetronomeIcon size={16} /> Metronom CPR
        </div>
        <button
          onClick={toggleMetro}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 10,
            fontWeight: 800,
            cursor: "pointer",
            border: "none",
            color: "#fff",
            background: metroOn ? "#B00C1A" : "#E11D2A",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {metroOn ? (
            <>
              <StopTimerIcon size={14} /> Metronom aktif
            </>
          ) : (
            <>
              <PlayTimerIcon size={14} /> Nyalakan metronom
            </>
          )}
        </button>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[100, 110, 120].map((b) => (
            <button
              key={b}
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
        <div style={caption}>{bpm + "/menit \u00b7 target 100\u2013120"}</div>
      </div>

      <div style={{ ...kotak, marginBottom: 0 }}>
        <div style={{ ...judulKotak, display: "flex", alignItems: "center", gap: "6px" }}>
          <EmergencyDrugIcon size={16} /> Interval epinefrin
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[180, 240, 300].map((s) => (
            <button
              key={s}
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
          style={
            epiInfo?.alarm
              ? { ...caption, color: "#E11D2A", fontWeight: 800 }
              : caption
          }
        >
          {epiInfo ? epiInfo.text : "Tekan Epinefrin saat memberi dosis"}
        </div>
      </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={bukaCoach} style={{ ...coachBtn, flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <DefibIcon size={18} />
          <span>Mode CPR Layar Penuh</span>
        </button>
        <button
          onClick={toggleSuara}
          aria-pressed={voiceOn}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            fontWeight: 800,
            cursor: "pointer",
            border: "1px solid #E11D2A",
            color: voiceOn ? "#fff" : "#B00C1A",
            background: voiceOn ? "#E11D2A" : "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <MicVoiceIcon size={18} />
          <span>{voiceOn ? "Mendengarkan…" : "Catat via Suara"}</span>
        </button>
      </div>

      {!voiceSupported ? (
        <div style={voiceWarn}>
          Browser ini tidak mendukung pengenalan suara. Gunakan Chrome atau Edge
          terbaru (di laptop/Android).
        </div>
      ) : null}
      {voiceErr ? <div style={voiceWarn}>{voiceErr}</div> : null}
      {voiceDiag ? (
        <div
          style={{
            marginBottom: 10,
            fontSize: 11,
            color: "#8a7f80",
            fontFamily: "monospace",
            wordBreak: "break-word",
          }}
        >
          {voiceDiag}
        </div>
      ) : null}
      {voiceOn ? (
        <div
          style={{
            marginBottom: 10,
            fontSize: 12,
            color: "#8a7f80",
            lineHeight: 1.5,
          }}
        >
          {"Ucapkan: \u201cepinefrin\u201d, \u201csyok\u201d, \u201ccek nadi\u201d, \u201cintubasi\u201d, atau kalimat bebas."}
          {voiceHeard ? " \u00b7 Terdengar: \u201c" + voiceHeard + "\u201d" : ""}
          {!running ? " \u00b7 Mulai resusitasi agar tindakan tercatat." : ""}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {QUICK.map((q) => (
          <button
            key={q.aksi}
            onClick={() => aksiCepat(q.aksi)}
            disabled={!running}
            style={{
              padding: "12px 8px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 13,
              cursor: running ? "pointer" : "default",
              border: "1px solid #f0c9cc",
              background: "#fff",
              color: "#B00C1A",
              opacity: running ? 1 : 0.5,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {q.icon}
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
        <input
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              catatKustom();
            }
          }}
          placeholder="Ketik catatan tindakan atau obat di sini (cth: Pasang IV, Bolus NS)..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            fontSize: 14,
            color: "#1e293b",
            backgroundColor: "#ffffff",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
          }}
        />
        <button
          onClick={catatKustom}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            fontWeight: 800,
            cursor: "pointer",
            border: "none",
            color: "#fff",
            background: "#E11D2A",
          }}
        >
          + Catat
        </button>
      </div>

      <div
        style={{
          border: "1px solid #FDECEC",
          borderRadius: 12,
          padding: "6px 10px",
          maxHeight: 220,
          overflowY: "auto",
          background: "#fff",
        }}
      >
        {log.length === 0 ? (
          <div style={{ fontSize: 13, color: "#8a7f80", padding: "8px 0" }}>
            Belum ada tindakan tercatat.
          </div>
        ) : (
          log.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "5px 0",
                borderBottom: "1px solid #f6eaea",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  color: "#B00C1A",
                  whiteSpace: "nowrap",
                }}
              >
                {e.jam + " \u00b7 +" + e.lewat}
              </span>
              <span style={{ color: "#2A0A0C" }}>{e.teks}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button
          onClick={salin}
          style={{
            flex: 1,
            minWidth: 130,
            padding: "10px 8px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            border: "1px solid #f0c9cc",
            background: "#fff",
            color: "#B00C1A",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <CopyDataIcon size={16} />
          <span>{salinLabel}</span>
        </button>
        <button
          onClick={simpan}
          style={{
            flex: 1,
            minWidth: 130,
            padding: "10px 8px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            border: "1px solid #f0c9cc",
            background: "#fff",
            color: "#B00C1A",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <SaveDataIcon size={16} />
          <span>{simpanLabel}</span>
        </button>
        <button
          onClick={cetakLembarKode}
          style={{
            flex: 1,
            minWidth: 130,
            padding: "10px 8px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            background: "#E11D2A",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <PrintReportIcon size={18} />
          <span>Cetak Lembar Kode</span>
        </button>
      </div>

      {coachOpen && (
        <div style={overlay}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              maxWidth: 520,
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {jam}
            </div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700, opacity: 0.95 }}>
              {siklus.text}
            </div>
            <button
              onClick={() => setCoachOpen(false)}
              style={{
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                borderRadius: 10,
                padding: "8px 12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {"\u2715 Tutup"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "18px 0",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "6px solid rgba(255,255,255,0.9)",
                background: beat
                  ? "rgba(255,255,255,0.28)"
                  : "rgba(255,255,255,0.08)",
                transform: beat ? "scale(1.06)" : "scale(1)",
                transition: "transform .08s ease, background .08s ease",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>
                TEKAN
              </div>
              <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
                {compCount}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{bpm + "/menit"}</div>
            </div>
            {ventFlash && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 18,
                  fontWeight: 800,
                  background: "#fff",
                  color: "#B00C1A",
                  borderRadius: 10,
                  padding: "6px 14px",
                }}
              >
                {"\uD83D\uDCA8 BERI 2 NAPAS"}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { v: 30, t: "30:2" },
              { v: 15, t: "15:2" },
            ].map((rr) => (
              <button
                key={rr.v}
                onClick={() => setRatio(rr.v)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontWeight: 800,
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.7)",
                  background: ratio === rr.v ? "#fff" : "rgba(255,255,255,0.12)",
                  color: ratio === rr.v ? "#B00C1A" : "#fff",
                }}
              >
                {rr.t}
              </button>
            ))}
            <button
              onClick={toggleMetro}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontWeight: 800,
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
              }}
            >
              {metroOn ? "\uD83D\uDD0A Bunyi" : "\uD83D\uDD07 Bunyi"}
            </button>
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              fontWeight: 700,
              textAlign: "center",
              minHeight: 20,
            }}
          >
            {epiInfo ? epiInfo.text : "\uD83D\uDC89 Tekan Epinefrin saat memberi dosis"}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              width: "100%",
              maxWidth: 520,
              marginTop: 12,
            }}
          >
            {QUICK.map((q) => (
              <button
                key={q.aksi}
                onClick={() => aksiCepat(q.aksi)}
                disabled={!running}
                style={{ ...coachQuick, opacity: running ? 1 : 0.5 }}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              width: "100%",
              maxWidth: 520,
              marginTop: 12,
            }}
          >
            {!running && (
              <button
                onClick={mulaiResus}
                style={{ ...coachQuick, flex: 1, background: "#fff", color: "#B00C1A" }}
              >
                {"\u25B6\uFE0F Mulai Resusitasi"}
              </button>
            )}
            {running && (
              <button onClick={selesaiResus} style={{ ...coachQuick, flex: 1 }}>
                {"\u23F9\uFE0F Selesai"}
              </button>
            )}
            {running && (
              <button
                onClick={toggleSuara}
                style={{
                  ...coachQuick,
                  flex: 1,
                  background: voiceOn
                    ? "rgba(255,255,255,0.28)"
                    : "rgba(255,255,255,0.12)",
                }}
              >
                {voiceOn ? "\uD83C\uDF99\uFE0F Suara aktif" : "\uD83C\uDF99\uFE0F Suara"}
              </button>
            )}
          </div>

          {detik >= 240 && (
            <div
              style={{
                width: "100%",
                maxWidth: 520,
                marginTop: 14,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                {"\uD83E\uDDE9 Cek penyebab reversibel (Hs & Ts)"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 12px",
                }}
              >
                {HT_LIST.map((h, i) => (
                  <label
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(htChecked[i])}
                      onChange={() => toggleHt(i)}
                    />
                    {h}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              width: "100%",
              maxWidth: 520,
              marginTop: 14,
              fontSize: 12,
              opacity: 0.92,
            }}
          >
            {log.slice(-4).map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "3px 0",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span
                  style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700 }}
                >
                  {e.jam + " \u00b7 +" + e.lewat}
                </span>
                <span>{e.teks}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
