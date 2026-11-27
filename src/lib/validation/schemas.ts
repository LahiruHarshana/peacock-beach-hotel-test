import { z } from "zod";

export const localeSchema = z.enum(["en", "ru"]);
export type Locale = z.infer<typeof localeSchema>;

export const localizedStringSchema = z.object({
  en: z.string().trim().max(5000),
  ru: z.string().trim().max(5000),
});

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const publishStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const moderationStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const roomImageSchema = z.object({
  publicId: z.string().min(1).max(200),
  alt: localizedStringSchema,
  order: z.number().int().min(0).max(100),
});

export const createRoomSchema = z
  .object({
    slug: slugSchema,
    name: localizedStringSchema,
    description: localizedStringSchema,
    capacity: z.number().int().min(1).max(20),
    amenities: z.array(z.string().trim().min(1).max(80)).max(30),
    images: z.array(roomImageSchema).max(20),
    priceDisplay: z.number().nonnegative().max(1_000_000).nullable().optional(),
    currency: z.string().length(3).optional(),
    status: publishStatusSchema.default("DRAFT"),
    sortOrder: z.number().int().min(0).max(999).default(0),
  })
  .strict();

export const updateRoomSchema = createRoomSchema
  .partial()
  .extend({ version: z.number().int().min(1) })
  .strict();

const eventBaseSchema = z
  .object({
    slug: slugSchema,
    title: localizedStringSchema,
    description: localizedStringSchema,
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    heroMedia: z
      .object({
        publicId: z.string().min(1),
        resourceType: z.enum(["image", "video"]),
      })
      .nullable()
      .optional(),
    status: publishStatusSchema.default("DRAFT"),
  })
  .strict();

export const createEventSchema = eventBaseSchema.refine((d) => d.endAt >= d.startAt, {
  message: "End must be after start.",
});

export const updateEventSchema = eventBaseSchema
  .partial()
  .extend({ version: z.number().int().min(1) })
  .strict();

export const publicReviewSchema = z
  .object({
    authorDisplayName: z.string().trim().min(2).max(80),
    rating: z.number().int().min(1).max(5).optional(),
    text: z.string().trim().min(10).max(2000),
    locale: localeSchema,
    consentAccepted: z.literal(true),
    website: z.string().max(0).optional(),
  })
  .strict();

export const moderateReviewSchema = z
  .object({
    action: z.enum(["APPROVE", "REJECT"]),
    version: z.number().int().min(1).optional(),
  })
  .strict();

export const enquirySchema = z
  .object({
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guests: z.number().int().min(1).max(20),
    channel: z.enum(["whatsapp", "telegram"]),
    roomSlug: slugSchema.optional(),
    locale: localeSchema,
  })
  .strict()
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in.",
  });

export const uploadSignSchema = z
  .object({
    category: z.enum(["rooms", "events", "restaurant", "general"]),
    resourceType: z.enum(["image"]).default("image"),
  })
  .strict();

const approvedLocalizedSchema = localizedStringSchema.superRefine((value, ctx) => {
  for (const locale of ["en", "ru"] as const) {
    if (value[locale].includes("CONTENT REQUIRED")) {
      ctx.addIssue({
        code: "custom",
        path: [locale],
        message: "Replace the placeholder before saving.",
      });
    }
  }
});

export const siteSettingsUpdateSchema = z
  .object({
    brandName: approvedLocalizedSchema,
    metaDescription: approvedLocalizedSchema,
    whatsappE164: z
      .string()
      .trim()
      .regex(/^\+[1-9]\d{7,14}$/, "Use international format, for example +94…")
      .nullable(),
    telegramUrl: z
      .string()
      .trim()
      .url()
      .refine((value) => value.startsWith("https://t.me/") || value.startsWith("https://telegram.me/"), {
        message: "Telegram link must be an https://t.me/ or https://telegram.me/ URL.",
      })
      .nullable(),
    address: approvedLocalizedSchema,
    mapUrl: z.string().trim().url().nullable(),
    aboutBody: approvedLocalizedSchema,
    restaurantIntro: approvedLocalizedSchema,
    heroImagePublicId: z.string().trim().min(1).max(200).nullable(),
    homeHeroTheme: z.enum(["dark", "light"]).default("light"),
    storyImagePublicId: z.string().trim().min(1).max(200).nullable(),
    socialImagePublicId: z.string().trim().min(1).max(200).nullable(),
    restaurantImagePublicId: z.string().trim().min(1).max(200).nullable(),
    galleryRoomsImagePublicId: z.string().trim().min(1).max(200).nullable(),
    galleryRestaurantImagePublicId: z.string().trim().min(1).max(200).nullable(),
    galleryEventsImagePublicId: z.string().trim().min(1).max(200).nullable(),
    galleryAboutImagePublicId: z.string().trim().min(1).max(200).nullable(),
    reviewsImagePublicId: z.string().trim().min(1).max(200).nullable(),
    closerImagePublicId: z.string().trim().min(1).max(200).nullable(),
  })
  .strict();

export const deleteMediaSchema = z
  .object({
    publicId: z.string().min(1).max(200),
  })
  .strict();

export const uploadCompleteSchema = z
  .object({
    publicId: z.string().min(1).max(200),
    resourceType: z.enum(["image", "video"]).default("image"),
    category: z.enum(["rooms", "events", "restaurant", "general"]),
  })
  .strict();
