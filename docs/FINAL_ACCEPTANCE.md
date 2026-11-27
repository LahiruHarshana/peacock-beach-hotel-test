# Final acceptance

**Decision:** do not deploy.

| Item | Status | Evidence |
|---|---|---|
| Descriptive English links | VERIFIED | Lighthouse SEO 100 on `/en`. The old `link-text` audit did not fail. |
| Canonical and hreflang from `APP_URL` | VERIFIED | Unit test plus rendered HTML on `http://127.0.0.1:3010` when the build used that origin. |
| Mobile layout and keyboard focus | VERIFIED | At 390px the header shows Menu. Opening it exposes the mobile navigation and moves focus to Close. The hotel-name link accepts focus. |
| Browser console during that pass | PARTIAL | Navigation and the menu click produced no page error in the browser tool. A full console-log export was not captured. |
| CSP and security headers | VERIFIED on the local server | Report-only CSP, `nosniff`, referrer policy, `DENY` framing, and a locked-down Permissions-Policy. HSTS is sent only when `APP_URL` is `https`, so this HTTP measurement did not include it. |
| `CONTENT REQUIRED` on public HTML | VERIFIED | Absent from `/en`, `/ru`, `/en/about`, `/en/contact`, and `/en/restaurant`. |
| Fixed image frame | VERIFIED in code and the rooms page | A 3:2 frame stays in place when a real Cloudinary image replaces the empty slot. |
| Staging admin E2E | VERIFIED | 9 passed, 0 failed, 0 skipped. |
| `/api/ready` | VERIFIED against the development database | Ping returned `database: up`. Production was not contacted. |
| `/api/health` | VERIFIED as a process check only | `{ "ok": true }` with no database call. |
| Production database and hosting | BLOCKED | No production user, domain, or HTTPS. |
| Backup restore | NOT TESTED | Procedure is in `docs/BACKUP_RECOVERY.md` and the runbook. No restore was run. |
| Error-monitoring vendor | NOT TESTED | Logs redact connection strings. No vendor is connected. |
| Client content and EN/RU approval | BLOCKED | `docs/CLIENT_CONTENT_CHECKLIST.md`. |
| GitHub remote and CI run | NOT TESTED | Workflow file is ready. Commands to create a private repo are in the runbook and were not run. |

## Manual checklist

- [ ] Rotate MongoDB and Cloudinary credentials — Administrator
- [ ] Rotate Auth.js secret and admin password, revoke old sessions — Administrator
- [ ] Decide MFA and recovery procedure — Owner
- [ ] Provide approved hotel text, rooms, menus and photos — Hotel client
- [ ] Provide verified address and map location — Hotel client
- [ ] Provide official WhatsApp and Telegram contacts — Hotel client
- [ ] Approve both EN and RU pages — Hotel client
- [ ] Set up private GitHub remote and confirm CI — Developer
- [ ] Provision production DB, hosting, domain and HTTPS — Administrator
- [ ] Verify backup restoration and monitoring — Administrator
