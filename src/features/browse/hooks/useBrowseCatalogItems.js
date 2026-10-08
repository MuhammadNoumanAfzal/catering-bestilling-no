import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { FILTER_DEFAULTS } from "../../../components/shared/browseFilters/browseFilterConfig";
import { getBrowseFallbackIcon } from "../data/browseData";
import {
  browseProductsByFoodType,
  browseProductsByOccasion,
  fetchBrowseFilterOptions,
} from "../api/browseTaxonomyService";
import { parseCategoryParamValue } from "../utils/categoryFilters";
import { filterItemsByVendorLocation } from "../../vendor";
import { fetchVendorProfiles } from "../../vendor/api/vendorService";
import { isVendorDeliverySlotAvailable } from "../../vendor/services/vendorAvailability";

const PAGE_SIZE = 24;

function slugify(value) {
  return `${value ?? ""}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function buildCategoryItem(item) {
  return { id: item?.id || "", name: item?.name || "Category", value: item?.slug || slugify(item?.name), slug: item?.slug || slugify(item?.name), icon: item?.iconUrl || getBrowseFallbackIcon(item?.slug || item?.name), description: item?.description || "", productsCount: Number(item?.productsCount ?? 0), vendorsCount: Number(item?.vendorsCount ?? 0) };
}

function resolveLocationFilters(value) {
  const trimmedValue = `${value ?? ""}`.trim();
  if (!trimmedValue) return { postCode: null, areaName: null };
  const digits = trimmedValue.replace(/\D/g, "");
  return (digits.length === 4 || digits.length === 5) && digits === trimmedValue.replace(/\s+/g, "")
    ? { postCode: digits, areaName: null }
    : { postCode: null, areaName: trimmedValue };
}

function mapSortToApiValue(value) {
  return { Recommended: "RECOMMENDED", "Most Popular": "MOST_POPULAR", "Highest Rated": "HIGHEST_RATED", "Price: Low to High": "PRICE_LOW_TO_HIGH", "Price: High to Low": "PRICE_HIGH_TO_LOW", Newest: "NEWEST" }[value] || "RECOMMENDED";
}

function mapMinimumRating(value) {
  const rating = Number.parseFloat(`${value || ""}`);
  return Number.isFinite(rating) ? rating : null;
}

function mapPriceRange(value) { return { "Under 500": "UNDER_500", "500 - 1000": "BETWEEN_500_AND_1000", "1000 - 2000": "BETWEEN_1000_AND_2000", "2000 - 5000": "BETWEEN_2000_AND_5000", "5000+": "OVER_5000" }[value] || null; }

function mapDeliveryFilter(value) {
  return {
    "Free Delivery": "FREE_DELIVERY",
    "Gratis levering": "FREE_DELIVERY",
    "Delivery Fee: 0-150": "FEE_0_TO_150",
    "Delivery Fee: 0–150": "FEE_0_TO_150",
    "Leveringsgebyr: 0–150 kr": "FEE_0_TO_150",
    "Leveringsgebyr: 0-150 kr": "FEE_0_TO_150",
    "Delivery Fee: 150-300": "FEE_150_TO_300",
    "Delivery Fee: 150–300": "FEE_150_TO_300",
    "Leveringsgebyr: 150–300 kr": "FEE_150_TO_300",
    "Leveringsgebyr: 150-300 kr": "FEE_150_TO_300",
    "Delivery Fee: 300+": "FEE_300_PLUS",
    "Leveringsgebyr: 300+ kr": "FEE_300_PLUS",
  }[value] || null;
}

function resolveSelectedSlug(selection, categories) {
  const rawValue = Array.isArray(selection) ? selection[0] : selection;
  const normalizedValue = `${rawValue ?? ""}`.trim();
  if (!normalizedValue) return null;
  const match = categories.find((item) => item.value === normalizedValue || item.slug === normalizedValue || item.name.toLowerCase() === normalizedValue.toLowerCase() || slugify(item.name) === slugify(normalizedValue));
  return match?.value ?? slugify(normalizedValue);
}

function buildVendorLookup(vendors = []) {
  return vendors.reduce((lookup, vendor) => {
    if (vendor?.id) lookup.set(`id:${vendor.id}`, vendor);
    if (vendor?.slug) lookup.set(`slug:${vendor.slug}`, vendor);
    return lookup;
  }, new Map());
}


async function fetchBrowseProducts(variables, mode) {
  return mode === "occasion"
    ? browseProductsByOccasion(variables)
    : browseProductsByFoodType(variables);
}
function mergeVendorCoverage(items, vendorLookup) {
  if (!vendorLookup.size) return items;

  return items.map((item) => {
    const vendor = item?.vendorData ?? item?.vendor ?? null;
    const matchedVendor = vendorLookup.get(`id:${vendor?.id}`) || vendorLookup.get(`slug:${vendor?.slug}`);

    if (!matchedVendor) return item;

    return {
      ...item,
      vendorData: {
        ...vendor,
        ...matchedVendor,
      },
    };
  });
}
export function useBrowseCatalogItems(mode = "food-type") {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { deliveryDate, deliveryTime, locationValue, searchQuery, selectedSort, selectedRating, selectedDietary, selectedOffers, selectedPricing } = useBrowseFilters();

  function matchesDeliverySelection(item) {
    if (!deliveryDate && !deliveryTime) return true;
    const vendor = item?.vendorData ?? item?.vendor;
    return Boolean(vendor) && isVendorDeliverySlotAvailable(vendor, deliveryDate, deliveryTime);
  }
  const [categories, setCategories] = useState([]);
  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTaxonomyLoading, setIsTaxonomyLoading] = useState(true);
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    let isMounted = true;
    async function loadTaxonomy() {
      setIsTaxonomyLoading(true);
      try {
        const filterOptions = await fetchBrowseFilterOptions();
        const taxonomyItems = mode === "occasion"
          ? filterOptions.occasions
          : filterOptions.foodTypes;
        const nextCategories = taxonomyItems.map(buildCategoryItem);
        if (!isMounted) return;
        setCategories(nextCategories);
        setDietaryOptions(filterOptions.dietaryOptions);
        const selected = parseCategoryParamValue(categoryParam);
        const resolvedSlug = resolveSelectedSlug(selected, nextCategories);
        if (resolvedSlug && resolvedSlug !== selected) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set("category", resolvedSlug);
          setSearchParams(nextParams, { replace: true });
        }
      } catch (loadError) {
        if (isMounted) setError(loadError?.message || "Unable to load categories right now.");
      } finally {
        if (isMounted) setIsTaxonomyLoading(false);
      }
    }
    loadTaxonomy();
    return () => { isMounted = false; };
  }, [categoryParam, mode, searchParams, setSearchParams]);

  const selectedSlug = useMemo(() => resolveSelectedSlug(parseCategoryParamValue(categoryParam), categories), [categories, categoryParam]);

  useEffect(() => {
    let isMounted = true;
    async function loadItems() {
      setIsLoading(true);
      setError("");
      try {
        const variables = {
          foodTypeSlug: mode === "food-type" ? selectedSlug : null,
          occasionSlug: mode === "occasion" ? selectedSlug : null,
          ...resolveLocationFilters(locationValue),
          search: searchQuery.trim() || null,
          sortBy: mapSortToApiValue(selectedSort),
          minRating: mapMinimumRating(selectedRating),
          dietaryTagSlugs: selectedDietary,
          first: PAGE_SIZE,
          after: null,
        };
        const payload = await fetchBrowseProducts(variables, mode);
        const vendorLookup = locationValue.trim() || deliveryDate || deliveryTime
          ? buildVendorLookup(await fetchVendorProfiles())
          : new Map();
        if (!isMounted) return;
        const visibleItems = filterItemsByVendorLocation(
          mergeVendorCoverage(payload.items, vendorLookup),
          locationValue,
          (item) => item?.vendorData ?? item?.vendor ?? null,
        ).filter(matchesDeliverySelection);
        setItems(visibleItems);
        setTotalCount(locationValue.trim() || deliveryDate || deliveryTime ? visibleItems.length : payload.totalCount);
        setPageInfo(payload.pageInfo || { hasNextPage: false, endCursor: null });
      } catch (loadError) {
        if (!isMounted) return;
        setItems([]); setTotalCount(0); setPageInfo({ hasNextPage: false, endCursor: null });
        setError(loadError?.message || "Unable to load menu items right now.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadItems();
    return () => { isMounted = false; };
  }, [deliveryDate, deliveryTime, dietaryOptions, locationValue, mode, searchQuery, selectedDietary, selectedOffers, selectedPricing, selectedRating, selectedSlug, selectedSort]);

  const loadMore = async () => {
    if (isLoadingMore || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setIsLoadingMore(true);
    try {
      const variables = {
        foodTypeSlug: mode === "food-type" ? selectedSlug : null,
        occasionSlug: mode === "occasion" ? selectedSlug : null,
        ...resolveLocationFilters(locationValue),
        search: searchQuery.trim() || null,
        sortBy: mapSortToApiValue(selectedSort),
        minRating: mapMinimumRating(selectedRating),
        dietaryTagSlugs: selectedDietary,
        first: PAGE_SIZE,
        after: pageInfo.endCursor,
      };
      const payload = await fetchBrowseProducts(variables, mode);
      const vendorLookup = locationValue.trim() || deliveryDate || deliveryTime
        ? buildVendorLookup(await fetchVendorProfiles())
        : new Map();
      const visibleItems = filterItemsByVendorLocation(
        mergeVendorCoverage(payload.items, vendorLookup),
        locationValue,
        (item) => item?.vendorData ?? item?.vendor ?? null,
      ).filter(matchesDeliverySelection);
      setItems((current) => [...current, ...visibleItems]);
      if (locationValue.trim() || deliveryDate || deliveryTime) {
        setTotalCount((current) => current + visibleItems.length);
      }
      setPageInfo(payload.pageInfo || { hasNextPage: false, endCursor: null });
    } catch (loadError) {
      setError(loadError?.message || "Unable to load more menu items right now.");
    } finally {
      setIsLoadingMore(false);
    }
  };
  const primaryCategories = useMemo(() => categories.length <= 8 ? categories : [...categories.slice(0, 8), { name: t("browse.more", { defaultValue: "More" }), value: "__more__" }], [categories, t]);
  const moreOptions = useMemo(() => categories.length > 8 ? categories.slice(8) : [], [categories]);
  const hasMenuContent = items.length > 0 || totalCount > 0;

  return { categories: primaryCategories, moreOptions, dietaryOptions, items, totalCount, error, loadMore, hasNextPage: pageInfo.hasNextPage, isLoadingMore, isLoading: isTaxonomyLoading || (isLoading && !hasMenuContent && !error), isRefreshing: !isTaxonomyLoading && isLoading && hasMenuContent && !error };
}
