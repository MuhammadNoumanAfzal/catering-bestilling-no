import assert from "node:assert/strict";
import { test } from "node:test";
import { restorePersonCount } from "./restorePersonCount.js";

test("returning from checkout preserves the saved guest count", () => {
  assert.equal(restorePersonCount({ items: [{ productId: "4" }], personCount: 50 }, 10), 50);
  assert.equal(restorePersonCount({ items: [{ productId: "4" }], personCount: 30 }, 10), 30);
});
test("fresh carts start at the menu minimum", () => {
  assert.equal(restorePersonCount({ items: [], personCount: 50 }, 10), 10);
});
test("restored counts cannot violate the menu minimum", () => {
  assert.equal(restorePersonCount({ items: [{}], personCount: 5 }, 10), 10);
  assert.equal(restorePersonCount({ items: [{}], personCount: "invalid" }, 10), 10);
});
