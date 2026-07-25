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
    deskripsi: "Untuk bayi usia 3 bulan (rentang 3 - <6 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada saat bayi terlentang, apakah masing-masing lengan dan tungkai bergerak dengan mudah? Jawab ‘Tidak’ bila salah satu atau kedua tungkai atau lengan bayi bergerak tak terarah atau tak terkendali.",
      },
      {
        no: 2,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Jangan membuat suara apapun. Pada saat bayi terlentang apakah ia melihat dan menatap wajah Anda?",
      },
      {
        no: 3,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Pada saat Anda mengajak bayi berbicara dan tersenyum, apakah ia tersenyum kembali kepada Anda?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Apakah bayi dapat mengeluarkan suara-suara lain (mengoceh) selain menangis?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Apakah bayi suka tertawa keras walau tidak digelitik atau diraba-raba?",
      },
      {
        no: 6,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Ambil gulungan wool merah, lalu letakkan di atas wajah di depan mata bayi. Gerakkan wool dari samping kiri ke kanan kepala atau sebaliknya. Apakah ia dapat mengikuti gerakan Anda dengan menggerakkan kepalanya dari kanan atau kiri ke tengah?",
      },
      {
        no: 7,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Ambil gulungan wool merah, lalu letakkan di atas wajah di depan mata bayi. Gerakkan wool dari samping kiri ke kanan kepala atau sebaliknya. Apakah ia dapat mengikuti gerakan Anda dengan menggerakkan kepalanya dari satu sisi hampir sampai pada sisi yang lain?",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada saat bayi tengkurap di alas yang datar, apakah ia dapat mengangkat kepalanya seperti pada gambar?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada saat bayi tengkurap di alas yang datar, apakah ia dapat mengangkat kepalanya sehingga membentuk sudut 45˚ seperti pada gambar?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada saat bayi tengkurap di alas yang datar, apakah ia dapat mengangkat kepalanya dengan tegak seperti pada gambar?",
      },
    ],
  },
  6: {
    usiaBulan: 6,
    namaGroup: "KPSP Usia 6 Bulan",
    deskripsi: "Untuk bayi usia 6 bulan (rentang 6 - <9 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi diposisikan terlentang. Ambil gulungan wool merah, letakkan di atas wajah di depan mata bayi. Gerakkan wool dari samping kiri ke kanan kepala. Apakah ia dapat mengikuti gerakan Anda dengan menggerakkan kepala sepenuhnya dari satu ke sisi yang lain?",
      },
      {
        no: 2,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Pada posisi bayi terlentang, pegang kedua tangannya lalu tarik perlahan ke posisi duduk. Dapatkah bayi mempertahankan lehernya secara kaku seperti pada gambar? Jawab ‘Tidak’ bila kepala bayi jatuh kembali seperti gambar.",
      },
      {
        no: 3,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Ketika bayi tengkurap di alas yang datar, apakah ia dapat mengangkat dada dengan kedua lengannya sebagai penyangga seperti pada gambar?",
      },
      {
        no: 4,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Bayi dipangku orang tua atau pengasuh. Dapatkah bayi mempertahankan posisi kepala dalam keadaan tegak dan stabil? Jawab ‘Tidak’ bila kepala bayi cenderung jatuh ke kanan, kiri, atau ke dadanya.",
      },
      {
        no: 5,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Sentuhkan pensil di punggung tangan atau ujung jari bayi (jangan meletakkan di atas telapak tangan bayi). Apakah bayi dapat menggenggam pensil itu selama beberapa detik?",
      },
      {
        no: 6,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Dapatkah bayi mengarahkan matanya pada benda kecil sebesar kacang, kismis atau uang logam? Jawab ‘Tidak’ jika ia tidak dapat mengarahkan matanya.",
      },
      {
        no: 7,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Dapatkah bayi meraih mainan yang diletakkan agak jauh namun masih berada dalam jangkauan tangannya?",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada orang tua atau pengasuh, pernahkah bayi berbalik paling sedikit 2 kali, dari terlentang ke tengkurap atau sebaliknya?",
      },
      {
        no: 9,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, pernahkah bayi mengeluarkan suara gembira bernada tinggi atau memekik tetapi bukan menangis?",
      },
      {
        no: 10,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, pernahkah orang tua atau pengasuh melihat bayi tersenyum ketika melihat mainan yang lucu, gambar, atau binatang peliharaan pada saat ia bermain sendiri?",
      },
    ],
  },
  9: {
    usiaBulan: 9,
    namaGroup: "KPSP Usia 9 Bulan",
    deskripsi: "Untuk bayi usia 9 bulan (rentang 9 - <12 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh, Taruh kismis di atas meja. Dapatkah bayi memungut dengan tangannya benda−benda kecil seperti kismis, kacang-kacangan, potongan biskuit dengan gerakan miring atau menggerapai seperti gambar?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Taruh 2 kubus di atas meja, buat agar bayi dapat memungut dan memegang kubus pada masing-masing tangannya. Dapatkah ia melakukannya?",
      },
      {
        no: 3,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Tarik perhatian bayi dengan memperlihatkan gulungan wool merah, kemudian jatuhkan ke lantai. Apakah bayi mencoba mencari benda tersebut, misalnya mencari di bawah meja atau di belakang kursi?",
      },
      {
        no: 4,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Bayi dipangku orang tua atau pengasuh. Letakkan suatu mainan yang diinginkan bayi di luar jangkauannya, apakah ia mencoba mendapatkan mainan dengan mengulurkan lengan atau badannya?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah bayi menengok ke belakang seperti mendengar kedatangan seseorang pada saat bayi sedang bermain sendiri dan seseorang diam-diam datang berdiri di belakangnya? Suara keras tidak ikut dihitung. Jawab ‘Ya’ hanya jika melihat reaksinya terhadap suara yang perlahan atau bisikan.",
      },
      {
        no: 6,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengatakan 2 suku kata yang sama, misalnya: “Ma-ma”, “Da-da” atau “Pa-pa”? Jawab ‘Ya’ bila ia dapat mengeluarkan salah satu suara tersebut.",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah bayi dapat makan kue kering sendiri?",
      },
      {
        no: 8,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Tanyakan kepada orang tua atau pengasuh apakah pernah melihat bayi memindahkan mainan atau kue kering dari satu tangan ke tangan yang lain? Benda−benda panjang seperti sendok atau kerincingan bertangkai tidak ikut dinilai.",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanpa disangga oleh bantal, kursi atau dinding, dapatkah bayi duduk sendiri selama 60 detik?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Jika Anda mengangkat bayi melalui ketiaknya ke posisi berdiri, dapatkah ia menyangga sebagian berat badan dengan kedua kakinya? Jawab ‘Ya’ bila ia mencoba berdiri dan sebagian berat badan tertumpu pada kedua kakinya.",
      },
    ],
  },
  12: {
    usiaBulan: 12,
    namaGroup: "KPSP Usia 12 Bulan",
    deskripsi: "Untuk anak usia 12 bulan (rentang 12 - <15 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Letakkan pensil di telapak tangan anak. Coba ambil pensil tersebut dengan perlahan-lahan. Apakah anak menggenggam pensil dengan erat dan Anda merasa kesulitan mendapatkan pensil itu kembali?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Letakkan kismis di atas meja. Dapatkah anak memungut dengan tangannya benda−benda kecil seperti kismis, kacang−kacangan, potongan biskuit dengan gerakan miring atau menggerapai seperti gambar?",
      },
      {
        no: 3,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan 2 kubus kepada bayi. Tanpa bantuan, apakah anak dapat mempertemukan 2 kubus kecil yang ia pegang?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Sebut 2−3 kata yang dapat ditiru oleh anak (tidak perlu kata−kata yang lengkap). Apakah ia mencoba meniru kata-kata tadi?",
      },
      {
        no: 5,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada ibu atau pengasuh, apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan?",
      },
      {
        no: 6,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada ibu atau pengasuh, apakah anak dapat duduk sendiri tanpa bantuan dari posisi tidur atau tengkurap?",
      },
      {
        no: 7,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada ibu atau pengasuh, apakah anak dapat memahami makna kata ’jangan’?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada ibu atau pengasuh, apakah anak akan mencari atau terlihat mengharapkan muncul kembali jika ibu atau pengasuh bersembunyi di belakang sesuatu atau di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anak?",
      },
      {
        no: 9,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada ibu atau pengasuh, apakah anak dapat membedakan ibu atau pengasuh dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Berdirikan anak. Apakah anak dapat berdiri dengan berpegangan pada kursi atau meja selama 30 detik atau lebih?",
      },
    ],
  },
  15: {
    usiaBulan: 15,
    namaGroup: "KPSP Usia 15 Bulan",
    deskripsi: "Untuk anak usia 15 bulan (rentang 15 - <18 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan 2 kubus kepada anak. Tanpa bantuan, apakah anak dapat mempertemukan 2 kubus kecil yang ia pegang?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan sebuah kubus dan cangkir. Apakah anak dapat memasukkan 1 kubus ke dalam cangkir?",
      },
      {
        no: 3,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat berjalan dengan berpegangan?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengatakan ‘papa’ ketika ia memanggil atau melihat ayahnya, atau mengatakan ‘mama’ jika memanggil atau melihat ibunya? Jawab ‘Ya’ bila anak mengatakan salah satu di antaranya.",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengucapkan 1 kata yang bermakna selain ‘mama’, ‘papa’, atau nama panggilan orang?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat bertepuk tangan atau melambai-lambai tanpa bantuan? Jawab ‘Tidak’ bila ia membutuhkan bantuan.",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat menunjukkan apa yang diinginkannya tanpa menangis atau merengek? Jawab ‘Ya’ bila ia menunjuk, menarik atau mengeluarkan suara yang menyenangkan.",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Coba berdirikan anak. Apakah anak dapat berdiri sendiri tanpa berpegangan selama 30 detik atau lebih?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan kubus di lantai, tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut kubus di lantai dan kemudian berdiri kembali?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Apakah anak dapat berjalan di sepanjang ruangan tanpa jatuh atau terhuyung-huyung?",
      },
    ],
  },
  18: {
    usiaBulan: 18,
    namaGroup: "KPSP Usia 18 Bulan",
    deskripsi: "Untuk anak usia 18 bulan (rentang 18 - <24 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan anak sebuah pensil dan kertas. Apakah anak dapat mencoret-coret kertas tanpa bantuan atau petunjuk?",
      },
      {
        no: 2,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat menyebutkan sedikitnya 3 kata yang bermakna?",
      },
      {
        no: 3,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat menunjukkan apa yang diinginkannya tanpa menangis atau merengek?",
      },
      {
        no: 4,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat minum dari cangkir atau gelas sendiri tanpa banyak yang tumpah?",
      },
      {
        no: 5,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak suka meniru bila ibu atau pengasuh sedang melakukan pekerjaan rumah tangga (merapikan mainan, menyapu, dll)?",
      },
      {
        no: 6,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Gelindingkan bola tenis ke arah anak. Apakah anak dapat menggelindingkan atau melempar bola tersebut kembali kepada Anda?",
      },
      {
        no: 7,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan kubus di lantai, tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut kubus di lantai dan kemudian berdiri kembali?",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berjalan sepanjang ruangan. Dapatkah ia berjalan tanpa terhuyung-huyung atau terjatuh?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Dapatkah anak berjalan mundur minimal 5 langkah tanpa kehilangan keseimbangan?",
      },
      {
        no: 10,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Berikan anak perintah berikut ini dengan bantuan telunjuk atau isyarat:\n“Ambil kertas”\n“Ambil pensil”\n“Tutup pintu”\nDapatkah anak melakukan perintah tersebut dengan bantuan telunjuk atau isyarat?",
      },
    ],
  },
  21: {
    usiaBulan: 21,
    namaGroup: "KPSP Usia 21 Bulan",
    deskripsi: "Untuk anak usia 21 bulan (rentang 21 - <24 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan anak sebuah pensil dan kertas. Apakah anak dapat mencoret-coret kertas tanpa bantuan atau petunjuk?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Minta anak untuk menyusun kubus. Apakah anak dapat menyusun 2 kubus?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Bayi dipangku orang tua atau pengasuh. Tunjukkan gambar di bawah pada anak dan minta ia untuk menunjuk gambar sesuai dengan yang Anda sebutkan namanya. Apakah anak dapat menunjuk minimal 1 gambar?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Bayi dipangku orang tua atau pengasuh. Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menunjuk paling sedikit 1 bagian tubuhnya dengan benar (rambut, mata, hidung, mulut, atau bagian badan yang lain)?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengucapkan minimal 7 kata yang mempunyai arti (selain kata ‘mama’ dan ‘papa’)?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat minum dari cangkir atau gelas sendiri tanpa banyak yang tumpah?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak suka meniru bila ibu atau pengasuh sedang melakukan pekerjaan rumah tangga (merapikan mainan, menyapu, dll)?",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat berlari tanpa terjatuh?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan kubus di lantai, tanpa berpegangan atau menyentuh lantai, apakah anak dapat membungkuk untuk memungut kubus di lantai dan kemudian berdiri kembali?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Dapatkah anak berjalan mundur minimal 5 langkah tanpa kehilangan keseimbangan?",
      },
    ],
  },
  24: {
    usiaBulan: 24,
    namaGroup: "KPSP Usia 24 Bulan",
    deskripsi: "Untuk anak usia 24 bulan (rentang 24 - <30 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Berikan anak sebuah pensil dan kertas. Apakah anak dapat mencoret-coret kertas tanpa bantuan atau petunjuk?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Bayi dipangku orang tua atau pengasuh. Minta anak untuk menyusun kubus. Apakah anak dapat menyusun 4 kubus?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Bayi dipangku orang tua atau pengasuh. Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menunjuk paling sedikit 2 bagian tubuhnya dengan benar (rambut, mata, hidung, mulut, atau bagian badan yang lain)?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak mampu menggabungkan 2 kata berbeda ketika berbicara, misalnya “Minum susu” atau “Main bola”? “Terima kasih” dan “Da-dah” tidak termasuk.",
      },
      {
        no: 5,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat melepas pakaiannya seperti baju, rok, atau celana?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat makan dengan menggunakan sendok sendiri tanpa banyak yang tumpah?",
      },
      {
        no: 7,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat berlari tanpa terjatuh?",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat berjalan naik tangga sendiri? Jawab ‘Ya’ jika ia naik tangga dengan posisi tegak atau berpegangan pada dinding atau pegangan tangga. Jawab ‘Tidak’ jika ia naik tangga dengan merangkak, orang tua tidak memperbolehkan anak naik tangga, atau anak harus berpegangan pada seseorang.",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan bola tenis di depan kaki anak. Apakah ia dapat menendang ke depan tanpa berpegangan pada apapun?",
      },
      {
        no: 10,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Ikuti perintah dengan seksama. Jangan memberi isyarat dengan telunjuk atau mata pada saat memberikan perintah berikut ini:\n“Ambil kertas”\n“Ambil pensil”\n“Tutup pintu”\nDapatkah anak melakukan perintah tersebut?",
      },
    ],
  },
  30: {
    usiaBulan: 30,
    namaGroup: "KPSP Usia 30 Bulan",
    deskripsi: "Untuk anak usia 30 bulan (rentang 30 - <36 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Beri kubus di depan anak. Dapatkah anak menyusun 4 buah kubus menyerupai kereta api dengan cerobong asap (dicontohkan)?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Buat garis lurus ke bawah sepanjang sekurang-kurangnya 2,5 cm. Minta anak untuk menggambar garis lain di samping garis ini. Jawab ‘Ya’ bila ia menggambar garis seperti ini: Jawab ‘Tidak’ bila ia menggambar garis seperti ini:",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menyebut 2 gambar di antara gambar-gambar di bawah dengan benar? Menyebut dengan suara binatang tidak ikut dinilai.",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menunjuk 4 gambar di antara gambar-gambar di atas ini dengan benar ketika Anda sebutkan namanya?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menunjuk paling sedikit 6 bagian tubuhnya?",
      },
      {
        no: 6,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat memahami perintah yang terdiri dari 2 langkah, misalnya “Tolong ambil bola dan berikan kepada Ayah”?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak berpakaian sendiri seperti baju, rok, celana (topi dan kaos kaki tidak ikut dinilai)?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak bermain peran, misalnya menyuapi boneka?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan bola tenis di depan kaki anak. Dapatkah anak menendang ke depan tanpa berpegangan pada apapun? Mendorong bola tidak ikut dinilai.",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk melompat atau mengangkat kedua kakinya pada saat bersamaan. Dapatkah ia melakukannya?",
      },
    ],
  },
  36: {
    usiaBulan: 36,
    namaGroup: "KPSP Usia 36 Bulan",
    deskripsi: "Untuk anak usia 36 bulan (rentang 36 - <42 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Beri kubus di depan anak. Dapatkah anak menyusun 6 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus tersebut?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Buat garis lurus ke bawah sepanjang sekurang-kurangnya 2,5 cm. Minta anak untuk menggambar garis lain di samping garis ini. Jawab ‘Ya’ bila ia menggambar garis seperti ini: Jawab ‘Tidak’ bila ia menggambar garis seperti ini:",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menyebut 4 gambar di antara gambar-gambar di bawah ini dengan benar? Menyebut dengan suara binatang tidak ikut dinilai.",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat memahami perintah yang terdiri dari 2 langkah, misalnya “Tolong ambil bola dan berikan kepada Ayah”?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah sebagian dari bicara anak dapat dipahami oleh orang asing (yang tidak bertemu setiap hari)?",
      },
      {
        no: 6,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak merangkai kalimat sederhana yang terdiri dari minimal 3 kata, misalnya “Aku makan roti” atau ”Ibu minta susu”?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak menggosok gigi dengan bantuan?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak mengenakan baju, celana, atau sepatu sendiri (tidak termasuk mengancing dan menali)?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Berikan kepada anak sebuah bola tenis. Minta ia untuk melemparkan ke arah dada Anda. Dapatkah anak melempar bola dengan lurus ke arah perut atau dada Anda dari jarak 1,5 meter?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan selembar kertas seukuran buku ini di atas lantai. Apakah anak dapat melompati bagian lebar kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?",
      },
    ],
  },
  42: {
    usiaBulan: 42,
    namaGroup: "KPSP Usia 42 Bulan",
    deskripsi: "Untuk anak usia 42 bulan (rentang 42 - <48 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Buat garis lurus ke bawah sepanjang sekurang-kurangnya 2,5 cm. Minta anak untuk menggambar garis lain di samping garis ini. Jawab ‘Ya’ bila ia menggambar garis seperti ini: Jawab ‘Tidak’ bila ia menggambar garis seperti ini:",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Beri kubus di depan anak. Dapatkah anak menyusun 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkannya?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tunjukkan anak gambar di bawah ini dan tanyakan:\n“Mana yang dapat terbang?”\n“Mana yang dapat mengeong?”\n“Mana yang dapat bicara?”\n“Mana yang dapat menggonggong?”\n“Mana yang dapat meringkik?”\nApakah anak dapat menunjuk 2 kegiatan yang sesuai?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada anak pertanyaan berikut ini satu persatu:\n“Apa yang kamu lakukan bila kedinginan?” Jawaban: pakai jaket, pakai selimut\n“Apa yang kamu lakukan bila kamu kelelahan?” Jawaban: tidur, berbaring, istirahat\n“Apa yang kamu lakukan bila kamu merasa lapar?” Jawaban: makan\n“Apa yang kamu lakukan bila kamu merasa haus?” Jawaban: minum\nApakah anak dapat menjawab 3 pertanyaan dengan benar tanpa gerakan dan isyarat?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Minta anak untuk menyebut 1 warna. Dapatkah anak menyebut 1 warna dengan benar?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mencuci tangannya sendiri dengan baik setelah makan?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak menyebut nama teman bermain di luar rumah atau saudara yang tidak tinggal serumah?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak mengenakan kaos (T-shirt) tanpa dibantu?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan selembar kertas seukuran buku ini di atas lantai. Apakah anak dapat melompati bagian lebar kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 1 detik atau lebih?",
      },
    ],
  },
  48: {
    usiaBulan: 48,
    namaGroup: "KPSP Usia 48 Bulan",
    deskripsi: "Untuk anak usia 48 bulan (rentang 48 - <54 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Berikan contoh membuat jembatan dari 3 buah kubus, yaitu dengan meletakkan 2 kubus dengan sedikit jarak (kira kira satu jari), lalu letakkan balok ketiga di atas kedua balok sehingga terbentuk seperti jembatan. Minta anak untuk melakukan. Dapatkan anak melakukannya?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Beri pensil dan kertas. Jangan membantu anak dan jangan menyebut lingkaran. Buatlah lingkaran di atas kertas tersebut. Minta anak menirunya. Dapatkah anak menggambar lingkaran?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tunjukkan anak gambar di bawah ini dan tanyakan:\n“Yang mana yang dapat terbang?”\n“Yang mana yang dapat mengeong?”\n“Yang mana yang dapat bicara?”\n“Yang mana yang dapat menggonggong?”\n“Yang mana yang dapat meringkik?”\nApakah anak dapat menunjuk 2 kegiatan yang sesuai?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Dapatkah anak menyebut nama lengkapnya tanpa dibantu? Jawab ‘Tidak’ jika ia menyebut sebagian namanya atau ucapannya sulit dimengerti.",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengenal konsep angka satu\nLetakkan 5 kubus di atas meja dan selembar kertas di samping kubus. Katakan kepada anak “Ambil 1 kubus dan letakkan di atas kertas”. Setelah anak selesai meletakkan, tanyakan “Ada berapa banyak kubus di atas kertas?” Dapatkah anak melakukan dengan hanya mengambil satu kubus dan bisa menyebutkan “Satu”?",
      },
      {
        no: 6,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada anak pertanyaan di bawah satu persatu:\n“Apa kegunaan kursi?” Jawaban: untuk duduk\n“Apa kegunaan cangkir?” Jawaban: untuk minum\n“Apa kegunaan pensil?” Jawaban: untuk mencoret, menulis, menggambar\nDapatkah anak menjawab ketiga pertanyaan terkait kegunaan benda tersebut dengan benar?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak mengikuti peraturan permainan saat bermain dengan teman-temannya (misal: ular tangga, petak umpet, dll)?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak mengenakan kaos (T-shirt) tanpa dibantu?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Letakkan selembar kertas seukuran buku ini di atas lantai. Apakah anak dapat melompati bagian lebar kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?",
      },
    ],
  },
  54: {
    usiaBulan: 54,
    namaGroup: "KPSP Usia 54 Bulan",
    deskripsi: "Untuk anak usia 54 bulan (rentang 54 - <60 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Jangan mengoreksi atau membantu anak. Jangan menyebut kata “Lebih panjang”. Perlihatkan gambar kedua garis ini pada anak. Tanyakan: “Mana garis yang lebih panjang?” Minta anak menunjuk garis yang lebih panjang. Setelah anak menunjuk, putar lembar ini dan ulangi pertanyaan tersebut. Apakah anak dapat menunjuk garis yang lebih panjang sebanyak 3 kali dengan benar?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Jangan membantu anak dan jangan memberitahu nama gambar ini. Minta anak untuk menggambar seperti contoh di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar + seperti contoh di bawah?",
      },
      {
        no: 3,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Berikan anak pensil dan kertas lalu katakan kepada anak “Buatlah gambar orang” (anak laki-laki, anak perempuan, papa, mama, dll). Jangan memberi perintah lebih dari itu. Jangan bertanya atau mengingatkan anak bila ada bagian yang belum tergambar. Dalam memberi nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang berpasangan seperti mata, telinga, lengan, dan kaki, setiap pasang dinilai 1 bagian. Pastikan anak telah menyelesaikan gambar sebelum memberikan penilaian. Dapatkah anak menggambar orang dengan sedikitnya 3 bagian tubuh?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Memahami konsep 2 warna\nMinta anak untuk menyebutkan 2 warna. Dapatkah anak menyebut 2 warna dengan benar?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah bicara anak mampu dipahami seluruhnya oleh orang lain (yang tidak bertemu setiap hari)?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak mengikuti peraturan permainan saat bermain dengan teman temannya (misal: ular tangga, petak umpet, dll)?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak menggosok gigi tanpa dibantu?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengancingkan bajunya atau pakaian boneka?",
      },
      {
        no: 9,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengenal konsep 2 kata depan\nMinta anak untuk mengikuti perintah di bawah, jangan memberi isyarat:\n“Ambil benda (misalnya kertas, balok) dan letakkan di atas meja”\n“Ambil benda (misalnya kertas, balok) dan letakkan di bawah meja”\n“Ambil benda (misalnya kertas, balok) dan letakkan di depan ibu”\n“Ambil benda (misalnya kertas, balok) dan letakkan di samping ibu”\n“Ambil benda (misalnya kertas, balok) dan letakkan di belakang ibu”\nDapatkah anak melakukan sedikitnya 2 perintah (memahami 2 kata depan)?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?",
      },
    ],
  },
  60: {
    usiaBulan: 60,
    namaGroup: "KPSP Usia 60 Bulan",
    deskripsi: "Untuk anak usia 60 bulan (rentang 60 - <66 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Perlihatkan gambar kedua garis ini pada anak. Tanyakan: “Mana garis yang lebih panjang?” Minta anak menunjuk garis yang lebih panjang. Setelah anak menunjuk, putar lembar ini dan ulangi pertanyaan tersebut. Apakah anak dapat menunjuk garis yang lebih panjang sebanyak 3 kali dengan benar?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Berikan anak pensil dan kertas lalu katakan kepada anak “Buatlah gambar orang” (anak laki-laki, anak perempuan, papa, mama, dll). Jangan memberi perintah lebih dari itu. Jangan bertanya atau mengingatkan anak bila ada bagian yang belum tergambar. Dalam memberi nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang berpasangan seperti mata, telinga, lengan dan kaki, setiap pasang dinilai 1 bagian. Pastikan anak telah menyelesaikan gambar sebelum memberikan penilaian. Dapatkah anak menggambar orang dengan sedikitnya 3 bagian tubuh?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Memahami konsep 4 warna\nMinta anak untuk menyebutkan 4 warna. Dapatkah anak menyebut keempat warna tersebut dengan benar?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Tanyakan kepada anak pertanyaan berikut ini satu persatu:\n“Apa yang kamu lakukan saat kedinginan?” Jawaban: pakai jaket, pakai selimut\n“Apa yang kamu lakukan saat kelelahan?” Jawaban: tidur, berbaring, istirahat\n“Apa yang kamu lakukan saat merasa lapar?” Jawaban: makan\n“Apa yang kamu lakukan saat merasa haus?” Jawaban: minum\nDapatkah anak menjawab 3 pertanyaan terkait kata sifat tersebut dengan benar?",
      },
      {
        no: 5,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat mengancingkan bajunya atau pakaian boneka?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak bereaksi dengan tenang dan tidak rewel (tanpa menangis atau menggelayut) pada saat ditinggal oleh orang tua atau pengasuh?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak sepenuhnya berpakaian sendiri tanpa dibantu?",
      },
      {
        no: 8,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengenal konsep 4 kata depan\nMinta anak untuk mengikuti perintah di bawah, jangan memberi isyarat:\n“Ambil benda (misalnya kertas, balok) dan letakkan di atas meja”\n“Ambil benda (misalnya kertas, balok) dan letakkan di bawah meja”\n“Ambil benda (misalnya kertas, balok) dan letakkan di depan ibu”\n“Ambil benda (misalnya kertas, balok) dan letakkan di samping ibu”\n“Ambil benda (misalnya kertas, balok) dan letakkan di belakang ibu”\nDapatkah anak melakukan sedikitnya 4 perintah (memahami 4 kata depan)?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 4 detik atau lebih?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk melompat dengan 1 kaki beberapa kali tanpa berpegangan (lompatan dengan 2 kaki tidak ikut dinilai). Dapatkah anak melompat 2-3 kali dengan 1 kaki?",
      },
    ],
  },
  66: {
    usiaBulan: 66,
    namaGroup: "KPSP Usia 66 Bulan",
    deskripsi: "Untuk anak usia 66 bulan (rentang 66 - <72 bulan). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Menggambar +\nJangan membantu anak dan jangan memberitahu nama gambar ini. Minta anak untuk menggambar seperti contoh di kertas kosong yang tersedia. Berikan 3 kali kesempatan. Apakah anak dapat menggambar + seperti contoh di bawah?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Menggambar kotak dengan dicontohkan\nBerikan kepada anak pensil dan kertas. Tunjukkan kepada anak contoh gambar di bawah. Anda bisa mencontohkan cara membuat kotak. Dapatkah anak menggambar kotak seperti contoh di bawah?",
      },
      {
        no: 3,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Menggambar orang dengan sedikitnya 6 bagian tubuh\nBerikan anak pensil dan kertas lalu katakan kepada anak “Buatlah gambar orang” (anak laki-laki, anak perempuan, papa, mama, dll). Jangan memberi perintah lebih dari itu. Jangan bertanya atau mengingatkan anak bila ada bagian yang belum tergambar. Dalam memberi nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang berpasangan seperti mata, telinga, lengan dan kaki, setiap pasang dinilai 1 bagian. Pastikan anak telah menyelesaikan gambar sebelum memberikan penilaian. Dapatkah anak menggambar orang dengan sedikitnya 6 bagian tubuh?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengetahui konsep angka 5\nLetakkan 8 kubus di atas meja dan selembar kertas di samping kubus. Katakan kepada anak “Ambil 5 kubus dan letakkan di atas kertas”. Setelah anak selesai meletakkan, tanyakan “Ada berapa banyak kubus di atas kertas?” Dapatkah anak melakukannya?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Memahami/mengartikan 5 kata\nPastikan anak mendengar pemeriksa lalu katakan “Saya akan mengucapkan 1 kata dan saya ingin kamu menyebutkan apa arti kata itu”. Setiap kata dapat diberikan sebanyak 3 kali bila perlu. Pemeriksa dapat mengatakan “Beritahu saya sesuatu tentang itu” tetapi jangan tanya apa kegunaannya. Tanyalah setiap kata dalam satu waktu.\n“Apakah bola itu?”\n“Apakah sungai itu?”\n“Apakah meja itu?”\n“Apakah mobil/motor itu?”\n“Apakah rumah itu?”\n“Apakah pisang itu?”\n“Apakah pintu itu?”\n“Apakah atap itu?”\nAnak dikatakan dapat mengartikan jika anak mengartikan yang sesuai dalam istilah: 1) kegunaan, 2) bentuk, 3) terbuat dari apa, 4) kategori umum. Dapatkah anak mengartikan 5 kata yang sesuai?",
      },
      {
        no: 6,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengetahui konsep analogi berlawanan\nMinta anak untuk melengkapi kalimat di bawah ini, jangan membantu kecuali mengulang pertanyaan:\n“Jika kuda besar, maka tikus...?” Jawaban: kecil\n“Jika api panas, maka es...?” Jawaban: dingin\n“Jika ibu seorang wanita, maka ayah seorang...” Jawaban: pria, laki-laki\nApakah anak menjawab ketiga pertanyaan dengan benar?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak bereaksi dengan tenang dan tidak rewel (tanpa menangis atau menggelayut) pada saat ditinggal oleh orang tua atau pengasuh?",
      },
      {
        no: 8,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, dapatkah anak sepenuhnya berpakaian sendiri tanpa dibantu?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 6 detik atau lebih?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Apakah anak dapat menangkap bola kecil sebesar bola tenis atau bola kasti hanya dengan menggunakan kedua tangannya?",
      },
    ],
  },
  72: {
    usiaBulan: 72,
    namaGroup: "KPSP Usia 72 Bulan",
    deskripsi: "Untuk anak usia 72 bulan (usia 6 tahun). Kuesioner resmi Pedoman SDIDTK Kemenkes RI 2022 terdiri dari 10 pertanyaan tervalidasi.",
    pertanyaan: [
      {
        no: 1,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Menggambar kotak tanpa dicontohkan\nBerikan kepada anak pensil dan kertas. Tunjukkan kepada anak contoh gambar di bawah. Tanpa menyebutkan nama dan tanpa mencontohkan atau menggerakkan jari telunjuk atau pensil untuk menunjukkan bagaimana cara menggambarnya, katakan kepada anak “Gambarlah yang seperti gambar ini”. Lihat contoh di bawah untuk menilai gambar anak. Dapatkah anak menggambar kotak seperti contoh di bawah?",
      },
      {
        no: 2,
        sektor: "halus",
        sektorLabel: "Motorik Halus",
        teks: "Menggambar orang dengan sedikitnya 6 bagian tubuh\nBerikan anak pensil dan kertas lalu katakan kepada anak “Buatlah gambar orang” (anak laki-laki, anak perempuan, papa, mama, dll). Jangan memberi perintah lebih dari itu. Jangan bertanya atau mengingatkan anak bila ada bagian yang belum tergambar. Dalam memberi nilai, hitunglah berapa bagian tubuh yang tergambar. Untuk bagian tubuh yang berpasangan seperti mata, telinga, lengan dan kaki, setiap pasang dinilai 1 bagian. Pastikan anak telah menyelesaikan gambar sebelum memberikan penilaian. Dapatkah anak menggambar orang dengan sedikitnya 6 bagian tubuh?",
      },
      {
        no: 3,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengetahui konsep analogi berlawanan\nMinta anak untuk melengkapi kalimat di bawah ini, jangan membantu kecuali mengulang pertanyaan:\n“Jika kuda besar, maka tikus...?” Jawaban: kecil\n“Jika api panas, maka es...?” Jawaban: dingin\n“Jika ibu seorang wanita, maka ayah seorang...” Jawaban: pria, laki-laki\n“Jika pagi ada matahari, malam ada...” Jawaban: bulan\nApakah anak menjawab ketiga pertanyaan dengan benar?",
      },
      {
        no: 4,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Memahami/mengartikan 7 kata\nPastikan anak mendengar pemeriksa lalu katakan “Saya akan mengucapkan 1 kata dan saya ingin kamu menyebutkan apa arti kata itu”. Setiap kata dapat diberikan sebanyak 3 kali bila perlu. Pemeriksa dapat mengatakan “Beritahu saya sesuatu tentang itu” tetapi jangan tanya apa kegunaannya. Tanyalah setiap kata dalam satu waktu.\n“Apakah bola itu?”\n“Apakah sungai itu?”\n“Apakah meja itu?”\n“Apakah mobil/motor itu?”\n“Apakah rumah itu?”\n“Apakah pisang itu?”\n“Apakah pintu itu?”\n“Apakah atap itu?”\nAnak dikatakan dapat mengartikan jika anak mengartikan yang sesuai dalam istilah: 1) kegunaan, 2) bentuk, 3) terbuat dari apa, 4) kategori umum. Dapatkah anak mengartikan 7 kata yang sesuai?",
      },
      {
        no: 5,
        sektor: "bicara",
        sektorLabel: "Bicara & Bahasa",
        teks: "Mengetahui komposisi benda\nIsi titik−titik di bawah ini dengan jawaban anak. Jangan membantu kecuali mengulangi pertanyaan sampai 3 kali bila anak menanyakannya.\n\"Sendok dibuat dari apa?\" Jawaban: besi, baja, plastik, kayu\n\"Sepatu dibuat dari apa?\" Jawaban: kulit, karet, kain, plastik, kayu\n\"Pintu dibuat dari apa?\" Jawaban: kayu, besi, kaca\nApakah anak dapat menjawab ketiga pertanyaan diatas dengan benar?",
      },
      {
        no: 6,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat menggosok giginya tanpa bantuan?",
      },
      {
        no: 7,
        sektor: "sosialisasi",
        sektorLabel: "Sosialisasi & Kemandirian",
        teks: "Tanyakan kepada orang tua atau pengasuh, apakah anak dapat menyiapkan dan mengambil makanan tanpa bantuan, termasuk menggunakan mangkok, sendok, menuangkan makanan dan susu ke mangkok tanpa banyak tumpah? Jawab ‘Ya’ jika anak dapat melakukannya, termasuk menuangkan susu dari beberapa jenis kotak atau wadah makanan.",
      },
      {
        no: 8,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Apakah anak dapat menangkap bola kecil sebesar bola tenis atau bola kasti hanya dengan menggunakan kedua tangannya?",
      },
      {
        no: 9,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Tunjukkan kepada anak bagaimana cara berjalan di garis lurus dengan menempatkan tumit dari 1 kaki di depan jari kaki lain. Berjalanlah 8 langkah, lalu minta anak untuk melakukannya. Berikan contoh dan kesempatan sebanyak 3 kali bila perlu. Dapatkah anak melakukannya sebanyak 4 langkah atau lebih dengan meletakkan tumit tidak lebih dari 2,5 cm dari jari kaki lain tanpa berpegangan?",
      },
      {
        no: 10,
        sektor: "kasar",
        sektorLabel: "Motorik Kasar",
        teks: "Minta anak untuk berdiri 1 kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak kesempatan sebanyak 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 11 detik atau lebih?",
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
      saran: "Perkembangan anak sesuai dengan usianya (9–10 'YA'). Beri pujian pada ibu/pengasuh. Teruskan pola asuh dan berikan stimulasi tumbuh kembang sesuai kelompok umur. Lakukan jadwal skrining KPSP berikutnya sesuai kelompok umur.",
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
    label: "Kemungkinan Ada Penyimpangan (P)",
    saran: "Perkembangan anak kemungkinan ada penyimpangan (6 atau kurang 'YA'). Segera lakukan rujukan ke Fasilitas Pelayanan Kesehatan / Dokter Spesialis Anak / Klinik Tumbuh Kembang untuk pemeriksaan diagnostik lebih lanjut.",
  };
}

export function sektorTerabaikan(
  daftarSoal: KpspQuestion[],
  jawaban: Record<number, KpspJawaban>
): KpspQuestion[] {
  return daftarSoal.filter((q) => jawaban[q.no] === "tidak");
}
