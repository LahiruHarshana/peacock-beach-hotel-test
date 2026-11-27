# 05 — Authentication, access control, security architecture

## Essential note: RLS vs MongoDB
MongoDB Atlas does not offer PostgreSQL SQL `CREATE POLICY` / `ENABLE ROW LEVEL SECURITY` for this application. Do **not** claim native RLS. Achieve document-scoped isolation via server-enforced allowlists, role checks and query filters in a DAL; integrate tests and least-privilege Atlas credentials. Avoid sending MongoDB credentials to browsers.

## Authentication
- No public customer account registration (proposal excludes customer accounts).
- Staff identity provisioned by OWNER/invite or admin bootstrap flow with no static default password; bootstrap once via secured operational process.
- Prefer managed auth with passkeys/MFA or maintained Next.js auth library with suitable MongoDB adapter and reviewed identity flow. Verify actual package versions/APIs during implementation; do not assume beta/major compatibility.
- Session: HTTP-only `Secure` cookie in prod, `SameSite=Lax` or stricter as flow allows, session rotation/revocation, expiry, logout, invalidation on disable, role changes verified against DB at sensitive writes.
- Credentials if used: Argon2id with current recommended parameters, password rate limit/lockout, no timing reveals, password reset expiration and single-use token; never homebrew token crypto. Prefer MFA for all privileged access.
- Mutations: verify session, permission, CSRF protections where relevant (built-in auth defenses plus Origin/Host validation), input Zod validation, safe concurrency and audit record.

## Capability matrix
| Action | OWNER | EDITOR | REVIEW_MODERATOR | Anonymous |
|---|---:|---:|---:|---:|
| Public published content read | yes | yes | yes | yes |
| Draft room/event read | yes | yes | no | no |
| Create/update/publish room | yes | yes | no | no |
| Create/update/publish event | yes | yes | no | no |
| Approve/reject reviews | yes | no* | yes | no |
| Staff management/site settings | yes | no | no | no |
| Submit review | yes | yes | yes | yes (rate-limited) |
| Read audit logs | yes | no | no | no |

`*` Adjust role policy only with explicit owner approval. Allow multi-role capability composition if required, but deny by default.

## Threat model and defense matrix
- **IDOR/BOLA:** re-check capability and ownership/scope on *each object fetch and write*, not merely route access.
- **Mass assignment:** server-side pick/strict schema, no client-provided `role/status/owner` without permission.
- **NoSQL injection:** strictly typed scalar inputs, never accept query operators; no direct user-generated Mongo filters.
- **XSS:** React escaped content, server sanitized rich text if absolutely needed, CSP phased to `report-only` then enforced with nonce/hash strategies compatible with Next.js; no untrusted `dangerouslySetInnerHTML`.
- **CSRF:** framework/provider protections, Origin check on state-changing routes, authenticated cookie strategy, no unsafe GET mutations.
- **Brute force/spam:** distributed limits for login, reviews, upload signatures; honeypot optional, CAPTCHA only if needed with privacy review.
- **Uploads:** signed, short-lived, strictly scoped Cloudinary params, MIME/dimension/size quotas, ownership and cleanup.
- **Secrets:** `.env` untracked, secret scanning in CI, Atlas user credential rotation, least privilege, network restrictions.
- **Logging:** JSON logs with correlation IDs; redact auth headers, cookies, PII, content where unnecessary; restricted audit access.
- **Headers:** HSTS after TLS, CSP based on tested external domains, nosniff, `Referrer-Policy`, frame policy, Permissions-Policy.
- **Abuse:** output encoding, error mapping without internals, request-size limits, separate admin/private caching rules.
- **Supply chain:** lockfile, dependabot/renovate, `npm/pnpm audit` with vetted decisions, PR review, no untrusted scripts without review.

## Authorization implementation requirements
Create server-only `requireAdminPermission(permission)` and explicit methods like `listPublishedRooms`, `getRoomForEditor`, `updateRoomIfVersionMatches`. Never export raw collection access to client or UI modules. Public API must never reveal drafts/pending reviews or unpublished media by guessing IDs.

## Security release blocking tests
Anonymous POST to admin endpoints => 401; logged-in wrong role => 403; malformed IDs => 400; nonexistent resource => 404; stale `version` => 409; cross-role update forbidden; spoofed role payload rejected; unauthenticated upload signature denied; app restart/session revocation behaves as expected; no secret in built client bundle or logs.
