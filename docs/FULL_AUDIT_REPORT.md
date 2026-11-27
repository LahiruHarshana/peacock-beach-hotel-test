# Full implementation audit

**Date:** 2026-10-30  
**Scope:** existing Next.js 16 app at repository root. Not a rebuild.  
**Method:** source inspection against `docs/peacock-cursor-guide`, plus executed commands listed in `docs/TEST_COVERAGE.md`.

Verdict: the application skeleton matches the proposal (enquiry-led EN/RU site, admin CMS, MongoDB, Cloudinary APIs). It is **not production-ready**. Several admin workflows exist only as APIs, public pages still depend on client content, and a publish path can mark rooms live without a verified photograph.

## What is implemented and wired

| Area | Evidence | Runtime status |
|---|---|---|
| EN/RU public routes | `src/app/[locale]/(site)/*`, `messages/en.json`, `messages/ru.json` | Pages render. Copy is draft or `CONTENT REQUIRED`. |
| Home, about, restaurant, contact, events list | corresponding `page.tsx` files | Empty or placeholder states when Mongo collections are empty. |
| Rooms list and detail | `rooms/page.tsx`, `rooms/[slug]/page.tsx` | Published rooms come from Mongo. In `development` only, an empty list is replaced by `DEV_SAMPLE_ROOMS`. |
| Enquiry form | `src/components/site/enquiry-module.tsx`, `src/app/api/enquiry/route.ts` | Validates dates and capacity. WhatsApp/Telegram URLs fail closed when `site_settings` has no contacts. |
| Reviews | public form + `POST /api/reviews` + admin queue | New reviews stay `PENDING`. Public list filters `APPROVED`. |
| Admin shell and login | `src/app/admin/*`, Auth.js credentials | Login page and dashboard layout exist. Session is JWT, 8 hours. |
| Room CMS | list, new, edit, `POST/PATCH /api/admin/rooms` | Create/edit UI exists. Publish injects a fake Cloudinary id (see HIGH findings). |
| Event API | `src/app/api/admin/events` | List page only. No create/edit UI. |
| Media API | sign + complete routes | Library page lists stored assets. No upload UI. |
| Audit log writes | `src/server/audit/write-audit-log.ts` | Written on room/event/review/media mutations. Viewer is OWNER-only and unhandled for other roles. |
| Indexes and owner bootstrap | `scripts/ensure-indexes.ts`, `scripts/seed-admin.ts` | Executed successfully in the prior implementation session. |
| SEO files | `src/lib/seo/metadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | Canonical and hreflang helpers exist. No JSON-LD, no Open Graph images. |

## Findings

### F-01 — HIGH — Room publish accepts an unverified placeholder image

- **Location:** `src/components/admin/room-editor.tsx` lines 42–50; `src/server/repositories/rooms.ts` `roomHasRequiredPublishFields` (image count only); `src/app/api/admin/rooms/[id]/publish/route.ts`.
- **Cause:** the editor sends `publicId: "peacock/rooms/placeholder"` when publishing. The server only checks `images.length > 0`.
- **Impact:** a room can go public with a non-existent asset and `CONTENT REQUIRED` alt text.
- **Fix:** require each `publicId` to exist in `media_assets` with matching folder and uploader policy. Remove the placeholder payload.
- **Acceptance:** publish returns 422 when images are missing or unverified; a verified asset publishes.
- **Tests:** integration test for placeholder id rejected; happy path with a fixture media document.

### F-02 — HIGH — PATCH and POST can set `PUBLISHED` without the publish guard

- **Location:** `src/lib/validation/schemas.ts` `createRoomSchema` / `updateRoomSchema`; `src/app/api/admin/rooms/route.ts` POST; `src/app/api/admin/rooms/[id]/route.ts` PATCH.
- **Cause:** `status` is a client field. Create and update write it directly. Only `/publish` calls `roomHasRequiredPublishFields`.
- **Impact:** an editor can publish incomplete rooms by setting `status` on create or patch.
- **Fix:** force creates to `DRAFT`. Ignore client `status` on PATCH. Publishing only through the publish route after media and locale checks.
- **Acceptance:** POST/PATCH with `status: "PUBLISHED"` still stores `DRAFT` until `/publish` succeeds.
- **Tests:** AUTH/content tests CONTENT-01 style plus status spoof.

### F-03 — HIGH — Event management UI is missing

- **Location:** `src/app/admin/(dashboard)/events/page.tsx` (read-only table). API in `src/app/api/admin/events/route.ts` and `[id]/route.ts`.
- **Cause:** API was built without a form.
- **Impact:** staff cannot create or publish seasonal offers from the dashboard. Proposal P06 is incomplete in the UI.
- **Fix:** event editor parallel to rooms, including EN/RU fields, dates, draft/publish, and version.
- **Acceptance:** editor can create a draft, fail publish without RU copy, and publish a complete event that appears on `/en/events` and `/ru/events`.
- **Tests:** Playwright event CRUD; API 403 for `REVIEW_MODERATOR`.

### F-04 — HIGH — No admin UI for WhatsApp, Telegram, or address

- **Location:** `src/server/repositories/site-settings.ts` (read-only defaults, contacts `null`); no settings route.
- **Cause:** settings singleton was defined but never given an OWNER editor.
- **Impact:** enquiry handoff always returns “not configured” until someone writes Mongo by hand. Contact page shows `CONTENT REQUIRED`.
- **Fix:** OWNER-only settings form with E.164 and allowlisted Telegram URL validation.
- **Acceptance:** saved WhatsApp opens `https://wa.me/{digits}` with encoded text; invalid numbers are rejected.
- **Tests:** ENQUIRY-02 and settings auth (EDITOR 403).

### F-05 — HIGH — Cloudinary upload has no staff UI and signatures omit size caps

- **Location:** `src/lib/media/cloudinary.ts` `createSignedUploadParams`; `src/app/admin/(dashboard)/media/page.tsx`.
- **Cause:** sign/complete APIs exist; the page only lists documents. Signed params set folder and formats but not `max_file_size` or a short expiry beyond Cloudinary’s timestamp window.
- **Impact:** editors cannot attach real photos through the product. A stolen signature could upload a large allowed-format file into the folder.
- **Fix:** upload widget calling sign then complete; add byte limit to the signed params; reject complete unless Cloudinary reports an allowlisted format and size.
- **Acceptance:** anonymous sign is 401; complete rejects a `public_id` outside `peacock/{category}`; UI shows verified assets.
- **Tests:** UPLOAD-01 and UPLOAD-02. Current integration test does not prove this (see `docs/TEST_COVERAGE.md`).

### F-06 — MEDIUM — Development sample rooms mask an empty catalogue

- **Location:** `src/app/[locale]/(site)/rooms/page.tsx` lines 21–25; `src/app/[locale]/(site)/rooms/[slug]/page.tsx`; `src/content/fixtures.ts`.
- **Cause:** empty published list in development is replaced with `DEV_SAMPLE_ROOMS`.
- **Impact:** local QA can look populated when the database has no rooms. Sample detail does not use a real slug for enquiry (`roomSlug` omitted), which is safer, but the listing still is not the database.
- **Fix:** always render the empty state. Keep fixtures only in unit tests.
- **Acceptance:** with zero published rooms, `/en/rooms` shows the empty copy in development and production.
- **Tests:** component or e2e with mocked empty DAL.

### F-07 — MEDIUM — Admin audit route throws for non-owners

- **Location:** `src/app/admin/(dashboard)/audit/page.tsx` calls `requireAdminPermission("audit:read")` with no boundary.
- **Cause:** `AuthError` is not mapped to a 403 page. The shell still shows the Audit link to every signed-in role.
- **Impact:** editors and moderators get an error page instead of an access-denied state.
- **Fix:** hide the link by role and render a forbidden view.
- **Acceptance:** EDITOR visiting `/admin/audit` sees a denied message and no log rows.
- **Tests:** role rendering test.

### F-08 — MEDIUM — Room and event images are not rendered

- **Location:** room detail and event detail pages do not use `next/image` or `cloudinaryImageUrl`.
- **Cause:** gallery UI was not built.
- **Impact:** published media metadata would not appear on the public site. Core Web Vitals image work is blocked.
- **Fix:** gallery with width/height, alt from stored EN/RU, `remotePatterns` driven by env cloud name (today hardcoded in `next.config.ts`).
- **Acceptance:** a verified image displays with alt text and reserved dimensions.
- **Tests:** page test with a fixture public id.

### F-09 — LOW — Unused imports and navigation warnings

- **Location:** ESLint on `src` reported 9 warnings (unused imports in reviews page, events route, upload sign route, enquiry route; `window.location` in room editor; unused eslint-disable in `src/lib/db/client.ts`).
- **Cause:** leftover imports.
- **Impact:** noise in CI once lint is gating.
- **Fix:** remove unused symbols and use `router.push`.
- **Acceptance:** `eslint src` exits 0 with zero warnings.
- **Tests:** lint script scoped to `src`.

### F-10 — LOW — Nested `peacock-app/` scaffold

- **Location:** `peacock-app/` including its own `.git`.
- **Cause:** `create-next-app` could not use the folder name, so a sub-app was generated and partially copied.
- **Impact:** duplicate lockfile and a second git repo. Easy to edit the wrong tree.
- **Fix:** delete `peacock-app/` after confirming root `src` is the app. Initialize git at the root.
- **Acceptance:** one application tree and one git root.
- **Tests:** none.

## Proposal exclusions (confirmed absent)

No payment, booking engine, live availability, customer accounts, OTA, or restaurant table reservation were found under `src/`. Restaurant copy explicitly says table booking is not offered (`messages/en.json` `Restaurant.noReservations`).

## Client content still blocking launch

Listed in the guide and still true: logo, room inventory versus 27 physical rooms, tariffs, licensed photography, reviewed EN/RU copy, WhatsApp number, Telegram link type, address, domain, privacy policy. Do not invent these.
