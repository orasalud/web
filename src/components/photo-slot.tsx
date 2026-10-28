import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Camera } from "lucide-react";
import type { Photo } from "@/config/site";

const ratios = {
  "4:3": "aspect-[4/3]",
};

type Props = {
  photo: Photo | null;
  ratio: keyof typeof ratios;
  /** Rendered width hints for next/image, e.g. "(min-width: 768px) 460px, 100vw". */
  sizes: string;
  /** Only for the photo most likely to be the largest element on first load. */
  highPriority?: boolean;
  className?: string;
};

/**
 * A fixed-ratio photo box. The box reserves its space before the image loads,
 * so there is no layout shift. Shows a labeled gray placeholder until the file
 * exists in /public (checked when the page is built).
 */
export function PhotoSlot({ photo, ratio, sizes, highPriority = false, className = "" }: Props) {
  if (!photo) return null;
  const exists = existsSync(join(process.cwd(), "public", photo.src));

  return (
    <div className={`@container relative overflow-hidden rounded-2xl ${ratios[ratio]} ${className}`}>
      {exists ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          loading={highPriority ? "eager" : "lazy"}
          fetchPriority={highPriority ? "high" : "auto"}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#7F8D92] bg-[#E4E7E8] p-4 text-center @max-[11rem]:gap-1 @max-[11rem]:p-2">
          <Camera className="h-7 w-7 text-muted @max-[11rem]:hidden" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-sm font-semibold text-ink @max-[11rem]:leading-tight">{photo.placeholder}</span>
          <span className="font-mono text-xs text-muted @max-[11rem]:text-[0.6875rem] @max-[11rem]:leading-tight">
            public{photo.src.slice(0, photo.src.lastIndexOf("/") + 1)}
            <wbr />
            {photo.src.slice(photo.src.lastIndexOf("/") + 1)}
          </span>
        </div>
      )}
    </div>
  );
}
