import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveAuthReturnDestination } from "./authReturnDestination.js";

test("new and existing accounts return to checkout even with onboarding state", () => {
  assert.deepEqual(resolveAuthReturnDestination({ registeredEmail: "new@example.com", from: { pathname: "/checkout/corporate" } }),
    { pathname: "/checkout/corporate", search: "", hash: "" });
});
test("menu and dashboard return paths keep their query and anchor", () => {
  const from = { pathname: "/vendor/gastronomen-as/menu/4", search: "?date=2026-10-18", hash: "#cart" };
  assert.deepEqual(resolveAuthReturnDestination({ from }), from);
  assert.equal(resolveAuthReturnDestination({ from: "/client-dashboard/orders" }), "/client-dashboard/orders");
});
test("direct sign-in uses home and unsafe or auth-loop destinations are rejected", () => {
  for (const from of [undefined, "https://example.com", "//example.com", "/\\example.com", "/signup", "/signin"]) {
    assert.equal(resolveAuthReturnDestination({ from }), "/");
  }
});
