# 08 — Cloudinary image/video security and workflow

## Policy
Only approved staff can upload property media. Production final media must be authentic hotel/client-supplied and licensed. Cloudinary is not a replacement for ownership/rights checks.

## Signed direct-upload flow
1. Admin chooses file; frontend checks preview only (untrusted).
2. POST to `/api/admin/uploads/sign` with desired allowed asset category; server verifies staff capability and rate limits, sets fixed `asset_folder` and permitted type/size/format constraints and returns minimal signed parameters.
3. Client uploads file *directly* to Cloudinary with exact signed parameters. Secret stays only on server.
4. POST `/api/admin/uploads/complete` with returned `public_id`, resource type and correlation fields; server fetches/verifies asset details via authenticated Cloudinary API (don't trust browser-provided URL/dimensions), validates ownership/path and policy, stores metadata.
5. Attach media to room/event via allowlisted asset ID; server verifies asset exists and ownership/approved state.
6. On replacement/delete, remove references safely and delete truly orphaned media under policy; confirm Cloudinary results and audit.

## Practical guards
- Reject unsafe formats, SVG/HTML, untrusted raw data and overly large files; image allowlist e.g. JPEG/PNG/WebP/AVIF, supported video only if required; inspect server-side result, set size/dimension/duration caps.
- Require sensible image alt text in EN/RU for meaningful images; decorative images have empty alt.
- Keep exact Cloudinary public IDs in DB; don't accept arbitrary remote URLs as trusted asset data.
- Restrict and test Cloudinary URL sources with Next image remotePatterns; disallow URL-based open redirects.
- Do not use public unsigned upload preset for privileged CMS assets.
- Include upload progress, errors, retry, reorder, crop settings, remove confirmation and accessible media list.
- Configure video autoplay muted with controls or user interaction, captions/transcripts where applicable, reduced-motion alternatives.

## Notes
Cloudinary signed upload docs: https://cloudinary.com/documentation/client_side_uploading and https://cloudinary.com/documentation/upload_images . Do not expose `CLOUDINARY_API_SECRET` to frontend. Cloudinary signatures alone are not durable authorization; complete step must verify uploads.
