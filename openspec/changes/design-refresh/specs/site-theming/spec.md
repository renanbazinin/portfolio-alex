## ADDED Requirements

### Requirement: Dark/light theme toggle

The system SHALL provide a theme toggle that switches the entire app (public site and admin) between dark and light modes. The selection SHALL persist across visits, and dark SHALL be the default for users who have not chosen a theme.

#### Scenario: Toggle switches theme

- **WHEN** a visitor clicks the theme toggle
- **THEN** the interface switches between dark and light mode immediately

#### Scenario: Preference persists

- **WHEN** a visitor who previously selected light mode returns to the site
- **THEN** the site renders in light mode without a flash of the wrong theme

#### Scenario: Default is dark

- **WHEN** a first-time visitor with no stored preference loads the site
- **THEN** the site renders in dark mode by default

#### Scenario: Admin honors the theme

- **WHEN** the admin panel is viewed
- **THEN** it renders in the currently selected theme using the same toggle

### Requirement: Accent and glow design system

The system SHALL apply a consistent indigo→violet accent across the site, including gradient-text treatment for primary wordmarks/headings, an animated "glow" backdrop on the home hero, and hover-lift styling on cards.

#### Scenario: Accent applied to primary actions

- **WHEN** any page renders primary buttons, active nav links, or the logo wordmark
- **THEN** they use the indigo/violet accent treatment

#### Scenario: Hero glow renders behind content

- **WHEN** the home hero renders
- **THEN** animated gradient orbs appear behind the hero content without intercepting clicks or being announced to screen readers

### Requirement: Motion respects user preference

The system SHALL disable decorative animations (glow orbs, hover transitions beyond color) when the user has requested reduced motion.

#### Scenario: Reduced motion disables orb animation

- **WHEN** a visitor has `prefers-reduced-motion: reduce` set
- **THEN** the gradient orbs render static and non-animated
