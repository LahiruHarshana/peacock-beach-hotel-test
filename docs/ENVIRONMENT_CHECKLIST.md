# Environment checklist

Server-only variables are parsed in `src/lib/env.ts`. The app refuses to boot a server path that calls `getEnv()` when one is missing or when `AUTH_SECRET` is shorter than 32 characters.

| Variable | Local | CI | Staging / production |
|---|---|---|---|
| `APP_URL` | `http://localhost:3000` | `http://127.0.0.1:3000` | Public `https` origin. Canonical, sitemap, and origin checks use it. |
| `MONGODB_URI` | `.env.local`, host `cluster0.wlaneur.mongodb.net`, path `/peacock_beach_dev` | `mongodb://127.0.0.1:27017` from the workflow’s MongoDB service | Staging file uses the same host with path `/peacock_beach_staging`. Production uses `/peacock_beach_prod`. |
| `MONGODB_DB` | `peacock_beach_dev` | `peacock_beach_ci` for unit tests. Playwright uses `peacock_beach_e2e`. | `peacock_beach_staging` or `peacock_beach_prod`. The URI path must match this name. |
| `MONGODB_URI_TEST` / `MONGODB_DB_TEST` / `MONGODB_DB_E2E` | Unset locally unless an isolated server is running | Set by CI. Tests ignore `MONGODB_URI` so `.env.local` cannot redirect them. | Do not set these on the production host. |
| `TRUSTED_PROXY_HOPS` | `0` | `0` | `0` until the host is behind a known proxy. Then set the number of proxies you operate, usually `1`. |
| `AUTH_SECRET` | Local only, 32+ characters | Dummy value in the workflow | Unique per environment. |
| `CLOUDINARY_CLOUD_NAME` | Shared cloud `j2zrkybc` in `.env.local` | `ci-test` | Same cloud name in the staging and production files. Keys stay server-only. |
| `CLOUDINARY_API_KEY` | Local only | `ci-test-key` | Server-only. |
| `CLOUDINARY_API_SECRET` | Local only | `ci-test-secret` | Server-only. |
| `BOOTSTRAP_ADMIN_EMAIL` | Optional, used by the seed script | Unset | Unset after the first staff user exists. |

## Rules

- Never prefix these with `NEXT_PUBLIC_`.
- `.env.example`, `.env.development.example`, `.env.staging.example`, and `.env.production.example` may be committed. They name `cluster0.wlaneur.mongodb.net` and keep `REPLACE_USER` / `REPLACE_PASSWORD`.
- One Cloudinary product environment is shared. `PEACOCK_ENV` selects the namespace: development `peacock/dev/`, staging `peacock-test/`, production `peacock/prod/`. Existing `peacock/{category}/` references remain selectable in development and production. Staging cannot select or delete them.
- Tests set `PEACOCK_PROTECT_SHARED_MEDIA=1`, so deletion is limited to `peacock-test/`. The upload sign request rejects a client-supplied folder.
- CI must not receive the production URI. The workflow file uses the local dummy URI above.
- Automated tests call `assertSafeTestDatabase` before connecting. Names must end in `_ci`, `_e2e`, or `_staging`. `peacock_beach_dev` is refused. An Atlas URI is refused unless the name ends in `_staging` and `PEACOCK_ALLOW_ATLAS_STAGING=1`.
- Playwright in CI installs Chromium with `pnpm exec playwright install --with-deps chromium` on Ubuntu and does not set `PLAYWRIGHT_BROWSERS_PATH`.
- A local shell may point `PLAYWRIGHT_BROWSERS_PATH` at a temporary cache. That path is not portable. The supported local command is the same `pnpm exec playwright install chromium` used before `pnpm test:e2e`. An earlier download stopped near 40 percent and left tests without a browser until a later install finished.
