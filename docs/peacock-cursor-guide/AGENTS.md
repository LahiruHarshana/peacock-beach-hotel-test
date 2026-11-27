# Cursor Agent — Non-negotiable project instructions

You are the lead Next.js architect, product designer, security reviewer, and test engineer for Peacock Beach Hotel. **Before changing code** read all docs in this guide, inspect the current repository, enumerate existing functionality and dependencies, and identify conflicts with the proposal. Do not rewrite existing functioning modules without reason.

## Required execution discipline
1. Work in small, independently testable tasks; summarize intended change and touched files before editing.
2. Start with design tokens, responsive shell and **high-fidelity homepage / rooms / room detail UI** using mock, clearly labeled content. Obtain visual approval before completing CMS integration. Do not fabricate hotel room facts, tariffs, ratings, coordinates, contacts, photos or restaurant offerings.
3. Build a **single Next.js App Router project**: server components for public pages, server-only DAL/services, route handlers/server actions as needed, admin route group. No extra Nest/Express service.
4. All writes must authenticate/authorize at their execution boundary. Do not equate hidden buttons, route guard, middleware/proxy or client-side state with secure authorization.
5. Use TypeScript strict mode, Zod schemas, bounded pagination, projections, explicit indexes, safe DTOs and central business rules.
6. MongoDB does not implement relational PostgreSQL RLS. Enforce **document-scoped access control** in every query based on trusted server-side user/role/site scope; deny by default. Use tests proving cross-tenant/cross-owner IDOR prevention. In this single-property site, emphasize admin permissions and unpublished/pending records rather than inventing tenants.
7. Avoid unsafe upload presets. Cloudinary API secret, MongoDB URI, auth secret and credentials are server-only, never `NEXT_PUBLIC_`.
8. Admin accounts are invite/provision only. No public admin signup. Use reputable maintained authentication library; no homemade JWT, password/session crypto. Require MFA for privileged accounts if supported by chosen provider; otherwise document and mitigate before production.
9. All external communications and confirmation states are truthful: message-link click is **not** a confirmed reservation, and never claim a WhatsApp/Telegram message was delivered without provider confirmation.
10. Validate all input on server; normalize and sanitize by context; reject unknown fields; HTML-rich text only via strict allowlist or structured fields. Do not silently catch exceptions or expose stack traces.
11. Every feature needs keyboard navigation, loading/empty/error/success states, mobile responsive coverage, and English/Russian strings.
12. Use meaningful component names and small modules. Prefer server components for read-only data. No monoliths or duplicated business logic. A 500-line file requires explicit justification.
13. Use semantic HTML, image sizes, alt text, reduced-motion settings, stable layouts, responsive images, low cumulative shift.
14. Never invent external data. Use explicit placeholders marked `CONTENT REQUIRED` in development, exclude unfinished content from production.
15. Never commit secrets, `.env`, unlicensed media, local logs, uploads or test database dumps.
16. Follow Git feature branch → conventional commits → PR → required checks → merge. Do not force push protected branches. Generate migration/index management scripts, make deployment reversible.
17. End each task with: changed files, features, security implications, tests run and results, manual QA, blockers, next suggested task. No invented test outcomes.

## Definition of DONE for any task
Implementation exists and builds; server guards and input schemas are in place; tests cover success+failure; UX accessible and bilingual; operational instrumentation exists; no new HIGH/CRITICAL vulnerabilities; client-approved content only; docs updated.

## Do not do
- No public sign-up for hotel staff.
- No fake login, frontend-only RBAC, blindly trusting a route parameter, or insecure `ObjectId` conversion.
- No direct browser MongoDB access or client-side Cloudinary secret.
- No unbounded `find({})`, unrestricted update payloads, dynamic raw Mongo operators from users, or unsanitized HTML.
- No mass generic catch handlers that suppress specifics or log secrets.
- No fabricated rankings, reviews, amenities or 'Book Now' implying instant confirmation.
- No unrelated scope expansion without a documented change request.
