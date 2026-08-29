import "./v17-imunisasi.css";
import { ImunisasiPanel } from "@/widgets/imunisasi-panel";

export const metadata = {
  title: "Jadwal Imunisasi",
};

export default function ImunisasiPage() {
  return (
    <>
      {/*
       * Preload gambar bagan default ("Bagan Jadwal", tab pertama yang
       * terbuka -- lihat useState("jadwal") di ScheduleChart.tsx). Elemen
       * <link> yang dirender langsung oleh Server Component di sini otomatis
       * diangkat Next.js ke <head> dokumen.
       *
       * WHY perlu ini SELAIN fetchPriority di tag <img>: fetchPriority baru
       * berlaku setelah React selesai hydrate dan JS sempat jalan. Preload
       * di <head> membuat browser mulai mengunduh gambar ini SAAT PERTAMA
       * KALI HTML di-parse, tanpa menunggu JavaScript sama sekali -- inilah
       * yang paling menentukan untuk LCP di jaringan lambat (mobile).
       */}
      <link
        rel="preload"
        as="image"
        href="/assets/images/jadwal-imunisasi-idai-2024.jpg"
        fetchPriority="high"
      />
      <ImunisasiPanel />
    </>
  );
}
