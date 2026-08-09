import Image from "next/image";
import type { ContentImage } from "@/lib/content-images";

export function ContentHeroImage({
  image,
  priority = false,
  className = "",
}: {
  image: ContentImage;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`not-prose my-5 ${className}`.trim()}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 72rem"
        className="h-auto w-full rounded-xl border border-[var(--border)] object-cover"
      />
    </figure>
  );
}
