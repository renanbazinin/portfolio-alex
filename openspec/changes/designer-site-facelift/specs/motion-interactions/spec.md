## ADDED Requirements

### Requirement: Coherent motion language
Site-wide animation SHALL follow one motion language: consistent durations (fast micro-interactions ~150–250ms, entrances ~400–700ms), consistent easing, and movement that supports content (rise/fade reveals) rather than decoration. Motion values SHALL be defined centrally (CSS custom properties and/or shared motion constants), not scattered per component.

#### Scenario: Consistent timing
- **WHEN** any two entrance animations on different pages are compared
- **THEN** they use the shared duration/easing values from the central definition

### Requirement: Scroll-reveal sections
Content sections on public pages SHALL reveal on scroll (fade/rise, staggered for grids and lists), animating once per element as it enters the viewport, never hiding content from visitors whose viewport already includes it on load.

#### Scenario: Reveal on scroll
- **WHEN** a section scrolls into the viewport
- **THEN** its content animates in once and remains visible on subsequent scrolls

#### Scenario: No hidden content trap
- **WHEN** JavaScript fails or is slow to hydrate
- **THEN** page content is still visible and readable (reveals degrade to visible, never to permanently hidden)

### Requirement: Micro-interactions on interactive elements
All interactive elements on public pages (links, buttons, cards, toggle, filter controls) SHALL have visible hover, focus-visible, and active states with smooth transitions. Focus states MUST use the accent ring and never be removed.

#### Scenario: Interactive feedback
- **WHEN** the visitor hovers, focuses, or presses any interactive element
- **THEN** the element responds with its designed transition within 250ms, and keyboard focus is always visibly indicated

### Requirement: Reduced motion respected
The site SHALL honor `prefers-reduced-motion: reduce` across both CSS and JavaScript animation layers: entrance/scroll/stagger animations collapse to instant or simple opacity fades, and no parallax or large translations play.

#### Scenario: Reduced motion visitor
- **WHEN** a visitor with `prefers-reduced-motion: reduce` loads and scrolls any public page
- **THEN** content appears without movement-based animation, and all functionality (menu, toggle, filtering, lightbox) still works
