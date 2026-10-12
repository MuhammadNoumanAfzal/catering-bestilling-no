import { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { fetchAvailableDeliverySlots } from "../../checkOut/api";
import { hasBookableSlot } from "../services/bookingAvailability";

export function useBookingCalendar(vendors, month, enabled) {
  const { isLoggedIn } = useAuth();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const key = JSON.stringify((vendors || []).filter(Boolean).map((vendor) => ({
    id: vendor.id, availability: vendor.availability,
    minimumOrderNoticeHours: vendor.minimumOrderNoticeHours, specialClosures: vendor.specialClosures,
  })));
  const [availability, setAvailability] = useState({ key: "", dates: {} });
  const requestKey = `${key}:${year}-${monthIndex}:${isLoggedIn}`;
  useEffect(() => {
    const bookingVendors = JSON.parse(key);
    if (!enabled || !bookingVendors.length) return;
    setAvailability({ key: requestKey, dates: {} });
    let cancelled = false;
    let nextDay = 1;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    async function worker() {
      while (!cancelled && nextDay <= lastDay) {
        const day = nextDay++;
        const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        let available = new Date(year, monthIndex, day) >= today;
        for (const vendor of bookingVendors) {
          if (available === false || cancelled) break;
          try {
            const slots = await fetchAvailableDeliverySlots({ vendorId: vendor.id, date });
            if (!hasBookableSlot(slots)) available = false;
          } catch {
            // Unknown capacity permits date inspection, never slot booking.
            available = undefined;
          }
        }
        if (!cancelled) setAvailability((current) => ({
          key: requestKey,
          dates: { ...(current.key === requestKey ? current.dates : {}), [date]: available },
        }));
      }
    }
    // Bound concurrent requests while loading the visible month.
    void Promise.all(Array.from({ length: 3 }, () => worker()));
    return () => { cancelled = true; };
  // Vendor ids and visible month identify this request; changing vendor data refreshes it.
  }, [enabled, key, year, monthIndex, requestKey, isLoggedIn]);
  return availability.key === requestKey ? availability.dates : {};
}
