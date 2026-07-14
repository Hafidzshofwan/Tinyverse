import { DosisTool } from "@/features/dosing-tool";
import type { CSSProperties } from "react";

/**
 * Widget: membungkus island Kalkulator Dosis Obat.
 * Island sudah membawa judul/tata letaknya sendiri (port v17), jadi tanpa ToolShell.
 */
const wrap: CSSProperties = { maxWidth: 1100, margin: "0 auto", width: "100%" };

export function DosingPanel() {
  return (
    <div style={wrap}>
      <DosisTool />
    </div>
  );
}
