import Image from "next/image";

export function RoundedMedia({
  src,
  alt,
  previewLabel,
  className = "h-[26rem]",
  priority,
  sizes = "(min-width: 768px) 92vw, 100vw",
}: {
  src: string | null | undefined;
  alt: string;
  previewLabel?: string | null;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      {previewLabel ? (
        <p className="absolute left-4 top-4 rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12rem] text-mocha/75">
          {previewLabel}
        </p>
      ) : null}
    </div>
  );
}
