import type { CSSProperties } from "react";
import { ToolShell } from "@/shared/ui/ToolShell";

export interface ComingSoonProps {
  title: string;
  desc: string;
  ringkasan: string;
  fitur: ReadonlyArray<string>;
  catatan?: string;
}

const noteStyle: CSSProperties = {
  margin: 0,
  color: "var(--tv-soft-teks)",
  lineHeight: 1.55,
};

/**
 * Placeholder terstruktur untuk menu yang sudah ada di navigasi tetapi
 * halamannya belum dibangun. Hanya presentasi, tanpa logika klinis.
 */
export function ComingSoon({ title, desc, ringkasan, fitur, catatan }: ComingSoonProps) {
  return (
    <ToolShell title={title} desc={desc}>
      <div className="tv-soon-grid">
        <section className="tv-card tv-stack">
          <span className="tv-soon-tag">
            <span aria-hidden>{"\uD83D\uDEA7"}</span> Sedang Disusun
          </span>
          <p style={noteStyle}>{ringkasan}</p>
        </section>
        <section className="tv-card tv-stack">
          <h2 className="tv-soon-h">Rencana Fitur</h2>
          <ul className="tv-soon-list">
            {fitur.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {catatan ? <p className="tv-soon-note">{catatan}</p> : null}
        </section>
      </div>
    </ToolShell>
  );
}
