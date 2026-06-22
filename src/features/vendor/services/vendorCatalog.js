import { fallbackVendorProfiles } from "../data/fallbackVendorCatalog";

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getFallbackVendorProfiles() {
  return fallbackVendorProfiles;
}

export function getFallbackVendorProfileBySlug(slug) {
  return fallbackVendorProfiles.find((vendor) => vendor.slug === slug) ?? null;
}

export function getFallbackVendorProfileByName(name) {
  const normalizedName = slugify(name);
  return (
    fallbackVendorProfiles.find((vendor) => vendor.slug === normalizedName) ??
    null
  );
}

export function getFallbackVendorMenuItemById(vendorSlug, itemId) {
  const vendor = getFallbackVendorProfileBySlug(vendorSlug);

  if (!vendor) {
    return null;
  }

  return (
    vendor.menuSections
      .flatMap((section) => section.items)
      .find((item) => item.id === itemId) ?? null
  );
}
