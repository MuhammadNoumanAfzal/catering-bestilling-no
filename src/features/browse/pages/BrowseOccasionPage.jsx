import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";

export default function BrowseOccasionPage() {
  const {
    categories,
    dietaryOptions,
    moreOptions,
    items,
    totalCount,
    error,
    isLoading,
    isRefreshing,
    hasNextPage,
    isLoadingMore,
    loadMore,
  } =
    useBrowseCatalogItems("occasion");

  return (
    <BrowseCatalogView
      error={error}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      loadMore={loadMore}
      categories={categories}
      dietaryOptions={dietaryOptions}
      menuItems={items}
      moreOptions={moreOptions}
      totalItems={totalCount}
    />
  );
}
