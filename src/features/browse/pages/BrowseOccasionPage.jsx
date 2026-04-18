import BrowseCatalogView from "../components/BrowseCatalogView";
import {
  occasionCategories,
  occasionMenuItems,
  moreOccasionOptions,
} from "../data/browseData";

export default function BrowseOccasionPage() {
  return (
    <BrowseCatalogView
      title="By Occasion"
      subtitle="Browse curated catering and lunch menus for celebrations, office events, and special gatherings."
      categories={occasionCategories}
      menuItems={occasionMenuItems}
      moreOptions={moreOccasionOptions}
    />
  );
}
