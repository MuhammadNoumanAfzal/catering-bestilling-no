import assert from "node:assert/strict";
import { test } from "node:test";
import { formatMoney, parseMoney } from "./formatMoney.js";
import { formatCurrency as menuCurrency } from "../menu/utils/formatters.js";
import { formatCurrency as checkoutCurrency, parseBackendAmount } from "../checkOut/components/summary/checkoutSummaryUtils.js";

test("whole kroner use the requested suffix and Norwegian grouping", () => {
  for (const format of [formatMoney, menuCurrency, checkoutCurrency]) {
    assert.equal(format(680), "680,-");
    assert.equal(format(5000), "5 000,-");
    assert.equal(format(0), "0,-");
    assert.equal(format(-680), "-680,-");
    assert.equal(format("680.00"), "680,-");
  }
});

test("real fractional amounts remain accurate", () => {
  assert.equal(formatMoney(680.5), "680,50");
  assert.equal(formatMoney(652.17), "652,17");
  assert.equal(formatMoney(679.999), "680,-");
});

test("formatted amounts and API amounts can be parsed without changing totals", () => {
  for (const value of ["5 000,-", "5\u00a0000,-", "NOK 5,000.00", "5.000,00", { amount: "5000.00" }]) {
    assert.equal(parseMoney(value), 5000);
    assert.equal(formatMoney(value), "5 000,-");
  }
  assert.equal(parseMoney("680,50"), 680.5);
  assert.equal(parseBackendAmount("5 000,-"), 5000);
  assert.equal(parseBackendAmount("680,50"), 680.5);
  assert.equal(formatMoney(NaN), "0,-");
  assert.equal(formatMoney(null), "0,-");
});
