import assert from "node:assert/strict";
import { test } from "node:test";
import { isDirectlyOrderableProduct, isIndependentAddOn, getLineGuestCount } from "./addOnTypes.js";

test("dependent add-ons cannot be ordered directly, including legacy add-ons", () => {
  assert.equal(isDirectlyOrderableProduct({ productType: "add-on" }, true), false);
  assert.equal(isDirectlyOrderableProduct({ productType: "add-on", addOnType: "DEPENDENT" }, true), false);
});
test("independent products require backend rollout flag; normal menus do not", () => {
  const product = { productType: "add-on", addOnType: "INDEPENDENT" };
  assert.equal(isDirectlyOrderableProduct(product, true), true);
  assert.equal(isDirectlyOrderableProduct(product, false), false);
  assert.equal(isDirectlyOrderableProduct({ productType: "menu" }, false), true);
  assert.equal(isIndependentAddOn(product), true);
});
test("independent line guest count is not coupled to menu guest count", () => {
  assert.equal(getLineGuestCount({ addOnType: "INDEPENDENT", personCount: 6 }, 30), 6);
  assert.equal(getLineGuestCount({ addOnType: "DEPENDENT" }, 30), 30);
});
