# Delivery Postal Code Enforcement

The client allows browsing and cart creation without a postal code. It requires
a four-digit Norwegian postal code for delivery checkout, checks exact vendor
coverage, and fetches current coverage and a server checkout preview before
submitting an order. Header searches do not save the profile postal code.

## Required Backend Rule

The backend source is not in this workspace. Client validation and checkout
preview do not replace validation inside the createOrder resolver.

Before creating an order or invoice, the resolver must:

1. Validate deliveryPostalCode as four digits, preserving leading zeros.
2. Resolve the requested vendor and products from server data.
3. Check the postal code against the vendor's current active delivery areas.
4. Check vendor visibility, minimum notice, closures, delivery hours and capacity.
5. Reject invalid delivery without creating an order, invoice or payment record.
6. Perform checks and capacity reservation within the order transaction.

Use the order's delivery postal code, not the saved account postal code, header
search, previously cached cart or previous checkout preview. An actual pickup
order may use separate rules only when pickup is explicitly supported by the API.

## Backend Acceptance Checks

- Vendor supports 0150: direct createOrder with 0150 succeeds when otherwise valid.
- The same vendor with 0250, blank, 015 or 01500 is rejected with no records created.
- Removing coverage after checkoutPreview makes createOrder reject the order.
- Editing the profile or logging in does not override deliveryPostalCode validation.
- Invalid or unavailable products cannot be ordered under another vendor's ID.
- Concurrent requests cannot exceed delivery capacity.

Production readiness requires these server-side checks to be implemented and
verified against the deployed API. Do not test successful order creation against
production accounts merely to verify this flow.
