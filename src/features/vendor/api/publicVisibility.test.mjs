import test from "node:test";
import assert from "node:assert/strict";
import { isPublicVendorVisible } from "./publicVisibility.js";

test("suspension and deactivation override approved applications and stale visibility", () => {
  for (const status of ["SUSPENDED", "DEACTIVATED", "INACTIVE"]) {
    assert.equal(isPublicVendorVisible({
      status, applicationStatus: "APPROVED", isPubliclyVisible: true,
    }), false);
  }
});

test("active vendors are restored without bypassing explicit public restrictions", () => {
  assert.equal(isPublicVendorVisible({ status: "ACTIVE", applicationStatus: "APPROVED" }), true);
  assert.equal(isPublicVendorVisible({ status: "ACTIVE", isPubliclyVisible: false }), false);
  assert.equal(isPublicVendorVisible({ status: "ACTIVE", applicationStatus: "REJECTED" }), false);
});
