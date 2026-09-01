import { redirect } from "next/navigation";

// /preview/kasus dialihkan ke halaman Pembelajaran tab Kasus
export default function KasusPage() {
  redirect("/preview/pembelajaran#kasus");
}
