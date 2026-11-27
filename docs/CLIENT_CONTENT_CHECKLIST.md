# Client content checklist

Nothing in this list has been approved by the hotel. Staff can enter the values below. Empty values and any text containing `CONTENT REQUIRED` stay off the public pages or are rejected on save. Rooms and events remain `DRAFT` until a publish check passes.

| Item | Where to enter it | Public behavior until approved |
|---|---|---|
| Hotel name, EN and RU | Admin → Site settings | The current public name is the project name already used on the site. |
| Homepage description, EN and RU | Admin → Site settings | Omitted from metadata and JSON-LD while it is empty or still a placeholder. |
| About text, EN and RU | Admin → Site settings | The about page shows an unpublished notice. |
| Address, EN and RU, and map link | Admin → Site settings | Contact shows “address will appear after it is verified.” JSON-LD omits the address. |
| WhatsApp number and Telegram URL | Admin → Site settings | Enquiry offers copy-message only. It does not confirm a booking. |
| Sharing image | Upload in Media, then paste the `peacock/prod/general/…` public id in Site settings | Open Graph image is omitted until a namespace-valid id is saved. |
| Restaurant introduction and photograph | Site settings, image category `restaurant` | The page keeps a fixed 3:2 frame and an unpublished notice. There is no structured menu. |
| Rooms, occupancy, amenities, licensed photographs, alt text | Admin → Rooms | Drafts are hidden. Publish requires both languages, alt text, and a verified image. |
| Events | Admin → Events | Drafts are hidden. Publish requires both languages and a verified image. |
| Guest reviews | Public form, then Admin → Reviews | Only `APPROVED` reviews are public. |

Do not invent prices, reviews, phone numbers, or photography to fill these fields. A displayed room rate is optional and must come from the hotel.

Each settings save writes an audit row `settings.update`. Room, event, review, and media actions write their own audit rows.
