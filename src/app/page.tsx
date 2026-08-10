import { ContentHeroImage } from "@/components/content/ContentHeroImage";
import { HomeToolMatrix } from "@/components/home/HomeToolMatrix";
import { JsonLd } from "@/components/tools/JsonLd";
import { contentImages } from "@/lib/content-images";
import { buildWebSiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <HomeToolMatrix />
      <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <ContentHeroImage image={contentImages.home} />
      </div>
    </>
  );
}
