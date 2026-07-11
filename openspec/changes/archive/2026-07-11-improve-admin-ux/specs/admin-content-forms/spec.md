## ADDED Requirements

### Requirement: Field-level validation errors
When a write API responds 422 with structured issues, the project and settings forms SHALL display each issue's message adjacent to the corresponding input (marked `aria-invalid`), clear a field's error when the admin edits that field, and reserve the generic error toast for responses without structured issues.

#### Scenario: API rejects one field
- **WHEN** the admin saves a project whose title fails server validation
- **THEN** the title input is marked invalid with the server's message next to it, other fields are untouched, and editing the title clears its error

#### Scenario: Non-validation failure
- **WHEN** a save fails without structured issues (e.g. network or 500)
- **THEN** the form shows a generic error toast and preserves all entered values

### Requirement: Unsaved changes are protected
Both forms SHALL track whether they have unsaved edits. Cancelling with unsaved edits SHALL require confirmation via the styled dialog, and closing or hard-navigating the tab while dirty SHALL trigger the browser's leave warning. Saving or an untouched form navigates without prompts.

#### Scenario: Cancel with edits
- **WHEN** the admin edits any field and clicks Cancel
- **THEN** a confirmation dialog warns that changes will be lost; confirming leaves, dismissing stays with edits intact

#### Scenario: Clean cancel
- **WHEN** the admin opens a form and clicks Cancel without editing
- **THEN** navigation happens immediately with no dialog

### Requirement: Fast, parallel media uploads
The media uploader SHALL upload multiple selected files concurrently, show each file's own progress/pending tile, append successful URLs in the original selection order, and report failures per file without aborting the other uploads.

#### Scenario: Multi-file upload
- **WHEN** the admin drops three images at once
- **THEN** all three upload concurrently with individual progress, and the gallery gains the successes in selection order

#### Scenario: One file fails
- **WHEN** one of several uploads fails
- **THEN** the other files still complete and a toast identifies the failed file

### Requirement: Optimized admin imagery
Admin thumbnails (dashboard rows and uploader previews) SHALL render through the optimized image pipeline with explicit dimensions appropriate to their display size, not raw full-resolution images.

#### Scenario: Dashboard thumbnails
- **WHEN** the dashboard lists projects with thumbnails
- **THEN** each row requests an appropriately sized optimized image rather than the original full-resolution file
