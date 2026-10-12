export function parseDeliverySlotResponse(response) {
  const slots = response?.availableDeliverySlots;
  if (!Array.isArray(slots)) throw new Error("Invalid delivery availability response.");
  return slots.map((slot) => {
    const capacity = Number(slot?.remainingCapacity);
    if (!slot?.start || !slot?.end || typeof slot.isFullyBooked !== "boolean" ||
        slot.remainingCapacity == null || !Number.isFinite(capacity) || capacity < 0) {
      throw new Error("Invalid delivery slot data.");
    }
    return {
      start: slot.start, end: slot.end, label: `${slot.start} – ${slot.end}`,
      isFullyBooked: slot.isFullyBooked || capacity === 0,
      remainingCapacity: capacity,
    };
  });
}
