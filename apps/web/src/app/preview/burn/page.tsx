import { ToolShell } from "@/shared/ui/ToolShell";
import { BurnPanel } from "@/widgets/burn-panel";

export const metadata = {
  title: "Preview - Rehidrasi Luka Bakar | TinyVerse",
};

export default function BurnPreviewPage() {
  return (
    <ToolShell
      title="Rehidrasi Luka Bakar"
      desc="Isi usia dan berat badan, lalu pilih area luka bakar derajat 2/3 (anterior/posterior). Memakai chart Lund-Browder dan rumus Parkland."
    >
      <BurnPanel />
    </ToolShell>
  );
}
