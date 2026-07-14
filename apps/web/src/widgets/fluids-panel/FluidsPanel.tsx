import type { CSSProperties } from "react";
import { CairanTool } from "@/features/fluid-therapy";

const wrap: CSSProperties = { maxWidth: 980, margin: "0 auto" };

/**
 * Widget: panel Terapi Cairan (memuat island v17 lengkap: rumatan, rehidrasi WHO,
 * rehidrasi luka bakar dengan peta tubuh interaktif, dan faktor tetes).
 */
export function FluidsPanel() {
  return (
    <div style={wrap}>
      <CairanTool />
    </div>
  );
}
