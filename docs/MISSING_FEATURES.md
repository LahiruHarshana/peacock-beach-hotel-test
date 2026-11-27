# Missing or incomplete features

Compared with `docs/peacock-cursor-guide/01-SCOPE-AND-ACCEPTANCE.md` and the implemented `src/` tree. Excluded proposal items (payments, live booking, OTA, table reservations, customer accounts) are intentionally absent and should stay absent.

| ID | Feature | Status | Notes |
|---|---|---|---|
| P01 | Home | Partial | Structure exists. Hero is an SVG placeholder. Highlights depend on published Mongo data. |
| P02 | About | Blocked on content | Page exists. Body is `CONTENT REQUIRED`. |
| P03 | Rooms and enquiry CTA | Partial | DAL and pages exist. Gallery missing. Dev fixtures can replace an empty list. |
| P04 | Restaurant | Blocked on content | No menu sections, prices, or video. No reservation engine (correct). |
| P05 | Reviews | Partial | Submit, pending state, and moderation API/UI exist. No profanity policy. No email notification (out of scope). |
| P06 | Events | Partial | Public pages and admin API exist. **No admin create/edit UI.** |
| P07 | Contact and map | Blocked on content | Address placeholder. No map until `mapUrl` is set. |
| P08 | WhatsApp and Telegram | Blocked on settings | Link builder exists. Defaults are null. **No settings screen.** |
| P09 | EN/RU | Partial | UI strings exist and are marked as draft. Not client-approved. |
| P10 | Admin rooms/events/reviews | Partial | Rooms UI and review queue exist. Events and media are incomplete in the UI. |
| P11 | SEO | Partial | Title, description, canonical, hreflang, sitemap, robots. Missing JSON-LD, Open Graph image, Search Console and Yandex verification files. |
| P12 | Release ops | Missing | No GitHub Actions, no monitoring, no backup runbook execution, no root git repository. |

## Admin capabilities with API only

- Event create, update, archive: `src/app/api/admin/events`.
- Signed upload and verify: `src/app/api/admin/uploads/sign` and `complete`.
- Site settings write: not implemented at all.

## Security features named in the guide but not built

- MFA for privileged accounts (documented gap; credentials provider only).
- Login lockout.
- Origin checks on cookie-authenticated mutations.
- CSP.
- Re-read of role and disabled status on every privileged call.
- Distributed rate limiting.

## Tests named in the guide but not built

AUTH-02, AUTH-03, AUTH-04, CONTENT-01, CONTENT-02, REVIEW-01, REVIEW-02, UPDATE-01, UPLOAD-02, ENQUIRY-02, SEO-01, SEO-02. See `docs/TEST_COVERAGE.md`.
