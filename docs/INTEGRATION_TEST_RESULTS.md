# Integration test results

**Date:** 2026-11-02  
**Where:** this workstation. GitHub Actions has not run. There is no git remote.

## Commands

| Command | Result |
|---|---|
| `pnpm typecheck` | Exit 0. |
| `pnpm lint` | Exit 0. |
| `pnpm test` | Exit 0. 52 passed. 1 skipped: `tests/db/isolated-mongo.test.ts`, because no local `mongod` is running. |
| `pnpm scan-secrets` | Exit 0. 172 tracked files. |
| `pnpm audit --audit-level=high` | Exit 0. Two moderate `minimatch` findings remain under ESLint. |
| `pnpm staging:preflight` | Exit 0. `peacock_beach_staging`. Cloudinary ping `ok`. Secret not printed. |
| `pnpm staging:auth-check` | Exit 0. |
| `pnpm staging:e2e` | Exit 0 on the final Phase 07 run. 9 passed, 0 failed, 0 skipped. |
| `pnpm build` | Exit 0. 39 pages. |

## Feature matrix

| Feature | Result |
|---|---|
| Review form after a successful submit | VERIFIED. The null `currentTarget.reset()` path is covered by a unit test, and the staging browser test reported no page error. |
| Review kept after a failed submit | VERIFIED in Playwright. |
| Review moderation | VERIFIED. A guest review stayed pending until the moderator approved it. |
| Owner login and logout, disabled staff, revoked session | VERIFIED on staging. |
| Editor and moderator restrictions | VERIFIED on staging. |
| Room create, incomplete publish, publish, unpublish | VERIFIED on staging with `e2e-` records, then those records were removed. |
| Event create and publish | VERIFIED on staging. |
| Cloudinary upload to `peacock-test/` | VERIFIED. A generated PNG was signed, completed, shown on the public room page, unpublished with the room, and deleted. Deletes of `peacock/prod/` and `peacock/dev/` returned 403. A follow-up list of `peacock-test/` returned 0 assets. |
| Audit log | The media delete writes an audit row. The event spec still checks the “Created event” audit cell. |
| Shared rate-limit counter on a local MongoDB | NOT TESTED. The isolated suite was skipped. |
| CI on GitHub | NOT TESTED. `.github/workflows/ci.yml` runs lint, typecheck, unit tests, secret scan, high audit, public and admin Playwright, and build, using dummy secrets and `mongo:7`. |
| Production Core Web Vitals | NOT TESTED. Local lab numbers are in `docs/PERFORMANCE.md`. |
