## ADDED Requirements

### Requirement: Editable site content store

The system SHALL persist editable site content (About copy, contact/identity info, and social links) in a single database record. When no record exists, the system SHALL serve built-in default content equal to the values previously hard-coded in the components, so the public site renders correctly before any edit is made.

#### Scenario: Defaults served when nothing saved

- **WHEN** the public About page or footer is rendered and no site-content record exists
- **THEN** the page displays the built-in default content without error

#### Scenario: Saved content overrides defaults

- **WHEN** an admin has saved site content and a visitor loads the About page or footer
- **THEN** the saved values are displayed instead of the defaults

### Requirement: Admin can edit About content

The admin SHALL be able to edit the About page heading, intro paragraphs, expertise groups (each a heading plus a list of items), and approach items (each a number, title, and body) from the admin panel.

#### Scenario: Edit and save About copy

- **WHEN** the admin changes the About heading or an intro paragraph and saves
- **THEN** the change is persisted and appears on the public About page

#### Scenario: Add and remove expertise/approach entries

- **WHEN** the admin adds a new expertise group or removes an approach item and saves
- **THEN** the public About page reflects the added or removed entry

### Requirement: Admin can edit contact and identity info

The admin SHALL be able to edit the display name, role, location, and contact email shown on the public site.

#### Scenario: Edit contact email

- **WHEN** the admin updates the contact email and saves
- **THEN** the footer's email link points to the new `mailto:` address

#### Scenario: Edit identity line

- **WHEN** the admin updates the name, role, or location and saves
- **THEN** the footer identity line reflects the updated values

### Requirement: Admin can manage social links

The admin SHALL be able to edit the label and URL of existing social links, remove any social link, and add new social links. Each link MUST have a non-empty label and a valid URL.

#### Scenario: Edit a known social link

- **WHEN** the admin changes the URL of the Instagram link and saves
- **THEN** the footer Instagram link points to the new URL

#### Scenario: Remove a social link

- **WHEN** the admin removes the Vimeo link and saves
- **THEN** the Vimeo link no longer appears in the footer

#### Scenario: Add a new social link

- **WHEN** the admin adds a link with a label and URL and saves
- **THEN** the new link appears in the footer opening in a new tab

#### Scenario: Reject invalid link

- **WHEN** the admin submits a social link with an empty label or an invalid URL
- **THEN** the save is rejected with a validation message and existing content is unchanged

### Requirement: Site content editing is authenticated

The system SHALL require a valid admin session for the site-content editing screen and for any request that modifies site content. Read access used to render the public site SHALL NOT require authentication.

#### Scenario: Unauthenticated write rejected

- **WHEN** a request to modify site content is made without a valid admin session
- **THEN** the system responds with 401 Unauthorized and no content is changed

#### Scenario: Unauthenticated admin screen redirected

- **WHEN** an unauthenticated user navigates to the site-content admin screen
- **THEN** they are redirected to the admin login page
