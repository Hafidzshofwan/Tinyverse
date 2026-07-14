import type { CSSProperties } from "react";
import { NutritionTool } from "@/features/nutrition-tool";

const wrapStyle: CSSProperties = { maxWidth: 760, margin: "0 auto" };

/**
 * Widget: memuat island Kalkulator Nutrisi (port v17). Header "judul-section"
 * sudah dibawa dari dalam island, jadi TIDAK ada ToolShell/ToolHeader di sini.
 */
export function NutritionPanel() {
  return (
    <div style={wrapStyle}>
      <NutritionTool />
    </div>
  );
}
