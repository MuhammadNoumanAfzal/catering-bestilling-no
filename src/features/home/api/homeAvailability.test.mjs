import assert from "node:assert/strict";
import { test } from "node:test";
import { FETCH_HOME_DATA_QUERY } from "./homeQueries.js";
import { filterVendorsByDeliverySlot } from "../../vendor/services/vendorAvailability.js";

test("all home vendor selections request complete availability settings", () => {
  assert.equal((FETCH_HOME_DATA_QUERY.match(/minimumOrderNoticeHours/g) || []).length, 5);
  assert.equal((FETCH_HOME_DATA_QUERY.match(/specialClosures\s*\{/g) || []).length, 5);
  assert.equal((FETCH_HOME_DATA_QUERY.match(/deliveryTimeSlots\s*\{\s*day/g) || []).length, 5);
});

test("vendor results respect minimum notice for date-only and timed searches", (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date(2026, 9, 8, 9).getTime() });
  const schedule = { days: [0, 1, 2, 3, 4, 5, 6], slots: [{ start: "10:00", end: "21:00" }] };
  const gastronomen = { id: "g", minimumOrderNoticeHours: 48, availability: { delivery: schedule } };
  const nordisk = { id: "n", minimumOrderNoticeHours: 0, availability: { delivery: schedule } };
  const vendors = [gastronomen, nordisk];
  assert.deepEqual(filterVendorsByDeliverySlot(vendors, "2026-10-09", ""), [nordisk]);
  assert.deepEqual(filterVendorsByDeliverySlot(vendors, "2026-10-09", "17:30"), [nordisk]);
  assert.deepEqual(filterVendorsByDeliverySlot(vendors, "2026-10-10", ""), vendors);
  assert.deepEqual(filterVendorsByDeliverySlot(vendors, "", ""), vendors);
});

test("closed dates and slot weekdays are excluded from vendor results", () => {
  const vendor = {
    availability: { delivery: { days: [5, 6], slots: [{ day: "fr", start: "10:00", end: "21:00" }] } },
    specialClosures: [{ startDate: "2099-10-09", endDate: "2099-10-09", status: "active" }],
  };
  assert.deepEqual(filterVendorsByDeliverySlot([vendor], "2099-10-09", ""), []);
  assert.deepEqual(filterVendorsByDeliverySlot([vendor], "2099-10-10", ""), []);
});
