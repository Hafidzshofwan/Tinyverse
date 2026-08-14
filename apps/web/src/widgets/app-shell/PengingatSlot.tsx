import { hitungPengingat } from "@/features/pengingat-langganan";
import { SpandukLangganan } from "@/features/pengingat-langganan";
import { statusAksesSaatIni } from "@/server/entitlementServer";
import { SectionErrorBoundary } from "@/shared/ui";

/**
 * Pindahan dari app/layout.tsx.
 *
 * WHY dipisah jadi komponen sendiri: sebelumnya RootLayout melakukan
 * `await ambilPengingat()` LANGSUNG di badan fungsinya. Karena RootLayout
 * membungkus SEMUA halaman, itu berarti Next.js tidak bisa mulai mengirim
 * SATU BYTE HTML pun -- termasuk untuk halaman publik seperti /langganan --
 * sampai pembacaan cookie sesi + query Firestore ini selesai. Ini memaksa
 * SELURUH situs jadi render dinamis penuh dan menambah jeda di depan setiap
 * halaman, persis pola yang terlihat di Speed Insights (FCP/LCP buruk merata,
 * bukan cuma di satu rute).
 *
 * Dengan dipanggil di sini dan dibungkus <Suspense> oleh pemanggilnya,
 * Next.js bisa langsung mengirim (streaming) kerangka halaman + konten utama
 * lebih dulu, dan banner ini menyusul begitu datanya siap -- alih-alih
 * seluruh halaman menunggu banner kecil ini kelar dihitung.
 */
export async function PengingatSlot() {
  let pengingat = null;
  try {
    const status = await statusAksesSaatIni();
    if (status.masuk) {
      pengingat = hitungPengingat(
        {
          status: status.entitlement.status,
          berakhirPada: status.entitlement.berakhirPada,
          percobaan: status.percobaan,
        },
        new Date().toISOString(),
      );
    }
  } catch {
    pengingat = null;
  }

  if (!pengingat) return null;
  return (
    <SectionErrorBoundary label="Pengingat langganan" variant="silent">
      <SpandukLangganan pengingat={pengingat} />
    </SectionErrorBoundary>
  );
}
