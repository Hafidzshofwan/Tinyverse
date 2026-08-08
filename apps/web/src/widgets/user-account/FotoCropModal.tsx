"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Ukuran area pratinjau (lingkaran avatar) dan resolusi akhir foto yang disimpan.
const VIEWPORT = 260;
const OUTPUT = 320;

export interface FotoCropModalProps {
  file: File;
  onBatal: () => void;
  onSelesai: (dataUrl: string) => void;
}

function jepitPosisi(
  p: { x: number; y: number },
  dispW: number,
  dispH: number,
) {
  const minX = Math.min(0, VIEWPORT - dispW);
  const minY = Math.min(0, VIEWPORT - dispH);
  return {
    x: Math.min(0, Math.max(minX, p.x)),
    y: Math.min(0, Math.max(minY, p.y)),
  };
}

/**
 * Modal untuk mengatur bagian foto yang akan dijadikan foto profil.
 * Pengguna bisa menggeser (drag) dan memperbesar (zoom) foto di dalam
 * bingkai lingkaran sebelum foto disimpan sebagai avatar.
 */
export function FotoCropModal({ file, onBatal, onSelesai }: FotoCropModalProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [galat, setGalat] = useState("");
  const [pasang, setPasang] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(
    null,
  );
  const imgElRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => setPasang(true), []);

  // Muat berkas jadi object URL, lalu baca dimensi asli gambar.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };
    img.onerror = () =>
      setGalat("Foto tidak dapat dibaca. Coba gambar JPG/PNG lain.");
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // "cover": foto selalu menutupi seluruh bingkai, tak peduli rasio aslinya.
  const layout = useMemo(() => {
    if (!imgSize) return null;
    const baseScale = Math.max(VIEWPORT / imgSize.w, VIEWPORT / imgSize.h);
    const scale = baseScale * zoom;
    const dispW = imgSize.w * scale;
    const dispH = imgSize.h * scale;
    return { dispW, dispH };
  }, [imgSize, zoom]);

  // Jepit ulang posisi setiap kali ukuran tampilan berubah (mis. saat zoom digeser)
  // supaya foto tidak pernah menyisakan celah kosong di dalam bingkai.
  useEffect(() => {
    if (!layout) return;
    setPos((p) => jepitPosisi(p, layout.dispW, layout.dispH));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout?.dispW, layout?.dispH]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !layout) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const next = { x: dragRef.current.posX + dx, y: dragRef.current.posY + dy };
    setPos(jepitPosisi(next, layout.dispW, layout.dispH));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function onSimpanCrop() {
    if (!imgElRef.current || !layout) return;
    try {
      const k = OUTPUT / VIEWPORT;
      const cv = document.createElement("canvas");
      cv.width = OUTPUT;
      cv.height = OUTPUT;
      const ctx = cv.getContext("2d");
      if (!ctx) throw new Error("Kanvas tidak tersedia.");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, OUTPUT, OUTPUT);
      ctx.drawImage(
        imgElRef.current,
        pos.x * k,
        pos.y * k,
        layout.dispW * k,
        layout.dispH * k,
      );
      onSelesai(cv.toDataURL("image/jpeg", 0.85));
    } catch (err) {
      setGalat((err as Error).message);
    }
  }

  if (!pasang) return null;

  return createPortal(
    <div
      className="tv-modal tampil"
      onClick={(e) => {
        if (e.target === e.currentTarget) onBatal();
      }}
    >
      <div className="tv-modal-kartu tv-crop-kartu">
        <button className="tv-modal-tutup" onClick={onBatal} aria-label="Tutup">
          {"\u00D7"}
        </button>
        <h2>{"\uD83D\uDDBC\uFE0F"} Atur Foto Profil</h2>
        {galat && <div className="tv-pesan galat">{galat}</div>}
        <p className="tv-crop-hint">
          Geser foto untuk memilih bagian yang ditampilkan, lalu atur perbesaran
          dengan penggeser di bawah.
        </p>
        <div
          className="tv-crop-viewport"
          style={{ width: VIEWPORT, height: VIEWPORT }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {imgUrl && layout && (
            <img
              ref={imgElRef}
              src={imgUrl}
              alt="Pratinjau foto profil"
              draggable={false}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: layout.dispW,
                height: layout.dispH,
                maxWidth: "none",
                userSelect: "none",
                cursor: "grab",
              }}
            />
          )}
          <div className="tv-crop-mask" aria-hidden />
        </div>
        <div className="tv-crop-zoom">
          <span aria-hidden>{"\uD83D\uDD0D"}</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Perbesar foto"
          />
        </div>
        <div className="tv-crop-aksi">
          <button type="button" className="tv-btn sekunder" onClick={onBatal}>
            Batal
          </button>
          <button type="button" className="tv-btn" onClick={onSimpanCrop} disabled={!layout}>
            Gunakan foto ini
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
