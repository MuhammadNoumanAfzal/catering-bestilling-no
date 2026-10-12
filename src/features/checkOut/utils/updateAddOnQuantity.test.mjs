import assert from "node:assert/strict";
import { test } from "node:test";
import { updateAddOnQuantity } from "./updateAddOnQuantity.js";
const summary = { pricing: {}, items: [
  { id: "menu", quantity: 1 },
  { id: "addon", isAddOn: true, quantity: 2, unitPrice: 89, price: 178 },
] };
test("quantity updates price and invalidates old totals without changing the menu", () => {
  const updated = updateAddOnQuantity(summary, "addon", 5);
  assert.equal(updated.items[1].price, 445);
  assert.equal(updated.items[1].quantity, 5);
  assert.equal(updated.pricing, null);
  assert.equal(updated.items[0], summary.items[0]);
});
test("zero removes the add-on; invalid values and main items are ignored", () => {
  assert.equal(updateAddOnQuantity(summary, "addon", 0).items.length, 1);
  assert.equal(updateAddOnQuantity(summary, "addon", -1), summary);
  assert.equal(updateAddOnQuantity(summary, "menu", 5), summary);
});
