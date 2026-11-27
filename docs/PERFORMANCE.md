# Performance report

**Date:** 2026-11-02  
**What was measured:** Lighthouse lab runs, mobile, against `next start` on this workstation. These are not field Core Web Vitals and not a production host.

The Phase 07 run used `APP_URL=http://127.0.0.1:3010` at build time so canonical and hreflang matched the measured host. An earlier start in the same session, built with `.env.local` (`http://localhost:3000`), still emitted `localhost` canonicals. That confirmed the tags follow `APP_URL` rather than a hardcoded host, and that static pages keep the build-time value.

| Page | Performance | Accessibility | SEO | LCP | FCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/en` | 97 | 100 | 100 | 2.6 s | 0.8 s | 0 | 0 ms |
| `/ru` | 94 | 100 | 100 | 3.1 s | 0.8 s | 0 | 0 ms |

No accessibility or SEO audits failed on this run. The previous English `link-text` failure is gone: the restaurant link now reads “Learn more about the restaurant,” and the rooms link reads “View all rooms.”

Phase 06, same machine, before those link and contrast fixes, measured `/en` at performance 100, accessibility 95, SEO 83, LCP 0.8 s. The higher LCP in this run is the lab result for this build. It is not a field regression.

After this measurement, the homepage title suffix was changed so the document title is `Peacock Beach Hotel` instead of `Peacock Beach Hotel | Peacock Beach Hotel`. That change was not part of the scores above.
