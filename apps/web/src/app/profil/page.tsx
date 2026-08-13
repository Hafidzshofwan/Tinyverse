import type { Metadata } from "next";
import { ProfilPage } from "@/widgets/user-account/ProfilPage";

/* Halaman personal, tidak perlu diindeks mesin pencari. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilPage />;
}
