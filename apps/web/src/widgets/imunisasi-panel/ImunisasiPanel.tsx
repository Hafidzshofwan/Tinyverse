import type { CSSProperties } from "react";
import { ImunisasiTool } from "@/features/imunisasi-tool";

const wrapStyle: CSSProperties = { maxWidth: 1080, margin: "0 auto", width: "100%" };

/**
 * Widget: memuat island Jadwal Imunisasi (IDAI 2024). Header hero dibawa dari dalam
 * island, jadi TIDAK memakai ToolShell/ComingSoon.
 */
export function ImunisasiPanel() {
  return (
    <div style={wrapStyle}>
      <ImunisasiTool />
    </div>
  );
}
