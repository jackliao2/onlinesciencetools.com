import { guides, tools, type Guide, type Tool } from "@/lib/tools";

export type SearchItem =
  | (Tool & { kind: "tool" })
  | (Guide & { kind: "guide"; category?: never });

export function getSearchIndex(): SearchItem[] {
  return [
    ...tools.map((tool) => ({ ...tool, kind: "tool" as const })),
    ...guides.map((guide) => ({ ...guide, kind: "guide" as const })),
  ];
}

export function filterSearchItems(
  query: string,
  items: SearchItem[] = getSearchIndex(),
): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  const tokens = q.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.shortTitle,
      item.description,
      item.href,
      ...item.keywords,
      item.kind === "tool" ? item.category : "guide",
    ]
      .join(" ")
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });
}
