import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { FILTER_DEFAULTS } from "../../../components/shared/browseFilters/browseFilterConfig";
import { getBrowseFallbackIcon } from "../data/browseData";
import {
  browseMenus,
  fetchBrowseFilterOptions,
} from "../api/browseTaxonomyService";
import { parseCategoryParamValue } from "../utils/categoryFilters";

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

function mapPriceRange(value) { return { "Under NOK 500": "UNDER_500", "NOK 500 - NOK 1000": "BETWEEN_500_AND_1000", "NOK 1000 - NOK 2000": "BETWEEN_1000_AND_2000", "NOK 2000 - NOK 5000": "BETWEEN_2000_AND_5000", "NOK 5000+": "OVER_5000" }[value] || null; }

function mapDeliveryFilter(value) {
  return {
    "Free Delivery": "FREE_DELIVERY",
    "Delivery Fee: 0-150 NOK": "FEE_0_TO_150",
    "Delivery Fee: 150-300 NOK": "FEE_150_TO_300",
    "Delivery Fee: 300+ NOK": "FEE_300_PLUS",
  }[value] || null;
}

function resolveSelectedSlug(selection, categories) {
  const rawValue = Array.isArray(selection) ? selection[0] : selection;
  const normalizedValue = `${rawValue ?? ""}`.trim();
  if (!normalizedValue) return null;
  const match = categories.find((item) => item.value === normalizedValue || item.slug === normalizedValue || item.name.toLowerCase() === normalizedValue.toLowerCase() || slugify(item.name) === slugify(normalizedValue));
  return match?.value ?? slugify(normalizedValue);
}

export function useBrowseCatalogItems(mode = "food-type") {
  const [searchParams, setSearchParams] = useSearchParams();
  const { locationValue, searchQuery, selectedSort, selectedRating, selectedDietary, selectedOffers, selectedPricing } = useBrowseFilters();
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
          sort: mapSortToApiValue(selectedSort),
          priceRange: mapPriceRange(selectedPricing),
          minRating: mapMinimumRating(selectedRating),
          dietaryOptionIds: selectedDietary.map((value) => dietaryOptions.find((option) => option.id === value || option.slug === value || option.name === value)?.id || value),
          deliveryFilter: mapDeliveryFilter(selectedOffers[0]),
          first: PAGE_SIZE, after: null,
        };
        const payload = await browseMenus(variables, mode);
        if (!isMounted) return;
        setItems(payload.items);
        setTotalCount(payload.totalCount);
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
  }, [dietaryOptions, locationValue, mode, searchQuery, selectedDietary, selectedOffers, selectedPricing, selectedRating, selectedSlug, selectedSort]);

  const loadMore = async () => {
    if (isLoadingMore || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setIsLoadingMore(true);
    try {
      const variables = {
        foodTypeSlug: mode === "food-type" ? selectedSlug : null,
        occasionSlug: mode === "occasion" ? selectedSlug : null,
        sort: mapSortToApiValue(selectedSort),
        priceRange: mapPriceRange(selectedPricing),
        minRating: mapMinimumRating(selectedRating),
        dietaryOptionIds: selectedDietary.map((value) => dietaryOptions.find((option) => option.id === value || option.slug === value || option.name === value)?.id || value),
        deliveryFilter: mapDeliveryFilter(selectedOffers[0]),
        first: PAGE_SIZE,
        after: pageInfo.endCursor,
      };
      const payload = await browseMenus(variables, mode);
      setItems((current) => [...current, ...payload.items]);
      setPageInfo(payload.pageInfo || { hasNextPage: false, endCursor: null });
    } catch (loadError) {
      setError(loadError?.message || "Unable to load more menu items right now.");
    } finally {
      setIsLoadingMore(false);
    }
  };
  const primaryCategories = useMemo(() => categories.length <= 8 ? categories : [...categories.slice(0, 8), { name: "More", value: "__more__" }], [categories]);
  const moreOptions = useMemo(() => categories.length > 8 ? categories.slice(8) : [], [categories]);
  const hasMenuContent = items.length > 0 || totalCount > 0;

  return { categories: primaryCategories, moreOptions, dietaryOptions, items, totalCount, error, loadMore, hasNextPage: pageInfo.hasNextPage, isLoadingMore, isLoading: isTaxonomyLoading || (isLoading && !hasMenuContent && !error), isRefreshing: !isTaxonomyLoading && isLoading && hasMenuContent && !error };
}