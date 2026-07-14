import { ComingSoon } from "@/shared/ui/ComingSoon";

export const metadata = {
  title: "Jadwal Imunisasi | Tinyverse",
};

export default function ImunisasiPage() {
  return (
    <ComingSoon
      title="Jadwal Imunisasi"
      desc="Jadwal imunisasi anak sesuai usia dan bantuan menyusun jadwal kejar bila terlambat."
      ringkasan="Menampilkan jadwal sesuai usia dan membantu menyusun jadwal kejar (catch-up) bila ada yang terlewat."
      fitur={[
        "Jadwal sesuai usia (IDAI terbaru)",
        "Status: sudah, belum, atau terlambat",
        "Saran jadwal kejar (catch-up)",
        "Cetak atau ekspor ringkasan",
      ]}
      catatan="Jadwal mengikuti rekomendasi IDAI dan dapat diperbarui tiap tahun."
    />
  );
}
