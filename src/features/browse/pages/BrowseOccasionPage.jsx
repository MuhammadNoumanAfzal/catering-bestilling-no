import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";

export default function BrowseOccasionPage() {
  const {
    categories,
    moreOptions,
    items,
    totalCount,
    error,
    isLoading,
    isRefreshing,
  } =
    useBrowseCatalogItems("occasion");

  return (
    <BrowseCatalogView
      disableLocationFiltering
      error={error}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      categories={categories}
      menuItems={items}
      moreOptions={moreOptions}
      totalItems={totalCount}
    />
  );
}
