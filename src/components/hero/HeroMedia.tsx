"use client";

import Image from "next/image";
import { forwardRef } from "react";

type HeroMediaProps = {
  src: string;
  alt: string;
  maskId: string;
  className?: string;
  style?: React.CSSProperties;
};

export const HeroMedia = forwardRef<HTMLDivElement, HeroMediaProps>(function HeroMedia(
  { src, alt, maskId, className, style },
  ref,
) {
  const mask = `url(#${maskId})`;
  return (
    <div
      ref={ref}
      data-hero-media
      className={className}
      style={{
        ...style,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskPosition: "0 0",
        WebkitMaskPosition: "0 0",
        maskOrigin: "border-box",
        WebkitMaskOrigin: "border-box",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        draggable={false}
      />
    </div>
  );
});