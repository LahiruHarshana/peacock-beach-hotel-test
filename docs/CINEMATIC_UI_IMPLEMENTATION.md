# Cinematic UI implementation

**Date:** 2026-11-02

The homepage is a scroll-driven editorial sequence. GSAP and ScrollTrigger load in the browser after the first paint and only run when motion is allowed and the viewport is at least 768px wide. Mobile and `prefers-reduced-motion` keep normal document flow. There is no intro loader and no scroll-jacking.

No approved hotel video or licensed photography is stored in Cloudinary yet. The homepage hero, story panel, and restaurant panel show local stand-in photographs until an owner chooses a Media image in Admin → Site settings. A chosen image replaces the stand-in. Room and event photographs still appear only when staff publish them.

## Scenes

| Scene | Behavior |
|---|---|
| Landing | Full-viewport field, masked heading, enquiry actions, and a link to the story. Text is in the document immediately. |
| Hero scroll | On desktop, the field scales while the section is pinned for about 70% of the viewport. |
| Story | Three chapters use existing copy: the shore line, room text or the empty-room notice, and the unpublished hospitality paragraph. Desktop pins the panel. Later chapters stay readable at reduced opacity. |
| Rooms | Published rooms can move horizontally on desktop. One room, or a narrow screen, stays vertical. Enquiry links stay in the page. |
| Restaurant and events | A small desktop parallax on the dining panel. No invented menu or food photography. |
| Contact | Full-width ending with the address state, WhatsApp and Telegram only when configured, and the staff-confirmation disclaimer. |

A thin scroll progress bar sits on public pages. The admin dashboard is not pinned or animated.

## Checks

| Command | Result |
|---|---|
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm test` | 53 passed, 1 skipped |
| `pnpm build` | Passed |
| `pnpm staging:preflight` | Passed. Database `peacock_beach_staging`. Cloudinary ping `ok`. |
| `pnpm staging:e2e` | Not run to completion. Port 3000 was already taken by a Next.js server for this project, so Playwright could not start its own server. |

Screenshots from the production build on this machine:

- `docs/ui-screenshots/cinematic-home-top.png` at the top of the page
- `docs/ui-screenshots/cinematic-home-1440.png` after scrolling
- `docs/ui-screenshots/cinematic-home-390.png`
- `docs/ui-screenshots/cinematic-home-reduced.png` with reduced motion

Horizontal overflow was 0 at 1440 and 390, including after scrolling up and down. No page errors were recorded.

Mobile Lighthouse on `http://127.0.0.1:3010/en`: performance 100, accessibility 100, SEO 92, LCP 0.8 s, CLS 0, TBT 0 ms. This is a lab run, not field Core Web Vitals. SEO lost points because the canonical host is `APP_URL` (`http://localhost:3000`) while the measured host was `127.0.0.1`.
