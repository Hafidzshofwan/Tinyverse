import { redirect } from "next/navigation";

/**
 * Rute lama Racik Puyer. Alatnya kini menjadi tab di menu Obat & Racik Puyer.
 */
export default function PuyerPreviewPage() {
  redirect("/preview/obat?tab=puyer");
}
