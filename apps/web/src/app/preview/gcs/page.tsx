import { ToolShell } from "@/shared/ui/ToolShell";
import { GcsPanel } from "@/widgets/gcs-panel";

export const metadata = {
  title: "Preview - Penilaian pGCS | Tinyverse",
};

export default function GcsPreviewPage() {
  return (
    <ToolShell
      title="Penilaian pGCS"
      desc="Pediatric Glasgow Coma Scale. Isi usia (opsi menyesuaikan kelompok usia, bisa diubah manual), lalu pilih respon Eye, Verbal, dan Motor. Total skor 3-15."
    >
      <GcsPanel />
    </ToolShell>
  );
}
