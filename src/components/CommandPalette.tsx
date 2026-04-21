import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface PaletteItem {
  kind: string;
  title: string;
  href: string;
  excerpt: string;
  hay?: string;
}

interface Props {
  items: PaletteItem[];
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function CommandPalette({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items.slice(0, 9);
    return items
      .filter((it) => it.title.toLowerCase().includes(query) || (it.hay && it.hay.includes(query)))
      .slice(0, 12);
  }, [q, items]);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQ("");
    setIdx(0);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  // Wire up the [data-open-palette] button
  useEffect(() => {
    const btns = document.querySelectorAll("[data-open-palette]");
    const handler = () => openPalette();
    btns.forEach((b) => b.addEventListener("click", handler));
    return () => btns.forEach((b) => b.removeEventListener("click", handler));
  }, [openPalette]);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) {
        if (
          e.key === "/" &&
          !["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)
        ) {
          e.preventDefault();
          openPalette();
        }
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(filtered.length - 1, i + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const it = filtered[idx];
        if (it) {
          setOpen(false);
          window.location.href = it.href;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, idx, openPalette]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
      }}
    >
      <div className="palette-backdrop" onClick={() => setOpen(false)} />
      <div className="palette-panel" role="dialog" aria-label="Search">
        <div className="palette-input-wrap">
          <span className="palette-kbd">{isMac ? "\u2318K" : "Ctrl+K"}</span>
          <input
            ref={inputRef}
            placeholder="Search essays, tags, pages…"
            autoComplete="off"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            style={{
              flex: 1,
              border: 0,
              background: "transparent",
              outline: "none",
              font: "inherit",
              fontSize: "15px",
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          />
          <button className="palette-close" onClick={() => setOpen(false)} aria-label="Close">
            esc
          </button>
        </div>
        <ul className="palette-results">
          {filtered.length === 0 ? (
            <li className="empty">No matches for &ldquo;{q}&rdquo;</li>
          ) : (
            filtered.map((it, i) => (
              <li
                key={it.href}
                aria-selected={i === idx}
                onClick={() => {
                  setOpen(false);
                  window.location.href = it.href;
                }}
              >
                <span className="kind">{it.kind}</span>
                <span className="title">{it.title}</span>
                <span className="excerpt">{it.excerpt}</span>
              </li>
            ))
          )}
        </ul>
        <div className="palette-foot">
          <span>
            <kbd>&uarr;</kbd>
            <kbd>&darr;</kbd> navigate
          </span>
          <span>
            <kbd>&#8629;</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
