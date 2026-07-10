## Why

The portfolio site is functional but visually flat: an effectively monochrome light-only theme, no accent color, no motion, placeholder-quality hero and cards, and dark-mode tokens that exist in CSS but are never activated. For a designer's portfolio, the site itself is the first work sample — it needs to feel like a 10/10 crafted product, not a scaffold. This change is a full visual/UX facelift of the public site.

## What Changes

- Establish a distinctive design system on top of the existing Tailwind v4 + shadcn setup: a real accent color, refined type scale (display serif or expressive pairing with Geist), spacing rhythm, and polished light/dark themes.
- Wire up dark mode end-to-end: `next-themes` ThemeProvider in the root layout, a theme toggle in the header, and audited dark variants across all public pages (tokens already exist but are unused).
- Redesign the site chrome: sticky header with scroll-aware treatment, animated mobile menu (replacing the text-only "Menu"/"Close" toggle), and a footer with real visual weight and working social links structure.
- Rebuild the home page as a showcase: full-bleed editorial hero with staged entrance animation, featured-work grid with rich hover states, and a redesigned specialties section.
- Elevate the project gallery: projects index with animated filtering/search states, redesigned project cards (aspect-ratio-aware imagery, hover reveals), and a project detail page that reads like a case study (lightbox-ready image presentation, sticky meta rail, prev/next project navigation).
- Add a coherent motion layer: entrance/scroll-reveal animations, view transitions between pages where supported, and micro-interactions on all interactive elements — with `prefers-reduced-motion` respected throughout.
- Replace raw `<img>` tags with `next/image` on public pages for proper loading behavior (blur-up, sizing) as part of the visual polish.
- Admin panel is out of scope except where shared primitives change (buttons, inputs inherit the new tokens).

## Capabilities

### New Capabilities

- `design-system`: Design tokens, typography scale, color palette with accent, light/dark themes and the theme toggle behavior.
- `site-chrome`: Header, navigation, mobile menu, and footer behavior and presentation across the public site.
- `home-showcase`: Home page hero, featured work section, and specialties presentation.
- `project-gallery`: Projects index browsing (search/filter UX) and project detail case-study presentation.
- `motion-interactions`: Site-wide animation and micro-interaction behavior, including reduced-motion handling.

### Modified Capabilities

<!-- none — openspec/specs/ is empty; this is the first change with specs -->

## Impact

- **Pages**: `src/app/(site)/page.tsx`, `about/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `src/app/layout.tsx`, `(site)/layout.tsx`.
- **Components**: `src/components/site/*` (header, footer, project-card, container, section-heading), `src/components/public/projects-browser.tsx`, shadcn `ui/*` primitives inherit token changes.
- **Styling**: `src/app/globals.css` (`@theme` tokens, dark palette, motion utilities); possible new font via `next/font`.
- **Dependencies**: wires up already-installed `next-themes`; may add a motion library (e.g. `motion`) — decided in design.md.
- **No changes** to DB schema, API routes, auth, or admin flows. Content model untouched; hardcoded copy may be lightly edited to fit new layouts.
- **Constraint**: `node_modules` is not installed and AGENTS.md requires reading `node_modules/next/dist/docs/` before writing code — implementation must start with `npm install` + doc review.
