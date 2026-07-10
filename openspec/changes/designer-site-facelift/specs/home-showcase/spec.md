## ADDED Requirements

### Requirement: Editorial hero with staged entrance
The home page SHALL open with a full-viewport-scale editorial hero: display-type headline, supporting line, and a primary call-to-action to the projects page. On load the hero elements SHALL enter in a staged sequence (headline, supporting copy, CTA).

#### Scenario: Hero entrance
- **WHEN** the home page loads for a visitor without reduced-motion preference
- **THEN** hero elements animate in sequentially within ~1s total, and the page is readable and interactive even before animations finish

#### Scenario: Hero CTA
- **WHEN** the visitor activates the hero call-to-action
- **THEN** they navigate to the projects index

### Requirement: Featured work showcase
The home page SHALL show a featured-work section sourced from published projects flagged `featured` (falling back to most recent published when none are featured), rendered as an editorial grid with rich hover states revealing title and category.

#### Scenario: Featured projects shown
- **WHEN** at least one published project is flagged featured
- **THEN** the showcase renders those projects in `sortOrder`, each card linking to its detail page

#### Scenario: Fallback to recent
- **WHEN** no published project is flagged featured
- **THEN** the showcase renders the most recent published projects instead, and the section still renders correctly with zero projects (section hidden or empty state, never a crash)

#### Scenario: Card hover reveal
- **WHEN** the visitor hovers or focuses a showcase card
- **THEN** the image responds (scale/treatment) and the title/category reveal animates in; the same information is always visible on touch devices

### Requirement: Specialties section redesign
The home page SHALL present the specialties/services list as a designed section (numbered editorial rows or equivalent) with scroll-reveal entrances, replacing the plain grid.

#### Scenario: Specialties reveal on scroll
- **WHEN** the specialties section enters the viewport
- **THEN** its items reveal with a staggered animation (or appear instantly under reduced motion) and remain fully readable at all viewport widths
