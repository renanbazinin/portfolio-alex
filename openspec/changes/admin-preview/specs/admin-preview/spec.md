## ADDED Requirements

### Requirement: Admin preview screen

The admin SHALL have a preview screen in the panel that displays the live public pages inside the admin, reachable from the panel navigation. Access SHALL require a valid admin session.

#### Scenario: Open the preview screen

- **WHEN** an authenticated admin opens the preview screen
- **THEN** the live public home page is shown embedded within the panel

#### Scenario: Preview requires authentication

- **WHEN** an unauthenticated user navigates to the preview screen
- **THEN** they are redirected to the admin login page

### Requirement: Switch previewed page

The preview SHALL let the admin switch which public page is shown among Home, About, and Projects.

#### Scenario: Switch to the About page

- **WHEN** the admin selects "About" in the preview
- **THEN** the embedded view updates to show the public About page

### Requirement: Preview at device sizes

The preview SHALL let the admin view the embedded page at desktop, tablet, and mobile widths.

#### Scenario: Switch to mobile width

- **WHEN** the admin selects the mobile device size
- **THEN** the embedded page is constrained to a phone-width frame

### Requirement: Preview home layouts before saving

The preview SHALL let the admin preview each of the home layouts without changing the saved layout.

#### Scenario: Preview a different layout

- **WHEN** the admin selects a home layout in the preview that differs from the saved one
- **THEN** the embedded home page renders using the selected layout
- **AND** the saved layout setting is unchanged

#### Scenario: Reload reflects saved layout

- **WHEN** the admin leaves the preview without saving and a visitor loads the public home page
- **THEN** the visitor sees the saved layout, not the previewed one
