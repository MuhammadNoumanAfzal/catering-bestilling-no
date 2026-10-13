# API Names and Payloads

## Pricing Consistency Requirement

Updated backend contract: add-on customer prices are gross (`price_with_tax`).
Read `checkoutPreview.pricing` directly, including subtotal, addOnsTotal,
tipAmount, included taxAmount, and grandTotal. Never add included VAT to the total.
Read `invoice.lineItems` directly for separate menu/add-on quantities and prices;
use saved order items only as a compatibility fallback. Do not recalculate or
VAT-convert persisted financial amounts. The reported backend migration
`0034_heal_addon_pricing.py` handles historical corrections on the server.

Checkout preview, createOrder, saved clientOrder, and invoice must use the same
customer-facing pricing calculation. The frontend now uses API totals and blocks
submission when catalogue prices differ from the checkout preview.

Reproduction: 30 guests at 600 NOK, 12 add-ons at 89 NOK, and a 3813.60 NOK tip.
Expected: menu 18000, add-ons 1068, total 22881.60.
Reported persisted values: add-on unit 77.39, add-ons 928.68, total 22742.28.
Difference: 139.32 NOK. Verify whether the backend is removing VAT from add-ons
without adding it back into customer totals. Do not fix by adding VAT twice.

Backend requirements:
- Persist immutable gross and net unit/line prices with an explicit VAT basis.
- Use the same pricing service in preview, createOrder, order, and invoice resolvers.
- Keep menu-only line totals separate from selected add-on totals.
- Return pricingType, guest count, and add-on quantity explicitly.
- Review historical orders/invoices separately; frontend changes do not repair
  persisted financial records or externally issued invoices.

## Auth
### Public Delivery Availability

`availableDeliverySlots` is public. Send this query without an Authorization
header, including when a stale login token exists in browser storage.

```graphql
query GetAvailableDeliverySlots($vendorId: ID!, $date: String!) {
  availableDeliverySlots(vendorId: $vendorId, date: $date) {
    start
    end
    isFullyBooked
    remainingCapacity
  }
}
```

Variables: `{ "vendorId": "2", "date": "2026-10-18" }`.
Numeric and Relay vendor IDs are supported by the backend.

- The API owns schedule, closure, notice-time, and capacity decisions.
- `[]` means no delivery windows. Full windows stay visible but disabled.
- Request errors are not proof of a fully booked date; allow retry.
- Calendar requests use three concurrent workers. The endpoint is rate-limited.
- Add-to-cart and checkout re-check live capacity. Order creation still requires
  authentication and atomic backend validation of postcode, notice, and capacity.

### POST `/api/auth/signup`

```json
{
  "firstName": "Nouman",
  "lastName": "Ali",
  "email": "nouman@example.com",
  "password": "StrongPass@123",
  "phone": "+47 123 45 678"
}
```

### POST `/api/auth/signin`

```json
{
  "email": "nouman@example.com",
  "password": "StrongPass@123"
}
```

### POST `/api/auth/forgot-password`

```json
{
  "email": "nouman@example.com"
}
```

### POST `/api/auth/verify-reset-otp`

```json
{
  "email": "nouman@example.com",
  "otpCode": "1234"
}
```

### POST `/api/auth/reset-password`

```json
{
  "resetToken": "temporary_reset_token",
  "newPassword": "NewStrongPass@123",
  "confirmPassword": "NewStrongPass@123"
}
```

### POST `/api/auth/logout`

```json
{
  "refreshToken": "refresh_token_here"
}
```

## Public Listing and Browse

### GET `/api/home`

```json
{}
```

### GET `/api/browse/meta`

```json
{}
```

### GET `/api/browse/items`

```json
{
  "browseType": "food-type",
  "category": "Breakfast",
  "sortBy": "Recommended",
  "minRating": 4,
  "dietary": ["Vegetarian"],
  "offer": ["Free Delivery"],
  "pricing": ["Premium"],
  "orderMinimum": "Under NOK 250",
  "distance": "Within 5 km",
  "location": "Bergen",
  "postalCode": "5003",
  "date": "2026-05-15",
  "time": "14:30",
  "page": 1,
  "limit": 12
}
```

## Vendor

### GET `/api/vendors/:vendorSlug`

```json
{}
```

### GET `/api/vendors/:vendorSlug/menu`

```json
{
  "section": "Catering Packages",
  "page": 1,
  "limit": 12
}
```

### GET `/api/vendors/:vendorSlug/menu-items/:itemId`

```json
{}
```

### GET `/api/vendors/:vendorSlug/reviews`

```json
{
  "page": 1,
  "limit": 10,
  "rating": 4
}
```

### GET `/api/vendors/availability/check`

```json
{
  "vendorSlug": "flints-grill",
  "date": "2026-05-15",
  "time": "14:30",
  "postalCode": "5003"
}
```

## Saved Vendors

### POST `/api/me/saved-vendors`

```json
{
  "vendorSlug": "flints-grill"
}
```

## Cart

### POST `/api/cart/items`

```json
{
  "vendorSlug": "the-queens-kebab",
  "menuItemId": "itm_001",
  "quantity": 2,
  "selectedRequiredOption": "Grilled Chicken",
  "selectedOptionalOptions": [
    {
      "groupTitle": "Add",
      "label": "Guacamole",
      "price": 1.8
    }
  ],
  "specialInstructions": "No onions please"
}
```

### PATCH `/api/cart/items/:cartItemId`

```json
{
  "quantity": 3,
  "selectedRequiredOption": "Grilled Veggies",
  "selectedOptionalOptions": [
    {
      "groupTitle": "Add",
      "label": "Sour Cream",
      "price": 0.5
    }
  ],
  "specialInstructions": "Extra spicy"
}
```

### PATCH `/api/cart/vendor-settings/:vendorSlug`

```json
{
  "deliveryDate": "2026-05-15",
  "deliveryTime": "14:30",
  "personCount": 20,
  "tipRate": 0,
  "tableware": {
    "included": true,
    "plates": true,
    "cutlery": true,
    "cups": false,
    "napkins": true,
    "servingUtensils": false,
    "notes": ""
  }
}
```

## Checkout and Orders

### POST `/api/orders`

```json
{
  "customerType": "corporate",
  "contactInfo": {
    "companyName": "ABC Company",
    "organizationNumber": "123456789",
    "invoiceReference": "FIN-22",
    "firstName": "Nouman",
    "lastName": "Ali",
    "email": "nouman@example.com",
    "phone": "+47 123 45 678"
  },
  "deliveryAddress": {
    "label": "Main Office",
    "contactName": "Reception",
    "addressLine1": "123 Main St",
    "addressLine2": "Floor 3",
    "city": "Bergen",
    "state": "Vestland",
    "postalCode": "5003",
    "phoneNumber": "+47 123 45 678",
    "instructions": "Buzz reception"
  },
  "invoiceAddress": {
    "label": "Finance Office",
    "contactName": "Accounts",
    "addressLine1": "123 Main St",
    "addressLine2": "Floor 2",
    "city": "Bergen",
    "state": "Vestland",
    "postalCode": "5003",
    "phoneNumber": "+47 123 45 678",
    "instructions": ""
  },
  "eventDetails": {
    "eventName": "Board Lunch",
    "occasion": "Meeting",
    "date": "2026-05-15",
    "time": "14:30",
    "personCount": 20
  },
  "additionalInfo": "Please call on arrival",
  "vendorOrders": [
    {
      "vendorSlug": "the-queens-kebab",
      "tipRate": 0,
      "tableware": {
        "included": true,
        "plates": true,
        "cutlery": true,
        "cups": false,
        "napkins": true,
        "servingUtensils": false,
        "notes": ""
      },
      "items": [
        {
          "menuItemId": "itm_001",
          "quantity": 2,
          "selectedRequiredOption": "Grilled Chicken",
          "selectedOptionalOptions": [
            {
              "groupTitle": "Add",
              "label": "Guacamole",
              "price": 1.8
            }
          ],
          "specialInstructions": "No onions please"
        }
      ]
    }
  ]
}
```

## Contact

### POST `/api/contact/inquiries`

```json
{
  "name": "Alex Johnson",
  "email": "alex@company.com",
  "company": "Lunsjavtale Studio",
  "phone": "+47 000 00 000",
  "topic": "Corporate Catering",
  "message": "We need lunch for 35 people in Bergen next Friday."
}
```

## Profile

### PATCH `/api/me/profile`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "primaryEmail": "john@example.com",
  "secondaryEmail": "doe@example.com",
  "mobilePhone": "+47 123 45 678",
  "workPhone": "+47 987 65 432",
  "company": "Lunsjavtale",
  "jobTitle": "Vendor Manager",
  "industry": "Catering"
}
```

### PATCH `/api/me/password`

```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@123",
  "confirmNewPassword": "NewPass@123"
}
```

### PATCH `/api/me/notifications`

```json
{
  "textNotifications": false,
  "emailNotifications": true,
  "pushNotifications": false,
  "orderConfirmationPush": false
}
```

## Address Book

### POST `/api/me/addresses`

```json
{
  "type": "delivery",
  "label": "Main Office",
  "contactName": "Reception",
  "addressLine1": "123 Main St",
  "addressLine2": "Floor 3",
  "city": "Bergen",
  "state": "Vestland",
  "postalCode": "5003",
  "phoneNumber": "+47 123 45 678",
  "instructions": "Buzz reception",
  "isDefault": true
}
```

### PATCH `/api/me/addresses/:addressId`

```json
{
  "type": "delivery",
  "label": "Main Office",
  "contactName": "Reception",
  "addressLine1": "123 Main St",
  "addressLine2": "Floor 3",
  "city": "Bergen",
  "state": "Vestland",
  "postalCode": "5003",
  "phoneNumber": "+47 123 45 678",
  "instructions": "Buzz reception",
  "isDefault": true
}
```

## Dashboard

### GET `/api/dashboard/summary`

```json
{}
```

### GET `/api/dashboard/orders`

```json
{
  "status": "Scheduled",
  "dateFrom": "2026-04-01",
  "dateTo": "2026-04-30",
  "page": 1,
  "limit": 10
}
```

### GET `/api/dashboard/invoices`

```json
{
  "status": "Paid",
  "dateFrom": "2026-04-01",
  "dateTo": "2026-04-30",
  "page": 1,
  "limit": 10
}
```

### GET `/api/dashboard/invoices/:invoiceId`

```json
{}
```

### GET `/api/dashboard/rewards`

```json
{}
```

### GET `/api/dashboard/restaurants`

```json
{}
```

## Upload

### POST `/api/uploads`

```json
{
  "file": "multipart/form-data"
}
```

