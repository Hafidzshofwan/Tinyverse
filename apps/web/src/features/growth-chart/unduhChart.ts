import type { TitikPlot } from "./plotting";

/**
 * Unduh growth chart hasil plotting sebagai PNG resolusi penuh.
 *
 * WHY: koas memakai chart ini untuk presentasi, dan tangkapan layar hanya
 * merekam sebesar piksel yang kebetulan tampil (sekitar 900 px), sehingga
 * pecah begitu diperbesar di proyektor atau slide. Modul ini menggambar
 * ULANG overlay di atas gambar chart pada ukuran ASLINYA -- IMT/U misalnya
 * 3508 x 2481 px, hampir 4x lebih tajam daripada yang terlihat di layar.
 *
 * Kuncinya: plotting.ts sudah menghasilkan posisi dalam PERSEN, sehingga
 * koordinat yang sama bisa dipakai ulang pada resolusi berapa pun tanpa
 * menghitung ulang kalibrasi. Tidak ada pustaka tambahan yang dibutuhkan;
 * html2canvas sekalipun hanya akan menyalin piksel layar yang sudah kecil.
 */

export interface TitikUnduh {
  titik: TitikPlot;
  /** Persen X tujuan garis bantu horizontal (hasil tkTargetGarisHorizontal). */
  targetX: number;
  warna: string;
  yLabel: string;
  yUnit: string;
  nilai: number;
}

export interface OpsiUnduhChart {
  /** Elemen <img> chart yang sedang tampil; dipakai sebagai sumber piksel. */
  img: HTMLImageElement;
  titik: TitikUnduh[];
  /** Nama berkas tanpa ekstensi. */
  namaBerkas: string;
  judul: string;
  subjudul: string;
  /** Baris keterangan di pita bawah, mis. ["BB: 12,5 kg", "Usia: 18 bulan"]. */
  keterangan: string[];
  /**
   * Pengali resolusi. Bila tidak diisi, dipilih otomatis agar lebar akhir
   * minimal ~2200 px (chart CDC yang aslinya 1275 px jadi ikut tajam).
   */
  skala?: number;
}

const WARNA_LABEL_BG = "#0F172A";
const WARNA_PITA_BG = "#FFFFFF";
const WARNA_PITA_TEKS = "#0F172A";
const WARNA_PITA_SUB = "#475569";
const FONT_STACK = "'Fredoka', 'Segoe UI', system-ui, sans-serif";

/** Persegi panjang bersudut membulat (roundRect belum ada di semua peramban). */
function jalurKotakBulat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

/**
 * Garis bantu hasil unduhan: UTUH, bukan putus-putus.
 *
 * Di layar, .tk-garis-bantu memang putus-putus 4px/4px dan itu terbaca
 * karena pengguna bisa memperbesar tampilan. Pada berkas unduhan yang
 * dicetak atau dilampirkan ke rekam medis, strip sependek itu pecah di
 * atas kurva WHO yang sudah padat garis dan justru hilang terbaca.
 * Keterbacaan sengaja dimenangkan atas kemiripan dengan layar.
 *
 * Digambar dua lapis: alas putih sedikit lebih tebal sebagai pemisah,
 * lalu garis berwarna di atasnya, supaya tetap kontras saat melintasi
 * garis kurva rujukan yang warnanya mirip.
 */
function garisBantu(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  warna: string,
  tebal: number,
): void {
  ctx.save();
  ctx.lineCap = "round";
  ctx.setLineDash([]);

  // Alas putih semi-tembus sebagai pemisah dari garis kurva di bawahnya.
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = tebal + 2;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Garis utama, tanpa transparansi supaya warnanya penuh saat dicetak.
  ctx.strokeStyle = warna;
  ctx.lineWidth = tebal;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Gambar satu titik pasien lengkap dengan garis bantu dan labelnya.
 * Geometrinya menyalin .tk-garis-bantu / .tk-titik-pasien / .tk-label-pasien,
 * hanya saja seluruh ukurannya diskalakan terhadap lebar kanvas.
 */
function gambarTitik(
  ctx: CanvasRenderingContext2D,
  t: TitikUnduh,
  W: number,
  H: number,
): void {
  const unit = W / 900; // 1 unit = 1 px pada tampilan layar biasa
  // Sedikit lebih tebal daripada 2px di layar: berkas unduhan berukuran
  // jauh lebih besar dan kerap diperkecil saat dicetak.
  const tebalGaris = Math.max(1.5, 2.6 * unit);

  const px = (t.titik.leftPercent / 100) * W;
  const py = (t.titik.topPercent / 100) * H;

  const baseBawah = isFinite(t.titik.sumbuUsiaPersen)
    ? t.titik.sumbuUsiaPersen
    : t.titik.sumbuBawahPersen;
  const pyBase = (baseBawah / 100) * H;
  const pxTarget = (t.targetX / 100) * W;

  // Garis bantu: vertikal ke sumbu usia, horizontal ke sumbu nilai.
  garisBantu(ctx, px, py, px, pyBase, t.warna, tebalGaris);
  garisBantu(ctx, px, py, pxTarget, py, t.warna, tebalGaris);

  // Titik pasien: lingkaran berwarna, cincin putih, halo lembut.
  const r = 4.5 * unit;
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, r + 3.5 * unit, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(240, 99, 135, 0.35)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fillStyle = t.warna;
  ctx.fill();
  ctx.lineWidth = 2 * unit;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.restore();

  // Label melayang.
  const fontUkuran = Math.round(11 * unit);
  const padX = 6 * unit;
  const padY = 5 * unit;
  const baris1 = t.yLabel;
  const baris2 = `${t.nilai} ${t.yUnit}`;

  ctx.save();
  ctx.font = `700 ${fontUkuran}px ${FONT_STACK}`;
  const bulatR = fontUkuran * 0.42;
  const lebarTeks = Math.max(
    ctx.measureText(baris1).width + bulatR * 2 + 4 * unit,
    ctx.measureText(baris2).width,
  );
  const tinggiBaris = fontUkuran * 1.4;
  const kotakW = lebarTeks + padX * 2;
  const kotakH = tinggiBaris * 2 + padY * 2;

  // Sisi penempatan mengikuti aturan yang sama seperti di layar.
  const keKiri = t.targetX === t.titik.sumbuKananPersen
    ? t.titik.leftPercent >= 20
    : t.titik.leftPercent > 72;
  const keBawah = t.titik.topPercent < 22;

  let kx = keKiri ? px - kotakW - 16 * unit : px + 16 * unit;
  let ky = keBawah ? py + 16 * unit : py - kotakH - 14 * unit;

  // Jangan sampai keluar kanvas.
  kx = Math.max(4 * unit, Math.min(kx, W - kotakW - 4 * unit));
  ky = Math.max(4 * unit, Math.min(ky, H - kotakH - 4 * unit));

  jalurKotakBulat(ctx, kx, ky, kotakW, kotakH, 9 * unit);
  ctx.fillStyle = WARNA_LABEL_BG;
  ctx.globalAlpha = 0.94;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.5 * unit;
  ctx.strokeStyle = t.warna;
  ctx.stroke();

  ctx.textBaseline = "middle";
  const yBaris1 = ky + padY + tinggiBaris / 2;
  const yBaris2 = yBaris1 + tinggiBaris;

  ctx.beginPath();
  ctx.arc(kx + padX + bulatR, yBaris1, bulatR, 0, Math.PI * 2);
  ctx.fillStyle = t.warna;
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(baris1, kx + padX + bulatR * 2 + 4 * unit, yBaris1);
  ctx.fillText(baris2, kx + padX, yBaris2);
  ctx.restore();
}

/** Pita keterangan di bawah chart, supaya gambar bisa berdiri sendiri di slide. */
function gambarPita(
  ctx: CanvasRenderingContext2D,
  W: number,
  yAtas: number,
  tinggi: number,
  judul: string,
  subjudul: string,
  keterangan: string[],
): void {
  const unit = W / 900;
  ctx.save();
  ctx.fillStyle = WARNA_PITA_BG;
  ctx.fillRect(0, yAtas, W, tinggi);

  ctx.fillStyle = "#E2E8F0";
  ctx.fillRect(0, yAtas, W, Math.max(1, unit));

  const kiri = 18 * unit;
  ctx.textBaseline = "middle";

  ctx.fillStyle = WARNA_PITA_TEKS;
  ctx.font = `700 ${Math.round(15 * unit)}px ${FONT_STACK}`;
  ctx.fillText(judul, kiri, yAtas + tinggi * 0.32);

  ctx.fillStyle = WARNA_PITA_SUB;
  ctx.font = `500 ${Math.round(11.5 * unit)}px ${FONT_STACK}`;
  ctx.fillText(subjudul, kiri, yAtas + tinggi * 0.63);

  const isi = keterangan.filter(Boolean).join("   •   ");
  if (isi) {
    ctx.font = `600 ${Math.round(11.5 * unit)}px ${FONT_STACK}`;
    ctx.fillStyle = WARNA_PITA_TEKS;
    ctx.textAlign = "right";
    ctx.fillText(isi, W - kiri, yAtas + tinggi * 0.47);
    ctx.textAlign = "left";
  }
  ctx.restore();
}

/**
 * Render chart + overlay ke PNG lalu picu unduhan peramban.
 * Menghasilkan error bila gambar belum selesai dimuat.
 */
export async function unduhChartPNG(opsi: OpsiUnduhChart): Promise<void> {
  const { img, titik, namaBerkas, judul, subjudul, keterangan } = opsi;

  if (!img.complete || !img.naturalWidth) {
    throw new Error("Gambar chart belum selesai dimuat.");
  }

  const skala =
    opsi.skala ?? Math.max(1, Math.min(3, Math.ceil(2200 / img.naturalWidth)));

  const W = Math.round(img.naturalWidth * skala);
  const Hchart = Math.round(img.naturalHeight * skala);
  const tinggiPita = Math.round((W / 900) * 58);
  const H = Hchart + tinggiPita;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Peramban ini tidak mendukung canvas 2D.");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, W, Hchart);

  for (const t of titik) gambarTitik(ctx, t, W, Hchart);

  gambarPita(ctx, W, Hchart, tinggiPita, judul, subjudul, keterangan);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) throw new Error("Gagal membuat berkas PNG.");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${namaBerkas}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Beri jeda agar unduhan sempat dimulai sebelum URL dilepas.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Ubah teks bebas menjadi potongan nama berkas yang aman. */
export function amanNamaBerkas(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
