import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface PaletteItem {
  kind: string;
  title: string;
  href: string;
  excerpt: string;
  hay?: string;
  action?: () => void;
}

interface Props {
  items: PaletteItem[];
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("pt-theme", next);
  // Update the toggle button icons
  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) {
    const moon = btn.querySelector(".icon-moon") as HTMLElement;
    const sun = btn.querySelector(".icon-sun") as HTMLElement;
    if (moon) {
      moon.style.display = next === "dark" ? "none" : "";
    }
    if (sun) {
      sun.style.display = next === "dark" ? "" : "none";
    }
  }
}

export default function CommandPalette({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const closePalette = useCallback(() => {
    setClosing(true);
    setQ("");
    setIdx(0);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  const allItems = useMemo(() => {
    const themeItem: PaletteItem = {
      kind: "action",
      title: "Toggle theme",
      href: "",
      excerpt: "Switch between light and dark mode",
      hay: "theme dark light mode toggle",
      action: toggleTheme,
    };
    return [...items, themeItem];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      const pages = allItems.filter((it) => it.kind === "page");
      const posts = allItems.filter((it) => it.kind === "essay").slice(0, 4);
      const actions = allItems.filter((it) => it.kind === "action");
      return [...pages, ...posts, ...actions];
    }
    return allItems
      .filter((it) => it.title.toLowerCase().includes(query) || (it.hay && it.hay.includes(query)))
      .slice(0, 12);
  }, [q, allItems]);

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
        if (open) {
          closePalette();
        } else {
          setOpen(true);
        }
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
        closePalette();
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
          closePalette();
          if (it.action) {
            it.action();
          } else {
            window.location.href = it.href;
          }
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, idx, openPalette, closePalette]);

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
      }}
    >
      <div className={`palette-backdrop${closing ? " closing" : ""}`} onClick={closePalette} />
      <div
        className={`palette-panel${closing ? " closing" : ""}`}
        role="dialog"
        aria-label="Search"
      >
        <div className="palette-input-wrap">
          <span className="palette-kbd">{isMac ? "\u2318K" : "Ctrl+K"}</span>
          <input
            ref={inputRef}
            aria-label="Search essays, tags, pages"
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
          <button className="palette-close" onClick={closePalette} aria-label="Close">
            esc
          </button>
        </div>
        <div className="sr-only" aria-live="polite" role="status">
          {q.trim()
            ? filtered.length === 0
              ? `No results for ${q}`
              : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
            : ""}
        </div>
        <ul className="palette-results" role="listbox">
          {filtered.length === 0 ? (
            <li className="empty">No matches for &ldquo;{q}&rdquo;</li>
          ) : (
            filtered.map((it, i) => (
              <li
                key={it.href}
                role="option"
                aria-selected={i === idx}
                onClick={() => {
                  closePalette();
                  if (it.action) {
                    it.action();
                  } else {
                    window.location.href = it.href;
                  }
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
