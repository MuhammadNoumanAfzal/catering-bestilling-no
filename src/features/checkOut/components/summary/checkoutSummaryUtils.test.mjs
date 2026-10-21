import assert from "node:assert/strict";
import { test } from "node:test";
import { getVendorTotals, getPreviewItemPrice, getItemPrice, getItemServes } from "./checkoutSummaryUtils.js";
const cart = { vendor: {}, orderSummary: { personCount: 30, items: [
  { productId: "4", unitPrice: 600, quantity: 1, pricingType: "per-person" },
  { isAddOn: true, parentMenuItemId: "4", name: "Crema catalana", quantity: 12, unitPrice: 89, price: 1068, pricingType: "fixed" },
], pricing: { pricesIncludeVat: true, subtotal: 18000, addOnsTotal: 928.68,
  taxAmount: 2487.13, deliveryFee: 0, tipAmount: 3813.60, grandTotal: 22742.28 },
previewItems: [{ productId: "4", lineTotal: 18928.68, selectedAddons: [{ name: "Crema catalana", totalPrice: 928.68 }] }],
} };
test("standalone product totals use its own guests and quantity", () => {
  const item = { addOnType: "INDEPENDENT", personCount: 5, quantity: 2, unitPrice: 89, pricingType: "per-person" };
  assert.equal(getItemPrice(item, 30), 445);
  assert.equal(getItemServes(item, 30), 5);
  assert.equal(getItemPrice({ ...item, pricingType: "fixed" }, 30), 178);
});
test("per-person standalone cart never applies the removed quantity multiplier", () => {
  const item = { addOnType: "INDEPENDENT", personCount: 13, quantity: 6, unitPrice: 10, pricingType: "per-person" };
  assert.equal(getItemPrice(item, 1), 130);
  assert.equal(getItemPrice({ ...item, personCount: 10 }, 780), 100);
});
test("checkout shows server pricing and flags catalogue/API disagreement", () => {
  const totals = getVendorTotals(cart);
  assert.equal(totals.grandTotal, 22742.28);
  assert.equal(totals.addOnsTotal, 928.68);
  assert.equal(Math.round(totals.subtotal), 18000);
  assert.equal(totals.pricingMismatch, true);
  assert.equal(getPreviewItemPrice(cart.orderSummary.items[1], cart.orderSummary), 928.68);
});
test("matching catalogue and API prices do not block checkout", () => {
  const corrected = { ...cart, orderSummary: { ...cart.orderSummary,
    pricing: { ...cart.orderSummary.pricing, addOnsTotal: 1068, grandTotal: 22881.60 } } };
  assert.equal(getVendorTotals(corrected).pricingMismatch, false);
  assert.equal(getVendorTotals(corrected).grandTotal, 22881.60);
  assert.equal(getVendorTotals(corrected).salesTax, 2487.13);
  assert.equal(getVendorTotals(corrected).subtotal, 18000);
});
