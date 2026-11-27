# Content inventory

Nothing in this list is approved hotel copy unless a later client sign-off says so. Do not replace a `CONTENT REQUIRED` string with invented address, menu, price, review, phone, or translation.

## How approved content is entered

| Item | Where a human enters it | Publication rule |
|---|---|---|
| Room name, description, occupancy, amenities, display price, EN/RU alt text | `/admin/rooms` | Stays `DRAFT` until publish. Publish rejects empty fields, placeholder text containing `CONTENT REQUIRED`, and images that are not verified Cloudinary assets. |
| Room images | `/admin/media` then the room editor | Signed upload, then server verification. Max 8 MB. jpg, png, webp, avif. |
| Events | `/admin/events` | Same draft/publish rule. Delete is a hard delete with a version check. |
| Guest reviews | Public form, then `/admin/reviews` | New reviews stay pending. Only an approved review is public. |
| WhatsApp, Telegram, address, map URL | `/admin/settings` (OWNER) | Empty values stay null. WhatsApp must be E.164. Telegram must be `https://t.me/` or `https://telegram.me/`. |
| Homepage, about, restaurant sentences in the message files | `messages/en.json` and `messages/ru.json` | There is no CMS field for these paragraphs yet. Edit both languages together after client approval. |

## Placeholders still in the product

| Surface | Evidence |
|---|---|
| Homepage hero | `public/hero-placeholder.svg` as a CSS background. `ContentRequiredBanner` on the home page. |
| Homepage intro, restaurant teaser | `Home.trustBody` and `Home.restaurantBody` in both message files. |
| About | `About.body` in both message files. Banner on the about page. |
| Restaurant | `Restaurant.intro` in both message files. Banner on the restaurant page. No menu items. |
| Rooms | Public list reads published MongoDB rooms only. `src/content/fixtures.ts` still holds a sample room and is not rendered. |
| Reviews | No seeded reviews. Empty state until a guest submits and staff approves. |
| Events | Empty until a published event exists. |
| Address and map | `fallbackSiteSettings.address` is a placeholder in both languages. `mapUrl` is null. Contact page says the map is pending. |
| WhatsApp and Telegram | Fallback settings are null. The enquiry form copies a message when no link is configured. |
| Meta description | Fallback meta description is a placeholder and is omitted from JSON-LD. |
| Open Graph image | Not set. No approved photograph exists. |
| Russian UI | Present in `messages/ru.json`. Treat it as draft, including strings that are not marked `CONTENT REQUIRED`. |
| Admin UI | English only. |
| Image permission | No licence record is stored. Do not upload a photograph until the hotel confirms usage rights. |

## Facts that may be used without inventing the rest

The project name is Peacock Beach Hotel. Public copy already says Unawatuna, Sri Lanka, and that the site takes enquiries rather than bookings. Those sentences are not a verified street address, star rating, phone number, or price.
