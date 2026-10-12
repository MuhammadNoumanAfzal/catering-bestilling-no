export function hasBookableSlot(slots, time = "") {
  return Array.isArray(slots) && slots.some((slot) =>
    !slot.isFullyBooked && Number(slot.remainingCapacity ?? 9999) > 0 &&
    (!time || (time >= slot.start && time <= slot.end)),
  );
}
