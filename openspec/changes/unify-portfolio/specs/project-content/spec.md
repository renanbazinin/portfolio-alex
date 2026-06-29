## ADDED Requirements

### Requirement: Project data model
The system SHALL persist portfolio projects in a database. Each project SHALL have a stable unique identifier, a unique URL-safe `slug`, a `title`, and a `publishStatus` of either `draft` or `published`. Each project SHALL also support `category`, `year`, `role`, `tools` (a list), `description`, a `thumbnail` media reference, an ordered list of `images` media references, an optional `videoUrl`, an explicit `sortOrder`, and `createdAt`/`updatedAt` timestamps.

#### Scenario: Slug uniqueness enforced
- **WHEN** a project is saved with a `slug` that already exists on another project
- **THEN** the system rejects the save and reports a uniqueness error rather than overwriting the other project

#### Scenario: Slug generated when missing
- **WHEN** a project is saved with a non-empty `title` and an empty `slug`
- **THEN** the system derives a URL-safe slug from the title and ensures it is unique

### Requirement: Public project listing
The public site SHALL display only `published` projects, rendered on the server from the database, ordered by `sortOrder`. Draft projects SHALL NOT appear on the public site.

#### Scenario: Only published projects shown
- **WHEN** a visitor opens the public projects page and some projects are `draft`
- **THEN** the page lists only the `published` projects, in `sortOrder`, and excludes all drafts

#### Scenario: Empty state
- **WHEN** a visitor opens the public projects page and there are no published projects
- **THEN** the page renders a friendly empty state instead of an error

### Requirement: Public search and filter
The public listing SHALL let visitors filter by category and search by free text across at least title, role, and tools.

#### Scenario: Text search matches
- **WHEN** a visitor types a query that matches a published project's title, role, or any of its tools
- **THEN** that project remains visible and non-matching projects are hidden

#### Scenario: Category filter
- **WHEN** a visitor selects a specific category
- **THEN** only published projects in that category are shown; selecting "all" shows every published project

### Requirement: Public project detail
The public site SHALL expose a per-project detail view addressable by the project `slug`, showing its full description, media gallery, and video link when present.

#### Scenario: Detail by slug
- **WHEN** a visitor navigates to a published project's slug URL
- **THEN** the system renders that project's full detail

#### Scenario: Unknown or draft slug
- **WHEN** a visitor navigates to a slug that does not exist or belongs to a draft project
- **THEN** the system returns a not-found response rather than exposing draft content
