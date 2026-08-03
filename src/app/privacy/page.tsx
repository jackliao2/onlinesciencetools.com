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

const page = legalPages.find((p) => p.slug === "privacy")!;
const lastUpdated = "August 2, 2026";

export const metadata: Metadata = buildStaticPageMetadata({
  ...page,
  keywords: [
    "online science tools privacy policy",
    "privacy",
    "educational website privacy",
  ],
});

export default function PrivacyPage() {
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
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}. This policy explains what information Online Science Tools processes, what we do not collect by default, and how to contact us about privacy.`}
      >
        <h2>1. Summary</h2>
        <p>
          {SITE_NAME} (“we”, “us”) provides educational calculators and
          guides at <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>.
          Most tool interactions run entirely in your browser. We do not require
          an account to use the site, and we do not sell personal information.
        </p>

        <h2>2. Information you provide voluntarily</h2>
        <p>
          If you email us or use the contact form (which opens your mail client),
          you may share your name, email address, and message content. We use that
          information only to respond to your inquiry and improve the service.
        </p>
        <p>
          Please avoid sending sensitive personal data (passwords, government IDs,
          health records, or student gradebooks) through email.
        </p>

        <h2>3. Information processed in your browser</h2>
        <p>
          Calculator inputs (chemical formulas, equations, graph expressions,
          color values, code snippets, and similar) are processed locally in your
          device’s browser for computation and rendering. Those values are not
          transmitted to our servers as part of the core calculation workflow.
        </p>
        <p>
          The HTML / JS executor runs user-provided code in a sandboxed iframe.
          You are responsible for what you paste into that sandbox; do not enter
          secrets or confidential data.
        </p>

        <h2>4. Automatically collected technical data</h2>
        <p>
          Like most websites, our hosting provider (for example, a CDN / edge
          platform such as Vercel) may automatically process standard request
          logs necessary to deliver pages securely. These logs can include IP
          address, user agent, referrer, timestamps, and requested URLs. We use
          such data for security, reliability, abuse prevention, and aggregate
          traffic understanding — not for selling profiles.
        </p>

        <h2>5. Cookies, local storage, and analytics</h2>
        <ul>
          <li>
            <strong>Essential operation:</strong> the site may use browser storage
            only as needed for basic functionality (for example, remembering a UI
            preference if such a feature is added).
          </li>
          <li>
            <strong>Analytics:</strong> we use Google Analytics (gtag.js) to
            collect aggregated usage metrics such as popular pages, approximate
            geography, and device class. Google may process this data under its
            own privacy policy. We do not use invasive cross-site advertising
            trackers as part of the core educational product.
          </li>
          <li>
            <strong>Third-party embeds:</strong> if a future page embeds
            third-party media, that third party’s privacy policy may also apply.
          </li>
        </ul>

        <h2>6. How we use information</h2>
        <ul>
          <li>Operate, secure, and improve the website and tools</li>
          <li>Respond to support and academic inquiries</li>
          <li>Monitor reliability and prevent abuse</li>
          <li>Comply with legal obligations when required</li>
        </ul>

        <h2>7. Sharing</h2>
        <p>
          We do not sell personal information. We may share limited data with
          infrastructure processors (hosting, DNS, email delivery) strictly to
          run the site, or when required by law, or to protect the rights and
          safety of users and the public.
        </p>

        <h2>8. Data retention</h2>
        <p>
          Email correspondence is retained only as long as needed to handle your
          request and maintain basic operational records. Hosting logs are
          retained according to the provider’s defaults and our security needs,
          then deleted or aggregated.
        </p>

        <h2>9. International visitors</h2>
        <p>
          The site is available globally and may be served from distributed edge
          locations. If you access the site from outside the country where our
          hosting infrastructure is primarily operated, your information may be
          processed in other jurisdictions with different data-protection laws.
        </p>

        <h2>10. Children</h2>
        <p>
          The site is intended for general educational use, including secondary
          and higher education. We do not knowingly collect personal information
          from children under 13. If you believe a child has sent us personal
          information, contact us and we will delete it.
        </p>

        <h2>11. Your choices and rights</h2>
        <p>
          Depending on your location, you may have rights to request access,
          correction, or deletion of personal information you have sent us, or to
          object to certain processing. Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the
          subject line “Privacy request”. We may need to verify the request.
        </p>

        <h2>12. Security</h2>
        <p>
          We use HTTPS and modern hosting controls. No method of transmission or
          storage is perfectly secure; please use judgment when sharing
          information online.
        </p>

        <h2>13. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy as the product evolves. The “Last
          updated” date at the top will change when we do. Continued use of the
          site after an update constitutes acceptance of the revised policy
          where permitted by law.
        </p>

        <h2>14. Contact</h2>
        <p className="!mb-0">
          Privacy questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <br />
          More ways to reach us: <Link href="/contact">Contact page</Link>
          <br />
          Also see our <Link href="/terms">Terms of Use</Link>.
        </p>
      </ContentPage>
    </>
  );
}
