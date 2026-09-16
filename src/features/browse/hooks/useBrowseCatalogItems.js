import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { FILTER_DEFAULTS } from "../../../components/shared/browseFilters/browseFilterConfig";
import { getBrowseFallbackIcon } from "../data/browseData";
import {
  browseProductsByFoodType,
  browseProductsByOccasion,
  fetchFoodTypes,
  fetchOccasions,
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
  return { Recommended: "recommended", "Most Popular": "most-popular", "Highest Rated": "highest-rated", "Price: Low to High": "price-low-high", "Price: High to Low": "price-high-low", Newest: "newest" }[value] || "recommended";
}

function mapMinimumRating(value) {
  const rating = Number.parseFloat(`${value || ""}`);
  return Number.isFinite(rating) ? rating : null;
}

function mapPriceRange(value) {
  switch (value) {
    case "Under NOK 250": return { priceMin: 0, priceMax: 250 };
    case "NOK 250 - NOK 500": return { priceMin: 250, priceMax: 500 };
    case "NOK 500+": return { priceMin: 500, priceMax: null };
    default: return { priceMin: null, priceMax: null };
  }
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
  const { locationValue, searchQuery, selectedSort, selectedRating, selectedDietary, selectedOffers, otherFilters } = useBrowseFilters();
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
        const taxonomyItems = mode === "occasion" ? await fetchOccasions() : await fetchFoodTypes();
        const nextCategories = taxonomyItems.filter((item) => Number(item?.productsCount ?? 0) > 0).map(buildCategoryItem);
        if (!isMounted) return;
        setCategories(nextCategories);
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
        const { postCode, areaName } = resolveLocationFilters(locationValue);
        const priceRange = mapPriceRange(otherFilters?.orderMinimum);
        const variables = {
          postCode, areaName, search: searchQuery.trim() || null,
          sortBy: mapSortToApiValue(selectedSort),
          minRating: mapMinimumRating(selectedRating),
          dietaryTagSlugs: selectedDietary,
          freeDelivery: selectedOffers.includes("Free Delivery") ? true : null,
          deliveryFeeMin: null, deliveryFeeMax: null,
          ...priceRange, first: PAGE_SIZE, after: null,
        };
        const payload = mode === "occasion"
          ? await browseProductsByOccasion({ ...variables, occasionSlug: selectedSlug })
          : await browseProductsByFoodType({ ...variables, foodTypeSlug: selectedSlug });
        if (!isMounted) return;
        setItems(payload.items);
        setTotalCount(payload.totalCount);
        setDietaryOptions(payload.dietaryTags || []);
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
  }, [locationValue, mode, otherFilters?.orderMinimum, searchQuery, selectedDietary, selectedOffers, selectedRating, selectedSlug, selectedSort]);

  const loadMore = async () => {
    if (isLoadingMore || !pageInfo.hasNextPage || !pageInfo.endCursor) return;
    setIsLoadingMore(true);
    try {
      const { postCode, areaName } = resolveLocationFilters(locationValue);
      const priceRange = mapPriceRange(otherFilters?.orderMinimum);
      const variables = {
        postCode, areaName, search: searchQuery.trim() || null,
        sortBy: mapSortToApiValue(selectedSort), minRating: mapMinimumRating(selectedRating),
        dietaryTagSlugs: selectedDietary, freeDelivery: selectedOffers.includes("Free Delivery") ? true : null,
        deliveryFeeMin: null, deliveryFeeMax: null, ...priceRange, first: PAGE_SIZE, after: pageInfo.endCursor,
      };
      const payload = mode === "occasion"
        ? await browseProductsByOccasion({ ...variables, occasionSlug: selectedSlug })
        : await browseProductsByFoodType({ ...variables, foodTypeSlug: selectedSlug });
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