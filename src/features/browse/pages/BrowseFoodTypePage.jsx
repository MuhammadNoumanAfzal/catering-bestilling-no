import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";

export default function BrowseFoodTypePage() {
  const {
    categories,
    moreOptions,
    items,
    totalCount,
    error,
    isLoading,
    isRefreshing,
  } =
    useBrowseCatalogItems("food-type");

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
