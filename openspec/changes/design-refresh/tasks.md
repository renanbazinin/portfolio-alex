## 1. Theme infrastructure

- [x] 1.1 Create `src/components/theme-provider.tsx` wrapping `next-themes` `ThemeProvider` (client component).
- [x] 1.2 Mount the provider in `src/app/layout.tsx` (wrap all children, `attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`) and add `suppressHydrationWarning` to `<html>`.
- [x] 1.3 Create `src/components/theme-toggle.tsx` (client) — sun/moon `lucide-react` icons via `useTheme()`, `mounted`-guarded placeholder to avoid hydration mismatch.

## 2. Design tokens & utilities

- [x] 2.1 In `globals.css`, add `--accent-primary` (#6366f1) / `--accent-secondary` (#8b5cf6) and tint `--primary`/`--primary-foreground` to the indigo accent in both `:root` and `.dark`.
- [x] 2.2 Add reusable utilities: `.gradient-text`, `.glow-orb` + `float` keyframes, and `.hover-lift`; wrap orb/lift animations in `@media (prefers-reduced-motion: no-preference)`.
- [x] 2.3 Add polish: focus-visible accent ring, smooth color transition on theme change, and custom scrollbar styling.

## 3. Settings data model (admin-editable home)

- [x] 3.1 Add `heroTitle` (text), `heroSubtitle` (text), and `specialties` (`jsonb` `{title, description}[]`) to `siteSettings` in `src/lib/db/schema.ts` with a `Specialty` type.
- [x] 3.2 Extend `DEFAULT_SITE_SETTINGS` and `SiteContent` in `src/lib/site-content.ts` with the current hero copy and the three default specialties.
- [x] 3.3 Extend `siteSettingsInputSchema` in `src/lib/validation.ts` with `heroTitle`, `heroSubtitle`, and a `specialtySchema` array; update `getSiteSettings()` merge in `src/lib/settings.ts`.
- [x] 3.4 `npm run db:generate`; apply via the neon-http migrator (load `DATABASE_URL` from `env`), then update the `id=1` row to include the new fields.

## 4. Navigation bar

- [x] 4.1 Restyle `src/components/site/site-header.tsx`: gradient "ALEX" wordmark, underline-grow active/hover links, and mount `ThemeToggle` (desktop + mobile menu).

## 5. Home page

- [x] 5.1 Rebuild the hero in `src/app/(site)/page.tsx`: gradient name/title, `glow-orb` backdrop, primary + secondary CTAs; read `heroTitle`/`heroSubtitle` from settings.
- [x] 5.2 Apply `hover-lift` to the featured `ProjectCard` grid and render the admin-managed `specialties` list (hide the section when empty).

## 6. Footer

- [x] 6.1 Restyle `src/components/site/site-footer.tsx`: two-column brand + "Connect" layout, gradient title, copyright bar; keep settings-driven contact/social links.

## 7. Admin integration

- [x] 7.1 Add `ThemeToggle` to the admin header in `src/app/admin/(panel)/layout.tsx`.
- [x] 7.2 Add a "Home" section to `src/components/admin/settings-form.tsx` editing hero title/subtitle and the specialties list (add/edit/remove), included in the PUT payload.

## 8. Verification

- [x] 8.1 Run `npm run lint` and `npm run build`; fix any type/lint errors.
- [x] 8.2 Manually verify in a running app: toggle dark/light (persists on reload, no flash), hero glow renders, nav/footer styling, and admin readable in both themes.
- [x] 8.3 Verify admin edits: change hero title and add/remove a specialty in `/admin/settings`, confirm the home page reflects them; restore any test data.
- [x] 8.4 Verify `prefers-reduced-motion` disables the orb animation.
