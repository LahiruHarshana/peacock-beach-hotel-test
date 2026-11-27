# Engineering decisions

| Date | ID | Decision | Reason |
|---|---|---|---|
| 2026-10-30 | D01 | Single Next.js App Router app | Matches proposal and cursor guide |
| 2026-10-30 | D02 | MongoDB native driver + Zod | Guide default; explicit queries |
| 2026-10-30 | D03 | Auth.js credentials + JWT sessions | Credentials provider requires JWT strategy |
| 2026-10-30 | D04 | Public locales `/en` and `/ru`; admin at `/admin` | SEO + separate staff boundary |
| 2026-10-30 | D05 | Cloudinary signed upload + server verify | No unsigned presets or client secrets |
| 2026-10-30 | D06 | MFA documented as gap | Credentials-only auth until provider supports MFA |
| 2026-11-02 | D07 | Re-read staff status, role, and tokenVersion on every privileged request | JWT claims alone must not authorize a disabled or demoted account |
| 2026-11-02 | D08 | CSP is report-only until browser evidence | Next.js still needs inline scripts and styles; enforcing now would break the site |
| 2026-11-02 | D09 | No self-service password reset | No mail provider is configured. Recovery is an operator action: `STAFF_ACTION=disable` or `revoke` via `pnpm db:revoke-staff` |
| 2026-11-02 | D10 | MFA is deferred for this release | A TOTP enrollment with no recovery channel could lock the only owner. Staging may be exercised with credentials. Production remains blocked until the client writes that credentials-only access is accepted, or a later change adds MFA. |

## Open client inputs

See `docs/peacock-cursor-guide/14-TRACEABILITY-AND-DECISIONS.md` for WhatsApp/Telegram, tariffs, photography, translations, and domain.
