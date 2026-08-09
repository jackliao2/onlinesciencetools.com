import { HomeToolMatrix } from "@/components/home/HomeToolMatrix";
import { JsonLd } from "@/components/tools/JsonLd";
import { buildWebSiteJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <HomeToolMatrix />
    </>
  );
}
