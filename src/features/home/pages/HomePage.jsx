import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import FoodBrowsePreviewSection from "../components/FoodBrowsePreviewSection";
import HowItWorksSection from "../components/HowItWorksSection";
import VendorShowcaseSection from "../components/VendorShowcaseSection";
import ProductShowcaseSection from "../components/ProductShowcaseSection";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import {
  filterItemsByVendorLocation,
  filterVendorsByDeliverySlot,
  filterVendorsByLocation,
  getVendorProfileBySlug,
  isVendorDeliverySlotAvailable,
} from "../../vendor/data/vendorData";
import {
  featuredVendors,
  popularProducts,
  popularVendors,
} from "../data/homeData";
import { foodTypeMenuItems } from "../../browse/data/browseData";
import {
  formatCategoryLabel,
  getCategoryParamValue,
  matchesCategorySelection,
  normalizeCategorySelection,
} from "../../browse/utils/categoryFilters";

function buildCategoryQuery(selectedCategory) {
  const categoryValue = getCategoryParamValue(selectedCategory);
  return categoryValue ? `?category=${encodeURIComponent(categoryValue)}` : "";
}

function matchesSearchText(searchableValues, searchQuery) {
  if (!searchQuery) {
    return true;
  }

  return searchableValues
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(searchQuery);
}

function matchesGuestRange(item, attendeeCount) {
  if (attendeeCount <= 0) {
    return true;
  }

  const minimumGuests = item.minimumGuests ?? 0;
  const maximumGuests = item.maximumGuests ?? Number.POSITIVE_INFINITY;

  return attendeeCount >= minimumGuests && attendeeCount <= maximumGuests;
}

export default function HomePage() {
  const navigate = useNavigate();
  const {
    attendeeCount,
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    locationValue,
    searchQuery,
    setDeliveryAddress,
  } = useBrowseFilters();
  const [postalCode, setPostalCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const normalizedPostalCode = postalCode.replace(/\D/g, "").slice(0, 4);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const normalizedCategoryFilter = normalizeCategorySelection(selectedCategory);
  const activeCategoryLabel = formatCategoryLabel(normalizedCategoryFilter);
  const activeHomeLocationFilter =
    normalizedPostalCode || deliveryAddress.trim() || locationValue;
  const menuQuery = buildCategoryQuery(normalizedCategoryFilter);

  const filteredMenuItems = useMemo(
    () =>
      filterItemsByVendorLocation(foodTypeMenuItems, activeHomeLocationFilter).filter(
        (item) => {
          const vendor = getVendorProfileBySlug(item.vendorSlug);

          return (
            matchesCategorySelection(item.categoryTags, normalizedCategoryFilter) &&
            matchesGuestRange(item, attendeeCount) &&
            matchesSearchText(
              [item.title, item.vendor, item.description, ...(item.categoryTags ?? [])],
              normalizedSearchQuery,
            ) &&
            isVendorDeliverySlotAvailable(vendor, deliveryDate, deliveryTime)
          );
        },
      ),
    [
      activeHomeLocationFilter,
      attendeeCount,
      deliveryDate,
      deliveryTime,
      normalizedCategoryFilter,
      normalizedSearchQuery,
    ],
  );
  const previewMenuItems = useMemo(
    () => filteredMenuItems.slice(0, 6),
    [filteredMenuItems],
  );

  const filteredPopularVendors = useMemo(
    () =>
      filterVendorsByDeliverySlot(
        filterVendorsByLocation(popularVendors, activeHomeLocationFilter),
        deliveryDate,
        deliveryTime,
      ).filter((vendor) => {
        return (
          matchesCategorySelection(vendor.categoryTags, normalizedCategoryFilter) &&
          matchesSearchText(
            [vendor.name, vendor.deliveryFee, vendor.discount, ...(vendor.categoryTags ?? [])],
            normalizedSearchQuery,
          )
        );
      }),
    [
      activeHomeLocationFilter,
      deliveryDate,
      deliveryTime,
      normalizedCategoryFilter,
      normalizedSearchQuery,
    ],
  );
  const filteredFeaturedVendors = useMemo(
    () =>
      filterVendorsByDeliverySlot(
        filterVendorsByLocation(featuredVendors, activeHomeLocationFilter),
        deliveryDate,
        deliveryTime,
      ).filter((vendor) => {
        return (
          matchesCategorySelection(vendor.categoryTags, normalizedCategoryFilter) &&
          matchesSearchText(
            [vendor.name, vendor.deliveryFee, vendor.discount, ...(vendor.categoryTags ?? [])],
            normalizedSearchQuery,
          )
        );
      }),
    [
      activeHomeLocationFilter,
      deliveryDate,
      deliveryTime,
      normalizedCategoryFilter,
      normalizedSearchQuery,
    ],
  );
  const filteredPopularProducts = useMemo(
    () =>
      filterItemsByVendorLocation(
        popularProducts,
        activeHomeLocationFilter,
      ).filter((product) => {
        const vendor = getVendorProfileBySlug(product.vendorSlug);

        return (
          matchesCategorySelection(product.categoryTags, normalizedCategoryFilter) &&
          matchesSearchText(
            [product.name, product.vendorName, product.discount, ...(product.categoryTags ?? [])],
            normalizedSearchQuery,
          ) &&
          isVendorDeliverySlotAvailable(vendor, deliveryDate, deliveryTime)
        );
      }),
    [
      activeHomeLocationFilter,
      deliveryDate,
      deliveryTime,
      normalizedCategoryFilter,
      normalizedSearchQuery,
    ],
  );
  const availableVendorCount =
    filteredPopularVendors.length + filteredFeaturedVendors.length;

  return (
    <div>
      <HeroSection
        deliveryAddress={deliveryAddress}
        onDeliveryAddressChange={setDeliveryAddress}
        postalCode={normalizedPostalCode}
        onPostalCodeChange={setPostalCode}
        availableVendorCount={availableVendorCount}
      />
      <FoodBrowsePreviewSection
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        previewItems={previewMenuItems}
        totalItems={filteredMenuItems.length}
        activeCategoryLabel={activeCategoryLabel}
        onSeeAllClick={() => navigate(`/browse/food-type${menuQuery}`)}
      />
      <VendorShowcaseSection
        title={
          activeCategoryLabel
            ? `Popular ${activeCategoryLabel} Vendors`
            : "Popular Vendors"
        }
        vendors={filteredPopularVendors}
        emptyMessage={
          activeCategoryLabel
            ? `No popular vendors are currently available for ${activeCategoryLabel}${activeHomeLocationFilter ? ` in ${activeHomeLocationFilter}` : ""}.`
            : activeHomeLocationFilter
              ? `No popular vendors are currently available for ${activeHomeLocationFilter}.`
              : undefined
        }
        onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
      />
      <VendorShowcaseSection
        title={
          activeCategoryLabel
            ? `Featured ${activeCategoryLabel} Vendors`
            : "Featured Vendors"
        }
        vendors={filteredFeaturedVendors}
        emptyMessage={
          activeCategoryLabel
            ? `No featured vendors are currently available for ${activeCategoryLabel}${activeHomeLocationFilter ? ` in ${activeHomeLocationFilter}` : ""}.`
            : activeHomeLocationFilter
              ? `No featured vendors are currently available for ${activeHomeLocationFilter}.`
              : undefined
        }
        onSeeAllClick={() => navigate(`/vendors/featured${menuQuery}`)}
      />
      <ProductShowcaseSection
        title={
          activeCategoryLabel
            ? `Popular ${activeCategoryLabel} Products`
            : "Popular Products"
        }
        products={filteredPopularProducts}
        emptyMessage={
          activeCategoryLabel
            ? `No products are available for ${activeCategoryLabel}${activeHomeLocationFilter ? ` in ${activeHomeLocationFilter}` : ""}.`
            : activeHomeLocationFilter
              ? `No products are currently available for ${activeHomeLocationFilter}.`
              : undefined
        }
        onSeeAllClick={() => navigate(`/products/popular${menuQuery}`)}
      />
      <HowItWorksSection />
    </div>
  );
}
