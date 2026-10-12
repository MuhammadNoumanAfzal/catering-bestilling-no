import assert from "node:assert/strict";
import { test } from "node:test";
import { getMissingCheckoutDetails } from "./missingCheckoutDetails.js";
const complete = {
  companyName: "Company", organizationNumber: "123456789", phone: "12345678",
  email: "client@example.com", deliveryAddress: "Street 1", deliveryPostalCode: "0150",
  deliveryCity: "Oslo", invoiceSameAsDelivery: true, date: "2026-10-18", time: "10:00",
};
test("shows all missing fields and removes each independently as it is filled", () => {
  const form = { ...complete, companyName: "", organizationNumber: "", deliveryAddress: "" };
  assert.deepEqual(getMissingCheckoutDetails(form, "corporate").map((item) => item.field),
    ["companyName", "organizationNumber", "deliveryAddress"]);
  assert.deepEqual(getMissingCheckoutDetails({ ...form, companyName: "Company" }, "corporate").map((item) => item.field),
    ["organizationNumber", "deliveryAddress"]);
  assert.deepEqual(getMissingCheckoutDetails(complete, "corporate"), []);
});
test("private checkout and separate invoice addresses have their own prompts", () => {
  const missing = getMissingCheckoutDetails({ ...complete, invoiceSameAsDelivery: false }, "private");
  assert.deepEqual(missing.map((item) => item.field),
    ["firstName", "lastName", "invoiceAddress", "invoicePostalCode", "invoiceCity"]);
});
