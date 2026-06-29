## 1. Featured data model

- [x] 1.1 Add `featured boolean not null default false` to the `projects` Drizzle schema
- [x] 1.2 Generate and apply the migration (`db:generate`, `db:migrate`)
- [x] 1.3 Add `featured` to the zod `projectInputSchema` (default false)
- [x] 1.4 Thread `featured` through create/update writers and ensure it's in API payloads
- [x] 1.5 Add `listFeaturedProjects()` (published + featured, ordered by sortOrder) to the data layer

## 2. Public site shell + design system

- [x] 2.1 Create a public route group `(site)` with a shared layout (header + footer wrapper)
- [x] 2.2 Build a minimal sticky header with Home/Projects/About nav and active-state indication
- [x] 2.3 Build a footer with contact/social links
- [x] 2.4 Add clean-minimal design-system helpers (Container, SectionHeading, refined ProjectCard) and shared tokens/utilities
- [x] 2.5 Ensure responsive behavior (mobile nav, readable content, no horizontal scroll)

## 3. Pages

- [x] 3.1 Build the home page (`/`): clean-minimal hero (name, one-liner, CTA)
- [x] 3.2 Add the featured-works showcase to the home page (featured projects, with recent-published fallback when none featured)
- [x] 3.3 Add a clear "view all projects" entry from the home page
- [x] 3.4 Move the full projects list/search/filter to `/projects` using the shared design system
- [x] 3.5 Refine `/projects/[slug]` detail to the shared design system
- [x] 3.6 Build the about page (`/about`) with static bio, skills/disciplines, and contact links

## 4. Admin featured control

- [x] 4.1 Add a featured toggle to the project create/edit form
- [x] 4.2 Add a featured indicator (and quick toggle) in the dashboard list

## 5. Verify, commit, deploy

- [x] 5.1 Run lint, test, and build; fix any issues
- [x] 5.2 Manually verify: mark a project featured → it appears in the home showcase; nav works; about renders; mobile layout is clean
- [x] 5.3 Commit and push; confirm the Vercel production deployment serves the new home/about/projects
