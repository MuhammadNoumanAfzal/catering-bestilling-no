import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isVendorAvailableForPostalCode,
  filterVendorsByLocation,
} from "../../vendor/services/vendorAvailability.js";
import { validateCheckoutForm } from "./orderFlowValidation.js";

const vendor = { name: "Vendor A", servicePostalCodes: ["0150"] };
const validForm = {
  date: "2099-10-10", time: "12:00", personCount: 10,
  deliveryAddress: "Gate 1", deliveryPostalCode: "0150", deliveryCity: "Oslo",
  invoiceAddress: "Gate 1", invoicePostalCode: "0150", invoiceCity: "Oslo",
  firstName: "Test", lastName: "Customer", phone: "12345678", email: "test@example.com",
};
const validate = (fields = {}) => validateCheckoutForm({
  formState: { ...validForm, ...fields }, checkoutType: "private", carts: [{ vendor }],
});

test("browsing without a location includes all vendors", () => {
  assert.deepEqual(filterVendorsByLocation([vendor], ""), [vendor]);
});
test("postal coverage is exact and retains leading zeros", () => {
  assert.equal(isVendorAvailableForPostalCode(vendor, "0150"), true);
  assert.equal(isVendorAvailableForPostalCode(vendor, "0250"), false);
  for (const code of ["015", "01500", "abc0150"]) {
    assert.equal(isVendorAvailableForPostalCode(vendor, code), false);
  }
});
test("header search updates coverage without changing vendor data", () => {
  assert.equal(filterVendorsByLocation([vendor], "0150").length, 1);
  assert.equal(filterVendorsByLocation([vendor], "0250").length, 0);
  assert.deepEqual(vendor.servicePostalCodes, ["0150"]);
});
test("checkout requires a complete four-digit postal code", () => {
  for (const code of ["", "015", "01500", "abcd"]) {
    assert.match(validate({ deliveryPostalCode: code }), /postal code/i);
  }
});
test("checkout rejects delivery outside vendor coverage", () => {
  assert.match(validate({ deliveryPostalCode: "0250" }), /does not deliver/i);
});
test("supported delivery and an optional occasion pass validation", () => {
  assert.equal(validate({ occasion: "" }), "");
});
test("a street address is still required for delivery", () => {
  assert.match(validate({ deliveryAddress: "" }), /delivery address/i);
});
