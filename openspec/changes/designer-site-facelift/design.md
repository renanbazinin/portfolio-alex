## Context

The public site (home, about, projects index, project detail) is built on Next.js 16.2.9 (App Router, RSC), Tailwind CSS v4 (CSS-config via `@theme` in `src/app/globals.css`), and shadcn/ui (radix-nova style, neutral base). The current look is monochrome, light-only, and static: no accent color, no motion, text-only mobile menu, raw `<img>` tags, and dark-mode tokens that exist in CSS but are never activated (`next-themes` is installed but not wired). Content comes from Postgres via Drizzle (projects) plus hardcoded copy on home/about. Admin panel exists and is out of scope beyond inherited token changes.

Constraints:
- AGENTS.md: this Next.js version has breaking changes; the guides in `node_modules/next/dist/docs/` MUST be read before writing code. `node_modules` is currently not installed, so implementation starts with `npm install` + doc review.
- Public pages use `export const dynamic = "force-dynamic"` because content is admin-editable; this stays.
- Project imagery is stored in Vercel Blob (remote URLs), which matters for `next/image` configuration.

## Goals / Non-Goals

**Goals:**
- A distinctive, cohesive visual identity: expressive display typography, one confident accent color, refined light and dark themes.
- Dark mode working end-to-end with a toggle and no flash-of-wrong-theme.
- A motion layer that makes the site feel alive (entrances, scroll reveals, hover reveals, animated filtering) while fully respecting `prefers-reduced-motion`.
- Case-study-grade project presentation: better cards, a richer detail page, prev/next navigation.
- Keep the stack: Tailwind v4 tokens + shadcn primitives remain the foundation; no CSS framework churn.

**Non-Goals:**
- No changes to DB schema, API routes, auth, or admin workflows.
- No CMS migration; hardcoded home/about copy stays hardcoded (lightly edited to fit layouts).
- No new pages or information architecture changes (nav stays Home / Projects / About).
- No lightbox/gallery *library* integration beyond what the detail page needs (a simple dialog-based lightbox using the existing shadcn Dialog is acceptable).

## Decisions

### D1: Motion — `motion` library for orchestration, CSS for micro-interactions
Add the `motion` package (framer-motion's successor, React 19 compatible) and use it in client components for: staged hero entrance, scroll-reveal sections (`whileInView`), staggered grids, and animated filter/search reordering in `ProjectsBrowser` (layout animations — impractical in pure CSS). Hover states, underline reveals, and button/press feedback stay pure CSS/Tailwind (`tw-animate-css` is already installed). *Alternative considered:* CSS-only + IntersectionObserver — lighter, but animated grid reordering and staggered orchestration would be fragile hand-rolled code; `motion` is tree-shakeable and battle-tested. Motion components are client components; server components pass data down, keeping RSC boundaries clean.

### D2: Dark mode — `next-themes` with class strategy, system default
Wrap the root layout in a `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`), add `suppressHydrationWarning` on `<html>`, and place an animated sun/moon toggle in the header. The `.dark` token block in `globals.css` already exists and gets a full audit/refresh alongside the new palette. *Alternative:* dark-only site (fashionable for portfolios) — rejected; system-default with a toggle serves more visitors and shows more craft.

### D3: Typography — add a display serif via `next/font`, keep Geist for body/UI
Add **Fraunces** (variable, optical sizing) through `next/font/google` as `--font-display`, used for the hero, page titles, and section headings. Geist Sans stays for body/UI, Geist Mono for meta labels (year, role, tools) — reinforcing the existing editorial kicker style. *Alternative:* all-Geist with weight/size contrast only — safe but indistinguishable from every default shadcn site; the brief is "astonishing."

### D4: Color — one accent, neutral-warm recalibration, oklch throughout
Keep the neutral shadcn base but shift neutrals slightly warm and introduce a single saturated accent (defined once as `--accent-brand` in oklch, with light/dark variants) used for: link/hover underlines, focus rings, selection color, the theme toggle, and small graphic moments (kicker ticks, active filter state). Accent is deliberately scarce — the work imagery supplies most color. *Alternative:* multi-hue palette — rejected as noise around portfolio imagery.

### D5: Images — `next/image` with Vercel Blob remote pattern
Replace raw `<img>` on public pages with `next/image`; add `images.remotePatterns` for `*.public.blob.vercel-storage.com` in `next.config.ts`. Proper `sizes` per grid slot, `priority` on the hero/first card, and CSS blur-up placeholders. This is both a perf and a polish decision (no layout shift, smooth loading).

### D6: Page transitions — CSS/`motion` fades now, View Transitions as a doc-gated enhancement
Ship a lightweight route-level entrance treatment (template-level fade/rise via `motion` or CSS animation). Next.js view transitions support in 16.2.9 is unknown until the bundled docs are read (AGENTS.md warning); if the docs show a stable/experimental `viewTransition` option, it may be adopted as a progressive enhancement — otherwise skip. Do not block the facelift on it.

### D7: Project detail as case study — layout, lightbox, prev/next
Detail page becomes: full-width hero media, sticky meta rail on desktop (category, year, role, tools, video link), prose description, image stack with per-image scroll reveal, and prev/next project footer navigation computed from the published-projects ordering already available in `src/lib/projects.ts` (no schema change). Lightbox = shadcn Dialog wrapping the tapped image; no new gallery dependency.

### D8: Reduced motion — enforced at both layers
CSS animations gated behind `@media (prefers-reduced-motion: no-preference)`; `motion` components use `useReducedMotion()`/`MotionConfig reducedMotion="user"` so entrances collapse to simple fades or none. This is a spec-level requirement, not a nice-to-have.

## Risks / Trade-offs

- [Next.js 16 breaking changes unknown to prior knowledge] → Hard gate: `npm install`, then read the relevant guides in `node_modules/next/dist/docs/` (fonts, images, config, client/server components) before touching code. Nothing in this design assumes an API that isn't verified there first.
- [Theme flash on first paint] → `next-themes` inline script + `suppressHydrationWarning`; verify with a hard reload in dark system preference.
- [`motion` + RSC boundaries: accidentally converting server pages to client] → Keep pages as server components; motion lives in small leaf client components (`<Reveal>`, `<StaggerGrid>`, `<HeroIntro>`) that accept children/props.
- [`next/image` with Blob URLs mis-configured → broken images in prod] → remotePatterns added and verified against a real stored URL; fallback path tested with the seed data.
- [Animated filtering in ProjectsBrowser regressing search UX] → Filtering logic untouched; animation wraps presentation only. If layout animation janks on large grids, degrade to fade-only.
- [Accent color cheapening the monochrome editorial feel] → Accent used only in the enumerated locations (D4); imagery remains the primary color source.
- [Perceived scope creep into admin] → Admin only inherits token changes; visual QA pass on admin login/dashboard to confirm nothing broke, no redesign.

## Migration Plan

Single deploy, no data migration. Rollback = revert the commit(s). The change is additive/presentational; API and DB are untouched. Verify on a Vercel preview deployment before promoting (imagery domains, fonts, both themes).

## Open Questions

- Does Next.js 16.2.9 expose a stable View Transitions integration? (Resolved by reading bundled docs at implementation start — D6 gates on it.)
- Exact accent hue (candidate: warm orange-red or acid chartreuse in oklch) — pick during implementation against real project thumbnails, since imagery dominates the palette.
