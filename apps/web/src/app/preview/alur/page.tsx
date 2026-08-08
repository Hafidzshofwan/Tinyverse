import { ToolShell } from "@/shared/ui/ToolShell";
import { SidebarIcon } from "@/shared/ui";
import { AlurTatalaksanaPanel } from "@/widgets/alur-panel";

export const metadata = {
  title: "Alur Tata Laksana",
};

export default function AlurPage() {
  return (
    <ToolShell
      title="Alur Tata Laksana"
      desc="Panduan interaktif tata laksana kegawatdaruratan anak"
      icon={<SidebarIcon slug="alur" size={32} />}
    >
      <AlurTatalaksanaPanel />
    </ToolShell>
  );
}
