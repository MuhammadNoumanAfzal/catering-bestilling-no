import {
  formatCategoryLabel,
  getCategoryParamValue,
  matchesCategorySelection,
} from "../../browse/utils/categoryFilters";
import {
  matchesDietaryFilter,
  matchesOfferFilter,
  matchesOtherFilters,
  matchesPricingFilter,
  matchesRatingFilter,
  sortCatalogItems,
} from "../../browse/utils/catalogFilters";
import {
  filterItemsByVendorLocation,
  filterVendorsByDeliverySlot,
  filterVendorsByLocation,
  getVendorProfileBySlug,
  isVendorDeliverySlotAvailable,
} from "../../vendor/data/vendorData";

export function buildCategoryQuery(selectedCategory) {
  const categoryValue = getCategoryParamValue(selectedCategory);
  return categoryValue ? `?category=${encodeURIComponent(categoryValue)}` : "";
}

export function normalizePostalCode(value) {
  return `${value ?? ""}`.replace(/\D/g, "").slice(0, 4);
}

export function normalizeSearchQuery(value) {
  return `${value ?? ""}`.trim().toLowerCase();
}

export function buildLocationFilter({
  postalCode,
  deliveryAddress,
  locationValue,
}) {
  return normalizePostalCode(postalCode) || deliveryAddress.trim() || locationValue;
}

export function matchesSearchText(searchableValues, searchQuery) {
  if (!searchQuery) {
    return true;
  }

  return searchableValues
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(searchQuery);
}

export function matchesGuestRange(item, attendeeCount) {
  if (attendeeCount <= 0) {
    return true;
  }

  const minimumGuests = item.minimumGuests ?? 0;
  const maximumGuests = item.maximumGuests ?? Number.POSITIVE_INFINITY;
  return attendeeCount >= minimumGuests && attendeeCount <= maximumGuests;
}

export function filterHomePreviewMenuItems(items, filters) {
  const {
    attendeeCount,
    category,
    deliveryDate,
    deliveryTime,
    locationFilter,
    otherFilters,
    searchQuery,
    selectedDietary,
    selectedOffers,
    selectedPricing,
    selectedRating,
    selectedSort,
  } = filters;

  return sortCatalogItems(
    filterItemsByVendorLocation(items, locationFilter).filter((item) => {
      const vendor = getVendorProfileBySlug(item.vendorSlug);

      return (
        matchesCategorySelection(item.categoryTags, category) &&
        matchesGuestRange(item, attendeeCount) &&
        matchesSearchText(
          [
            item.title,
            item.vendor,
            item.description,
            ...(item.categoryTags ?? []),
            ...(item.dietaryTags ?? []),
            ...(item.offerTags ?? []),
          ],
          searchQuery,
        ) &&
        matchesRatingFilter(item.rating, selectedRating) &&
        matchesDietaryFilter(item, selectedDietary) &&
        matchesOfferFilter(item, selectedOffers) &&
        matchesPricingFilter(item, selectedPricing) &&
        matchesOtherFilters(item, otherFilters) &&
        isVendorDeliverySlotAvailable(vendor, deliveryDate, deliveryTime)
      );
    }),
    selectedSort,
  );
}

export function filterHomeVendors(vendors, filters) {
  const {
    category,
    deliveryDate,
    deliveryTime,
    locationFilter,
    searchQuery,
  } = filters;

  return filterVendorsByDeliverySlot(
    filterVendorsByLocation(vendors, locationFilter),
    deliveryDate,
    deliveryTime,
  ).filter((vendor) => {
    return (
      matchesCategorySelection(vendor.categoryTags, category) &&
      matchesSearchText(
        [
          vendor.name,
          vendor.deliveryFee,
          vendor.discount,
          ...(vendor.categoryTags ?? []),
        ],
        searchQuery,
      )
    );
  });
}

export function filterHomeProducts(products, filters) {
  const { category, deliveryDate, deliveryTime, locationFilter, searchQuery } =
    filters;

  return filterItemsByVendorLocation(products, locationFilter).filter(
    (product) => {
      const vendor = getVendorProfileBySlug(product.vendorSlug);

      return (
        matchesCategorySelection(product.categoryTags, category) &&
        matchesSearchText(
          [
            product.name,
            product.vendorName,
            product.discount,
            ...(product.categoryTags ?? []),
          ],
          searchQuery,
        ) &&
        isVendorDeliverySlotAvailable(vendor, deliveryDate, deliveryTime)
      );
    },
  );
}

export function filterVendorListingItems(vendors, { category, locationValue, searchQuery }) {
  return filterVendorsByLocation(vendors, locationValue).filter((vendor) => {
    if (!matchesCategorySelection(vendor.categoryTags, category)) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    return matchesSearchText(
      [
        vendor.name,
        vendor.cuisine,
        vendor.addressLine,
        vendor.city,
        ...(vendor.categoryTags ?? []),
      ],
      searchQuery,
    );
  });
}

export function filterProductListingItems(
  products,
  { category, locationValue, searchQuery },
) {
  return filterItemsByVendorLocation(products, locationValue).filter((product) => {
    if (!matchesCategorySelection(product.categoryTags, category)) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    return matchesSearchText(
      [
        product.name,
        product.title,
        product.description,
        product.vendorName,
        ...(product.categoryTags ?? []),
      ],
      searchQuery,
    );
  });
}

export function buildHomeSectionTitle(kind, activeCategoryLabel) {
  if (!activeCategoryLabel) {
    return kind;
  }

  if (kind === "Popular Vendors") {
    return `Popular ${activeCategoryLabel} Vendors`;
  }

  if (kind === "Featured Vendors") {
    return `Featured ${activeCategoryLabel} Vendors`;
  }

  if (kind === "Popular Products") {
    return `Popular ${activeCategoryLabel} Products`;
  }

  return kind;
}

export function buildAvailabilityEmptyMessage({
  activeCategoryLabel,
  locationFilter,
  type,
}) {
  const typeLabel = type === "products" ? "products" : "vendors";

  if (activeCategoryLabel) {
    return `No ${typeLabel} are currently available for ${activeCategoryLabel}${locationFilter ? ` in ${locationFilter}` : ""}.`;
  }

  if (locationFilter) {
    return `No ${typeLabel} are currently available for ${locationFilter}.`;
  }

  return undefined;
}

export function buildActiveCategoryLabel(category) {
  return formatCategoryLabel(category);
}
