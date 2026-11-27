# Peacock Beach Hotel

Bilingual (EN/RU) enquiry-led hospitality website with secured admin CMS, MongoDB Atlas, and Cloudinary signed uploads.

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill secrets locally
pnpm verify-env
pnpm db:indexes
pnpm db:seed-admin           # prints one-time owner password
pnpm dev
```

Public site: `http://localhost:3000/en`  
Admin: `http://localhost:3000/admin/login`

## Scripts

- `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm test:e2e` / `pnpm build`
- `pnpm db:indexes` / `pnpm db:seed-admin` / `pnpm verify-env`

## Documentation

Engineering playbook: [docs/peacock-cursor-guide/README.md](docs/peacock-cursor-guide/README.md)  
Decisions: [docs/DECISIONS.md](docs/DECISIONS.md)  
Progress: [docs/PROGRESS.md](docs/PROGRESS.md)

## Security notes

- Never commit `.env.local` or paste secrets into chat.
- Staff login is invite/bootstrap only (`pnpm db:seed-admin`).
- WhatsApp/Telegram contacts must be stored in MongoDB `site_settings` before enquiry handoff works in production.
