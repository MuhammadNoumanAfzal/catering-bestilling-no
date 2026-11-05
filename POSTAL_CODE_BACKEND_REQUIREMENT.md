# Preserve customer postal codes

Client preserves entered digits as strings for UI, searches, and successful signup/profile numeric echoes. Account-scoped storage retains known leading zeros across reloads on the same browser; it cannot recover unknown values on another browser or repair a postal code replaced with a different ID.

Live schema checked 2026-11-04: SignupFormInput.postCode and UserProfileInput.postCode are Int. Change these to String and store/return the actual postal-code text, not an area record ID. Then update the client profile mutation variable from Int to String and remove numeric conversion at the signup/profile API boundary. Address and search APIs already accept strings.

Verify 0001, 0010, 1010 round-trip unchanged through signup, login, profile save/reload, and search in a fresh browser. If 1010 returns as 2, investigate whether an area identifier is returned instead of its post code. Existing truncated values require an authoritative data repair.
