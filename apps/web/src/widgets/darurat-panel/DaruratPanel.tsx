import type { CSSProperties } from "react";
import { DaruratTool } from "@/features/emergency-mode";

const wrap: CSSProperties = { maxWidth: 980, margin: "0 auto" };

export function DaruratPanel() {
  return (
    <div style={wrap}>
      <DaruratTool />
    </div>
  );
}
