import assert from "node:assert/strict";
import { test } from "node:test";
import { isAuthAvailabilityError } from "./availabilityErrors.js";

test("recognizes the deployed availability API authorization error", () => {
  assert.equal(isAuthAvailabilityError({ technicalMessage: "You are not authorized user." }), true);
  assert.equal(isAuthAvailabilityError({ code: "unauthorised", message: "Please try again." }), true);
  assert.equal(isAuthAvailabilityError({ message: "Failed to fetch" }), false);
  assert.equal(isAuthAvailabilityError({ message: "Invalid delivery slot data." }), false);
});
