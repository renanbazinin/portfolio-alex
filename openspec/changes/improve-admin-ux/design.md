## Context

Admin surface ≈ 1,536 lines: thin RSC pages awaiting DB calls directly, three large client components (`dashboard.tsx` 276, `project-form.tsx` 289, `settings-form.tsx` 487), a blob uploader, and an iframe preview. Auth via JWT-verifying proxy on every request (serial with the page's DB query). All admin routes are `force-dynamic`. Audit evidence: no `loading.tsx` anywhere; optimistic mutations followed by `router.refresh()` (dashboard.tsx:63/83/99/122, project-form.tsx:118, settings-form.tsx:149); raw `<img>` thumbnails (dashboard.tsx:190, media-uploader.tsx:117); sequential upload loop (media-uploader.tsx:43-45); `confirm()` delete (dashboard.tsx:92); discarded API `issues` (project-form.tsx:113, settings-form.tsx:143); duplicate nav links ((panel)/layout.tsx:14,17); reorder disabled while filtering with the only explanation below the list (dashboard.tsx:129,269).

Constraints: keep the existing API contracts, auth model, graceful DB-failure banners, optimistic reorder with rollback, and the iframe preview's `key`-remount reload. Per AGENTS.md, consult `node_modules/next/dist/docs/` for any API used (already installed this session; `loading.tsx` file convention and `useFormStatus`-style pending patterns verified against bundled docs during implementation).

## Goals / Non-Goals

**Goals:**
- Every admin navigation paints something meaningful within one frame (skeletons).
- One click = one network round-trip: no refetch after an optimistic mutation that already updated state.
- Every in-flight action is visibly in-flight on the specific control that triggered it.
- Validation failures point at the field, not just a toast; edits can't be silently lost.
- Media is fast: sized thumbnails, parallel uploads with visible per-file progress.

**Non-Goals:**
- No drag-and-drop reorder (arrows stay; clarity improves). No new libraries.
- No auth/session, API, or schema changes. No admin redesign — same layout language, targeted fixes.
- No refactor of settings-form's array editors beyond error display (its size is tolerable; splitting it is not this change).
- No caching/ISR of admin data — `force-dynamic` stays correct for an editing surface.

## Decisions

### D1: `loading.tsx` skeletons per route, not Suspense-in-page
Add `loading.tsx` under `(panel)/` (dashboard), `(panel)/settings/`, and `(panel)/projects/[id]/edit/`. Next renders them instantly on navigation while the RSC awaits the DB. Skeletons mirror each page's real layout (table rows / form blocks) using a tiny shared `<Skeleton>` primitive (pulse on `bg-muted`). *Alternative:* wrap page internals in `<Suspense>` — more granular but touches page structure for no extra benefit here; `loading.tsx` is the file-convention path with zero page changes.

### D2: Optimistic state is authoritative; delete `router.refresh()` after list mutations
Dashboard already updates local state per mutation with rollback on error — the trailing `refresh()` is pure overhead. Remove it for publish/feature/delete/reorder. Keep `refresh()` only where navigation lands on server-rendered data that must reflect the change (`project-form` submits then `router.push("/admin")` — keep its refresh so the dashboard list is current; same for settings-form since the public site/preview reads it).

### D3: Per-action pending state via a single `pending: {id, action}` shape
Replace `busyId` with `{ id, action: "publish" | "feature" | "delete" | "reorder" }`. The active button shows a spinner + progressive label ("Publishing…"); its row siblings stay enabled-looking but inert (aria-disabled), so users see exactly what is happening. No `useTransition` needed — these are plain fetch handlers.

### D4: Delete confirmation with shadcn Dialog
Shared `<ConfirmDialog>` (title, description, destructive confirm button with pending state) replaces `confirm()`. Focus management/Escape come free from Radix. Used only by delete for now but written generically.

### D5: Field-level API errors mapped by Zod path
Write routes already return `{ error, issues: [{ path, message }] }` (422). Forms keep a `Record<string, string>` of `path[0]` → message, render the message under the matching input (accent-destructive text + `aria-invalid`), clear per-field on change, and fall back to the generic toast only when no issues array is present. Settings-form maps top-level paths (e.g. `contactEmail`, `heroTitle`); array-item issues (path like `socialLinks.0.href`) anchor to the array section header — precise-enough without rebuilding the editors.

### D6: Unsaved-changes guard — dirty flag + confirm on leave
Each form tracks `dirty` (any change since load/save). Cancel becomes a button that routes through the same `<ConfirmDialog>` when dirty; a `beforeunload` listener covers tab-close/hard-nav while dirty. No route-change interception beyond Cancel (App Router has no stable router events for this; `beforeunload` covers the destructive cases).

### D7: Media — `next/image` thumbnails + `Promise.all` uploads
Dashboard row thumbs and uploader previews become `next/image` with explicit `width/height/sizes` (Blob host already in `remotePatterns`). `handleFiles` uploads via `Promise.allSettled`, rendering each file as a tile with its own progress state; failures report per-file toasts and don't block siblings. Order of appended URLs = original selection order (stable, not completion order).

### D8: Nav cleanup + inline affordance copy
`(panel)/layout.tsx`: brand "Alex — Admin" links to `/admin`; nav = Dashboard, Settings, Preview, View site (public home, new tab), Logout — no duplicate targets, active state = accent underline (same treatment as public header). Reorder arrows: when filtering is active, arrows hide and a compact inline note appears in the toolbar ("Clear search/filter to reorder"); the below-list caption goes away. Preview variant selector: when the active tab isn't Home, the selector shows a caption "Layout preview applies to Home" instead of appearing broken.

## Risks / Trade-offs

- [Removing refresh() desyncs list from server on concurrent edits] → Acceptable for a single-admin site; the list still refetches on any real navigation (force-dynamic). Rollback-on-error already handles failed writes.
- [Skeleton drift from real layouts] → Keep skeletons low-fidelity (bars/blocks, not pixel-perfect) so layout tweaks don't orphan them.
- [`beforeunload` UX is browser-controlled] → Fine; it's a backstop. The designed path is the Cancel confirm.
- [Array-item validation anchoring is coarse (D5)] → Field message still names the item index from the Zod path; full per-item wiring is deferred until the editors are rebuilt.
- [Parallel uploads can hit Blob rate limits with many files] → Cap concurrency implicitly via existing MAX_FILES limit (client-enforced); acceptable.

## Migration Plan

Pure client/route-file additions and edits; single deploy, revert = revert commit. No data or API migration.

## Open Questions

- None blocking. (If the dashboard ever exceeds ~100 projects, pagination becomes the next perf lever — out of scope here.)
