import { DAFTAR_SKOR, type HasilInterpretasi } from "./data";

export interface HasilSkor extends HasilInterpretasi {
  total: number;
}

/**
 * Fungsi murni generik untuk semua skor di DAFTAR_SKOR.
 * Menerima id skor + indeks opsi terpilih per parameter (urut sesuai items),
 * menjumlahkan nilai, lalu memanggil interpret milik skor tersebut.
 * Deterministik dan tanpa efek samping.
 */
export function hitungSkor(id: string, pilihan: number[]): HasilSkor {
  const def = DAFTAR_SKOR.find((s) => s.id === id);
  if (!def) throw new Error(`Skor tidak dikenal: ${id}`);
  if (pilihan.length !== def.items.length) {
    throw new Error(
      `Jumlah pilihan (${pilihan.length}) harus sama dengan jumlah parameter (${def.items.length}) untuk ${def.nama}.`
    );
  }
  const vals = pilihan.map((idx, i) => {
    const it = def.items[i];
    if (!it) {
      throw new Error(`Parameter ke-${i + 1} tidak ditemukan pada ${def.nama}.`);
    }
    if (!Number.isInteger(idx) || idx < 0 || idx >= it.opsi.length) {
      throw new Error(`Indeks opsi tidak valid untuk parameter "${it.label}".`);
    }
    const opsi = it.opsi[idx];
    if (!opsi) {
      throw new Error(`Opsi tidak ditemukan untuk parameter "${it.label}".`);
    }
    return opsi.nilai;
  });
  const total = vals.reduce((a, b) => a + b, 0);
  const r = def.interpret(total, vals);
  return { total, ...r };
}