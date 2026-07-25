export type KpspSektor = "kasar" | "halus" | "bicara" | "sosialisasi";

export interface KpspQuestion {
  no: number;
  sektor: KpspSektor;
  sektorLabel: string;
  teks: string;
  petunjuk?: string;
}

export interface KpspAgeGroup {
  usiaBulan: number;
  namaGroup: string;
  deskripsi: string;
  pertanyaan: KpspQuestion[];
}

export type KpspJawaban = "ya" | "tidak" | null;

export interface KpspHasil {
  totalYa: number;
  totalTidak: number;
  kategori: "sesuai" | "meragukan" | "penyimpangan";
  label: string;
  saran: string;
}

export const KPSP_DATA: Record<number, KpspAgeGroup> = {
  3: {
    usiaBulan: 3,
    namaGroup: "KPSP Usia 3 Bulan",
    deskripsi: "Untuk bayi usia 3 bulan (rentang 3 - <6 bulan). Terdiri dari 10 pertanyaan perkembangan motorik kasar, motorik halus, bicara/bahasa, serta sosialisasi/kemandirian.",
    pertanyaan: [
      {
        no: 1,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada waktu bayi telungkup di alas yang rata, apakah ia dapat mengangkat kepalanya?",
        petunjuk: "Posisikan bayi telungkup di tempat tidur/alas datar yang aman.",
      },
      {
        no: 2,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada waktu bayi telungkup di alas yang rata, apakah ia dapat mengangkat kepalanya sampai setinggi 45 derajat?",
        petunjuk: "Kepala dan dada bagian atas terangkat dari alas datar.",
      },
      {
        no: 3,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada waktu bayi telungkup di alas yang rata, apakah ia dapat mengangkat kepalanya sampai setinggi 90 derajat dengan menumpu pada lengan bawah?",
        petunjuk: "Kepala tegak lurus dan dada terangkat, menahan beban pada kedua siku/lengan bawah.",
      },
      {
        no: 4,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada waktu bayi terlentang, apakah masing-masing lengan dan tungkainya bergerak secara bebas dan aktif?",
        petunjuk: "Amati gerakan tangan dan kaki kanan serta kiri saat bayi tenang/gembira.",
      },
      {
        no: 5,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Pada waktu bayi terlentang, apakah ia dapat menatap mata Anda?",
        petunjuk: "Tatap wajah bayi dari jarak kurang lebih 20–30 cm.",
      },
      {
        no: 6,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Pada waktu bayi terlentang, apakah ia melihat dan mengikuti gerakan benda/mainan yang digerakkan dari satu sisi ke sisi lain?",
        petunjuk: "Goyangkan benda berwarna cerah (merah/kuning) di depan mata bayi dan gerakkan perlahan melintas sudut 90 derajat.",
      },
      {
        no: 7,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Apakah bayi dapat mengeluarkan suara-suara lain selain menangis (misalnya suara ngoceh halus/cooing seperti 'ooh', 'aah')?",
        petunjuk: "Dengarkan ocehan spontan saat bayi diajak bicara atau saat bermain.",
      },
      {
        no: 8,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Apakah bayi bereaksi (terkejut, berkedip, menghentikan gerakan, atau menoleh) ketika mendengar suara keras?",
        petunjuk: "Tepuk tangan di dekat bayi tetapi tidak terlihat langsung oleh mata bayi.",
      },
      {
        no: 9,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Apakah bayi tersenyum ketika Anda mengajak tersenyum atau berbicara kepadanya?",
        petunjuk: "Ajak bayi tersenyum dan bicara ramah di depannya.",
      },
      {
        no: 10,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Apakah bayi membalas tersenyum atau menunjukkan kegembiraan saat disapa dan diajak bermain?",
        petunjuk: "Respons senyum sosial (social smile) ketika berinteraksi.",
      },
    ],
  },
};

export function hitungKpsp(jawaban: Record<number, KpspJawaban>): KpspHasil {
  let totalYa = 0;
  let totalTidak = 0;

  Object.values(jawaban).forEach((v) => {
    if (v === "ya") totalYa++;
    if (v === "tidak") totalTidak++;
  });

  if (totalYa >= 9) {
    return {
      totalYa,
      totalTidak,
      kategori: "sesuai",
      label: "Perkembangan Sesuai Umur (S)",
      saran: "Perkembangan anak sesuai dengan usianya (9–10 'YA'). Beri pujian pada ibu/pengasuh. Teruskan pola asuh dan berikan stimulasi tumbuh kembang sesuai kelompok umur. Lakukan jadwal skrining KPSP berikutnya saat usia 6 bulan.",
    };
  }

  if (totalYa >= 7) {
    return {
      totalYa,
      totalTidak,
      kategori: "meragukan",
      label: "Perkembangan Meragukan (M)",
      saran: "Perkembangan anak tergolong meragukan (7–8 'YA'). Anjurkan ibu/pengasuh untuk memberikan stimulasi lebih sering dan intensif, terutama pada sektor yang belum dijawab 'YA'. Lakukan evaluasi & skrining ulang KPSP dalam 2 minggu ke depan.",
    };
  }

  return {
    totalYa,
    totalTidak,
    kategori: "penyimpangan",
    label: "Kemungkinan Penyimpangan Perkembangan (P)",
    saran: "Kemungkinan terdapat penyimpangan perkembangan (<= 6 'YA'). Segera rujuk anak ke Fasilitas Kesehatan Rujukan (Klinik Tumbuh Kembang / Dokter Spesialis Anak) untuk evaluasi diagnostik serta penanganan intervensi dini komprehensif.",
  };
}

export function sektorTerabaikan(
  pertanyaanList: KpspQuestion[],
  jawaban: Record<number, KpspJawaban>
): KpspQuestion[] {
  return pertanyaanList.filter((q) => jawaban[q.no] === "tidak");
}
