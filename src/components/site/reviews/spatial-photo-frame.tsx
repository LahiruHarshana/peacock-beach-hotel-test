import Image from "next/image";
import type { CSSProperties } from "react";

export function SpatialPhotoFrame({
  src,
  alt,
  depth,
  rotateY,
  className = "",
  focal = false,
  style,
}: {
  src: string;
  alt: string;
  depth: number;
  rotateY: number;
  className?: string;
  focal?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      data-reviews-spatial-frame
      data-depth={depth}
      data-focal={focal ? "true" : undefined}
      className={`reviews-spatial-frame absolute will-change-transform motion-reduce:static ${className} ${focal ? "" : ""}`}
      style={{
        transform: `translate3d(0,0,${depth}px) rotateY(${rotateY}deg)`,
        ...style,
      }}
    >
      <div
        data-reviews-frame-clip
        className="relative h-full w-full overflow-hidden border border-[var(--reviews-border)] bg-[var(--reviews-white)] shadow-[0_20px_56px_rgb(5_42_46_/_0.1)]"
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes={focal ? "60vw" : "28vw"} priority={focal} />
      </div>
    </div>
  );
}