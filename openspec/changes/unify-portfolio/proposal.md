## Why

The portfolio currently spans three disconnected pieces — a Vite/React client deployed to GitHub Pages, an Express/Octokit server deployed to Render, and a `projects.json` file living in yet another GitHub repo. Editing content means juggling two deployments and a brittle "commit-a-JSON-file" data flow, the admin only accepts pasted URLs (no real uploads), there is no real database, and dependencies are drifting. We want one project that is simple to run, deploy, and administer — with a first-class admin area the owner can use to upload media and manage the site without touching code.

## What Changes

- **BREAKING**: Replace the `alex-client` (Vite SPA on GitHub Pages) and `alex-server` (Express on Render) with a single Next.js (App Router) + TypeScript application deployed to Vercel. The old two-repo, GitHub-Pages + Render topology is removed.
- **BREAKING**: Move project data out of the `repoForRawThings` GitHub JSON file into a real hosted database (Neon Postgres) accessed through an ORM (Drizzle). The raw-GitHub-JSON fetch and Octokit commit flow are removed.
- **BREAKING**: Replace media handling — instead of pasting `thumb`/`images`/`videoUrl` URLs, the admin uploads files directly; uploads go to cloud blob storage (Vercel Blob) and the returned URL is stored on the project.
- Replace the plaintext password check (`ADMIN_PASSWORD || 'renan'`) with a proper authenticated admin session (hashed credential + signed, HTTP-only cookie) and route protection for `/admin`.
- Rebuild the admin area as a polished, easy-to-use dashboard: list/search/filter projects, create/edit/delete with validation, drag-and-drop media upload with previews, reorder, draft/publish state, and clear save/feedback states — no localStorage-as-source-of-truth.
- Rebuild the public site as server-rendered pages reading from the database (fast, SEO-friendly) replacing the client-side raw-JSON fetch.
- Reset version control: start the unified project as a single fresh git repository (the prior per-folder/Render/Pages git history is not carried over).
- Update and consolidate all dependencies to current versions under one `package.json`.

## Capabilities

### New Capabilities
- `project-content`: Data model and public-facing presentation of portfolio projects (fields, listing, search/filter, detail, server-rendered delivery from the database).
- `admin-management`: Authenticated admin dashboard for creating, editing, reordering, deleting, and publishing projects with validation and clear feedback.
- `media-upload`: Direct file/media upload from the admin to cloud blob storage, returning durable URLs stored on projects.
- `admin-auth`: Secure admin authentication (hashed credential, signed session cookie) and protection of admin routes and write APIs.
- `app-platform`: The unified Next.js application structure, database/ORM setup, environment configuration, and Vercel deployment that the above capabilities run on.

### Modified Capabilities
<!-- No existing OpenSpec specs (openspec/specs/ is empty); all capabilities are new. -->

## Impact

- **Removed code**: `alex-client/` (Vite SPA, `AdminPanel.jsx`, `ProjectsView.jsx`, GitHub Pages deploy) and `alex-server/` (Express `server.js`, Octokit publish flow).
- **Removed infra/data flow**: GitHub Pages hosting, Render hosting, and the `repoForRawThings` `projects.json` data store.
- **New stack**: Next.js (App Router) + TypeScript, Drizzle ORM + Neon Postgres, Vercel Blob storage, signed-cookie admin auth, deployed on Vercel.
- **New env/config**: database connection string, blob storage token, admin credential hash, session secret (replacing `GITHUB_TOKEN`/`GITHUB_OWNER`/`GITHUB_REPO`/`GITHUB_FILE_PATH`/`ADMIN_PASSWORD`).
- **Migration**: existing projects in the current `projects.json` are imported into the database as a one-time seed.
- **Version control**: repository re-initialized fresh for the unified app.
