# 03 — UI-first, high-end hospitality visual direction

## Design intent
Peacock Beach Hotel should feel like a credible premium beachfront property, not a template marketplace or SaaS admin dashboard. Communicate sea, place, calm, and trust. Original hotel photos and authentic content are the core visual differentiator. Do not invent photographic representations of the property in final production.

## Design foundations — suggested tokens (subject to brand approval)
- Primary ink `#102F3A` (deep ocean); secondary text `#53656B`; paper `#FAF8F4`; white `#FFFFFF`; coastal teal `#187C83`; warm sand `#D4B68A`; border `#E5E6E2`; error `#B42318`; success `#117744`.
- Typography: elegant serif headline (e.g. licensed/publicly usable family) + modern sans for UI. Cyrillic glyph coverage mandatory: test EN/RU fallbacks.
- Spacing: 4/8px rhythm; desktop page width ~1280px; generous white space; crisp readable prose max width.
- Buttons: prominent filled primary and quiet secondary; meaningful focus and disabled states; tap targets >=44x44 CSS px where practicable.
- Imagery: full-bleed property photography with verified license, responsive `sizes`, descriptive alt, deliberate crops, limited video autoplay, poster fallback, user reduced-motion preference.
- Motion: subtle 150–250ms for interaction only, no excessive parallax, preserve reduced-motion.

## First visual deliverables (do before building APIs)
1. Moodboard/reference board and tokens; sample responsive header/booking CTA/navigation.
2. Homepage @ 390px, 768px, 1440px; include full page: photo-led hero, clear direct-enquiry callout, trust, rooms, restaurant, event, review, local context, footer.
3. Room listing + room detail: legible room data, amenities/capacity, media gallery, contextual enquiry module; clear line between inquiry and instant booking.
4. Restaurant, events and contact visual systems.
5. Admin shell: collapsible sidebar (desktop), sheet nav (mobile), overview cards, readable tables, forms, responsive media manager, status chips, review moderation.
6. Create screenshot diff baseline and seek review. Only then connect MongoDB and CMS.

## Page specifications
- **Home:** meaningful H1, immersive approved media, one primary ‘Enquire about rooms’ CTA, hero text over accessible gradient *for readability only*, language switch preserving path.
- **Rooms:** graceful card grid, no fake ‘available tonight’ badge; optional client-approved feature/category filter; no fake live occupancy.
- **Room detail:** gallery/lightbox, occupancy, amenities, published price with currency/price caveat, two contact buttons, date and guest form (enquiry only), policy excerpt.
- **Restaurant:** real menu sections with client-approved price information; food visual rhythm; no fake table-booking CTA.
- **Reviews:** only approved records; avoid fake star aggregates, use clear submission form states.
- **Events:** upcoming/past distinction and localized event pages with validated dates.
- **Contact:** official contacts, map link, transparent third-party embed permission as appropriate.

## Interaction states
All pages: loading skeleton only when beneficial, meaningful empty state, inline errors, recoverable retry, clear success. Admin destructive actions require confirmation, show context and undo when safe; toast never substitutes for persistent inline form errors. Consider ‘changes saved’ vs ‘published’ distinct statuses.

## Responsive/accessibility release gates
At 320, 375, 390, 768, 1024, 1440 CSS pixels: no horizontal overflow, legible text, accessible navigation/modal, working tap targets, adequate contrast, sensible image aspect, keyboard navigation, locale text expansion. RU copy can be longer than EN: no truncated CTAs.
