import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/tools/JsonLd";
import { buildStaticPageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_URL,
  legalPages,
} from "@/lib/site";

const page = legalPages.find((p) => p.slug === "contact")!;

export const metadata: Metadata = buildStaticPageMetadata({
  ...page,
  keywords: [
    "contact online science tools",
    "science calculator support",
    "academic tool feedback",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: page.title,
          url: `${SITE_URL}${page.href}`,
          description: page.description,
          about: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            email: CONTACT_EMAIL,
          },
        }}
      />

      <ContentPage
        eyebrow="Support"
        title="Contact us"
        description="Questions about a calculator, classroom use, or a bug? Send a note — we read every message that reaches the inbox."
      >
        <h2>Email</h2>
        <p>
          Prefer writing directly? Reach us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. For the
          fastest response, include the tool URL, what you expected, and what you
          observed.
        </p>

        <h2>Send a message</h2>
        <p>
          This form opens your email client with a prefilled draft. Nothing is
          stored on our servers from this form submission.
        </p>
        <ContactForm />

        <h2>What we can help with</h2>
        <ul>
          <li>Incorrect results, UI bugs, or accessibility issues</li>
          <li>Ideas for classroom features or clearer explanations</li>
          <li>Questions about using tools in a course or tutoring session</li>
          <li>Partnership, media, or collaboration inquiries</li>
          <li>
            Privacy requests described in our{" "}
            <Link href="/privacy">Privacy Policy</Link>
          </li>
        </ul>

        <h2>Response expectations</h2>
        <p>
          Online Science Tools is an educational project operated with a small
          team. We aim to reply within several business days. Urgent safety or
          privacy matters are prioritized.
        </p>

        <h2>Before you write</h2>
        <p>
          Many how-to questions are already answered in each tool&apos;s guide
          section and practice problems. Start from the{" "}
          <Link href="/#tools">tool matrix</Link> or{" "}
          <Link href="/#guides">academic guides</Link>, then contact us if
          something still looks wrong.
        </p>

        <p className="!mb-0">
          Related: <Link href="/about">About</Link> ·{" "}
          <Link href="/terms">Terms of Use</Link>
        </p>
      </ContentPage>
    </>
  );
}
