# 07 — Technical SEO, Russian market, i18n, performance

## Proposed URLs
- `/en`, `/ru`
- `/en/about`, `/ru/about`
- `/en/rooms`, `/ru/rooms`, `/en/rooms/{slug}`, `/ru/rooms/{slug}`
- `/en/restaurant`, `/ru/restaurant`
- `/en/reviews`, `/ru/reviews`
- `/en/events`, `/ru/events`, localized event slugs if editorialized and cross-locale mapping is managed
- `/en/contact`, `/ru/contact`
- `/admin` (may be language-neutral) plus login — blocked from indexing.

## SEO acceptance
- Per-page, per-locale meaningful `<title>`, description, 1 H1, proper hierarchy and canonical URL.
- hreflang `en`, `ru` plus optional `x-default` only with correct corresponding URLs; translated slugs must map to each other accurately.
- `robots.txt` only blocks private areas; sitemap contains **published, indexable canonical** pages and alternate locale entries; no drafts/admin.
- Implement `Hotel`/`LodgingBusiness`, `Restaurant`, `BreadcrumbList` and `Event` structured data only when accurate and eligible; no fabricated stars, ratings, pricing or review schema.
- Media alt descriptions, descriptive filenames (where useful), open graph previews, favicon, metadata social share.
- Yandex Webmaster and Google Search Console verification after client provides account access; submit sitemap and diagnose indexation. No ranking promises.
- Russian human-reviewed localization of high-value copy and enquiry CTA; Cyrillic font support, culturally neutral content, verified destination names; no machine-translation claim of accuracy without approval.
- Preferred initial deployment **one primary domain** with `/en` and `/ru`; a separate `.ru` domain only after ownership/legal/deduplication decision; prevent duplicate site indexing.
- Avoid writing unsupported claims like “best hotel” or “top five” as objective truth; proposal explicitly disclaims ranking guarantees.

## Performance budgets (initial aspirational gates; verify devices)
- Aim Core Web Vitals at p75: LCP <=2.5s, INP <=200ms, CLS <=0.1; use CrUX when traffic is available.
- Hero image responsive WebP/AVIF when supported; poster-first video and avoid auto video on constrained devices.
- Minimize client components; avoid shipping gallery/admin JS to all public routes; localize content server side for search crawlers.
- Cache public read queries and revalidate after publishing; no public caching of sessions or pending reviews.
- Lazy load offscreen gallery/images and noncritical map embeds; reserve size to prevent layout shifts.

## Accessibility gates
- Target WCAG 2.2 AA, including contrast, keyboard paths, visible focus, locale language attributes, link names, alt text, input errors and labels, screen-reader announcement, headings/landmarks and reduced-motion.
- Test with keyboard, axe and manual screen reader. EN and RU both audited.
