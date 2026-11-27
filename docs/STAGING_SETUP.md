# Staging setup

Development and staging share the existing Atlas cluster `cluster0.wlaneur.mongodb.net`. They do not share a database name.

| Environment | Example | Private file | Database |
|---|---|---|---|
| Development | `.env.development.example` | `.env.local` | `peacock_beach_dev` |
| Staging | `.env.staging.example` | `.env.staging.local` | `peacock_beach_staging` |
| Production | `.env.production.example` | `.env.production.local` | `peacock_beach_prod` |

`.env.local` is development only. Staging commands read `.env.staging.local`. The URI path and `MONGODB_DB` are both `peacock_beach_staging` in that file. Credentials are not written into source or documentation.

Cloudinary uses the existing cloud `j2zrkybc` for every environment. The API key and secret stay in the gitignored files. Staging does not need a second cloud name. New staging uploads are restricted to `peacock-test/`. Development uploads use `peacock/dev/`, and production uploads use `peacock/prod/`. Existing `peacock/{category}/` assets remain readable in development. Tests set `PEACOCK_PROTECT_SHARED_MEDIA=1` and cannot delete shared or production assets.

## Checked on 2026-11-02

- `pnpm verify-env` passed for `.env.local` and `peacock_beach_dev`.
- `pnpm db:indexes` created indexes on `peacock_beach_dev`. No database was dropped.
- `pnpm staging:indexes` created indexes on `peacock_beach_staging`. Seven collections were present. No database was dropped.
- `pnpm staging:preflight` passed. Database `peacock_beach_staging`. Cloudinary ping `ok`. The API secret was not printed.
- `pnpm staging:auth-check` passed. The probe user was removed.
- `pnpm staging:e2e` passed 7 Chromium admin tests against `peacock_beach_staging`. The suite upserts `e2e-*@peacock.test` fixture users and removes only its `e2e-room-` and `e2e-event-` records. It does not drop the database.
- `pnpm test` passed 44 tests and skipped the destructive local MongoDB file. That file was not pointed at Atlas.

## Commands

```bash
pnpm verify-env
pnpm db:indexes
pnpm staging:preflight
pnpm staging:indexes
pnpm staging:auth-check
pnpm staging:e2e
```

`pnpm staging:auth-check` and `pnpm staging:e2e` must keep `peacock_beach_staging` and must not drop it. Production `peacock_beach_prod` is documented and not connected. A real upload of a hotel photograph was not performed.
