## Why

The current site is a clean but visually plain shadcn/grayscale layout: no working theme toggle (a `ThemeProvider` is never mounted, so dark mode can't be switched), a flat hero, and a minimal footer. The owner's original portfolio (renanbazinin/alex-portfolio) has a stronger visual identity — a dark-first theme with a light toggle, an indigo→violet accent, gradient text, an animated "glow" hero, an underline-grow nav, and hover-lift cards. This change ports that identity onto the current Next.js app while keeping everything the redesign surfaces editable from the admin panel (so we don't regress the content-management work just shipped).

## What Changes

- **Theme / dark mode**: mount `next-themes` `ThemeProvider` (class strategy, dark default) across the whole app, add a sun/moon `ThemeToggle`, and fix the `<html suppressHydrationWarning>` setup. The toggle appears in both the public nav and the admin header.
- **Accent + glow design tokens**: introduce indigo (`#6366f1`) / violet (`#8b5cf6`) accent variables, a `gradient-text` utility, animated blurred "gradient orb" hero glow, and hover-lift card styling — all `prefers-reduced-motion` aware.
- **Nav bar**: gradient "ALEX" wordmark, underline-grow active/hover links, integrated theme toggle, refined mobile menu.
- **Home page**: glowing hero (gradient name + orbs + primary/secondary CTAs), restyled featured-projects section, and hover-lift specialty cards.
- **Footer**: two-column brand + "Connect" layout with gradient title and copyright bar, still driven by the admin-managed contact/social settings.
- **Admin-editable home content**: extend site settings with `heroTitle`, `heroSubtitle`, and a `specialties` list, and surface them in the admin settings form, so the redesigned home stays fully editable (no re-hard-coded copy). **BREAKING** (data shape only): `site_settings` gains columns; handled by an additive migration with defaults.
- **Polish / best practices**: focus-visible rings, smooth theme transition, custom scrollbar, and consistent accent usage.

## Capabilities

### New Capabilities
- `site-theming`: A site-wide theme system — dark/light toggle persisted across visits, accent/glow design tokens, and shared visual primitives (gradient text, glow, hover-lift) used by the public site and admin.

### Modified Capabilities
- `site-content-management`: Site settings additionally store the home hero text (`heroTitle`, `heroSubtitle`) and an editable `specialties` list, and the admin settings screen can edit them.

## Impact

- **New code**: `ThemeProvider` + `ThemeToggle` components; theme/glow CSS in `globals.css`; gradient/glow utility classes.
- **Modified code**: root `layout.tsx` (provider + `suppressHydrationWarning`), `site-header.tsx`, home `page.tsx`, `site-footer.tsx`, admin `(panel)/layout.tsx` (toggle), admin `settings-form.tsx`, `src/lib/site-content.ts` defaults, `src/lib/validation.ts`, `src/lib/db/schema.ts` (+ migration).
- **Database**: additive migration adding `hero_title`, `hero_subtitle`, `specialties` to `site_settings`; defaults seeded.
- **Dependencies**: none new (`next-themes` already installed).
- **No breaking changes** to routes or the public URL structure. Reel/Contact pages from the original are intentionally out of scope (no data/source for them yet).
