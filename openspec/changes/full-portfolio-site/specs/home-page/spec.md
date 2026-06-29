## ADDED Requirements

### Requirement: Hero section
The home page (`/`) SHALL present a clean-minimal hero with Alex's name, a one-line statement/role, and at least one primary call-to-action linking to the projects experience.

#### Scenario: Hero renders
- **WHEN** a visitor opens the home page
- **THEN** the hero shows the name, a one-line statement, and a call-to-action to view work

### Requirement: Featured works showcase
The home page SHALL display a featured-works showcase rendered from published, featured projects, server-rendered from the database. When no projects are marked featured, it SHALL fall back to the most recent published projects so the showcase is never empty (unless there are no published projects at all).

#### Scenario: Featured projects shown
- **WHEN** one or more published projects are marked featured
- **THEN** the home showcase displays those featured projects

#### Scenario: Fallback when none featured
- **WHEN** no published project is marked featured but published projects exist
- **THEN** the showcase displays a sensible set of recent published projects instead of being empty

#### Scenario: Drafts never shown
- **WHEN** a featured project is in draft status
- **THEN** it does not appear in the home showcase

### Requirement: Entry to full project list
The home page SHALL provide a clear link into the full projects page.

#### Scenario: Link to all projects
- **WHEN** a visitor finishes the showcase
- **THEN** a visible link/button leads to the full projects listing
