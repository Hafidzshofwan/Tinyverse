import type { CSSProperties } from "react";
import { GuidelineTool } from "@/features/guideline-tool";

const wrapStyle: CSSProperties = { maxWidth: 1080, margin: "0 auto", width: "100%" };

/**
 * Widget: memuat island Guideline Anak (port v17). Header judul-section dibawa dari
 * dalam island, jadi TIDAK memakai ToolShell/ComingSoon.
 */
export function GuidelinePanel() {
  return (
    <div style={wrapStyle}>
      <GuidelineTool />
    </div>
  );
}
