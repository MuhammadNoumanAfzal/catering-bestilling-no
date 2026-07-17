import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useBrowseFilters } from "../../../app/context/BrowseFiltersContext";
import {
  formatCategoryLabel,
  parseCategoryParamValue,
} from "../../browse/utils/categoryFilters";
import { CatalogListingPageLayout, VendorCard } from "../components";
import { HOME_LISTING_PAGE_SIZE } from "../constants/homeConstants";
import { useHomeData } from "../hooks/useHomeData";
import {
  buildAvailabilityEmptyMessage,
  filterVendorListingItems,
  normalizeSearchQuery,
} from "../utils/homeCatalog";

export default function VendorListingPage() {
  const { vendorType } = useParams();
  const [searchParams] = useSearchParams();
  const { locationValue, searchQuery } = useBrowseFilters();
  const { allVendors, popularVendors, featuredVendors } = useHomeData();
  const [visibleCount, setVisibleCount] = useState(HOME_LISTING_PAGE_SIZE);
  const selectedCategory = parseCategoryParamValue(searchParams.get("category"));
  const activeCategoryLabel = formatCategoryLabel(selectedCategory);

  useEffect(() => {
    setVisibleCount(HOME_LISTING_PAGE_SIZE);
  }, [selectedCategory, vendorType]);

  const isAll = vendorType === "all";
  const isPopular = vendorType === "popular";
  const isFeatured = vendorType === "featured";

  if (!isAll && !isPopular && !isFeatured) {
    return <Navigate to="/" replace />;
  }

  const title = isAll
    ? "All Vendors"
    : isPopular
      ? "Popular Vendors"
      : "Featured Vendors";
  const description = isAll
    ? "Browse all available vendors in one place and filter by location, category, or search to find the best fit for your event."
    : isPopular
      ? "Explore the vendors customers order from most often for everyday lunches and office catering."
      : "Browse a hand-picked mix of vendors offering standout menus for team lunches, meetings, and events.";
  const vendors = isAll
    ? allVendors
    : isPopular
      ? popularVendors
      : featuredVendors;
  const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
  const filteredVendors = useMemo(
    () =>
      filterVendorListingItems(vendors, {
        category: selectedCategory,
        locationValue,
        searchQuery: normalizedSearchQuery,
      }),
    [locationValue, normalizedSearchQuery, selectedCategory, vendors],
  );
  const visibleVendors = filteredVendors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVendors.length;

  return (
    <CatalogListingPageLayout
      badge="Vendors"
      title={title}
      description={description}
      activeCategoryLabel={activeCategoryLabel}
      emptyMessage={buildAvailabilityEmptyMessage({
        activeCategoryLabel,
        locationFilter: locationValue,
        type: "vendors",
      })}
      hasItems={filteredVendors.length > 0}
      hasMore={hasMore}
      onShowMore={() =>
        setVisibleCount((current) =>
          Math.min(current + HOME_LISTING_PAGE_SIZE, filteredVendors.length),
        )
      }
    >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleVendors.map((vendor) => (
            <VendorCard key={vendor.id ?? vendor.name} {...vendor} />
          ))}
        </div>
    </CatalogListingPageLayout>
  );
}
