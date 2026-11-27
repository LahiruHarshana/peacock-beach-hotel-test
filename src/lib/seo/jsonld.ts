export type LodgingJsonLdInput = {
  name: string;
  url: string;
  description?: string | null;
  address?: string | null;
};

function approved(value: string | null | undefined): string | undefined {
  const text = value?.trim();
  if (!text || text.includes("CONTENT REQUIRED")) return undefined;
  return text;
}

/** LodgingBusiness with only non-placeholder fields. Ratings and prices are omitted. */
export function lodgingJsonLd(input: LodgingJsonLdInput) {
  const description = approved(input.description);
  const address = approved(input.address);
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: input.name,
    url: input.url,
    ...(description ? { description } : {}),
    ...(address ? { address } : {}),
  };
}
