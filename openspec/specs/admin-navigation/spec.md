# admin-navigation Specification

## Purpose
Navigation and route-transition experience of the admin panel: loading feedback, header links, and preview-screen affordances. (TBD: expand as capability evolves.)

## Requirements

### Requirement: Instant navigation feedback
Every admin panel route (dashboard, settings, project edit) SHALL render a route-level loading skeleton immediately on navigation, before server data resolves. Skeletons MUST approximate the destination layout (list rows for the dashboard, form blocks for forms) rather than a blank screen or spinner-only view.

#### Scenario: Navigating to the dashboard
- **WHEN** an authenticated admin navigates to /admin while the project list is still loading
- **THEN** a skeleton of the dashboard (toolbar + placeholder rows) paints immediately and is replaced by the real list when data resolves

#### Scenario: Navigating to settings
- **WHEN** an admin navigates to /admin/settings
- **THEN** a form-shaped skeleton renders instantly and no frozen previous page or blank screen is shown

### Requirement: Unambiguous panel navigation
The admin panel header SHALL contain exactly one link per destination — Dashboard, Settings, Preview, a "View site" link opening the public site, and Logout — with the current section visually marked active.

#### Scenario: No duplicate destinations
- **WHEN** the admin panel header renders
- **THEN** no two navigation items resolve to the same URL, and the item matching the current route shows an active treatment

### Requirement: Preview screen explains its constraints
The admin preview screen SHALL communicate that the home-layout variant selector only affects the Home tab: on non-Home tabs the selector is accompanied by explanatory text instead of appearing silently disabled.

#### Scenario: Variant selector on a non-Home tab
- **WHEN** the admin switches the preview to the About or Projects tab
- **THEN** the variant selector area shows a note that layout preview applies to Home, and re-selecting the Home tab restores the working selector
