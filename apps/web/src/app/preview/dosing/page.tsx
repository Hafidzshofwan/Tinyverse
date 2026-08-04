import { redirect } from "next/navigation";

/**
 * Rute lama Dosis Obat. Alatnya kini menjadi tab di menu Obat & Racik Puyer.
 * Pengalih dipertahankan supaya tautan lama, riwayat peramban, dan indeks
 * pencarian global tidak mati.
 */
export default function DosingPreviewPage() {
  redirect("/preview/obat?tab=dosis");
}
