// KuisPanel — widget wrapper untuk halaman /preview/kuis
// Tidak butuh "use client" di sini karena ModulGrid sudah client component.

import { ModulGrid } from "@/features/quiz";

export function KuisPanel() {
  return <ModulGrid />;
}
