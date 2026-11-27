# 04 — MongoDB Atlas data model

**Database:** e.g. `peacock_beach_hotel`; separate dev/staging/prod projects or DB users and appropriately isolated namespaces. Never use prod credentials for developer machines.

## Collections
| Collection | Key fields | Constraints / indexes |
|---|---|---|
| `users` | `_id`, emailNormalized, name, role (`OWNER`,`EDITOR`,`REVIEW_MODERATOR`), status, authProviderId, createdAt, updatedAt | unique emailNormalized; admin-provisioned only; never return credentials |
| `sessions` / auth adapter collections | provider-defined fields | indexes per installed auth adapter; expiry/TTL only where compatible |
| `rooms` | `_id`, slug, name `{en,ru}`, description `{en,ru}`, capacity, amenities, images `[{publicId,alt,order}]`, priceDisplay, currency, status (`DRAFT`,`PUBLISHED`), sortOrder, timestamps, version | unique slug; `{status:1,sortOrder:1}`, controlled locales; room type vs physical rooms documented |
| `events` | `_id`, slug, title `{en,ru}`, description `{en,ru}`, startAt, endAt, heroMedia, status, createdAt, updatedAt, version | unique slug, `{status:1,startAt:1}` |
| `reviews` | `_id`, authorDisplayName, rating (if collected), text, locale, moderationStatus, consentAcceptedAt, createdAt, reviewedBy, reviewedAt | `{moderationStatus:1,createdAt:-1}`; escape output; remove user PII |
| `site_settings` | `_id:"main"`, en/ru brand/meta, WhatsApp E.164, Telegram canonical link, address, socials, policies, lastUpdatedAt | singleton; only edit by authorized roles if implemented |
| `media_assets` | `_id`, publicId, resourceType, secureUrl, dimensions, bytes, format, usage, uploadedBy, createdAt | unique `(publicId,resourceType)`; tracked cleanup |
| `audit_logs` | `_id`, actorId, action, targetType, targetId, at, requestId, summary (redacted) | `{at:-1}`, `{actorId:1,at:-1}`; append-only, retention controlled |
| `rate_limits` / external storage | scope key, timestamps/count | use managed rate-limiting service for multi-instance reliability; never in-memory-only in production |

## Field contracts
- Locale objects `en`, `ru` mandatory for **published** content, drafts may be incomplete. Never claim translated content that does not exist; use noindex for incomplete locale routes.
- Rate fields: proposal only promises displayed rates **where supplied**. If not supplied, display “Ask for rates”; never create numeric rates. Store value + currency + notes only when verified.
- `27 rooms` is property capacity in proposal, not proof of 27 distinct sellable room *types*. Confirm with client before seeding.
- Date storage UTC, display correct local hotel timezone `Asia/Colombo` and localized formatting; input dates are hotel local dates.
- Favor denormalized localized content for read-heavy site; use `.project()` on reads.

## Authorization and database rules
- Public reads: `{ status: 'PUBLISHED' }` for rooms/events; `{ moderationStatus:'APPROVED' }` reviews; strict output projection.
- Admin read/write: authenticated server-derived role with capability-specific guards; optionally `siteId` scope derived from session if tenancy is later introduced (never from untrusted body).
- Use `ObjectId.isValid` plus canonical/semantic validation; avoid querying operator-shaped user objects. Never spread user payload directly into Mongo `$set`.
- Implement `updatedAt` and optimistic concurrency `version` (mutations filter by `{_id,version}`; on matchedCount=0 return 409) to avoid lost updates.
- Paginate reviews/event admin lists with bounded page size (max 50), predictable stable sort and indexes; prefer cursor pagination when lists grow.
- TTL only for genuinely expirable data; never TTL audit records without policy.

## Index/migration operational flow
`pnpm db:indexes` applies idempotent `createIndex`; sample scripts must run only against configured expected environment. Backup before data-changing migrations, test rollback/forward compatibility; log index creation outcomes.
