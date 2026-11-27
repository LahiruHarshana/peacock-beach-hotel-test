# 06 — API contracts, validation, reliable feedback

## Handler contract
Use route handlers or server actions deliberately; do not duplicate paths. Response envelope for JSON handlers:
```json
{"ok":false,"error":{"code":"VALIDATION_ERROR","message":"Please review the highlighted fields.","fieldErrors":{"name.en":["Required"]}},"requestId":"req_..."}
```
For success: `{"ok":true,"data":{...},"requestId":"req_..."}`. No raw DB result/cookies/secrets. The request ID must be generated securely by server and logged without PII.

## Recommended endpoint inventory
| Method / path | Auth | Behaviour |
|---|---|---|
| GET `/api/rooms` | public | published, localized, bounded summaries; can also use server-side DAL directly for SEO pages |
| GET `/api/rooms/:id` | public | published only; prefer slug page DAL |
| POST `/api/reviews` | public | strict schema, consent, antispam; status PENDING only |
| GET `/api/admin/rooms` | EDITOR/OWNER | draft+published projection/pagination |
| POST `/api/admin/rooms` | EDITOR/OWNER | strict create DTO, audit |
| PATCH `/api/admin/rooms/:id` | EDITOR/OWNER | allowlisted update, optimistic lock |
| POST `/api/admin/rooms/:id/publish` | EDITOR/OWNER | ensure mandatory localized fields/media/accuracy |
| GET/POST `/api/admin/events` | EDITOR/OWNER | list, add |
| PATCH/DELETE `/api/admin/events/:id` | EDITOR/OWNER | update, archive/soft delete policy |
| GET `/api/admin/reviews` | MODERATOR/OWNER | pending queue |
| POST `/api/admin/reviews/:id/moderate` | MODERATOR/OWNER | approve/reject and audit |
| POST `/api/admin/uploads/sign` | authorized content editor | short-lived signed upload settings |
| POST `/api/admin/uploads/complete` | authorized editor | verify Cloudinary upload before storing metadata |

## Validation requirements
- Zod `.strict()` DTOs; `.trim()`; max lengths; slug regex; arrays bounded; allowed currency codes; HTML policy.
- Room capacity integer 1..reasonable configured maximum; never infer availability from capacity.
- Price optional, nonnegative within justified cap; avoid floating currency calculation (proposal is display-only).
- Check-out > check-in; input date within business-defined bounded window; guest count positive and <= published room capacity if collecting.
- Contact E.164 and allowlisted WhatsApp `wa.me` route; Telegram must match official approved canonical URL / handle; never accept arbitrary redirect target.
- Email/name/review length and profanity/spam policy; privacy notice and consent timestamp; form submission never instantly publishes content.
- Validation client-side for UX but enforce on server independently. Reject unknown fields.

## Error mapping
| Situation | HTTP | UI |
|---|---:|---|
| Invalid request | 400/422 | field-specific inline error; preserve inputs |
| No active session | 401 | redirect to admin sign-in with return path allowlist |
| Not allowed | 403 | access-denied page; do not reveal protected detail |
| Missing published record | 404 | localized not-found |
| Concurrent modification | 409 | offer refresh/compare rather than silently overwriting |
| Too many requests | 429 | actionable retry wording; Retry-After when appropriate |
| Temporary provider failure | 502/503 | safe retry; retain unsent form state |
| Unknown error | 500 | generic secure message + request ID; structured server log |

## Notification/alert system
- Public: polished inline form errors; toast on locally confirmed actions only; user-chosen external app handoff acknowledgement, **not booking success**.
- Admin: Sonner toasts for saved/published/failed; persistent inline validation and accessible alert dialogs for destructive actions; optimistic UI only when rollback is safe.
- Use `aria-live=polite` for confirmations and `role=alert` for urgent errors; avoid alert storms and duplicate events.
- Optional in-app notification center is *not* required by proposal. If commissioned, define persisted schema and retention, not faux realtime.
- Avoid email/push/SMS as assumed scope; review if explicitly added later.
