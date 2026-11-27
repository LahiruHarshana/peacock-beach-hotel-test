import { z } from "zod";
import { localizedStringSchema, localeSchema } from "@/lib/validation/schemas";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const codeSchema = z.string().trim().min(6).max(12).regex(/^[A-Z0-9]+$/);

export const diningConfigSchema = z
  .object({
    openTime: timeSchema,
    closeTime: timeSchema,
    slotMinutes: z.number().int().min(15).max(120),
    durationMinutes: z.number().int().min(30).max(240),
    maxPartySize: z.number().int().min(1).max(30),
  })
  .strict()
  .refine((value) => {
    const [openH, openM] = value.openTime.split(":").map(Number);
    const [closeH, closeM] = value.closeTime.split(":").map(Number);
    return closeH! * 60 + closeM! > openH! * 60 + openM! + value.durationMinutes;
  }, { message: "Close time must leave room for one seating after open." });

export const diningTableSchema = z
  .object({
    name: z.string().trim().min(1).max(40),
    seats: z.number().int().min(1).max(30),
    active: z.boolean().default(true),
    sortOrder: z.number().int().min(0).max(999).default(0),
  })
  .strict();

export const updateDiningTableSchema = diningTableSchema.partial().extend({ version: z.number().int().min(1) }).strict();

const menuChoiceSchema = z
  .object({
    id: z.string().trim().min(1).max(40),
    name: localizedStringSchema,
    priceDelta: z.number().min(0).max(100_000).default(0),
  })
  .strict();

const menuGroupSchema = z
  .object({
    id: z.string().trim().min(1).max(40),
    name: localizedStringSchema,
    required: z.boolean().default(false),
    choices: z.array(menuChoiceSchema).min(1).max(12),
  })
  .strict();

export const menuItemSchema = z
  .object({
    name: localizedStringSchema,
    description: localizedStringSchema,
    price: z.number().nonnegative().max(1_000_000),
    currency: z.string().length(3).default("USD"),
    category: z.enum(["food", "drink"]),
    published: z.boolean().default(false),
    sortOrder: z.number().int().min(0).max(999).default(0),
    optionGroups: z.array(menuGroupSchema).max(6).default([]),
  })
  .strict();

export const updateMenuItemSchema = menuItemSchema.partial().extend({ version: z.number().int().min(1) }).strict();

export const availabilityQuerySchema = z
  .object({
    date: dateSchema,
    guests: z.coerce.number().int().min(1).max(30),
  })
  .strict();

const contactSchema = z
  .object({
    guestName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    phone: z.string().trim().min(7).max(20),
  })
  .strict();

export const createReservationSchema = contactSchema
  .extend({
    date: dateSchema,
    time: timeSchema,
    guests: z.number().int().min(1).max(30),
    tableId: z.string().trim().min(1),
    notes: z.string().trim().max(500).optional(),
    locale: localeSchema,
  })
  .strict();

export const lookupSchema = z
  .object({
    code: codeSchema,
    email: z.string().trim().email().max(120).optional(),
    phone: z.string().trim().min(7).max(20).optional(),
  })
  .strict()
  .refine((value) => Boolean(value.email || value.phone), { message: "Email or phone is required." });

export const reservationStatusSchema = z
  .object({
    status: z.enum(["CONFIRMED", "SEATED", "COMPLETED", "NO_SHOW", "CANCELLED"]),
    version: z.number().int().min(1),
  })
  .strict();

const orderSelectionSchema = z
  .object({
    groupId: z.string().trim().min(1).max(40),
    choiceId: z.string().trim().min(1).max(40),
  })
  .strict();

export const createOrderSchema = contactSchema
  .extend({
    locale: localeSchema,
    notes: z.string().trim().max(500).optional(),
    reservationCode: codeSchema.optional(),
    items: z
      .array(
        z
          .object({
            menuItemId: z.string().trim().min(1),
            quantity: z.number().int().min(1).max(20),
            selections: z.array(orderSelectionSchema).max(8).default([]),
          })
          .strict(),
      )
      .min(1)
      .max(30),
  })
  .strict();

export const orderStatusSchema = z
  .object({
    status: z.enum(["RECEIVED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]),
    version: z.number().int().min(1),
  })
  .strict();
