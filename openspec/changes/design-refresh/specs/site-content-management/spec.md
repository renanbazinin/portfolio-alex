## ADDED Requirements

### Requirement: Admin can edit home hero content

The admin SHALL be able to edit the home page hero title and hero subtitle from the admin panel, and the public home page SHALL render those values. When no value is saved, built-in defaults SHALL be shown.

#### Scenario: Edit hero title

- **WHEN** the admin changes the hero title and saves
- **THEN** the public home page hero displays the new title

#### Scenario: Defaults when unset

- **WHEN** no hero content has been saved
- **THEN** the home hero renders the built-in default title and subtitle

### Requirement: Admin can manage home specialties

The admin SHALL be able to add, edit, and remove the home page specialty cards (each a title and description), and the public home page SHALL render the managed list.

#### Scenario: Add a specialty

- **WHEN** the admin adds a specialty with a title and description and saves
- **THEN** the new specialty card appears on the home page

#### Scenario: Remove a specialty

- **WHEN** the admin removes a specialty and saves
- **THEN** that specialty card no longer appears on the home page

#### Scenario: Empty specialties hides the section

- **WHEN** the admin saves an empty specialties list
- **THEN** the home page does not render an empty specialties section
