import Image from "next/image";

export function SceneHeader({
  eyebrow,
  title,
  lede,
  imageUrl,
  imageAlt,
  previewLabel,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  previewLabel?: string | null;
}) {
  return (
    <header className="relative -mt-20 flex min-h-[72vh] items-end overflow-hidden text-paper">
      {imageUrl ? (
        <Image src={imageUrl} alt={imageAlt || ""} fill priority className="object-cover" sizes="100vw" />
      ) : (
        <div className="coastal-field absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/30" />
      <div className="hero-ink relative mx-auto w-full max-w-[90rem] px-5 pb-16 pt-32 md:px-10">
        {previewLabel ? <p className="text-xs uppercase tracking-[0.22em] text-sand">{previewLabel}</p> : null}
        {eyebrow ? <p className="mt-4 text-xs uppercase tracking-[0.28em] text-sand">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{title}</h1>
        {lede ? <p className="mt-6 max-w-xl text-lg leading-8 text-ivory">{lede}</p> : null}
      </div>
    </header>
  );
}
