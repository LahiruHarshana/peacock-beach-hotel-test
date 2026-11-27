# Creative rebuild baseline

Inspected `http://localhost:3000/en` in the Cursor browser on 2 November 2026, before this rebuild.

## What was on screen

- The homepage hero was a beach photograph inset inside a limestone frame. The frame came from a scroll-linked `clip-path` on a paper-colored section, so the image did not meet the viewport edges.
- The header was transparent over that photograph and became a solid cream bar after a short scroll. The title sat in the lower half of the image, clear of the links at rest, but the navigation and the picture competed for the same plane.
- Below the hero, the story sequence was a cream field. An earlier build of that sequence rendered only the numbers 01, 02 and 03 because the photograph height collapsed and the chapter text was positioned outside its column.
- Room highlights repeated a large tilted preview photograph plus the unpublished-rooms sentence.
- Dining was a split of image and text.
- Events and reviews occupied tall cream blocks even though no events or reviews are published.
- The footer was a three-column dark band with a modest wordmark.
- About, rooms, restaurant, reviews, events and contact did not share one hero anymore, but they still used the same limestone, serif and preview photographs.
- No approved Cloudinary hotel photographs or approved story copy are published. The pictures in `public/images` are labeled development previews.

## Files that produced that look

- `src/app/globals.css` — paper, ink and sand tokens
- `src/components/site/site-header.tsx` — transparent homepage header
- `src/components/site/motion/cinematic-hero.tsx` — clip-path frame
- `src/components/site/motion/pinned-chapters.tsx` — story sequence
- `src/app/[locale]/(site)/page.tsx` — homepage chapters
- `src/components/site/site-footer.tsx`
