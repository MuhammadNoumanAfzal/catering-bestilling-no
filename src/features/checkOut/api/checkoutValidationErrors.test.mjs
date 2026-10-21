import assert from "node:assert/strict";
import { test } from "node:test";
import { createCheckoutValidationError, getCheckoutValidationFieldErrors } from "./checkoutValidationErrors.js";

test("preserves server issue codes, item paths and metadata", () => {
  const issues = [{ code: "MINIMUM_GUESTS", field: "items.0.personCount", message: "At least 5 guests", meta: { minimum: 5 } }];
  const error = createCheckoutValidationError({ isValid: false, errors: issues }, "Failed");
  assert.equal(error.message, "At least 5 guests");
  assert.equal(error.code, "MINIMUM_GUESTS");
  assert.deepEqual(error.issues, issues);
  assert.deepEqual(getCheckoutValidationFieldErrors(error), {});
});
test("maps address and scheduling issues to checkout fields without conflating line counts", () => {
  const error = createCheckoutValidationError({ errors: [
    { field: "input.deliveryPostalCode", message: "Outside delivery area" },
    { field: "eventDate", message: "Closed date" },
    { field: "items.0.personCount", message: "Minimum guests" },
  ] }, "Failed");
  assert.deepEqual(getCheckoutValidationFieldErrors(error), { deliveryPostalCode: "Outside delivery area", date: "Closed date" });
  assert.equal(createCheckoutValidationError(null, "Please retry").message, "Please retry");
});
