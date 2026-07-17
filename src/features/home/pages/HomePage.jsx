import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNoVendorsAlert } from "../../../utils/alerts";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { normalizeCategorySelection } from "../../browse/utils/categoryFilters";
import { getBrowseFallbackIcon } from "../../browse/data/browseData";
import {
  browseProductsByFoodType,
  fetchFoodTypes,
} from "../../browse/api/browseTaxonomyService";
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

function isValidPostalCode(postCode) {
  return /^\d{4,5}$/.test(`${postCode ?? ""}`.trim());
}

function removeDuplicateVendors(vendors, excludedVendorIds = new Set()) {
  return vendors.filter((vendor) => !excludedVendorIds.has(vendor.id));
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
  const [foodTypeCategories, setFoodTypeCategories] = useState([]);
  const [categoryBrowseProducts, setCategoryBrowseProducts] = useState([]);
  const [searchValidationMessage, setSearchValidationMessage] = useState("");
  const [pendingSearchScroll, setPendingSearchScroll] = useState(false);
  const vendorResultsRef = useRef(null);
  const searchRequestStartedRef = useRef(false);
  const {
    searchedVendors,
    popularVendors,
    featuredVendors,
    popularProducts,
    status,
  } =
    useHomeData(appliedSearchFilters);
  const normalizedPostalCode = normalizePostalCode(postalCode);
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const normalizedCategoryFilter = normalizeCategorySelection(selectedCategory);
  const appliedSearchLabel = buildSearchSummaryLabel(appliedSearchFilters);
  const appliedSearchFiltersKey = JSON.stringify(appliedSearchFilters);
  const activeHomeLocationFilter = buildLocationFilter({
    postalCode: normalizedPostalCode,
    deliveryAddress: draftDeliveryAddress,
    locationValue,
  });
  const menuQuery = buildCategoryQuery(normalizedCategoryFilter);
  const hasValidPostalCode = isValidPostalCode(normalizedPostalCode);
  const activeCategorySlug = Array.isArray(normalizedCategoryFilter)
    ? normalizedCategoryFilter[0] || ""
    : normalizedCategoryFilter || "";

  useEffect(() => {
    let isMounted = true;

    async function loadFoodTypes() {
      try {
        const items = await fetchFoodTypes();

        if (!isMounted) {
          return;
        }

        setFoodTypeCategories(
          items
            .filter((item) => Number(item?.productsCount ?? 0) > 0)
            .map((item) => ({
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

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryBrowseProducts() {
      if (!activeCategorySlug) {
        if (isMounted) {
          setCategoryBrowseProducts([]);
        }
        return;
      }

      try {
        const result = await browseProductsByFoodType({
          foodTypeSlug: activeCategorySlug,
          postCode: appliedSearchFilters.postCode,
          areaName: appliedSearchFilters.areaName,
          search: undefined,
          first: 24,
        });

        if (isMounted) {
          setCategoryBrowseProducts(result.items || []);
        }
      } catch {
        if (isMounted) {
          setCategoryBrowseProducts([]);
        }
      }
    }

    loadCategoryBrowseProducts();

    return () => {
      isMounted = false;
    };
  }, [
    activeCategorySlug,
    appliedSearchFilters.areaName,
    appliedSearchFilters.postCode,
    normalizedSearchQuery,
  ]);

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
    const hasPostalCodeInput = Boolean(nextPostalCode);

    if (hasPostalCodeInput && !isValidPostalCode(nextPostalCode)) {
      setSearchValidationMessage(
        "Postal code must be 4 or 5 digits before you search.",
      );
      return;
    }

    const nextAreaName = nextPostalCode ? "" : extractAreaName(draftDeliveryAddress);
    const hasSearchInput = Boolean(nextPostalCode || draftDeliveryAddress.trim());
    const nextSearchFilters = {
      postCode: nextPostalCode || undefined,
      areaName: nextAreaName || undefined,
    };
    const nextSearchFiltersKey = JSON.stringify(nextSearchFilters);
    setSearchValidationMessage("");

    setDeliveryAddress(draftDeliveryAddress.trim());
    setLocationValue(nextPostalCode || nextAreaName);
    setAppliedSearchFilters(nextSearchFilters);
    searchRequestStartedRef.current =
      hasSearchInput &&
      nextSearchFiltersKey === appliedSearchFiltersKey &&
      status !== "loading";
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
    () =>
      filterHomePreviewMenuItems(
        activeCategorySlug ? categoryBrowseProducts : popularProducts,
        sharedFilters,
      ),
    [activeCategorySlug, categoryBrowseProducts, popularProducts, sharedFilters],
  );
  const previewMenuItems = useMemo(
    () => filteredMenuItems.slice(0, 6),
    [filteredMenuItems],
  );

  const filteredPopularVendors = useMemo(
    () => filterHomeVendors(popularVendors, sharedFilters),
    [popularVendors, sharedFilters],
  );
  const filteredSearchedVendors = useMemo(
    () => filterHomeVendors(searchedVendors, sharedFilters),
    [searchedVendors, sharedFilters],
  );
  const filteredFeaturedVendors = useMemo(
    () => filterHomeVendors(featuredVendors, sharedFilters),
    [featuredVendors, sharedFilters],
  );
  const filteredPopularProducts = useMemo(
    () =>
      filterHomeProducts(
        activeCategorySlug ? categoryBrowseProducts : popularProducts,
        sharedFilters,
      ),
    [activeCategorySlug, categoryBrowseProducts, popularProducts, sharedFilters],
  );
  const hasAppliedLocationSearch = Boolean(appliedSearchLabel);
  const availableVendorCount = hasAppliedLocationSearch
    ? filteredSearchedVendors.length
    : filteredPopularVendors.length + filteredFeaturedVendors.length;
  const searchedVendorIds = useMemo(
    () => new Set(filteredSearchedVendors.map((vendor) => vendor.id).filter(Boolean)),
    [filteredSearchedVendors],
  );
  const curatedPopularSearchVendors = useMemo(
    () => removeDuplicateVendors(filteredPopularVendors, searchedVendorIds),
    [filteredPopularVendors, searchedVendorIds],
  );
  const curatedFeaturedSearchVendors = useMemo(
    () => removeDuplicateVendors(filteredFeaturedVendors, searchedVendorIds),
    [filteredFeaturedVendors, searchedVendorIds],
  );

  useEffect(() => {
    if (!pendingSearchScroll) {
      return;
    }

    if (!searchRequestStartedRef.current) {
      if (status === "loading") {
        searchRequestStartedRef.current = true;
      }

      return;
    }

    if (status === "loading") {
      return;
    }

    if (availableVendorCount <= 0) {
      searchRequestStartedRef.current = false;
      setPendingSearchScroll(false);
      showNoVendorsAlert(appliedSearchLabel);
      return;
    }

    const resultsElement = vendorResultsRef.current;

    if (!resultsElement) {
      searchRequestStartedRef.current = false;
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
    searchRequestStartedRef.current = false;
    setPendingSearchScroll(false);
  }, [availableVendorCount, pendingSearchScroll, status]);

  const handleClearLocationSearch = () => {
    setPostalCode("");
    setDraftDeliveryAddress("");
    setDeliveryAddress("");
    setLocationValue("");
    setAppliedSearchFilters({});
    setSearchValidationMessage("");
    searchRequestStartedRef.current = false;
    setPendingSearchScroll(false);
  };

  return (
    <div>
      <HeroSection
        deliveryAddress={draftDeliveryAddress}
        onDeliveryAddressChange={setDraftDeliveryAddress}
        onBrowseVendors={() => navigate(`/vendors/all${menuQuery}`)}
        postalCode={normalizedPostalCode}
        onPostalCodeChange={(value) => {
          setPostalCode(value);

          if (searchValidationMessage && isValidPostalCode(value)) {
            setSearchValidationMessage("");
          }
        }}
        hasValidPostalCode={hasValidPostalCode}
        onSearch={handleHomeSearch}
        searchValidationMessage={searchValidationMessage}
      />
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
      <div ref={vendorResultsRef}>
        {hasAppliedLocationSearch ? (
          <>
            {filteredSearchedVendors.length > 0 ? (
              <VendorShowcaseSection
                title={
                  activeCategoryLabel
                    ? `${activeCategoryLabel} Vendors Serving ${appliedSearchLabel}`
                    : `Vendors Serving ${appliedSearchLabel}`
                }
                vendors={filteredSearchedVendors}
                limit={null}
              />
            ) : null}
            {curatedPopularSearchVendors.length > 0 ? (
              <VendorShowcaseSection
                title={`More Popular Vendors Near ${appliedSearchLabel}`}
                vendors={curatedPopularSearchVendors}
                onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
              />
            ) : null}
            {curatedFeaturedSearchVendors.length > 0 ? (
              <VendorShowcaseSection
                title={`Featured Vendors Near ${appliedSearchLabel}`}
                vendors={curatedFeaturedSearchVendors}
                onSeeAllClick={() => navigate(`/vendors/featured${menuQuery}`)}
              />
            ) : null}
          </>
        ) : (
          <>
            {filteredPopularVendors.length > 0 ? (
              <VendorShowcaseSection
                title={buildHomeSectionTitle("Popular Vendors", activeCategoryLabel)}
                vendors={filteredPopularVendors}
                onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
              />
            ) : null}
            {filteredFeaturedVendors.length > 0 ? (
              <VendorShowcaseSection
                title={buildHomeSectionTitle("Featured Vendors", activeCategoryLabel)}
                vendors={filteredFeaturedVendors}
                onSeeAllClick={() => navigate(`/vendors/featured${menuQuery}`)}
              />
            ) : null}
          </>
        )}
        {filteredPopularProducts.length > 0 ? (
          <ProductShowcaseSection
            title={
              activeCategoryLabel
                ? `${activeCategoryLabel} Products`
                : hasAppliedLocationSearch
                  ? `Popular Products Near ${appliedSearchLabel}`
                  : buildHomeSectionTitle("Popular Products", activeCategoryLabel)
            }
            products={filteredPopularProducts}
            onSeeAllClick={() => navigate(`/products/popular${menuQuery}`)}
          />
        ) : null}
      </div>
      <HowItWorksSection />
    </div>
  );
}
