import type { CSSProperties } from "react";
import { LabTool } from "@/features/lab-interpretation";

const wrap: CSSProperties = { maxWidth: 980, margin: "0 auto" };

export function LabPanel() {
  return (
    <div style={wrap}>
      <LabTool />
    </div>
  );
}
