## Context

The admin panel (`/admin/*`, in the `(panel)` route group) is auth-protected by `src/proxy.ts` and already has Projects and Site content screens. The public pages (`/`, `/about`, `/projects`) are server components that read from `getSiteSettings()`. The home page renders one of four layouts from `content.homeVariant`. There is currently no way to preview the result inside the panel, and no way to compare the four home layouts without saving each one.

This change adds a preview screen that iframes the real public pages (same origin) and can preview each home layout via a query-param override.

## Goals / Non-Goals

**Goals:**
- See the actual public pages inside the admin, at desktop/tablet/mobile widths.
- Preview each of the four home layouts live, without persisting the choice.
- Reuse the existing public pages as-is (no duplicate rendering path).
- No new dependencies, no schema changes.

**Non-Goals:**
- Live preview of *unsaved* form edits (typing a hero title and seeing it update). The preview reflects saved settings; live draft preview is a possible follow-up via `postMessage`.
- Previewing unpublished/draft projects (public pages only show published).
- A visual page builder or inline editing inside the preview.

## Decisions

### Decision: Same-origin iframe of the real public pages

`PreviewPane` (client) renders an `<iframe>` pointing at the app's own public routes (`/`, `/about`, `/projects`) with chosen query params. Because it is the same origin and Next sets no frame-busting headers, the iframe loads normally and shows the true result (real header/footer/styles).

- **Why iframe over re-rendering components in the panel:** the public pages are server components that fetch data; iframing reuses them verbatim with zero drift and no refactor. Device-width preview is just constraining the iframe's width.
- **Alternative considered:** extract presentational components and render them client-side with props. Rejected for v1 — more refactoring and a second rendering path to keep in sync; revisit if live draft preview is needed.

### Decision: Device sizes via iframe width, not user-agent spoofing

Desktop = full width (responsive), Tablet = 768px, Mobile = 390px, centered with a frame. The site is responsive (Tailwind breakpoints), so constraining width faithfully exercises the responsive layout.

### Decision: `previewVariant` override, admin-gated and render-only

The home page becomes `async function HomePage({ searchParams })` (a Promise in this Next version, so awaited). If `searchParams.previewVariant` is one of the four valid variants **and** `isAuthenticated()` is true, it overrides `content.homeVariant` for that render only. Invalid values or unauthenticated requests are ignored.

- **Why gate behind auth:** keeps the public site deterministic; only the admin (whose session cookie rides along on the same-origin iframe request) can force a layout. The override never writes to the DB.
- **Validation:** check membership in the known variant list (reuse `HOME_VARIANTS`) before applying; otherwise fall back to the saved value.

### Decision: Preview pane controls and navigation

`PreviewPane` holds local state for `page` (home/about/projects), `device` (desktop/tablet/mobile), and `variant` (only meaningful on Home). It computes the iframe `src` from these, plus a manual **Refresh** (re-key the iframe) and **Open in new tab**. The screen is reachable from a header nav link and a "Preview site" button on the settings screen.

## Risks / Trade-offs

- **[Frame-busting/CSP headers added later]** → if a future CSP sets `frame-ancestors`, the same-origin preview must remain allowed (`'self'`). Document in the component.
- **[Preview reflects saved, not draft, content]** → expected for v1; the page switcher + "Preview site" button make the round-trip (save → preview) fast. Called out as a non-goal.
- **[`previewVariant` leaking to public]** → mitigated: override applies only when `isAuthenticated()` and the value is a known variant; it is render-only.
- **[Iframe + force-dynamic cost]** → the home page is already `force-dynamic`; reading `searchParams` and a cookie adds negligible work.
- **[Mobile width inside a narrow panel]** → the pane allows horizontal scroll/center so the 768px tablet frame doesn't overflow awkwardly on small admin windows.

## Open Questions

- Should we later add live preview of unsaved edits via `postMessage` from the settings form into the iframe? (Deferred.)
- Add a draft-project preview mode (token-gated public detail) later? (Deferred.)
