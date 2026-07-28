/*
 * Penambal tipe ObatPuyer.
 *
 * Katalog v17 memuat bidang label/metadata (jenis, icon, kelasAlergi, dst) yang
 * tidak ada di tipe `Obat` milik clinical-core, sehingga TypeScript menolak
 * literal katalog. Skrip ini HANYA melengkapi deklarasi tipe — tidak ada satu
 * pun nilai data, angka dosis, atau kalibrasi yang disentuh.
 *
 * Jalankan dari akar proyek:  node perbaiki-tipe-obat.mjs
 * Aman dijalankan berulang kali.
 */
import fs from 'node:fs';

const p = 'apps/web/src/features/puyer-tool/obatKatalog.ts';
if (!fs.existsSync(p)) {
  console.error('TIDAK KETEMU: ' + p + ' — jalankan skrip ini dari akar proyek tinyverse.');
  process.exit(1);
}

let s = fs.readFileSync(p, 'utf8');

if (/\n\tjenis\?: string;/.test(s)) {
  console.log('Tipe ObatPuyer sudah lengkap — tidak ada yang diubah.');
  process.exit(0);
}

const mulai = s.indexOf('export interface ObatPuyer extends Obat {');
if (mulai < 0) {
  console.error('Blok "export interface ObatPuyer extends Obat {" tidak ditemukan.');
  process.exit(1);
}
const akhir = s.indexOf('\n}', mulai);
if (akhir < 0) {
  console.error('Penutup interface tidak ditemukan.');
  process.exit(1);
}

const baru = [
  'export interface ObatPuyer extends Obat {',
  '\tid: string;',
  '',
  '\t/* Bidang v17 yang tidak ada di tipe Obat clinical-core. Semuanya label &',
  '\t   metadata keselamatan — tidak dipakai dalam perhitungan dosis. */',
  '\tjenis?: string;',
  '\ticon?: string;',
  '\talias?: string[];',
  '\tkelasAlergi?: string[];',
  '\tinteraksiTags?: string[];',
  '\tkontraindikasi?: string[];',
  '\tperingatan?: string[];',
  '\tkeselamatanVersi?: string;',
  '',
  '\t/* Preset khusus layar Racik Puyer. */',
  '\tbisaDipuyer?: boolean;',
  '\tpuyerSediaanMg?: number;',
  '\tpuyer?: {',
  '\t\tmode: "mgkg" | "mgkali";',
  '\t\tdosis: number;',
  '\t\tsediaan: number;',
  '\t\talias?: string[];',
  '\t\tcatatan?: string;',
  '\t};',
].join('\n');

s = s.slice(0, mulai) + baru + s.slice(akhir);
fs.writeFileSync(p, s);
console.log('Tipe ObatPuyer dilengkapi (jenis, icon, kelasAlergi, interaksiTags, kontraindikasi, peringatan, keselamatanVersi).');
