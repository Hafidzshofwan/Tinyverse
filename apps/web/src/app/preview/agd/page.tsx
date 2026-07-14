import { ToolShell } from "@/shared/ui/ToolShell";
import { AbgPanel } from "@/widgets/abg-panel";

export const metadata = {
  title: "Preview - Analisis Gas Darah | Tinyverse",
};

export default function AgdPreviewPage() {
  return (
    <ToolShell
      title="Analisis Gas Darah (AGD)"
      desc="Interpretasi langkah demi langkah: status pH, gangguan primer, kompensasi, anion gap, dan oksigenasi. Korelasikan dengan klinis."
    >
      <AbgPanel />
    </ToolShell>
  );
}
