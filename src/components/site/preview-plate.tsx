import Image from "next/image";

export function PreviewPlate({
  src,
  alt,
  label,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  src?: string | null;
  alt: string;
  label?: string | null;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const position = className.includes("absolute") ? "" : "relative";

  return (
    <figure className={`${position} h-full w-full overflow-hidden bg-ink ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes={sizes} />
      ) : (
        <div className="coastal-field absolute inset-0" />
      )}
      {label ? (
        <figcaption className="absolute bottom-4 left-4 max-w-[16rem] text-[0.65rem] uppercase tracking-[0.18em] text-sand">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
