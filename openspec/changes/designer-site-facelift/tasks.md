## 1. Setup & Gate (AGENTS.md hard requirement)

- [x] 1.1 Run `npm install` so `node_modules/` (and the bundled Next.js docs) exist
- [x] 1.2 Read the relevant guides in `node_modules/next/dist/docs/` (fonts, images, next.config, client/server components, and anything on view transitions) and note deviations from prior Next.js knowledge before writing code
- [x] 1.3 Add the `motion` package; verify `npm run dev` and `npm run build` pass on the untouched baseline

## 2. Design System (specs/design-system)

- [x] 2.1 Rework `globals.css` `@theme` tokens: warm-neutral palette, `--accent-brand` (light + dark oklch variants), radius, motion duration/easing custom properties
- [x] 2.2 Complete and tune the `.dark` token block so every token used by public pages has a dark value (AA contrast)
- [x] 2.3 Add Fraunces via `next/font/google` in `src/app/layout.tsx`, expose as `--font-display`, and apply to hero/page/section headings
- [x] 2.4 Wire `next-themes`: `ThemeProvider` (attribute="class", system default) in root layout with `suppressHydrationWarning` on `<html>`; verify no theme flash on dark-system hard reload
- [x] 2.5 Build the animated sun/moon theme toggle component (keyboard operable, accent focus ring) — placed in header in task 4.1
- [x] 2.6 Sweep public components for hardcoded colors/fonts; replace with token-backed utilities

## 3. Motion Foundation (specs/motion-interactions)

- [x] 3.1 Create shared motion constants (durations, easings, stagger values) and leaf client components: `<Reveal>` (whileInView, once), `<StaggerGroup>`, `<HeroIntro>` (hero entrance implemented as no-JS-safe CSS `anim-rise` classes instead of a HeroIntro component)
- [x] 3.2 Wrap the app in `MotionConfig reducedMotion="user"` and gate all CSS animations behind `prefers-reduced-motion: no-preference`; ensure reveals degrade to visible (no hidden-content trap without JS)
- [x] 3.3 Define global micro-interaction styles: link underline reveals, button hover/active, accent `focus-visible` ring, selection color

## 4. Site Chrome (specs/site-chrome)

- [x] 4.1 Rebuild `site-header.tsx`: scroll-aware sticky treatment (transparent → blur+border), active-nav accent underline, animated hover states, theme toggle slot
- [x] 4.2 Build the animated mobile menu: overlay/drawer with staggered links, icon morph trigger, focus trap, Escape/route-change close, scroll lock
- [x] 4.3 Redesign `site-footer.tsx`: display-type contact CTA, social links with hover treatments, keep hidden admin link; extract social/contact URLs into a single site config module

## 5. Home Showcase (specs/home-showcase)

- [x] 5.1 Rebuild the home hero: full-viewport editorial layout in display type, staged entrance (headline → copy → CTA), CTA to /projects
- [x] 5.2 Rebuild the featured-work section: editorial grid from featured (fallback recent) projects, hover/focus reveal of title+category, safe zero-project state
- [x] 5.3 Redesign the specialties section as numbered editorial rows with staggered scroll reveal

## 6. Project Gallery (specs/project-gallery)

- [x] 6.1 Configure `next/image` remotePatterns for Vercel Blob in `next.config.ts`; replace raw `<img>` across public pages with `next/image` (correct `sizes`, aspect-ratio reservation, `preload` on hero/first card — Next 16 deprecated `priority`)
- [x] 6.2 Redesign `project-card.tsx`: image treatment, hover/focus reveal with keyboard parity, blur-up loading, no layout shift
- [x] 6.3 Add animated filtering to `ProjectsBrowser` (layout animations on filter/search change, logic untouched), aria-live result count, and a designed empty state with clear-filters action
- [x] 6.4 Rebuild the project detail page as a case study: full-width hero media, desktop-sticky meta rail, prose description, per-image scroll reveal
- [x] 6.5 Add dialog-based image lightbox (shadcn Dialog: Escape close, focus management)
- [x] 6.6 Add prev/next project navigation (title + thumbnail) computed from published ordering in `src/lib/projects.ts`, with single-project edge case handled
- [x] 6.7 Apply the facelift treatment to the About page (display headings, scroll reveals, token sweep)

## 7. Verification & Polish

- [x] 7.1 Full pass in light and dark themes across all public pages: contrast, no light-theme remnants, toggle persistence (headless-Chromium pass: system-dark first paint, toggle + reload persistence, screenshots of home/projects/detail/about in both themes)
- [x] 7.2 Reduced-motion pass: emulate `prefers-reduced-motion: reduce` and confirm no movement animations while menu/toggle/filtering/lightbox still work (hero CSS animation → none; JS reveals collapse to opacity-only via MotionConfig)
- [x] 7.3 Keyboard/a11y pass: tab through header, menu, cards, toggle, lightbox — visible focus everywhere, focus trap/restore correct (accent focus ring verified, Escape closes menu/lightbox, focus returns to trigger)
- [x] 7.4 Visual QA of admin login to confirm inherited token changes broke nothing (dashboard behind auth — login page renders cleanly with new tokens; same shadcn primitives throughout)
- [x] 7.5 `npm run build` + run the app against real seed data; verified images render via next/image with preload on hero, aspect-ratio boxes reserve space
- [x] 7.6 Check mobile viewports (menu, hero scale, grids, sticky meta rail stacking) at 360px/768px/1024px — fixed a real bug found here: mobile menu overlay used `fixed` inside the header's backdrop-filter containing block and collapsed; now `absolute top-full`
