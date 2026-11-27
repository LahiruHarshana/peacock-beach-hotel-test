# Animation architecture

GSAP and ScrollTrigger load inside `useCinematic` after paint. Each timeline is created in a `gsap.context` and removed on unmount. Desktop motion runs only when `prefers-reduced-motion: no-preference` and the viewport is at least 768px wide.

## Global film director

`FilmDirector` in `src/components/site/motion/film-director.tsx` runs on every public page **except** the locale home routes (`/en`, `/ru`). It handles opening plates, title cards, horizontal reels marked `[data-cinema="reel"]`, credit rows, section rises, and media drifts for the lighter cinematic treatment on About, Rooms, Events, and other routes.

## Home page scenes

The home page composes dedicated client scenes under `src/components/site/motion/home/`. Each scene owns its ScrollTrigger timelines via `useCinematic` and marks its root with `data-cinema="home-*"` so it does not rely on the global director.

| Order | Component | Marker | Behaviour |
| --- | --- | --- | --- |
| 01 | `OpeningShot` | `home-opening` | Title lines rise on arrival, then drift apart like credits while the beach pushes in, before the frame rounds into a card |
| 02 | `StatementScene` | `home-statement` | Pinned word-by-word reveal over a terrace plate |
| 03 | `DepthStage` | `home-depth` | Pinned editorial stage: one photograph at a time, image drift inside the frame, caption and progress crossfade |
| 04 | `HomeRoomReel` | `home-reel` | Pinned horizontal room track with inner image pan |
| 05 | `RiseGrid` | `home-rise` | Staggered rise for hospitality cards |
| 06 | `RiseGrid` (gallery) | `home-rise` | Clip-path reveal and image drift on gallery frames |
| 07 | `CreditsScene` | `home-credits` | Enquiry steps on mocha; alternating row slide |
| 08 | `VoicesScene` | `home-voices` | Review cards tilt in |
| 09 | `CloserScene` | `home-closer` | Sunset plate rises; hands off to the footer gradient |

On viewports below 768px or when reduced motion is requested, pins and the horizontal reel are disabled; scenes fall back to simple drift or static layout.

## Legacy hero components

- `CinematicHero` scales the arrival photograph from 1.08 to 1 on entry, then eases the scale and vertical position with scroll. Used on non-home routes where applicable.
- `PinnedChapters` pins the story on desktop and crossfades photographs and chapter copy. On a phone, and when reduced motion is requested, the first photograph and the chapters stay in normal flow.
- A thin scroll-progress bar uses `scaleX` and does not move the page.

There is no WebGL scene. Depth is CSS `perspective` and transform tweens on image plates.
