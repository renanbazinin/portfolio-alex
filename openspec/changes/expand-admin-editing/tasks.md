## 1. Data model & migration

- [x] 1.1 Add a `siteSettings` singleton table to `src/lib/db/schema.ts` (id, aboutHeading, aboutIntro `jsonb` string[], expertise `jsonb` {heading, items[]}[], approach `jsonb` {n, title, body}[], name, role, location, contactEmail, socialLinks `jsonb` {label, href}[], updatedAt) and export `SiteSettings` / `NewSiteSettings` types.
- [x] 1.2 Run `npm run db:generate` to create the Drizzle migration; verify the generated SQL in `drizzle/`.
- [x] 1.3 Apply the migration (`npm run db:migrate`) and optionally seed the default row in `scripts/seed.ts`.

## 2. Defaults, validation & data layer

- [x] 2.1 Define `DEFAULT_SITE_SETTINGS` (the current hard-coded About/contact/social values) in a shared module so both the data layer and seed reuse it.
- [x] 2.2 Add `siteSettingsInputSchema` to `src/lib/validation.ts` with item schemas for expertise, approach, and social links (label non-empty, href valid URL; `contactEmail` via `z.email`).
- [x] 2.3 Create `src/lib/settings.ts` with `getSiteSettings()` (read row id=1, merge over defaults, fall back to defaults when row absent or a field is null) and `updateSiteSettings(input)` (upsert on id=1).

## 3. API & auth

- [x] 3.1 Add `src/app/api/settings/route.ts` with `GET` (returns current settings) and `PUT` (validates with `siteSettingsInputSchema`, upserts, returns saved settings); runtime `nodejs`.
- [x] 3.2 Extend `src/proxy.ts`: add `/api/settings/:path*` to `matcher` and include `/api/settings` in the `isWriteApi` guard so non-GET requires a session.

## 4. Admin UI

- [x] 4.1 Add a "Site content" link to the admin panel header in `src/app/admin/(panel)/layout.tsx`.
- [x] 4.2 Create `src/app/admin/(panel)/settings/page.tsx` (server component) that loads settings via `getSiteSettings()` and renders the form.
- [x] 4.3 Create `src/components/admin/settings-form.tsx` (client component) with About, Contact, and Social-links sections; the social-links section supports edit, remove, and add-row, and the About section supports add/remove for intro paragraphs, expertise groups, and approach items.
- [x] 4.4 On submit, `PUT /api/settings`, show success/error via `sonner` toast, and `router.refresh()` (mirror the dashboard's patterns).

## 5. Public rendering

- [x] 5.1 Update `src/app/(site)/about/page.tsx` to read from `getSiteSettings()` instead of in-component `EXPERTISE`/`APPROACH`/intro constants.
- [x] 5.2 Update `src/components/site/site-footer.tsx` to render identity line (name/role/location), the email link from `contactEmail`, and social links from settings; keep the `http`-prefixed `target="_blank"` behavior and the Admin link.

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npm run build`; fix any type/lint errors.
- [x] 6.2 Manually verify: edit About copy, change/remove/add a social link, and update contact email in `/admin/settings`, then confirm the About page and footer reflect each change.
- [x] 6.3 Verify auth: unauthenticated `PUT /api/settings` returns 401 and visiting `/admin/settings` while logged out redirects to login.
