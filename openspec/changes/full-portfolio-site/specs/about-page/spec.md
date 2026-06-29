## ADDED Requirements

### Requirement: About page
The site SHALL provide an about page (`/about`) presenting a bio, a list of skills/disciplines, and contact links, laid out in the clean-minimal design system. The content MAY be statically authored in code for now.

#### Scenario: About page renders
- **WHEN** a visitor opens `/about`
- **THEN** the page shows a bio section, a skills/disciplines section, and contact links

#### Scenario: Reachable from navigation
- **WHEN** a visitor clicks the About nav item
- **THEN** they arrive at the about page
