# 10 — Cursor-first phased implementation roadmap

**Original proposal:** four weeks subject to receiving content/approvals; do not promise faster or broader delivery solely due to AI tooling. Secure quality may require additional time.

## Phase 0 — Audit and discovery (Day 0–1)
- Check repository/branch, lockfiles, existing code, dependency versions, CI and all 11 proposal pages.
- Create `docs/DECISIONS.md`, `docs/PROGRESS.md` and issue tracker with requirement IDs.
- Get real hotel content inventory; flag missing items, never fabricate.
- Decide exact auth provider, hosted Next.js runtime, domains and Cloudinary policy.
**Gate:** architecture and content gaps approved.

## Phase 1 — UI / visual implementation FIRST (Week 1)
- Tokens, font Cyrillic test, header/footer, reusable CTA.
- Build high-fidelity homepage and rooms / detail screens with explicit sample data isolated from production build.
- Build rest of public page sections and polished admin layout with fake *clearly labeled* placeholders.
- Screenshots at 390/768/1440; test keyboard and responsive behavior; gather approval.
**Gate:** approved visual direction and component library, no fake production text.

## Phase 2 — Infrastructure, DB, auth, security (Week 2, alongside core public pages)
- Atlas DB and indexes, DAL/projections, strict Zod.
- Admin invite/provisioning, session security, roles, permission tests, audit.
- Cloudinary signed upload and verification; route handlers and error formatting.
- Connect approved rooms/restaurant/about/contact content; images optimized.
**Gate:** no unauthenticated access to admin data, critical negative tests pass.

## Phase 3 — Full features and bilingual content (Week 3)
- Room and event CMS, publish flow, review form/moderation.
- Enquiry form, verified WhatsApp + Telegram links, copy fallback.
- Complete EN/RU translation, alt text, message translations and QA.
- Admin UX state handling, loading/error/retry, media workflows.
**Gate:** all proposal features working on staging, approved client copy.

## Phase 4 — SEO, assurance, launch (Week 4)
- Metadata/sitemap/robots/hreflang/JSON-LD.
- Rate limits, CSP and headers, brute force checks, dependency scan, backups and monitoring.
- E2E, security, accessibility, mobile, browser/device, Lighthouse.
- Client UAT, domain, DNS, SSL, smoke tests, rollback runbook and training.
**Gate:** signed content acceptance + release checklist green.

## Postlaunch and maintenance
Monthly health, dependency updates, backup check, contact links, small content updates and technical SEO checks. Original maintenance LKR 12,000/month excludes infrastructure and major changes.

## Scope control
Treat booking engine, payment gateway, OTA integrations, table reservations and customer accounts as separately priced phase 2 extensions, not phase 1 work.
