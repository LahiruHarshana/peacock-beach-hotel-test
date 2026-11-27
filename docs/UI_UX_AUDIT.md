# UI and UX audit

**Date:** 2026-10-30  
**Method:** source review of public and admin components against `docs/peacock-cursor-guide/03-UI-UX-DESIGN-SYSTEM.md`.  
**Browser pass:** not completed in this audit. Layout claims below are from code structure, not from screenshots at 390/768/1440. Treat visual polish as **not verified**.

## What matches the design direction

- Tokens in `src/app/globals.css`: ink `#102F3A`, paper `#FAF8F4`, teal `#187C83`, sand `#D4B68A`, error and success colors from the guide.
- Headlines use Cormorant Garamond with Cyrillic; UI uses Source Sans 3 with Cyrillic (`src/app/[locale]/layout.tsx`).
- Public header, footer, and language switch preserve the path (`src/components/site/site-header.tsx`).
- Enquiry module states the staff-confirmation disclaimer and offers copy-to-clipboard (`src/components/site/enquiry-module.tsx`).
- Reduced motion is shortened in CSS.
- Buttons use a minimum height near 44px (`src/components/ui/button.tsx`).
- Empty copy exists for rooms, events, and reviews.
- Admin uses a simple sidebar/table layout rather than a purple SaaS gradient.
- Sonner toasts are mounted in `src/app/admin/layout.tsx`.

## Findings

### U-01 — HIGH — Public pages do not yet look like a photographic hotel site

- **Location:** home hero uses `/public/hero-placeholder.svg` (`src/app/[locale]/(site)/page.tsx`). About, restaurant, and contact are single text columns. Room cards have no image.
- **Cause:** client photography is correctly not invented, and the gallery component was not built.
- **Impact:** the current UI cannot meet the “premium editorial coastal” acceptance gate. It is an honest placeholder, not a finished marketing site.
- **Fix:** after licensed assets exist, full-bleed hero, room gallery, and restaurant imagery with alt text and reserved aspect ratios. Until then, keep the content-required labeling and do not add stock beach photos presented as the property.
- **Acceptance:** signed screenshots at 390, 768, and 1440 with real or explicitly labeled stand-in frames. No horizontal overflow. RU labels are not clipped.
- **Tests:** Playwright viewport screenshots once content exists. Keyboard tab order on header, enquiry, and review form.

### U-02 — MEDIUM — Admin room editor is not a resilient form

- **Location:** `src/components/admin/room-editor.tsx`.
- **Cause:** values are read with `document.getElementById` instead of controlled fields. Amenities, price display, image reorder, and inline field errors are absent. Publish and draft share one payload that clears amenities to `[]`.
- **Impact:** a save can wipe amenities. Validation errors from the API become a toast only, not field-level messages. There is no confirm step before publish.
- **Fix:** React Hook Form plus the existing Zod schema, inline errors, and a confirm dialog for publish.
- **Acceptance:** failed slug shows an inline error; amenities survive a description edit; publish asks for confirmation.
- **Tests:** component test for submit payload and error rendering.

### U-03 — MEDIUM — Missing loading, denied, and destructive states

- **Location:** public pages and admin tables.
- **Cause:** no skeleton components. Audit denial is an exception. Review approve/reject has buttons but no confirm dialog. Event and media pages have empty copy only.
- **Impact:** slow Mongo calls show a blank wait. Mistaken moderation is one click.
- **Fix:** suspense fallbacks on dashboard counts, confirm dialog for reject/archive, forbidden panel for audit.
- **Acceptance:** reject requires confirmation; audit denial is understandable without a stack trace.
- **Tests:** Playwright moderator reject flow.

### U-04 — LOW — Admin is English only

- **Location:** `src/app/admin/**`.
- **Cause:** the guide allows a language-neutral admin if Russian staff UI is not required.
- **Impact:** Russian-speaking staff get English admin labels.
- **Fix:** leave English until the client asks for RU admin. Document the decision in `docs/DECISIONS.md` (already notes admin is language-neutral).
- **Acceptance:** public EN/RU remains complete; admin strings are consistent English.
- **Tests:** none beyond public locale e2e.

### U-05 — LOW — Footer year is fixed

- **Location:** `src/components/site/site-footer.tsx` uses `2026` because `new Date()` broke prerender when cache components were enabled. Cache components are now off.
- **Cause:** prerender workaround.
- **Impact:** copyright year will be wrong after 2026.
- **Fix:** render the year on the client or read it inside a request-time segment.
- **Acceptance:** footer year matches the current calendar year without a prerender error.
- **Tests:** unit assertion or e2e text check.

## Accessibility notes (code only)

- Language is set on `<html lang>` from the locale.
- Enquiry and review errors use `role="alert"` in the client forms.
- Icon-only controls were not found.
- Focus rings are defined on buttons and inputs.
- Skip link, landmark naming on mobile nav, and contrast measurements were **not** tested with axe or a screen reader.

## Do not do in the visual pass

Do not add booking CTAs, “available tonight” badges, fake review aggregates, or stock photos described as Peacock Beach Hotel.
