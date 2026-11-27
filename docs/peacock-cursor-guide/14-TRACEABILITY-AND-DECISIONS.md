# 14 — Requirement traceability, decisions and client blockers

| ID | Requirement | Proposal page | Implementation module | Test anchor |
|---|---|---:|---|---|
| P01 | responsive home experience | 4 | `app/[locale]/page.tsx` | E2E Home |
| P02 | About | 4 | `about/page.tsx` | content acceptance |
| P03 | room listing/detail/CTA | 4–5 | rooms feature | ENQ-01 |
| P04 | restaurant & menu | 4 | restaurant feature | restaurant QA |
| P05 | reviews submit/moderate | 4,6 | reviews feature | REVIEW-01/02 |
| P06 | seasonal events | 4,6 | events feature | event CRUD |
| P07 | contact/map | 4 | contact feature | link tests |
| P08 | WhatsApp and Telegram | 3,5 | enquiry feature | ENQUIRY-02 |
| P09 | English/Russian | 2,5 | `messages` and locale routes | SEO-01 |
| P10 | admin room/events/reviews | 6 | admin groups | AUTH-01/02 |
| P11 | SEO/Yandex foundation | 7 | SEO/metadata | SEO-01/02 |
| P12 | delivery/maintenance | 8,10 | ops checklist | launch report |

## Business constraints from source
- 27 rooms + restaurant in Unawatuna (pp. 1–2).
- One-time project fee **LKR 358,000**; 50% **LKR 179,000** start, 50% after launch (p. 9). Do not copy guessed costs into invoices.
- **LKR 12,000/month** proposed maintenance, domain/hosting/services excluded (p. 10).
- Four-week target conditional on approvals and content (p. 8).
- SEO Top 5 not guaranteed; no paid monthly SEO campaign included (p. 7).

## Open decisions / needed verified inputs
1. Approved brand/logo/colors; site images/video/copyright.
2. Content inventory and 27 rooms vs room types mapping; features/occupancy and rates.
3. Official contact number and WhatsApp ID; Telegram exact URL/link type and support of prefilled text.
4. Verified EN/RU translations and responsible approver.
5. Final main domain, possible `.ru` secondary and canonical strategy.
6. Hosting region and access, Atlas/Cloudinary billing owners, admin users and MFA provider.
7. Hotel address/map pin, restaurant menu and policies.
8. Review consent/privacy, retention, moderator actions and public rating behavior.
9. Explicit authorizations for any extra CMS modules (site settings, staff roles, audit viewer) beyond proposal minimum.

## Decision logging format
`Date | ID | option A/B | decision | reason | approver | impact | tests | deployment`.

## Source integrity
Everything outside the proposed public sections, limited admin dashboard, EN/RU/WhatsApp/Telegram, and SEO baseline is *recommended engineering design*, not a client-signed extra feature. An implementation-ready guide is not a completed software product; empirical test evidence is required before a release-complete claim.
