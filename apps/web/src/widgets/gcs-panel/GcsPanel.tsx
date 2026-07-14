import type { CSSProperties } from "react";
import { GcsForm } from "@/features/gcs-calculator";

const wrapStyle: CSSProperties = { maxWidth: 560 };

export function GcsPanel() {
  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <GcsForm />
      </section>
    </div>
  );
}
