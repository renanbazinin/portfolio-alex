## ADDED Requirements

### Requirement: Authenticated home layout override

The public home page SHALL accept a `previewVariant` query parameter that overrides the rendered home layout for that request only, applied solely when the request carries a valid admin session and the value is a known layout. The override SHALL NOT be persisted and SHALL have no effect for unauthenticated visitors.

#### Scenario: Admin override applied

- **WHEN** an authenticated admin requests the home page with `previewVariant` set to a valid layout
- **THEN** the home page renders that layout for the request

#### Scenario: Override ignored for visitors

- **WHEN** an unauthenticated visitor requests the home page with `previewVariant` set
- **THEN** the override is ignored and the saved layout is rendered

#### Scenario: Invalid override ignored

- **WHEN** a request sets `previewVariant` to an unknown value
- **THEN** the override is ignored and the saved layout is rendered
