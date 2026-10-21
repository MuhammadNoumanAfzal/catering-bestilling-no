import assert from "node:assert/strict";
import { test } from "node:test";
import { FETCH_PRODUCT_QUERY } from "./menuQueries.js";
import { FETCH_VENDOR_BY_SLUG_QUERY } from "../../vendor/api/vendorQueries.js";
import { GET_CHECKOUT_PREVIEW_QUERY } from "../../checkOut/api/checkoutQueries.js";
import { CREATE_ORDER_MUTATION } from "../../checkOut/api/checkoutMutations.js";

test("standalone details can omit inapplicable menu contents while normal menus retain them", () => {
  assert.match(FETCH_PRODUCT_QUERY, /\$includeMenuContents: Boolean! = true/);
  assert.match(FETCH_PRODUCT_QUERY, /menuItems @include\(if: \$includeMenuContents\)/);
  assert.match(FETCH_PRODUCT_QUERY, /optionalAddOns @include\(if: \$includeMenuContents\)/);
});
test("guest vendor browsing skips authenticated review permissions", () => {
  assert.match(FETCH_VENDOR_BY_SLUG_QUERY, /\$includeReviewPermissions: Boolean! = false/);
  assert.match(FETCH_VENDOR_BY_SLUG_QUERY, /canReview @include\(if: \$includeReviewPermissions\)/);
  assert.doesNotMatch(FETCH_VENDOR_BY_SLUG_QUERY, /optionalAddOns/);
});
test("checkout reads saved line guests and structured create-order issues", () => {
  assert.match(GET_CHECKOUT_PREVIEW_QUERY, /quantity\s+personCount/);
  assert.match(CREATE_ORDER_MUTATION, /availability\s*\{\s*isValid\s*errors/);
  assert.match(CREATE_ORDER_MUTATION, /lineItems\s*\{[^}]*personCount/);
});
