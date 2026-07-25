export interface MchatItem {
  no: number;
  teks: string;
  contoh?: string;
  /** true jika jawaban "Ya" yang menandakan risiko (bukan "Tidak"). */
  reverseScore: boolean;
}

/**
 * M-CHAT-R (Modified Checklist for Autism in Toddlers, Revised) - 20 item,
 * skrining risiko autisme untuk anak usia 16-30 bulan. Teks item merupakan
 * parafrase Bahasa Indonesia (bukan terjemahan literal) dari instrumen asli
 * Robins, Fein, & Barton (2009); makna klinis tiap item dipertahankan.
 * Item nomor 2, 5, 12 diberi skor terbalik ("Ya" = berisiko).
 */
export const MCHAT_ITEMS: MchatItem[] = [
  {
    no: 1,
    teks: "Kalau Anda menunjuk sesuatu di seberang ruangan, apakah anak Anda melihat ke arah yang ditunjuk?",
    contoh: "Mis. menunjuk mainan atau boneka binatang, apakah anak melihat ke benda itu?",
    reverseScore: false,
  },
  {
    no: 2,
    teks: "Apakah Anda pernah curiga anak Anda mungkin tuli?",
    reverseScore: true,
  },
  {
    no: 3,
    teks: "Apakah anak Anda bermain pura-pura / berkhayal?",
    contoh: "Mis. pura-pura minum dari cangkir kosong, pura-pura menelepon, atau menyuapi boneka.",
    reverseScore: false,
  },
  {
    no: 4,
    teks: "Apakah anak Anda suka memanjat benda-benda?",
    contoh: "Mis. memanjat kursi, tangga, atau perosotan.",
    reverseScore: false,
  },
  {
    no: 5,
    teks: "Apakah anak Anda menggerak-gerakkan jarinya dengan cara yang tidak biasa di depan matanya?",
    contoh: "Mis. menggoyangkan jari-jarinya dekat mata dengan cara aneh.",
    reverseScore: true,
  },
  {
    no: 6,
    teks: "Apakah anak Anda menunjuk dengan satu jari untuk meminta sesuatu atau minta bantuan?",
    contoh: "Mis. menunjuk camilan atau mainan yang tidak terjangkau.",
    reverseScore: false,
  },
  {
    no: 7,
    teks: "Apakah anak Anda menunjuk dengan satu jari untuk menunjukkan sesuatu yang menarik kepada Anda?",
    contoh: "Mis. menunjuk pesawat di langit atau truk besar di jalan.",
    reverseScore: false,
  },
  {
    no: 8,
    teks: "Apakah anak Anda tertarik pada anak-anak lain?",
    contoh: "Mis. memperhatikan, tersenyum, atau menghampiri anak lain.",
    reverseScore: false,
  },
  {
    no: 9,
    teks: "Apakah anak Anda menunjukkan barang kepada Anda dengan membawa atau mengangkatnya, hanya untuk berbagi (bukan minta tolong)?",
    contoh: "Mis. menunjukkan bunga, boneka, atau mobil-mobilan.",
    reverseScore: false,
  },
  {
    no: 10,
    teks: "Apakah anak Anda merespons saat dipanggil namanya?",
    contoh: "Mis. menoleh, bersuara, atau berhenti melakukan sesuatu saat dipanggil.",
    reverseScore: false,
  },
  {
    no: 11,
    teks: "Saat Anda tersenyum ke anak Anda, apakah ia tersenyum balik?",
    reverseScore: false,
  },
  {
    no: 12,
    teks: "Apakah anak Anda terganggu/rewel oleh suara sehari-hari?",
    contoh: "Mis. menjerit atau menangis mendengar suara vacuum cleaner atau musik keras.",
    reverseScore: true,
  },
  {
    no: 13,
    teks: "Apakah anak Anda sudah bisa berjalan?",
    reverseScore: false,
  },
  {
    no: 14,
    teks: "Apakah anak Anda menatap mata Anda saat diajak bicara, bermain, atau berpakaian?",
    reverseScore: false,
  },
  {
    no: 15,
    teks: "Apakah anak Anda mencoba menirukan gerakan Anda?",
    contoh: "Mis. melambaikan tangan, bertepuk tangan, atau menirukan suara lucu.",
    reverseScore: false,
  },
  {
    no: 16,
    teks: "Jika Anda menoleh melihat sesuatu, apakah anak Anda ikut menoleh ke arah yang sama?",
    reverseScore: false,
  },
  {
    no: 17,
    teks: "Apakah anak Anda berusaha membuat Anda memperhatikannya?",
    contoh: "Mis. melihat Anda untuk mencari pujian, atau bilang \u201clihat\u201d.",
    reverseScore: false,
  },
  {
    no: 18,
    teks: "Apakah anak Anda mengerti saat diminta melakukan sesuatu (tanpa menunjuk)?",
    contoh: "Mis. mengerti \u201cletakkan buku di kursi\u201d atau \u201cambilkan selimut\u201d.",
    reverseScore: false,
  },
  {
    no: 19,
    teks: "Kalau ada hal baru terjadi, apakah anak Anda melihat wajah Anda untuk tahu reaksi Anda?",
    contoh: "Mis. mendengar suara aneh atau melihat mainan baru, lalu melihat wajah Anda.",
    reverseScore: false,
  },
  {
    no: 20,
    teks: "Apakah anak Anda suka aktivitas gerak/ayun?",
    contoh: "Mis. diayun-ayun atau dipantul-pantulkan di atas lutut.",
    reverseScore: false,
  },
];

export type MchatJawaban = "ya" | "tidak" | null;

export interface HasilMchat {
  totalRisiko: number;
  kategori: "rendah" | "sedang" | "tinggi";
  label: string;
  saran: string;
  perluFollowUp: boolean;
}

/** Item yang tetap berisiko meski sudah masuk kategori sedang -> dipakai follow-up terarah. */
export function itemBerisiko(jawaban: Record<number, MchatJawaban>): MchatItem[] {
  return MCHAT_ITEMS.filter((item) => {
    const j = jawaban[item.no];
    if (!j) return false;
    return item.reverseScore ? j === "ya" : j === "tidak";
  });
}

export function hitungMchat(jawaban: Record<number, MchatJawaban>): HasilMchat {
  const totalRisiko = itemBerisiko(jawaban).length;

  if (totalRisiko <= 2) {
    return {
      totalRisiko,
      kategori: "rendah",
      label: "Risiko rendah",
      saran:
        "Tidak perlu tindak lanjut khusus saat ini. Bila usia anak masih <24 bulan, ulangi skrining M-CHAT-R pada usia 24 bulan. Tetap lakukan pemantauan perkembangan rutin.",
      perluFollowUp: false,
    };
  }
  if (totalRisiko <= 7) {
    return {
      totalRisiko,
      kategori: "sedang",
      label: "Risiko sedang",
      saran:
        "Lakukan wawancara lanjutan (M-CHAT-R/F) khusus untuk item yang berisiko di bawah. Bila skor M-CHAT-R/F tetap \u22652, rujuk untuk evaluasi diagnostik & intervensi dini.",
      perluFollowUp: true,
    };
  }
  return {
    totalRisiko,
    kategori: "tinggi",
    label: "Risiko tinggi",
    saran:
      "Wawancara lanjutan (Follow-Up) TIDAK wajib dilakukan dulu \u2014 langsung rujuk untuk (a) evaluasi diagnostik dan (b) layanan intervensi dini sesegera mungkin.",
    perluFollowUp: false,
  };
}
