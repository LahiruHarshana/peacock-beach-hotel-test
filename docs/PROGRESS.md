# Implementation progress

Updated 2026-11-02 after Phase 07. Production is not deployed. There is no GitHub remote.

| Area | Status | Evidence |
|---|---|---|
| Public EN/RU pages | PARTIAL | Pages render. About, restaurant, address, and homepage introduction stay unpublished until staff save approved text. |
| Room and event CMS | VERIFIED on staging | `pnpm staging:e2e`: 9 passed, 0 failed, 0 skipped. |
| Review form | VERIFIED | Covered by the same staging run and the earlier unit test. |
| Canonical and hreflang | VERIFIED | Built from `APP_URL`. Measured pages used `http://127.0.0.1:3010` when that value was set at build time. |
| Local Lighthouse | VERIFIED as a lab run | `docs/PERFORMANCE.md`. Not field data. |
| Production database, HTTPS, backups, monitoring vendor | BLOCKED | Runbook is written. Nothing was written to `peacock_beach_prod`. |
| Approved hotel content | BLOCKED | `docs/CLIENT_CONTENT_CHECKLIST.md`. |
| GitHub CI | NOT TESTED | Workflow is ready. It has not run on GitHub. |
