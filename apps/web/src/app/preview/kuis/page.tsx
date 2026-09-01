import { redirect } from "next/navigation";

// /preview/kuis dialihkan ke halaman Pembelajaran tab Uji Pemahaman
export default function KuisPage() {
  redirect("/preview/pembelajaran#kuis");
}
