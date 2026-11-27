# UI redesign report

**Date:** 2026-11-02  
**Decision:** visual redesign of the existing site. No backend, database, or auth changes. Nothing was pushed or deployed.

## Design

The public site now uses a coastal editorial system instead of the previous card grid.

| Token | Value | Use |
|---|---|---|
| Deep ocean | `#102C32` | Hero, footer, primary actions |
| Warm ivory | `#F7F4EC` | Page background |
| Sand gold | `#C5A37D` | Rules, labels, focus |
| Sea glass | `#698A86` | Hover only, not body text |
| Charcoal | `#252925` | Body text |

Headings use Cormorant Garamond. Navigation, buttons, and body text use Manrope. Both include Cyrillic.

There are no approved hotel photographs in the repository. The homepage hero is a designed color field, not a photograph, and it is not labeled as the hotel. Room, restaurant, and event images appear only when a published Cloudinary asset exists. Empty states say the hotel has not published that material yet.

Motion is a short rise on the hero and color transitions on the header. `prefers-reduced-motion` reduces animation and transition duration.

## What changed

- Fixed navigation that is transparent over the homepage and solid after scrolling or on other pages.
- Mobile menu with Menu and Close, a vertical list, and 44px targets.
- Homepage sections for the introduction, rooms, restaurant, events, reviews, and contact. Enquiry actions go to the rooms enquiry form.
- Distinct layouts for about, rooms, room details, restaurant, reviews, events, and contact.
- Footer with navigation, language link, and the staff link.
- Admin sidebar, sign-in, dashboard figures, and shared form controls. Permissions are unchanged.

## Checks

| Check | Result |
|---|---|
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm test` | 52 passed, 1 skipped |
| `pnpm staging:e2e` | 9 passed, 0 failed, 0 skipped |
| `pnpm build` | Passed |
| Playwright screenshots | `docs/ui-screenshots/home-360.png`, `home-390.png`, `home-768.png`, `home-1440.png`, `home-ru-1440.png`, `rooms-1440.png` |
| Horizontal overflow | 0px at 360, 390, 768, and 1440 on `/en` |
| Page errors during those captures | None |

Screenshots were taken from `next start` on this machine. They are not a Lighthouse run. The previous lab scores are still in `docs/PERFORMANCE.md` and were not remeasured after this visual change.
