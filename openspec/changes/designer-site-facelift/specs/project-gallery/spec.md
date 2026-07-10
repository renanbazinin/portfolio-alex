## ADDED Requirements

### Requirement: Projects index with animated browsing
The projects index SHALL present all published projects in a responsive grid with search and category filtering. Filter/search changes SHALL animate (items fade/reposition rather than snapping), and an empty result state SHALL be designed (message + clear-filters affordance), not blank.

#### Scenario: Filtering animates
- **WHEN** the visitor selects a category or types a search query
- **THEN** matching cards animate to their new positions and non-matching cards animate out, with the result count reflected accessibly (aria-live or equivalent)

#### Scenario: Empty state
- **WHEN** no projects match the current search/filter
- **THEN** a designed empty state appears with an action to clear filters, and clearing restores the full grid

### Requirement: Project cards
Project cards SHALL render thumbnails via `next/image` with correct `sizes` for their grid slot, a hover/focus treatment (image response plus title/meta reveal), and no layout shift while images load.

#### Scenario: Card image loading
- **WHEN** a project card enters the viewport on a slow connection
- **THEN** the card reserves its aspect ratio (no layout shift) and the image loads with a smooth placeholder-to-sharp transition

#### Scenario: Keyboard parity
- **WHEN** the visitor tabs to a project card
- **THEN** the card shows the same reveal treatment as hover and Enter opens the project detail page

### Requirement: Case-study project detail page
The project detail page SHALL read as a case study: full-width hero media, a meta rail (category, year, role, tools, video link) that is sticky on desktop, prose description, and an image sequence with per-image scroll reveal.

#### Scenario: Detail layout
- **WHEN** a visitor opens a published project's detail page
- **THEN** they see hero media first, the meta rail alongside (stacked above on mobile), and images revealing as they scroll

#### Scenario: Image lightbox
- **WHEN** the visitor activates a project image
- **THEN** it opens enlarged in an accessible dialog (Escape closes, focus managed), without navigating away

### Requirement: Prev/next project navigation
The project detail page SHALL end with previous/next navigation between published projects (in the site's published ordering), each showing the neighbor's title and thumbnail, wrapping or hiding gracefully at the ends of the list.

#### Scenario: Navigate to neighbor
- **WHEN** the visitor activates the "next project" control on a detail page
- **THEN** they navigate to the next published project's detail page without returning to the index

#### Scenario: Single project edge case
- **WHEN** only one published project exists
- **THEN** the prev/next section hides or shows a back-to-projects link instead of broken/self-referencing links
