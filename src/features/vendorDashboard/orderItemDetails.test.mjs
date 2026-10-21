import assert from "node:assert/strict";
import { test } from "node:test";
import { getIncludedOrderDishes, getOrderDisplayGuestCount } from "./orderItemDetails.js";

test("order detail accepts included dishes as connections or legacy lists", () => {
  const dish = { id: "1", title: "Tapas" };
  assert.deepEqual(getIncludedOrderDishes({ menuItems: { edges: [{ node: dish }, null] } }), [dish]);
  assert.deepEqual(getIncludedOrderDishes({ menuItems: [dish] }), [dish]);
  assert.deepEqual(getIncludedOrderDishes(null), []);
  assert.deepEqual(getIncludedOrderDishes({ addOnType: "INDEPENDENT", menuItems: [dish] }), []);
});
test("standalone order header uses line guests instead of unrelated order-level count", () => {
  const order = { personCount: 1, items: [{ addOnType: "INDEPENDENT", personCount: 21 }] };
  assert.equal(getOrderDisplayGuestCount(order), 21);
  assert.equal(getOrderDisplayGuestCount({ personCount: 30, items: [...order.items, { addOnType: "DEPENDENT" }] }), 30);
});
