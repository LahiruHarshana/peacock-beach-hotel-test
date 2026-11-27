# Peacock Beach Hotel — Cursor Engineering Playbook

**Status:** implementation plan, not implemented source code. **Source:** Peacock Beach Hotel Website Design & Development Proposal, 24 October 2026, 11 pages.

## Mission
Build a visually exceptional yet restrained, fast, accessible, secure bilingual (English/Russian) direct-enquiry hospitality website for a 27-room beachfront property in Unawatuna, Sri Lanka. Deliver a single Next.js TypeScript codebase containing public web pages, server-only business logic/route handlers, and a secured admin dashboard. MongoDB Atlas stores application data; Cloudinary stores images/videos.

## Read in order
1. `AGENTS.md` — binding Cursor implementation instructions.
2. `01-SCOPE-AND-ACCEPTANCE.md` — proposal-derived requirements, exclusions, acceptance criteria.
3. `02-ARCHITECTURE-AND-STACK.md` — one-app architecture, patterns, folder tree.
4. `03-UI-UX-DESIGN-SYSTEM.md` — UI-first phase, page-by-page art direction.
5. `04-DATABASE-AND-DATA-CONTRACTS.md` — MongoDB collections, indexes, schemas.
6. `05-AUTH-SECURITY-AUTHORIZATION.md` — sessions, RBAC, document-level isolation.
7. `06-API-VALIDATION-ERRORS-NOTIFICATIONS.md` — actions, API contracts, alerts.
8. `07-SEO-I18N-PERFORMANCE-ACCESSIBILITY.md` — English/Russian SEO and quality.
9. `08-MEDIA-CLOUDINARY.md` — Cloudinary signed uploading lifecycle.
10. `09-TESTING-QA-RELEASE.md` — release gates and test matrix.
11. `10-DELIVERY-ROADMAP.md` — milestone by milestone execution.
12. `11-CURSOR-PROMPTS.md` — copy-paste prompts for Cursor Agent.
13. `12-ENV-OPERATIONS-VERSION-CONTROL.md` — env setup, Git, CI, backups.
14. `13-SECURITY-CODE-EXAMPLES.md` — illustrative complete focused TS modules, adapted to installed package APIs.
15. `14-TRACEABILITY-AND-DECISIONS.md` — scope matrix and unresolved client inputs.

## Development philosophy
UI direction approved first; secure data and auth foundation second; vertical feature slices third; audit and deployment last. Prefer simple production-grade solutions over needless complexity. Do not claim “100% secure” without evidence; launch only after every applicable acceptance gate passes.

## Design principle
Premium editorial coastal hospitality, **not** an AI-generated dashboard aesthetic. No gratuitous purple gradients, glassmorphism everywhere, animated blobs, crowded cards, exaggerated shadows or placeholder testimonials.

## Scope integrity
This is an **enquiry-led** website: WhatsApp and Telegram handoff; hotel staff confirms room availability/pricing manually. Do not silently add payment processing, automated booking, real-time inventory, OTA integrations, or restaurant table reservations. These are explicitly excluded in the signed proposal unless separately commissioned.

## Source-of-truth references
- PDF pp. 2–5: business, public pages, enquiry and language flow.
- PDF p. 6: admin content management.
- PDF p. 7: SEO/Yandex.
- PDF p. 8: four-week delivery.
- PDF pp. 9–11: pricing, maintenance and exclusions.
- Official Next.js authentication guidance: https://nextjs.org/docs/app/guides/authentication
- Cloudinary signed upload guidance: https://cloudinary.com/documentation/client_side_uploading
- Auth.js: https://authjs.dev/getting-started
- MongoDB: https://www.mongodb.com/docs/
