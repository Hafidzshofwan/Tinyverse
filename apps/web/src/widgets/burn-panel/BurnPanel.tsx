import type { CSSProperties } from "react";
import { BurnMethodSwitch } from "@/features/burn-calculator";

const wrapStyle: CSSProperties = { maxWidth: 620 };

export function BurnPanel() {
  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <BurnMethodSwitch />
      </section>
    </div>
  );
}
