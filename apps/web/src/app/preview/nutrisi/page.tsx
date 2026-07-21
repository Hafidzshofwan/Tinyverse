import { ToolShell } from "@/shared/ui/ToolShell";
import { NutritionPanel } from "@/widgets/nutrition-panel";

export const metadata = { title: "Kalkulator Nutrisi | Tinyverse" };

export default function NutrisiPreviewPage() {
  return (
    <ToolShell
      title="Kalkulator Nutrisi"
      desc="Kebutuhan kalori & protein (Holliday–Segar/RDA) dan takaran susu formula."
      icon="🍼"
    >
      <NutritionPanel />
    </ToolShell>
  );
}
