import assert from "node:assert/strict";
import { test } from "node:test";
import { buildInvoiceRows, mapInvoiceApiRows, resolveInvoiceAmount } from "./invoiceAmounts.js";
import { formatInvoiceDeliveryAddress } from "./invoiceDeliveryAddress.js";
test("menus and add-ons have separate quantities and consistent amounts", () => {
  const rows = buildInvoiceRows({ items: [{ id: "1", productName: "Tapas", quantity: 148, unitPrice: 700,
    lineSubtotal: 103600, lineTotal: 106270, selectedAddons: [{ name: "Crema catalana", quantity: 30, unitPrice: 89, totalPrice: 2670 }] }] });
  assert.equal(rows[0].totalPrice, 103600);
  assert.equal(rows[1].label, "Crema catalana");
  assert.equal(rows[1].quantity, 30);
  assert.equal(rows[1].totalPrice, 2670);
  assert.equal(rows.reduce((sum, row) => sum + row.totalPrice, 0), 106270);
});
test("invoice amount is used directly, without order or local overrides", () => {
  assert.equal(resolveInvoiceAmount({ grandTotal: { amount: "22881.60" }, order: { finalPrice: 22742.28 } }), 22881.60);
  assert.equal(resolveInvoiceAmount({ grandTotal: { amount: "0" }, order: { finalPrice: 500 } }), 0);
});
test("stored add-on prices are preserved without speculative VAT conversion", () => {
  const order = { finalPrice: 22881.60, personCount: 30, pricing: { taxRate: 0.15, tipAmount: 3813.60 },
    items: [{ quantity: 1, pricingType: "per_person", unitPrice: 600, lineTotal: 18928.68,
      selectedAddons: [{ name: "Crema catalana", quantity: 12, unitPrice: 77.39, totalPrice: 928.68 }] }] };
  const rows = buildInvoiceRows(order);
  assert.equal(rows[0].quantity, 30);
  assert.equal(rows[0].totalPrice, 18000);
  assert.equal(rows[1].unitPrice, 77.39);
  assert.equal(rows[1].totalPrice, 928.68);
  assert.equal(rows.reduce((sum, row) => sum + row.totalPrice, 0) + 3813.60, 22742.28);
  assert.equal(buildInvoiceRows({ ...order, finalPrice: 25000 })[1].unitPrice, 77.39);
});
test("explicit per-person pricing survives menu line totals that include add-ons", () => {
  const rows = buildInvoiceRows({ personCount: 30, items: [{ quantity: 1, pricingType: "per_person", unitPrice: 600, lineSubtotal: 18000, lineTotal: 19068 }] });
  assert.equal(rows[0].quantity, 30);
  assert.equal(rows[0].totalPrice, 18000);
});
test("updated backend rows preserve the verified gross financial case", () => {
  const rows = mapInvoiceApiRows([
    { id: "menu", label: "Tapas Gourmet", quantity: 30, unitPrice: "600.00", totalPrice: "18000.00" },
    { id: "addon", label: "Crema catalana", quantity: 12, unitPrice: "89.00", totalPrice: "1068.00" },
  ]);
  assert.equal(rows[0].quantity, 30);
  assert.equal(rows[1].unitPrice, 89);
  assert.equal(rows[1].totalPrice, 1068);
  assert.equal(rows.reduce((sum, row) => sum + row.totalPrice, 0) + 3813.60, 22881.60);
});
test("one per-person order is displayed as thirty billed units without changing money", () => {
  const rows = mapInvoiceApiRows([
    { quantity: 1, unitPrice: "600", totalPrice: "18000" },
    { quantity: 12, unitPrice: "89", totalPrice: "1068" },
  ], { personCount: 30 });
  assert.equal(rows[0].quantity, 30);
  assert.equal(rows[0].totalPrice, 18000);
  assert.equal(rows[1].quantity, 12);
});
test("delivery address uses street followed by postal code and city", () => {
  assert.equal(formatInvoiceDeliveryAddress({ deliveryAddress: "Karl Johans gate 15", deliverySuite: "2. etasje",
    deliveryPostalCode: "0154", deliveryCity: "Oslo", deliveryAddressStr: "Old duplicate city" }),
    "Karl Johans gate 15, 2. etasje\n0154 Oslo");
  assert.equal(formatInvoiceDeliveryAddress({ deliveryAddressStr: "Legacy address" }), "Legacy address");
});
test("guest-based quantities already stored as units are not multiplied again", () => {
  const rows = buildInvoiceRows({ personCount: 148, items: [{ quantity: 148, pricingType: "per_person", unitPrice: 700, lineTotal: 103600 }] });
  assert.equal(rows[0].quantity, 148);
  assert.equal(rows[0].totalPrice, 103600);
});
test("per-person menu shows billed guest units, not one order for twenty guests", () => {
  const rows = buildInvoiceRows({ personCount: 20, items: [{ quantity: 1, unitPrice: 100, lineTotal: 2000 }] });
  assert.equal(rows[0].quantity, 20);
  assert.equal(rows[0].totalPrice, 2000);
});
