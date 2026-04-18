import BrowseCatalogView from "../components/BrowseCatalogView";
import {
  foodTypeCategories,
  foodTypeMenuItems,
  moreFoodTypeOptions,
} from "../data/browseData";

export default function BrowseFoodTypePage() {
  return (
    <BrowseCatalogView
      title="Food Type"
      subtitle="Explore lunch options by category and keep the same shared desktop layout while browsing."
      categories={foodTypeCategories}
      menuItems={foodTypeMenuItems}
      moreOptions={moreFoodTypeOptions}
    />
  );
}
