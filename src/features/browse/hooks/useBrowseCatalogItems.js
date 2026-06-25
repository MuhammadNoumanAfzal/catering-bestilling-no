import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import { getBrowseFallbackIcon } from "../data/browseData";
import {
  browseProductsByFoodType,
  browseProductsByOccasion,
  fetchFoodTypes,
  fetchOccasions,
} from "../api/browseTaxonomyService";
import { parseCategoryParamValue } from "../utils/categoryFilters";

function slugify(value) {
  return `${value ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildCategoryItem(item) {
  return {
    id: item?.id || "",
    name: item?.name || "Category",
    value: item?.slug || slugify(item?.name),
    slug: item?.slug || slugify(item?.name),
    icon: item?.iconUrl || getBrowseFallbackIcon(item?.slug || item?.name),
    description: item?.description || "",
    productsCount: Number(item?.productsCount ?? 0),
    vendorsCount: Number(item?.vendorsCount ?? 0),
  };
}

function resolveLocationFilters(locationValue) {
  const trimmedValue = `${locationValue ?? ""}`.trim();

  if (!trimmedValue) {
    return { postCode: null, areaName: null };
  }

  const normalizedPostCode = trimmedValue.replace(/\D/g, "").slice(0, 4);

  if (normalizedPostCode.length === 4 && normalizedPostCode === trimmedValue.replace(/\s+/g, "")) {
    return { postCode: normalizedPostCode, areaName: null };
  }

  return { postCode: null, areaName: trimmedValue };
}

function mapSortToApiValue(selectedSort) {
  switch (selectedSort) {
    case "Most Popular":
      return "popular";
    case "Highest Rated":
      return "rating";
    case "Price: Low to High":
      return "price-low-high";
    case "Price: High to Low":
      return "price-high-low";
    case "Newest":
      return "newest";
    default:
      return null;
  }
}

function resolveSelectedSlug(selection, categories) {
  if (!selection) {
    return null;
  }

  const rawValue = Array.isArray(selection) ? selection[0] : selection;
  const normalizedValue = `${rawValue ?? ""}`.trim();

  if (!normalizedValue) {
    return null;
  }

  const matchedCategory = categories.find(
    (item) =>
      item.value === normalizedValue ||
      item.slug === normalizedValue ||
      item.name.toLowerCase() === normalizedValue.toLowerCase() ||
      slugify(item.name) === slugify(normalizedValue),
  );

  return matchedCategory?.value ?? slugify(normalizedValue);
}

export function useBrowseCatalogItems(mode = "food-type") {
  const [searchParams, setSearchParams] = useSearchParams();
  const { locationValue, searchQuery, selectedSort } = useBrowseFilters();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTaxonomyLoading, setIsTaxonomyLoading] = useState(true);

  const categoryParam = searchParams.get("category");

  useEffect(() => {
    let isMounted = true;

    async function loadTaxonomy() {
      setIsTaxonomyLoading(true);
      setError("");

      try {
        const taxonomyItems =
          mode === "occasion" ? await fetchOccasions() : await fetchFoodTypes();
        const nextCategories = taxonomyItems.map(buildCategoryItem);

        if (!isMounted) {
          return;
        }

        setCategories(nextCategories);

        const currentSelection = parseCategoryParamValue(categoryParam);
        const resolvedSlug = resolveSelectedSlug(currentSelection, nextCategories);

        if (!resolvedSlug && nextCategories.length > 0) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set("category", nextCategories[0].value);
          setSearchParams(nextParams, { replace: true });
        } else if (resolvedSlug && resolvedSlug !== currentSelection) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set("category", resolvedSlug);
          setSearchParams(nextParams, { replace: true });
        }
      } catch (loadError) {
        if (isMounted) {
          setCategories([]);
          setError(loadError?.message || "Unable to load categories right now.");
        }
      } finally {
        if (isMounted) {
          setIsTaxonomyLoading(false);
        }
      }
    }

    loadTaxonomy();

    return () => {
      isMounted = false;
    };
  }, [categoryParam, mode, searchParams, setSearchParams]);

  const selectedCategory = parseCategoryParamValue(categoryParam);
  const selectedSlug = useMemo(
    () => resolveSelectedSlug(selectedCategory, categories),
    [categories, selectedCategory],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      if (!selectedSlug) {
        if (isMounted) {
          setItems([]);
          setTotalCount(0);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const { postCode, areaName } = resolveLocationFilters(locationValue);
        const payload =
          mode === "occasion"
            ? await browseProductsByOccasion({
                occasionSlug: selectedSlug,
                postCode,
                areaName,
                search: searchQuery.trim() || null,
                sortBy: mapSortToApiValue(selectedSort),
                first: 100,
                after: null,
              })
            : await browseProductsByFoodType({
                foodTypeSlug: selectedSlug,
                postCode,
                areaName,
                search: searchQuery.trim() || null,
                sortBy: mapSortToApiValue(selectedSort),
                first: 100,
                after: null,
              });

        if (isMounted) {
          setItems(payload.items);
          setTotalCount(payload.totalCount);
        }
      } catch (loadError) {
        if (isMounted) {
          setItems([]);
          setTotalCount(0);
          setError(loadError?.message || "Unable to load menu items right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [locationValue, mode, searchQuery, selectedSlug, selectedSort]);

  const primaryCategories = useMemo(() => {
    if (categories.length <= 8) {
      return categories;
    }

    return [...categories.slice(0, 8), { name: "More", value: "__more__" }];
  }, [categories]);

  const moreOptions = useMemo(
    () => (categories.length > 8 ? categories.slice(8) : []),
    [categories],
  );
  const hasVisibleContent =
    categories.length > 0 || items.length > 0 || totalCount > 0;
  const isInitialLoading = (isLoading || isTaxonomyLoading) && !hasVisibleContent;
  const isRefreshing = (isLoading || isTaxonomyLoading) && hasVisibleContent;

  return {
    categories: primaryCategories,
    moreOptions,
    items,
    totalCount,
    error,
    isLoading: isInitialLoading,
    isRefreshing,
  };
}
