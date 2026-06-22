import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import {
  formatCategoryLabel,
  parseCategoryParamValue,
} from "../../browse/utils/categoryFilters";
import {
  CatalogListingPageLayout,
  ProductItem,
} from "../components";
import { HOME_LISTING_PAGE_SIZE } from "../constants/homeConstants";
import { useHomeData } from "../hooks/useHomeData";
import {
  buildAvailabilityEmptyMessage,
  filterProductListingItems,
  normalizeSearchQuery,
} from "../utils/homeCatalog";

export default function ProductListingPage() {
  const { productType } = useParams();
  const [searchParams] = useSearchParams();
  const { locationValue, searchQuery } = useBrowseFilters();
  const { popularProducts } = useHomeData();
  const [visibleCount, setVisibleCount] = useState(HOME_LISTING_PAGE_SIZE);
  const selectedCategory = parseCategoryParamValue(searchParams.get("category"));
  const activeCategoryLabel = formatCategoryLabel(selectedCategory);

  useEffect(() => {
    setVisibleCount(HOME_LISTING_PAGE_SIZE);
  }, [productType, selectedCategory]);

  if (productType !== "popular") {
    return <Navigate to="/" replace />;
  }

  const title = "Popular Products";
  const description =
    "Browse the most-ordered meals and catering picks that teams keep coming back to.";
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const filteredProducts = useMemo(
    () =>
      filterProductListingItems(popularProducts, {
        category: selectedCategory,
        locationValue,
        searchQuery: normalizedSearchQuery,
      }),
    [locationValue, normalizedSearchQuery, popularProducts, selectedCategory],
  );
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <CatalogListingPageLayout
      badge="Products"
      title={title}
      description={description}
      activeCategoryLabel={activeCategoryLabel}
      emptyMessage={buildAvailabilityEmptyMessage({
        activeCategoryLabel,
        locationFilter: locationValue,
        type: "products",
      })}
      hasItems={filteredProducts.length > 0}
      hasMore={hasMore}
      onShowMore={() =>
        setVisibleCount((current) =>
          Math.min(current + HOME_LISTING_PAGE_SIZE, filteredProducts.length),
        )
      }
    >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductItem key={product.id ?? product.name} {...product} />
          ))}
        </div>
    </CatalogListingPageLayout>
  );
}
