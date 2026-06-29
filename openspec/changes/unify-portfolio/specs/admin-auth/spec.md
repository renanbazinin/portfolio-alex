## ADDED Requirements

### Requirement: Secure admin credential
The system SHALL authenticate the admin against a securely stored credential. The admin password SHALL NOT be stored or compared in plaintext; it SHALL be verified against a hash held in server-side configuration. The system SHALL NOT ship with a hardcoded default password.

#### Scenario: Correct credential
- **WHEN** the admin submits the correct password to the login endpoint
- **THEN** the system establishes an authenticated session and grants access to the admin area

#### Scenario: Incorrect credential
- **WHEN** a user submits an incorrect password
- **THEN** the system denies access, returns an unauthorized response, and does not establish a session

### Requirement: Signed session cookie
On successful login the system SHALL issue a signed, HTTP-only session cookie scoped to the site. The session SHALL be verified on protected requests and SHALL expire after a bounded lifetime.

#### Scenario: Session persists across navigation
- **WHEN** an authenticated admin navigates between admin pages before the session expires
- **THEN** the system keeps them authenticated without re-prompting for the password

#### Scenario: Logout clears session
- **WHEN** the admin logs out
- **THEN** the system invalidates/clears the session cookie and subsequent admin requests are unauthenticated

### Requirement: Protected admin routes and write APIs
The system SHALL block unauthenticated access to admin pages and to all content-mutating APIs (create, edit, delete, reorder, publish, upload). Read access to public content SHALL remain unauthenticated.

#### Scenario: Unauthenticated admin page access
- **WHEN** an unauthenticated user requests an admin page
- **THEN** the system redirects them to the login screen instead of rendering admin content

#### Scenario: Unauthenticated write attempt
- **WHEN** an unauthenticated client calls a content-mutating API directly
- **THEN** the system rejects the request with an unauthorized response and makes no changes
