# Prioritized fix plan

Do not rebuild the app. Apply these in order. Each item should be its own small change set. Do not add booking or payments.

## Phase A — Stop false confidence and secret risk

1. **Rotate credentials** (human, outside the repo). Still required. Checklist is in `docs/PRODUCTION_READINESS.md`. Do not print current secret values.
2. **Scope lint** — done. `pnpm lint` checks `src` and `tests` and fails on warnings. `peacock-app/` is ignored by ESLint and should be deleted before the first git commit. The repository root is still not a git repo.
3. **Upload test** — done. It no longer passes when the server is down. It checks the permission matrix and image policy in process.

**Done when:** `pnpm lint`, `pnpm typecheck`, and `pnpm test` are honest, and production secrets are not the chat values.

## Phase B — Authorization and publish integrity

4. Done. `requireAdminPermission` loads the staff record and uses `resolveStaffAccess`.
5. Done. Create forces `DRAFT`. PATCH drops client `status`. Publish routes own the transition.
6. Done. Publish requires a `publicId` present in `media_assets`, plus EN/RU alt text. The placeholder image payload was removed.
7. Done. Completion rejects formats outside JPEG/PNG/WebP/AVIF and files over 8 MB, and asks Cloudinary to delete the rejected asset.
8. Done for a single instance. Login attempts use the Mongo rate-limit collection (8 per 15 minutes per normalized email). Admin mutations with an `Origin` header must match `APP_URL`. There is still no multi-instance limiter and no MFA.

**Done when:** tests cover disabled user, moderator room write (403), status spoof (stays draft), stale version (409), anonymous upload sign (401), and unverified image publish (422).

## Phase C — Staff workflows required by the proposal

9. Done. OWNER settings page at `/admin/settings`.
10. Done. Event list, create, edit, publish, and confirmed delete.
11. Done. Media library upload with progress, preview, retry, and attach on room and event forms.
12. Partial. Room form keeps amenities, shows API field errors, and confirms before publish. It does not use React Hook Form yet.
13. Done. Audit is hidden without `audit:read` and renders a denied message otherwise.
14. Done. Public room pages no longer substitute sample cards.

**Done when:** a staff user can set contacts, upload one image, publish one bilingual room, publish one event, and moderate one review without a database console. Public EN and RU pages show that room and event and no sample card.

## Phase D — SEO, UX polish, and release gates

15. JSON-LD only for fields stored in settings and published content. Omit rating and price when absent. Add Open Graph title/description. Drive `images.remotePatterns` from the cloud name env var.
16. Room and event galleries with `next/image`, alt, and dimensions.
17. Report-only CSP is sent. Do not enforce it until a browser pass shows no required violations. HSTS only on HTTPS.
18. Playwright: `/en`, `/ru`, path-preserving language switch, enquiry disclaimer, admin login failure, draft room 404.
19. GitHub Actions for lint, typecheck, test, and build.
20. Replace `CONTENT REQUIRED` only with client-approved copy. Then re-run Lighthouse and axe and record the numbers in this file.

**Done when:** `docs/PRODUCTION_READINESS.md` blockers are checked off with command logs, not assumptions.

## Explicitly out of scope

Booking engine, payments, live inventory, customer accounts, restaurant table reservations, and a third language.
