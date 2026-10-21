import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeStandaloneItem, updateStandaloneItem } from "./standaloneCart.js";

const item = { id: "standalone", addOnType: "INDEPENDENT", pricingType: "per-person", unitPrice: 10, minimumGuests: 10, personCount: 13, quantity: 6 };
test("old per-person carts lose the unwanted quantity multiplier but retain chosen guests", () => {
  const normalized = normalizeStandaloneItem(item);
  assert.equal(normalized.quantity, 1);
  assert.equal(normalized.personCount, 13);
  assert.equal(normalized.totalServes, 13);
  assert.equal(normalizeStandaloneItem({ ...item, personCount: undefined }).personCount, 10);
});
test("guest changes update only the independent line and invalidate preview pricing", () => {
  const menu = { id: "menu", pricingType: "per-person", quantity: 1 };
  const summary = { personCount: 30, items: [item, menu], pricing: { grandTotal: 780 }, previewItems: [{}], availability: {} };
  const next = updateStandaloneItem(summary, item.id, { personCount: 9 });
  assert.equal(next.items[0].personCount, 10);
  assert.equal(next.items[0].quantity, 1);
  assert.equal(next.personCount, 30);
  assert.equal(next.items[1], menu);
  assert.equal(next.pricing, null);
  assert.deepEqual(next.previewItems, []);
});
test("fixed-price products increase and decrease units starting at one", () => {
  const fixed = { ...item, pricingType: "fixed", quantity: 1 };
  assert.equal(normalizeStandaloneItem({ ...fixed, quantity: 3 }).price, 30);
  assert.equal(normalizeStandaloneItem({ ...fixed, quantity: 0 }).quantity, 1);
  assert.equal(normalizeStandaloneItem({ ...fixed, quantity: Infinity }).quantity, 1);
  assert.equal(normalizeStandaloneItem({ ...fixed, personCount: Infinity }).personCount, 10);
  assert.equal(updateStandaloneItem({ items: [fixed] }, fixed.id, { quantity: 2 }).items[0].price, 20);
});
