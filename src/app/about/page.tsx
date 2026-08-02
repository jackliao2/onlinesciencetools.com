import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { JsonLd } from "@/components/tools/JsonLd";
import { buildStaticPageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  SITE_FOUNDED_YEAR,
  SITE_NAME,
  SITE_URL,
  legalPages,
} from "@/lib/site";
import { guides, tools } from "@/lib/tools";

const page = legalPages.find((p) => p.slug === "about")!;

export const metadata: Metadata = buildStaticPageMetadata({
  ...page,
  keywords: [
    "about online science tools",
    "science calculators",
    "free chemistry calculator",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: page.title,
          url: `${SITE_URL}${page.href}`,
          description: page.description,
          mainEntity: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            foundingDate: String(SITE_FOUNDED_YEAR),
            email: CONTACT_EMAIL,
            description: page.description,
          },
        }}
      />

      <ContentPage
        eyebrow="About"
        title="About Online Science Tools"
        description="We build free, browser-based science calculators and study guides for students, teachers, and lifelong learners — clear enough for homework tonight, solid enough for classroom demos."
        badge={
          <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            Teaching since {SITE_FOUNDED_YEAR}
          </span>
        }
      >
        <h2>Who we are</h2>
        <p>
          Online Science Tools is an independent educational project focused on
          one job: making core science and math workflows easy to explore in a
          browser. Since {SITE_FOUNDED_YEAR}, we have helped learners work through
          stoichiometry, chemical equilibrium, graphing, differential-equation
          visualizations, and more — without accounts, paywalls, or software
          installs.
        </p>
        <p>
          The site is maintained by educators and engineers who care about
          accuracy, clarity, and speed. When a tool ships, it should feel like a
          quiet lab partner: precise inputs, readable outputs, and enough
          explanation to learn from the process — not just copy a number.
        </p>

        <h2>What you can do here</h2>
        <ul>
          <li>
            <strong>{tools.length} interactive tools</strong> for chemistry,
            mathematics, and everyday computing tasks.
          </li>
          <li>
            <strong>{guides.length} study guides</strong>, including Physics GRE
            prep and electric-field fundamentals.
          </li>
          <li>
            <strong>Worked practice problems</strong> on each tool page so you can
            check your reasoning against a full solution.
          </li>
          <li>
            <strong>Private-by-default calculations</strong> — most tools run in
            your browser, so your homework numbers stay on your device.
          </li>
        </ul>

        <h2>How we design tools</h2>
        <p>
          Every calculator starts from a classroom question: What do students
          actually type? Where do they get stuck? What should the result look
          like so the concept clicks? We keep interfaces simple, show units and
          intermediate structure when it helps, and pair each tool with short
          explanations plus practice problems.
        </p>
        <p>
          Scientific conventions follow standard teaching practice — for example,
          conventional atomic masses for molar-mass work, ICE tables for
          equilibrium, and established numerical methods for dynamical systems.
          Tools are for learning and teaching; they are not a substitute for lab
          protocols or professional engineering review.
        </p>

        <h2>Standards and references we align with</h2>
        <p>
          Our explanations and constants track widely used educational and
          standards sources, including{" "}
          <a
            href="https://ciaaw.org/atomic-weights.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            IUPAC CIAAW atomic weights
          </a>
          ,{" "}
          <a
            href="https://physics.nist.gov/cuu/Constants/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NIST CODATA constants
          </a>
          ,{" "}
          <a
            href="https://chem.libretexts.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LibreTexts Chemistry
          </a>
          , and university open courseware such as{" "}
          <a
            href="https://ocw.mit.edu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT OpenCourseWare
          </a>
          . Each tool page also lists topic-specific further reading so you can
          verify methods against primary references.
        </p>

        <h2>Who uses Online Science Tools</h2>
        <p>
          High-school and college students checking homework, tutors running
          quick demos, instructors projecting a phase portrait or molar-mass
          breakdown in class, and curious learners brushing up on fundamentals.
          If that sounds like you, you are exactly who we build for.
        </p>

        <h2>Stable pages you can bookmark</h2>
        <p>
          We keep tool URLs stable so syllabi, bookmarks, and shared links keep
          working year after year. Favorites include the{" "}
          <Link href="/tools/stoichiometrycalculator">
            Stoichiometry Calculator
          </Link>
          ,{" "}
          <Link href="/tools/equilibriumcalculator">
            Equilibrium Calculator
          </Link>
          , and{" "}
          <Link href="/tools/phaseportrait">Phase Portrait Generator</Link>.
        </p>

        <h2>Talk with us</h2>
        <p>
          Found a bug, want a classroom feature, or spotted a clearer way to
          explain a formula? We welcome feedback on the{" "}
          <Link href="/contact">contact page</Link>.
        </p>

        <p className="!mb-0">
          Also see our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </ContentPage>
    </>
  );
}
