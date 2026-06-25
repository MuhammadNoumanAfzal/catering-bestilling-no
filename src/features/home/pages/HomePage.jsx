import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { normalizeCategorySelection } from "../../browse/utils/categoryFilters";
import { getBrowseFallbackIcon } from "../../browse/data/browseData";
import { fetchFoodTypes } from "../../browse/api/browseTaxonomyService";
import {
  FoodBrowsePreviewSection,
  HeroSection,
  HomeLoadingSection,
  HomeStatusBanner,
  HowItWorksSection,
  ProductShowcaseSection,
  VendorShowcaseSection,
} from "../components";
import { useHomeData } from "../hooks/useHomeData";
import { fetchHomeData } from "../store/homeSlice";
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

function slugifyCategory(value) {
  return `${value ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildSearchSummaryLabel({ postCode, areaName }) {
  if (postCode) {
    return `postal code ${postCode}`;
  }

  if (areaName) {
    return areaName;
  }

  return "";
}

export default function HomePage() {
  const dispatch = useDispatch();
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
  const [foodTypeCategories, setFoodTypeCategories] = useState([]);
  const [pendingSearchScroll, setPendingSearchScroll] = useState(false);
  const vendorResultsRef = useRef(null);
  const {
    popularVendors,
    featuredVendors,
    popularProducts,
    status,
    error,
    hasLoadedOnce,
  } =
    useHomeData(appliedSearchFilters);
  const normalizedPostalCode = normalizePostalCode(postalCode);
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const normalizedCategoryFilter = normalizeCategorySelection(selectedCategory);
  const appliedSearchLabel = buildSearchSummaryLabel(appliedSearchFilters);
  const activeHomeLocationFilter = buildLocationFilter({
    postalCode: normalizedPostalCode,
    deliveryAddress: draftDeliveryAddress,
    locationValue,
  });
  const menuQuery = buildCategoryQuery(normalizedCategoryFilter);

  useEffect(() => {
    let isMounted = true;

    async function loadFoodTypes() {
      try {
        const items = await fetchFoodTypes();

        if (!isMounted) {
          return;
        }

        setFoodTypeCategories(
          items.map((item) => ({
            id: item.id || "",
            name: item.name || "Category",
            value: item.slug || slugifyCategory(item.name),
            slug: item.slug || slugifyCategory(item.name),
            icon: item.iconUrl || getBrowseFallbackIcon(item.slug || item.name),
          })),
        );
      } catch {
        if (isMounted) {
          setFoodTypeCategories([]);
        }
      }
    }

    loadFoodTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategoryLabel = useMemo(() => {
    if (!normalizedCategoryFilter) {
      return null;
    }

    const categoryValue = Array.isArray(normalizedCategoryFilter)
      ? normalizedCategoryFilter[0]
      : normalizedCategoryFilter;
    const matchedCategory = foodTypeCategories.find(
      (item) => item.value === categoryValue || item.slug === categoryValue,
    );

    return matchedCategory?.name ?? buildActiveCategoryLabel(normalizedCategoryFilter);
  }, [foodTypeCategories, normalizedCategoryFilter]);

  const previewCategories = useMemo(() => {
    if (foodTypeCategories.length <= 8) {
      return foodTypeCategories;
    }

    return [
      ...foodTypeCategories.slice(0, 8),
      { name: "More", value: "__more__" },
    ];
  }, [foodTypeCategories]);

  const previewMoreOptions = useMemo(
    () => (foodTypeCategories.length > 8 ? foodTypeCategories.slice(8) : []),
    [foodTypeCategories],
  );

  const handleHomeSearch = () => {
    const nextPostalCode = normalizePostalCode(postalCode);
    const nextAreaName = nextPostalCode ? "" : extractAreaName(draftDeliveryAddress);
    const hasSearchInput = Boolean(nextPostalCode || draftDeliveryAddress.trim());

    setDeliveryAddress(draftDeliveryAddress.trim());
    setLocationValue(nextPostalCode || nextAreaName);
    setAppliedSearchFilters({
      postCode: nextPostalCode || undefined,
      areaName: nextAreaName || undefined,
    });
    setPendingSearchScroll(hasSearchInput);
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
  const isInitialLoading = status === "loading" && !hasLoadedOnce;
  const isRefreshing = status === "loading" && hasLoadedOnce;
  const hasAppliedLocationSearch = Boolean(appliedSearchLabel);

  useEffect(() => {
    if (!pendingSearchScroll) {
      return;
    }

    if (status === "loading") {
      return;
    }

    if (availableVendorCount <= 0) {
      setPendingSearchScroll(false);
      return;
    }

    const resultsElement = vendorResultsRef.current;

    if (!resultsElement) {
      setPendingSearchScroll(false);
      return;
    }

    const topOffset = 104;
    const nextScrollTop =
      resultsElement.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: "smooth",
    });
    setPendingSearchScroll(false);
  }, [availableVendorCount, pendingSearchScroll, status]);

  const handleClearLocationSearch = () => {
    setPostalCode("");
    setDraftDeliveryAddress("");
    setDeliveryAddress("");
    setLocationValue("");
    setAppliedSearchFilters({});
    setPendingSearchScroll(false);
  };

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
      {error ? (
        <HomeStatusBanner
          message={error}
          actionLabel="Try again"
          onAction={() => dispatch(fetchHomeData(appliedSearchFilters))}
        />
      ) : null}
      {isRefreshing ? (
        <HomeStatusBanner
          tone="info"
          message="Refreshing vendors and products for your latest search."
        />
      ) : null}
      {!error &&
      !isInitialLoading &&
      hasAppliedLocationSearch &&
      availableVendorCount > 0 ? (
        <HomeStatusBanner
          tone="info"
          message={`Showing ${availableVendorCount} vendor${
            availableVendorCount === 1 ? "" : "s"
          } for ${appliedSearchLabel}.`}
          actionLabel="Clear search"
          onAction={handleClearLocationSearch}
        />
      ) : null}
      {!error &&
      !isInitialLoading &&
      hasAppliedLocationSearch &&
      availableVendorCount === 0 ? (
        <HomeStatusBanner
          tone="error"
          message={`No vendors are currently available for ${appliedSearchLabel}. Try another address, area, or postal code.`}
          actionLabel="Clear search"
          onAction={handleClearLocationSearch}
        />
      ) : null}
      <FoodBrowsePreviewSection
        categories={previewCategories}
        moreOptions={previewMoreOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        previewItems={previewMenuItems}
        totalItems={filteredMenuItems.length}
        activeCategoryLabel={activeCategoryLabel}
        onSeeAllClick={() => navigate(`/browse/food-type${menuQuery}`)}
      />
      {isInitialLoading ? (
        <>
          <HomeLoadingSection title="Popular Vendors" />
          <HomeLoadingSection title="Featured Vendors" />
          <HomeLoadingSection
            title="Popular Products"
            compact
            columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          />
        </>
      ) : (
        <div ref={vendorResultsRef}>
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
        </div>
      )}
      <HowItWorksSection />
    </div>
  );
}
