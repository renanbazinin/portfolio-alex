## ADDED Requirements

### Requirement: One round-trip per list mutation
Dashboard mutations (publish/unpublish, feature/unfeature, delete, reorder) SHALL update the visible list optimistically from the API response without triggering an additional full-route refetch. On API failure the list MUST roll back to its previous state and show an error toast.

#### Scenario: Toggling publish
- **WHEN** the admin toggles a project's publish state and the API succeeds
- **THEN** the row updates in place and no full page or route refresh occurs

#### Scenario: Failed mutation rolls back
- **WHEN** a reorder or toggle request fails
- **THEN** the list returns to its pre-action order/state and an error toast explains the failure

### Requirement: Per-action pending feedback
Each in-flight dashboard action SHALL be visibly pending on the specific control that triggered it (spinner plus progressive label, e.g. "Publishing…"), while other actions on that row are inert until it settles.

#### Scenario: Action in flight
- **WHEN** the admin clicks Publish on a row
- **THEN** that button shows a spinner and "Publishing…" until the request settles, and the row's other action buttons do not fire if clicked

### Requirement: Confirmed, styled deletion
Project deletion SHALL require confirmation via a styled in-app dialog (not a native browser confirm) that names the project, offers Cancel/Delete, closes on Escape, and shows a pending state on the destructive button while the request runs.

#### Scenario: Delete flow
- **WHEN** the admin clicks Delete on a project row
- **THEN** a dialog naming the project appears; confirming deletes and removes the row, cancelling or pressing Escape leaves the project untouched

### Requirement: Reordering constraints are explained inline
When search or category filtering is active, the reorder controls SHALL be hidden and an inline note near the toolbar SHALL state that clearing filters enables reordering. With no filters active, reorder controls SHALL be visible and enabled.

#### Scenario: Filter disables reordering
- **WHEN** the admin types into the dashboard search box
- **THEN** the up/down reorder controls disappear and a note appears explaining reordering requires clearing the filter

#### Scenario: Clearing filters restores reordering
- **WHEN** the search box and category filter return to their empty/default state
- **THEN** reorder controls reappear and persist the new order via the reorder API
