## 1. Home layout override (authenticated)

- [x] 1.1 Update `src/app/(site)/page.tsx` to accept `searchParams: Promise<{ previewVariant?: string }>` (awaited, per this Next version).
- [x] 1.2 When `previewVariant` is a known value (validate against `HOME_VARIANTS`) and `isAuthenticated()` is true, override `content.homeVariant` for that render only; otherwise use the saved value. Import `isAuthenticated` from `@/lib/auth/guard`.

## 2. Preview pane component

- [x] 2.1 Create `src/components/admin/preview-pane.tsx` (client) with local state for `page` (home/about/projects), `device` (desktop/tablet/mobile), and `variant`.
- [x] 2.2 Render controls: page switcher, device-size switcher, a Home-layout selector (uses the four variants, only enabled on Home), Refresh (re-key iframe), and Open-in-new-tab.
- [x] 2.3 Compute the iframe `src` from page + (for Home) `?previewVariant=<variant>`, and constrain iframe width by device (desktop = full, tablet = 768px, mobile = 390px), centered with a frame and allowing scroll.

## 3. Preview page

- [x] 3.1 Create `src/app/admin/(panel)/preview/page.tsx` (server) that renders `PreviewPane`, passing the variant options (from `HOME_VARIANTS`).

## 4. Navigation & entry points

- [x] 4.1 Add a "Preview" link to the admin panel header in `src/app/admin/(panel)/layout.tsx`.
- [x] 4.2 Add a "Preview site" button (link to `/admin/preview`) on the settings screen via `src/components/admin/settings-form.tsx`.

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run build`; fix any type/lint errors.
- [x] 5.2 Manually verify (running app): preview loads the public home in the iframe; switching page (About/Projects) and device sizes works; selecting each home layout updates the iframe without changing the saved setting.
- [x] 5.3 Verify the override is admin-only: an unauthenticated request to `/?previewVariant=standard` renders the saved layout, and `/admin/preview` redirects to login when logged out.
