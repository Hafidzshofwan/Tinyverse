"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Pencarian global (command palette).
 * Mencari di: nama menu + kata kunci/alias + teks di dalam tiap alat.
 * Sumber data: /search-index.json (dihasilkan scripts/build-search-index.mjs).
 * Hasil tampil sebagai dropdown yang bisa diklik langsung menuju alat.
 */

interface SearchEntry {
  type: "menu" | "content";
  slug: string;
  label: string;
  icon: string;
  href: string;
  text: string;
  keywords?: string;
  anchor?: string;
}

const TYPE_LABEL: Record<SearchEntry["type"], string> = {
  menu: "Menu",
  content: "Isi",
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Muat indeks sekali (dari file statis di /public).
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const list: SearchEntry[] = Array.isArray(d) ? d : d.entries || [];
        setEntries(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Tutup dropdown saat klik di luar.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [] as SearchEntry[];
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored: Array<{ e: SearchEntry; score: number }> = [];
    for (const e of entries) {
      const label = e.label.toLowerCase();
      const kw = (e.keywords || "").toLowerCase();
      const text = e.text.toLowerCase();
      const hay = label + " " + kw + " " + text;
      if (!tokens.every((t) => hay.includes(t))) continue;

      let score = 0;
      if (label.startsWith(q)) score += 100;
      else if (label.includes(q)) score += 60;
      if (e.type === "menu") score += 45;
      if (kw && tokens.every((t) => kw.includes(t))) score += 25;
      if (text.includes(q)) score += 12;
      score -= Math.min(20, Math.floor(e.text.length / 18)); // utamakan yang ringkas
      scored.push({ e, score });
    }
    scored.sort((a, b) => b.score - a.score);

    // Batasi maksimal 3 hasil per alat, total 10.
    const perTool: Record<string, number> = {};
    const out: SearchEntry[] = [];
    for (const { e } of scored) {
      const n = perTool[e.slug] || 0;
      if (n >= 3) continue;
      perTool[e.slug] = n + 1;
      out.push(e);
      if (out.length >= 10) break;
    }
    return out;
  }, [query, entries]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(e: SearchEntry) {
    setOpen(false);
    setQuery("");
    const url = e.anchor
      ? e.href + "#tk=" + encodeURIComponent(e.anchor)
      : e.href;
    router.push(url);
  }

  function onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (ev.key === "Enter") {
      const r = results[active];
      if (r) {
        ev.preventDefault();
        go(r);
      }
    }
  }

  const showPanel = open && query.trim().length >= 2;

  return (
    <div className="tv-search" ref={boxRef}>
      <span className="tv-search-ico" aria-hidden>
        {"\uD83D\uDD0D"}
      </span>
      <input
        type="search"
        placeholder="Cari alat, fitur, atau kata kunci..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="Pencarian global"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="tv-search-list"
        autoComplete="off"
      />
      {showPanel && (
        <div className="tv-search-results" id="tv-search-list" role="listbox">
          {results.length === 0 ? (
            <div className="tv-search-empty">
              {"Tidak ada hasil untuk \u201C"}
              {query.trim()}
              {"\u201D."}
            </div>
          ) : (
            results.map((r, i) => {
              const showSnippet =
                r.type !== "menu" &&
                r.text &&
                r.text.toLowerCase() !== r.label.toLowerCase();
              return (
                <button
                  type="button"
                  key={r.type + "-" + r.slug + "-" + i}
                  className={"tv-search-item" + (i === active ? " aktif" : "")}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  <span className="tv-search-item-ico" aria-hidden>
                    {r.icon}
                  </span>
                  <span className="tv-search-item-body">
                    <span className="tv-search-item-top">
                      <span className="tv-search-item-tool">{r.label}</span>
                      <span className="tv-search-item-type">
                        {TYPE_LABEL[r.type]}
                      </span>
                    </span>
                    {showSnippet && (
                      <span className="tv-search-item-snip">{r.text}</span>
                    )}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
