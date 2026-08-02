# Online Science Tools

Free educational calculators and study guides for chemistry, mathematics, physics, and computing — [onlinesciencetools.com](https://onlinesciencetools.com).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + Lucide icons
- Client-side science tools (stoichiometry, equilibrium, phase portraits, graphing, and more)
- Academic guides + practice problems with FAQ schema

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to GitHub → Vercel imports the repo (Next.js defaults).

Optional env vars:

| Env | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://onlinesciencetools.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address on `/contact` |

## Key routes

- `/tools/stoichiometrycalculator` — molar mass & mole conversions
- `/tools/equilibriumcalculator` — Kc / Kp ICE solver
- `/tools/phaseportrait` — ODE phase portraits
- `/guides/physicsgre` — Physics GRE study guide
- `/guides/electricfield` — electric field guide + visualizer
