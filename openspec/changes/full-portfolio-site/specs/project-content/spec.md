## ADDED Requirements

### Requirement: Featured attribute
The project data model SHALL include a `featured` boolean attribute, defaulting to false. It SHALL be persisted, validated on write, and included when projects are read via the data layer and APIs.

#### Scenario: Default not featured
- **WHEN** a project is created without specifying featured
- **THEN** it is stored with featured set to false

#### Scenario: Featured persisted and exposed
- **WHEN** a project is saved as featured
- **THEN** its featured value is persisted and present in subsequent reads and API responses
