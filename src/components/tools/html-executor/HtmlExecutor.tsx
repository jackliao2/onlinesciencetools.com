"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { Code2, FileCode2, Play, RotateCcw, Upload } from "lucide-react";
import {
  assertHtmlFileSize,
  looksLikeFullHtmlDocument,
  parseHtmlFile,
} from "@/lib/html-executor/parse-html-file";

const DEFAULT_HTML = `<div class="card">
  <h1>Hello, world!</h1>
  <p>Edit HTML, CSS, and JS, then click Run.</p>
  <button id="btn">Click me</button>
</div>`;

const DEFAULT_CSS = `.card {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #eef2ff, #fdf2f8);
  max-width: 420px;
  margin: 2rem auto;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

h1 {
  margin: 0 0 0.5rem;
  color: #1e293b;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: #2563eb;
  color: white;
  cursor: pointer;
}`;

const DEFAULT_JS = `document.getElementById('btn')?.addEventListener('click', () => {
  alert('Sandbox JS is running!');
});`;

function buildSrcDoc(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
}

export function HtmlExecutor() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [previewKey, setPreviewKey] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const srcDoc = useMemo(() => buildSrcDoc(html, css, js), [html, css, js]);

  const run = useCallback(() => {
    setPreviewKey((k) => k + 1);
  }, []);

  const applyParsed = useCallback(
    (source: string, label: string) => {
      const parsed = parseHtmlFile(source);
      setHtml(parsed.html);
      setCss(parsed.css);
      setJs(parsed.js);
      setFileName(label);
      setError(null);
      const parts = [
        parsed.css ? "CSS" : null,
        parsed.js ? "JS" : null,
      ].filter(Boolean);
      setStatus(
        parts.length
          ? `Loaded ${label} — ${parts.join(" and ")} moved to their panels.`
          : `Loaded ${label} into the HTML panel.`,
      );
      setPreviewKey((k) => k + 1);
    },
    [],
  );

  const loadFile = useCallback(
    async (file: File) => {
      const name = file.name || "file.html";
      if (!/\.html?$/i.test(name) && file.type !== "text/html") {
        setError("Open an .html or .htm file.");
        return;
      }
      try {
        assertHtmlFileSize(file.size);
        const text = await file.text();
        applyParsed(text, name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not read that file.");
      }
    },
    [applyParsed],
  );

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void loadFile(file);
  };

  const splitDocument = () => {
    if (!looksLikeFullHtmlDocument(html) && !/<style\b|<script\b/i.test(html)) {
      setError("Paste a full HTML document (or use Open HTML file) first.");
      return;
    }
    applyParsed(html, fileName ?? "pasted document");
  };

  const reset = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setFileName(null);
    setStatus(null);
    setError(null);
    setPreviewKey((k) => k + 1);
  };

  return (
    <div
      className={`rounded-3xl border bg-[var(--surface)] p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:p-8 ${
        dragging
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]"
          : "border-[var(--border)]"
      }`}
      onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) void loadFile(file);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Code2 className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.14em]">
            Run HTML, CSS & JS in the browser
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,text/html"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <Upload className="h-3.5 w-3.5" />
            Open HTML file
          </button>
          <button
            type="button"
            onClick={splitDocument}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <FileCode2 className="h-3.5 w-3.5" />
            Split document
          </button>
          <button
            type="button"
            onClick={run}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {status ? (
        <p className="mt-3 text-xs text-[var(--muted)]">{status}</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <EditorPane label="HTML" value={html} onChange={setHtml} />
        <EditorPane label="CSS" value={css} onChange={setCss} />
        <EditorPane
          label="JavaScript"
          value={js}
          onChange={setJs}
          className="lg:col-span-2"
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
          Preview
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          <iframe
            key={previewKey}
            title="HTML preview"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="h-[420px] w-full bg-white"
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          HTML file executor: open a local .html file or drop it on this panel.
          Inline &lt;style&gt; and &lt;script&gt; split into CSS/JS. Preview runs
          in a sandboxed iframe (scripts allowed; no same-origin access).
        </p>
      </div>
    </div>
  );
}

function EditorPane({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={10}
        className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono text-sm leading-relaxed outline-none ring-[var(--accent)] focus:ring-2"
      />
    </label>
  );
}
