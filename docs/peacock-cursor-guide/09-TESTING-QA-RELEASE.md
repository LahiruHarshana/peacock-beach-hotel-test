# 09 — Testing, QA and release criteria

## Test pyramid
- **Unit:** Zod schemas, room publish guard, slug generation, localized title selection, message encoding, permission matrix, error mapping, date checks.
- **Integration (test DB):** DB index constraints; admin role checks; anonymous review moderation workflow; draft not public; publication invalidation; media post-upload verification; optimistic concurrency; no secret/PII leakage.
- **E2E:** home → rooms → room → WhatsApp/Telegram; bilingual switch retains equivalent route; review submit → pending → moderator approval → public; admin room CRUD; event CRUD; responsive nav and auth expiry.
- **Security:** unauthenticated/admin API calls; unauthorized role; missing/stale ID; malformed JSON and NoSQL operators; XSS, CSRF, brute-force, review spam, malicious file and Cloudinary signature abuse; secret scans.
- **Quality:** Lighthouse (mobile/desktop), axe, keyboard+screen reader, RU text expansion, slow network, link checker, sitemap/robots/hreflang validator, cross-browser.

## Example critical test cases
| ID | Scenario | Expected |
|---|---|---|
| AUTH-01 | anonymous requests admin collection | 401 |
| AUTH-02 | REVIEW_MODERATOR edits room | 403 |
| AUTH-03 | EDITOR tries to escalate own role via body | 400/403, never changed |
| AUTH-04 | disabled staff session attempts write | blocked |
| CONTENT-01 | draft room URL guessed | 404 |
| CONTENT-02 | RU room unpublished translation absent | no misleading public fallback; not indexed |
| REVIEW-01 | new review submitted | pending only |
| REVIEW-02 | unapproved review is queried publicly | never returned |
| UPDATE-01 | stale version update | 409 |
| UPLOAD-01 | anonymous signs Cloudinary upload | 401 |
| UPLOAD-02 | spoofed `secureUrl` on completion | rejected |
| ENQUIRY-01 | invalid date sequence | inline validation |
| ENQUIRY-02 | Telegram unsupported prefill | clear copy-message fallback |
| SEO-01 | `/ru/rooms` | correct lang, canonical, hreflang |
| SEO-02 | admin URL | noindex and auth protected |

## Hard launch blockers
- Any critical/high exploitable vulnerability; unauthorized publishing; exposed credentials; missing privilege checks; broken contact links; published fabricated hotel facts; accessibility blocker to booking enquiry; broken mobile navigation; wrong canonical/hreflang; no backups; no functional rollback path.

## Deliverable sign-off checklist
- All source-derived sections present and approved.
- EN and RU content complete and manually reviewed.
- Staff account / role list confirmed.
- Screenshots signed off at key breakpoints.
- CI green: `lint`, `typecheck`, `test`, `build`, `e2e`, security scans.
- Production smoke test after launch: 7 public pages, room enquiry WhatsApp and Telegram, admin login, drafts hidden, review moderation, sitemap/robots.
- Monitoring and recovery drill completed/documented.
- Handover to hotel: admin usage guide, contact maintenance path, credentials owner-controlled, domain ownership confirmed.
