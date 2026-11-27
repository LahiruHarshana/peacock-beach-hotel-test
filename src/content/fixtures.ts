/** Dev-only sample cards — not production content. */
export const DEV_SAMPLE_ROOMS = [
  {
    slug: "sample-ocean-view",
    name: { en: "Sample Ocean View Room", ru: "Образец номера с видом на океан" },
    description: {
      en: "NOT FOR PRODUCTION — placeholder layout for room detail and enquiry module.",
      ru: "NOT FOR PRODUCTION — макет для детальной страницы и модуля запроса.",
    },
    capacity: 2,
    amenities: ["CONTENT REQUIRED"],
    images: [],
    priceDisplay: null as number | null,
    sortOrder: 0,
  },
] as const;

export const CONTENT_REQUIRED = "CONTENT REQUIRED";
