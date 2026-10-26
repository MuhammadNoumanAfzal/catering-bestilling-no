import test from "node:test";
import assert from "node:assert/strict";
import { normalizeModifyOrderTime } from "./modifyOrderTime.js";
test("saved API times with seconds remain valid in modification forms", () => {
  for (const value of ["10:00", "10:00:00", "10:00:30", "10:00:00.000"]) {
    assert.equal(normalizeModifyOrderTime(value), "10:00");
  }
  assert.equal(normalizeModifyOrderTime("9:05:00"), "09:05");
});
test("invalid delivery times are rejected rather than silently replaced", () => {
  for (const value of ["", "25:00", "12:60", "10:00:99", "invalid"]) {
    assert.equal(normalizeModifyOrderTime(value), "");
  }
});
