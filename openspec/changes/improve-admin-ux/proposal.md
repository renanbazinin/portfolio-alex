## Why

The admin panel feels slow and confusing. Every admin route is `force-dynamic` with data awaited directly in the page and **no `loading.tsx` or Suspense boundary**, so each navigation freezes on the previous screen until the DB round-trip completes; mutations then trigger a redundant full `router.refresh()` on top of already-optimistic state, adding a second DB hit per click. Thumbnails load full-resolution via raw `<img>`, and multi-image uploads run sequentially. Meanwhile the UX has real traps: reorder arrows silently disable while filtering, two nav links point to the same page, delete uses a native `confirm()`, API field-validation errors are discarded in favor of a generic toast, and Cancel discards edits without warning.

## What Changes

- **Instant navigation feedback**: add `loading.tsx` skeletons for the dashboard, settings, and project edit routes so every admin navigation paints immediately.
- **Kill redundant refetches**: drop the `router.refresh()` calls that follow already-optimistic dashboard mutations (publish/feature/delete/reorder); keep state authoritative client-side with rollback on failure.
- **Fast media**: admin thumbnails (dashboard rows, uploader previews) move to `next/image` with proper sizes; gallery uploads run in parallel with per-file progress instead of one-at-a-time.
- **Clear actions**: per-action pending states (spinner + label like "Publishing…"), a styled confirmation dialog for delete (replacing `confirm()`), and an inline explanation when reordering is unavailable during filtering.
- **Trustworthy forms**: surface field-level Zod issues from the API next to the offending inputs in both project and settings forms; warn before discarding unsaved changes (Cancel + browser navigation).
- **Navigation cleanup**: deduplicate the panel nav ("Admin" and "Projects" both → `/admin`), with clear active states, and explain the preview variant selector's disabled state on non-Home tabs.
- **No changes** to auth, API contracts, DB schema, or the public site. `force-dynamic` stays (admins must see fresh data) — skeletons mask the latency instead.

## Capabilities

### New Capabilities

- `admin-navigation`: Panel navigation structure, per-route loading skeletons, and preview-screen clarity.
- `admin-project-management`: Dashboard list behavior — action pending states, delete confirmation, reorder affordances and constraints.
- `admin-content-forms`: Project and settings form behavior — field-level validation surfacing, unsaved-changes protection, and media upload speed/previews.

### Modified Capabilities

<!-- none — openspec/specs/ has no synced main specs yet -->

## Impact

- **Components**: `src/components/admin/dashboard.tsx`, `project-form.tsx`, `settings-form.tsx`, `media-uploader.tsx`, `preview-pane.tsx`; new shared confirm-dialog and skeleton components.
- **Routes**: new `loading.tsx` files under `src/app/admin/(panel)/` (dashboard, settings, projects/[id]/edit); `(panel)/layout.tsx` nav cleanup.
- **No changes** to `src/app/api/**` (responses already include structured `issues` — forms just start consuming them), `src/proxy.ts`, `src/lib/**`, or public pages.
- **Dependencies**: none added; uses existing shadcn Dialog, sonner, lucide, next/image (Blob host already whitelisted).
