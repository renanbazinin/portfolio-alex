## ADDED Requirements

### Requirement: Design tokens define the visual identity
The site SHALL define its visual identity as Tailwind v4 `@theme` tokens in `globals.css`: a warm-neutral base palette, a single brand accent color, radius, and font-family tokens. All public components MUST consume these tokens (no hardcoded hex/oklch values in components).

#### Scenario: Components use tokens
- **WHEN** any public page component applies color, radius, or font styles
- **THEN** it references theme tokens (Tailwind utilities backed by CSS variables), and changing a token value in `globals.css` propagates without component edits

#### Scenario: Accent is scarce
- **WHEN** the accent color is used
- **THEN** it appears only in designated moments (links/hover underlines, focus rings, selection, theme toggle, active filter, kicker marks) and never as large surface fills behind project imagery

### Requirement: Display typography
The site SHALL use a display typeface (loaded via `next/font`, exposed as `--font-display`) for the hero, page titles, and section headings, while Geist Sans remains the body/UI face and Geist Mono the meta-label face.

#### Scenario: Headings render in display face
- **WHEN** the home hero, a page title, or a section heading renders
- **THEN** it uses the display font with no flash of unstyled/fallback font on load (next/font self-hosting)

#### Scenario: Meta labels stay mono
- **WHEN** project meta (year, category, role, tools) renders
- **THEN** it uses Geist Mono with the uppercase tracked treatment

### Requirement: Light and dark themes
The site SHALL support light and dark themes via the `.dark` class strategy, defaulting to the visitor's system preference, with a complete dark token set (every token used by public pages has a tuned dark value).

#### Scenario: System preference respected on first visit
- **WHEN** a first-time visitor with a dark system preference loads any public page
- **THEN** the page paints dark on first render with no flash of the light theme

#### Scenario: Dark theme is complete
- **WHEN** any public page is viewed in dark mode
- **THEN** all text meets WCAG AA contrast against its background and no element renders with light-theme remnants (e.g., white cards on dark background)

### Requirement: Theme toggle
The header SHALL contain a theme toggle that switches between light and dark, persists the choice across visits, and is operable by keyboard with a visible focus state.

#### Scenario: Toggle switches and persists
- **WHEN** the visitor activates the theme toggle and later reloads the page
- **THEN** the theme switches immediately with an animated icon transition, and the chosen theme is restored on reload

#### Scenario: Keyboard operable
- **WHEN** the visitor tabs to the toggle and presses Enter or Space
- **THEN** the theme switches and the control shows a visible accent-colored focus ring
