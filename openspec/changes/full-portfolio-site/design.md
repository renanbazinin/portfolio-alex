## Context

The unified Next.js app (App Router, Drizzle/Neon, Tailwind v4 + shadcn, Vercel Blob, cookie auth) is live. Today the public surface is just a projects list at `/` plus per-slug detail and the admin. There is no hero, no about, no story, and no way to spotlight the best work. The owner wants a full clean-minimal portfolio for Alex. The data model has no `featured` flag yet.

## Goals / Non-Goals

**Goals:**
- A real home page: clean-minimal hero + featured-works showcase + entry to the full list.
- A shared site shell (minimal header/nav + footer) and a consistent clean-minimal design system across public pages.
- An about page (statically authored bio/skills/contact).
- A `featured` flag on projects, controllable in admin, driving the home showcase with a graceful fallback.
- Reuse the existing stack — no new dependencies or infra.

**Non-Goals:**
- Editable About content via admin/DB (static for now).
- CMS-managed home copy, blog, contact form backend, analytics, i18n.
- Redesigning the admin's visual style (it stays utilitarian).
- Any auth/storage/deployment changes.

## Decisions

- **Routing:** move the full list to `/projects` and make `/` the new home. Keep `/projects/[slug]` for detail. Add `/about`. The nav (Home · Projects · About) lives in a shared layout that wraps the public route group. Alternative considered: keep the list at `/` — rejected because a portfolio home should lead with a curated showcase, not a raw list.
- **Public route group + layout:** introduce a public layout (header + footer + design-system wrapper) so the admin (which has its own layout) is unaffected. Use a route group like `(site)` for public pages to share the shell without affecting URLs.
- **Design system:** clean-minimal — system/Geist sans already loaded, a tightened type scale, generous spacing, neutral palette from the existing shadcn tokens with a single restrained accent, subtle hover/transition conventions. Implement with Tailwind utility patterns and a few small shared components (Container, SectionHeading, ProjectCard). Keep it dependency-light; reuse shadcn primitives already installed.
- **Featured flag:** add `featured boolean not null default false` to the `projects` table (Drizzle schema + generated migration). Extend the zod `projectInputSchema`, the data-access reads, create/update writers, and API payloads. Add `listFeaturedProjects()` (published + featured, sort order) and have the home page call it, falling back to recent published projects when empty.
- **Admin control:** add a featured checkbox/switch to the project form and a featured indicator + quick toggle in the dashboard (reusing the existing PUT endpoint pattern).
- **Home showcase rendering:** server component reads featured (or fallback) and renders a refined card/grid consistent with the design system; hero and CTAs are static markup.

## Risks / Trade-offs

- **[Migration on a live DB]** Adding a non-null column with a default is safe (existing rows backfill to false) → run the generated migration via `db:migrate`; verify locally against the dev/prod DB before deploy.
- **[Visual subjectivity — "best design"]** Clean-minimal is the agreed direction, but taste varies → keep the design-system tokens centralized so the look is easy to tune; ship a coherent first pass and iterate.
- **[About content is placeholder]** Real bio is unknown → write tasteful placeholder copy clearly marked, structured so it's a one-file edit to replace later.
- **[Routing change]** Moving the list from `/` to `/projects` changes URLs → acceptable for a personal site; ensure nav and any internal links point to the new paths.

## Migration Plan

1. Add `featured` to schema; generate and apply the Drizzle migration.
2. Thread `featured` through validation, data access (incl. `listFeaturedProjects`), writers, and API payloads.
3. Build the public shell (layout, header, footer) and design-system helpers.
4. Build home (`/`), move list to `/projects`, add `/about`; refine project cards to the design system.
5. Add the admin featured toggle (form + dashboard).
6. Verify locally (lint, build, test, manual: mark featured → appears on home; nav; responsive), commit, push; Vercel auto-deploys.
- **Rollback:** revert the commit/redeploy a prior deployment; the `featured` column is additive and harmless if unused.

## Open Questions

- Final hero copy and Alex's one-line statement (placeholder until provided).
- Whether `/projects` should also become the target of the header "Projects" link vs a mega-showcase later (assuming a straightforward list page for now).
