# 02 — Single application architecture

## Technology decision record
- Next.js App Router (latest stable **compatible** version verified at setup; pin with lockfile), React, strict TypeScript.
- Tailwind CSS + shadcn/ui/Radix, icon library, self-hosted or optimized font with proper license.
- MongoDB Atlas with native official MongoDB Node.js driver (simple, explicit) **or** Mongoose if team chooses rich schema/hooks; choose ONE; this guide defaults to native driver plus Zod validation.
- Auth.js-compatible maintained identity/session solution with MongoDB support, or a managed identity provider with properly supported Next.js integration; lock versions only after API compatibility check. Admin identity only; database sessions, protected cookies and authorized DAL.
- Cloudinary SDK for signed admin uploads, Next Image remote patterns or vetted Cloudinary responsive image integration.
- `next-intl` (or equivalently maintained library) with explicit en/ru routes.
- React Hook Form + Zod for client UX, independently validated on server.
- Sonner for toasts; error boundaries for UI; structured logging with redaction, Sentry or equivalent optional, privacy-reviewed.
- Vitest for unit/integration, Playwright for E2E, axe for accessibility checks, Lighthouse CI.

## Boundaries
`browser -> Next.js public route/server action/route handler -> auth/validation -> service -> scoped repository -> MongoDB Atlas`
`admin browser -> signed upload intent route (auth+role) -> Cloudinary upload -> verify and persist approved asset metadata`

## Suggested file tree
```text
src/
  app/
    [locale]/
      (site)/page.tsx
      (site)/about/page.tsx
      (site)/rooms/page.tsx
      (site)/rooms/[slug]/page.tsx
      (site)/restaurant/page.tsx
      (site)/reviews/page.tsx
      (site)/events/page.tsx
      (site)/events/[slug]/page.tsx
      (site)/contact/page.tsx
      (admin)/admin/layout.tsx
      (admin)/admin/page.tsx
      (admin)/admin/rooms/page.tsx
      (admin)/admin/events/page.tsx
      (admin)/admin/reviews/page.tsx
      (admin)/admin/media/page.tsx        # optional scoped CMS improvement
      (admin)/admin/audit/page.tsx        # optional quality improvement
    api/
      auth/[...nextauth]/route.ts
      reviews/route.ts
      admin/rooms/route.ts
      admin/rooms/[id]/route.ts
      admin/events/route.ts
      admin/reviews/[id]/route.ts
      admin/uploads/sign/route.ts
      admin/uploads/complete/route.ts
    robots.ts
    sitemap.ts
    global-error.tsx
  components/site/  components/admin/  components/ui/
  features/rooms/ features/events/ features/reviews/ features/enquiries/
  lib/auth/ lib/db/ lib/security/ lib/validation/ lib/errors/ lib/seo/
  server/dal/ server/services/ server/repositories/ server/audit/
  messages/en.json  messages/ru.json
  styles/
tests/unit/ tests/integration/ tests/e2e/
scripts/ensure-indexes.ts scripts/seed-admin.ts scripts/verify-env.ts
```
**Important:** route groups `(site)` and `(admin)` are organizational, not URL segments. Prevent accidental `/(admin)/admin` exposure? Exact URLs depend on route group placement. Prefer `/en/admin` and `/ru/admin`, or one language-neutral `/admin` with explicit auth boundary; document choice and ensure no collisions. Public marketing routes must use translated locales; admin localization is optional if staffing requirements do not include Russian admin UI.

## Server architecture constraints
- `server-only` at every DB, auth, secret, repo module.
- Public read projection only returns published, approved localized fields.
- Services own domain rules; handlers parse/authorize/dispatch/serialize only.
- Revalidate published content on mutations. Avoid caching authenticated admin responses publicly.
- Set request body and file limits; set connection pooling and query limits; DB connection singleton in dev and shared connection reuse in prod.
- Database backups and region selection based on privacy, latency and costs.
- MongoDB Atlas access restricted by network rules and least-privilege user permissions; no app user direct access.
