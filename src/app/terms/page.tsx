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

const page = legalPages.find((p) => p.slug === "terms")!;
const lastUpdated = "August 2, 2026";

export const metadata: Metadata = buildStaticPageMetadata({
  ...page,
  keywords: [
    "online science tools terms of use",
    "terms of service",
    "educational calculator disclaimer",
  ],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          url: `${SITE_URL}${page.href}`,
          description: page.description,
          dateModified: "2026-08-02",
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
        }}
      />

      <ContentPage
        eyebrow="Legal"
        title="Terms of Use"
        description={`Last updated: ${lastUpdated}. By accessing Online Science Tools, you agree to these Terms of Use. If you do not agree, please do not use the site.`}
      >
        <h2>1. Acceptance of terms</h2>
        <p>
          These Terms of Use (“Terms”) govern access to and use of {SITE_NAME} at{" "}
          <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>, including
          calculators, guides, practice problems, and related content
          (collectively, the “Service”). By using the Service, you agree to these
          Terms and our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>2. Educational mission</h2>
        <p>
          The Service provides free educational tools and study materials for
          chemistry, mathematics, physics, and computing. Online Science Tools
          has offered educational resources online since {SITE_FOUNDED_YEAR}.
          Content is offered to support learning, teaching, and academic
          exploration.
        </p>

        <h2>3. License to use</h2>
        <p>
          We grant you a limited, non-exclusive, non-transferable, revocable
          license to access and use the Service for personal, educational, and
          non-commercial classroom purposes, subject to these Terms.
        </p>
        <p>You may:</p>
        <ul>
          <li>Use the calculators and guides for study and teaching</li>
          <li>Link to our pages with accurate attribution</li>
          <li>Cite tools or guides in academic work with a stable URL</li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>Scrape the site in a way that degrades service availability</li>
          <li>Mirror, resell, or rebrand the Service as your own product</li>
          <li>
            Remove copyright, attribution, or trademark notices from our materials
          </li>
          <li>
            Use the Service to develop or distribute malware, or to violate law
          </li>
          <li>
            Attempt to bypass security controls or abuse sandboxed code execution
          </li>
        </ul>

        <h2>4. No academic or professional warranty</h2>
        <p>
          Results, visualizations, and worked examples are provided for
          educational convenience. They may contain errors, rounding differences,
          or simplifications. You are solely responsible for verifying outputs
          before relying on them for graded assignments, laboratory decisions,
          publications, clinical contexts, engineering designs, or any
          high-stakes use.
        </p>
        <p>
          {SITE_NAME} is <strong>not</strong> an accredited school, testing
          agency, or professional engineering service. Physics GRE and similar
          guides are unofficial study aids and are not endorsed by ETS or other
          exam administrators unless explicitly stated.
        </p>

        <h2>5. User content and code sandbox</h2>
        <p>
          Some tools (such as the HTML / JS executor) allow you to enter content
          that runs in your browser. You retain responsibility for that content.
          Do not input unlawful material, secrets, or data you are not authorized
          to process. We may suspend access that threatens the Service or other
          users.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          The Service’s branding, UI, original text, and software implementation
          are protected by applicable intellectual property laws. Scientific
          formulas and standard mathematical identities remain in the public
          domain or are used under fair educational practice; our particular
          explanations, layouts, and code are not free for wholesale copying into
          competing commercial products.
        </p>

        <h2>7. Third-party links</h2>
        <p>
          The Service may reference third-party sites, papers, or tools. We are
          not responsible for third-party content or policies. When you link to
          our pages from a syllabus or article, please use the URLs shown in your
          browser’s address bar.
        </p>

        <h2>8. Availability and changes</h2>
        <p>
          We aim for high availability via modern static hosting, but we do not
          guarantee uninterrupted access. We may modify, suspend, or discontinue
          features at any time. We may also update these Terms; the “Last
          updated” date will change accordingly.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
          AND NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_NAME.toUpperCase()} AND
          ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS, DATA, GOODWILL, OR ACADEMIC OUTCOMES, ARISING FROM YOUR USE OF
          THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED USD $50.
        </p>

        <h2>11. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless {SITE_NAME} and its operators
          from claims arising out of your misuse of the Service, your content, or
          your violation of these Terms, to the extent permitted by law.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These Terms are governed by the laws applicable in the jurisdiction
          where the Service operators principally manage the project, without
          regard to conflict-of-law principles, except where mandatory consumer
          protections in your country provide otherwise.
        </p>

        <h2>13. Contact</h2>
        <p className="!mb-0">
          Questions about these Terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          <Link href="/contact">Contact page</Link> ·{" "}
          <Link href="/about">About</Link> ·{" "}
          <Link href="/privacy">Privacy Policy</Link>
        </p>
      </ContentPage>
    </>
  );
}
