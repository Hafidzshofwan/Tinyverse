import { PuyerTool } from "@/features/puyer-tool";
import type { CSSProperties } from "react";

/**
 * Widget: membungkus island Racik Puyer.
 * Island sudah membawa judul/tata letaknya sendiri (port v17), jadi tanpa ToolShell.
 */
const wrap: CSSProperties = { maxWidth: 1060, margin: "0 auto", width: "100%" };

export function PuyerPanel() {
  return (
    <div style={wrap}>
      <PuyerTool />
    </div>
  );
}
