const SAVED_VENDORS_STORAGE_KEY = "saved-vendor-slugs";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readSavedVendorSlugs() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const savedValue = window.localStorage.getItem(SAVED_VENDORS_STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeSavedVendorSlugs(slugs) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    SAVED_VENDORS_STORAGE_KEY,
    JSON.stringify(slugs),
  );
}

export function isVendorSaved(vendorSlug) {
  return readSavedVendorSlugs().includes(vendorSlug);
}

export function toggleSavedVendor(vendorSlug) {
  const savedSlugs = readSavedVendorSlugs();
  const nextSlugs = savedSlugs.includes(vendorSlug)
    ? savedSlugs.filter((slug) => slug !== vendorSlug)
    : [...savedSlugs, vendorSlug];

  writeSavedVendorSlugs(nextSlugs);

  return nextSlugs.includes(vendorSlug);
}
