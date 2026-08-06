import { redirect } from "next/navigation";

/**
 * Rute lama TPN Neonatus. Alatnya kini menjadi tab di menu Tool Neonatus.
 * Pengalih dipertahankan supaya tautan lama, riwayat peramban, dan indeks
 * pencarian global tidak mati.
 */
export default function TpnNeonatusPreviewPage() {
  redirect("/preview/neonatus?tab=tpn");
}
