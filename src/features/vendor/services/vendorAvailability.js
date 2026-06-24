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

  const selectedDate = normalizeSelectedDate(date);
  const matchesDay = selectedDate
    ? deliverySchedule.days.includes(selectedDate.getDay())
    : true;

  let matchesTime = true;
  if (time) {
    if (
      Array.isArray(deliverySchedule.slots) &&
      deliverySchedule.slots.length > 0
    ) {
      matchesTime = deliverySchedule.slots.some(
        (slot) => time >= slot.start && time <= slot.end,
      );
    } else {
      matchesTime =
        time >= deliverySchedule.start && time <= deliverySchedule.end;
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
