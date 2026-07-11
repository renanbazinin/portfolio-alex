## 1. Shared primitives

- [x] 1.1 Add `<Skeleton>` primitive (`src/components/ui/skeleton.tsx`, pulse on bg-muted) if not already present via shadcn
- [x] 1.2 Build shared `<ConfirmDialog>` (`src/components/admin/confirm-dialog.tsx`): title, description, cancel/confirm labels, destructive variant, pending state on confirm, Escape/overlay dismiss

## 2. Loading skeletons (specs/admin-navigation)

- [x] 2.1 `src/app/admin/(panel)/loading.tsx` — dashboard skeleton: toolbar bar + 6 list-row placeholders
- [x] 2.2 `src/app/admin/(panel)/settings/loading.tsx` — form skeleton: section headers + input blocks
- [x] 2.3 `src/app/admin/(panel)/projects/[id]/edit/loading.tsx` — project form skeleton (`projects/new` has no server data; renders instantly, skipped)

## 3. Panel navigation (specs/admin-navigation)

- [x] 3.1 Rework `(panel)/layout.tsx` nav: Dashboard, Settings, Preview, View site (new tab), Logout — remove the duplicate "Admin"/"Projects" pair, add active-route underline treatment (new client `admin-nav.tsx`)
- [x] 3.2 Preview clarity: in `preview-pane.tsx`, replace the silently-disabled variant selector on non-Home tabs with a caption "Layout preview applies to Home"

## 4. Dashboard actions (specs/admin-project-management)

- [x] 4.1 Remove `router.refresh()` after publish/feature/delete/reorder in `dashboard.tsx`; verify rollback paths still restore state on failure
- [x] 4.2 Replace `busyId` with `{id, action}` pending state; spinner + progressive labels ("Publishing…", "Deleting…") on the active button; sibling actions inert while pending
- [x] 4.3 Replace native `confirm()` delete with `<ConfirmDialog>` naming the project, destructive confirm with pending state
- [x] 4.4 Reorder affordance: hide ↑/↓ while search/category filter active, show inline toolbar note "Clear search to reorder", remove the below-list caption; keep the existing optimistic reorder + rollback

## 5. Forms (specs/admin-content-forms)

- [x] 5.1 `project-form.tsx`: map 422 `issues` to per-field errors (`aria-invalid` + message under input via the existing `Field` helper), clear on change, generic toast only without issues
- [x] 5.2 `settings-form.tsx`: same issue-mapping; array-path issues anchor to their section header (Zod flatten() groups by top-level key); Cancel button added alongside Save
- [x] 5.3 Dirty tracking + unsaved-changes guard in both forms: Cancel routes through `<ConfirmDialog>` when dirty, `beforeunload` listener while dirty, no prompt when clean or after successful save
- [x] 5.4 `media-uploader.tsx`: parallel uploads via `Promise.allSettled` with per-file pending tiles, successes appended in selection order, per-file failure toasts

## 6. Admin imagery (specs/admin-content-forms)

- [x] 6.1 Dashboard row thumbnails → `next/image` with explicit width/height/sizes
- [x] 6.2 Uploader preview tiles → `next/image` (in-flight files render as spinner tiles with the filename, sidestepping object-URL handling entirely)

## 7. Verification

- [x] 7.1 `npm run build` + vitest pass
- [x] 7.2 Browser pass (authenticated via locally-minted session JWT): skeleton caught painting on nav; publish toggle shows pending label, updates badge in place with zero RSC refetches, restores on second toggle; delete dialog names project, Escape cancels with row intact
- [x] 7.3 Validation pass: real 422 forced via invalid social-link URL → section-level "Enter a valid URL" error rendered; project-form client validation covers the title path (shared mapping code)
- [x] 7.4 Unsaved-changes pass: dirty Cancel prompts in both forms (stay + discard paths verified), clean Cancel navigates without dialog; beforeunload registered while dirty
- [x] 7.5 Dashboard thumbnails request `/_next/image?…&w=256` resized images; uploads use Promise.allSettled with per-file tiles (code-verified; real Blob uploads skipped to avoid junk in the production store)
- [x] 7.6 Admin visual QA in light + dark themes (dashboard, delete dialog, settings error state screenshots)
