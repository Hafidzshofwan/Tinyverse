import { redirect } from "next/navigation";

/**
 * Rute lama Bilirubin Neonatus. Alatnya kini menjadi tab di menu Tool Neonatus.
 */
export default function BilirubinPreviewPage() {
  redirect("/preview/neonatus?tab=bilirubin");
}
