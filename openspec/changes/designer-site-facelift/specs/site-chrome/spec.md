## ADDED Requirements

### Requirement: Scroll-aware sticky header
The public site header SHALL remain fixed/sticky while scrolling and adapt its treatment to scroll position: transparent or minimal at the top of the page, gaining a translucent blurred background and hairline border once scrolled.

#### Scenario: Header adapts on scroll
- **WHEN** the visitor scrolls down past the top of any public page
- **THEN** the header transitions smoothly to its scrolled treatment (blur + border) and back when returning to the top

#### Scenario: Active nav state
- **WHEN** the visitor is on a page corresponding to a nav item (Home, Projects, About)
- **THEN** that nav item is visually marked as active (accent underline or equivalent), and non-active items show an animated hover treatment

### Requirement: Animated mobile menu
On small viewports the header SHALL present a menu button that opens an animated overlay/drawer menu with large touch targets, replacing the text-only "Menu"/"Close" toggle. The menu MUST close on navigation, on Escape, and trap focus while open.

#### Scenario: Open and navigate
- **WHEN** a mobile visitor taps the menu button
- **THEN** the menu animates in (staggered links, icon morph on the trigger), and tapping a link navigates and closes the menu

#### Scenario: Accessible dismissal
- **WHEN** the menu is open and the visitor presses Escape or activates the close control
- **THEN** the menu animates out, focus returns to the trigger, and background page scroll (locked while open) is restored

### Requirement: Footer with real presence
The site footer SHALL present a visually substantial closing section: a large call-to-action (e.g., email/contact), social links rendered as labeled links with hover treatments, and the copyright/admin line. Social links MUST come from a single config so placeholder URLs can be replaced in one place.

#### Scenario: Footer renders CTA and socials
- **WHEN** any public page is scrolled to the bottom
- **THEN** the footer shows the contact CTA in display type, the social links with animated hover states, and the hidden-but-focusable admin link still works

#### Scenario: Single source for links
- **WHEN** a social URL is updated in the site config
- **THEN** the footer (and any other consumer) reflects it without touching component markup
