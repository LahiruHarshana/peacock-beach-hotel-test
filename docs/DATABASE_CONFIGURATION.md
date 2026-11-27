# Database configuration

The project uses one existing MongoDB Atlas cluster. No second cluster was created.

| Environment | Private file | Database | URI path |
|---|---|---|---|
| Development | `.env.local` | `peacock_beach_dev` | `/peacock_beach_dev` |
| Staging | `.env.staging.local` | `peacock_beach_staging` | `/peacock_beach_staging` |
| Production | `.env.production.local` (not created) | `peacock_beach_prod` | `/peacock_beach_prod` |
| CI | GitHub Actions service | `peacock_beach_ci` | local `mongodb://127.0.0.1:27017` |
| Playwright | local or CI | `peacock_beach_e2e` | local only |

Cluster host: `cluster0.wlaneur.mongodb.net`

The URI path and `MONGODB_DB` must be the same name. Usernames and passwords stay in the gitignored env files. Example files use `REPLACE_USER` and `REPLACE_PASSWORD` on that host. The application client in `src/lib/db/client.ts` still reuses one `MongoClient` during development and sets `serverSelectionTimeoutMS` to 5000.

`pnpm db:indexes` creates indexes only after the development name matches. `pnpm staging:indexes` does the same for `peacock_beach_staging`. Neither command drops a database. The destructive Vitest suite still refuses every name except `peacock_beach_ci`.

## Checked on 2026-11-02

Both Atlas databases answered `ping` and already had the application collections. Index creation was additive.

`peacock_beach_dev` and `peacock_beach_staging` both have unique indexes on `users.emailNormalized`, `rooms.slug`, `events.slug`, `media_assets` (`publicId`, `resourceType`), and `rate_limits.bucket`, plus the status, audit, review, and `rate_limits.expiresAt` indexes. Development `rate_limits` also still has an older `key_1_at_1` index. It was left in place.

Cloudinary cloud `j2zrkybc` is shared. Development media is `peacock/dev/`, staging tests use `peacock-test/`, and production media is `peacock/prod/`. Older `peacock/{category}/` references still display in development and production. Staging cannot select or delete those assets. `pnpm staging:preflight` reported Cloudinary ping `ok` without printing the API secret. Tests set `PEACOCK_PROTECT_SHARED_MEDIA=1`.

`pnpm test` passed 43 tests and skipped the isolated MongoDB file because this machine has no local `mongod`. That skipped file was not pointed at Atlas.
