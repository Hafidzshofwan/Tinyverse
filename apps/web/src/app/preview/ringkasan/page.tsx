import { ComingSoon } from "@/shared/ui/ComingSoon";

export const metadata = {
  title: "Ringkasan Klinis | Tinyverse",
};

export default function RingkasanPage() {
  return (
    <ComingSoon
      title="Ringkasan Klinis"
      desc="Rangkum hasil dari berbagai alat menjadi satu catatan yang siap disalin ke rekam medis."
      ringkasan="Menggabungkan hasil perhitungan (dosis, cairan, skor) menjadi ringkasan teks yang rapi dan siap salin."
      fitur={[
        "Kumpulkan hasil dari beberapa alat",
        "Format teks rapi siap salin dan tempel",
        "Sunting sebelum menyalin",
        "Ekspor sebagai teks atau PDF",
      ]}
      catatan="Tidak menyimpan data pasien di server; semua diproses di perangkat."
    />
  );
}
