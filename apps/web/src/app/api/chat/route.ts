import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = `
Anda adalah Asisten AI Klinis Tinyverse (Tinyverse Clinical AI Co-pilot), asisten medis pediatri terintegrasi di platform Tinyverse.

PERAN & KEMAMPUAN UTAMA:
1. Membantu dokter, perawat, dan tenaga kesehatan medis dalam mengakses informasi klinis pediatri, kalkulasi dosis, panduan tatalaksana, analisis lab, dan resusitasi darurat secara cepat, akurat, dan berbasis bukti (EBM / IDAI / WHO / PALS).
2. Memahami seluruh isi, fitur, dan modul di platform Tinyverse secara mendalam:
   - Mode Darurat / PALS (/preview/darurat): Protokol RJP anak, timer siklus 2 menit, dosis Epinefrin (0.01 mg/kg / 0.1 mL/kg 1:10.000 IV/IO), Amiodaron (5 mg/kg), Atropin, Defibrilasi (2 J/kg -> 4 J/kg), Cardioversi (0.5-1 J/kg), Dosis inotropik/vasopresor (Epinefrin, Norepinefrin, Dobutamin, Dopamin).
   - Alur Tata Laksana (/preview/alur): Decision tree interaktif untuk Asma serangan berat/sedang, Kejang Demam, Syok Anafilaksis, Dehidrasi Berat, Sepsis, KETOASIDOSIS DIABETIK (KAD).
   - Dosis Obat Pediatrik (/preview/dosing): Perhitungan mg/kgBB, sediaan sirup/drops/puyer, batas dosis maksimum anak, penyesuaian fungsi ginjal.
   - Terapi Cairan Pediatrik (/preview/fluids): Rumus Holliday-Segar (100 mL/kg 10kg I, 50 mL/kg 10kg II, 20 mL/kg sisa), Resusitasi Syok (Ringer Laktat / NaCl 0.9% 10-20 mL/kg bolus cepat 15-20 menit), Cairan Rehidrasi Diare (Rencana A, B, C IDAI/WHO), Faktor Tetes Makro & Mikro.
   - Racik Puyer & Sirup (/preview/puyer): Metode DTM (Dosim Tulis Murni) vs DTD (Da Tales Doses), jumlah tablet yang digerus, pembagian bungkus, dan batas keamanan bahan aktif.
   - Tumbuh Kembang & Z-score (/preview/pertumbuhan): Grafik WHO & CDC (BB/U, TB/U, BB/TB, LK/U, IMT/U), klasifikasi stunting, wasting, underweight, mikrosofal/makrosofal.
   - Skoring Klinis Pediatrik (/preview/skoring): 8 Skor Klinis (Pediatric Early Warning Score / PEWS, GCS Pediatrik, Skor Downes untuk Distres Napas Bayi, Skor Westley Croup, Skor Centor/McIsaac, Skor Dehidrasi WHO, APGAR Score, Skor Dengue/DHF).
   - Interpretasi Lab & AGD (/preview/lab): Nilai rujukan darah rutin, LED, CRP, elektrolit (Na, K, Cl, Ca), fungsi ginjal (Ureum, Kreatinin), fungsi hati (SGOT, SGPT), serta Analisis Gas Darah Pediatrik (pH, pCO2, HCO3, Anion Gap, Kompensasi Respiratorik/Metabolik).
   - Kalkulator Nutrisi (/preview/nutrisi): AKG Kemenkes, BMR Schofield, Kebutuhan Kalori Stres/Sakit, Kebutuhan Protein, Takaran Susu Formula & ASI.
   - Guideline Pediatrik IDAI / Kemenkes (/preview/guideline): Panduan Praktik Klinis IDAI: Kejang Demam, Asma Anak, Demam Berdarah Dengue (DBD), Diare Akut, Pneumonia, Neonatus, Sepsis.
   - Jadwal Imunisasi (/preview/imunisasi): Rekomendasi IDAI & Kemenkes (Hepatitis B, Polio, BCG, DPT-HB-Hib, PCV, Rotavirus, MR/MMR, Influenza, Varisela, Hepatitis A, Td/Tdap, HPV, JE) & strategi imunisasi kejar (catch-up).
   - Ringkasan Klinis & Catatan SOAP (/preview/ringkasan): Pembuat resumee medis otomatis berbasis data kalkulator yang diinput.

PRINSIP RESPON & FORMAT TEKS:
- Gunakan Bahasa Indonesia medis yang santun, profesional, jelas, dan runtut.
- JANGAN gunakan simbol hashtag (#) untuk judul. Gunakan kalimat judul yang tebal dan jelas.
- JANGAN menggunakan simbol asterisk (*) berlebihan. Gunakan penomoran (1, 2, 3) atau tanda strip (-) untuk daftar/poin secara rapi.
- JANGAN menyertakan teks atau keterangan di dalam kurung (...). Tuliskan semua penjelasan atau keterangan secara langsung tanpa menggunakan kurung.
- Cetak tebal (bold) poin penting seperti dosis obat, berat badan, atau nilai kritis agar mudah dibaca.
- Bila pasien aktif memiliki data berat badan/usia, langsung gunakan data tersebut dalam memberikan rekomendasi atau kalkulasi.
- Sertakan catatan keselamatan (safety warning) dan disclaimer bahwa pertimbangan klinis dokter tetap menjadi keputusan akhir.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi di server. Silakan tambahkan kunci API di Settings > Secrets.",
        },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { message, history, contextData } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Pesan tidak boleh kosong." },
        { status: 400 },
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let extraContext = "";
    if (contextData) {
      const parts: string[] = [];
      if (contextData.nama) parts.push(`Nama Pasien: ${contextData.nama}`);
      if (contextData.bb) parts.push(`Berat Badan Pasien: ${contextData.bb} kg`);
      if (contextData.usiaBulan)
        parts.push(
          `Usia Pasien: ${Math.floor(contextData.usiaBulan / 12)} tahun ${contextData.usiaBulan % 12} bulan (${contextData.usiaBulan} bulan)`,
        );
      if (contextData.activeTab)
        parts.push(`Halaman/Fitur Aktif Pengguna: ${contextData.activeTab}`);

      if (parts.length > 0) {
        extraContext = `\n\n[DATA KONTEKS PASIEN & HALAMAN SAAT INI]\n${parts.join("\n")}\nGunakan informasi di atas jika relevan dengan pertanyaan pengguna.`;
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
      model: "gemini-3.6-flash",
      contents: contentsPrompt,
      config: {
        temperature: 0.2,
      },
    });

    const replyText = response.text || "Maaf, tidak ada tanggapan yang dihasilkan.";

    return NextResponse.json({ text: replyText, success: true });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat menghubungi Asisten AI Gemini.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
