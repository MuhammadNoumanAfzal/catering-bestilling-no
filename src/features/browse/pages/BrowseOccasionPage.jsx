import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";
import {
  occasionCategories,
  moreOccasionOptions,
} from "../data/browseData";

export default function BrowseOccasionPage() {
  const { items, isLoading } = useBrowseCatalogItems();

  return (
    <BrowseCatalogView
      isLoading={isLoading}
      categories={occasionCategories}
      menuItems={items}
      moreOptions={moreOccasionOptions}
    />
  );
}
