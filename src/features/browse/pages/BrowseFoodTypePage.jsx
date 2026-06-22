import BrowseCatalogView from "../components/BrowseCatalogView";
import { useBrowseCatalogItems } from "../hooks/useBrowseCatalogItems";
import {
  foodTypeCategories,
  moreFoodTypeOptions,
} from "../data/browseData";

export default function BrowseFoodTypePage() {
  const { items, isLoading } = useBrowseCatalogItems();

  return (
    <BrowseCatalogView
      isLoading={isLoading}
      categories={foodTypeCategories}
      menuItems={items}
      moreOptions={moreFoodTypeOptions}
    />
  );
}
