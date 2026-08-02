import type {
  Baris,
  Derajat,
  Gangguan,
  GangguanId,
  HasilLaju,
  JawabanAlur,
  NadaBaris,
  Rencana,
  Sumber,
} from "../model/elektrolit";
import { SUMBER } from "../model/elektrolit";
import { bandFromMonths, fmt, labByKey } from "./reference";

export const KATALOG_ELEKTROLIT: readonly Gangguan[] = [
  { id: "hipoNa", label: "Hiponatremia", parameter: "Natrium", satuan: "mmol/L", contoh: "mis. 118" },
  { id: "hiperNa", label: "Hipernatremia", parameter: "Natrium", satuan: "mmol/L", contoh: "mis. 158" },
  { id: "hipoK", label: "Hipokalemia", parameter: "Kalium", satuan: "mmol/L", contoh: "mis. 2.8" },
  { id: "hiperK", label: "Hiperkalemia", parameter: "Kalium", satuan: "mmol/L", contoh: "mis. 6.8" },
  { id: "hipoCa", label: "Hipokalsemia", parameter: "Kalsium total", satuan: "mg/dL", contoh: "mis. 7.2" },
  { id: "hipoMg", label: "Hipomagnesemia", parameter: "Magnesium", satuan: "mg/dL", contoh: "mis. 1.2" },
  { id: "hipoPO4", label: "Hipofosfatemia", parameter: "Fosfat", satuan: "mg/dL", contoh: "mis. 1.8" },
];

export function gangguanById(id: GangguanId | null): Gangguan | null {
  if (id == null) return null;
  return KATALOG_ELEKTROLIT.find((g) => g.id === id) ?? null;
}

export function perluStatusCairan(id: GangguanId): boolean {
  return id === "hipoNa" || id === "hiperNa";
}
export function perluJalurOral(id: GangguanId): boolean {
  return id === "hipoK";
}
export function perluAlbumin(id: GangguanId): boolean {
  return id === "hipoCa";
}
export function perluDigoksin(id: GangguanId): boolean {
  return id === "hiperK";
}
export function perluPelacakLaju(id: GangguanId): boolean {
  return id === "hipoNa" || id === "hiperNa";
}

/** NaCl 3% mengandung 513 mmol natrium per liter = 0,513 mmol/mL. */
export const MMOL_PER_ML_NACL3 = 0.513;

/** Kadar natrium tiap cairan (mmol/L), untuk memilih cairan pengganti. */
export const NA_CAIRAN: ReadonlyArray<{ nama: string; na: number }> = [
  { nama: "NaCl 5%", na: 855 },
  { nama: "NaCl 3%", na: 513 },
  { nama: "NaCl 0,9%", na: 154 },
  { nama: "Ringer laktat", na: 130 },
  { nama: "NaCl 0,45%", na: 77 },
  { nama: "NaCl 0,2%", na: 34 },
  { nama: "Dekstrosa 5%", na: 0 },
];

export function mlNaCl3(mmol: number): number {
  return mmol / MMOL_PER_ML_NACL3;
}

/** Koreksi kalsium terhadap albumin: Ca + 0,8 x (4 - albumin). */
export function kalsiumTerkoreksi(ca: number, alb: number | null): number {
  if (alb == null || !isFinite(alb)) return ca;
  return ca + 0.8 * (4 - alb);
}

function b(nada: NadaBaris, judul: string, isi: string, ...sumber: Sumber[]): Baris {
  return { nada, judul, isi, sumber };
}

function d(
  label: string,
  nada: NadaBaris,
  rentang: string,
  catatan: string | null,
  ...sumber: Sumber[]
): Derajat {
  return { label, nada, rentang, catatan, sumber };
}

// ---------------------------------------------------------------------------
// Penggolongan derajat
// ---------------------------------------------------------------------------

export function derajatElektrolit(
  id: GangguanId,
  nilai: number | null,
  usiaBulan: number | null,
): Derajat | null {
  if (nilai == null || !isFinite(nilai)) return null;

  if (id === "hipoNa") {
    if (nilai >= 135)
      return d("Natrium dalam rentang normal", "info", "135-145 mmol/L", "Rentang normal natrium pada anak adalah 135-145 mmol/L. Periksa ulang alasan pemeriksaan.", SUMBER.rchHipoNa);
    if (nilai >= 125)
      return d("Hiponatremia ringan", "info", "125-135 mmol/L", "Sebagian besar anak tidak bergejala.", SUMBER.rchHipoNa);
    if (nilai >= 120)
      return d("Hiponatremia sedang", "bahaya", "120-125 mmol/L", "Dapat muncul gejala tidak khas seperti mual dan malaise.", SUMBER.rchHipoNa);
    return d("Hiponatremia berat", "blokir", "< 120 mmol/L", "Dapat timbul nyeri kepala, penurunan kesadaran, dan kejang.", SUMBER.rchHipoNa);
  }

  if (id === "hiperNa") {
    if (nilai <= 145)
      return d("Natrium dalam rentang normal", "info", "135-145 mmol/L", null, SUMBER.rchHipoNa);
    if (nilai <= 149)
      return d("Hipernatremia ringan", "info", "146-149 mmol/L", null, SUMBER.rchHiperNa);
    if (nilai <= 169)
      return d("Hipernatremia sedang", "bahaya", "150-169 mmol/L", "Wajib disertai pemeriksaan osmolalitas serum dan urine berpasangan, tanpa menunda terapi.", SUMBER.rchHiperNa);
    return d("Hipernatremia berat", "blokir", ">= 170 mmol/L", "Wajib disertai osmolalitas serum dan urine berpasangan, tanpa menunda terapi.", SUMBER.rchHiperNa);
  }

  if (id === "hipoK") {
    if (nilai >= 3.5)
      return d("Kalium dalam rentang normal", "info", "3,5-5,1 mmol/L", null, SUMBER.pier);
    if (nilai >= 3.0)
      return d("Hipokalemia ringan", "info", "3,0-3,5 mmol/L", null, SUMBER.pier);
    if (nilai >= 2.5)
      return d("Hipokalemia sedang", "bahaya", "2,5-3,0 mmol/L", null, SUMBER.pier);
    return d("Hipokalemia berat", "blokir", "< 2,5 mmol/L", "Perhatikan gelombang T mendatar dan gelombang U pada EKG.", SUMBER.pier);
  }

  if (id === "hiperK") {
    const bayi = usiaBulan != null && usiaBulan < 12;
    const catatanBayi = bayi
      ? "Pada bayi dan bayi prematur, batas atas nilai normal dapat mencapai 6,5 mmol/L, sehingga angka ini perlu dinilai bersama kondisi klinis."
      : null;
    if (nilai < 5.5)
      return d("Kalium dalam rentang normal", "info", "< 5,5 mmol/L", catatanBayi, SUMBER.medscapeHiperKDerajat);
    if (nilai <= 6.0)
      return d("Hiperkalemia ringan", "info", "5,5-6,0 mmol/L", catatanBayi, SUMBER.medscapeHiperKDerajat);
    if (nilai <= 7.0)
      return d("Hiperkalemia sedang", "bahaya", "6,1-7,0 mmol/L", catatanBayi, SUMBER.medscapeHiperKDerajat);
    if (nilai <= 8.5)
      return d("Hiperkalemia berat", "blokir", ">= 7,0 mmol/L", "Kadar di atas 7 mmol/L membawa konsekuensi hemodinamik dan neurologis.", SUMBER.medscapeHiperKDerajat);
    return d("Hiperkalemia mengancam nyawa", "blokir", "> 8,5 mmol/L", "Kadar di atas 8,5 mmol/L dapat menimbulkan paralisis otot napas atau henti jantung.", SUMBER.medscapeHiperKDerajat);
  }

  if (id === "hipoCa") {
    const band = bandFromMonths(usiaBulan);
    const t = labByKey("ca");
    if (band == null || t == null)
      return d("Isi usia pasien untuk menilai terhadap rujukan", "info", "-", "Rentang kalsium berbeda menurut kelompok usia.", SUMBER.fdaCa);
    const r = t.r[band];
    if (nilai < r[0])
      return d("Kalsium di bawah rujukan usia", "bahaya", fmt(r[0], 2) + " - " + fmt(r[1], 2) + " mg/dL", "Nilai yang dinilai adalah kalsium terkoreksi albumin.", SUMBER.fdaCa);
    if (nilai > r[1])
      return d("Kalsium di atas rujukan usia", "info", fmt(r[0], 2) + " - " + fmt(r[1], 2) + " mg/dL", "Alur ini disusun untuk hipokalsemia.", SUMBER.fdaCa);
    return d("Kalsium dalam rentang rujukan usia", "info", fmt(r[0], 2) + " - " + fmt(r[1], 2) + " mg/dL", null, SUMBER.fdaCa);
  }

  if (id === "hipoMg") {
    if (nilai < 1.0)
      return d("Magnesium sangat rendah", "blokir", "pertahankan > 1,0 mg/dL (0,4 mmol/L)", "Sasaran terapi adalah mempertahankan magnesium plasma di atas 1,0 mg/dL (0,4 mmol/L).", SUMBER.medscapeMg);
    return d("Nilai magnesium", "info", "bandingkan dengan rentang rujukan laboratorium Anda", "Alur ini tidak menggolongkan derajat hipomagnesemia karena rentang rujukan berbeda antar laboratorium. Sasaran terapi yang dipakai adalah mempertahankan magnesium plasma di atas 1,0 mg/dL (0,4 mmol/L).", SUMBER.medscapeMg);
  }

  return d("Nilai fosfat", "info", "bandingkan dengan rentang rujukan laboratorium Anda", "Alur ini tidak menggolongkan derajat hipofosfatemia karena rentang rujukan berbeda antar laboratorium dan antar usia.", SUMBER.rchPO4);
}

// ---------------------------------------------------------------------------
// Rencana per gangguan
// ---------------------------------------------------------------------------

function tambahStatusCairan(langkah: Baris[], j: JawabanAlur): void {
  if (j.statusCairan === "hipovolemik")
    langkah.push(
      b(
        "aksi",
        "Hipovolemik: berikan cairan isotonik",
        "Cairan isotonik adalah cairan dengan kadar natrium serupa plasma (natrium 125-160 mmol/L), yaitu NaCl 0,9%, Plasma-Lyte 148, atau Hartmann. Obati penyebab kehilangan cairannya.",
        SUMBER.rchHipoNa,
      ),
    );
  else if (j.statusCairan === "euvolemik") {
    langkah.push(
      b(
        "aksi",
        "Euvolemik: pikirkan SIADH dan batasi cairan",
        "Pada anak euvolemik, penyebab tersering adalah kelebihan asupan air atau gangguan ekskresi air bebas. Pembatasan cairan menjadi tumpuan terapi sambil penyebabnya dicari dan diobati.",
        SUMBER.rchHipoNa,
      ),
    );
    /* Pagar pengaman ini sengaja ditempel langsung pada cabang euvolemik,
       bukan diletakkan di daftar pagar umum. Alasannya: kesalahan yang paling
       mungkin terjadi di cabang inilah yang harus dicegah, yaitu melabeli SIADH
       hanya karena pasien tampak euvolemik, lalu membatasi cairan pada anak
       yang justru kelebihan asupan air. Dua keadaan itu memerlukan tindakan
       berbeda dan hanya dapat dipisahkan oleh urin, bukan oleh pemeriksaan
       fisik. Karena itu angkanya muncul bersama cabangnya, tidak terpisah. */
    langkah.push(
      b(
        "bahaya",
        "Jangan menyebut SIADH tanpa bukti urin",
        "SIADH baru layak disebut bila osmolalitas urin di atas 100 mOsm/kg dan natrium urin di atas 30 mmol/L, pada anak euvolemik yang tidak sedang memakai diuretik dan fungsi tiroid serta adrenalnya normal. Ambil kedua sampel urin bersamaan dengan sampel darah, sebelum cairan diubah. Osmolalitas urin yang rendah, di bawah 100 mOsm/kg, justru mengarah ke kelebihan asupan air atau polidipsia; pada keadaan itu yang dihentikan adalah asupan airnya, bukan pembatasan cairan ala SIADH.",
        SUMBER.rchHipoNa,
      ),
    );
  } else if (j.statusCairan === "hipervolemik")
    langkah.push(
      b(
        "aksi",
        "Hipervolemik: batasi cairan dan natrium",
        "Terapi diarahkan pada pembatasan cairan serta natrium dan pada penyakit dasarnya, bukan pada pemberian natrium.",
        SUMBER.rchHipoNa,
      ),
    );
}

function rencanaHipoNa(j: JawabanAlur, bb: number, na: number): Rencana {
  const langkah: Baris[] = [];
  const gawat = j.gejalaBerat === true;

  if (gawat) {
    langkah.push(
      b(
        "bahaya",
        "Kejang hiponatremik adalah kegawatan",
        "Kejang akibat hiponatremia sering refrakter terhadap antikonvulsan. Jangan menunda koreksi natrium.",
        SUMBER.rchHipoNa,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Bila ada syok, atasi lebih dahulu",
        "Resusitasi dengan NaCl 0,9%, lalu jeda dan nilai ulang. Resusitasi cairan dapat menaikkan natrium serum karena timbul diuresis, jadi pantau keluaran urine.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "NaCl 3% " + fmt(3 * bb, 0) + " mL selama 30 menit",
        "Dosis 3 mL/kg setara 1,5 mmol/kg, yaitu " +
          fmt(1.5 * bb, 1) +
          " mmol untuk berat " +
          fmt(bb, 1) +
          " kg. Utamakan jalur sentral karena cairan ini hiperosmotik, tetapi jangan menunda pemberian bila akses sentral tidak tersedia; pemakaian jalur perifer secara hati-hati dapat diterima.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Periksa natrium segera setelah infus selesai",
        "Sasaran kenaikan pada tahap ini adalah 6 mmol/L.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Bila masih bergejala dan natrium tetap di bawah 125 mmol/L, ulangi " + fmt(3 * bb, 0) + " mL selama 30 menit",
        "Dosis kedua sama dengan dosis pertama, yaitu 3 mL/kg atau 1,5 mmol/kg.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Bila gejala tetap tidak membaik",
        "Rujuk untuk perawatan intensif anak, mulai infus kontinu NaCl 3% dengan sasaran kenaikan natrium 1 mmol/L per jam, dan pertimbangkan diagnosis lain sebagai penyebab gejala susunan saraf pusat.",
        SUMBER.chq,
      ),
    );
  } else {
    langkah.push(
      b(
        "blokir",
        "NaCl 3% tidak diindikasikan pada jalur ini",
        "Tanpa manifestasi neurologis, koreksi aktif memakai NaCl 3% tidak diperlukan dan berpotensi membahayakan.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Suplementasi enteral " + fmt(Math.min(0.5 * bb, 40), 1) + "-" + fmt(Math.min(1 * bb, 40), 1) + " mmol tiap 4-6 jam",
        "Dosis 0,5-1 mmol/kg per pemberian dengan batas 40 mmol per dosis. Campurkan dengan susu atau makanan untuk mengurangi intoleransi lambung; kadang menimbulkan diare. Dosis lebih tinggi hanya atas pertimbangan dokter senior.",
        SUMBER.chq,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Sasaran laju koreksi 6-8 mmol/L per 24 jam",
        "Pada anak yang tidak kejang, kenaikan natrium tidak boleh melampaui 8 mmol/L dalam 24 jam.",
        SUMBER.rchHipoNa,
      ),
    );
  }

  tambahStatusCairan(langkah, j);

  langkah.push(
    b(
      "info",
      "Status cairan menentukan penyebab sekaligus terapinya",
      "Penilaian status cairan adalah kunci pada hiponatremia; obati penyebab dasarnya dan catat neraca cairan secara ketat, termasuk berat badan.",
      SUMBER.rchHipoNa,
    ),
  );

  if (j.kronisitas === "akut")
    langkah.push(
      b(
        "info",
        "Hiponatremia akut berat tidak membawa risiko demielinasi yang sama",
        "Hiponatremia yang jelas berlangsung kurang dari 48 jam dapat dikoreksi dengan aman tanpa batas kenaikan yang ketat. Namun bila ada kemungkinan sekecil apa pun bahwa gangguan sudah berlangsung lebih dari 48 jam, tempuh koreksi lambat.",
        SUMBER.chq,
      ),
    );

  langkah.push(
    b(
      "info",
      "Bila disertai hiperglikemia, koreksi dahulu angka natriumnya",
      "Natrium terkoreksi = natrium terukur + 2,4 x (glukosa dalam mmol/L - 5,5) / 5,5. Glukosa yang tinggi menarik air ke sirkulasi sehingga natrium terukur menjadi lebih rendah daripada keadaan sebenarnya.",
      SUMBER.chq,
    ),
  );

  const defisit = 0.6 * bb * (125 - na);
  if (defisit > 0)
    langkah.push(
      b(
        "info",
        "Perhitungan defisit sebagai pembanding: " + fmt(defisit, 0) + " mmol untuk mencapai 125 mmol/L",
        "Rumusnya adalah 0,6 x berat badan x (natrium sasaran - natrium aktual), setara " +
          fmt(mlNaCl3(defisit), 0) +
          " mL NaCl 3% karena cairan tersebut mengandung 0,513 mmol natrium per mL. Untuk koreksi akut, sasaran yang dipakai adalah 125 mmol/L, bukan 135 mmol/L. Angka ini hanya pembanding; pemberian tetap mengikuti dosis bertahap di atas.",
        SUMBER.chq,
      ),
    );

  const pagar: Baris[] = [
    b("blokir", "Kenaikan tidak melampaui 8 mmol/L dalam 24 jam pada anak yang tidak kejang", "Ini adalah batas keselamatan utama pada hiponatremia anak.", SUMBER.rchHipoNa),
    b("bahaya", "Batas mutlak: 10 mmol/L pada 24 jam pertama dan 18 mmol/L pada 48 jam pertama", "Koreksi natrium yang terlalu cepat berkaitan dengan sindrom demielinasi osmotik dan kematian.", SUMBER.chq),
    b("bahaya", "Batas menurut usia: neonatus 10 mmol/L per hari, bayi hingga remaja 12 mmol/L per hari", "Sindrom demielinasi osmotik ditentukan oleh kecepatan dan besarnya koreksi.", SUMBER.bcehs),
    b(
      "bahaya",
      "Faktor risiko demielinasi serebral",
      "Hiponatremia kronis berat dengan natrium di bawah 115 mmol/L, timbulnya hipernatremia selama koreksi, kenaikan natrium melebihi 25 mmol/L dalam 48 jam, hipoksemia, penyakit hati berat, pemakaian diuretik tiazid, luka bakar berat, malnutrisi, hipokalemia, dan gagal ginjal.",
      SUMBER.chq,
    ),
    b(
      "info",
      "Bila laju terlanjur terlampaui",
      "Penurunan kembali kadar natrium pada pasien berisiko demielinasi hanya boleh dilakukan atas arahan tim spesialis.",
      SUMBER.chq,
      SUMBER.nejm,
    ),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Periksa natrium tiap jam selama infus NaCl 3% berjalan", "Pemeriksaan tiap jam diteruskan sampai natrium mencapai 130 mmol/L. Setelah 130 mmol/L tercapai, pemantauan dapat dikurangi menjadi tiap empat jam.", SUMBER.chq),
    b("aksi", "Hentikan infus NaCl 3% bila salah satu tercapai", "Gejala membaik, kenaikan natrium total sudah 10 mmol/L, atau natrium sudah mencapai 130 mmol/L.", SUMBER.chq),
    b("aksi", "Pasang jalur vena berdiameter besar", "Jalur besar memudahkan pengambilan darah berulang selama koreksi natrium.", SUMBER.chq),
    b("aksi", "Catat neraca cairan ketat termasuk berat badan", "Berlaku untuk semua anak dengan hiponatremia.", SUMBER.rchHipoNa),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Konsultasikan bila natrium di bawah 130 mmol/L atau anak bergejala", "Ambang ini juga menjadi ambang untuk menelusuri penyebab.", SUMBER.rchHipoNa),
    b("aksi", "Pertimbangkan rujukan ke perawatan intensif anak", "Indikasinya adalah natrium di bawah 125 mmol/L, gejala susunan saraf pusat termasuk kejang atau penurunan kesadaran, koreksi yang melampaui 8 mmol/L dalam 24 jam, atau kebutuhan perawatan di luar kemampuan fasilitas.", SUMBER.rchHipoNa),
    b("aksi", "Semua hiponatremia simptomatik dikonsultasikan ke endokrinologi anak", "Pertimbangkan sekaligus rujukan ke perawatan intensif anak.", SUMBER.chq),
  ];

  return { derajat: derajatElektrolit("hipoNa", na, j.usiaBulan), gawat, langkah, pagar, pemantauan, rujuk };
}

function rencanaHiperNa(j: JawabanAlur, bb: number, na: number): Rencana {
  const langkah: Baris[] = [];
  const neonatus = j.usiaBulan != null && j.usiaBulan < 1;
  const tbw = neonatus ? 0.7 : 0.6;
  const sasaran = Math.max(145, na - 10);
  const airBebas = ((na - sasaran) / na) * tbw * bb * 1000;

  langkah.push(
    b(
      "aksi",
      "Mulai cairan sedini mungkin dengan NaCl 0,9% dan glukosa 5%",
      "Terapi tidak perlu menunggu hasil pemeriksaan lanjutan.",
      SUMBER.rchHiperNa,
    ),
  );
  langkah.push(
    b(
      "info",
      "Perkiraan defisit air bebas " + fmt(airBebas, 0) + " mL untuk menurunkan natrium 10 mmol/L",
      "Rumusnya adalah (natrium aktual - natrium sasaran) / natrium aktual x proporsi air tubuh total x berat badan x 1000. Proporsi air tubuh total yang dipakai adalah " +
        (neonatus ? "0,7 untuk neonatus" : "0,6 untuk bayi dan anak") +
        ". Defisit ini diberikan bertahap dan ditambah kebutuhan rumatan serta kehilangan yang masih berlangsung.",
      SUMBER.fwNeo,
    ),
  );
  langkah.push(
    b(
      "aksi",
      "Koreksi dehidrasi selama 48-72 jam",
      "Rehidrasi yang terlalu cepat pada hipernatremia berbahaya, sehingga pengembalian cairan sengaja diperlambat.",
      SUMBER.medscapeHiperNa,
    ),
  );
  tambahStatusCairan(langkah, j);
  langkah.push(
    b(
      "info",
      "Kadar natrium tiap cairan yang tersedia",
      NA_CAIRAN.map((c) => c.nama + " " + c.na).join(" mmol/L, ") + " mmol/L. Angka ini dipakai untuk memilih cairan pengganti yang tepat.",
      SUMBER.medscapeNaCairan,
    ),
  );

  const pagar: Baris[] = [
    b("blokir", "Penurunan natrium tidak melampaui 0,5 mmol/L per jam", "Setara dengan 10-12 mmol/L dalam 24 jam.", SUMBER.rchHiperNa, SUMBER.medscapeHiperNa),
    b(
      "bahaya",
      "Koreksi berlangsung tidak kurang dari 48 jam",
      "Otak membentuk osmol idiogenik dalam hitungan jam sebagai penyesuaian. Penurunan natrium yang lebih cepat daripada hilangnya osmol tersebut menimbulkan edema otak, terutama bila natrium melampaui 165 mmol/L.",
      SUMBER.picuHiperNa,
    ),
    b(
      "bahaya",
      "Bahaya pada hipernatremia sedang sampai berat",
      "Penyusutan otak akut dapat menimbulkan ruptur pembuluh darah, perdarahan intrakranial, dan demielinasi.",
      SUMBER.rchHiperNa,
    ),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Periksa natrium berkala dan hitung laju sebenarnya", "Gunakan pelacak laju pada langkah berikutnya untuk membandingkan laju terukur dengan pagar 0,5 mmol/L per jam.", SUMBER.rchHiperNa),
    b("aksi", "Pada hipernatremia sedang dan berat, ambil osmolalitas serum dan urine berpasangan", "Pemeriksaan ini tidak boleh menunda pemberian terapi cairan.", SUMBER.rchHiperNa),
    b("aksi", "Catat neraca cairan dan berat badan", "Berat badan adalah penanda paling peka atas kecukupan rehidrasi.", SUMBER.rchHiperNa),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Hipernatremia berat, yaitu natrium 170 mmol/L atau lebih", "Tangani bersama tim yang berpengalaman dan pertimbangkan perawatan intensif anak.", SUMBER.rchHiperNa),
    b(
      "blokir",
      "Natrium di atas 200 mmol/L berada di luar kemampuan fasilitas primer",
      "Pada kadar tersebut diperlukan dialisis peritoneal memakai dialisat berkadar glukosa tinggi dan natrium rendah. Rujuk segera.",
      SUMBER.medscapeHiperNa,
    ),
  ];

  return { derajat: derajatElektrolit("hiperNa", na, j.usiaBulan), gawat: j.gejalaBerat === true, langkah, pagar, pemantauan, rujuk };
}

function rencanaHipoK(j: JawabanAlur, bb: number, k: number): Rencana {
  const langkah: Baris[] = [];
  const gawat = j.gejalaBerat === true || j.ekgAtauInstabil === true;

  langkah.push(
    b(
      "blokir",
      "Ukur dan koreksi magnesium lebih dahulu",
      "Kalium tidak akan terkoreksi selama magnesium masih rendah. Mengoreksi hipomagnesemia membantu tubuh menahan kalium.",
      SUMBER.rchHipoK,
      SUMBER.pier,
    ),
  );

  if (!gawat && j.oral === "bisa") {
    langkah.push(
      b(
        "aksi",
        "Kalium klorida oral " + fmt(Math.min(1 * bb, 20), 1) + "-" + fmt(Math.min(2 * bb, 20), 1) + " mmol per dosis",
        "Dosis akut 1-2 mmol/kg per dosis dengan batas 20 mmol per dosis. Dosis dapat diulang setelah kadar kalium diperiksa kembali. Batas harian adalah 5 mmol/kg per hari dengan total maksimum 50 mmol.",
        SUMBER.rchHipoK,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Dosis rumatan " + fmt(2 * bb, 1) + "-" + fmt(5 * bb, 1) + " mmol per hari terbagi",
        "Rumatan 2-5 mmol/kg per hari dibagi beberapa pemberian, tetap dengan batas 20 mmol per dosis.",
        SUMBER.rchHipoK,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Koreksi bertahap selama 24-48 jam",
        "Jalur ini berlaku bila anak stabil secara hemodinamik dan EKG normal.",
        SUMBER.rchHipoK,
      ),
    );
  } else {
    langkah.push(
      b(
        "info",
        "Jalur oral atau enteral tetap diutamakan bila memungkinkan",
        "Jalur intravena dipilih hanya bila anak tidak toleran jalur enteral, tidak stabil secara hemodinamik, bergejala, atau ketidakseimbangan tergolong berat.",
        SUMBER.rchHipoK,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Infus kontinu di bangsal maksimum " + fmt(0.25 * bb, 2) + " mmol per jam",
        "Batasnya 0,25 mmol/kg per jam untuk perawatan bangsal biasa.",
        SUMBER.achK,
      ),
    );
    langkah.push(
      b(
        "aksi",
        "Di ruang intensif dapat sampai " + fmt(1 * bb, 2) + " mmol per jam",
        "Batasnya 1 mmol/kg per jam dengan maksimum mutlak 40 mmol per jam, dan hanya boleh dijalankan dengan pemantauan jantung.",
        SUMBER.achK,
      ),
    );
    langkah.push(
      b(
        "bahaya",
        "Hitung semua sumber kalium yang masuk",
        "Sumbernya mencakup kalium oral, cairan rumatan intravena, nutrisi parenteral, dan infus intermiten. Kalium oral ditahan selama infus berjalan dan baru dimulai kembali setelah kadar pasca-infus diperiksa dan memuaskan.",
        SUMBER.achK,
      ),
    );
  }

  langkah.push(
    b(
      "info",
      "Gejala dan gambaran EKG yang perlu dicari",
      "Rasa lelah, kelemahan otot, hiporefleksia, parestesia, kram, kaki gelisah, konstipasi sampai ileus, dan alkalosis metabolik. Pada EKG tampak gelombang T mendatar dan gelombang U.",
      SUMBER.pier,
    ),
  );

  const pagar: Baris[] = [
    b("blokir", "Batas 20 mmol per dosis oral dan 50 mmol per hari", "Dosis akut oral 1-2 mmol/kg dengan batas 20 mmol per dosis, dan batas harian 5 mmol/kg atau 50 mmol.", SUMBER.rchHipoK),
    b("blokir", "Kalium intravena tanpa pemantauan jantung tidak melampaui 0,25 mmol/kg per jam", "Laju yang lebih tinggi hanya di ruang intensif dengan pemantauan jantung.", SUMBER.achK),
    b("bahaya", "Waspadai nutrisi parenteral yang sudah mengandung kalium", "Kalium dalam nutrisi parenteral sering terlewat saat menghitung total asupan.", SUMBER.pier),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Periksa ulang kalium sebelum mengulang dosis", "Dosis akut oral boleh diulang hanya setelah kadar kalium diperiksa kembali.", SUMBER.rchHipoK),
    b("aksi", "Periksa kadar pasca-infus sebelum memulai kembali kalium oral", "Ini mencegah penumpukan dari dua jalur sekaligus.", SUMBER.achK),
    b("aksi", "Nilai ulang magnesium", "Hipokalemia yang tidak membaik hampir selalu perlu penilaian ulang magnesium.", SUMBER.pier),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Hipokalemia berat atau bergejala dirawat di area berpemantauan jantung", "Kalium intravena berlaju tinggi hanya dijalankan di ruang intensif anak.", SUMBER.achK),
  ];

  return { derajat: derajatElektrolit("hipoK", k, j.usiaBulan), gawat, langkah, pagar, pemantauan, rujuk };
}

function rencanaHiperK(j: JawabanAlur, bb: number, k: number): Rencana {
  const langkah: Baris[] = [];
  const gawat = j.ekgAtauInstabil === true || j.gejalaBerat === true || k > 6.5;

  langkah.push(
    b(
      "aksi",
      "Hentikan semua sumber kalium dan obati penyebabnya",
      "Periksa kembali seluruh cairan infus, obat, dan nutrisi yang mengandung kalium.",
      SUMBER.rchHiperK,
    ),
  );
  langkah.push(
    b(
      "info",
      "Ambang memulai terapi",
      "Terapi diberikan bila terdapat perubahan EKG, atau bila kalium melampaui 6 sampai 6,5 mmol/L tanpa memandang gambaran EKG.",
      SUMBER.daly,
    ),
  );

  if (j.digoksin === true) {
    langkah.push(
      b(
        "blokir",
        "Kalsium tidak diberikan karena digoksin dicurigai",
        "Pada keracunan digoksin, pemberian kalsium dihindari. Untuk aritmia yang mengancam nyawa pada keadaan ini digunakan magnesium sulfat 2 gram diberikan dalam 5 menit.",
        SUMBER.medscapeHiperK,
      ),
    );
  } else if (gawat) {
    langkah.push(
      b(
        "aksi",
        "Langkah 1, stabilkan membran jantung: kalsium glukonas 10% " + fmt(Math.min(0.68 * bb, 30), 1) + " mL",
        "Dosis 0,15 mmol/kg setara 0,68 mL/kg, dengan batas 6,6 mmol atau 30 mL. Diberikan dalam 2-5 menit bila anak tidak stabil, atau 15-20 menit bila anak stabil. Kalsium glukonas lebih dipilih bila hanya tersedia jalur perifer karena kurang mengiritasi pembuluh darah. Alternatifnya kalsium klorida 10% sebanyak 0,2 mL/kg atau maksimum 10 mL. Pantau tanda ekstravasasi.",
        SUMBER.rchHiperK,
      ),
    );
    langkah.push(
      b(
        "bahaya",
        "Urutan ini tidak boleh ditukar",
        "Stabilisasi membran diberikan lebih dahulu, baru pemindahan kalium ke dalam sel, kemudian pembuangan kalium dari tubuh. Kalsium menstabilkan jantung tetapi tidak menurunkan kadar kalium.",
        SUMBER.rchHiperK,
        SUMBER.pem,
      ),
    );
  }

  langkah.push(
    b(
      "aksi",
      "Langkah 2, pindahkan kalium ke dalam sel",
      "Salbutamol inhalasi dan insulin bersama glukosa intravena. Kedua tindakan ini menurunkan kalium serum sementara tanpa membuangnya dari tubuh.",
      SUMBER.rchHiperK,
    ),
  );
  langkah.push(
    b(
      "aksi",
      "Langkah 3, buang kalium dari tubuh",
      "Resin penukar ion seperti resonium per rektal, diuretik, dan dialisis bila diperlukan.",
      SUMBER.rchHiperK,
    ),
  );
  langkah.push(
    b(
      "info",
      "Penelusuran penyebab",
      "Periksa kreatin kinase, kortisol dan aldosteron, serta kadar digoksin bila relevan.",
      SUMBER.rchHiperK,
    ),
  );

  const pagar: Baris[] = [
    b(
      "bahaya",
      "Perubahan EKG pada hiperkalemia tidak berjenjang",
      "EKG dapat melompat dari gambaran normal langsung ke fibrilasi ventrikel, terutama bila kalium berubah dengan cepat. EKG tidak boleh dijadikan satu-satunya penentu keputusan.",
      SUMBER.pem,
    ),
    b(
      "info",
      "Urutan gambaran EKG bila memang muncul bertahap",
      "Di atas 5,5 mmol/L tampak gelombang T yang meruncing. Di atas 6,5 mmol/L interval PR memanjang, QRS melebar, dan muncul aritmia. Selanjutnya gelombang P menghilang serta QRS dan T menyatu membentuk gelombang sinus, yang berlanjut menjadi fibrilasi ventrikel atau asistol.",
      SUMBER.ggcEkg,
    ),
    b(
      "bahaya",
      "Kalsium klorida bersifat kaustik bagi vena perifer",
      "Kalsium klorida 10% mengandung 13,6 mEq kalsium per 10 mL, jauh lebih pekat daripada kalsium glukonas.",
      SUMBER.pem,
    ),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Periksa kalium pada jam ke-1, ke-2, ke-4, ke-6, dan ke-24", "Jadwal ini dihitung sejak hiperkalemia dikenali dan terapi dimulai.", SUMBER.medscapeHiperK),
    b("aksi", "Pemantauan EKG berkelanjutan selama terapi", "Terutama selama dan sesudah pemberian kalsium.", SUMBER.rchHiperK),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Hiperkalemia yang mengancam nyawa dirujuk untuk perawatan intensif", "Libatkan intensivis anak atau neonatologis, dan nefrologi anak bila terdapat gangguan ginjal.", SUMBER.medscapePedHiperK),
  ];

  return { derajat: derajatElektrolit("hiperK", k, j.usiaBulan), gawat, langkah, pagar, pemantauan, rujuk };
}

function rencanaHipoCa(j: JawabanAlur, bb: number, caTerkoreksi: number): Rencana {
  const langkah: Baris[] = [];
  const neonatus = j.usiaBulan != null && j.usiaBulan < 1;
  const mgMin = neonatus ? 100 : 29;
  const mgMaks = neonatus ? 200 : 60;

  if (j.albuminGdl != null)
    langkah.push(
      b(
        "info",
        "Kalsium terkoreksi albumin " + fmt(caTerkoreksi, 1) + " mg/dL",
        "Rumus koreksinya adalah kalsium total + 0,8 x (4 - albumin). Penilaian derajat memakai angka terkoreksi ini, bukan kalsium total mentah.",
        SUMBER.fdaCa,
      ),
    );

  langkah.push(
    b(
      "aksi",
      "Kalsium glukonas 10% " + fmt((mgMin * bb) / 100, 1) + "-" + fmt((mgMaks * bb) / 100, 1) + " mL",
      "Dosis " +
        mgMin +
        "-" +
        mgMaks +
        " mg/kg untuk " +
        (neonatus ? "usia di bawah 1 bulan" : "usia 1 bulan sampai 17 tahun") +
        ", setara " +
        fmt(mgMin * bb, 0) +
        "-" +
        fmt(mgMaks * bb, 0) +
        " mg karena sediaan 10% mengandung 100 mg per mL. Dosis dapat diulang tiap 6 jam bila diperlukan.",
      SUMBER.dosisCa,
    ),
  );
  langkah.push(
    b(
      "aksi",
      "Bila diperlukan infus kontinu: " +
        (neonatus ? "17-33" : "8-13") +
        " mg/kg per jam, yaitu " +
        fmt(((neonatus ? 17 : 8) * bb) / 100, 2) +
        "-" +
        fmt(((neonatus ? 33 : 13) * bb) / 100, 2) +
        " mL per jam",
      "Laju infus kontinu berbeda menurut usia.",
      SUMBER.dosisCa,
    ),
  );
  langkah.push(
    b(
      "info",
      "Kandungan kalsium elemental",
      "Setiap 1 mL kalsium glukonas 10% mengandung 100 mg kalsium glukonas, setara 9,3 mg atau 0,465 mEq kalsium elemental.",
      SUMBER.fdaCa,
    ),
  );
  langkah.push(
    b(
      "aksi",
      "Periksa magnesium bila kalsium sulit terkoreksi",
      "Hipokalsemia yang menyertai hipomagnesemia tidak akan membaik sebelum magnesium dikoreksi. Pada pasien dengan magnesium normal namun hipokalsemia, pemberian magnesium harian dapat diulang selama 3 sampai 5 hari.",
      SUMBER.medscapeMg,
    ),
  );

  const pagar: Baris[] = [
    b("blokir", "Laju bolus tidak melampaui 100 mg per menit", "Batas ini berlaku untuk pasien anak termasuk neonatus; pada dewasa batasnya 200 mg per menit.", SUMBER.fdaCa),
    b("blokir", "Encerkan sebelum diberikan", "Untuk bolus, encerkan sampai 10-50 mg/mL. Untuk infus kontinu, encerkan sampai 5,8-10 mg/mL, memakai dekstrosa 5% atau NaCl 0,9%.", SUMBER.fdaCa),
    b("bahaya", "Ekstravasasi menimbulkan kerusakan jaringan", "Dapat terjadi kalsinosis kutis dan nekrosis jaringan. Jangan memberikan pada jari tangan atau kaki.", SUMBER.fdaCa),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Pantau EKG selama pemberian kalsium", "Pemberian yang terlalu cepat dapat menimbulkan gangguan irama jantung.", SUMBER.fdaCa),
    b("aksi", "Periksa lokasi infus secara berkala", "Untuk menangkap ekstravasasi sedini mungkin.", SUMBER.fdaCa),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Hipokalsemia bergejala berat perlu jalur intravena dan pemantauan jantung", "Tetani, kejang, atau aritmia menandakan kebutuhan perawatan berpemantauan.", SUMBER.medscapeMg),
  ];

  return { derajat: derajatElektrolit("hipoCa", caTerkoreksi, j.usiaBulan), gawat: j.gejalaBerat === true, langkah, pagar, pemantauan, rujuk };
}

function rencanaHipoMg(j: JawabanAlur, bb: number, mg: number): Rencana {
  const langkah: Baris[] = [
    b(
      "info",
      "Kapan jalur intravena dipilih",
      "Jalur intravena dipakai bila pasien tidak stabil secara hemodinamik, mengalami aritmia, tetani atau kejang, atau bila hipomagnesemia disertai hipokalsemia maupun hipokalemia.",
      SUMBER.medscapeMg,
    ),
    b(
      "aksi",
      "Magnesium sulfat " + fmt(25 * bb, 0) + "-" + fmt(50 * bb, 0) + " mg per dosis tiap 6 jam",
      "Dosis 25-50 mg/kg per dosis diberikan tiap 6 jam sebanyak 2 sampai 3 dosis, kemudian kadar magnesium diperiksa ulang. Dosis ini berlaku untuk bayi, anak, dan remaja.",
      SUMBER.aapMg,
    ),
    b(
      "aksi",
      "Pada remaja bertubuh besar dan dewasa",
      "Terapi dimulai dengan 1 sampai 2 gram magnesium sulfat, setara 8 sampai 16 mEq, diberikan dalam 2 sampai 15 menit.",
      SUMBER.medscapeMg,
    ),
    b(
      "aksi",
      "Koreksi magnesium sebelum menyalahkan kalium atau kalsium",
      "Hipokalemia maupun hipokalsemia yang tidak membaik sering disebabkan magnesium yang belum terkoreksi.",
      SUMBER.rchHipoK,
      SUMBER.medscapeMg,
    ),
  ];

  const pagar: Baris[] = [
    b("blokir", "Maksimum 50 mEq diberikan perlahan dalam 8 sampai 24 jam", "Batas ini berlaku untuk pemberian lanjutan setelah dosis awal.", SUMBER.medscapeMg),
    b("bahaya", "Sasaran kadar", "Pertahankan magnesium plasma di atas 1,0 mg/dL atau 0,4 mmol/L.", SUMBER.medscapeMg),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Periksa ulang magnesium setelah 2 sampai 3 dosis", "Ini adalah titik penilaian ulang yang dianjurkan.", SUMBER.aapMg),
    b("aksi", "Nilai kembali kalium dan kalsium", "Keduanya sering ikut membaik setelah magnesium terkoreksi.", SUMBER.medscapeMg),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Aritmia, tetani, atau kejang memerlukan area berpemantauan jantung", "Pemberian intravena dilakukan di tempat dengan pemantauan.", SUMBER.medscapeMg),
  ];

  return { derajat: derajatElektrolit("hipoMg", mg, j.usiaBulan), gawat: j.gejalaBerat === true, langkah, pagar, pemantauan, rujuk };
}

function rencanaHipoPO4(j: JawabanAlur, bb: number, po4: number): Rencana {
  const neonatus = j.usiaBulan != null && j.usiaBulan < 1;
  const dosisMin = neonatus ? 1 : 2;
  const dosisMaks = neonatus ? 1 : 3;

  const langkah: Baris[] = [
    b(
      "aksi",
      "Fosfat " +
        fmt(dosisMin * bb, 1) +
        (dosisMaks !== dosisMin ? "-" + fmt(dosisMaks * bb, 1) : "") +
        " mmol per hari terbagi 2 sampai 4 dosis",
      neonatus
        ? "Dosis neonatus adalah 1 mmol/kg per hari terbagi 2 sampai 4 dosis, dan dapat ditingkatkan sampai 3 mmol/kg per hari pada osteopenia prematuritas."
        : "Dosis anak adalah 2 sampai 3 mmol/kg per hari terbagi 2 sampai 4 dosis.",
      SUMBER.rchPO4,
    ),
    b(
      "info",
      "Batas jumlah tablet per hari",
      "Anak di bawah 5 tahun maksimum 3 tablet per hari, anak di atas 5 tahun maksimum 6 tablet per hari, sedangkan remaja dan dewasa 1 sampai 2 tablet sebanyak 2 sampai 3 kali sehari.",
      SUMBER.rchPO4,
    ),
    b(
      "bahaya",
      "Kurangi dosis pada gangguan fungsi ginjal",
      "Penyesuaian dosis dilakukan bersama konsultan.",
      SUMBER.rchPO4,
    ),
    b(
      "info",
      "Pikirkan sindrom refeeding sebagai penyebab",
      "Penurunan fosfat, kalium, atau magnesium sebesar 10-20 persen tergolong ringan, 20-30 persen tergolong sedang, dan lebih dari 30 persen tergolong berat, bila terjadi dalam 5 hari sejak pemberian kalori dimulai.",
      SUMBER.aspenRefeeding,
    ),
  ];

  const pagar: Baris[] = [
    b(
      "blokir",
      "Koreksi berlebih berbahaya",
      "Dapat menimbulkan hiperfosfatemia, hipokalsemia, hipernatremia, serta nefrokalsinosis akut yang berujung pada gagal ginjal akut.",
      SUMBER.rchPO4,
    ),
    b(
      "bahaya",
      "Efek samping yang sering muncul",
      "Nyeri perut, diare, mual, dan muntah.",
      SUMBER.rchPO4,
    ),
  ];

  const pemantauan: Baris[] = [
    b("aksi", "Pantau fosfat bersama kalsium", "Keduanya bergerak berlawanan sehingga harus dinilai bersama.", SUMBER.rchPO4),
    b(
      "aksi",
      "Cari manifestasi klinis hipofosfatemia",
      "Aritmia, kelemahan otot, nyeri tulang, kejang, koma, anemia hemolitik, dan riketsia.",
      SUMBER.rchPO4,
    ),
  ];

  const rujuk: Baris[] = [
    b("aksi", "Gangguan ginjal atau hipofosfatemia berat perlu konsultasi", "Penyesuaian dosis dan pemantauan dilakukan bersama konsultan.", SUMBER.rchPO4),
  ];

  return { derajat: derajatElektrolit("hipoPO4", po4, j.usiaBulan), gawat: j.gejalaBerat === true, langkah, pagar, pemantauan, rujuk };
}

/** Susun rencana lengkap dari jawaban alur. Null bila data wajib belum lengkap. */
export function rencanaElektrolit(j: JawabanAlur): Rencana | null {
  const id = j.gangguan;
  const bb = j.bbKg;
  const nilai = j.nilai;
  if (id == null || bb == null || nilai == null) return null;
  if (!isFinite(bb) || !isFinite(nilai) || bb <= 0) return null;

  if (id === "hipoNa") return rencanaHipoNa(j, bb, nilai);
  if (id === "hiperNa") return rencanaHiperNa(j, bb, nilai);
  if (id === "hipoK") return rencanaHipoK(j, bb, nilai);
  if (id === "hiperK") return rencanaHiperK(j, bb, nilai);
  if (id === "hipoCa") return rencanaHipoCa(j, bb, kalsiumTerkoreksi(nilai, j.albuminGdl));
  if (id === "hipoMg") return rencanaHipoMg(j, bb, nilai);
  return rencanaHipoPO4(j, bb, nilai);
}

// ---------------------------------------------------------------------------
// Pelacak laju koreksi
// ---------------------------------------------------------------------------

/**
 * Bandingkan laju koreksi yang benar-benar terjadi dengan batas amannya.
 * Dipakai pada hiponatremia dan hipernatremia.
 */
export function hitungLajuKoreksi(a: {
  gangguan: GangguanId;
  awal: number | null;
  sekarang: number | null;
  jam: number | null;
  kejang: boolean;
}): HasilLaju | null {
  const { awal, sekarang, jam } = a;
  if (awal == null || sekarang == null || jam == null) return null;
  if (!isFinite(awal) || !isFinite(sekarang) || !isFinite(jam) || jam <= 0) return null;

  const delta = sekarang - awal;
  const perJam = delta / jam;
  const proyeksi24 = perJam * 24;
  const naik = a.gangguan === "hipoNa";
  const batas24 = naik ? (a.kejang ? 10 : 8) : 10;
  const besar = Math.abs(proyeksi24);
  const sudah = Math.abs(delta);
  const lampau = besar > batas24 || sudah > batas24;

  const sumber: Sumber[] = naik
    ? [SUMBER.rchHipoNa, SUMBER.chq, SUMBER.bcehs]
    : [SUMBER.rchHiperNa, SUMBER.medscapeHiperNa];

  let nada: NadaBaris = "info";
  let pesan: string;

  if (sudah > batas24) {
    nada = "blokir";
    pesan =
      "Perubahan yang sudah terjadi sebesar " +
      fmt(Math.abs(delta), 1) +
      " mmol/L dalam " +
      fmt(jam, 1) +
      " jam sudah melampaui batas aman " +
      batas24 +
      " mmol/L per 24 jam. Hentikan koreksi aktif dan konsultasikan; penurunan kembali kadar natrium hanya boleh dilakukan atas arahan tim spesialis.";
  } else if (lampau) {
    nada = "bahaya";
    pesan =
      "Dengan laju sekarang, proyeksi 24 jam mencapai " +
      fmt(Math.abs(proyeksi24), 1) +
      " mmol/L, melampaui batas aman " +
      batas24 +
      " mmol/L. Perlambat sekarang juga sebelum batas aman benar-benar terlampaui.";
  } else if (!naik && Math.abs(perJam) > 0.5) {
    nada = "bahaya";
    pesan =
      "Laju " +
      fmt(Math.abs(perJam), 2) +
      " mmol/L per jam melampaui batas 0,5 mmol/L per jam pada hipernatremia, meskipun proyeksi 24 jamnya masih di bawah batas aman. Perlambat.";
  } else {
    nada = "aksi";
    pesan =
      "Laju " +
      fmt(Math.abs(perJam), 2) +
      " mmol/L per jam, proyeksi 24 jam " +
      fmt(Math.abs(proyeksi24), 1) +
      " mmol/L, masih di dalam batas aman " +
      batas24 +
      " mmol/L. Lanjutkan sambil tetap memantau.";
  }

  return { delta, jam, perJam, proyeksi24, batas24, lampau, nada, pesan, sumber };
}

// ---------------------------------------------------------------------------
// Ringkasan teks terstruktur (menggantikan stripTags atas untaian HTML)
// ---------------------------------------------------------------------------

function barisKeTeks(x: Baris): string {
  const s = x.sumber.length > 0 ? " [" + x.sumber.map((y) => y.label).join("; ") + "]" : "";
  return "- " + x.judul + ". " + x.isi + s;
}

export function ringkasRencanaTeks(judul: string, r: Rencana): string {
  const bagian: string[] = [judul];
  if (r.derajat != null)
    bagian.push(
      "Penilaian: " +
        r.derajat.label +
        " (" +
        r.derajat.rentang +
        ")" +
        (r.derajat.catatan != null ? ". " + r.derajat.catatan : ""),
    );
  if (r.langkah.length > 0) bagian.push("Tatalaksana:\n" + r.langkah.map(barisKeTeks).join("\n"));
  if (r.pagar.length > 0) bagian.push("Batas aman dan kewaspadaan:\n" + r.pagar.map(barisKeTeks).join("\n"));
  if (r.pemantauan.length > 0) bagian.push("Monitoring:\n" + r.pemantauan.map(barisKeTeks).join("\n"));
  if (r.rujuk.length > 0) bagian.push("Indikasi rujukan:\n" + r.rujuk.map(barisKeTeks).join("\n"));
  return bagian.join("\n\n");
}
