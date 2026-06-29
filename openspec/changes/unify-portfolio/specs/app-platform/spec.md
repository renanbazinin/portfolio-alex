## ADDED Requirements

### Requirement: Single unified application
The portfolio SHALL be delivered as one Next.js (App Router) + TypeScript application containing both the public site and the admin area and their server APIs. The prior separate Vite client and Express server SHALL be removed.

#### Scenario: Single dev command
- **WHEN** a developer runs the project's documented dev command
- **THEN** both the public site and the admin area run from one application without starting a separate backend process

#### Scenario: Single build and deploy
- **WHEN** the project is built and deployed
- **THEN** the public site, admin area, and APIs are produced from one build artifact deployed to one host

### Requirement: Database-backed persistence via ORM
The application SHALL use a hosted relational database (Neon Postgres) accessed through an ORM (Drizzle), with a versioned schema and a migration mechanism. Project data SHALL be read from and written to this database.

#### Scenario: Schema migration applies
- **WHEN** the documented migration command is run against a fresh database
- **THEN** the project schema is created and the application can read and write projects

### Requirement: Environment configuration
The application SHALL read all secrets and connection settings from environment variables (database URL, blob storage token, admin credential hash, session secret) and SHALL fail fast with a clear message if a required variable is missing. Secrets SHALL NOT be committed to the repository.

#### Scenario: Missing required env var
- **WHEN** the application starts without a required environment variable
- **THEN** it fails fast with a message naming the missing variable rather than running in a broken state

#### Scenario: Example env documented
- **WHEN** a developer sets up the project
- **THEN** an example environment file documents every required variable without containing real secret values

### Requirement: Data migration from legacy store
The existing projects in the legacy `projects.json` GitHub file SHALL be importable into the database via a one-time seed routine.

#### Scenario: Seed legacy data
- **WHEN** the seed routine is run against the legacy projects data
- **THEN** each legacy project is inserted into the database with its fields mapped to the new schema

### Requirement: Vercel deployment
The application SHALL be deployable to Vercel from the unified repository, with environment variables configured in the Vercel project.

#### Scenario: Deploys to Vercel
- **WHEN** the repository is connected to a Vercel project with the required environment variables set
- **THEN** Vercel builds and serves the public site, admin area, and APIs from the deployment
