import { ToolShell } from "@/shared/ui/ToolShell";
import { AlurTatalaksanaPanel } from "@/widgets/alur-panel";

export default function AlurPage() {
  return (
    <ToolShell
      title="Alur Tata Laksana"
      desc="Panduan interaktif tata laksana kegawatdaruratan anak"
      icon="🧭"
    >
      <AlurTatalaksanaPanel />
    </ToolShell>
  );
}
