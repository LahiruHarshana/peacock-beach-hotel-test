# Redesign baseline

Inspected the running Next.js dev server at `http://localhost:3000` on 2 November 2026. Viewport was the Cursor browser (desktop). Pages opened: `/en`, `/en/about`. Rooms, restaurant, reviews, events, and contact were read from the same shared opener in the route files after the homepage and About were seen live.

## What is on screen

- `/en` opens as a full-bleed coastal photograph with a dark gradient, a small champagne eyebrow, the serif title “Peacock Beach Hotel”, two square buttons, and a “Scroll” link. The title is clipped by `.line-mask` until a CSS animation finishes, so the first paint can look like a photo with no hotel name.
- The header is a standard seven-link bar. It turns solid porcelain after about 8px of scroll, which breaks the hero composition immediately.
- Further homepage chapters are a two-column pin (one image, three text blocks that only change opacity), a beige room list, a 50/50 restaurant and events split, a quote grid, and a CSS color field for contact.
- `/en/about` uses the same full-bleed hero treatment, then the unpublished story sentence, one pinned image, and a color-field close.
- `/en/rooms`, `/en/restaurant`, `/en/reviews`, `/en/events`, and `/en/contact` all mount `SceneHeader`: the same 72vh photograph, gradient, and bottom-left heading. Body copy under that hero is a single column or a simple list.
- No approved Cloudinary hotel photographs or approved story copy are published. Stand-in files in `public/images` are labeled “Development preview”.
- GSAP is loaded in `useCinematic`. The hero pins and scales. Pinned chapters do not change the photograph. There is no perspective or mask transition between chapters.
- Room, review, and event lists are empty, so several sections are a heading plus one sentence and a large cream gap.

## Why it still feels like a template

Every public route repeats the same photographic billboard. Motion mostly fades opacity or scales one plane. Empty states are uncomposed text. The navigation, buttons, and section rhythm do not change from page to page.
