# 01 — Scope, journeys, acceptance

## Source-derived scope (proposal pages 2–7)
**Property:** Peacock Beach Hotel, Unawatuna; 27 rooms, beachfront restaurant. **Languages:** EN and RU. **Primary business result:** qualified direct room enquiries through WhatsApp and Telegram, with confirmation manually handled by staff. **Technology named in proposal:** Next.js.

### Public sections — required
| Section | Functional acceptance criteria |
|---|---|
| Home | premium hero image/video; accurate introduction; beachfront value proposition; room + restaurant highlights; selected approved reviews, events; language selector; room CTA |
| About | client-approved story, property overview, location and hospitality approach |
| Rooms | room types/entries, occupancy, amenities, descriptions, images, supplied displayed prices, room detail route, WhatsApp+Telegram CTA on every room |
| Restaurant | introduction, menus/sections, food/drink imagery, approved video, dining information; **no table reservation engine** |
| Reviews | public approved reviews only; rate-limited visitor submission, pending moderation, user-friendly acknowledgement |
| Special Events | seasonal offer/event list and detail, dates, image, CTA; no purchase checkout |
| Contact | verified address/contact/directions/map link/embed with consent-aware implementation, messaging/contact links |

### Room enquiry journey — required
1. Visitor explores a room, chooses language.
2. Optional form asks check-in/out and guest count; validate date ordering, valid ranges, capacity without claiming availability.
3. User explicitly chooses WhatsApp or Telegram.
4. Pre-filled localized message includes canonical room title and details if provider supports such deep link. Validate links and encode safely; Telegram prefill capability differs by target/link type: **verify supported Telegram route before implementing**, offer copy-message fallback when prefill is unsupported.
5. Display clear copy: *Availability, price and booking confirmation will be confirmed by hotel staff.*
6. If tracking enquiry clicks, log only minimal necessary event; never count clicks as bookings or guaranteed message deliveries.

### Admin dashboard — required
- Secure staff login, session logout, role checks.
- Room CRUD and room photos/amenities/capacity/price with draft/publish workflow (draft/publish is recommended enhancement to prevent accidental public changes).
- Event CRUD, content/media management.
- Review submission queue, approve/reject/hide, rate-limited public form.
- Audit log, role-specific access and dashboard KPI summaries are **recommended implementation additions** beyond narrow proposal admin minimum.

## Proposal exclusions: preserve
No booking engine, live availability calendar, room allocation, automated price confirmation, customer account creation, online payments, OTA/channel manager, restaurant reservation, professional photography, paid SEO campaign, guaranteed rank/traffic/bookings, third language.

## Quality requirements (architectural enhancements, not separately promised features)
- WCAG 2.2 AA aiming compliance; accessible interactions and content.
- Protected admin authentication; document access checks; API rate limits.
- Strong performance, responsive design, no unnecessary client JS.
- SEO: EN/RU localized metadata, structured data, canonical/hreflang/sitemap, Google/Yandex verification where accounts exist.
- Verified links, production monitoring, Mongo backups, Cloudinary cleanup, CI/CD.

## Client approvals needed before production
Property logo/brand usage; room type names and mapping to 27 physical rooms; approved tariffs/currency/price caveats; amenity list; restaurant menu; imagery/media licenses; real reviews and consent; site policies; bilingual reviewed copy; actual WhatsApp contact; Telegram type/link; true address/maps; domain DNS; administrator identities; privacy/cookie policy; retention schedule.
