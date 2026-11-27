# Monitoring

No error-monitoring vendor is connected. Wire one before launch and keep the DSN server-side.

## What to alert on

| Signal | Source | Action |
|---|---|---|
| Process up | `GET /api/health` returns 200 and `{ "ok": true }` | Page the host if it fails. This route does not touch MongoDB. |
| Database up | `GET /api/ready` returns 200 and `{ "database": "up" }` | Page if it returns 503. The server logs a redacted error and does not return the URI. |
| 5xx rate | Host request logs. API errors return a request id and the message `Something went wrong.` Unhandled errors are logged as `{ requestId, message: "Unhandled error" }` without the request body. | Inspect by request id. |
| Login abuse | `login:{email}` allows 8 attempts per 15 minutes. The counter is a MongoDB document shared by every instance. It does not read `x-forwarded-for`. | Investigate the account. The limit follows the email, so a shared NAT does not lock out other staff. |
| Enquiry and review abuse | 20 enquiries and 5 reviews per minute. With `TRUSTED_PROXY_HOPS=0`, every direct caller shares the `direct` bucket. Set the hop count only to the number of proxies you run, then the address those proxies append is used. | Raise the hop count only after confirming the platform appends, rather than replaces, the header. |
| Upload abuse | `upload-sign:{userId}` allows 30 signatures per minute in the same shared counter. | The Cloudinary API secret stays on the server. |

## Core Web Vitals

Room photographs use a fixed 3:2 `next/image` frame. The homepage hero is still a CSS background SVG. Lab Lighthouse numbers are in `docs/PERFORMANCE.md`. They are not field Core Web Vitals.

## Logs

Do not log `MONGODB_URI`, `AUTH_SECRET`, Cloudinary secrets, passwords, or enquiry message bodies. The staff revoke script prints the action and email only.
