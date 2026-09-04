"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { filterSearchItems, getSearchIndex, type SearchItem } from "@/lib/search";

type Variant = "header" | "hero";

export function SiteSearch({
  variant = "header",
  autoFocus = false,
}: {
  variant?: Variant;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const deferred = useDeferredValue(query);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const index = useMemo(() => getSearchIndex(), []);
  const results = useMemo(
    () => filterSearchItems(deferred, index).slice(0, 8),
    [deferred, index],
  );

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const showPanel = open && (query.trim().length > 0 || variant === "hero");

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${variant === "hero" ? "" : "lg:max-w-xs"}`}
    >
      <label className="relative block">
        <span className="sr-only">Search tools and guides</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          aria-hidden
        />
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={
            variant === "hero"
              ? 'Search tools… e.g. "Equation", "GRE", "Matrix"'
              : "Search tools…"
          }
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-9 text-sm text-[var(--foreground)] outline-none ring-[var(--accent)] transition placeholder:text-[var(--muted)] focus:ring-2 ${
            variant === "hero" ? "py-3.5 shadow-sm" : "py-2.5"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 max-h-[min(20rem,70vh)] w-full overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.55)]"
        >
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-[var(--muted)]">
              No tools or guides match “{query}”.
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((item) => (
                <SearchResultRow
                  key={`${item.kind}-${item.slug}`}
                  item={item}
                  onNavigate={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultRow({
  item,
  onNavigate,
}: {
  item: SearchItem;
  onNavigate: () => void;
}) {
  return (
    <li role="option" aria-selected={false}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="block rounded-xl px-3 py-2.5 transition hover:bg-[var(--surface-2)]"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {item.title}
          </p>
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            {item.kind === "tool" ? "Tool" : item.kind === "guide" ? "Guide" : "Index"}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">
          {item.description}
        </p>
      </Link>
    </li>
  );
}
