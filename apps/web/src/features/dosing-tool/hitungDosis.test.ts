import { describe, expect, it } from "vitest";
import { OBAT_LIST } from "./dosisData";
import { formatRentangDosis, hitungDosisInti } from "./hitungDosis";

// Obat yang dipulihkan dari basis data kalkulator iframe. Jangan dihapus:
// daftar ini menjaga agar tidak ada obat yang hilang lagi saat refaktor.
const OBAT_PULIHAN = [
  "sefadroksil", "sefaklor", "dikloksasilin", "kloramfenikol", "difenhidramin",
  "omeprazole", "griseofulvin", "asam-folat", "klindamisin", "isoniazid",
  "rifampisin", "pirazinamid", "etambutol", "flukonazol", "desloratadin",
  "prometazin", "diklofenak", "asam-asetilsalisilat", "montelukast", "diazepam",
  "fenobarbital", "lansoprazol", "sukralfat", "laktulosa", "metilprednisolon",
  "hidrokortison", "vitamin-k1", "tiamin",
];

function ambilObat(id: string) {
  const obat = OBAT_LIST.find((o) => o.id === id);
  if (!obat) throw new Error("Obat tidak ditemukan dalam basis data: " + id);
  return obat;
}

function hitung(
  id: string,
  beratBadan: string | number,
  usiaBulan: string | number = "",
  sediaanIndex: string | number = 0
) {
  return hitungDosisInti(ambilObat(id), beratBadan, usiaBulan, sediaanIndex);
}

const adaPeringatan = (peringatan: string[], cuplikan: string) =>
  peringatan.some((p) => p.includes(cuplikan));

describe("kelengkapan basis data obat", () => {
  it("memuat 63 obat", () => {
    expect(OBAT_LIST).toHaveLength(63);
  });

  it("tidak memiliki id ganda", () => {
    const id = OBAT_LIST.map((o) => o.id);
    expect(new Set(id).size).toBe(id.length);
  });

  it("memuat seluruh 28 obat yang dipulihkan", () => {
    const id = new Set(OBAT_LIST.map((o) => o.id));
    const hilang = OBAT_PULIHAN.filter((x) => !id.has(x));
    expect(hilang).toEqual([]);
  });

  it("setiap obat memiliki nama dan jenis", () => {
    for (const obat of OBAT_LIST) {
      expect(String(obat.nama || "").length).toBeGreaterThan(0);
      expect(String(obat.jenis || "").length).toBeGreaterThan(0);
    }
  });
});

describe("Paracetamol - dosis per kali berdasarkan berat badan", () => {
  it("BB 12 kg menghasilkan 120-180 mg per kali", () => {
    const h = hitung("paracetamol", "12", "", 1);
    expect(h.error).toBeNull();
    expect(h.dosisMinMg).toBe(120);
    expect(h.dosisMaxMg).toBe(180);
  });

  it("sirup 120 mg/5 mL menghasilkan 5-7,5 mL", () => {
    const h = hitung("paracetamol", "12", "", 1);
    expect(h.dosisMinMl).toBeCloseTo(5, 6);
    expect(h.dosisMaxMl).toBeCloseTo(7.5, 6);
    expect(h.dosisMinTablet).toBeNull();
  });

  it("drops 100 mg/mL menghasilkan 1,2-1,8 mL", () => {
    const h = hitung("paracetamol", "12", "", 0);
    expect(h.dosisMinMl).toBeCloseTo(1.2, 6);
    expect(h.dosisMaxMl).toBeCloseTo(1.8, 6);
  });

  it("tablet 500 mg dihitung sebagai tablet, BUKAN mL", () => {
    const h = hitung("paracetamol", "12", "", 4);
    expect(h.dosisMinMl).toBeNull();
    expect(h.dosisMaxMl).toBeNull();
    expect(h.dosisMinTablet).toBeCloseTo(0.24, 6);
    expect(h.dosisMaxTablet).toBeCloseTo(0.36, 6);
  });

  it("mg per kali tidak berubah walau bentuk sediaan diganti", () => {
    const mg = [0, 1, 2, 3, 4].map((s) => hitung("paracetamol", "12", "", s).dosisMaxMg);
    expect(new Set(mg).size).toBe(1);
  });

  it("BB 80 kg dibatasi 1000 mg per kali dan 4000 mg per hari", () => {
    const h = hitung("paracetamol", "80", "", 1);
    expect(h.dosisMaxMg).toBe(1000);
    expect(h.dosisMinMg).toBe(800);
    expect(adaPeringatan(h.peringatan, "melebihi dosis maksimal per kali")).toBe(true);
    expect(adaPeringatan(h.peringatan, "4000")).toBe(true);
  });

  it("berat badan kosong atau nol ditolak", () => {
    expect(hitung("paracetamol", "").error).not.toBeNull();
    expect(hitung("paracetamol", "0").error).not.toBeNull();
    expect(hitung("paracetamol", "-5").error).not.toBeNull();
  });

  it("berat badan jauh dari perkiraan usia memicu peringatan", () => {
    const h = hitung("paracetamol", "30", "12", 1);
    expect(h.error).toBeNull();
    expect(h.peringatan.length).toBeGreaterThan(0);
  });
});

describe("dosis harian yang dibagi per pemberian", () => {
  it("Amoxicillin 20 kg: 500-1000 mg/hari dibagi 3", () => {
    const h = hitung("amoxicillin", "20", "", 1);
    expect(h.dosisHarianMinMg).toBe(500);
    expect(h.dosisHarianMaxMg).toBe(1000);
    expect(h.dosesPerDayFinal).toBe(3);
    expect(h.dosisMinMg).toBeCloseTo(166.6667, 3);
    expect(h.dosisMaxMg).toBeCloseTo(333.3333, 3);
    expect(h.dosisMaxMl).toBeCloseTo(6.6667, 3);
  });

  it("Amoxicillin 100 kg dibatasi 2000 mg/hari", () => {
    const h = hitung("amoxicillin", "100", "", 1);
    expect(h.dosisHarianMaxMg).toBe(2000);
    expect(h.dosisMaxMg).toBeCloseTo(666.6667, 3);
    expect(adaPeringatan(h.peringatan, "melebihi batas harian")).toBe(true);
  });

  it("Ambroxol 10 kg: sirup 15 mg/5 mL menghasilkan mL, tablet menghasilkan tablet", () => {
    const sirup = hitung("ambroxol", "10", "", 0);
    expect(sirup.dosisMinMg).toBeCloseTo(3.3333, 3);
    expect(sirup.dosisMaxMl).toBeCloseTo(2.2222, 3);
    const tablet = hitung("ambroxol", "10", "", 2);
    expect(tablet.dosisMaxMg).toBeCloseTo(6.6667, 3);
    expect(tablet.dosisMaxMl).toBeNull();
    expect(tablet.dosisMaxTablet).toBeCloseTo(0.2222, 3);
  });

  it("Aspirin 10 kg: 800-1000 mg/hari dibagi 4", () => {
    const h = hitung("asam-asetilsalisilat", "10", "", 0);
    expect(h.dosisHarianMinMg).toBe(800);
    expect(h.dosisHarianMaxMg).toBe(1000);
    expect(h.dosisMinMg).toBe(200);
    expect(h.dosisMaxMg).toBe(250);
    expect(h.dosisMaxTablet).toBeCloseTo(3.125, 6);
  });
});

describe("dosis berdasarkan kelompok usia (ageBands)", () => {
  it("CTM usia 12 bulan BB 15 kg: 1,5 mg per kali (0,1 mg/kg)", () => {
    const h = hitung("chlorpheniramine-maleate-ctm", "15", "12", 0);
    expect(h.dosisMinMg).toBeCloseTo(1.5, 6);
    expect(h.dosisMaxMg).toBeCloseTo(1.5, 6);
    expect(h.band).not.toBeNull();
  });

  it("CTM usia 12 bulan BB 25 kg dibatasi 2 mg oleh batas kelompok usia", () => {
    const h = hitung("chlorpheniramine-maleate-ctm", "25", "12", 0);
    expect(h.dosisMaxMg).toBe(2);
    expect(h.dosisMinMg).toBe(2);
    expect(adaPeringatan(h.peringatan, "melebihi dosis maksimal per kali")).toBe(true);
  });

  it("CTM usia 36 bulan memakai dosis tetap 1 mg", () => {
    const h = hitung("chlorpheniramine-maleate-ctm", "14", "36", 0);
    expect(h.dosisMinMg).toBe(1);
    expect(h.dosisMaxMg).toBe(1);
    expect(h.dosisMaxMl).toBeCloseTo(2.5, 6);
  });

  it("Zat Besi usia 12 bulan BB 8 kg: 16-24 mg/hari", () => {
    const h = hitung("zat-besi", "8", "12", 0);
    expect(h.dosisMinMg).toBe(16);
    expect(h.dosisMaxMg).toBe(24);
    expect(h.dosesPerDayFinal).toBe(1);
  });

  it("Zat Besi usia 180 bulan memakai dosis tetap 60 mg", () => {
    const h = hitung("zat-besi", "50", "180", 0);
    expect(h.dosisMinMg).toBe(60);
    expect(h.dosisMaxMg).toBe(60);
  });

  it("Desloratadin usia 24 bulan: 1,25 mg", () => {
    const h = hitung("desloratadin", "12", "24", 0);
    expect(h.dosisMaxMg).toBe(1.25);
    expect(h.dosisMaxMl).toBeCloseTo(2.5, 6);
  });

  it("Montelukast usia 24 bulan: 4 mg", () => {
    const h = hitung("montelukast", "12", "24", 0);
    expect(h.dosisMaxMg).toBe(4);
  });

  it("Laktulosa memakai satuan mL sesuai usia", () => {
    expect(hitung("laktulosa", "8", "6", 0).dosisMaxMg).toBe(2.5);
    const anak = hitung("laktulosa", "14", "30", 0);
    expect(anak.dosisMinMg).toBe(2.5);
    expect(anak.dosisMaxMg).toBe(10);
  });
});

describe("dosis berdasarkan usia (byAge) dan satuan khusus", () => {
  it("Vitamin A 8 bulan 100.000 IU, 24 bulan 200.000 IU", () => {
    expect(hitung("vitamin-a", "", "8", 0).dosisMaxMg).toBe(100000);
    expect(hitung("vitamin-a", "", "24", 0).dosisMaxMg).toBe(200000);
  });

  it("usia di luar batas anak ditolak", () => {
    expect(hitung("vitamin-a", "", "220", 0).error).not.toBeNull();
  });

  it("Zinc 3 bulan 10 mg, 12 bulan 20 mg (tablet dispersible = 1 tablet)", () => {
    expect(hitung("zinc", "", "3", 0).dosisMaxMg).toBe(10);
    const tab = hitung("zinc", "", "12", 1);
    expect(tab.dosisMaxMg).toBe(20);
    expect(tab.dosisMaxTablet).toBe(1);
    expect(tab.dosisMaxMl).toBeNull();
  });

  it("Nystatin memakai satuan IU dan suspensi 100.000 IU/mL", () => {
    const h = hitung("nystatin", "10", "", 0);
    expect(h.dosisMaxMg).toBe(100000);
    expect(h.dosisMaxMl).toBeCloseTo(1, 6);
  });

  it("Ivermectin memakai satuan mcg per kg", () => {
    const h = hitung("ivermectin", "20", "", 0);
    expect(h.dosisMinMg).toBe(3000);
    expect(h.dosisMaxMg).toBe(4000);
  });

  it("ORS menghitung volume langsung per kg, tanpa konversi sediaan", () => {
    const h = hitung("oral-rehydration-salt-ors", "12", "", 0);
    expect(h.dosisMinMl).toBe(120);
    expect(h.dosisMaxMl).toBe(240);
    expect(h.dosisMinMg).toBeNull();
  });
});

describe("pembatasan dosis maksimal", () => {
  it("Ibuprofen 60 kg dibatasi 400 mg per kali dan 1200 mg per hari", () => {
    const h = hitung("ibuprofen", "60", "", 0);
    expect(h.dosisMinMg).toBe(300);
    expect(h.dosisMaxMg).toBe(400);
    expect(adaPeringatan(h.peringatan, "1200")).toBe(true);
  });

  it("Cotrimoxazole 40 kg dibatasi 160 mg TMP per kali", () => {
    const h = hitung("cotrimoxazole", "40", "", 0);
    expect(h.dosisMaxMg).toBe(160);
    expect(h.dosisMinMg).toBe(160);
  });

  it("Isoniazid 40 kg dibatasi 300 mg/hari", () => {
    const h = hitung("isoniazid", "40", "", 0);
    expect(h.dosisHarianMaxMg).toBe(300);
  });

  it("Rifampisin 50 kg dibatasi 600 mg/hari", () => {
    const h = hitung("rifampisin", "50", "", 0);
    expect(h.dosisHarianMinMg).toBe(500);
    expect(h.dosisHarianMaxMg).toBe(600);
  });

  it("Dexamethasone 10 kg: 1,5-6 mg, tablet 0,5 mg = 3-12 tablet", () => {
    const h = hitung("dexamethasone", "10", "", 0);
    expect(h.dosisMinMg).toBeCloseTo(1.5, 6);
    expect(h.dosisMaxMg).toBe(6);
    expect(h.dosisMinTablet).toBe(3);
    expect(h.dosisMaxTablet).toBe(12);
    expect(h.dosisMaxMl).toBeNull();
  });
});

describe("format tampilan rentang dosis", () => {
  it("memakai tanda hubung en dash tanpa spasi", () => {
    expect(formatRentangDosis(2, 3, "mg")).toBe("2\u20133 mg");
    expect(formatRentangDosis(2, 3, "mg")).not.toContain(" - ");
  });

  it("membulatkan sampai dua angka desimal", () => {
    expect(formatRentangDosis(0.125, 0.125, "mg")).toMatch(/^0[.,]13 mg$/);
    expect(formatRentangDosis(0.15, 0.6, "mg/kg/kali")).toMatch(/^0[.,]15\u20130[.,]6 mg\/kg\/kali$/);
  });

  it("nilai kosong menghasilkan teks acuan", () => {
    expect(formatRentangDosis(null, 5, "mg")).toBe("Sesuai aturan dosis");
  });
});

// ---------------------------------------------------------------------------
// Pagar keamanan: dijalankan pada SELURUH obat di basis data. Tujuannya bukan
// mengunci angka satu per satu, melainkan memastikan tidak ada kombinasi input
// yang menghasilkan hasil mustahil (mL negatif, tablet dari sirup, dan lain-lain).
// ---------------------------------------------------------------------------
const BB_UJI = [3, 7, 12.5, 20, 35, 60];
const USIA_UJI = [1, 6, 12, 36, 72, 144, 200];

type Kasus = {
  obat: (typeof OBAT_LIST)[number];
  hasil: ReturnType<typeof hitungDosisInti>;
  beratBadan: number;
  sediaanIndex: number;
};

const SEMUA_KASUS: Kasus[] = [];
for (const obat of OBAT_LIST) {
  const jumlahOpsi = obat.sediaanOptions?.length || 1;
  for (const beratBadan of BB_UJI) {
    for (const usiaBulan of USIA_UJI) {
      for (let sediaanIndex = 0; sediaanIndex < jumlahOpsi; sediaanIndex++) {
        const hasil = hitungDosisInti(obat, beratBadan, usiaBulan, sediaanIndex);
        if (hasil.error) continue;
        SEMUA_KASUS.push({ obat, hasil, beratBadan, sediaanIndex });
      }
    }
  }
}

describe("pagar keamanan seluruh basis data obat", () => {
  it("menghasilkan ribuan kombinasi yang dapat dihitung", () => {
    expect(SEMUA_KASUS.length).toBeGreaterThan(5000);
  });

  it("tidak pernah menghasilkan angka tak wajar (NaN, tak hingga, atau negatif)", () => {
    for (const { obat, hasil } of SEMUA_KASUS) {
      const angka = [
        hasil.dosisMinMg, hasil.dosisMaxMg,
        hasil.dosisMinMl, hasil.dosisMaxMl,
        hasil.dosisMinTablet, hasil.dosisMaxTablet,
        hasil.dosisHarianMinMg, hasil.dosisHarianMaxMg,
      ];
      for (const nilai of angka) {
        if (nilai === null || nilai === undefined) continue;
        if (!Number.isFinite(nilai) || nilai < 0) {
          throw new Error("nilai tidak wajar pada " + obat.id + ": " + nilai);
        }
      }
    }
  });

  it("nilai bawah tidak pernah melebihi nilai atas", () => {
    for (const { obat, hasil } of SEMUA_KASUS) {
      const pasangan: Array<[number | null, number | null]> = [
        [hasil.dosisMinMg, hasil.dosisMaxMg],
        [hasil.dosisMinMl, hasil.dosisMaxMl],
        [hasil.dosisMinTablet, hasil.dosisMaxTablet],
        [hasil.dosisHarianMinMg, hasil.dosisHarianMaxMg],
      ];
      for (const [bawah, atas] of pasangan) {
        if (bawah === null || atas === null) continue;
        if (bawah > atas + 1e-9) {
          throw new Error("nilai bawah > atas pada " + obat.id + ": " + bawah + " > " + atas);
        }
      }
    }
  });

  it("dosis mg tidak berubah ketika bentuk sediaan diganti", () => {
    for (const obat of OBAT_LIST) {
      const jumlahOpsi = obat.sediaanOptions?.length || 1;
      if (jumlahOpsi < 2) continue;
      for (const beratBadan of BB_UJI) {
        const acuan = hitungDosisInti(obat, beratBadan, 60, 0);
        if (acuan.error) continue;
        for (let s = 1; s < jumlahOpsi; s++) {
          const lain = hitungDosisInti(obat, beratBadan, 60, s);
          expect(lain.dosisMinMg).toBe(acuan.dosisMinMg);
          expect(lain.dosisMaxMg).toBe(acuan.dosisMaxMg);
          expect(lain.dosisHarianMaxMg).toBe(acuan.dosisHarianMaxMg);
        }
      }
    }
  });

  it("sediaan tablet/kapsul tidak pernah dihitung sebagai mL sirup", () => {
    for (const { obat, hasil, sediaanIndex } of SEMUA_KASUS) {
      const sediaan = obat.sediaanOptions?.[sediaanIndex];
      if (!sediaan || !sediaan.kekuatanMg || sediaan.sediaanMl) continue;
      if (hasil.dosisMinMl !== null || hasil.dosisMaxMl !== null) {
        throw new Error("sediaan padat menghasilkan mL pada " + obat.id + ": " + sediaan.label);
      }
      if (hasil.dosisMaxMg !== null && hasil.dosisMaxTablet === null) {
        throw new Error("sediaan padat tidak menghasilkan jumlah tablet pada " + obat.id);
      }
    }
  });

  it("jumlah tablet sesuai kekuatan sediaan", () => {
    for (const { obat, hasil, sediaanIndex } of SEMUA_KASUS) {
      const sediaan = obat.sediaanOptions?.[sediaanIndex];
      if (!sediaan || !sediaan.kekuatanMg || sediaan.sediaanMl) continue;
      if (hasil.dosisMaxMg === null || hasil.dosisMaxTablet === null) continue;
      expect(hasil.dosisMaxTablet).toBeCloseTo(hasil.dosisMaxMg / sediaan.kekuatanMg, 6);
    }
  });

  it("volume mL sesuai konsentrasi sediaan cair", () => {
    for (const { obat, hasil, sediaanIndex } of SEMUA_KASUS) {
      if (obat.doseType === "perKgVolume") continue;
      const sediaan = obat.sediaanOptions?.[sediaanIndex];
      if (!sediaan || !sediaan.sediaanMg || !sediaan.sediaanMl) continue;
      if (hasil.dosisMaxMg === null || hasil.dosisMaxMl === null) continue;
      const mgPerMl = sediaan.sediaanMg / sediaan.sediaanMl;
      expect(hasil.dosisMaxMl).toBeCloseTo(hasil.dosisMaxMg / mgPerMl, 6);
    }
  });

  it("batas dosis maksimal per kali tidak pernah dilampaui", () => {
    for (const { obat, hasil } of SEMUA_KASUS) {
      const batas = hasil.band?.dosisMaksimalTunggalMg || obat.dosisMaksimalTunggalMg;
      if (!batas || hasil.dosisMaxMg === null) continue;
      if (hasil.dosisMaxMg > batas + 1e-9) {
        throw new Error("batas per kali dilampaui pada " + obat.id + ": " + hasil.dosisMaxMg + " > " + batas);
      }
    }
  });

  it("batas dosis harian terkecil yang berlaku tidak pernah dilampaui", () => {
    for (const { obat, hasil, beratBadan } of SEMUA_KASUS) {
      if (hasil.dosisHarianMaxMg === null) continue;
      const batas: number[] = [];
      if (obat.dosisMaksimalHarianMg) batas.push(obat.dosisMaksimalHarianMg);
      if (obat.dosisMaksimalHarianPerKg) batas.push(obat.dosisMaksimalHarianPerKg * beratBadan);
      if (hasil.band?.dosisMaksimalHarianMg) batas.push(hasil.band.dosisMaksimalHarianMg);
      if (!batas.length) continue;
      const terkecil = Math.min(...batas);
      if (hasil.dosisHarianMaxMg > terkecil + 1e-9) {
        throw new Error("batas harian dilampaui pada " + obat.id + ": " + hasil.dosisHarianMaxMg + " > " + terkecil);
      }
    }
  });

  it("jumlah pemberian per hari mengikuti data obat atau kelompok usia", () => {
    for (const { hasil } of SEMUA_KASUS) {
      if (hasil.dosesPerDayFinal === null) continue;
      expect(hasil.dosesPerDayFinal).toBeGreaterThan(0);
    }
  });

  it("Asiklovir tetap membawa 5 kali pemberian per hari dari maxDosesPerDay", () => {
    expect(hitung("asiklovir", "20", "", 0).dosesPerDayFinal).toBe(5);
  });
});
