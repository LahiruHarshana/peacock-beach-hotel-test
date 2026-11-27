# Test coverage

**Date:** 2026-10-30  
**Rule:** only commands executed in this audit are marked pass or fail. Older build success from the implementation session is historical and not re-cited as this audit’s production build.

## Commands executed this audit

| Command | Result |
|---|---|
| `pnpm typecheck` (`tsc --noEmit`) | Pass. No output. |
| `pnpm exec eslint "src/**/*.{ts,tsx}"` | Fail as a clean gate: **0 errors, 9 warnings**. Exit code was 0 because warnings are not errors. |
| `pnpm lint` (package script `eslint` with default discovery) | **Fail.** 29 errors, 13 warnings. Errors are outside `src` (generated types and the leftover `peacock-app` tree are included by the unscoped script). |
| `pnpm test` (`vitest run`) | **Pass on 2026-11-02.** 4 files, 15 tests. Includes disabled/revoked staff, origin allowlist, and unverified room publish. |

## Unit tests that actually ran

| File | Cases | Result |
|---|---|---|
| `tests/unit/roles.test.ts` | Moderator cannot `rooms:write`; editor can; owner can `audit:read` | Pass |
| `tests/unit/schemas.test.ts` | Checkout before check-in rejected; review without consent rejected; unknown `role` field rejected | Pass |

## Integration test that does not prove its claim

`tests/integration/upload-auth.test.ts` fetches `http://127.0.0.1:3000/api/admin/uploads/sign`. If the server is down, the `catch` sets the assertion to `expect(true).toBe(true)` and **passes**. During `pnpm test` no dev server was running, so this test did not observe a 401. Treat UPLOAD-01 as **not verified**.

## Not executed this audit

| Suite | Status |
|---|---|
| `pnpm test:e2e` (Playwright) | **3 passed** on 2026-11-02 after the enquiry assertion was pointed at `/en/rooms`. |
| `pnpm build` | **Pass** on 2026-11-02. Static pages still render if Atlas DNS is unavailable because public reads catch connection errors. |
| axe / Lighthouse | Not run. |
| API tests for 401/403/409/publish spoof | Not written, except the non-proving upload test. |
| Mongo integration tests | Not written. Vitest has no Mongo memory server. |

## Guide cases versus evidence

| ID | Expected | Evidence |
|---|---|---|
| AUTH-01 | Anonymous admin API is 401 | Code calls `requireAdminPermission`. Test does not reliably call the server. **Not verified.** |
| AUTH-02 | Moderator cannot edit a room | Permission matrix unit test only. No HTTP test. |
| AUTH-03 | Role in body cannot escalate | Review schema unit test rejects `role`. No user-update API exists to escalate. |
| AUTH-04 | Disabled user blocked | **Not implemented** (JWT). No test. |
| CONTENT-01 | Draft slug is 404 | Code filters `PUBLISHED` in `getPublishedRoomBySlug`. No test. |
| REVIEW-01 / 02 | Pending hidden publicly | Code sets `PENDING` and public query uses `APPROVED`. No test. |
| UPDATE-01 | Stale version is 409 | Code in repositories. No test. |
| UPLOAD-01 / 02 | Anonymous sign denied; spoofed URL rejected | Sign route checks auth. Complete uses Cloudinary API. Tests not verified. |
| ENQUIRY-01 | Bad date order | Zod unit test pass. |
| SEO-01 / 02 | hreflang and admin noindex | Metadata helper and admin `robots` metadata exist. No rendered HTML test. |

## Required additions before a release claim

1. Delete the pass-on-network-failure branch in the upload test.
2. Add route tests with a mocked session for 401, 403, 409, and publish spoof.
3. Add Playwright for `/en`, `/ru`, language switch, enquiry disclaimer, and failed admin login.
4. Scope `pnpm lint` to `src` and fail on warnings.
5. Run `pnpm build` on the CI runner and store the log.
