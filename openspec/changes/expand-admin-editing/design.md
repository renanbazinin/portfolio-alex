## Context

The portfolio is a Next.js 16 app (App Router) backed by Drizzle ORM on Neon Postgres. The admin area (`/admin/*`) and content-mutating APIs are protected by `src/proxy.ts` (Next 16's renamed middleware), which checks a JWT session cookie. Today the only editable entity is `projects`. All other public copy — the About page (`src/app/(site)/about/page.tsx`) and the footer's contact/social links (`src/components/site/site-footer.tsx`) — lives in in-component constants, so the owner cannot change it without a code edit.

This change introduces a small, admin-editable content store covering About copy, contact/identity info, and social links, following the existing patterns (Drizzle table, zod validation, guarded `/api` route, server-rendered public pages).

## Goals / Non-Goals

**Goals:**
- One authoritative, admin-editable store for About / contact / social content.
- The public site keeps working with sensible defaults before any edit (no empty pages on first deploy).
- Reuse existing conventions: Drizzle schema + migration, zod schema in `src/lib/validation.ts`, a `src/lib/*` data layer, a proxy-guarded `/api` route, and a `force-dynamic` server page.
- Social links are a fully managed list: edit known ones, remove, and add new ones.

**Non-Goals:**
- No general CMS / arbitrary page builder; the editable shape is fixed (About, contact, social).
- No rich-text/markdown editor — plain text fields and simple list editors only.
- No editing of the home hero / specialties copy in this change (possible follow-up).
- No per-link icons or drag-reorder for social links (kept as a simple ordered list).
- No multi-user roles; the existing single-admin session model is unchanged.

## Decisions

### Decision: Singleton settings row with jsonb columns (not key/value)

Store all editable content in a single `site_settings` row (`id` fixed to `1`). Structured fields (intro paragraphs, expertise, approach, social links) use `jsonb` typed arrays, mirroring how `projects` already uses `jsonb` for `tools`/`images`.

- **Why over key/value table:** the content is a fixed, strongly-typed shape; a singleton row gives one atomic read and one atomic `PUT`-style upsert, with zod validating the whole document. A key/value table would scatter related fields and complicate validation.
- **Defaults:** `getSiteSettings()` returns a typed default object (the current hard-coded values) when the row is absent, and merges saved values over defaults so missing keys never break rendering. Saving performs an upsert on `id = 1`.

### Decision: Contact email separate from social links

`contactEmail` is its own field (rendered as a `mailto:` "Email" link), while `socialLinks` holds only the http(s) links (Vimeo, Instagram, LinkedIn, …). This matches the user's framing of "contact info" vs "social media" and keeps email validation (`z.email`) distinct from URL validation.

### Decision: One `/api/settings` route guarded by the existing proxy

Add `GET` (load) and `PUT` (replace) handlers at `src/app/api/settings/route.ts`, validated by a new `siteSettingsInputSchema`. Extend `src/proxy.ts`:
- add `/api/settings/:path*` to the `matcher`;
- include `/api/settings` in the `isWriteApi` check so non-GET methods require a session.
The admin screen lives at `/admin/settings`, already covered by the `"/admin/:path*"` matcher.

- **Why a full-document PUT** over field-level PATCH: the form edits the whole document at once; replace-on-save is simpler and avoids partial-update merge bugs. The handler validates the full payload before upserting.

### Decision: Public pages read settings server-side

`about/page.tsx` and `site-footer.tsx` become (or stay) server components that call `getSiteSettings()`. The footer is currently a server component imported into the layout; it will receive settings via a server call. About page is already a server component. Both set/keep `force-dynamic` semantics consistent with the rest of the site so edits show immediately.

### Decision: Reuse `src/lib/validation.ts` and a new `src/lib/settings.ts`

Add `siteSettingsInputSchema` (and item schemas for expertise/approach/social) to `src/lib/validation.ts`, and a `src/lib/settings.ts` data layer exposing `getSiteSettings()` and `updateSiteSettings(input)`. This mirrors `src/lib/projects.ts`.

## Risks / Trade-offs

- **[Singleton drift / multiple rows]** → Always read/write `id = 1`; the data layer never inserts a second row (upsert on conflict of primary key).
- **[Defaults vs saved-but-empty arrays]** → Distinguish "no row" (use defaults) from "saved empty list" (respect the admin's choice). Only fall back to defaults when the row is absent or a field is `null`, not when an array is intentionally empty.
- **[Invalid social URLs breaking the footer]** → zod validates each link's URL on save; the footer also guards `href.startsWith("http")` for `target="_blank"`, preserving current behavior.
- **[Footer is rendered in the root layout]** → confirm the footer's server-side `getSiteSettings()` call doesn't force the whole layout dynamic in an unwanted way; align with the existing `force-dynamic` pages so content stays fresh.
- **[Migration on Neon]** → ship a Drizzle migration (`db:generate` + `db:migrate`) plus a seed of the default row; a missing row is tolerated by defaults, so deploy order is not fragile.

## Migration Plan

1. Add `site_settings` to `src/lib/db/schema.ts`; run `npm run db:generate` to create the migration.
2. Apply with `npm run db:migrate` (or `db:push` in dev). Optionally seed the default row via the seed script.
3. Deploy code; public pages fall back to defaults if the row is absent, so there is no hard ordering requirement.
4. **Rollback:** revert the code; the unused table can remain or be dropped — the old hard-coded components are restored by the revert.

## Open Questions

- Should the home hero / specialties copy also become editable? (Deferred to a follow-up unless requested.)
- Do social links need custom icons, or is a text label sufficient for now? (Assumed text label only.)
