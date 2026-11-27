# Deployment guide

Do not deploy from this repository state until `docs/FINAL_ACCEPTANCE.md` has no launch blocker left. This document is the procedure for a later, approved release.

## Domain and HTTPS

1. Create a staging hostname first, then the production domain.
2. Set `APP_URL` to that exact origin, including `https`, before `pnpm build`. Canonical, hreflang, Open Graph, and sitemap URLs are taken from `APP_URL`. A static page keeps the value from the build.
3. Turn on the platform’s automatic certificate. HSTS is sent only when `APP_URL` starts with `https`.
4. The Content-Security-Policy header is report-only. It allows `'unsafe-inline'` for scripts and styles because Next.js still needs them, allows Cloudinary images, and denies framing. Do not switch it to enforcing until a nonce or hash setup is tested. Other headers on every response: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a Permissions-Policy that disables camera, microphone, and geolocation.

## Staging

1. Provision secrets from `docs/ENVIRONMENT_CHECKLIST.md` in the host’s secret UI, not in the repo.
2. Use `peacock_beach_staging` and the `peacock-test/` Cloudinary namespace. Production writes use `peacock/prod/` on the same cloud. Do not create a second cloud.
3. Run `pnpm db:indexes` against staging.
4. Seed one staging admin, sign in, then remove the bootstrap password from any notes.
5. Run the smoke tests below against staging.

## Production

1. Follow `docs/PRODUCTION_RELEASE_RUNBOOK.md`. There is no automatic production deploy.
2. Keep `peacock-app/` out of the upload. It is a leftover scaffold.
3. `GET /api/ready` pings MongoDB. `GET /api/health` does not.

## Rollback

1. Redeploy the previous successful build in the host dashboard.
2. Database writes are not migrated automatically. A rollback of the app does not undo room, review, or settings writes. Restore data only with the backup procedure.
3. If a bad `AUTH_SECRET` shipped, restore the previous secret or revoke sessions after the good secret is back.

## Smoke tests after a deployment

1. `GET /api/health` returns `{ "ok": true }`. This does not check MongoDB. `GET /api/ready` returns `{ "ok": true, "database": "up" }` only after a ping.
2. `/en` and `/ru` render, and the enquiry disclaimer is visible on `/en/rooms` and `/ru/rooms`.
3. `/admin/login` responds and its robots meta includes `noindex`.
4. An anonymous `GET /api/admin/rooms` returns 401.
5. A published room appears on the public rooms page. A draft room does not.
6. An enquiry with dates and a guest count returns a message. If contacts are unset, `configured` is false and `url` is null. The page must not say the stay is booked.
7. `/sitemap.xml` and `/robots.txt` load. Robots disallows `/admin` and `/api`.

## Search consoles

After the content inventory has no remaining placeholders:

1. Google Search Console: add the `https` property, verify with a DNS TXT record the client controls, then submit `sitemap.xml`.
2. Yandex Webmaster: add the site, verify with a DNS TXT record or the meta tag Yandex issues for that property, then submit the sitemap.
3. Do not invent a verification token in the repository before the console shows one.
