# 12 — Environment, Git, deployment and operations

## `.env.example` (safe, placeholders only)
```dotenv
NODE_ENV=development
APP_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://REPLACE_USER:REPLACE_PASSWORD@REPLACE_CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=peacock_beach_dev
AUTH_SECRET=GENERATE_LONG_RANDOM_SECRET
CLOUDINARY_CLOUD_NAME=REPLACE_ME
CLOUDINARY_API_KEY=REPLACE_ME
CLOUDINARY_API_SECRET=REPLACE_ME
# Only when implementing actual mail provider/invite mechanism:
# EMAIL_PROVIDER_API_KEY=REPLACE_ME
# RATE_LIMIT_REDIS_URL=REPLACE_ME
```
Do not paste actual secrets into Cursor chat, Git or screenshots. Validate env with Zod at startup, verify secrets only on server, create separate dev/staging/prod sets. Do not add `NEXT_PUBLIC_` to secrets. `AUTH_SECRET` format/variable name varies by auth provider: reconcile with installed package docs. `APP_URL` must be actual public canonical URL for production. Hotel WhatsApp and Telegram links are **client content settings**, not sensitive API keys.

## Git
- `main`: protected production; `develop` optional depending on team size; feature branches `feat/public-home`, `feat/admin-auth`, `fix/room-inquiry`.
- Conventional commits: `feat(ui): add responsive room detail gallery`, `fix(auth): enforce review moderator restriction`.
- PR check: lint, formatting, typecheck, unit/integration/E2E, build, dependency/SAST/secret scan, reviewed DB changes, screenshot/UX notes.
- Pin deps with `pnpm-lock.yaml`; code owners on sensitive auth/security modules; conventional release tags e.g. `v1.0.0`.
- `gitignore`: `.env*` except `.env.example`; `.next`, `node_modules`, test artifacts, backups, dumps, logs, IDE secret files.
- Never run destructive migration against production without backup/approval; no force push/hidden rebases on shared branches.

## Deployment
- Node.js compatible hosting with Next.js SSR / server actions / routes; configure region nearest audience/data without violating hosting policy.
- HTTPS, DNS, canonical domain redirects, CSP and security headers tested on staging.
- Mongo Atlas IP/network controls: use platform egress / private connectivity where available; avoid blanket 0.0.0.0/0 where possible; least-privilege DB principal.
- Atlas automated backups/PITR according to plan; test restore on isolated environment; define RPO/RTO and retention with client.
- Cloudinary usage quotas and billing alerts; app error monitoring, uptime monitor, alert escalation owner.
- Separate preview/staging from prod data and storage folders; protect previews from indexing.

## Operational commands (adapt to generated package scripts)
```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:indexes
```
The agent must **add or inspect** scripts; these are target conventions, not a claim they exist before implementation.

## Rollback and emergency
- Release immutable tagged artifacts; revert deployment to last known good version.
- Backward-compatible schema changes first, code rollout second, cleanup later.
- Keep restore instructions and contacts offline; rotate compromised credentials, terminate sessions, investigate logs.
- Re-check enquiry WhatsApp/Telegram URLs after each release.
