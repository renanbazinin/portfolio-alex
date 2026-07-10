## Why

Today the admin can only manage projects. Everything else on the public site — the About page copy, the contact email, the identity line, and the social media links in the footer — is hard-coded in React components (`about/page.tsx`, `site-footer.tsx`). Changing a single link or fixing a typo requires a code edit and redeploy, which the site owner cannot do on their own.

## What Changes

- Add a singleton **site settings** store (one row, Drizzle/Postgres) holding editable About, contact, and social-link content, seeded with the values currently hard-coded in the components.
- Add a new **"Site content"** admin screen (`/admin/settings`) with three sections:
  - **About** — editable heading, intro paragraphs, expertise groups, and approach items.
  - **Contact** — editable name, role, location, and contact email.
  - **Social links** — a repeating list where the admin can edit the label/URL of the known links (Vimeo, Instagram, LinkedIn, …), **remove** any of them, and **add** new ones.
- Add a guarded `GET`/`PUT /api/settings` endpoint, plus a `src/lib/settings.ts` data layer that returns built-in defaults when no row exists yet (so the public site never breaks).
- Make the public **About page** and **site footer** read their content from the settings store instead of in-component constants.
- Add a navigation link in the admin panel header so the new screen is reachable alongside Projects.

## Capabilities

### New Capabilities
- `site-content-management`: Admin-editable site content — About page copy, contact/identity info, and a managed list of social links (add / edit / remove) — persisted in the database and rendered on the public site, with safe built-in defaults.

### Modified Capabilities
<!-- None — projects management is unchanged; no existing specs in openspec/specs. -->

## Impact

- **Database**: new `site_settings` table (singleton row) + migration; seed defaults.
- **New code**: `src/lib/settings.ts`, settings validation schema, `/api/settings` route, `/admin/settings` page + form component.
- **Modified code**: `about/page.tsx` and `site-footer.tsx` (read from settings), admin panel header nav (`admin/(panel)/layout.tsx`), and `src/proxy.ts` (extend auth matcher + write-API guard to cover `/api/settings`).
- **Auth**: write access to `/api/settings` gated through the existing proxy/session model — no new auth mechanism.
- **No breaking changes** to the public URLs or the existing projects admin.
