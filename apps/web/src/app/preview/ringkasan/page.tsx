import { ToolShell } from "@/shared/ui/ToolShell";
import { RingkasanPanel } from "@/widgets/ringkasan-panel";

export const metadata = {
  title: "Ringkasan Klinis | Tinyverse",
};

export default function RingkasanPage() {
  return (
    <ToolShell
      title="Ringkasan Klinis"
      desc="Kumpulkan poin klinis dari berbagai alat menjadi satu catatan rapi — siap disalin, di-export, atau dicetak."
      icon="📄"
    >
      <RingkasanPanel />
    </ToolShell>
  );
}
