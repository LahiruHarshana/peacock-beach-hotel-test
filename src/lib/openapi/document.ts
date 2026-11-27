type OpenApiDocument = {
  openapi: string;
  info: { title: string; version: string; description: string };
  servers: { url: string }[];
  tags: { name: string; description: string }[];
  components: Record<string, unknown>;
  paths: Record<string, unknown>;
};

const text = {
  type: "object",
  required: ["en", "ru"],
  properties: {
    en: { type: "string" },
    ru: { type: "string" },
  },
} as const;

const copy = { en: "Ocean view suite", ru: "Номер с видом на океан" };
const description = { en: "A quiet suite facing the bay.", ru: "Тихий номер с видом на бухту." };

function jsonRequest(schema: string, example: unknown) {
  return {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: `#/components/schemas/${schema}` },
        example,
      },
    },
  };
}

const versionExample = { version: 1 };
const lookupExample = { code: "SEEDR001", email: "nimal@example.com" };
const roomExample = {
  slug: "ocean-view-suite",
  name: copy,
  description,
  capacity: 2,
  amenities: ["Sea view", "Air conditioning"],
  images: [{ publicId: "peacock/rooms/ocean", alt: copy, order: 0 }],
  priceDisplay: 185,
  currency: "USD",
  status: "DRAFT",
  sortOrder: 0,
};
const eventExample = {
  slug: "monsoon-wellness-week",
  title: { en: "Monsoon wellness week", ru: "Неделя отдыха" },
  description,
  startAt: "2026-11-24T06:30:00.000Z",
  endAt: "2026-12-08T14:00:00.000Z",
  heroMedia: { publicId: "peacock/events/monsoon", resourceType: "image" },
  status: "DRAFT",
};
const menuExample = {
  name: { en: "Prawn curry", ru: "Карри из креветок" },
  description,
  price: 18,
  currency: "USD",
  category: "food",
  published: true,
  sortOrder: 0,
  optionGroups: [
    {
      id: "spice",
      name: { en: "Spice", ru: "Острота" },
      required: true,
      choices: [
        { id: "mild", name: { en: "Mild", ru: "Мягко" }, priceDelta: 0 },
        { id: "hot", name: { en: "Hot", ru: "Остро" }, priceDelta: 0 },
      ],
    },
  ],
};
const settingsExample = {
  brandName: { en: "Peacock Beach Hotel", ru: "Peacock Beach Hotel" },
  metaDescription: description,
  whatsappE164: "+94771234567",
  telegramUrl: "https://t.me/peacockbeach",
  address: { en: "Matara Road, Unawatuna", ru: "Матара Роуд, Унаватуна" },
  mapUrl: "https://maps.google.com/?q=Unawatuna",
  aboutBody: description,
  restaurantIntro: description,
  heroImagePublicId: null,
  homeHeroTheme: "light",
  storyImagePublicId: null,
  socialImagePublicId: null,
  restaurantImagePublicId: null,
  galleryRoomsImagePublicId: null,
  galleryRestaurantImagePublicId: null,
  galleryEventsImagePublicId: null,
  galleryAboutImagePublicId: null,
  reviewsImagePublicId: null,
  closerImagePublicId: null,
};

const apiEnvelope = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    requestId: { type: "string" },
  },
  required: ["ok", "requestId"],
} as const;

const errorEnvelope = {
  allOf: [
    apiEnvelope,
    {
      type: "object",
      properties: {
        ok: { const: false },
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
              enum: [
                "VALIDATION_ERROR",
                "UNAUTHORIZED",
                "FORBIDDEN",
                "NOT_FOUND",
                "CONFLICT",
                "RATE_LIMITED",
                "INTERNAL_ERROR",
              ],
            },
            message: { type: "string" },
            fieldErrors: {
              type: "object",
              additionalProperties: { type: "array", items: { type: "string" } },
            },
          },
          required: ["code", "message"],
        },
      },
      required: ["error"],
    },
  ],
} as const;

/** OpenAPI description for Peacock Beach Hotel route handlers. */
export function buildOpenApiDocument(serverUrl: string): OpenApiDocument {
  return {
    openapi: "3.0.3",
    info: {
      title: "Peacock Beach Hotel API",
      version: "0.1.0",
      description:
        "Public enquiry and review endpoints, health probes, and staff admin routes. Admin routes require an authenticated staff session (NextAuth cookie).",
    },
    servers: [{ url: serverUrl }],
    tags: [
      { name: "Health", description: "Liveness and readiness probes" },
      { name: "Public", description: "Guest-facing write APIs" },
      { name: "Admin — Rooms", description: "Staff room CMS" },
      { name: "Admin — Events", description: "Staff events CMS" },
      { name: "Admin — Reviews", description: "Review moderation" },
      { name: "Admin — Media", description: "Cloudinary library" },
      { name: "Admin — Settings", description: "Site settings" },
      { name: "Admin — Uploads", description: "Signed upload flow" },
      { name: "Dining", description: "Public table reservations and pay-at-restaurant orders" },
      { name: "Admin — Dining", description: "Staff tables, menu, reservations, and orders" },
      { name: "Auth", description: "NextAuth handlers" },
    ],
    components: {
      securitySchemes: {
        sessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "authjs.session-token",
          description: "Staff session from POST /api/auth/callback/credentials (browser login at /admin/login).",
        },
      },
      schemas: {
        EnquiryRequest: {
          type: "object",
          required: ["checkIn", "checkOut", "guests", "channel", "locale"],
          properties: {
            checkIn: { type: "string", format: "date", example: "2026-12-01" },
            checkOut: { type: "string", format: "date", example: "2026-12-05" },
            guests: { type: "integer", minimum: 1, maximum: 20 },
            channel: { type: "string", enum: ["whatsapp", "telegram"] },
            roomSlug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
            locale: { type: "string", enum: ["en", "ru"] },
          },
        },
        PublicReviewRequest: {
          type: "object",
          required: ["authorDisplayName", "text", "locale", "consentAccepted"],
          properties: {
            authorDisplayName: { type: "string", minLength: 2, maxLength: 80 },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            text: { type: "string", minLength: 10, maxLength: 2000 },
            locale: { type: "string", enum: ["en", "ru"] },
            consentAccepted: { type: "boolean", enum: [true] },
            website: { type: "string", maxLength: 0, description: "Honeypot; must be empty." },
          },
        },
        UploadSignRequest: {
          type: "object",
          required: ["category"],
          properties: {
            category: { type: "string", enum: ["rooms", "events", "restaurant", "general"] },
            resourceType: { type: "string", enum: ["image"], default: "image" },
          },
        },
        UploadCompleteRequest: {
          type: "object",
          required: ["publicId", "category"],
          properties: {
            publicId: { type: "string" },
            resourceType: { type: "string", enum: ["image", "video"] },
            category: { type: "string", enum: ["rooms", "events", "restaurant", "general"] },
          },
        },
        ModerateReviewRequest: {
          type: "object",
          required: ["action"],
          properties: {
            action: { type: "string", enum: ["APPROVE", "REJECT"] },
            version: { type: "integer", minimum: 1 },
          },
        },
        DeleteMediaRequest: {
          type: "object",
          required: ["publicId"],
          properties: { publicId: { type: "string" } },
          example: { publicId: "peacock/rooms/ocean" },
        },
        VersionRequest: {
          type: "object",
          required: ["version"],
          properties: { version: { type: "integer", minimum: 1 } },
          example: versionExample,
        },
        CreateRoomRequest: {
          type: "object",
          required: ["slug", "name", "description", "capacity", "amenities", "images"],
          properties: {
            slug: { type: "string" },
            name: text,
            description: text,
            capacity: { type: "integer" },
            amenities: { type: "array", items: { type: "string" } },
            images: { type: "array", items: { type: "object" } },
            priceDisplay: { type: "number", nullable: true },
            currency: { type: "string" },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED"] },
            sortOrder: { type: "integer" },
          },
          example: roomExample,
        },
        UpdateRoomRequest: {
          type: "object",
          required: ["version"],
          properties: { version: { type: "integer", minimum: 1 } },
          example: { ...roomExample, version: 1 },
        },
        CreateEventRequest: {
          type: "object",
          required: ["slug", "title", "description", "startAt", "endAt"],
          properties: {
            slug: { type: "string" },
            title: text,
            description: text,
            startAt: { type: "string", format: "date-time" },
            endAt: { type: "string", format: "date-time" },
            heroMedia: { type: "object", nullable: true },
            status: { type: "string", enum: ["DRAFT", "PUBLISHED"] },
          },
          example: eventExample,
        },
        UpdateEventRequest: {
          type: "object",
          required: ["version"],
          properties: { version: { type: "integer", minimum: 1 } },
          example: { ...eventExample, version: 1 },
        },
        SiteSettingsRequest: {
          type: "object",
          properties: {
            brandName: text,
            metaDescription: text,
            whatsappE164: { type: "string", nullable: true },
            telegramUrl: { type: "string", nullable: true },
            address: text,
            mapUrl: { type: "string", nullable: true },
            aboutBody: text,
            restaurantIntro: text,
          },
          example: settingsExample,
        },
        ReservationRequest: {
          type: "object",
          required: ["guestName", "email", "phone", "date", "time", "guests", "tableId", "locale"],
          properties: {
            guestName: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            date: { type: "string", example: "2026-12-01" },
            time: { type: "string", example: "19:00" },
            guests: { type: "integer" },
            tableId: { type: "string" },
            notes: { type: "string" },
            locale: { type: "string", enum: ["en", "ru"] },
          },
          example: {
            guestName: "Nimal Perera",
            email: "nimal@example.com",
            phone: "+94771234001",
            date: "2026-12-01",
            time: "19:00",
            guests: 2,
            tableId: "REPLACE_TABLE_ID",
            notes: "Window table if possible",
            locale: "en",
          },
        },
        LookupRequest: {
          type: "object",
          required: ["code"],
          properties: {
            code: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
          },
          example: lookupExample,
        },
        OrderRequest: {
          type: "object",
          required: ["guestName", "email", "phone", "locale", "items"],
          properties: {
            guestName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            locale: { type: "string", enum: ["en", "ru"] },
            notes: { type: "string" },
            reservationCode: { type: "string" },
            items: { type: "array", items: { type: "object" } },
          },
          example: {
            guestName: "Nimal Perera",
            email: "nimal@example.com",
            phone: "+94771234001",
            locale: "en",
            notes: "No ice",
            reservationCode: "SEEDR001",
            items: [{ menuItemId: "REPLACE_MENU_ITEM_ID", quantity: 1, selections: [{ groupId: "spice", choiceId: "mild" }] }],
          },
        },
        DiningHoursRequest: {
          type: "object",
          required: ["openTime", "closeTime", "slotMinutes", "durationMinutes", "maxPartySize"],
          properties: {
            openTime: { type: "string" },
            closeTime: { type: "string" },
            slotMinutes: { type: "integer" },
            durationMinutes: { type: "integer" },
            maxPartySize: { type: "integer" },
          },
          example: { openTime: "12:00", closeTime: "22:00", slotMinutes: 30, durationMinutes: 90, maxPartySize: 12 },
        },
        DiningTableRequest: {
          type: "object",
          required: ["name", "seats"],
          properties: {
            name: { type: "string" },
            seats: { type: "integer" },
            active: { type: "boolean" },
            sortOrder: { type: "integer" },
          },
          example: { name: "Terrace 1", seats: 2, active: true, sortOrder: 0 },
        },
        UpdateDiningTableRequest: {
          type: "object",
          required: ["version"],
          properties: { version: { type: "integer", minimum: 1 } },
          example: { name: "Terrace 1", seats: 2, active: true, sortOrder: 0, version: 1 },
        },
        MenuItemRequest: {
          type: "object",
          required: ["name", "description", "price", "category"],
          properties: {
            name: text,
            description: text,
            price: { type: "number" },
            currency: { type: "string" },
            category: { type: "string", enum: ["food", "drink"] },
            published: { type: "boolean" },
            sortOrder: { type: "integer" },
            optionGroups: { type: "array", items: { type: "object" } },
          },
          example: menuExample,
        },
        UpdateMenuItemRequest: {
          type: "object",
          required: ["version"],
          properties: { version: { type: "integer", minimum: 1 } },
          example: { ...menuExample, version: 1 },
        },
        ReservationStatusRequest: {
          type: "object",
          required: ["status", "version"],
          properties: {
            status: { type: "string", enum: ["CONFIRMED", "SEATED", "COMPLETED", "NO_SHOW", "CANCELLED"] },
            version: { type: "integer", minimum: 1 },
          },
          example: { status: "SEATED", version: 1 },
        },
        OrderStatusRequest: {
          type: "object",
          required: ["status", "version"],
          properties: {
            status: { type: "string", enum: ["RECEIVED", "PREPARING", "READY", "COMPLETED", "CANCELLED"] },
            version: { type: "integer", minimum: 1 },
          },
          example: { status: "PREPARING", version: 1 },
        },
        StaffSignInRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
            csrfToken: { type: "string" },
            callbackUrl: { type: "string" },
          },
          example: { email: "admin@peacockbeach.local", password: "your-password", csrfToken: "", callbackUrl: "/admin" },
        },
        ApiSuccess: apiEnvelope,
        ApiError: errorEnvelope,
      },
    },
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Liveness check",
          responses: {
            "200": {
              description: "Process is up",
              content: { "application/json": { schema: { type: "object", properties: { ok: { const: true } } } } },
            },
          },
        },
      },
      "/api/ready": {
        get: {
          tags: ["Health"],
          summary: "Readiness check (MongoDB ping)",
          responses: {
            "200": {
              description: "Database reachable",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { ok: { const: true }, database: { type: "string", example: "up" } },
                  },
                },
              },
            },
            "503": {
              description: "Database unavailable",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { ok: { const: false }, database: { type: "string", example: "down" } },
                  },
                },
              },
            },
          },
        },
      },
      "/api/enquiry": {
        post: {
          tags: ["Public"],
          summary: "Build room enquiry handoff (WhatsApp / Telegram message)",
          requestBody: jsonRequest("EnquiryRequest", {
            checkIn: "2026-12-01",
            checkOut: "2026-12-05",
            guests: 2,
            channel: "whatsapp",
            roomSlug: "ocean-view-suite",
            locale: "en",
          }),
          responses: {
            "200": { description: "Handoff payload", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
            "429": { description: "Rate limited", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/api/reviews": {
        post: {
          tags: ["Public"],
          summary: "Submit a guest review (pending moderation)",
          requestBody: jsonRequest("PublicReviewRequest", {
            authorDisplayName: "Anna K.",
            rating: 5,
            text: "Quiet room and a kind team. The terrace at sunset was the highlight.",
            locale: "en",
            consentAccepted: true,
          }),
          responses: {
            "201": { description: "Review queued", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
            "429": { description: "Rate limited", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/api/admin/rooms": {
        get: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "List rooms (admin)",
          parameters: [{ name: "page", in: "query", schema: { type: "integer", default: 1 } }],
          responses: {
            "200": { description: "Paginated rooms", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
        post: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "Create room",
          requestBody: jsonRequest("CreateRoomRequest", roomExample),
          responses: {
            "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/api/admin/rooms/{id}": {
        get: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "Get room by id",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Room", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
        patch: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "Update room",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("UpdateRoomRequest", { ...roomExample, version: 1 }),
          responses: {
            "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } },
            "409": { description: "Version conflict", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          },
        },
      },
      "/api/admin/rooms/{id}/publish": {
        post: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "Publish room",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("VersionRequest", versionExample),
          responses: { "200": { description: "Published", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/rooms/{id}/unpublish": {
        post: {
          tags: ["Admin — Rooms"],
          security: [{ sessionCookie: [] }],
          summary: "Unpublish room",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("VersionRequest", versionExample),
          responses: { "200": { description: "Unpublished", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/events": {
        get: {
          tags: ["Admin — Events"],
          security: [{ sessionCookie: [] }],
          summary: "List events (admin)",
          parameters: [{ name: "page", in: "query", schema: { type: "integer", default: 1 } }],
          responses: { "200": { description: "Events", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
        post: {
          tags: ["Admin — Events"],
          security: [{ sessionCookie: [] }],
          summary: "Create event",
          requestBody: jsonRequest("CreateEventRequest", eventExample),
          responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/events/{id}": {
        patch: {
          tags: ["Admin — Events"],
          security: [{ sessionCookie: [] }],
          summary: "Update event",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("UpdateEventRequest", { ...eventExample, version: 1 }),
          responses: { "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
        delete: {
          tags: ["Admin — Events"],
          security: [{ sessionCookie: [] }],
          summary: "Delete event",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("VersionRequest", versionExample),
          responses: { "200": { description: "Deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/events/{id}/publish": {
        post: {
          tags: ["Admin — Events"],
          security: [{ sessionCookie: [] }],
          summary: "Publish event",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("VersionRequest", versionExample),
          responses: { "200": { description: "Published", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/reviews": {
        get: {
          tags: ["Admin — Reviews"],
          security: [{ sessionCookie: [] }],
          summary: "List reviews for moderation",
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          ],
          responses: { "200": { description: "Reviews", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/reviews/{id}/moderate": {
        post: {
          tags: ["Admin — Reviews"],
          security: [{ sessionCookie: [] }],
          summary: "Approve or reject review",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: jsonRequest("ModerateReviewRequest", { action: "APPROVE", version: 1 }),
          responses: { "200": { description: "Moderated", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/media": {
        get: {
          tags: ["Admin — Media"],
          security: [{ sessionCookie: [] }],
          summary: "List media assets",
          responses: { "200": { description: "Media list", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
        delete: {
          tags: ["Admin — Media"],
          security: [{ sessionCookie: [] }],
          summary: "Delete media record",
          requestBody: jsonRequest("DeleteMediaRequest", { publicId: "peacock/rooms/ocean" }),
          responses: { "200": { description: "Deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/settings": {
        get: {
          tags: ["Admin — Settings"],
          security: [{ sessionCookie: [] }],
          summary: "Get site settings",
          responses: { "200": { description: "Settings", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
        put: {
          tags: ["Admin — Settings"],
          security: [{ sessionCookie: [] }],
          summary: "Update site settings",
          requestBody: jsonRequest("SiteSettingsRequest", settingsExample),
          responses: { "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/uploads/sign": {
        post: {
          tags: ["Admin — Uploads"],
          security: [{ sessionCookie: [] }],
          summary: "Get Cloudinary signed upload parameters",
          requestBody: jsonRequest("UploadSignRequest", { category: "rooms", resourceType: "image" }),
          responses: { "200": { description: "Signature", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/admin/uploads/complete": {
        post: {
          tags: ["Admin — Uploads"],
          security: [{ sessionCookie: [] }],
          summary: "Register completed upload in media library",
          requestBody: jsonRequest("UploadCompleteRequest", { publicId: "peacock/rooms/ocean", resourceType: "image", category: "rooms" }),
          responses: { "201": { description: "Registered", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiSuccess" } } } } },
        },
      },
      "/api/dining/availability": { get: { tags: ["Dining"], summary: "Free tables by date and party size", parameters: [{ name: "date", in: "query", required: true, schema: { type: "string" } }, { name: "guests", in: "query", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Slots" } } } },
      "/api/dining/reservations": { post: { tags: ["Dining"], summary: "Create a table reservation", requestBody: jsonRequest("ReservationRequest", { guestName: "Nimal Perera", email: "nimal@example.com", phone: "+94771234001", date: "2026-12-01", time: "19:00", guests: 2, tableId: "REPLACE_TABLE_ID", notes: "Window table if possible", locale: "en" }), responses: { "201": { description: "Confirmation code" } } } },
      "/api/dining/reservations/lookup": { post: { tags: ["Dining"], summary: "Look up a reservation", requestBody: jsonRequest("LookupRequest", lookupExample), responses: { "200": { description: "Reservation" } } } },
      "/api/dining/reservations/cancel": { post: { tags: ["Dining"], summary: "Cancel a confirmed reservation", requestBody: jsonRequest("LookupRequest", lookupExample), responses: { "200": { description: "Cancelled" } } } },
      "/api/dining/menu": { get: { tags: ["Dining"], summary: "Published menu", responses: { "200": { description: "Menu items" } } } },
      "/api/dining/orders": { post: { tags: ["Dining"], summary: "Place a pay-at-restaurant order", requestBody: jsonRequest("OrderRequest", { guestName: "Nimal Perera", email: "nimal@example.com", phone: "+94771234001", locale: "en", notes: "No ice", reservationCode: "SEEDR001", items: [{ menuItemId: "REPLACE_MENU_ITEM_ID", quantity: 1, selections: [{ groupId: "spice", choiceId: "mild" }] }] }), responses: { "201": { description: "Order code" } } } },
      "/api/dining/orders/lookup": { post: { tags: ["Dining"], summary: "Look up an order", requestBody: jsonRequest("LookupRequest", { code: "SEEDO001", email: "nimal@example.com" }), responses: { "200": { description: "Order" } } } },
      "/api/dining/orders/cancel": { post: { tags: ["Dining"], summary: "Cancel a received order", requestBody: jsonRequest("LookupRequest", { code: "SEEDO001", email: "nimal@example.com" }), responses: { "200": { description: "Cancelled" } } } },
      "/api/admin/dining/tables": {
        get: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "List tables and hours", responses: { "200": { description: "Tables" } } },
        put: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Update dining hours", requestBody: jsonRequest("DiningHoursRequest", { openTime: "12:00", closeTime: "22:00", slotMinutes: 30, durationMinutes: 90, maxPartySize: 12 }), responses: { "200": { description: "Saved" } } },
        post: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Create a table", requestBody: jsonRequest("DiningTableRequest", { name: "Terrace 1", seats: 2, active: true, sortOrder: 0 }), responses: { "201": { description: "Created" } } },
      },
      "/api/admin/dining/tables/{id}": { patch: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Update a table", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: jsonRequest("UpdateDiningTableRequest", { name: "Terrace 1", seats: 2, active: true, sortOrder: 0, version: 1 }), responses: { "200": { description: "Updated" } } } },
      "/api/admin/dining/menu": {
        get: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "List menu items", responses: { "200": { description: "Menu" } } },
        post: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Create a menu item", requestBody: jsonRequest("MenuItemRequest", menuExample), responses: { "201": { description: "Created" } } },
      },
      "/api/admin/dining/menu/{id}": { patch: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Update a menu item", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: jsonRequest("UpdateMenuItemRequest", { ...menuExample, version: 1 }), responses: { "200": { description: "Updated" } } } },
      "/api/admin/dining/reservations": { get: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "List reservations", responses: { "200": { description: "Reservations" } } } },
      "/api/admin/dining/reservations/{id}": { patch: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Change reservation status", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: jsonRequest("ReservationStatusRequest", { status: "SEATED", version: 1 }), responses: { "200": { description: "Updated" } } } },
      "/api/admin/dining/orders": { get: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "List orders", responses: { "200": { description: "Orders" } } } },
      "/api/admin/dining/orders/{id}": { patch: { tags: ["Admin — Dining"], security: [{ sessionCookie: [] }], summary: "Change order status", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: jsonRequest("OrderStatusRequest", { status: "PREPARING", version: 1 }), responses: { "200": { description: "Updated" } } } },
      "/api/auth/{path}": {
        get: {
          tags: ["Auth"],
          summary: "NextAuth GET handler",
          parameters: [{ name: "path", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "NextAuth response" } },
        },
        post: {
          tags: ["Auth"],
          summary: "NextAuth POST handler (sign-in, sign-out, callbacks)",
          parameters: [{ name: "path", in: "path", required: true, schema: { type: "string", example: "callback/credentials" } }],
          requestBody: {
            required: true,
            content: {
              "application/x-www-form-urlencoded": {
                schema: { $ref: "#/components/schemas/StaffSignInRequest" },
                example: { email: "admin@peacockbeach.local", password: "your-password", csrfToken: "", callbackUrl: "/admin" },
              },
            },
          },
          responses: { "200": { description: "NextAuth response" } },
        },
      },
    },
  };
}