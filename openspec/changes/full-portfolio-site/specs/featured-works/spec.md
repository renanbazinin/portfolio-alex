## ADDED Requirements

### Requirement: Featured project retrieval
The system SHALL provide a way to retrieve published projects that are marked featured, ordered by the existing sort order, for use by the home showcase.

#### Scenario: Only published featured returned
- **WHEN** the featured set is requested
- **THEN** only projects that are both published and featured are returned, in sort order

#### Scenario: Empty featured set
- **WHEN** no published project is marked featured
- **THEN** the retrieval returns an empty set (callers apply their own fallback)
