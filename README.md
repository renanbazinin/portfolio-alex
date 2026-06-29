# Alex — Portfolio

A unified [Next.js](https://nextjs.org) (App Router) application that powers both
the public portfolio site and a polished admin area for managing projects. It
replaces the previous split Vite client + Express server + GitHub-JSON setup.

## Stack

- **Next.js 16** (App Router, TypeScript) — public site, admin, and APIs in one app
- **Neon Postgres** + **Drizzle ORM** — project data with migrations
- **Vercel Blob** — direct image/media uploads from the admin
- **Auth** — bcrypt-hashed admin password + signed, HTTP-only session cookie
- **Tailwind CSS v4** + **shadcn/ui** — UI
- Deployed on **Vercel**

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   - `DATABASE_URL` — Neon Postgres connection string
   - `ADMIN_PASSWORD_HASH` — generate with `npm run hash-password -- "yourPassword"`
   - `SESSION_SECRET` — any random string (`openssl rand -base64 32`)
   - `BLOB_READ_WRITE_TOKEN` — from your Vercel Blob store
3. Apply the database schema:
   ```bash
   npm run db:migrate
   ```
4. (Optional) Import legacy projects:
   ```bash
   npm run db:seed
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run db:generate` | Generate a Drizzle migration from the schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly (dev convenience) |
| `npm run db:seed` | Import legacy projects into the database |
| `npm run hash-password -- "pw"` | Generate an `ADMIN_PASSWORD_HASH` |

## Project structure

```
src/
  app/
    page.tsx                     public projects listing
    projects/[slug]/page.tsx     public project detail
    admin/login/                 admin sign-in
    admin/(panel)/               authenticated dashboard, create/edit
    api/                         login, logout, projects CRUD, reorder, upload
  components/                    public + admin UI, shadcn ui
  lib/
    db/                          Drizzle schema + client
    auth/                        session (jose) + password (bcrypt) + guard
    projects.ts                  data access
    validation.ts                zod schemas
  proxy.ts                       route protection (Next 16 proxy convention)
scripts/                         seed + password hashing
drizzle/                         generated migrations
```

## Deployment

Deploys to Vercel. Set the four environment variables in the Vercel project,
then connect the repository — Vercel builds and serves the site, admin, and APIs
from one deployment.
