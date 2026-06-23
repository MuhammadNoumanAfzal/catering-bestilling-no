import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { normalizeCategorySelection } from "../../browse/utils/categoryFilters";
import {
  FoodBrowsePreviewSection,
  HeroSection,
  HowItWorksSection,
  ProductShowcaseSection,
  VendorShowcaseSection,
} from "../components";
import { useHomeData } from "../hooks/useHomeData";
import {
  buildActiveCategoryLabel,
  buildAvailabilityEmptyMessage,
  buildCategoryQuery,
  buildHomeSectionTitle,
  buildLocationFilter,
  filterHomePreviewMenuItems,
  filterHomeProducts,
  filterHomeVendors,
  normalizePostalCode,
  normalizeSearchQuery,
} from "../utils/homeCatalog";

function extractAreaName(address) {
  const trimmedAddress = `${address ?? ""}`.trim();

  if (!trimmedAddress) {
    return "";
  }

  const segments = trimmedAddress
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    const lastSegment = segments.at(-1)?.toLowerCase() ?? "";

    if (["norway", "norge"].includes(lastSegment)) {
      return segments.at(-2) ?? trimmedAddress;
    }
  }

  return segments.at(-1) ?? trimmedAddress;
}

export default function HomePage() {
  const navigate = useNavigate();
  const {
    attendeeCount,
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    locationValue,
    otherFilters,
    searchQuery,
    selectedDietary,
    selectedOffers,
    selectedPricing,
    selectedRating,
    selectedSort,
    setDeliveryAddress,
    setLocationValue,
  } = useBrowseFilters();
  const [postalCode, setPostalCode] = useState("");
  const [draftDeliveryAddress, setDraftDeliveryAddress] = useState(deliveryAddress);
  const [appliedSearchFilters, setAppliedSearchFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { popularVendors, featuredVendors, popularProducts } =
    useHomeData(appliedSearchFilters);
  const normalizedPostalCode = normalizePostalCode(postalCode);
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const normalizedCategoryFilter = normalizeCategorySelection(selectedCategory);
  const activeCategoryLabel = buildActiveCategoryLabel(normalizedCategoryFilter);
  const activeHomeLocationFilter = buildLocationFilter({
    postalCode: normalizedPostalCode,
    deliveryAddress: draftDeliveryAddress,
    locationValue,
  });
  const menuQuery = buildCategoryQuery(normalizedCategoryFilter);

  const handleHomeSearch = () => {
    const nextPostalCode = normalizePostalCode(postalCode);
    const nextAreaName = nextPostalCode ? "" : extractAreaName(draftDeliveryAddress);

    setDeliveryAddress(draftDeliveryAddress.trim());
    setLocationValue(nextPostalCode || nextAreaName);
    setAppliedSearchFilters({
      postCode: nextPostalCode || undefined,
      areaName: nextAreaName || undefined,
    });
  };
  const sharedFilters = useMemo(
    () => ({
      attendeeCount,
      category: normalizedCategoryFilter,
      deliveryDate,
      deliveryTime,
      locationFilter: activeHomeLocationFilter,
      otherFilters,
      searchQuery: normalizedSearchQuery,
      selectedDietary,
      selectedOffers,
      selectedPricing,
      selectedRating,
      selectedSort,
    }),
    [
      activeHomeLocationFilter,
      attendeeCount,
      deliveryDate,
      deliveryTime,
      normalizedCategoryFilter,
      normalizedSearchQuery,
      otherFilters,
      selectedDietary,
      selectedOffers,
      selectedPricing,
      selectedRating,
      selectedSort,
    ],
  );

  const filteredMenuItems = useMemo(
    () => filterHomePreviewMenuItems(popularProducts, sharedFilters),
    [popularProducts, sharedFilters],
  );
  const previewMenuItems = useMemo(
    () => filteredMenuItems.slice(0, 6),
    [filteredMenuItems],
  );

  const filteredPopularVendors = useMemo(
    () => filterHomeVendors(popularVendors, sharedFilters),
    [popularVendors, sharedFilters],
  );
  const filteredFeaturedVendors = useMemo(
    () => filterHomeVendors(featuredVendors, sharedFilters),
    [featuredVendors, sharedFilters],
  );
  const filteredPopularProducts = useMemo(
    () => filterHomeProducts(popularProducts, sharedFilters),
    [popularProducts, sharedFilters],
  );
  const availableVendorCount =
    filteredPopularVendors.length + filteredFeaturedVendors.length;

  return (
    <div>
      <HeroSection
        deliveryAddress={draftDeliveryAddress}
        onDeliveryAddressChange={setDraftDeliveryAddress}
        postalCode={normalizedPostalCode}
        onPostalCodeChange={setPostalCode}
        availableVendorCount={availableVendorCount}
        onSearch={handleHomeSearch}
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
        title={buildHomeSectionTitle("Popular Vendors", activeCategoryLabel)}
        vendors={filteredPopularVendors}
        emptyMessage={buildAvailabilityEmptyMessage({
          activeCategoryLabel,
          locationFilter: activeHomeLocationFilter,
          type: "vendors",
        })}
        onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
      />
      <VendorShowcaseSection
        title={buildHomeSectionTitle("Featured Vendors", activeCategoryLabel)}
        vendors={filteredFeaturedVendors}
        emptyMessage={buildAvailabilityEmptyMessage({
          activeCategoryLabel,
          locationFilter: activeHomeLocationFilter,
          type: "vendors",
        })}
        onSeeAllClick={() => navigate(`/vendors/featured${menuQuery}`)}
      />
      <ProductShowcaseSection
        title={buildHomeSectionTitle("Popular Products", activeCategoryLabel)}
        products={filteredPopularProducts}
        emptyMessage={buildAvailabilityEmptyMessage({
          activeCategoryLabel,
          locationFilter: activeHomeLocationFilter,
          type: "products",
        })}
        onSeeAllClick={() => navigate(`/products/popular${menuQuery}`)}
      />
      <HowItWorksSection />
    </div>
  );
}
