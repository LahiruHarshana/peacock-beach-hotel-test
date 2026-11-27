# Production readiness

**Date:** 2026-11-02  
**Decision:** do not deploy. Technical checks on this workstation passed. Credential rotation, the production database user, hosting, backups, monitoring, and client content approval are still open.

## Commands

| Command | Result |
|---|---|
| `pnpm typecheck` | Exit 0. |
| `pnpm lint` | Exit 0. |
| `pnpm test` | Exit 0. 52 passed, 1 skipped (`tests/db/isolated-mongo.test.ts`). |
| `pnpm scan-secrets` | Exit 0. 172 tracked files. One git commit exists. There is no remote. |
| `pnpm audit --audit-level=high` | Exit 0. Two moderate `minimatch` findings remain. |
| `pnpm staging:preflight` | Exit 0. Database `peacock_beach_staging`. Cloudinary ping `ok`. |
| `pnpm staging:e2e` | Exit 0. 9 passed, 0 failed, 0 skipped. |
| `pnpm build` | Exit 0. |

`GET /api/health` on the local production server returned `{ "ok": true }` and did not check MongoDB. `GET /api/ready` returned `{ "ok": true, "database": "up" }` against the development database configured for that process. Production connectivity was not tested.

Mobile Lighthouse on that server, after a build with `APP_URL=http://127.0.0.1:3010`: `/en` performance 97, accessibility 100, SEO 100, LCP 2.6 s; `/ru` performance 94, accessibility 100, SEO 100, LCP 3.1 s. Details are in `docs/PERFORMANCE.md`.

## Release procedure

`docs/PRODUCTION_RELEASE_RUNBOOK.md` covers the production database user, secrets, indexes, seed, smoke tests, and rollback. Do not run the seed or index script against production until that runbook is approved.

## Still required

- Rotate previously exposed MongoDB, Cloudinary, and Auth.js secrets, replace the bootstrap admin password, and revoke old sessions.
- Decide MFA and account recovery.
- Provide approved hotel text, rooms, menus, photographs, address, and official WhatsApp and Telegram contacts.
- Approve the English and Russian pages.
- Create the private GitHub remote and confirm CI.
- Provision `peacock_beach_prod`, hosting, the domain, and HTTPS.
- Verify a backup restore into an isolated database and connect error monitoring.
