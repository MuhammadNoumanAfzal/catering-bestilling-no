import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  foodTypeCategories,
  moreFoodTypeOptions,
  moreOccasionOptions,
  occasionCategories,
} from "../../browse/data/browseData";
import BrowseTabs from "../../browse/components/BrowseTabs";
import BrowseCategoryStrip from "../../../components/shared/BrowseCategoryStrip";
import BrowseFilterBar from "../../../components/shared/BrowseFilterBar";

export default function FoodBrowsePreviewSection() {
  const location = useLocation();
  const [showMorePanel, setShowMorePanel] = useState(false);

  const activeTab =
    location.pathname === "/browse/occasion" ? "occasion" : "food-type";
  const activeCategories =
    activeTab === "occasion" ? occasionCategories : foodTypeCategories;
  const moreOptions =
    activeTab === "occasion" ? moreOccasionOptions : moreFoodTypeOptions;

  return (
    <section className="overflow-x-clip bg-white px-4 py-6 sm:px-8 lg:px-20">
      <div className="relative mx-auto w-full max-w-7xl">
        <BrowseTabs gapless showCenterDivider />

        <BrowseCategoryStrip
          categories={activeCategories}
          moreOptions={moreOptions}
          isOpen={showMorePanel}
          onOpenChange={setShowMorePanel}
        />

        <BrowseFilterBar onControlInteract={() => setShowMorePanel(false)} />
      </div>
    </section>
  );
}
