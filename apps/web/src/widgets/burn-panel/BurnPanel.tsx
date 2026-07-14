import type { CSSProperties } from "react";
import { BurnForm } from "@/features/burn-calculator";

const wrapStyle: CSSProperties = { maxWidth: 620 };

export function BurnPanel() {
  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <BurnForm />
      </section>
    </div>
  );
}
