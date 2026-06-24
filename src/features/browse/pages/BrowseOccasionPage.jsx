import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";

export default function BrowseOccasionPage() {
  const { categories, moreOptions, items, totalCount, error, isLoading } =
    useBrowseCatalogItems("occasion");

  return (
    <BrowseCatalogView
      disableLocationFiltering
      error={error}
      isLoading={isLoading}
      categories={categories}
      menuItems={items}
      moreOptions={moreOptions}
      totalItems={totalCount}
    />
  );
}
