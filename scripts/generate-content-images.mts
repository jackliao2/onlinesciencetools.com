/**
 * Generate SEO content hero images via Volcengine Ark Seedream.
 *
 * Usage:
 *   npx --yes tsx scripts/generate-content-images.mts
 *   npx --yes tsx scripts/generate-content-images.mts --force
 *   npx --yes tsx scripts/generate-content-images.mts --only=ph-hero
 *
 * Requires ARK_API_KEY and ARK_IMAGE_ENDPOINT in .env.local
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images", "content");

const STYLE =
  "Clean educational editorial photograph-illustration hybrid, soft natural lighting, muted teal and slate palette, no purple neon glow, no watermark, no logos, no readable text, no UI chrome, no captions, high detail, 16:9 composition.";

export interface ContentImageSpec {
  id: string;
  file: string;
  alt: string;
  width: number;
  height: number;
  prompt: string;
}

export const CONTENT_IMAGES: ContentImageSpec[] = [
  {
    id: "physicsgre-hero",
    file: "physicsgre-hero.webp",
    alt: "Physics GRE study notes, formulas, and practice sheets on a wooden desk",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Top-down view of a graduate physics study desk: open notebook with faint non-legible formula sketches, mechanical pencil, graph paper, and a quiet academic mood.`,
  },
  {
    id: "electricfield-hero",
    file: "electricfield-hero.webp",
    alt: "Electric field lines radiating between positive and negative point charges",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Scientific visualization of electric field lines around a positive and a negative point charge on a dark slate background, elegant glowing cyan curves, textbook-quality physics diagram without labels.`,
  },
  {
    id: "equilibrium-hero",
    file: "equilibrium-hero.webp",
    alt: "Two connected flasks suggesting dynamic chemical equilibrium",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Chemistry lab concept of reversible equilibrium: two clear glass flasks with pale blue and amber solutions linked by a glass bridge, shallow depth of field, calm scientific atmosphere.`,
  },
  {
    id: "ph-hero",
    file: "ph-hero.webp",
    alt: "Acid–base lab glassware with subtle color gradient suggesting a pH scale",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Row of small beakers with transparent liquids shifting from warm amber to cool teal, suggesting acid to base without printed numbers, laboratory bench, soft window light.`,
  },
  {
    id: "balanceequation-hero",
    file: "balanceequation-hero.webp",
    alt: "Molecular models on a balance scale representing a balanced chemical equation",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Vintage brass balance scale with colorful ball-and-stick molecular models on each pan in equilibrium, educational chemistry still life, no readable formulas.`,
  },
  {
    id: "stoichiometry-hero",
    file: "stoichiometry-hero.webp",
    alt: "Analytical balance and powder sample for stoichiometric mass calculations",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Modern analytical balance with a small dish of white powder, volumetric flask nearby, stoichiometry and mole-concept laboratory scene, clean and precise.`,
  },
  {
    id: "buffer-hero",
    file: "buffer-hero.webp",
    alt: "Preparing a buffer solution with pipette and volumetric flask",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Hands of a scientist pipetting clear liquid into a volumetric flask on a lab bench, buffer preparation mood, gloves optional, no readable labels on bottles.`,
  },
  {
    id: "redox-hero",
    file: "redox-hero.webp",
    alt: "Oxidation–reduction concept with contrasting metal and solution half-cells",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Abstract redox electrochemistry still life: copper strip in blue solution beside zinc in clear solution, subtle electron-path light streaks, scientific and restrained.`,
  },
  {
    id: "phaseportrait-hero",
    file: "phaseportrait-hero.webp",
    alt: "Phase portrait curves of a dynamical system on a coordinate plane",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Elegant phase portrait of a dynamical system: smooth trajectory curves flowing around a saddle or spiral on a muted grid, mathematics visualization, no axis numbers.`,
  },
  {
    id: "graphing-hero",
    file: "graphing-hero.webp",
    alt: "Smooth function graphs plotted on a coordinate plane",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Clean 2D graphing calculator aesthetic: smooth teal and amber curves on a soft coordinate grid, mathematical function plotting, no tick labels or equation text.`,
  },
  {
    id: "home-science-tools",
    file: "home-science-tools.webp",
    alt: "Laptop showing science calculators beside lab glassware and a notebook",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Laptop on a desk showing a blurred educational calculator interface (no readable text), surrounded by a flask, notebook, and pencil, Online Science Tools atmosphere.`,
  },
  {
    id: "dilution-hero",
    file: "dilution-hero.webp",
    alt: "Volumetric flask and pipette used for solution dilution",
    width: 1600,
    height: 900,
    prompt: `${STYLE} Classic dilution lab setup: volumetric flask half-filled with pale teal solution, glass pipette above, serial dilution concept, bright clean bench.`,
  },
];

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(spec: ContentImageSpec, force: boolean) {
  const outPath = path.join(outDir, spec.file);
  if (!force && (await exists(outPath))) {
    console.log(`SKIP ${spec.id} (exists)`);
    return;
  }

  const apiKey = process.env.ARK_API_KEY?.trim();
  const endpoint = process.env.ARK_IMAGE_ENDPOINT?.trim();
  const baseUrl = (
    process.env.ARK_IMAGE_BASE_URL?.trim() ||
    "https://ark.cn-beijing.volces.com/api/v3"
  ).replace(/\/$/, "");

  if (!apiKey || !endpoint) {
    throw new Error("Missing ARK_API_KEY or ARK_IMAGE_ENDPOINT in .env.local");
  }

  console.log(`GEN  ${spec.id}…`);
  const res = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: endpoint,
      prompt: spec.prompt,
      // Seedream 5.x requires ≥ 3,686,400 pixels; 2560x1440 = 3,686,400.
      size: "2560x1440",
      response_format: "url",
      watermark: false,
      stream: false,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Ark API ${res.status} for ${spec.id}: ${raw.slice(0, 500)}`);
  }

  const json = JSON.parse(raw) as {
    data?: Array<{ url?: string; b64_json?: string }>;
  };
  const item = json.data?.[0];
  if (!item) throw new Error(`No image data for ${spec.id}`);

  let input: Buffer;
  if (item.b64_json) {
    input = Buffer.from(item.b64_json, "base64");
  } else if (item.url) {
    const imgRes = await fetch(item.url);
    if (!imgRes.ok) throw new Error(`Download failed for ${spec.id}: ${imgRes.status}`);
    input = Buffer.from(await imgRes.arrayBuffer());
  } else {
    throw new Error(`Neither url nor b64_json for ${spec.id}`);
  }

  const webp = await sharp(input)
    .resize(spec.width, spec.height, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toBuffer();

  await writeFile(outPath, webp);
  console.log(`OK   ${spec.id} → ${path.relative(root, outPath)} (${webp.length} bytes)`);
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const only = onlyArg?.slice("--only=".length);

  await mkdir(outDir, { recursive: true });

  const list = only
    ? CONTENT_IMAGES.filter((s) => s.id === only || s.file === only)
    : CONTENT_IMAGES;

  if (list.length === 0) {
    throw new Error(`No matching image for --only=${only}`);
  }

  for (const spec of list) {
    await generateOne(spec, force);
  }

  console.log(`\nDone. ${list.length} image(s) processed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
