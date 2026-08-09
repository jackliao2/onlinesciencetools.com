import { ContentHeroImage } from "@/components/content/ContentHeroImage";
import { HomeToolMatrix } from "@/components/home/HomeToolMatrix";
import { JsonLd } from "@/components/tools/JsonLd";
import { contentImages } from "@/lib/content-images";
import { buildWebSiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
        <ContentHeroImage image={contentImages.home} priority />
      </div>
      <HomeToolMatrix />
    </>
  );
}
