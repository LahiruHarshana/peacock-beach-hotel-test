# 11 — Copy / paste instructions for Cursor Agent

## PROMPT A — Repository audit (run first)
```text
Read AGENTS.md and all numbered development guide MDs. Read the original proposal if present. Audit the current repository without editing any code. Return: stack/version detection, missing requirements, vulnerabilities, existing page/component map, current Git state, conflicted architecture choices, client content gaps, and a prioritized issue backlog with acceptance criteria. Mark every claim as Verified / Assumed / Needs Client Input. Do not claim implementation complete. After audit, propose the first 3 small UI tasks. Respect the exclusions.
```

## PROMPT B — Premium UI first (recommended NEXT)
```text
Implement PHASE 1 ONLY: a premium editorial coastal hospitality UI for Peacock Beach Hotel. Use one Next.js App Router TypeScript repo, Tailwind and shadcn/ui primitives where appropriate. Build beautiful responsive EN/RU navigation, home, rooms listing and room detail, with authentic-content placeholders clearly marked NOT FOR PRODUCTION. Aim for a sophisticated photographic site, with deep ocean ink, warm natural paper, fine typography, precise alignment, thoughtful space, accessible contrast and subdued motion. Avoid purple gradients, giant rounded SaaS cards, glass effects, AI aesthetic and generic luxury claims. Preserve the WhatsApp/Telegram enquiry-first business journey; do not implement availability/checkout. Reuse components, verify 390/768/1440 layouts, test keyboard, implement all states and report actual screenshots/tests. Do not add DB/auth yet beyond necessary scaffolding. Stop after the phase and provide a reviewed file manifest.
```

## PROMPT C — Auth and Atlas DAL
```text
Now implement secure Atlas MongoDB access, Zod DTOs, maintained authentication, admin roles and server-only authorization DAL. First inspect installed versions and compatible official documentation. Keep admin provisioning private; no public registration. Explain MongoDB has no native PostgreSQL RLS and implement equivalent document-scoped query protections. Deny by default. Build negative integration tests for anonymous access, wrong role, draft leakage, NoSQL operators and privilege escalation. Do not modify approved UI except integration points. Return exact file list, environment variables, setup and test results.
```

## PROMPT D — Content + CMS
```text
Implement rooms, events and review workflows in isolated vertical slices. Admin create/edit/publish room and event, moderate review; public sees published/approved only. Strict server schemas, concurrency versions, audit, indexes, bound queries, localized EN/RU fields. Reusable forms with inline field errors, loading, toasts only on confirmed saves, meaningful empty states. Integrate Cloudinary signed upload with verification and cleanup. Include end-to-end tests for each slice. Never invent hotel-specific content.
```

## PROMPT E — SEO and production hardening
```text
Implement canonical/hreflang/EN+RU metadata, sitemap/robots, truthful Hotel/Restaurant/Event structured data only with verified info, mobile Core Web Vitals improvements, accessibility, secure headers/CSP, rate limits, secret scanning, error logs and release checks. Test all public paths and booking-enquiry handoffs. Produce a QA report with actual passing/failing commands, exceptions, deployment steps, rollback and open blockers. Never promise top-5 search rankings.
```

## PROMPT F — Hard final audit (run last)
```text
Audit the repository against 01-SCOPE-AND-ACCEPTANCE.md and every criterion in 09-TESTING-QA-RELEASE.md. Output a traceability matrix of requirement -> exact source file -> test -> evidence -> PASS/FAIL/BLOCKED. Identify unauthorized pages, unbounded queries, secrets, missing translations, SEO defects, broken media, security gaps, placeholder content and proposal exclusions accidentally added. Fix issues in small commits only after outlining changes. If evidence is missing, mark NOT VERIFIED, never “100% complete”.
```
