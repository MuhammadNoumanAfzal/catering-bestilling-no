# Catering Bestilling API Spec

This document defines the recommended backend APIs needed to make the current frontend fully dynamic.

It is based on the existing UI flows in:

- customer-facing pages
- auth pages
- checkout flow
- contact page
- saved vendors
- account/profile settings
- address book
- orders/invoices/rewards dashboard

## 1. Conventions

### Base URL

```txt
/api
```

### Authentication

Use Bearer token authentication for protected routes.

```http
Authorization: Bearer <access_token>
```

### Standard Success Response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required"]
  }
}
```

### Pagination Format

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 120,
      "totalPages": 10
    }
  }
}
```

## 2. Core Data Models

### User

```json
{
  "id": "usr_001",
  "firstName": "Nouman",
  "lastName": "Ali",
  "fullName": "Nouman Ali",
  "email": "nouman@example.com",
  "phone": "+47 123 45 678",
  "role": "customer",
  "company": "Lunsjavtale",
  "jobTitle": "Office Manager",
  "industry": "Catering",
  "avatarUrl": "https://cdn.example.com/avatar.jpg"
}
```

### Address

```json
{
  "id": "addr_001",
  "type": "delivery",
  "label": "Main Office",
  "contactName": "Reception Desk",
  "addressLine1": "123 Main St",
  "addressLine2": "Floor 3",
  "city": "Bergen",
  "state": "Vestland",
  "postalCode": "5003",
  "phoneNumber": "+47 123 45 678",
  "instructions": "Buzz reception and take elevator to 3rd floor",
  "isDefault": true
}
```

### Vendor Card

```json
{
  "id": "vnd_001",
  "slug": "flints-grill",
  "name": "Flint's Grill",
  "image": "https://cdn.example.com/vendors/flints-grill-cover.jpg",
  "logo": "https://cdn.example.com/vendors/flints-grill-logo.jpg",
  "rating": 4.8,
  "reviewCount": 450,
  "cuisine": "Grill",
  "deliveryFee": 30,
  "deliveryFeeLabel": "NOK 30 Delivery fee",
  "deliveryTime": "30-45 min",
  "discount": "20% Discount",
  "categoryTags": ["Hot Meal", "BBQ"],
  "city": "Bergen",
  "addressLine": "45 Storgata, Bergen"
}
```

### Menu Item Card

```json
{
  "id": "itm_001",
  "slug": "grilled-mixed-platter",
  "vendorSlug": "the-queens-kebab",
  "vendorName": "The Queen's Kebab",
  "title": "Grilled Mixed Platter",
  "image": "https://cdn.example.com/menu/grilled-mixed-platter.jpg",
  "rating": 4.9,
  "price": 189,
  "currency": "NOK",
  "minimumGuests": 10,
  "maximumGuests": 40,
  "categoryTags": ["Hot Meal", "BBQ", "American"],
  "dietaryTags": ["Halal"],
  "offerTags": ["Accepts discount code"],
  "pricingTier": "Premium",
  "individualPackaging": false,
  "newlyAdded": false,
  "smallBusiness": true,
  "minimumOrderValue": 55,
  "distanceKm": 5,
  "popularityScore": 98,
  "deliveryTimeLabel": "25-40 min"
}
```

### Review

```json
{
  "id": "rev_001",
  "author": "Emma Johnson",
  "rating": 4.8,
  "title": "Reliable catering for team lunches",
  "comment": "Everything arrived on time and was easy to serve.",
  "occasion": "Office Lunch",
  "date": "2026-04-24"
}
```

### Cart Item

```json
{
  "id": "cart_item_001",
  "menuItemId": "itm_001",
  "vendorSlug": "the-queens-kebab",
  "name": "Grilled Mixed Platter",
  "quantity": 2,
  "serves": 10,
  "totalServes": 20,
  "unitPrice": 189,
  "lineTotal": 378,
  "selectedRequiredOption": "Grilled Chicken",
  "selectedOptionalOptions": [
    {
      "groupTitle": "Add",
      "label": "Guacamole",
      "price": 1.8
    }
  ],
  "specialInstructions": "No onions please",
  "isAddOn": false
}
```

## 3. Auth APIs

### POST `/api/auth/signup`

Create a new account.

Request:

```json
{
  "firstName": "Nouman",
  "lastName": "Ali",
  "email": "nouman@example.com",
  "password": "StrongPass@123",
  "phone": "+47 123 45 678"
}
```

Response:

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "usr_001",
      "firstName": "Nouman",
      "lastName": "Ali",
      "fullName": "Nouman Ali",
      "email": "nouman@example.com",
      "phone": "+47 123 45 678",
      "role": "customer"
    },
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### POST `/api/auth/signin`

Request:

```json
{
  "email": "nouman@example.com",
  "password": "StrongPass@123"
}
```

Response:

```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "usr_001",
      "firstName": "Nouman",
      "lastName": "Ali",
      "fullName": "Nouman Ali",
      "email": "nouman@example.com",
      "phone": "+47 123 45 678",
      "role": "customer"
    },
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### POST `/api/auth/forgot-password`

Request:

```json
{
  "email": "nouman@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "data": {
    "resetRequestId": "rst_001"
  }
}
```

### POST `/api/auth/verify-reset-otp`

Request:

```json
{
  "email": "nouman@example.com",
  "otpCode": "1234"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "temporary_reset_token"
  }
}
```

### POST `/api/auth/reset-password`

Request:

```json
{
  "resetToken": "temporary_reset_token",
  "newPassword": "NewStrongPass@123",
  "confirmPassword": "NewStrongPass@123"
}
```

Response:

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {}
}
```

### POST `/api/auth/logout`

Request:

```json
{
  "refreshToken": "refresh_token_here"
}
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

### GET `/api/me`

Response:

```json
{
  "success": true,
  "data": {
    "id": "usr_001",
    "firstName": "Nouman",
    "lastName": "Ali",
    "fullName": "Nouman Ali",
    "email": "nouman@example.com",
    "phone": "+47 123 45 678",
    "role": "customer",
    "company": "Lunsjavtale",
    "jobTitle": "Office Manager",
    "industry": "Catering"
  }
}
```

## 4. Home Page APIs

### GET `/api/home`

Use this to power the homepage in one request.

Query params:

- `location`
- `postalCode`
- `date`
- `time`

Response:

```json
{
  "success": true,
  "data": {
    "popularVendors": [],
    "featuredVendors": [],
    "popularProducts": [],
    "foodTypeCategories": [
      "Breakfast",
      "Hot Meal",
      "Salad",
      "Packages",
      "Asian",
      "BBQ",
      "Healthy",
      "Italian"
    ]
  }
}
```

Optional alternative split endpoints:

- `GET /api/vendors/collections/popular`
- `GET /api/vendors/collections/featured`
- `GET /api/products/collections/popular`

## 5. Browse APIs

### GET `/api/browse/meta`

Returns static-ish filter metadata.

Response:

```json
{
  "success": true,
  "data": {
    "tabs": [
      { "id": "food-type", "label": "Browse by Food Type", "href": "/browse/food-type" },
      { "id": "occasion", "label": "Browse by Occasion", "href": "/browse/occasion" }
    ],
    "foodTypeCategories": ["Breakfast", "Hot Meal", "Salad", "Packages", "Asian", "BBQ", "Healthy", "Italian"],
    "occasionCategories": ["Breakfast", "Birthday", "Baby", "Meeting", "Conference", "Networking", "Party", "Reception"],
    "sortOptions": ["Recommended", "Most Popular", "Fastest delivery"],
    "ratingOptions": ["5 or more", "4 or more", "3 or more", "2 or more"],
    "dietaryOptions": ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
    "offerOptions": ["Free Delivery", "Accepts discount code", "Have a discount"],
    "pricingOptions": ["Budget-friendly", "Standard", "Premium"],
    "orderMinimumOptions": ["Any price", "Under NOK 250", "NOK 250 - NOK 500", "NOK 500+"],
    "distanceOptions": ["Any distance", "Within 2 km", "Within 5 km", "Within 10 km"]
  }
}
```

### GET `/api/browse/items`

Query params:

- `browseType=food-type|occasion`
- `category`
- `sortBy`
- `minRating`
- `dietary`
- `offer`
- `pricing`
- `orderMinimum`
- `distance`
- `location`
- `postalCode`
- `date`
- `time`
- `page`
- `limit`

Example request:

```txt
/api/browse/items?browseType=food-type&category=Breakfast&minRating=4&dietary=Vegetarian&location=Bergen&page=1&limit=12
```

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "itm_001",
        "slug": "grilled-mixed-platter",
        "vendorSlug": "the-queens-kebab",
        "vendorName": "The Queen's Kebab",
        "title": "Grilled Mixed Platter",
        "image": "https://cdn.example.com/menu/grilled-mixed-platter.jpg",
        "rating": 4.9,
        "price": 189,
        "currency": "NOK",
        "minimumGuests": 10,
        "maximumGuests": 40,
        "categoryTags": ["Hot Meal", "BBQ", "American"],
        "dietaryTags": ["Halal"],
        "offerTags": ["Accepts discount code"],
        "pricingTier": "Premium",
        "individualPackaging": false,
        "newlyAdded": false,
        "smallBusiness": true,
        "minimumOrderValue": 55,
        "distanceKm": 5,
        "popularityScore": 98,
        "deliveryTimeLabel": "25-40 min"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "totalItems": 1,
      "totalPages": 1
    },
    "availableFilters": {
      "dietary": ["Vegetarian", "Vegan", "Halal", "Gluten-Free"],
      "offer": ["Free Delivery", "Accepts discount code", "Have a discount"],
      "pricing": ["Budget-friendly", "Standard", "Premium"]
    }
  }
}
```

## 6. Vendor APIs

### GET `/api/vendors/:vendorSlug`

Response:

```json
{
  "success": true,
  "data": {
    "id": "vnd_001",
    "slug": "flints-grill",
    "name": "Flint's Grill",
    "logo": "https://cdn.example.com/vendors/flints-grill-logo.jpg",
    "banner": "https://cdn.example.com/vendors/flints-grill-banner.jpg",
    "heroSideImage": "https://cdn.example.com/vendors/flints-grill-side.jpg",
    "rating": 4.8,
    "reviewCount": 450,
    "cuisine": "Grill",
    "addressLine": "45 Storgata, Bergen",
    "city": "Bergen",
    "servicePostalCodes": ["5003", "5004", "5005"],
    "deliveryFee": 30,
    "deliveryFeeLabel": "NOK 30 Delivery fee",
    "leadTime": "30-45 min",
    "availability": {
      "delivery": {
        "days": [1, 2, 3, 4, 5],
        "start": "09:00",
        "end": "18:00",
        "label": "Mon-Fri: 9am-6pm"
      },
      "takeout": {
        "days": [1, 2, 3, 4, 5],
        "start": "09:00",
        "end": "20:00",
        "label": "Mon-Fri: 9am-8pm"
      }
    },
    "categories": ["All-in-One Order", "Appetizers", "Catering Packages", "Boxed Lunches"]
  }
}
```

### GET `/api/vendors/:vendorSlug/menu`

Query params:

- `section`
- `page`
- `limit`

Response:

```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "id": "sec_001",
        "title": "Catering Packages",
        "items": [
          {
            "id": "itm_001",
            "title": "Executive Breakfast Tray",
            "image": "https://cdn.example.com/menu/executive-breakfast-tray.jpg",
            "serves": 10,
            "subcategory": "Meeting Trays",
            "tag": "Most ordered",
            "description": "Ready-made bundles for meetings, events, and office lunches.",
            "detailLines": [
              "Meeting-ready tray selection with flexible portions and easy table service.",
              "Allergens: Milk, Egg"
            ],
            "dietaryLabels": ["Vegetarian Friendly", "Nut Free"],
            "allergens": ["Milk", "Egg"],
            "price": 230
          }
        ]
      }
    ]
  }
}
```

### GET `/api/vendors/:vendorSlug/menu-items/:itemId`

Response:

```json
{
  "success": true,
  "data": {
    "id": "itm_001",
    "title": "Executive Breakfast Tray",
    "image": "https://cdn.example.com/menu/executive-breakfast-tray.jpg",
    "serves": 10,
    "subcategory": "Meeting Trays",
    "tag": "Most ordered",
    "description": "Ready-made bundles for meetings, events, and office lunches.",
    "detailLines": [
      "Meeting-ready tray selection with flexible portions and easy table service.",
      "Allergens: Milk, Egg"
    ],
    "dietaryLabels": ["Vegetarian Friendly", "Nut Free"],
    "allergens": ["Milk", "Egg"],
    "price": 230,
    "currency": "NOK",
    "modal": {
      "heading": "Executive Breakfast Tray",
      "pricePerPerson": 23,
      "badge": "Meeting Trays",
      "quantityOptions": ["1 order", "2 orders", "5 orders", "10 orders"],
      "requiredSelection": {
        "title": "Select protein or vegetables",
        "subtitle": "Required - 1 option",
        "options": [
          "Grilled Chicken",
          "Carnitas",
          "Grilled Veggies",
          "Al Pastor"
        ]
      },
      "optionalSelections": [
        {
          "title": "Add",
          "subtitle": "Optional",
          "options": [
            { "label": "Guacamole", "price": 1.8 },
            { "label": "Sour Cream", "price": 0.5 }
          ]
        }
      ],
      "instructionPlaceholder": "Let the restaurant know of any allergies or preparation instructions."
    }
  }
}
```

### GET `/api/vendors/:vendorSlug/reviews`

Query params:

- `page`
- `limit`
- `rating`

Response:

```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.8,
      "reviewCount": 450,
      "ratingBreakdown": {
        "5": 300,
        "4": 100,
        "3": 35,
        "2": 10,
        "1": 5
      }
    },
    "reviews": [
      {
        "id": "rev_001",
        "author": "Emma Johnson",
        "rating": 4.8,
        "title": "Reliable catering for team lunches",
        "comment": "Everything arrived on time and was easy to serve.",
        "occasion": "Office Lunch",
        "date": "2026-04-24"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 450,
      "totalPages": 45
    }
  }
}
```

### GET `/api/vendors/availability/check`

Query params:

- `vendorSlug`
- `date`
- `time`
- `postalCode`

Response:

```json
{
  "success": true,
  "data": {
    "available": true,
    "reason": null,
    "matchedSlot": {
      "date": "2026-05-15",
      "time": "14:30"
    },
    "deliveryFee": 30,
    "leadTime": "30-45 min"
  }
}
```

## 7. Saved Vendors APIs

### GET `/api/me/saved-vendors`

Response:

```json
{
  "success": true,
  "data": {
    "vendors": []
  }
}
```

### POST `/api/me/saved-vendors`

Request:

```json
{
  "vendorSlug": "flints-grill"
}
```

Response:

```json
{
  "success": true,
  "message": "Vendor saved successfully",
  "data": {
    "saved": true,
    "vendorSlug": "flints-grill"
  }
}
```

### DELETE `/api/me/saved-vendors/:vendorSlug`

Response:

```json
{
  "success": true,
  "message": "Vendor removed successfully",
  "data": {
    "removed": true,
    "vendorSlug": "flints-grill"
  }
}
```

## 8. Cart APIs

### GET `/api/cart`

Response:

```json
{
  "success": true,
  "data": {
    "cartId": "cart_001",
    "vendors": [
      {
        "vendor": {
          "slug": "the-queens-kebab",
          "name": "The Queen's Kebab"
        },
        "items": [
          {
            "id": "cart_item_001",
            "menuItemId": "itm_001",
            "vendorSlug": "the-queens-kebab",
            "name": "Grilled Mixed Platter",
            "quantity": 2,
            "serves": 10,
            "totalServes": 20,
            "unitPrice": 189,
            "lineTotal": 378,
            "selectedRequiredOption": "Grilled Chicken",
            "selectedOptionalOptions": [
              {
                "groupTitle": "Add",
                "label": "Guacamole",
                "price": 1.8
              }
            ],
            "specialInstructions": "No onions please",
            "isAddOn": false
          }
        ],
        "personCount": 20,
        "deliveryDate": "2026-05-15",
        "deliveryTime": "14:30",
        "deliveryAddress": "123 Main St, Bergen",
        "invoiceAddress": "123 Main St, Bergen",
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
        "breakdown": [
          { "label": "Food & beverage", "value": 378 },
          { "label": "Restaurant delivery fee", "value": 30 },
          { "label": "Sales tax", "value": 32.83 },
          { "label": "Tip", "value": 0 }
        ],
        "total": 440.83
      }
    ],
    "grandTotal": 440.83
  }
}
```

### POST `/api/cart/items`

Request:

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

Response:

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartId": "cart_001"
  }
}
```

### PATCH `/api/cart/items/:cartItemId`

Request:

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

### DELETE `/api/cart/items/:cartItemId`

Response:

```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {}
}
```

### PATCH `/api/cart/vendor-settings/:vendorSlug`

Request:

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

## 9. Checkout and Orders APIs

### POST `/api/orders`

This is the main checkout submit endpoint.

Request:

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

Response:

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ord_001",
    "confirmationNumber": "CB-2026-0001",
    "status": "Scheduled",
    "pricing": {
      "subTotal": 378,
      "deliveryFee": 30,
      "tax": 32.83,
      "tip": 0,
      "total": 440.83,
      "currency": "NOK"
    },
    "estimatedDelivery": {
      "date": "2026-05-15",
      "time": "14:30"
    }
  }
}
```

### GET `/api/orders`

Query params:

- `status`
- `page`
- `limit`
- `dateFrom`
- `dateTo`

### GET `/api/orders/:orderId`

Response should return full order detail for order history and confirmation pages.

## 10. Contact API

### POST `/api/contact/inquiries`

Request:

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

Response:

```json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "data": {
    "ticketId": "tkt_001",
    "expectedReplyTime": "1 business day"
  }
}
```

## 11. Profile APIs

### GET `/api/me/profile`

Response:

```json
{
  "success": true,
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "primaryEmail": "john@example.com",
    "secondaryEmail": "doe@example.com",
    "mobilePhone": "+47 123 45 678",
    "workPhone": "+47 987 65 432",
    "company": "Lunsjavtale",
    "jobTitle": "Vendor Manager",
    "industry": "Catering",
    "notificationPreferences": {
      "textNotifications": false,
      "emailNotifications": true,
      "pushNotifications": false,
      "orderConfirmationPush": false
    }
  }
}
```

### PATCH `/api/me/profile`

Request:

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

Request:

```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@123",
  "confirmNewPassword": "NewPass@123"
}
```

### PATCH `/api/me/notifications`

Request:

```json
{
  "textNotifications": false,
  "emailNotifications": true,
  "pushNotifications": false,
  "orderConfirmationPush": false
}
```

## 12. Address Book APIs

### GET `/api/me/addresses`

Query params:

- `type=delivery|invoice`

Response:

```json
{
  "success": true,
  "data": {
    "addresses": []
  }
}
```

### POST `/api/me/addresses`

Request:

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

Request body is the same as create.

### DELETE `/api/me/addresses/:addressId`

### POST `/api/me/addresses/:addressId/set-default`

Response:

```json
{
  "success": true,
  "message": "Default address updated",
  "data": {
    "addressId": "addr_001"
  }
}
```

## 13. Dashboard APIs

These routes support the current dashboard screens for summary, orders, invoices, rewards, settings, and restaurants.

### GET `/api/dashboard/summary`

Response:

```json
{
  "success": true,
  "data": {
    "stats": [
      { "label": "Total Orders", "value": 124 },
      { "label": "Pending Invoice", "value": 73 },
      { "label": "Reward Points", "value": 22 }
    ],
    "recentOrders": [
      {
        "id": "#12549",
        "date": "2026-04-05",
        "status": "Scheduled"
      }
    ],
    "quickLinks": [
      {
        "label": "Edit Profile",
        "to": "/vendor-dashboard/settings#profile"
      }
    ]
  }
}
```

### GET `/api/dashboard/orders`

Query params:

- `status`
- `dateFrom`
- `dateTo`
- `page`
- `limit`

Response:

```json
{
  "success": true,
  "data": {
    "summary": [
      { "label": "Total Orders", "value": 124 },
      { "label": "Completed", "value": 73 },
      { "label": "Scheduled", "value": 22 },
      { "label": "Drafts", "value": 8 }
    ],
    "orders": [
      {
        "id": "#12549",
        "vendor": "Flint's Grill",
        "eventName": "Annual Dinner",
        "date": "2026-04-05",
        "person": 20,
        "total": 548.73,
        "currency": "NOK",
        "status": "Scheduled"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

### GET `/api/dashboard/invoices`

Query params:

- `status`
- `dateFrom`
- `dateTo`
- `page`
- `limit`

Response:

```json
{
  "success": true,
  "data": {
    "overview": [
      { "label": "Total Invoices", "value": 42 },
      { "label": "Paid Invoices", "value": 30 },
      { "label": "Unpaid Invoices", "value": 10 },
      { "label": "Overdue Invoices", "value": 2 }
    ],
    "totals": [
      { "label": "Total Spent", "value": 12540.75, "currency": "NOK" },
      { "label": "This Month", "value": 2340.5, "currency": "NOK" },
      { "label": "Pending Amount", "value": 1120, "currency": "NOK" },
      { "label": "Overdue Amount", "value": 320.75, "currency": "NOK" }
    ],
    "records": [
      {
        "id": "#12549",
        "vendor": "Flint's Grill",
        "event": "Annual Dinner",
        "deliveredOn": "2026-04-21",
        "dueOn": "2026-04-26",
        "amount": 548.73,
        "currency": "NOK",
        "status": "Paid"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

### GET `/api/dashboard/invoices/:invoiceId`

Response:

```json
{
  "success": true,
  "data": {
    "id": "#12549",
    "vendor": "Flint's Grill",
    "event": "Annual Dinner",
    "deliveredOn": "2026-04-21",
    "dueOn": "2026-04-26",
    "amount": 548.73,
    "currency": "NOK",
    "status": "Paid",
    "lineItems": [
      {
        "label": "Food & beverage",
        "amount": 480
      },
      {
        "label": "Delivery fee",
        "amount": 30
      },
      {
        "label": "Tax",
        "amount": 38.73
      }
    ]
  }
}
```

### GET `/api/dashboard/rewards`

Response:

```json
{
  "success": true,
  "data": {
    "pointsBalance": 22000,
    "actions": [
      {
        "title": "Place Orders",
        "description": "All placed orders give points",
        "cta": "Start order"
      }
    ],
    "benefits": [
      "Always at least 1 point per NOK 1 spent."
    ],
    "redemptionOptions": [
      "Credit toward any order of NOK 250 or more."
    ],
    "tips": [
      "Rewards expire one year after your last order."
    ],
    "history": []
  }
}
```

### GET `/api/dashboard/restaurants`

Response:

```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "vnd_001",
        "slug": "flints-grill",
        "name": "Flint's Grill",
        "image": "https://cdn.example.com/vendors/flints-grill-cover.jpg",
        "rating": 4.9,
        "reviewCount": 150,
        "isSaved": true
      }
    ]
  }
}
```

## 14. Upload API

### POST `/api/uploads`

Use multipart form upload.

Response:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileUrl": "https://cdn.example.com/uploads/file.jpg",
    "fileName": "file.jpg",
    "mimeType": "image/jpeg",
    "size": 245120
  }
}
```

## 15. Recommended Build Order

### Phase 1

- auth
- me/profile
- addresses
- home
- browse
- vendor detail
- menu item detail
- cart
- checkout/orders
- contact

### Phase 2

- saved vendors
- reviews
- dashboard orders
- dashboard invoices

### Phase 3

- rewards
- uploads
- promo codes
- notifications

## 16. Minimum Viable Backend

If you want the smallest possible backend to make the app work end-to-end, build these first:

1. `POST /api/auth/signin`
2. `POST /api/auth/signup`
3. `GET /api/home`
4. `GET /api/browse/items`
5. `GET /api/vendors/:vendorSlug`
6. `GET /api/vendors/:vendorSlug/menu-items/:itemId`
7. `GET /api/cart`
8. `POST /api/orders`

