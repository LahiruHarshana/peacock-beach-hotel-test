# Cinematic design system

Public pages use one palette, set in `src/app/globals.css`.

- Abyssal ocean `#092B30` for the header on the homepage, story stages, and the footer
- Limestone `#EDE8DE` for page ground
- Soft pearl `#F8F5EE` for type on photographs
- Antique bronze `#C8A576` for rules, links and labels
- Forest teal `#243C3B` for secondary text
- Ink `#181D1B` for body type on limestone

Cormorant Garamond carries display lines in Latin and Cyrillic. Manrope carries interface text.

The homepage header is a solid ocean bar. It changes to limestone after the arrival chapter, so links are never drawn transparently on a photograph. The hero begins below that bar and fills the remaining viewport edge to edge.

Development photographs stay labeled and are omitted when `PEACOCK_ENV` is `production`. Unpublished rooms, events and reviews stay as short statements with a route onward. They are not expanded into empty galleries.
