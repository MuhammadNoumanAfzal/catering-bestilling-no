import assert from "node:assert/strict";
import { test } from "node:test";
import { hasBookableSlot } from "./bookingAvailability.js";
import { filterDeliverySlotsForDate } from "./vendorAvailability.js";

const vendor = { availability: { delivery: { days: [0,1,2,3,4,5,6], slots: [{ start: "10:00", end: "21:00" }] } } };
const slot = { start: "10:00", end: "21:00", remainingCapacity: 1, isFullyBooked: false };
test("fully booked and zero-capacity windows cannot be booked", () => {
  assert.equal(hasBookableSlot([{ ...slot, isFullyBooked: true }], "12:00"), false);
  assert.equal(hasBookableSlot([{ ...slot, remainingCapacity: 0 }], "12:00"), false);
  assert.equal(hasBookableSlot([{ ...slot, remainingCapacity: -1 }]), false);
});
test("live empty results remain unavailable rather than becoming scheduled slots", () => {
  assert.equal(hasBookableSlot(filterDeliverySlotsForDate([], vendor, "2099-10-17")), false);
});
test("date-only availability requires at least one bookable window", () => {
  assert.equal(hasBookableSlot([slot]), true);
  assert.equal(hasBookableSlot([{ ...slot, isFullyBooked: true }, slot]), true);
  assert.equal(hasBookableSlot([]), false);
});
test("a selected time must belong to an available window", () => {
  assert.equal(hasBookableSlot([slot], "12:00"), true);
  assert.equal(hasBookableSlot([slot], "09:00"), false);
  assert.equal(hasBookableSlot([slot], "22:00"), false);
});

test("API seconds and schedule minutes refer to the same delivery window", () => {
  const slots = filterDeliverySlotsForDate(
    [{ ...slot, start: "10:00:00", end: "21:00:00" }], vendor, "2099-10-17",
  );
  assert.equal(slots.length, 1);
  assert.equal(slots[0].start, "10:00");
  assert.equal(hasBookableSlot(slots, "12:00"), true);
});

test("live sub-windows keep capacity without extending configured hours", () => {
  const slots = filterDeliverySlotsForDate([
    { ...slot, start: "12:00", end: "14:00", remainingCapacity: 0, isFullyBooked: true },
    { ...slot, start: "14:00", end: "16:00" },
    { ...slot, start: "09:00", end: "11:00" },
  ], vendor, "2099-10-17");
  assert.equal(slots.length, 2);
  assert.equal(hasBookableSlot(slots, "12:30"), false);
  assert.equal(hasBookableSlot(slots, "15:00"), true);
});

test("lead-time adjusted provisional slots survive a second schedule filter", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date(2026, 9, 11, 12).getTime() });
  const noticeVendor = { ...vendor, minimumOrderNoticeHours: 1 };
  const once = filterDeliverySlotsForDate([slot], noticeVendor, "2026-10-11");
  assert.equal(once[0].start, "13:00");
  const twice = filterDeliverySlotsForDate(once, noticeVendor, "2026-10-11");
  assert.equal(twice.length, 1);
  assert.equal(hasBookableSlot(twice), true);
});
