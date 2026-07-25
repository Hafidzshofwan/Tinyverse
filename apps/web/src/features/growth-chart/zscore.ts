/**
 * Perhitungan Z-score pertumbuhan WHO — fungsi MURNI (port persis dari v17).
 *
 * WHY: Tabel rujukan WHO disimpan sebagai 7 garis SD [-3,-2,-1,0,+1,+2,+3]
 * per usia. Z-score dihitung dengan interpolasi linear antar-garis SD
 * (bukan LMS), sama seperti implementasi asli Tinyverse v17. Fungsi ini
 * dipisah dari UI agar dapat diuji dengan golden vectors.
 */

/** Satu baris tabel: nilai pada garis -3, -2, -1, 0, +1, +2, +3 SD. */
export type ZscoreRow = number[];
/** Tabel per-usia (kunci = usia bulan). */
export type ZscoreTable = Record<number, ZscoreRow>;

/** Interpolasi baris SD untuk usia pecahan (mis. 18,5 bulan) atau data tabel dengan interval berjarak. */
export function tkInterpolasiZscoreRow(table: ZscoreTable, nilaiX: number): ZscoreRow | null {
  if (!table) return null;
  if (table[nilaiX]) return table[nilaiX];

  const keys = Object.keys(table)
    .map(Number)
    .filter((k) => !isNaN(k))
    .sort((a, b) => a - b);

  if (keys.length === 0) return null;

  const minKey = keys[0];
  const maxKey = keys[keys.length - 1];

  if (minKey === undefined || maxKey === undefined) return null;

  if (nilaiX <= minKey) return table[minKey] ?? null;
  if (nilaiX >= maxKey) return table[maxKey] ?? null;

  let kLo = minKey;
  let kHi = maxKey;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k !== undefined) {
      if (k <= nilaiX) kLo = k;
      if (k >= nilaiX) {
        kHi = k;
        break;
      }
    }
  }

  if (kLo === kHi) return table[kLo] ?? null;

  const barisLo = table[kLo];
  const barisHi = table[kHi];
  if (!barisLo || !barisHi) return null;

  const t = (nilaiX - kLo) / (kHi - kLo);
  return barisLo.map((v, i) => {
    const nilaiHi = barisHi[i];
    return nilaiHi === undefined ? v : v + t * (nilaiHi - v);
  });
}

/** Hitung z-score pecahan dari sebuah baris SD dan nilai terukur. */
export function tkHitungZscoreNumerik(row: ZscoreRow, nilaiY: number): number {
  const sdLabels = [-3, -2, -1, 0, 1, 2, 3];
  for (let i = 0; i < row.length - 1; i++) {
    const lo = row[i];
    const hi = row[i + 1];
    const label = sdLabels[i];
    if (lo === undefined || hi === undefined || label === undefined) continue;
    if (nilaiY >= lo && nilaiY <= hi) {
      const frac = (nilaiY - lo) / (hi - lo);
      return label + frac;
    }
  }
  const r0 = row[0];
  const r1 = row[1];
  const r5 = row[5];
  const r6 = row[6];
  if (r0 !== undefined && r1 !== undefined && nilaiY < r0) {
    const interval = r1 - r0;
    return -3 + (nilaiY - r0) / interval;
  }
  if (r5 !== undefined && r6 !== undefined) {
    const interval = r6 - r5;
    return 3 + (nilaiY - r6) / interval;
  }
  return 0;
}

/**
 * Hitung Indeks Massa Tubuh (IMT/BMI) dari berat & tinggi badan.
 *
 * WHY: IMT/U tidak diinput manual — dihitung otomatis dari BB (kg) & TB (cm)
 * agar konsisten dengan alat growth-tool. Rumus: IMT = BB / (TB/100)^2,
 * dibulatkan 1 desimal (sama seperti tampilan alat).
 *
 * @returns nilai IMT (kg/m²) 1 desimal, atau null bila input tidak valid.
 */
export function hitungIMT(beratKg: number, tinggiCm: number): number | null {
  if (!isFinite(beratKg) || !isFinite(tinggiCm) || tinggiCm <= 0) return null;
  const tinggiMeter = tinggiCm / 100;
  return Math.round((beratKg / (tinggiMeter * tinggiMeter)) * 10) / 10;
}
