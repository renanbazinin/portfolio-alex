## ADDED Requirements

### Requirement: Shared public layout
All public pages SHALL share a common layout consisting of a minimal site header with navigation and a footer. The header SHALL link to Home, Projects, and About; the footer SHALL present contact/social links.

#### Scenario: Navigation present on every public page
- **WHEN** a visitor is on any public page (home, projects, project detail, about)
- **THEN** the shared header with Home/Projects/About links and the footer are present

#### Scenario: Active section indicated
- **WHEN** a visitor is on a given public section
- **THEN** the corresponding nav item is visually indicated as active

### Requirement: Clean-minimal design system
The public site SHALL apply a consistent clean-minimal design system: a defined type scale, consistent spacing, a neutral palette with a single restrained accent, and consistent hover/focus states. The admin area MAY retain its own utilitarian styling.

#### Scenario: Consistent styling across pages
- **WHEN** a visitor moves between public pages
- **THEN** typography, spacing, color, and interactive states are visually consistent

#### Scenario: Responsive layout
- **WHEN** the site is viewed on a small (mobile) viewport
- **THEN** the header collapses appropriately and content remains readable without horizontal scrolling
