import type { Vaccine } from "../model/types";

/**
 * Materi 15 vaksin (port 1:1 dari array `VAKSIN` di imunisasi-tool.html v17,
 * entitas HTML sudah didekode ke karakter biasa). Urutan dipertahankan sama
 * persis agar dropdown identik dengan versi lama.
 */
export const VACCINES: Vaccine[] = [
  {
    id: "hepatitis-b",
    nama: "Hepatitis B (HB)",
    mencegah: "Hepatitis B (infeksi hati)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Rekombinan (subunit HBsAg)",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Monovalen <24 jam pascalahir (didahului vitamin K1 ≥30 menit); lanjut usia 2, 3, 4 bln dalam vaksin kombinasi.",
    kipi: "Nyeri/kemerahan lokal, demam ringan.",
    kontraindikasi: "Anafilaksis terhadap dosis sebelumnya atau komponen (mis. ragi).",
    catatan:
      "BBLR <2000 g: tunda sampai usia 1 bln/pulang, kecuali ibu HBsAg+. Ibu HBsAg+: beri HB + HBIg <24 jam pada paha berbeda; periksa anti-HBs & HBsAg usia 9–12 bln.",
  },
  {
    id: "polio",
    nama: "Polio (bOPV & IPV)",
    mencegah: "Poliomielitis (lumpuh layuh akut)",
    badges: [
      { label: "Hidup (OPV)", kind: "hidup" },
      { label: "Inaktif (IPV)", kind: "inaktif" },
    ],
    jenis:
      "bOPV = virus hidup dilemahkan (serotipe 1 & 3); IPV = virus inaktif (serotipe 1, 2, 3)",
    caraPemberian: "bOPV: oral (tetes) · IPV: suntik IM",
    jadwalDosis:
      "bOPV-0 saat lahir/pulang; bOPV usia 2, 3, 4 bln; IPV minimal 2x (mis. usia 4 & 9 bln sesuai Kemenkes); booster 18 bln & 5 thn.",
    kipi: "OPV: sangat jarang VAPP. IPV: nyeri lokal ringan.",
    kontraindikasi: "OPV pada imunodefisiensi atau kontak imunokompromais → gunakan IPV.",
    catatan: "Masa transisi eradikasi polio membutuhkan minimal 3x bOPV dan 2x IPV.",
  },
  {
    id: "bcg",
    nama: "BCG",
    mencegah: "Tuberkulosis (TB)",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Bakteri hidup dilemahkan (M. bovis)",
    caraPemberian: "Suntik intrakutan",
    jadwalDosis:
      "1 dosis, segera pascalahir / optimal sebelum usia 1 bln. Usia ≥3 bln: beri bila uji tuberkulin negatif.",
    kipi: "Papul → ulkus kecil lalu jaringan parut; kadang limfadenitis regional.",
    kontraindikasi: "Imunodefisiensi berat, HIV bergejala.",
    catatan:
      "Bayi dari ibu TB aktif: tunda BCG, beri terapi pencegahan TB dulu. Bila uji tuberkulin tak tersedia, BCG tetap diberikan; reaksi lokal cepat pada minggu-1 → evaluasi TB.",
  },
  {
    id: "dtp",
    nama: "DTP",
    mencegah: "Difteri, Tetanus, Pertusis (batuk rejan)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis:
      "Toksoid difteri & tetanus + komponen pertusis whole-cell (wP) / aselular (aP)",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Mulai usia 6 minggu; DTPw/DTPa pada 2,3,4 atau 2,4,6 bln; booster 18 bln, 5–7 thn, 10–18 thn. Usia ≥7 thn pakai Td/Tdap.",
    kipi: "Demam, nyeri/bengkak lokal, rewel (wP lebih reaktogenik).",
    kontraindikasi:
      "Ensefalopati dalam 7 hari pasca-dosis pertusis sebelumnya; anafilaksis.",
    catatan: "BIAS SD: kelas 1 DT, kelas 2 & 5 Td.",
  },
  {
    id: "hib",
    nama: "Hib",
    mencegah: "Meningitis, pneumonia, epiglotitis (Haemophilus influenzae tipe b)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Polisakarida terkonjugasi (subunit)",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Usia 2,3,4 atau 2,4,6 bln (dalam kombinasi penta/heksavalen) + booster 18 bln.",
    kipi: "Nyeri lokal, demam ringan.",
    kontraindikasi: "Anafilaksis terhadap komponen.",
    catatan: "Umumnya diberikan sebagai kombinasi DTP-HB-Hib.",
  },
  {
    id: "pcv",
    nama: "PCV (Pneumokokus)",
    mencegah: "Penyakit pneumokokus (pneumonia, meningitis, otitis media, bakteremia)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Konjugat polisakarida (subunit)",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Usia 2, 4, 6 bln + booster 12–15 bln. Program nasional PCV13: usia 2, 3, 12 bln.",
    kipi: "Demam, nyeri lokal, rewel.",
    kontraindikasi: "Anafilaksis terhadap komponen.",
    catatan:
      "Catch-up: 7–12 bln → 2x (interval ≥1 bln) + booster; 1–2 thn → 2x (interval ≥2 bln); 2–5 thn → PCV10 2x atau PCV13/15 1x.",
  },
  {
    id: "rotavirus",
    nama: "Rotavirus (RV)",
    mencegah: "Diare berat / gastroenteritis rotavirus",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Virus hidup dilemahkan (oral)",
    caraPemberian: "Oral (tetes)",
    jadwalDosis:
      "RV1 monovalen 2 dosis (dosis-1 usia 6–12 mgg, dosis-2 interval ≥4 mgg, paling lambat 24 mgg). RV5 pentavalen 3 dosis (mulai 6–12 mgg, interval 4–10 mgg, dosis-3 paling lambat 32 mgg). Program nasional 2,3,4 bln.",
    kipi: "Rewel, diare/muntah ringan.",
    kontraindikasi: "Riwayat intususepsi, malformasi kongenital saluran cerna, SCID.",
    catatan: "Batas usia atas ketat — jangan memulai bila sudah melewati batas.",
  },
  {
    id: "influenza",
    nama: "Influenza",
    mencegah: "Influenza (flu musiman)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Virus inaktif (IIV)",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Mulai usia 6 bln, diulang tiap tahun. Usia 6 bln–8 thn seri pertama 2 dosis (interval 4 mgg); ≥9 thn cukup 1 dosis.",
    kipi: "Nyeri lokal, demam ringan.",
    kontraindikasi: "Anafilaksis terhadap komponen; alergi telur berat (pertimbangan).",
    catatan: "Gunakan sediaan strain yang tersedia tiap musim.",
  },
  {
    id: "mr-mmr",
    nama: "MR / MMR",
    mencegah: "Campak & Rubela (MMR juga Gondong/mumps)",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Virus hidup dilemahkan",
    caraPemberian: "Suntik subkutan (SC)",
    jadwalDosis:
      "MR mulai 9 bln; dosis-2 usia 15–18 bln; dosis-3 usia 5–7 thn. Bila belum MR sampai 12 bln → boleh MR/MMR, dosis-2 interval 6 bln, dosis-3 usia 5–7 thn.",
    kipi: "Demam & ruam hari ke-7–12; jarang kejang demam, trombositopenia transien.",
    kontraindikasi: "Imunodefisiensi berat, kehamilan.",
    catatan: "Dapat diberikan sebagai MMRV (lihat Varisela).",
  },
  {
    id: "je",
    nama: "JE (Japanese Encephalitis)",
    mencegah: "Japanese encephalitis (radang otak)",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Virus hidup dilemahkan (mis. Imojev)",
    caraPemberian: "Suntik subkutan (SC)",
    jadwalDosis:
      "Untuk daerah endemis atau yang akan bepergian ke endemis ≥1 bln: dosis-1 mulai usia 9 bln; booster 1–2 thn kemudian (bagi yang tinggal di endemis).",
    kipi: "Nyeri lokal, demam.",
    kontraindikasi: "Imunodefisiensi, kehamilan.",
    catatan: "Endemis di Indonesia antara lain Bali.",
  },
  {
    id: "varisela",
    nama: "Varisela",
    mencegah: "Cacar air (varicella)",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Virus hidup dilemahkan",
    caraPemberian: "Suntik subkutan (SC)",
    jadwalDosis:
      "Mulai usia 12 bln. Usia 1–12 thn 2 dosis (interval 6 mgg–3 bln); ≥13 thn interval 4–6 mgg.",
    kipi: "Nyeri lokal; kadang ruam ringan mirip varisela.",
    kontraindikasi: "Imunodefisiensi berat, kehamilan.",
    catatan:
      "MMRV: dosis primer untuk ≥2 thn yang belum MR/MMR & varisela; sebagai booster untuk <2 thn yang sudah MR/MMR atau varisela.",
  },
  {
    id: "hepatitis-a",
    nama: "Hepatitis A",
    mencegah: "Hepatitis A (infeksi hati)",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Virus inaktif",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis: "Mulai usia 12 bln, 2 dosis dengan interval 6–18 bln.",
    kipi: "Nyeri lokal, demam ringan.",
    kontraindikasi: "Anafilaksis terhadap komponen.",
    catatan: "",
  },
  {
    id: "tifoid",
    nama: "Tifoid",
    mencegah: "Demam tifoid",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Polisakarida Vi (subunit), suntik",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis: "Mulai usia 2 thn, diulang tiap 3 thn.",
    kipi: "Nyeri lokal, demam ringan.",
    kontraindikasi: "Anafilaksis terhadap komponen.",
    catatan: "Tersedia juga sediaan oral Ty21a (hidup) di luar tabel ini.",
  },
  {
    id: "dengue",
    nama: "Dengue",
    mencegah: "Demam berdarah dengue (DBD)",
    badges: [{ label: "Hidup", kind: "hidup" }],
    jenis: "Virus hidup dilemahkan, tetravalen",
    caraPemberian: "Suntik subkutan (SC)",
    jadwalDosis:
      "2 dosis dengan interval 3 bln, usia 6–45 thn. Tanpa pre-skrining serologis.",
    kipi: "Nyeri lokal, sakit kepala, demam.",
    kontraindikasi: "Imunodefisiensi, kehamilan.",
    catatan: "Rekomendasi baru IDAI (sediaan TAK-003).",
  },
  {
    id: "hpv",
    nama: "HPV",
    mencegah: "Kanker serviks & penyakit terkait Human Papillomavirus",
    badges: [{ label: "Inaktif", kind: "inaktif" }],
    jenis: "Partikel mirip virus (VLP) rekombinan — subunit",
    caraPemberian: "Suntik intramuskular (IM)",
    jadwalDosis:
      "Perempuan 9–14 thn: 2 dosis interval 6–12 bln (BIAS: kelas 5 & 6). Usia ≥15 thn: 3 dosis — bivalen 0,1,6 bln; quadri/nonavalen 0,2,6 bln.",
    kipi: "Nyeri lokal, sinkop pasca-suntik (remaja).",
    kontraindikasi: "Anafilaksis terhadap komponen; kehamilan.",
    catatan: "",
  },
];
