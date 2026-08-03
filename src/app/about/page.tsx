import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { JsonLd } from "@/components/tools/JsonLd";
import { buildStaticPageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
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
    "chemistry calculator",
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
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            email: CONTACT_EMAIL,
            description: page.description,
          },
        }}
      />

      <ContentPage
        eyebrow="About"
        title="About Online Science Tools"
        description="Browser-based calculators and short study guides for chemistry, mathematics, physics, and computing."
      >
        <h2>What this site is</h2>
        <p>
          Online Science Tools is a small educational website with interactive
          calculators and study notes. You can run stoichiometry and equilibrium
          problems, balance equations, graph functions, explore phase portraits,
          convert number bases, and read short guides — all in the browser, with
          no account required.
        </p>
        <p>
          The domain has hosted science-education tools for a long time. The
          current site is a maintained set of those tools (and new ones) with
          clearer interfaces, worked examples, and practice problems on each
          calculator page.
        </p>

        <h2>What you will find</h2>
        <ul>
          <li>
            <strong>{tools.length} tools</strong> across chemistry, mathematics,
            and computing.
          </li>
          <li>
            <strong>{guides.length} guides</strong>, including Physics GRE review
            material and an electric-field overview.
          </li>
          <li>
            <strong>Practice problems</strong> with step-by-step solutions on tool
            pages.
          </li>
          <li>
            <strong>Client-side calculation</strong> for most tools — inputs stay
            in your browser unless a page explicitly says otherwise.
          </li>
        </ul>

        <h2>How the tools are meant to be used</h2>
        <p>
          These pages are for learning and checking homework. They show
          intermediate structure when it helps (ICE tables, stoichiometric
          ratios, row operations), and they cite standard references such as{" "}
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
          , and open teaching materials. They are not a substitute for lab
          protocols, graded exams, or professional engineering review.
        </p>

        <h2>Contact</h2>
        <p>
          Bug reports, corrections, and classroom feedback are welcome on the{" "}
          <Link href="/contact">contact page</Link>. See also the{" "}
          <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Use</Link>.
        </p>
      </ContentPage>
    </>
  );
}
