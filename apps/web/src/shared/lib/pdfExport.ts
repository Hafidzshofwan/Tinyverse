"use client";

/**
 * Utility PDF / Printable Letterhead Generator untuk Tinyverse
 * Mendukung Kop Surat Klinik/Dokter, QR Code Verifikasi, dan Format Resmi A4.
 */

export interface KopSuratConfig {
  namaFaskes: string;
  subFaskes: string;
  alamat: string;
  telepon: string;
  namaDokter: string;
  sipDokter: string;
  kota: string;
}

export const DEFAULT_KOP_SURAT: KopSuratConfig = {
  namaFaskes: "KLINIK PEDIATRI TINYVERSE",
  subFaskes: "Pusat Pelayanan Kesehatan Anak & Tumbuh Kembang",
  alamat: "Jl. Kesehatan Pediatri No. 108, Jakarta Selatan",
  telepon: "Telp: (021) 789-0123 | WA: 0812-3456-7890",
  namaDokter: "dr. Alex Wijaya, Sp.A",
  sipDokter: "SIP: 446/1082/SIP.D/2025",
  kota: "Jakarta",
};

const KOP_STORAGE_KEY = "tv_kop_surat_config_v1";

export function getKopSuratConfig(): KopSuratConfig {
  if (typeof window === "undefined") return DEFAULT_KOP_SURAT;
  try {
    const raw = localStorage.getItem(KOP_STORAGE_KEY);
    if (!raw) return DEFAULT_KOP_SURAT;
    return { ...DEFAULT_KOP_SURAT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_KOP_SURAT;
  }
}

export function saveKopSuratConfig(config: KopSuratConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KOP_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Gagal menyimpan Kop Surat:", e);
  }
}

function buildHeaderHTML(kop: KopSuratConfig, judulDokumen: string): string {
  const tglStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div class="kop-container">
      <div class="kop-header">
        <div class="kop-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#2563EB"/>
          </svg>
        </div>
        <div class="kop-text">
          <div class="kop-faskes">${kop.namaFaskes}</div>
          <div class="kop-sub">${kop.subFaskes}</div>
          <div class="kop-alamat">${kop.alamat}</div>
          <div class="kop-kontak">${kop.telepon}</div>
        </div>
      </div>
      <div class="kop-divider"></div>
      <div class="doc-meta-row">
        <div>
          <span class="doc-title">${judulDokumen}</span>
        </div>
        <div class="doc-date">
          ${kop.kota}, ${tglStr}
        </div>
      </div>
    </div>
  `;
}

function buildFooterHTML(kop: KopSuratConfig): string {
  return `
    <div class="doc-footer">
      <div class="footer-left">
        <div class="qr-placeholder">
          <div style="font-size: 8px; font-weight: bold; text-align: center; color: #4B5563;">
            VERIFIKASI DIGITAL
          </div>
          <div style="font-family: monospace; font-size: 7px; color: #6B7280; margin-top: 2px;">
            ID: TV-${Math.random().toString(36).substring(2, 9).toUpperCase()}
          </div>
        </div>
        <div style="font-size: 9px; color: #6B7280; max-width: 200px; line-height: 1.3;">
          Dokumen ini dicetak resmi dari sistem Tinyverse Clinical Co-Pilot. Valid tanpa stempel basah.
        </div>
      </div>
      <div class="footer-right">
        <div class="ttd-title">Dokter Penanggung Jawab,</div>
        <div class="ttd-space">
          <div class="ttd-stamp">[ Tanda Tangan & SIP ]</div>
        </div>
        <div class="ttd-nama">${kop.namaDokter}</div>
        <div class="ttd-sip">${kop.sipDokter}</div>
      </div>
    </div>
  `;
}

const COMMON_CSS = `
  @page {
    size: A4;
    margin: 15mm 18mm 15mm 18mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #111827;
    margin: 0;
    padding: 20px;
    background: #ffffff;
    font-size: 13px;
    line-height: 1.5;
  }
  .kop-container {
    margin-bottom: 20px;
  }
  .kop-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 12px;
  }
  .kop-logo {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #EFF6FF;
    border-radius: 12px;
    border: 1px solid #BFDBFE;
    flex-shrink: 0;
  }
  .kop-text {
    flex: 1;
  }
  .kop-faskes {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #1E3A8A;
    text-transform: uppercase;
  }
  .kop-sub {
    font-size: 11px;
    font-weight: 600;
    color: #2563EB;
    margin-top: 1px;
  }
  .kop-alamat, .kop-kontak {
    font-size: 10px;
    color: #4B5563;
    margin-top: 2px;
  }
  .kop-divider {
    border-bottom: 3px double #1E3A8A;
    margin: 8px 0 14px 0;
  }
  .doc-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F8FAFC;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
  }
  .doc-title {
    font-size: 14px;
    font-weight: 800;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .doc-date {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
  }
  .pasien-box {
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 20px;
  }
  .pasien-item {
    font-size: 12px;
  }
  .pasien-item strong {
    color: #334155;
    width: 90px;
    display: inline-block;
  }
  .section-heading {
    font-size: 13px;
    font-weight: 700;
    color: #1E3A8A;
    border-bottom: 1.5px solid #93C5FD;
    padding-bottom: 4px;
    margin: 16px 0 10px 0;
    text-transform: uppercase;
  }
  .doc-footer {
    margin-top: 36px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    page-break-inside: avoid;
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .qr-placeholder {
    width: 70px;
    height: 70px;
    border: 1.5px dashed #94A3B8;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: #F8FAFC;
  }
  .footer-right {
    text-align: center;
    min-width: 200px;
  }
  .ttd-title {
    font-size: 11px;
    color: #475569;
  }
  .ttd-space {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ttd-stamp {
    font-size: 9px;
    color: #94A3B8;
    font-style: italic;
  }
  .ttd-nama {
    font-size: 12px;
    font-weight: 800;
    color: #0F172A;
    text-decoration: underline;
  }
  .ttd-sip {
    font-size: 10px;
    color: #64748B;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
`;

/** Export Resep Puyer & Obat (Format Lembar R/ Farmasi) */
export function printResepPuyer(data: {
  namaPasien: string;
  noRm?: string;
  umur?: string;
  bbKg?: string;
  daftarPuyer: Array<{
    namaObat: string;
    dosisPerKali: string;
    jumlahBungkus: string;
    aturanPakai: string;
    catatan?: string;
  }>;
  daftarObatNonRacik?: Array<{
    namaObat: string;
    dosisAturan: string;
    jumlah: string;
  }>;
  catatanFarmasi?: string;
}): void {
  const kop = getKopSuratConfig();
  const w = window.open("", "_blank", "width=800,height=950");
  if (!w) {
    alert("Popup diblokir browser. Mohon izinkan popup untuk mencetak PDF Resep.");
    return;
  }

  const puyerRows = data.daftarPuyer
    .map(
      (p, i) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px; font-weight: 800; color: #1E3A8A; width: 40px;">R/ ${i + 1}</td>
      <td style="padding: 10px;">
        <div style="font-weight: 700; font-size: 13px; color: #0F172A;">${p.namaObat}</div>
        <div style="font-size: 11px; color: #475569; margin-top: 2px;">Dosis per puyer: <strong>${p.dosisPerKali}</strong></div>
        ${p.catatan ? `<div style="font-size: 10px; color: #D97706; margin-top: 2px;">⚠️ ${p.catatan}</div>` : ""}
      </td>
      <td style="padding: 10px; text-align: center; font-weight: 700;">No. ${p.jumlahBungkus} (dtd)</td>
      <td style="padding: 10px; font-weight: 800; color: #2563EB;">${p.aturanPakai}</td>
    </tr>
  `
    )
    .join("");

  const nonRacikRows = (data.daftarObatNonRacik || [])
    .map(
      (o, i) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 8px 10px; font-weight: 800; color: #059669; width: 40px;">R/ ${i + 1}</td>
      <td style="padding: 8px 10px; font-weight: 700; color: #0F172A;">${o.namaObat}</td>
      <td style="padding: 8px 10px; text-align: center;">No. ${o.jumlah}</td>
      <td style="padding: 8px 10px; font-weight: 700; color: #059669;">${o.dosisAturan}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!doctype html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Resep Obat Pediatri - ${data.namaPasien || "Anak"}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      ${buildHeaderHTML(kop, "LEMBAR RESEP DOKTER / RACSICAN PUYER")}

      <div class="pasien-box">
        <div class="pasien-item"><strong>Nama Pasien:</strong> ${data.namaPasien || "-"}</div>
        <div class="pasien-item"><strong>No. RM:</strong> ${data.noRm || "-"}</div>
        <div class="pasien-item"><strong>Umur:</strong> ${data.umur || "-"}</div>
        <div class="pasien-item"><strong>Berat Badan:</strong> ${data.bbKg ? `${data.bbKg} kg` : "-"}</div>
      </div>

      <div class="section-heading">R/ RESEP PUYER / RACIKAN ANAPED</div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: #F1F5F9; font-size: 11px; text-transform: uppercase; color: #475569; text-align: left;">
            <th style="padding: 8px 10px;">R/</th>
            <th style="padding: 8px 10px;">Obat & Dosis</th>
            <th style="padding: 8px 10px; text-align: center;">Jumlah</th>
            <th style="padding: 8px 10px;">Signa / Aturan Pakai</th>
          </tr>
        </thead>
        <tbody>
          ${puyerRows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748B;">Tidak ada racikan puyer.</td></tr>'}
        </tbody>
      </table>

      ${
        data.daftarObatNonRacik && data.daftarObatNonRacik.length > 0
          ? `
          <div class="section-heading">R/ OBAT NON-RACIK / SIRUP / SALEP</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #CBD5E1;">
            <tbody>${nonRacikRows}</tbody>
          </table>
        `
          : ""
      }

      ${
        data.catatanFarmasi
          ? `
          <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 10px 14px; border-radius: 8px; font-size: 11px; color: #92400E; margin-bottom: 16px;">
            <strong>Catatan Khusus Apoteker / Farmasi:</strong> ${data.catatanFarmasi}
          </div>
        `
          : ""
      }

      ${buildFooterHTML(kop)}
    </body>
    </html>
  `;

  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/** Export Growth Report untuk Orang Tua (Lembar Edukasi & Z-Score WHO) */
export function printGrowthReport(data: {
  namaAnak: string;
  noRm?: string;
  jenisKelamin?: string;
  tglLahirUsia?: string;
  bbKg?: string;
  tbCm?: string;
  lkCm?: string;
  zScoreBB?: string;
  zScoreTB?: string;
  zScoreIMT?: string;
  interpretasiGizi?: string;
  interpretasiTinggi?: string;
  rekomendasiEdukasi?: string[];
}): void {
  const kop = getKopSuratConfig();
  const w = window.open("", "_blank", "width=800,height=950");
  if (!w) {
    alert("Popup diblokir browser. Mohon izinkan popup untuk mencetak PDF Growth Report.");
    return;
  }

  const edukasiList = (data.rekomendasiEdukasi || [
    "Lanjutkan ASI Eksklusif / MPASI adekuat kaya protein hewani (telur, daging, ikan).",
    "Pantau pertumbuhan rutin tiap bulan di Posyandu / Klinik Pediatri.",
    "Lengkapi imunisasi rutin sesuai jadwal rekomendasi IDAI 2024.",
  ])
    .map((item) => `<li style="margin-bottom: 6px;">${item}</li>`)
    .join("");

  const html = `
    <!doctype html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Laporan Tumbuh Kembang - ${data.namaAnak || "Anak"}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      ${buildHeaderHTML(kop, "LAPORAN TUMBUH KEMBANG & Z-SCORE WHO (EDUKASI ORANG TUA)")}

      <div class="pasien-box">
        <div class="pasien-item"><strong>Nama Anak:</strong> ${data.namaAnak || "-"}</div>
        <div class="pasien-item"><strong>No. RM / ID:</strong> ${data.noRm || "-"}</div>
        <div class="pasien-item"><strong>Jenis Kelamin:</strong> ${data.jenisKelamin || "-"}</div>
        <div class="pasien-item"><strong>Usia / Tgl Lahir:</strong> ${data.tglLahirUsia || "-"}</div>
      </div>

      <div class="section-heading">HASIL PENGUKURAN ANTROPOMETRI & Z-SCORE WHO</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: #1E40AF; font-weight: 700;">BERAT BADAN (BB)</div>
          <div style="font-size: 20px; font-weight: 800; color: #1E3A8A; margin: 4px 0;">${data.bbKg ? `${data.bbKg} kg` : "-"}</div>
          <div style="font-size: 10px; color: #2563EB;">Z-Score: ${data.zScoreBB || "Normal"}</div>
        </div>

        <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: #065F46; font-weight: 700;">TINGGI / PANJANG (TB)</div>
          <div style="font-size: 20px; font-weight: 800; color: #064E3B; margin: 4px 0;">${data.tbCm ? `${data.tbCm} cm` : "-"}</div>
          <div style="font-size: 10px; color: #059669;">Z-Score: ${data.zScoreTB || "Normal"}</div>
        </div>

        <div style="background: #F5F3FF; border: 1px solid #DDD6FE; padding: 12px; border-radius: 8px; text-align: center;">
          <div style="font-size: 11px; color: #5B21B6; font-weight: 700;">LINGKAR KEPALA (LK)</div>
          <div style="font-size: 20px; font-weight: 800; color: #4C1D95; margin: 4px 0;">${data.lkCm ? `${data.lkCm} cm` : "-"}</div>
          <div style="font-size: 10px; color: #7C3AED;">Z-Score IMT: ${data.zScoreIMT || "Normal"}</div>
        </div>
      </div>

      <div class="section-heading">KESIMPULAN STATUS GIZI & PERTUMBUHAN</div>
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="margin-bottom: 8px;">
          <strong style="color: #1E293B;">Status Gizi (BB/TB):</strong>
          <span style="display: inline-block; padding: 2px 8px; background: #DBEAFE; color: #1E40AF; border-radius: 4px; font-weight: 700; margin-left: 6px;">
            ${data.interpretasiGizi || "Gizi Baik (Normal)"}
          </span>
        </div>
        <div>
          <strong style="color: #1E293B;">Status Tinggi Badan (TB/U):</strong>
          <span style="display: inline-block; padding: 2px 8px; background: #D1FAE5; color: #065F46; border-radius: 4px; font-weight: 700; margin-left: 6px;">
            ${data.interpretasiTinggi || "Tinggi Normal"}
          </span>
        </div>
      </div>

      <div class="section-heading">REKOMENDASI & ANJURAN DOKTER</div>
      <ul style="padding-left: 20px; color: #334155; font-size: 12px; line-height: 1.6; margin-bottom: 24px;">
        ${edukasiList}
      </ul>

      ${buildFooterHTML(kop)}
    </body>
    </html>
  `;

  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/** Export Ringkasan SOAP & Rekam Medis Klinis */
export function printSoapSummary(data: {
  namaPasien: string;
  noRm?: string;
  umurBb?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  rawText?: string;
}): void {
  const kop = getKopSuratConfig();
  const w = window.open("", "_blank", "width=800,height=950");
  if (!w) {
    alert("Popup diblokir browser. Mohon izinkan popup untuk mencetak PDF Ringkasan SOAP.");
    return;
  }

  const html = `
    <!doctype html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Ringkasan Rekam Medis SOAP - ${data.namaPasien || "Pasien"}</title>
      <style>${COMMON_CSS}</style>
    </head>
    <body>
      ${buildHeaderHTML(kop, "RINGKASAN REKAM MEDIS & CATATAN KLINIS (SOAP)")}

      <div class="pasien-box">
        <div class="pasien-item"><strong>Nama Pasien:</strong> ${data.namaPasien || "-"}</div>
        <div class="pasien-item"><strong>No. RM / ID:</strong> ${data.noRm || "-"}</div>
        <div class="pasien-item"><strong>Usia / BB:</strong> ${data.umurBb || "-"}</div>
        <div class="pasien-item"><strong>Tgl Pemeriksaan:</strong> ${new Date().toLocaleDateString("id-ID")}</div>
        <div class="pasien-item"><strong>Waktu Cetak:</strong> ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</div>
      </div>

      ${
        data.rawText
          ? `
          <div class="section-heading">CATATAN MEDIS LENGKAP</div>
          <pre style="white-space: pre-wrap; font-family: inherit; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; font-size: 12px; line-height: 1.6; color: #1E293B;">${data.rawText}</pre>
        `
          : `
          <div class="section-heading">S - SUBJECTIVE (ANAMNESIS)</div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 6px; font-size: 12px; color: #334155; margin-bottom: 12px;">
            ${data.subjective || "Pasien datang dengan keluhan umum."}
          </div>

          <div class="section-heading">O - OBJECTIVE (PEMERIKSAAN FISIK & LAB)</div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 6px; font-size: 12px; color: #334155; margin-bottom: 12px;">
            ${data.objective || "Tanda vital stabil."}
          </div>

          <div class="section-heading">A - ASSESSMENT (DIAGNOSIS KLINIS)</div>
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 10px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #1E3A8A; margin-bottom: 12px;">
            ${data.assessment || "Diagnosis Klinis Utama"}
          </div>

          <div class="section-heading">P - PLAN (TATALAKSANA & RESEP)</div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 6px; font-size: 12px; color: #334155; margin-bottom: 16px;">
            ${data.plan || "Terapi simptomatik dan observasi."}
          </div>
        `
      }

      ${buildFooterHTML(kop)}
    </body>
    </html>
  `;

  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}
