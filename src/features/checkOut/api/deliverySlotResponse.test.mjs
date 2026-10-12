import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDeliverySlotResponse } from "./deliverySlotResponse.js";

test("missing or malformed responses are errors, not fully booked dates", () => {
  for (const response of [null, {}, { availableDeliverySlots: null },
    { availableDeliverySlots: [{ start: "10:00", end: "21:00", isFullyBooked: false }] }]) {
    assert.throws(() => parseDeliverySlotResponse(response));
  }
});
test("successful empty responses and server capacity are preserved", () => {
  assert.deepEqual(parseDeliverySlotResponse({ availableDeliverySlots: [] }), []);
  const slots = parseDeliverySlotResponse({ availableDeliverySlots: [
    { start: "10:00", end: "11:00", isFullyBooked: false, remainingCapacity: 0 },
    { start: "11:00", end: "12:00", isFullyBooked: false, remainingCapacity: 2 },
    { start: "12:00", end: "13:00", isFullyBooked: true, remainingCapacity: 2 },
  ] });
  assert.deepEqual(slots.map((slot) => slot.isFullyBooked), [true, false, true]);
});
