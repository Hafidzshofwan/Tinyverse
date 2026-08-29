/**
 * Rute Asisten AI Klinis.
 *
 * PENJAGAAN AKSES: rute ini WAJIB memeriksa sesi dan masa aktif langganan.
 * Gerbang berbayar di apps/web/src/app/preview/layout.tsx hanya melindungi
 * HALAMAN, bukan rute API. Tanpa pemeriksaan di sini, siapa pun di internet
 * dapat memanggil endpoint ini tanpa akun dan memakai kuota Gemini atas
 * tagihan kami -- sekaligus menikmati fitur yang seharusnya berbayar.
 *
 * PRIVASI: nama pasien SENGAJA TIDAK dikirim ke penyedia model. Berat badan,
 * usia, dan halaman aktif sudah cukup untuk seluruh kalkulasi klinis,
 * sedangkan nama mengubah data anonim menjadi data pribadi anak -- yang oleh
 * UU PDP No. 27/2022 digolongkan sebagai data pribadi spesifik. Jangan
 * menambahkan kembali nama, nomor rekam medis, atau pengenal lain ke dalam
 * konteks tanpa meninjau ulang apps/web/src/app/kebijakan-privasi/page.tsx.
 */
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { statusAksesSaatIni } from "@/server/entitlementServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = `Anda adalah Asisten AI Klinis Tinyverse (Tinyverse Clinical AI Co-pilot), asisten medis pediatri terintegrasi di platform Tinyverse.  PERAN & KEMAMPUAN UTAMA: 1. Membantu dokter, perawat, dan tenaga kesehatan medis dalam mengakses informasi klinis pediatri, kalkulasi dosis, panduan tatalaksana, analisis lab, dan resusitasi darurat secara cepat, akurat, dan berbasis bukti (EBM / IDAI / WHO / PALS). 2. Memahami seluruh isi, fitur, dan modul di platform Tinyverse secara mendalam:    - Mode Darurat / PALS (/preview/darurat): Protokol RJP anak, timer siklus 2 menit, dosis Epinefrin (0.01 mg/kg / 0.1 mL/kg 1:10.000 IV/IO), Amiodaron (5 mg/kg), Atropin, Defibrilasi (2 J/kg -> 4 J/kg), Cardioversi (0.5-1 J/kg), Dosis inotropik/vasopresor (Epinefrin, Norepinefrin, Dobutamin, Dopamin).    - Alur Tata Laksana (/preview/alur): Algoritma interaktif tata laksana kegawatan anak per kategori: Respirasi (Serangan Asma, FKTP & Rumah Sakit), Kegawatan Neurologi (Kejang Demam & status epileptikus), Metabolik & Endokrin (Hipoglikemia jalur anak sadar & tidak sadar; Ketoasidosis Diabetik/KAD -- resusitasi cairan, insulin, koreksi elektrolit), Penyakit Infeksi & Tropis (Demam Berdarah Dengue/DBD -- klasifikasi Grup A, B, C).    - Obat & Racik Puyer (/preview/obat): Dua tab dalam satu halaman -- tab Dosis Obat menghitung dosis mg/kgBB, sediaan sirup/drops/puyer, batas dosis maksimum anak, penyesuaian fungsi ginjal; tab Racik Puyer menghitung metode DTM (Dosis Tulis Murni) vs DTD (Da Tales Doses), jumlah tablet yang digerus, pembagian bungkus, dan batas keamanan bahan aktif. Rute lama /preview/dosing dan /preview/puyer tetap aktif sebagai pengalih ke halaman ini.    - Terapi Cairan Pediatrik (/preview/fluids): Rumus Holliday-Segar (100 mL/kg 10kg I, 50 mL/kg 10kg II, 20 mL/kg sisa), Resusitasi Syok (Ringer Laktat / NaCl 0.9% 10-20 mL/kg bolus cepat 15-20 menit), Cairan Rehidrasi Diare (Rencana A, B, C IDAI/WHO), Faktor Tetes Makro & Mikro.    - Tumbuh Kembang & Z-score (/preview/pertumbuhan): Grafik WHO & CDC (BB/U, TB/U, BB/TB, LK/U, IMT/U), klasifikasi stunting, wasting, underweight, mikrosofal/makrosofal.    - Skoring Klinis Pediatrik (/preview/skoring): 10 skor klinis tervalidasi -- Skor Dehidrasi (CDS), Westley Croup Score, Pediatric Appendicitis Score (PAS), Downes Score, Pediatric Asthma Severity Score (PASS), Kriteria Kawasaki (AHA), Skor Centor (Modifikasi McIsaac), Skoring TB Anak, APGAR Score, dan New Ballard Score (estimasi usia gestasi neonatus).    - Persentil Tekanan Darah Anak (/preview/tekanan-darah): Klasifikasi tekanan darah anak sesuai AAP 2017 dari usia, tinggi badan, dan jenis kelamin -- kategori Normal, Elevated BP, Stage 1 Hypertension, atau Stage 2 Hypertension. Usia 1 sampai kurang dari 13 tahun memakai persentil tinggi badan (Table 4 laki-laki / Table 5 perempuan); usia 13 tahun ke atas memakai ambang absolut Table 3 (120/80, 130/80, 140/90 mmHg). Kategori final memakai nilai terendah antara ambang persentil dan ambang absolut.    - Kalkulator eGFR Pediatrik (/preview/egfr): Estimasi fungsi ginjal anak usia 1-25 tahun -- rumus utama CKiD U25 berbasis tinggi badan & kreatinin serum (Pierce 2021), rumus pembanding Bedside Schwartz (Schwartz 2009), rumus alternatif opsional CKiD U25 berbasis cystatin C, klasifikasi stadium CKD KDIGO G1 sampai G5 (termasuk G3a/G3b), serta modul opsional perkiraan pita risiko progresi ke ESRD (Furth 2018) berdasarkan UPCR.    - Interpretasi Lab & AGD (/preview/lab): Nilai rujukan darah rutin, LED, CRP, elektrolit (Na, K, Cl, Ca), fungsi ginjal (Ureum, Kreatinin), fungsi hati (SGOT, SGPT), serta Analisis Gas Darah Pediatrik (pH, pCO2, HCO3, Anion Gap, Kompensasi Respiratorik/Metabolik).    - Tools Neonatus (/preview/neonatus): Dua tab dalam satu halaman -- tab Nutrisi Parenteral menghitung GIR/Glucose Infusion Rate, dosis asam amino, dan dosis lipid untuk bayi preterm & term berdasarkan hari kehidupan dan usia koreksi/postmenstrual age; tab Bilirubin menghitung ambang batas fototerapi, peningkatan perawatan, dan transfusi tukar berdasarkan usia gestasi, jam usia, dan faktor risiko neurotoksisitas. Rute lama /preview/tpn-neonatus dan /preview/bilirubin tetap aktif sebagai pengalih ke tab yang sesuai.    - Penilaian pGCS (/preview/gcs): Pediatric Glasgow Coma Scale berdasarkan kelompok usia -- penilaian respons Eye, Verbal, dan Motor, total skor 3 sampai 15.    - Guideline Pediatrik IDAI / Kemenkes (/preview/guideline): Panduan Praktik Klinis IDAI: Kejang Demam, Asma Anak, Demam Berdarah Dengue (DBD), Diare Akut, Pneumonia, Neonatus, Sepsis.    - Jadwal Imunisasi (/preview/imunisasi): Rekomendasi IDAI & Kemenkes (Hepatitis B, Polio, BCG, DPT-HB-Hib, PCV, Rotavirus, MR/MMR, Influenza, Varisela, Hepatitis A, Td/Tdap, HPV, JE) & strategi imunisasi kejar (catch-up).    - Ringkasan Klinis & Catatan SOAP (/preview/ringkasan): Pembuat resumee medis otomatis berbasis data kalkulator yang diinput.  PRINSIP RESPON & FORMAT TEKS: - Gunakan Bahasa Indonesia medis yang santun, profesional, jelas, dan runtut. - JANGAN gunakan simbol hashtag (#) untuk judul. Gunakan kalimat judul yang tebal dan jelas. - JANGAN menggunakan simbol asterisk (*) berlebihan. Gunakan penomoran (1, 2, 3) atau tanda strip (-) untuk daftar/poin secara rapi. - JANGAN menyertakan teks atau keterangan di dalam kurung (...). Tuliskan semua penjelasan atau keterangan secara langsung tanpa menggunakan kurung. - Cetak tebal (bold) poin penting seperti dosis obat, berat badan, atau nilai kritis agar mudah dibaca. - Bila pasien aktif memiliki data berat badan/usia, langsung gunakan data tersebut dalam memberikan rekomendasi atau kalkulasi. - Sertakan catatan keselamatan (safety warning) dan disclaimer bahwa pertimbangan klinis dokter tetap menjadi keputusan akhir.`;

export async function POST(req: Request) {
  try {
    /* Gerbang akses. Dijalankan SEBELUM apa pun yang lain, termasuk sebelum
       membaca badan permintaan, agar tidak ada pekerjaan yang terbuang untuk
       permintaan yang memang tidak berhak. */
    const status = await statusAksesSaatIni();
    if (!status.masuk) {
      return NextResponse.json(
        { error: "Silakan masuk terlebih dahulu untuk memakai Asisten AI." },
        { status: 401 },
      );
    }
    if (!status.entitlement.bolehAkses) {
      return NextResponse.json(
        {
          error:
            "Asisten AI tersedia selama masa langganan atau masa percobaan Anda masih berjalan.",
        },
        { status: 403 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      /* Pesan untuk pengguna dibuat netral; nama variabel dan tempat
         memasangnya adalah urusan pengelola, bukan urusan pengunjung. */
      console.error(
        "GEMINI_API_KEY belum terpasang. Tambahkan di Vercel: Project Settings > Environment Variables, lalu deploy ulang.",
      );
      return NextResponse.json(
        {
          error:
            "Asisten AI sedang tidak tersedia. Silakan coba beberapa saat lagi.",
        },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { message, history, contextData, recentResults } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    /* Konteks pasien yang dikirim ke penyedia model.

       NAMA PASIEN TIDAK DISERTAKAN. Ini keputusan privasi, bukan kelalaian:
       nama tidak menambah ketepatan satu pun perhitungan klinis, sementara
       kehadirannya membuat data yang terkirim menjadi data pribadi anak.
       Bila kelak ada permintaan menampilkan nama pada jawaban, tolak -- atau
       ubah lebih dahulu bagian Asisten AI pada Kebijakan Privasi. */
    let extraContext = "";
    if (contextData) {
      const parts: string[] = [];
      if (contextData.bb) parts.push(`Berat Badan Pasien: ${contextData.bb} kg`);
      if (contextData.usiaBulan)
        parts.push(
          `Usia Pasien: ${Math.floor(contextData.usiaBulan / 12)} tahun ${contextData.usiaBulan % 12} bulan (${contextData.usiaBulan} bulan)`,
        );
      if (contextData.activeTab)
        parts.push(`Halaman/Fitur Aktif Pengguna: ${contextData.activeTab}`);

      if (parts.length > 0) {
        extraContext = `\n\n[DATA KONTEKS PASIEN & HALAMAN SAAT INI]\n${parts.join("\n")}\nGunakan informasi di atas jika relevan dengan pertanyaan pengguna. Identitas pasien tidak disertakan; jangan menanyakan atau menyebut nama pasien.`;
      }
    }

    /* Hasil kalkulator terkini yang sudah dikurasi pengguna lewat Ringkasan
       Klinis (shared/lib/ringkasan.ts). Item ini sejak awal ditulis TANPA
       identitas pasien -- lihat kontrak addRingkasanItem() -- sehingga aman
       diteruskan apa adanya. Tujuannya: pengguna tidak perlu mengetik ulang
       skor/hasil yang baru saja didapat dari alat lain di web ini. */
    if (Array.isArray(recentResults) && recentResults.length > 0) {
      const items = recentResults
        .filter(
          (it: unknown): it is { title?: unknown; source?: unknown; body?: unknown } =>
            !!it && typeof it === "object",
        )
        .slice(0, 10)
        .map((it) => ({
          title: typeof it.title === "string" ? it.title.slice(0, 120) : "Hasil",
          source: typeof it.source === "string" ? it.source.slice(0, 60) : undefined,
          body: typeof it.body === "string" ? it.body.slice(0, 800) : "",
        }))
        .filter((it) => it.body.trim().length > 0);

      if (items.length > 0) {
        const formatted = items
          .map(
            (it, i) =>
              `${i + 1}. ${it.title}${it.source ? ` (${it.source})` : ""}\n${it.body}`,
          )
          .join("\n\n");
        extraContext += `\n\n[HASIL KALKULATOR TERKINI PASIEN INI]\n${formatted}\nGunakan hasil di atas secara otomatis bila relevan dengan pertanyaan pengguna, tanpa meminta pengguna mengetik ulang. Data ini tidak memuat identitas pasien. Bila pengguna meminta ringkasan kunjungan atau catatan SOAP, susun Subjective, Objective, Assessment, dan Plan berdasarkan seluruh hasil di atas.`;
      }
    }

    // Standardize contents formatting with conversation history if available
    let contentsPrompt = `${SYSTEM_INSTRUCTION}${extraContext}\n\nUser Question: ${message}`;

    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .map(
          (item: { role: string; text: string }) =>
            `${item.role === "user" ? "User" : "Asisten AI"}: ${item.text}`,
        )
        .join("\n\n");
      contentsPrompt = `${SYSTEM_INSTRUCTION}${extraContext}\n\n[RIWAYAT PERCAKAPAN]\n${formattedHistory}\n\nUser: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contentsPrompt,
      config: {
        temperature: 0.2,
      },
    });

    const replyText = response.text || "Maaf, tidak ada tanggapan yang dihasilkan.";

    return NextResponse.json({ text: replyText, success: true });
  } catch (error: unknown) {
    /* Galat mentah dari penyedia model TIDAK diteruskan ke peramban. Pesan
       galat penyedia kadang memuat potongan permintaan, keterangan kuota, atau
       nama model -- keterangan yang berguna bagi kami di log, tetapi tidak
       perlu, dan tidak semestinya, dilihat pengguna. */
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan saat menghubungi Asisten AI. Silakan coba lagi beberapa saat lagi.",
      },
      { status: 500 },
    );
  }
}
