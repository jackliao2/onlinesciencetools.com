import type { ToolArticleContent } from "./types";
import { chemistryArticles } from "./chemistry";
import { mathArticles } from "./math";
import { computingArticles } from "./computing";

const all = [...chemistryArticles, ...mathArticles, ...computingArticles];
const bySlug = Object.fromEntries(all.map((a) => [a.slug, a]));

export function getToolArticle(slug: string): ToolArticleContent | undefined {
  return bySlug[slug];
}
