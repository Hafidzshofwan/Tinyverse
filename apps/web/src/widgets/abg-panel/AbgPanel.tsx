import type { CSSProperties } from "react";
import { AbgForm } from "@/features/abg-analyzer";

const wrapStyle: CSSProperties = { maxWidth: 780 };

export function AbgPanel() {
  return (
    <div style={wrapStyle}>
      <section className="tv-card tv-stack">
        <AbgForm />
      </section>
    </div>
  );
}
