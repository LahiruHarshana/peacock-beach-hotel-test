# Production release runbook

**Decision:** do not deploy until the manual checklist in `docs/FINAL_ACCEPTANCE.md` is complete. This runbook does not authorize a write to `peacock_beach_prod`.

## 1. Confirm the commit

1. CI on the private GitHub repository is green for that commit.
2. `pnpm scan-secrets` and `pnpm audit --audit-level=high` passed in that run.
3. The working tree that will be deployed contains no `.env.local`, `.env.staging.local`, or `.env.production.local`.

## 2. Production secrets

Create these in the host’s secret store. Do not commit them.

| Name | Rule |
|---|---|
| `PEACOCK_ENV` | `production` |
| `APP_URL` | Public `https` origin, no trailing path. Canonical, sitemap, and hreflang use this value. |
| `MONGODB_URI` | Dedicated user. Path must be `/peacock_beach_prod`. |
| `MONGODB_DB` | `peacock_beach_prod` |
| `AUTH_SECRET` | New value, at least 32 characters, different from development and staging. |
| `CLOUDINARY_CLOUD_NAME` | Existing shared cloud. |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Server only. Uploads are forced into `peacock/prod/`. |
| `TRUSTED_PROXY_HOPS` | `0` until the host’s proxy count is known. Set it to the number of proxies that append `X-Forwarded-For`. |
| `BOOTSTRAP_ADMIN_EMAIL` | Only for the first seed. Remove it after the owner password is replaced. |

`getEnv()` refuses to boot when `PEACOCK_ENV=production` unless the database name is `peacock_beach_prod`, the URI path matches, and `APP_URL` is `https`. Session cookies are `Secure` only when `APP_URL` starts with `https`. HSTS is sent only in that case. CSP stays report-only because Next.js still needs inline scripts.

The production database user should be able to read and write only `peacock_beach_prod`. It must not have access to `peacock_beach_dev` or `peacock_beach_staging`. Create that user in Atlas before the first boot. This repository does not create it.

## 3. Initialize the database

Review `scripts/ensure-indexes.ts` and `scripts/seed-admin.ts` before running them. They write to whatever `MONGODB_URI` and `MONGODB_DB` are set.

1. `PEACOCK_ENV=production PEACOCK_ALLOW_PRODUCTION=1 PEACOCK_ENV_FILE=.env.production.local pnpm verify-env`
2. With the production env loaded, `pnpm db:indexes`
3. Seed one owner only if the `users` collection is empty: `pnpm db:seed-admin`
4. Sign in, replace the bootstrap password, then `pnpm db:revoke-staff` is available to disable or revoke a session by raising `tokenVersion`.
5. Do not run the destructive Vitest suite. It is allowed only against `peacock_beach_ci`.

## 4. Deploy

There is no automatic production deploy. Deploy the same commit CI built. Keep `peacock-app/` out of the upload.

After the process is up:

1. `GET /api/health` returns `{ "ok": true }`. That response does not check MongoDB.
2. `GET /api/ready` returns `{ "ok": true, "database": "up" }`. A database failure returns 503 and `{ "database": "down" }`. The error logged by the server is redacted.
3. `/en` and `/ru` render. Placeholder address text is not shown.
4. `/admin/login` sends `noindex`.
5. Anonymous `GET /api/admin/rooms` returns 401.
6. `/sitemap.xml` and `/robots.txt` use `APP_URL`. Robots disallows `/admin` and `/api`.

## 5. Rollback

1. Redeploy the previous successful build. An application rollback does not undo database writes.
2. Restore data only into a new database name, then point a non-production app at that copy and read one known document. Do not restore over the only production copy, and do not use production data for a destructive test.
3. If the wrong `AUTH_SECRET` shipped, put the previous secret back or revoke sessions after the correct secret is restored.

## 6. Private GitHub remote

Do not run these until the owner approves a private repository.

```bash
gh repo create peacock-beach-hotel --private --source=. --remote=origin
git push -u origin HEAD
```

Recommended branch protection on `main`: require a pull request, require the CI workflow, and disallow force pushes. The workflow installs with `pnpm install --frozen-lockfile`, caches pnpm, and runs typecheck, lint, unit tests, secret scan, `pnpm audit --audit-level=high`, Playwright, and the production build. CI secrets in the workflow file are dummy values.
