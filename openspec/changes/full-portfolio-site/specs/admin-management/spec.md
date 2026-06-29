## ADDED Requirements

### Requirement: Featured toggle in admin
The admin SHALL be able to mark or unmark a project as featured, both from the project create/edit form and from the dashboard list. The dashboard SHALL indicate which projects are featured.

#### Scenario: Toggle featured from form
- **WHEN** the admin sets a project's featured control and saves
- **THEN** the project's featured state is persisted and reflected on the home showcase

#### Scenario: Featured indicated in dashboard
- **WHEN** the admin views the dashboard
- **THEN** featured projects are visually marked among the listed projects
