## 1. Scaffold unified Next.js app

- [ ] 1.1 Scaffold a Next.js (App Router) + TypeScript app at the repo root (ESLint enabled)
- [ ] 1.2 Remove `alex-client/` and `alex-server/` once their behavior is reproduced in the new app
- [ ] 1.3 Consolidate to a single `package.json` with current dependency versions; add `dev`, `build`, `start`, `lint`, `db:*` scripts
- [ ] 1.4 Add `.gitignore` (node_modules, `.env*`, `.next`) and `.env.example` documenting every required variable

## 2. Database and ORM

- [ ] 2.1 Add Drizzle ORM + Postgres driver and Neon connection helper reading `DATABASE_URL`
- [ ] 2.2 Define the `projects` schema (id, slug unique, title, category, year, role, tools, description, thumbnail, images, videoUrl, publishStatus, sortOrder, createdAt, updatedAt)
- [ ] 2.3 Configure Drizzle migrations and generate the initial migration
- [ ] 2.4 Add an env loader that validates required variables and fails fast with a clear message
- [ ] 2.5 Provision a dev database and apply migrations locally

## 3. Auth

- [ ] 3.1 Add password hashing and a helper to verify against `ADMIN_PASSWORD_HASH`
- [ ] 3.2 Implement a signed, HTTP-only, time-bounded session cookie (set on login, cleared on logout)
- [ ] 3.3 Implement login and logout endpoints/actions (reject incorrect credentials, no session on failure)
- [ ] 3.4 Add `middleware.ts` protecting `/admin/*` and all write APIs; redirect unauthenticated admin page requests to login

## 4. Admin management UI + APIs

- [ ] 4.1 Build the admin dashboard listing all projects (incl. drafts) with publish status, search, and category filter
- [ ] 4.2 Build a validated create/edit project form persisting directly to the database
- [ ] 4.3 Implement delete with a confirmation step
- [ ] 4.4 Implement reorder (persist `sortOrder`) reflected on the public site
- [ ] 4.5 Implement draft/publish toggling
- [ ] 4.6 Add clear saving/success/error feedback states across admin actions

## 5. Media upload

- [ ] 5.1 Add Vercel Blob and an authenticated upload route that validates file type and max size
- [ ] 5.2 Add drag-and-drop / file-picker upload in the project form with progress indication
- [ ] 5.3 Bind returned URLs to thumbnail and gallery image fields; show previews and block save on incomplete uploads

## 6. Public site

- [ ] 6.1 Server-render the public projects listing from the database, published-only, ordered by `sortOrder`, with empty state
- [ ] 6.2 Implement public search (title/role/tools) and category filter
- [ ] 6.3 Implement the per-slug project detail view; return not-found for unknown or draft slugs

## 7. Data migration

- [ ] 7.1 Write a seed script that imports the legacy `projects.json` into the database, mapping fields (e.g. `thumb`→`thumbnail`)
- [ ] 7.2 Run the seed and verify imported projects render publicly

## 8. Verify, version control, and deploy

- [ ] 8.1 Run lint and build; add and run a basic test that exercises a core flow (e.g. project create/read)
- [ ] 8.2 Manually verify the admin flow (login → create with upload → publish → appears publicly) and logout protection
- [ ] 8.3 Initialize a fresh git repo, commit ("first commit"), set branch `main`, add remote `https://github.com/renanbazinin/portfolio-alex.git`, and push
- [ ] 8.4 Use the Vercel CLI to create/link a Vercel project for this repo, set env vars (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`), and deploy
