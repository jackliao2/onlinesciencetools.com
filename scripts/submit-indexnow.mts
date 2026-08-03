import { SITE_URL, legalPages } from "../src/lib/site";
import { guides, tools } from "../src/lib/tools";

const INDEXNOW_KEY = "fe2855564616464495bdae2ff070b0de";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function collectUrls(origin: string): string[] {
  const base = origin.replace(/\/$/, "");
  return [
    base,
    ...tools.map((tool) => `${base}${tool.href}`),
    ...guides.map((guide) => `${base}${guide.href}`),
    ...legalPages.map((page) => `${base}${page.href}`),
  ];
}

async function main() {
  const host = new URL(SITE_URL).host;
  const keyLocation = `${SITE_URL.replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`;
  const urlList = collectUrls(SITE_URL);

  // Confirm the key file is publicly reachable before submitting.
  const keyCheck = await fetch(keyLocation, {
    headers: { "user-agent": "OnlineScienceTools-IndexNow/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  const keyBody = (await keyCheck.text()).trim();
  if (!keyCheck.ok || keyBody !== INDEXNOW_KEY) {
    throw new Error(
      `IndexNow key file not ready at ${keyLocation} (HTTP ${keyCheck.status}, body=${JSON.stringify(keyBody.slice(0, 80))}). Deploy first, then re-run.`,
    );
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };

  console.log(`Submitting ${urlList.length} URLs for ${host} via IndexNow…`);

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "user-agent": "OnlineScienceTools-IndexNow/1.0",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });

  const text = await res.text();
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (text) console.log(text);

  // 200 = OK, 202 = Accepted (Bing sometimes returns 202)
  if (res.status !== 200 && res.status !== 202) {
    process.exitCode = 1;
    return;
  }

  console.log("Sample URLs:");
  for (const url of urlList.slice(0, 8)) console.log(`  - ${url}`);
  if (urlList.length > 8) console.log(`  … +${urlList.length - 8} more`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
