## Context

The app is Next.js 16 (App Router) + Tailwind v4 with shadcn-style oklch tokens in `globals.css`, exposing a `.dark` class variant (`@custom-variant dark (&:is(.dark *))`). `next-themes` is already a dependency and is consumed by `sonner`, but **no `ThemeProvider` is mounted**, so there is no `.dark` class toggling and no persistence — dark mode is effectively dead code today. Accent tokens are grayscale.

The original Vite/React portfolio expresses its identity through plain CSS variables: `--accent-primary: #6366f1`, `--accent-secondary: #8b5cf6`, gradient text via `background-clip: text`, animated blurred "gradient orbs" behind the hero, underline-grow nav links, and hover-lift cards. We port that *look* onto the existing token system rather than copying its CSS architecture.

The home hero and specialties are currently hard-coded in `page.tsx`. Since we just made About/contact/social admin-editable, the redesign must not reintroduce hard-coded copy — the new hero/specialties become settings-backed too.

## Goals / Non-Goals

**Goals:**
- A working, persistent dark/light toggle across the whole app (public + admin), dark by default to match the original.
- Indigo→violet accent, gradient text, animated glow, and hover-lift cards, all reusable and `prefers-reduced-motion`-aware.
- Redesigned nav, home, and footer matching the original's identity.
- Keep all redesigned home content admin-editable (hero text + specialties).
- Reuse the existing token/utility system; no new dependencies.

**Non-Goals:**
- No new routes (Reel, Contact pages) — no data/source exists for them yet; contact stays in the footer.
- No admin-configurable theme colors (accent is fixed in CSS); the admin only toggles light/dark like any visitor.
- No redesign of the project detail or projects-browser internals beyond shared card/accent styling.
- No change to auth, data-fetching, or API patterns.

## Decisions

### Decision: Wire `next-themes` with the class strategy, dark default

Mount `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>` in the root layout, wrapping all children (so admin inherits it too), and add `suppressHydrationWarning` to `<html>`.

- **Why class strategy:** `globals.css` already defines `.dark { … }`; `next-themes` toggling the `.dark` class on `<html>` activates it with zero token rewiring.
- **Why dark default:** matches the original's `defaultTheme='dark'`. `enableSystem` still lets first-time visitors get their OS preference; explicit toggles persist to `localStorage`.
- **Alternative considered:** a hand-rolled `data-theme` context like the original. Rejected — `next-themes` is already installed, handles SSR/hydration/persistence correctly, and avoids a flash-of-wrong-theme.

### Decision: Accent + glow as additive CSS, not a token rewrite

Add `--accent-primary`/`--accent-secondary` (indigo/violet) and tint `--primary` to indigo in both `:root` and `.dark`, then add reusable classes in `globals.css`:
- `.gradient-text` (the indigo→violet `background-clip: text` treatment),
- `.glow-orb` + `float` keyframes for the hero background,
- `.hover-lift` for cards (translateY + accent border + shadow on hover).

All animations are wrapped in `@media (prefers-reduced-motion: no-preference)` (orbs render static otherwise).

- **Why tint `--primary` to indigo:** it makes the existing shadcn `Button`/badges cohesive with the accent app-wide (including admin) without touching each component.
- **Trade-off:** changing `--primary` recolors admin buttons too. That's desirable (one cohesive accent), and contrast stays AA against white foreground.

### Decision: ThemeToggle is a small client component reused in two headers

A single `ThemeToggle` (sun/moon `lucide-react` icons, `useTheme()`), `mounted`-guarded to avoid hydration mismatch, placed in `site-header.tsx` and the admin `(panel)/layout.tsx`.

### Decision: Hero + specialties move into site settings

Extend `site_settings` with `hero_title` (text), `hero_subtitle` (text), and `specialties` (`jsonb` `{title, description}[]`). `DEFAULT_SITE_SETTINGS` carries the current copy; `getSiteSettings()` merges as before; the admin form gets a "Home" section. The public home reads these via the existing `getSiteSettings()` call.

- **Why extend the singleton vs a new table:** consistent with the existing settings pattern; one read already happens on every page.
- **Migration:** additive `ALTER TABLE … ADD COLUMN` with defaults; applied via the neon-http migrator (the websocket `drizzle-kit migrate` hung previously — see prior change), then the default row is updated to include the new fields.

### Decision: Glow is decorative and non-interactive

Orbs live in an `aria-hidden`, `pointer-events-none`, `overflow-hidden` container behind hero content (`z-0` vs `z-10`), so they never trap clicks or screen readers.

## Risks / Trade-offs

- **[Flash of unstyled/wrong theme]** → `suppressHydrationWarning` on `<html>` + `next-themes` inlined script; `disableTransitionOnChange` prevents a transition flash on load.
- **[ThemeToggle hydration mismatch]** → render a neutral placeholder until `mounted`, then swap to the real icon.
- **[Dark-default surprises existing light-mode expectations]** → acceptable and intended (matches original); users can toggle and the choice persists.
- **[Admin forms readability in dark]** → admin already uses tokenized UI components, which adapt to `.dark`; verify contrast on inputs/badges during QA.
- **[Glow perf on low-end devices]** → few large blurred elements; `will-change` avoided, animation paused under `prefers-reduced-motion`.
- **[Migration on Neon]** → additive columns with defaults; a missing/old row is tolerated by `DEFAULT_SITE_SETTINGS`, so deploy ordering isn't fragile.

## Migration Plan

1. Add columns to `src/lib/db/schema.ts`; `npm run db:generate`.
2. Apply via the neon-http migrator (loading `DATABASE_URL` from the local `env`), then update the `id=1` row to include `heroTitle`/`heroSubtitle`/`specialties` defaults.
3. Ship code; public pages fall back to `DEFAULT_SITE_SETTINGS` if columns/row are absent, so there is no hard ordering requirement.
4. **Rollback:** revert code; the added columns are inert if unused.

## Open Questions

- Should `enableSystem` be on, or force dark-default ignoring OS? (Assumed: `enableSystem` on, dark fallback.)
- Do we want the original's Reel/Contact routes later? (Deferred; out of scope here.)
