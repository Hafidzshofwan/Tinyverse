import { GrowthTool } from "@/features/growth-chart";
import type { CSSProperties } from "react";

/**
 * Widget: membungkus island Tumbuh Kembang (WHO & CDC).
 * Island sudah membawa judul/tata letaknya sendiri (port v17), jadi tanpa ToolShell.
 */
const wrap: CSSProperties = { maxWidth: 1080, margin: "0 auto", width: "100%" };

export function GrowthPanel() {
  return (
    <div style={wrap}>
      <GrowthTool />
    </div>
  );
}
