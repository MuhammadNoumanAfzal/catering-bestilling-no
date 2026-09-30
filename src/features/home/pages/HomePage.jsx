import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showNoVendorsAlert } from "../../../utils/alerts";
import { readSavedSettings } from "../../../utils/customerProfileStorage";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { useAuth } from "../../auth";
import { normalizeCategorySelection } from "../../browse/utils/categoryFilters";
import { foodTypeCategories as fallbackFoodTypeCategories, getBrowseFallbackIcon } from "../../browse/data/browseData";
import {
  browseProductsByFoodType,
  fetchFoodTypes,
  fetchBrowseFilterOptions,
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
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
  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [categoryBrowseProducts, setCategoryBrowseProducts] = useState([]);
  const [searchValidationMessage, setSearchValidationMessage] = useState("");
  const [isPostalCodePromptOpen, setIsPostalCodePromptOpen] = useState(false);
  const [guestPostalCodeDraft, setGuestPostalCodeDraft] = useState("");
  const [guestPostalCodeError, setGuestPostalCodeError] = useState("");
  const [pendingSearchScroll, setPendingSearchScroll] = useState(false);
  const vendorResultsRef = useRef(null);
  const searchRequestStartedRef = useRef(false);
  const userPostalCodeAppliedRef = useRef(false);
  const {
    searchedVendors,
    popularVendors,
    featuredVendors,
    popularProducts,
    status,
  } =
    useHomeData(appliedSearchFilters);
  const savedPostalCode = readSavedSettings()?.postCode;
  const userPostalCode = normalizePostalCode(user?.postCode || savedPostalCode);
  const hasUsableUserPostalCode = isValidPostalCode(userPostalCode);
  const normalizedPostalCode = normalizePostalCode(postalCode);
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const normalizedCategoryFilter = normalizeCategorySelection(selectedCategory);
  const appliedSearchLabel = useMemo(() => {
    if (appliedSearchFilters.postCode) {
      return t("home.postalCodeSummary", {
        postCode: appliedSearchFilters.postCode,
      });
    }

    return buildSearchSummaryLabel(appliedSearchFilters);
  }, [appliedSearchFilters, t]);
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
    if (!isLoggedIn || !hasUsableUserPostalCode || userPostalCodeAppliedRef.current) {
      return;
    }

    userPostalCodeAppliedRef.current = true;
    setPostalCode(userPostalCode);
    setDraftDeliveryAddress("");
    setDeliveryAddress("");
    setLocationValue(userPostalCode);
    setAppliedSearchFilters({ postCode: userPostalCode });
    setSearchValidationMessage("");
  }, [
    hasUsableUserPostalCode,
    isLoggedIn,
    setDeliveryAddress,
    setLocationValue,
    userPostalCode,
  ]);

  useEffect(() => {
    const shouldPromptForPostalCode = !isLoggedIn;
    const hasActivePostalCode = Boolean(locationValue.trim() || appliedSearchFilters.postCode);

    if (!shouldPromptForPostalCode || hasActivePostalCode) {
      setIsPostalCodePromptOpen(false);
      return;
    }

    setIsPostalCodePromptOpen(true);
  }, [
    appliedSearchFilters.postCode,
    hasUsableUserPostalCode,
    isLoggedIn,
    locationValue,
  ]);
  useEffect(() => {
    if (!isValidPostalCode(normalizedPostalCode)) {
      return;
    }

    if (locationValue === normalizedPostalCode) {
      return;
    }

    // Keep the browse pages aligned with the editable home postal code field.
    setLocationValue(normalizedPostalCode);
  }, [locationValue, normalizedPostalCode, setLocationValue]);
  useEffect(() => {
    let isMounted = true;

    async function loadFoodTypes() {
      try {
        const [items, filterOptions] = await Promise.all([
          fetchFoodTypes(),
          fetchBrowseFilterOptions(),
        ]);

        if (!isMounted) {
          return;
        }

        setDietaryOptions(filterOptions.dietaryOptions || []);

        const mappedFoodTypes = items.map((item) => ({
          id: item.id || "",
          name: item.name || "Category",
          value: item.slug || slugifyCategory(item.name),
          slug: item.slug || slugifyCategory(item.name),
          icon: item.iconUrl || getBrowseFallbackIcon(item.slug || item.name),
        }));

        setFoodTypeCategories(
          mappedFoodTypes.length >= 6
            ? mappedFoodTypes
            : fallbackFoodTypeCategories.map((item) => ({
                ...item,
                value: slugifyCategory(item.name),
                slug: slugifyCategory(item.name),
              })),
        );
      } catch {
        if (isMounted) {
          setFoodTypeCategories(fallbackFoodTypeCategories.map((item) => ({ ...item, value: slugifyCategory(item.name), slug: slugifyCategory(item.name) })));
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
      { name: t("home.more"), value: "__more__" },
    ];
  }, [foodTypeCategories, t]);

  const previewMoreOptions = useMemo(
    () => (foodTypeCategories.length > 8 ? foodTypeCategories.slice(8) : []),
    [foodTypeCategories],
  );

  const applyPostalCodeSearch = (nextPostalCode) => {
    setPostalCode(nextPostalCode);
    setDraftDeliveryAddress("");
    setDeliveryAddress("");
    setLocationValue(nextPostalCode);
    setAppliedSearchFilters({ postCode: nextPostalCode });
    setSearchValidationMessage("");
  };

  const handleGuestPostalCodeSubmit = () => {
    const nextPostalCode = normalizePostalCode(guestPostalCodeDraft);

    if (!isValidPostalCode(nextPostalCode)) {
      setGuestPostalCodeError(t("home.postalCodeValidation"));
      return;
    }

    applyPostalCodeSearch(nextPostalCode);
    setGuestPostalCodeDraft(nextPostalCode);
    setGuestPostalCodeError("");
    setIsPostalCodePromptOpen(false);
  };

  const handleHomeSearch = () => {
    const nextPostalCode = normalizePostalCode(postalCode);
    const hasPostalCodeInput = Boolean(nextPostalCode);

    if (hasPostalCodeInput && !isValidPostalCode(nextPostalCode)) {
      setSearchValidationMessage(
        t("home.postalCodeValidation"),
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
      {isPostalCodePromptOpen ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[430px] rounded-[18px] bg-[#fffaf6] p-6 text-center shadow-[0_28px_70px_rgba(28,18,12,0.24)]">
            <h2 className="text-[24px] font-extrabold text-[#241815]">
              {t("home.postalCodePromptTitle", {
                defaultValue: "Enter your postal code",
              })}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#6f6258]">
              {t("home.postalCodePromptMessage", {
                defaultValue:
                  "Please enter your postal code so we can show vendors and menu items available for delivery to you.",
              })}
            </p>
            <input
              autoFocus
              inputMode="numeric"
              type="text"
              value={guestPostalCodeDraft}
              onChange={(event) => {
                setGuestPostalCodeDraft(
                  event.target.value.replace(/\D/g, "").slice(0, 5),
                );
                if (guestPostalCodeError) {
                  setGuestPostalCodeError("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleGuestPostalCodeSubmit();
                }
              }}
              placeholder={t("home.postalCodePlaceholder")}
              className="mt-5 h-12 w-full rounded-xl border border-[#e7d8cd] bg-white px-4 text-center text-[16px] font-semibold text-[#241815] outline-none placeholder:font-normal placeholder:text-[#b6a79c] focus:border-[#d46f38]"
            />
            {guestPostalCodeError ? (
              <p className="mt-2 text-sm font-medium text-[#b6542c]">
                {guestPostalCodeError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleGuestPostalCodeSubmit}
              className="mt-5 inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl bg-[#d46f38] px-6 text-[15px] font-bold text-white transition hover:bg-[#bf5f2d]"
            >
              {t("home.showDeliveryOptions", {
                defaultValue: "Show delivery options",
              })}
            </button>
          </div>
        </div>
      ) : null}
      <HeroSection
        deliveryAddress={draftDeliveryAddress}
        onDeliveryAddressChange={setDraftDeliveryAddress}
        onBrowseVendors={() => navigate(`/vendors/all${menuQuery}`)}
        postalCode={postalCode}
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
        dietaryOptions={dietaryOptions}
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
                    ? t("home.categoryVendorsServing", {
                        category: activeCategoryLabel,
                        location: appliedSearchLabel,
                      })
                    : t("home.vendorsServing", {
                        location: appliedSearchLabel,
                      })
                }
                vendors={filteredSearchedVendors}
                limit={null}
              />
            ) : null}
            {curatedPopularSearchVendors.length > 0 ? (
              <VendorShowcaseSection
                title={t("home.morePopularNear", {
                  location: appliedSearchLabel,
                })}
                vendors={curatedPopularSearchVendors}
                onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
              />
            ) : null}
            {curatedFeaturedSearchVendors.length > 0 ? (
              <VendorShowcaseSection
                title={t("home.featuredNear", {
                  location: appliedSearchLabel,
                })}
                vendors={curatedFeaturedSearchVendors}
                onSeeAllClick={() => navigate(`/vendors/featured${menuQuery}`)}
              />
            ) : null}
          </>
        ) : (
          <>
            {filteredPopularVendors.length > 0 ? (
              <VendorShowcaseSection
                title={buildHomeSectionTitle(
                  t("home.popularVendors"),
                  activeCategoryLabel,
                )}
                vendors={filteredPopularVendors}
                onSeeAllClick={() => navigate(`/vendors/popular${menuQuery}`)}
              />
            ) : null}
            {filteredFeaturedVendors.length > 0 ? (
              <VendorShowcaseSection
                title={buildHomeSectionTitle(
                  t("home.featuredVendors"),
                  activeCategoryLabel,
                )}
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
                ? t("home.products", { category: activeCategoryLabel })
                : hasAppliedLocationSearch
                  ? t("home.popularProductsNear", {
                      location: appliedSearchLabel,
                    })
                  : buildHomeSectionTitle(
                      t("home.popularProducts"),
                      activeCategoryLabel,
                    )
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
