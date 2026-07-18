"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { DAFTAR_KONDISI, KATEGORI_ALUR } from "@/shared/lib/alur/daftar";
import type { Kondisi } from "@/shared/lib/alur/daftar";
import { hitungObat } from "@/shared/lib/alur/dosis";
import {
  bacaPasienAktif,
  PASIEN_AKTIF_KEY,
  tambahKeRingkasan,
} from "@/shared/lib/alur/ringkasan-bridge";
import type {
  BlokKonten,
  Layar,
  Nada,
  Pasien,
  Setting,
} from "@/shared/lib/alur/tipe";

const LABEL_SETTING: Record<Setting, string> = {
  fktp: "FKTP / Fasilitas Primer",
  rs: "Rumah Sakit",
};

const LABEL_DERAJAT: Record<string, string> = {
  "ringan-sedang": "Ringan\u2013Sedang",
  berat: "Berat",
  ancaman: "Ancaman henti napas",
};

function usiaTeks(bln: number | null | undefined): string {
  if (bln == null) return "\u2013";
  const th = Math.floor(bln / 12);
  const sisa = bln % 12;
  if (th <= 0) return `${bln} bln`;
  return sisa ? `${th} th ${sisa} bln` : `${th} th`;
}

function gayaTombol(nada?: Nada): CSSProperties {
  if (nada === "bahaya")
    return {
      background: "linear-gradient(160deg,#e23a5e,#c01643)",
      color: "#fff",
      border: "none",
    };
  if (nada === "biasa")
    return {
      background: "var(--tv-putih)",
      color: "var(--tv-teks)",
      border: "1px solid var(--tv-line)",
    };
  return {};
}

function warnaDerajat(derajat?: string): string {
  if (derajat === "ringan-sedang") return "#1c7c54";
  if (derajat === "berat") return "#c9761a";
  if (derajat === "ancaman") return "#c01643";
  return "var(--tv-soft-teks)";
}

function warnaNada(nada?: Layar["nada"]): string {
  if (nada === "bahaya") return "#c01643";
  if (nada === "waspada") return "#c9761a";
  if (nada === "baik") return "#1c7c54";
  return "var(--tv-navy)";
}

function Timer({ menit }: { menit: number }) {
  const [sisa, setSisa] = useState<number | null>(null);

  useEffect(() => {
    if (sisa == null || sisa <= 0) return;
    const t = setInterval(
      () => setSisa((s) => (s == null ? s : Math.max(0, s - 1))),
      1000,
    );
    return () => clearInterval(t);
  }, [sisa]);

  if (sisa == null) {
    return (
      <button
        type="button"
        className="tv-btn"
        onClick={() => setSisa(menit * 60)}
      >
        ⏱️ Mulai timer nilai ulang ({menit} menit)
      </button>
    );
  }

  const mm = String(Math.floor(sisa / 60)).padStart(2, "0");
  const ss = String(sisa % 60).padStart(2, "0");
  const selesai = sisa <= 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: "1.5rem",
          fontVariantNumeric: "tabular-nums",
          color: selesai ? "#c01643" : "var(--tv-teks)",
        }}
      >
        {mm}:{ss}
      </span>
      {selesai && <span className="tv-warn">Waktunya nilai ulang.</span>}
      <button type="button" className="tv-btn" onClick={() => setSisa(null)}>
        Reset
      </button>
    </div>
  );
}

function RenderBlok({
  blok,
  pasien,
}: {
  blok: BlokKonten;
  pasien: Pasien | null;
}) {
  if (blok.jenis === "teks")
    return <p style={{ margin: "6px 0" }}>{blok.teks}</p>;

  if (blok.jenis === "poin")
    return (
      <ul style={{ margin: "6px 0", paddingLeft: 18 }}>
        {blok.poin.map((t, i) => (
          <li key={i} style={{ margin: "3px 0" }}>
            {t}
          </li>
        ))}
      </ul>
    );

  if (blok.jenis === "peringatan")
    return (
      <div className="tv-warn" style={{ margin: "8px 0" }}>
        ⚠️ {blok.teks}
      </div>
    );

  const d = hitungObat(blok.obatId, pasien ?? {});
  if (!d) return null;

  return (
    <div
      style={{
        border: "1px solid var(--tv-line)",
        borderRadius: 12,
        padding: "10px 12px",
        margin: "8px 0",
        background: "var(--tv-putih)",
      }}
    >
      <div style={{ fontWeight: 700 }}>
        💊 {d.def.nama}{" "}
        <span style={{ fontWeight: 400, color: "var(--tv-soft-teks)" }}>
          · {d.def.rute}
        </span>
      </div>
      <div style={{ marginTop: 2 }}>{d.hasil.ringkas}</div>
      {d.hasil.detail && (
        <div
          style={{
            fontSize: ".86rem",
            color: "var(--tv-soft-teks)",
            marginTop: 2,
          }}
        >
          {d.hasil.detail}
        </div>
      )}
      {d.hasil.peringatan && (
        <div className="tv-warn" style={{ marginTop: 4 }}>
          ⚠️ {d.hasil.peringatan}
        </div>
      )}
    </div>
  );
}

function komposisiRingkasan(
  kondisi: Kondisi,
  layar: Layar,
  setting: Setting,
  pasien: Pasien | null,
): string {
  const baris: string[] = [];
  if (!kondisi.alur.tanpaSetting)
    baris.push(`Setting: ${LABEL_SETTING[setting]}`);
  if (
    pasien &&
    (pasien.nama || pasien.bb != null || pasien.usiaBulan != null)
  ) {
    baris.push(
      `Pasien: ${pasien.nama ?? "-"} \u00b7 BB ${pasien.bb ?? "-"} kg \u00b7 Usia ${usiaTeks(pasien.usiaBulan)}`,
    );
  }
  baris.push("");
  for (const blok of layar.konten) {
    if (blok.jenis === "teks") baris.push(blok.teks);
    else if (blok.jenis === "poin")
      for (const p of blok.poin) baris.push(`\u2022 ${p}`);
    else if (blok.jenis === "peringatan") baris.push(`\u26a0 ${blok.teks}`);
    else {
      const d = hitungObat(blok.obatId, pasien ?? {});
      if (d)
        baris.push(`\u2022 ${d.def.nama} (${d.def.rute}): ${d.hasil.ringkas}`);
    }
  }
  baris.push("");
  baris.push(`Sumber: ${kondisi.alur.sumber}`);
  return baris.join("\n");
}

export function AlurTatalaksanaPanel() {
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [kondisi, setKondisi] = useState<Kondisi | null>(null);
  const [setting, setSetting] = useState<Setting | null>(null);
  const [stack, setStack] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [bagan, setBagan] = useState(false);

  useEffect(() => {
    setPasien(bacaPasienAktif());
    const muat = () => setPasien(bacaPasienAktif());
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === PASIEN_AKTIF_KEY) muat();
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { __tvPasien?: boolean } | null;
      if (d && d.__tvPasien) muat();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("message", onMsg);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const pilihKondisi = useCallback((k: Kondisi) => {
    setKondisi(k);
    setBagan(false);
    if (k.alur.tanpaSetting) {
      setSetting("rs");
      setStack([k.alur.mulai.rs]);
    } else {
      setSetting(null);
      setStack([]);
    }
  }, []);

  const pilihSetting = useCallback((k: Kondisi, s: Setting) => {
    setSetting(s);
    setStack([k.alur.mulai[s]]);
    setBagan(false);
  }, []);

  const pergi = useCallback(
    (tujuan: string) => setStack((st) => [...st, tujuan]),
    [],
  );
  const kembali = useCallback(() => {
    setStack((st) => {
      if (st.length > 1) return st.slice(0, -1);
      setSetting(null);
      return [];
    });
  }, []);
  const gantiSetting = useCallback(() => {
    setSetting(null);
    setStack([]);
    setBagan(false);
  }, []);
  const keDaftar = useCallback(() => {
    setKondisi(null);
    setSetting(null);
    setStack([]);
    setBagan(false);
  }, []);

  // Deep-link dari pencarian global: buka penyakit langsung dari #tk=alur:<id>.
  // Contoh: /preview/alur#tk=alur:dbd akan langsung membuka alur DBD.
  useEffect(() => {
    function bukaDariHash() {
      const h = window.location.hash || "";
      const m = h.match(/[#&]tk=([^&]+)/);
      if (!m) return;
      const tk = decodeURIComponent(m[1] ?? "");
      if (tk.indexOf("alur:") !== 0) return;
      const id = tk.slice(5);
      const k = DAFTAR_KONDISI.find((x) => x.id === id && x.tersedia);
      if (k) pilihKondisi(k);
    }
    bukaDariHash();
    window.addEventListener("hashchange", bukaDariHash);
    return () => window.removeEventListener("hashchange", bukaDariHash);
  }, [pilihKondisi]);

  const punyaPasien = !!(
    pasien &&
    (pasien.nama || pasien.bb != null || pasien.usiaBulan != null)
  );
  const kartuPasien = (
    <div
      style={{
        border: "1px solid var(--tv-line)",
        borderRadius: 12,
        padding: "10px 12px",
        background: "var(--tv-putih)",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--tv-navy)",
          marginBottom: 2,
        }}
      >
        👶 Profil Pasien
      </div>
      {punyaPasien && pasien ? (
        <div style={{ fontSize: ".85rem" }}>
          {pasien.nama ?? "Tanpa nama"} · BB {pasien.bb ?? "\u2013"} kg · Usia{" "}
          {usiaTeks(pasien.usiaBulan)}
        </div>
      ) : (
        <div className="tv-warn" style={{ marginTop: 2 }}>
          Belum ada data pasien. Isi Profil Pasien agar dosis dihitung otomatis.
        </div>
      )}
    </div>
  );

  const disclaimer = (
    <div className="tv-warn" style={{ marginTop: 12 }}>
      ⚠️ Alat bantu keputusan — bukan pengganti penilaian klinis. Verifikasi
      dosis sebelum pemberian.
    </div>
  );

  const toastEl = toast ? (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        background: "var(--tv-navy)",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 999,
        zIndex: 50,
        boxShadow: "0 6px 20px rgba(0,0,0,.18)",
      }}
    >
      {toast}
    </div>
  ) : null;

  // ===== 1) HALAMAN UTAMA: daftar penyakit =====
  if (!kondisi) {
    const grup = KATEGORI_ALUR.map((kat) => ({
      kat,
      items: DAFTAR_KONDISI.filter((k) => k.kategori === kat.id),
    })).filter((g) => g.items.length > 0);
    return (
      <div>
        {kartuPasien}
        <p style={{ margin: "0 0 16px", color: "var(--tv-soft-teks)" }}>
          Pilih kondisi untuk membuka alur tata laksana interaktif.
        </p>
        {grup.map(({ kat, items }) => (
          <section key={kat.id} className="tv-alur-kat-sec">
            <div
              className="tv-alur-kat"
              style={
                {
                  "--kat": kat.warna,
                  "--kat-lembut": kat.warnaLembut,
                } as CSSProperties
              }
            >
              <span className="tv-alur-kat-ikon">{kat.ikon}</span>
              <span className="tv-alur-kat-nama">{kat.nama}</span>
              <span className="tv-alur-kat-garis" />
              <span className="tv-alur-kat-jml">{items.length}</span>
            </div>
            <div className="tv-alur-grid">
              {items.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className="tv-alur-kartu"
                  disabled={!k.tersedia}
                  onClick={() => k.tersedia && pilihKondisi(k)}
                  style={
                    {
                      "--kat": kat.warna,
                      "--kat-lembut": kat.warnaLembut,
                    } as CSSProperties
                  }
                >
                  <span className="tv-alur-kartu-ikon">{k.ikon}</span>
                  <span className="tv-alur-kartu-teks">
                    <span className="tv-alur-kartu-judul">{k.nama}</span>
                    <span className="tv-alur-kartu-ringkas">{k.ringkas}</span>
                  </span>
                  <span className={"tv-alur-chip" + (k.tersedia ? " ada" : "")}>
                    {k.tersedia ? "Tersedia" : "Segera"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
        {disclaimer}
        {toastEl}
      </div>
    );
  }

  // ===== 2) PILIH SETTING =====
  if (!setting) {
    return (
      <div>
        {kartuPasien}
        <button
          type="button"
          className="tv-btn"
          onClick={keDaftar}
          style={{ marginBottom: 12 }}
        >
          ← Daftar penyakit
        </button>
        <div className="tv-card">
          <div className="tv-card-title">
            {kondisi.ikon} {kondisi.nama}
          </div>
          <div className="tv-card-desc" style={{ marginTop: 3 }}>
            Pilih lokasi penanganan untuk memulai alur.
          </div>
          <div className="tv-stack" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="tv-btn tv-btn-blok"
              onClick={() => pilihSetting(kondisi, "fktp")}
            >
              🏥 FKTP / Fasilitas Primer
            </button>
            <button
              type="button"
              className="tv-btn tv-btn-blok"
              onClick={() => pilihSetting(kondisi, "rs")}
            >
              🏨 Rumah Sakit
            </button>
          </div>
          <div
            style={{
              fontSize: ".8rem",
              color: "var(--tv-soft-teks)",
              marginTop: 14,
            }}
          >
            Sumber: {kondisi.alur.sumber}
          </div>
        </div>
        {toastEl}
      </div>
    );
  }

  // ===== 3) ALUR =====
  const kiniId = stack[stack.length - 1];
  const layar: Layar | undefined = kiniId
    ? kondisi.alur.layar[kiniId]
    : undefined;
  const baganSrc = kondisi.bagan ? kondisi.bagan[setting] : undefined;

  if (!layar) {
    return (
      <div>
        <div className="tv-card">
          <div className="tv-card-title">Alur tidak ditemukan</div>
          <button
            type="button"
            className="tv-btn"
            style={{ marginTop: 12 }}
            onClick={keDaftar}
          >
            Kembali ke daftar
          </button>
        </div>
        {toastEl}
      </div>
    );
  }

  const gambarToggle: { src: string; keterangan?: string } | null = layar
    .gambarAlur?.toggle
    ? layar.gambarAlur
    : baganSrc
      ? { src: baganSrc, keterangan: undefined }
      : null;

  const tambah = () => {
    tambahKeRingkasan({
      title: `${kondisi.nama} \u2014 ${layar.judul}`,
      body: komposisiRingkasan(kondisi, layar, setting, pasien),
      source: `Alur ${kondisi.nama}`,
    });
    setToast("Ditambahkan ke Ringkasan Klinis \u2705");
  };

  return (
    <div>
      {kartuPasien}

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <button type="button" className="tv-btn" onClick={keDaftar}>
          ← Daftar
        </button>
        <span
          style={{
            fontSize: ".78rem",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 999,
            background: "var(--tv-accent-soft)",
            color: "var(--tv-navy)",
          }}
        >
          {kondisi.nama}
          {!kondisi.alur.tanpaSetting && ` \u00b7 ${LABEL_SETTING[setting]}`}
        </span>
        {stack.length > 1 && (
          <button type="button" className="tv-btn" onClick={kembali}>
            Kembali
          </button>
        )}
        {!kondisi.alur.tanpaSetting && (
          <button type="button" className="tv-btn" onClick={gantiSetting}>
            Ganti setting
          </button>
        )}
      </div>

      {stack.length > 0 && (
        <ol className="tv-alur-stepper">
          {stack.map((id, i) => {
            const L = kondisi.alur.layar[id];
            const aktif = i === stack.length - 1;
            const bisaKlik = i < stack.length - 1;
            return (
              <li
                key={`${id}-${i}`}
                className={"tv-alur-step" + (aktif ? " aktif" : "")}
                style={{ "--nada": warnaNada(L?.nada) } as CSSProperties}
              >
                <button
                  type="button"
                  className="tv-alur-step-btn"
                  disabled={!bisaKlik}
                  onClick={() => bisaKlik && setStack(stack.slice(0, i + 1))}
                  title={L?.judul}
                >
                  <span className="tv-alur-step-node">{i + 1}</span>
                  <span className="tv-alur-step-lbl">
                    {L?.judul ?? "Langkah"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <div
        className="tv-card"
        style={{ borderTop: `4px solid ${warnaNada(layar.nada)}` }}
      >
        {layar.derajat && (
          <div
            style={{
              fontSize: ".78rem",
              fontWeight: 800,
              color: warnaDerajat(layar.derajat),
              marginBottom: 4,
            }}
          >
            {LABEL_DERAJAT[layar.derajat] ?? layar.derajat}
          </div>
        )}
        <div className="tv-card-title">{layar.judul}</div>

        <div style={{ marginTop: 8 }}>
          {layar.konten.map((blok, i) => (
            <RenderBlok key={i} blok={blok} pasien={pasien} />
          ))}
        </div>

        {layar.timerMenit != null && (
          <div style={{ margin: "12px 0" }}>
            <Timer menit={layar.timerMenit} />
          </div>
        )}

        {layar.gambarAlur && !layar.gambarAlur.toggle && (
          <figure
            style={{
              margin: "16px 0 4px",
              border: "1px solid var(--tv-line)",
              borderRadius: 12,
              padding: 8,
              background: "var(--tv-putih)",
            }}
          >
            <img
              src={layar.gambarAlur.src}
              alt={layar.gambarAlur.keterangan ?? `Bagan alur ${kondisi.nama}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                display: "block",
              }}
            />
            <figcaption
              style={{
                fontSize: ".78rem",
                color: "var(--tv-soft-teks)",
                marginTop: 6,
              }}
            >
              🖼️ {layar.gambarAlur.keterangan ?? "Bagan alur asli"} · Sumber:{" "}
              {kondisi.alur.sumber}
            </figcaption>
          </figure>
        )}

        {layar.ringkasan && (
          <button
            type="button"
            className="tv-btn"
            style={{ marginTop: 8 }}
            onClick={tambah}
          >
            📄 Tambahkan ke Ringkasan
          </button>
        )}

        {layar.tombol.length > 0 && (
          <div className="tv-stack" style={{ marginTop: 16 }}>
            {layar.tombol.map((tb, i) => (
              <button
                key={i}
                type="button"
                className="tv-btn tv-btn-blok"
                style={gayaTombol(tb.nada)}
                onClick={() => pergi(tb.tujuan)}
              >
                {tb.label}
              </button>
            ))}
          </div>
        )}

        {layar.tombol.length === 0 && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 10,
              background: "var(--tv-accent-soft)",
              fontSize: ".9rem",
            }}
          >
            ✅ Akhir alur untuk kondisi ini. Gunakan “Kembali” atau “← Daftar”
            untuk menelusuri cabang lain.
          </div>
        )}

        <div
          style={{
            fontSize: ".78rem",
            color: "var(--tv-soft-teks)",
            marginTop: 16,
          }}
        >
          Sumber: {kondisi.alur.sumber}
        </div>
      </div>

      {gambarToggle && (
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="tv-btn"
            onClick={() => setBagan((b) => !b)}
          >
            🖼️ {bagan ? "Sembunyikan gambar alur" : "Gambar alur"}
          </button>
          {bagan && (
            <div
              style={{
                marginTop: 10,
                border: "1px solid var(--tv-line)",
                borderRadius: 12,
                padding: 8,
                background: "var(--tv-putih)",
              }}
            >
              <img
                src={gambarToggle.src}
                alt={
                  gambarToggle.keterangan ??
                  `Bagan ${kondisi.nama} \u2014 ${LABEL_SETTING[setting]}`
                }
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                  display: "block",
                }}
              />
              <div
                style={{
                  fontSize: ".78rem",
                  color: "var(--tv-soft-teks)",
                  marginTop: 6,
                }}
              >
                {gambarToggle.keterangan ?? "Bagan asli"} — sumber:{" "}
                {kondisi.alur.sumber}
              </div>
            </div>
          )}
        </div>
      )}

      {disclaimer}
      {toastEl}
    </div>
  );
}
