## Why

The site currently has a single projects list plus an admin. It works, but it isn't a portfolio someone would land on and be impressed by — there's no home/hero, no story about who Alex is, and no way to spotlight the best work. We want a full, polished, clean-minimal portfolio: a home that leads with a curated showcase, an about page, and a refined projects experience — so the site sells Alex's work, not just lists it.

## What Changes

- Add a **home page** with a clean-minimal hero (name, one-line statement, primary calls-to-action) followed by a **featured works** showcase and a short lead-in to the full project list.
- Add an **about page** with a polished, statically-authored bio, skills/disciplines, and contact links (clean-minimal layout; content is placeholder copy for now, editable in code later).
- Add a shared **site shell**: a minimal sticky header/nav (Home · Projects · About) and a footer with contact/social links, applied across all public pages.
- Add a **"featured" capability**: projects can be marked featured; the home showcase renders featured projects (with a sensible fallback when none are marked). Admin gains a featured toggle.
- Refine the **projects experience** to match the clean-minimal design system (consistent type scale, spacing, hover states) and keep the existing search/filter and per-project detail.
- Establish a lightweight **clean-minimal design system** (typography, spacing, neutral palette with a single restrained accent, motion/hover conventions) used consistently across pages.

## Capabilities

### New Capabilities
- `site-shell`: Shared public layout — header/nav, footer, and the clean-minimal design system applied site-wide.
- `home-page`: The landing page with hero, featured-works showcase, and entry into the full project list.
- `about-page`: A statically-authored about page (bio, skills/disciplines, contact).
- `featured-works`: Marking projects as featured and surfacing them on the home page, with admin control.

### Modified Capabilities
- `admin-management`: Add the ability to mark/unmark a project as featured from the admin (extends create/edit and the dashboard).
- `project-content`: Add a `featured` attribute to the project data model and expose it where projects are read.

## Impact

- **Routes/pages**: new `/` (home) replacing the current list-only home, new `/about`; existing `/projects/[slug]` retained; the projects list moves to its own page (e.g. `/projects`) reachable from the nav.
- **Data model**: add a `featured` boolean to the `projects` table (Drizzle schema + migration); include it in validation, data-access reads, and API payloads.
- **Admin**: featured toggle in the project form and dashboard; no auth/storage changes.
- **Components**: new shell (header/footer), home, about, featured showcase; refactor of existing public components to the shared design system.
- **No new external dependencies or infra** beyond the existing Next.js + Drizzle/Neon + shadcn/Tailwind stack; deploys on the same Vercel project.
