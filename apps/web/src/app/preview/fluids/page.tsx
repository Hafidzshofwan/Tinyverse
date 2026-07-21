import { ToolShell } from "@/shared/ui/ToolShell";
import { FluidsPanel } from "@/widgets/fluids-panel";

export const metadata = { title: "Terapi Cairan | Tinyverse" };

export default function FluidsPage() {
  return (
    <ToolShell
      title="Terapi Cairan"
      desc="Rumatan, rehidrasi WHO (Rencana A/B/C), faktor tetes, & rehidrasi luka bakar."
      icon="💧"
    >
      <FluidsPanel />
    </ToolShell>
  );
}
