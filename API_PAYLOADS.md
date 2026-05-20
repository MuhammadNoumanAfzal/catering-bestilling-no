# API Names and Payloads

## Auth

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

