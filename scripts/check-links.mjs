import fs from "fs";
import path from "path";

const roots = [
  "src/lib/tool-articles/references.ts",
  "src/app/about/page.tsx",
];

const text = roots
  .map((f) => fs.readFileSync(path.join(process.cwd(), f), "utf8"))
  .join("\n");

const urls = [
  ...new Set(
    [...text.matchAll(/https?:\/\/[^"'\\\s]+/g)].map((m) => m[0]),
  ),
].filter((u) => !u.includes("schema.org"));

async function check(u) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    accept: "text/html,application/xhtml+xml",
  };
  try {
    // Prefer GET: many academic hosts reject or mishandle HEAD.
    const res = await fetch(u, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers,
    });
    clearTimeout(timer);
    return { u, status: res.status, ok: res.ok, final: res.url };
  } catch (e) {
    clearTimeout(timer);
    return { u, status: 0, ok: false, error: String(e.message || e) };
  }
}

const results = [];
for (const u of urls) {
  const r = await check(u);
  results.push(r);
  console.log(
    `${r.ok ? "OK " : "BAD"} ${String(r.status).padStart(3)} ${u}${
      r.error ? " :: " + r.error : ""
    }${r.final && r.final !== u ? " -> " + r.final : ""}`,
  );
}

const bad = results.filter((r) => !r.ok);
fs.writeFileSync(
  "scripts/_url-results.json",
  JSON.stringify({ checked: results.length, bad, results }, null, 2),
);
console.log(`\nChecked ${results.length}; bad ${bad.length}`);
