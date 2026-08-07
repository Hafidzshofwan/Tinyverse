import { ToolShell } from "@/shared/ui/ToolShell";
import { RingkasanPanel } from "@/widgets/ringkasan-panel";
import { SidebarIcon } from "@/shared/ui/SidebarIcon";

export const metadata = {
  title: "Ringkasan Klinis",
};

export default function RingkasanPage() {
  return (
    <ToolShell
      title="Ringkasan Klinis"
      desc="Kumpulkan poin klinis dari berbagai alat menjadi satu catatan rapi — siap disalin, di-export, atau dicetak."
      icon={<SidebarIcon slug="ringkasan" size={38} />}
    >
      <RingkasanPanel />
    </ToolShell>
  );
}
