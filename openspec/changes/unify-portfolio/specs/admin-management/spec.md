## ADDED Requirements

### Requirement: Project dashboard
The admin area SHALL present a dashboard listing all projects (both draft and published) with their key fields and publish status, and SHALL provide search and category filtering over that list.

#### Scenario: Dashboard lists all projects
- **WHEN** an authenticated admin opens the dashboard
- **THEN** the system lists every project including drafts, each showing title, category, year, and publish status

#### Scenario: Filter the dashboard
- **WHEN** the admin searches or selects a category in the dashboard
- **THEN** the list narrows to matching projects without losing draft visibility

### Requirement: Create and edit projects
The admin SHALL be able to create a new project and edit any existing project through a validated form. Saving SHALL persist directly to the database (not to browser local storage as the source of truth). The form SHALL validate required fields before allowing a save.

#### Scenario: Create a project
- **WHEN** the admin completes the new-project form with the required fields and saves
- **THEN** the system persists a new project to the database and it appears in the dashboard

#### Scenario: Edit a project
- **WHEN** the admin changes fields on an existing project and saves
- **THEN** the system updates that project in the database and the changes are reflected immediately

#### Scenario: Validation blocks invalid save
- **WHEN** the admin attempts to save with a required field missing or invalid
- **THEN** the system blocks the save and shows a clear field-level error

### Requirement: Delete projects
The admin SHALL be able to delete a project, with a confirmation step to prevent accidental loss.

#### Scenario: Confirmed delete
- **WHEN** the admin confirms deletion of a project
- **THEN** the system removes it from the database and it disappears from both the dashboard and the public site

#### Scenario: Cancelled delete
- **WHEN** the admin opens the delete confirmation but cancels
- **THEN** no project is removed

### Requirement: Reorder projects
The admin SHALL be able to change the display order of projects, and the public listing SHALL reflect that order.

#### Scenario: Reorder persists
- **WHEN** the admin reorders projects and the new order is saved
- **THEN** the system stores the updated order and the public listing renders projects in that order

### Requirement: Draft and publish control
The admin SHALL be able to set each project to `draft` or `published`. Only `published` projects appear publicly; `draft` projects remain editable but hidden from visitors.

#### Scenario: Publish a draft
- **WHEN** the admin sets a draft project to `published`
- **THEN** the project becomes visible on the public site

#### Scenario: Unpublish to draft
- **WHEN** the admin sets a published project back to `draft`
- **THEN** the project is hidden from the public site but remains in the dashboard

### Requirement: Save feedback
The admin interface SHALL give clear, immediate feedback on the outcome of each action (saving, success, and error states).

#### Scenario: Success feedback
- **WHEN** an admin action succeeds
- **THEN** the interface shows an unambiguous success indication

#### Scenario: Error feedback
- **WHEN** an admin action fails
- **THEN** the interface shows an actionable error message and does not falsely indicate success
