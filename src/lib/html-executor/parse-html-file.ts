export interface ParsedHtmlFile {
  html: string;
  css: string;
  js: string;
}

const MAX_HTML_FILE_BYTES = 512 * 1024;

export function assertHtmlFileSize(byteLength: number): void {
  if (byteLength > MAX_HTML_FILE_BYTES) {
    throw new Error("HTML file is larger than 512 KB.");
  }
}

/**
 * Split a pasted or uploaded .html document into body markup, CSS, and JS.
 * Inline <style> and <script> (no src) move to their panels; external script
 * tags stay in the HTML so CDN includes still work.
 */
export function parseHtmlFile(source: string): ParsedHtmlFile {
  const text = source.replace(/^\uFEFF/, "").trim();
  if (!text) {
    return { html: "", css: "", js: "" };
  }

  const styles: string[] = [];
  const scripts: string[] = [];

  let remaining = text.replace(
    /<style\b[^>]*>([\s\S]*?)<\/style>/gi,
    (_full, css: string) => {
      const trimmed = css.trim();
      if (trimmed) styles.push(trimmed);
      return "";
    },
  );

  remaining = remaining.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (full, attrs: string, js: string) => {
      if (/\bsrc\s*=/i.test(attrs)) {
        return full;
      }
      const trimmed = js.trim();
      if (trimmed) scripts.push(trimmed);
      return "";
    },
  );

  const bodyMatch = remaining.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  let html: string;
  if (bodyMatch) {
    html = bodyMatch[1].trim();
  } else {
    html = remaining
      .replace(/<!DOCTYPE[^>]*>/i, "")
      .replace(/<\/?html\b[^>]*>/gi, "")
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
      .trim();
  }

  return {
    html,
    css: styles.join("\n\n"),
    js: scripts.join("\n\n"),
  };
}

export function looksLikeFullHtmlDocument(source: string): boolean {
  return /<!DOCTYPE\s+html/i.test(source) || /<html\b/i.test(source);
}
