## Context

Today the portfolio is three moving parts: a Vite/React SPA (`alex-client`) on GitHub Pages, an Express/Octokit API (`alex-server`) on Render, and a `projects.json` committed into a third GitHub repo as the data store. The admin (`AdminPanel.jsx`, ~888 lines) authenticates with a plaintext password (default `renan`), keeps edits in `localStorage`, and "publishes" by committing JSON via the server. Media is URL-paste only. This is brittle to operate and hard to extend.

The decision (confirmed with the owner) is to collapse everything into one Next.js full-stack app on Vercel, with a real database and real file uploads, and a polished admin. The repo is currently not under version control and will be initialized fresh.

## Goals / Non-Goals

**Goals:**
- One Next.js (App Router) + TypeScript application: public site, admin area, and APIs in a single deployable unit.
- Real persistence: Neon Postgres via Drizzle ORM with migrations and a seed from legacy data.
- Real uploads: direct media upload to Vercel Blob, URL stored on the project.
- Secure admin: hashed credential + signed HTTP-only session cookie; protected admin routes and write APIs; no hardcoded default password.
- Polished admin UX: dashboard with search/filter, validated create/edit/delete, reorder, draft/publish, drag-and-drop uploads with previews, clear success/error feedback.
- Server-rendered public site reading from the database.
- Current dependencies under one `package.json`; deploy to Vercel.

**Non-Goals:**
- Multi-user accounts, roles, or an invite system (single admin only).
- A general-purpose CMS or arbitrary content types beyond portfolio projects.
- Preserving the old GitHub Pages / Render / `repoForRawThings` topology or git history.
- Internationalization, analytics, and comment/contact features (can come later).

## Decisions

- **Framework: Next.js App Router + TypeScript.** Chosen over keeping Vite+Express because API routes, server components, server-rendered SEO, route-level auth (middleware), and Vercel deployment come built-in — directly satisfying "merge to one." Alternative (workspaces monorepo of Vite+Express) was rejected as it keeps two runtimes and two deploys.
- **Database: Neon Postgres + Drizzle ORM.** Neon is serverless Postgres available on the Vercel Marketplace; Drizzle is lightweight, TypeScript-first, with simple migrations. Alternative considered: Prisma (heavier client/runtime) and SQLite (not ideal for serverless/Vercel). A single `projects` table covers the domain.
- **Media: Vercel Blob.** Native to the Vercel platform, minimal setup, returns durable public URLs. Uploads go through an authenticated server route that validates type/size before storing. Alternative (commit images to GitHub, or Cloudinary) rejected to avoid extra services / the brittle commit flow.
- **Auth: hashed credential + signed session cookie.** Single admin, so a full auth provider (Clerk/Auth.js) is overkill. Store a bcrypt/argon2 hash of the admin password in env; on login, verify and set a signed, HTTP-only, time-bounded cookie (e.g. a signed JWT or iron-session style). `middleware.ts` protects `/admin/*` and write APIs. Alternative (Clerk) rejected as unnecessary infra for one user.
- **Data flow: write directly to DB.** The admin form persists to Postgres through server actions / API routes. `localStorage` is no longer the source of truth (it may still be used as an unsaved-draft convenience only). The public site server-renders from the DB.
- **Schema (single `projects` table):** `id` (pk), `slug` (unique), `title`, `category`, `year`, `role`, `tools` (text[]/json), `description`, `thumbnail` (url), `images` (json array of urls), `videoUrl`, `publishStatus` (`draft`|`published`), `sortOrder` (int), `createdAt`, `updatedAt`.
- **Migration/seed:** a one-time script reads the legacy `projects.json` and inserts rows, mapping `thumb`→`thumbnail`, defaulting `publishStatus` to `published` and `sortOrder` to import order.
- **Config validation:** a small env loader validates required vars at startup and fails fast; `.env.example` documents them; secrets are git-ignored.

## Risks / Trade-offs

- **External provisioning needs the owner's accounts** (Neon DB, Vercel Blob token, Vercel project, GitHub repo push) → mitigate by scripting/automating what's possible and clearly flagging the manual auth steps; keep the app runnable locally against a dev database.
- **Full rewrite risk: feature regressions** vs the current admin → mitigate by mapping every existing field/behavior into specs and seeding real data so parity is verifiable.
- **Cost/limits of serverless DB + Blob free tiers** → mitigate by keeping the schema and asset sizes small and enforcing upload size limits.
- **Secret leakage** (the old default password `renan` and any tokens) → mitigate by removing hardcoded defaults, hashing the credential, git-ignoring env files, and never committing the old `GITHUB_TOKEN`.
- **SEO/URL changes** from GitHub Pages paths to Vercel routes → acceptable since this is a personal portfolio; set up sensible slugs and a detail route.

## Migration Plan

1. Scaffold the Next.js app at the repo root; remove `alex-client/` and `alex-server/`.
2. Add Drizzle schema + migrations; provision Neon (owner auth) and set `DATABASE_URL`.
3. Implement auth (hash + session cookie + middleware), then admin CRUD/reorder/publish, then Vercel Blob uploads, then the public site.
4. Run the seed script to import legacy `projects.json` into the database.
5. Verify locally (lint, build, basic tests, manual admin flow), initialize a fresh git repo, commit, and push to the owner's GitHub repo.
6. Connect the repo to Vercel via the Vercel CLI, set env vars, and deploy.
- **Rollback:** the legacy `alex-client`/`alex-server` and the `projects.json` data store remain intact in history/storage until the new deployment is verified; revert by redeploying the old pieces if needed.

## Open Questions

- Exact admin password to hash, and the production `DATABASE_URL` / `BLOB_READ_WRITE_TOKEN` — these require the owner's accounts at apply time.
- Whether a project detail page is needed for v1 or if the card list (current behavior) is sufficient initially.
- Preferred styling approach for the rebuilt UI (plain CSS modules vs Tailwind/shadcn) — defaulting to a clean, dependency-light approach unless the owner prefers shadcn.
