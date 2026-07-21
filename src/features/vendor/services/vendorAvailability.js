function normalizePostalCode(postalCode = "") {
  return `${postalCode}`.replace(/\D/g, "");
}

function normalizeLocationQuery(locationQuery = "") {
  return `${locationQuery}`.trim().toLowerCase();
}

function resolveVendorReference(vendor) {
  return vendor ?? null;
}

function resolveVendorPostalCoverage(vendor) {
  return [
    `${vendor?.primaryPostalCode ?? ""}`.trim(),
    `${vendor?.postCode ?? ""}`.trim(),
    ...((vendor?.servicePostalCodes ?? []).map((value) => `${value ?? ""}`.trim())),
  ].filter(Boolean);
}

function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

function normalizeSelectedDate(date) {
  if (!date || !isDateValid(date)) {
    return null;
  }

  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const normalizedDate = `${date}`.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    const [year, month, day] = normalizedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(normalizedDate);
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
}

function createSlotLabel(start, end) {
  return `${start} - ${end}`;
}

function normalizeSlotDay(day) {
  return `${day ?? ""}`.trim().toLowerCase();
}

function getSelectedDayCode(date) {
  const selectedDate = normalizeSelectedDate(date);

  if (!selectedDate) {
    return "";
  }

  return ["su", "mo", "tu", "we", "th", "fr", "sa"][selectedDate.getDay()] || "";
}

export function isVendorAvailableForPostalCode(vendor, postalCode) {
  const normalizedInput = normalizePostalCode(postalCode);

  if (!normalizedInput) {
    return true;
  }

  return resolveVendorPostalCoverage(vendor).some((candidate) =>
    candidate.startsWith(normalizedInput),
  );
}

export function filterVendorsByPostalCode(vendors, postalCode) {
  return vendors.filter((vendor) =>
    isVendorAvailableForPostalCode(vendor, postalCode),
  );
}

export function isVendorAvailableForLocation(vendor, locationQuery) {
  const normalizedPostalCode = normalizePostalCode(locationQuery);
  const matchedVendor = resolveVendorReference(vendor);

  if (normalizedPostalCode) {
    return isVendorAvailableForPostalCode(vendor, normalizedPostalCode);
  }

  const normalizedQuery = normalizeLocationQuery(locationQuery);

  if (!normalizedQuery) {
    return true;
  }

  return [
    vendor?.city ?? matchedVendor?.city,
    vendor?.addressLine ?? matchedVendor?.addressLine,
    vendor?.name ?? matchedVendor?.name,
  ]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function filterVendorsByLocation(vendors, locationQuery) {
  return vendors.filter((vendor) =>
    isVendorAvailableForLocation(vendor, locationQuery),
  );
}

export function filterItemsByVendorLocation(
  items,
  locationQuery,
  getVendor = (item) => item?.vendor ?? null,
) {
  return items.filter((item) => {
    const vendor = getVendor(item);

    return vendor ? isVendorAvailableForLocation(vendor, locationQuery) : true;
  });
}

export function isVendorDeliverySlotAvailable(vendor, date, time) {
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;

  if (!deliverySchedule) {
    return true;
  }

  const hasConfiguredDays = Array.isArray(deliverySchedule.days) && deliverySchedule.days.length > 0;
  const hasConfiguredSlots =
    Array.isArray(deliverySchedule.slots) && deliverySchedule.slots.length > 0;
  const hasConfiguredRange =
    `${deliverySchedule.start ?? ""}`.trim() && `${deliverySchedule.end ?? ""}`.trim();

  const selectedDate = normalizeSelectedDate(date);
  if (selectedDate && !hasConfiguredDays) {
    return false;
  }

  if (time && !hasConfiguredSlots && !hasConfiguredRange) {
    return false;
  }

  const matchesDay = selectedDate
    ? deliverySchedule.days.includes(selectedDate.getDay())
    : true;

  let matchesTime = true;
  if (time) {
    if (hasConfiguredSlots) {
      const selectedDayCode = getSelectedDayCode(date);
      matchesTime = deliverySchedule.slots.some(
        (slot) => {
          const slotDay = normalizeSlotDay(slot?.day);
          const matchesSlotDay = selectedDayCode ? !slotDay || slotDay === selectedDayCode : true;
          return matchesSlotDay && time >= slot.start && time <= slot.end;
        },
      );
    } else if (hasConfiguredRange) {
      matchesTime =
        time >= deliverySchedule.start && time <= deliverySchedule.end;
    } else {
      matchesTime = false;
    }
  }

  return matchesDay && matchesTime;
}

export function filterVendorsByDeliverySlot(vendors, date, time) {
  if (!date && !time) {
    return vendors;
  }

  return vendors.filter((vendor) =>
    isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

export function getAvailableVendorsForSlot(
  vendors,
  date,
  time,
  excludedVendorSlug,
) {
  return (vendors ?? []).filter(
    (vendor) =>
      vendor.slug !== excludedVendorSlug &&
      isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

export function getConfiguredDeliverySlotsForDate(vendor, date) {
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;
  const selectedDate = normalizeSelectedDate(date);

  if (!deliverySchedule || !selectedDate) {
    return [];
  }

  const hasMatchingDay =
    Array.isArray(deliverySchedule.days) &&
    deliverySchedule.days.includes(selectedDate.getDay());

  if (!hasMatchingDay) {
    return [];
  }

  const configuredSlots = Array.isArray(deliverySchedule.slots)
    ? deliverySchedule.slots
    : [];
  const selectedDayCode = getSelectedDayCode(date);

  return configuredSlots
    .filter((slot) => {
      const slotDay = normalizeSlotDay(slot?.day);
      return (
        `${slot?.start ?? ""}`.trim() &&
        `${slot?.end ?? ""}`.trim() &&
        (!slotDay || slotDay === selectedDayCode)
      );
    })
    .map((slot) => ({
      start: slot.start,
      end: slot.end,
      label: createSlotLabel(slot.start, slot.end),
      isFullyBooked: false,
      remainingCapacity: 9999,
    }));
}
