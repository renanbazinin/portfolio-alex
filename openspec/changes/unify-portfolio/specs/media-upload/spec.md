## ADDED Requirements

### Requirement: Direct media upload
The admin SHALL be able to upload image (and other supported media) files directly from the project form, rather than only pasting URLs. Uploaded files SHALL be stored in cloud blob storage and the resulting durable URL SHALL be saved on the project.

#### Scenario: Upload an image
- **WHEN** the admin selects or drops an image file in the project form
- **THEN** the system uploads it to blob storage and stores the returned URL as the project's thumbnail or gallery image

#### Scenario: Upload requires authentication
- **WHEN** an unauthenticated client calls the upload endpoint
- **THEN** the system rejects the request and stores nothing

### Requirement: Upload validation
The system SHALL validate uploads by file type and maximum size, and SHALL reject unsupported or oversized files with a clear error.

#### Scenario: Reject unsupported type
- **WHEN** the admin tries to upload a file whose type is not allowed
- **THEN** the system rejects it and reports the allowed types

#### Scenario: Reject oversized file
- **WHEN** the admin tries to upload a file larger than the configured limit
- **THEN** the system rejects it and reports the size limit

### Requirement: Upload preview and feedback
The admin form SHALL show a preview of uploaded media and indicate upload progress and completion.

#### Scenario: Preview after upload
- **WHEN** an upload completes successfully
- **THEN** the form displays a preview of the uploaded media bound to the project field

#### Scenario: In-progress indication
- **WHEN** an upload is in progress
- **THEN** the form indicates progress and prevents a save that would reference an incomplete upload
