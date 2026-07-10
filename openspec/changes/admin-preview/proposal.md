## Why

The admin can now edit a lot — home layout (4 variants), hero/About/contact copy, social links — but there is no way to see the result without leaving the panel, opening the public site in another tab, and guessing how it looks on phones. Choosing between the four home layouts especially is hard without seeing them. A built-in preview lets the admin view the real public pages, across device sizes, and flip through the home layouts before committing.

## What Changes

- Add an admin **Preview** page (`/admin/preview`) that embeds the live public site in a same-origin iframe with:
  - **Page switcher** — Home / About / Projects.
  - **Device switcher** — Desktop (responsive), Tablet (768px), Mobile (390px) frame widths.
  - **Home layout preview** — a selector for the four home variants that previews each layout live, without changing the saved setting.
  - **Refresh** and **Open in new tab** controls.
- Make the public **home page** honor a `?previewVariant=<variant>` query param **only for authenticated admins**, overriding the layout for that single render (no persistence, no effect for public visitors).
- Add a **"Preview"** link in the admin panel header and a **"Preview site"** button on the settings screen.

## Capabilities

### New Capabilities
- `admin-preview`: An in-panel preview that renders the live public pages in a responsive iframe and lets the admin preview each home layout before saving.

### Modified Capabilities
- `site-content-management`: The home page additionally accepts an authenticated-only `previewVariant` override so the admin can preview a layout without persisting it.

## Impact

- **New code**: `src/app/admin/(panel)/preview/page.tsx` (server) and `src/components/admin/preview-pane.tsx` (client).
- **Modified code**: `src/app/(site)/page.tsx` (read `searchParams`, gate `previewVariant` behind `isAuthenticated()`), admin `(panel)/layout.tsx` (nav link), `settings-form.tsx` (Preview button).
- **No database changes**, no new dependencies, no new public routes (preview reuses existing public pages).
- **Auth**: `/admin/preview` is covered by the existing proxy matcher; the preview override is read-only and admin-gated.
