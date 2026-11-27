# Security audit

**Date:** 2026-10-30  
**Method:** static review of auth, DAL, API routes, Cloudinary signing, headers, and env handling. No exploit payloads were executed against Atlas or Cloudinary. Secrets are not reproduced here.

MongoDB has no PostgreSQL row-level security. Isolation depends on server filters. Public room/event queries filter `status: "PUBLISHED"`. Public reviews filter `moderationStatus: "APPROVED"`. That pattern is present in the repositories. It is not covered by integration tests against a database.

## Controls that are in place

- Passwords hashed with `@node-rs/argon2` (`src/lib/auth/password.ts`). Verification failures return false instead of throwing to the client.
- No public registration route. Owner bootstrap is `scripts/seed-admin.ts` and refuses to reset an existing email.
- Admin JSON routes call `requireAdminPermission` before writes (`src/lib/auth/session.ts`).
- Zod `.strict()` DTOs reject unknown fields, including a client `role` on public reviews (`tests/unit/schemas.test.ts`, executed: pass).
- Object ids checked with `ObjectId.isValid` before queries.
- Optimistic updates match `{_id, version}` and return 409 when unmatched.
- Cloudinary secret is read only via `getEnv()` in server modules. Sign route requires `media:write`. Complete route loads the asset from Cloudinary and checks the `peacock/{category}` prefix.
- `.gitignore` ignores `.env*` except `.env.example`. `.env.example` contains placeholders only.
- Response mapper logs a generic message plus `requestId`, not the error object (`src/lib/errors/api.ts`).
- Security headers set in `next.config.ts`: `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, locked Permissions-Policy.

## Findings

### S-01 — HIGH — Role and account status live in the JWT and are not rechecked

- **Location:** `src/lib/auth/auth.ts` `jwt` and `session` callbacks (approximately lines 57–71). `requireAdminPermission` trusts `session.user.role`.
- **Cause:** credentials login copies `role` into the token once. Later requests do not load `users.status` or `users.role`.
- **Impact:** disabling a staff user or demoting an owner does not take effect until the 8-hour JWT expires. A missing role defaults to `EDITOR`, which can write rooms.
- **Fix:** on each privileged request, load the user by id and require `status: "ACTIVE"` plus the current role. Do not default a missing role to `EDITOR`.
- **Acceptance:** a user flipped to `DISABLED` receives 401 on the next admin API call. A moderator token cannot gain `rooms:write` by an old claim.
- **Tests:** AUTH-04 with a test database.

### S-02 — HIGH — Login has no rate limit or lockout

- **Location:** `src/lib/auth/auth.ts` `authorize`; no call to `consumeRateLimit`.
- **Cause:** only review and enquiry routes use `src/server/services/rate-limit.ts`.
- **Impact:** online password guessing against staff emails.
- **Fix:** per-email and per-IP limits with a generic error. Document that the current limiter is not safe for multiple server instances (read-then-insert race, and `x-forwarded-for` is spoofable if the host is not a trusted proxy).
- **Acceptance:** repeated failures return 429 without indicating whether the email exists.
- **Tests:** AUTH brute-force case.

### S-03 — HIGH — Publish and media integrity gaps

- **Location:** same as F-01 and F-02 in `docs/FULL_AUDIT_REPORT.md`. `src/lib/media/cloudinary.ts` does not sign `max_file_size`.
- **Cause:** content status is client-controlled; images are not joined to `media_assets`.
- **Impact:** unpublished or fake media can be treated as public catalogue data. Oversized uploads are not bounded in the signature.
- **Fix:** server-owned status transitions; verify `publicId` against Cloudinary metadata already stored; sign a byte cap.
- **Acceptance:** spoofed `secureUrl` on complete is ignored (server uses Cloudinary’s URL). Unknown public ids cannot be attached to a published room.
- **Tests:** UPLOAD-02 and publish guard tests.

### S-04 — MEDIUM — No Content-Security-Policy or HSTS

- **Location:** `next.config.ts` `headers()`.
- **Cause:** only a subset of headers from the guide were added. HSTS is omitted until TLS is confirmed, which is reasonable for localhost and unsafe to skip on the production host.
- **Impact:** weaker XSS containment. No HSTS on the future HTTPS site unless the platform adds it.
- **Fix:** report-only CSP first, then enforce with nonces compatible with Next.js. Enable HSTS only on the production HTTPS deployment.
- **Acceptance:** response includes a CSP that still allows Cloudinary images and Next scripts. Staging HTTPS sends HSTS.
- **Tests:** header assertion in e2e or a route test.

### S-05 — MEDIUM — Rate limiter is not atomic and trusts a client IP header

- **Location:** `src/server/services/rate-limit.ts`; callers in enquiry and review routes use `x-forwarded-for`.
- **Cause:** count and insert are separate. The header is not taken from a platform-trusted hop.
- **Impact:** concurrent requests can exceed the limit. Attackers can rotate the header if the app is reached directly.
- **Fix:** one atomic upsert with a window key, or a managed limiter before production. Use the platform’s real client IP.
- **Acceptance:** 6th review in a window is 429 under a concurrent test.
- **Tests:** integration test with a test database.

### S-06 — MEDIUM — CSRF relies on cookie defaults only

- **Location:** admin `fetch` calls in client components; route handlers do not check `Origin`.
- **Cause:** no explicit Origin/Host allowlist. Auth.js session cookies are expected to be `SameSite=Lax` and `HttpOnly`, which blocks typical cross-site POSTs.
- **Impact:** if cookie flags are ever relaxed, state-changing routes would be exposed.
- **Fix:** reject admin POST/PATCH/DELETE when `Origin` is present and not `APP_URL`. Confirm cookie flags in a staging response.
- **Acceptance:** a cross-origin POST with a session cookie is 403.
- **Tests:** route test with a forged Origin. Cookie flags were **not** observed in this audit (no browser session captured).

### S-07 — MEDIUM — Development secret quality and credential handling

- **Location:** local `.env.local` (gitignored). `AUTH_SECRET` length passes Zod (`min(32)`) but the development value is a memorable placeholder. Atlas and Cloudinary credentials were pasted into chat during setup.
- **Cause:** local bootstrap. The repository root is **not** a git repo yet, so those values are not in a commit. `.env.example` is safe.
- **Impact:** anyone with the chat transcript or the developer machine can use the Atlas user and Cloudinary secret. A predictable `AUTH_SECRET` forges admin JWTs if that value is deployed.
- **Fix:** rotate the Atlas password and Cloudinary API secret. Generate `AUTH_SECRET` from a CSPRNG per environment. Do not print bootstrap passwords into docs or chat.
- **Acceptance:** production env fails `verify-env` if `AUTH_SECRET` equals the known development placeholder. Rotated credentials are stored only in the host secret manager.
- **Tests:** env schema unit test for the placeholder rejection in production.

### S-08 — LOW — Audit page and logs

- **Location:** `src/server/audit/write-audit-log.ts` stores actor id, action, target id, request id, and a short summary. Passwords are not written.
- **Cause:** summaries include slugs, which is acceptable. The audit page is not role-gated in the navigation (see F-07).
- **Impact:** low data exposure. Editors should not see the log.
- **Fix:** OWNER-only navigation and a caught 403.
- **Acceptance:** log documents contain no password, cookie, or API secret fields.
- **Tests:** snapshot of an audit insert in a unit test with a fake collection.

## Items checked and not found

- No `dangerouslySetInnerHTML` under `src`.
- No `NEXT_PUBLIC_` secret variables in `.env.example` or `src`.
- No route that accepts Mongo operators from JSON bodies; updates use explicit `$set` objects built on the server. A client `$set` key would be rejected by `.strict()` on known DTOs.
- Public review text is rendered as React text nodes, which escape HTML.

## Not verified

- Live cookie flags, TLS, Atlas network allowlist, Cloudinary unsigned presets in the Cloudinary console, dependency `pnpm audit`, and secret scanning in CI. CI does not exist.
