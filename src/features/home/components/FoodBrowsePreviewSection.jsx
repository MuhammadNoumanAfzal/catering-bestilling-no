import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  foodTypeCategories,
  foodTypeMenuItems,
  moreFoodTypeOptions,
  moreOccasionOptions,
  occasionCategories,
} from "../../browse/data/browseData";
import BrowseMenuSection from "../../browse/components/BrowseMenuSection";
import BrowseTabs from "../../browse/components/BrowseTabs";
import BrowseCategoryStrip from "../../../components/shared/BrowseCategoryStrip";
import BrowseFilterBar from "../../../components/shared/BrowseFilterBar";

export default function FoodBrowsePreviewSection() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMorePanel, setShowMorePanel] = useState(false);

  const activeTab =
    location.pathname === "/browse/occasion" ? "occasion" : "food-type";
  const activeCategories =
    activeTab === "occasion" ? occasionCategories : foodTypeCategories;
  const moreOptions =
    activeTab === "occasion" ? moreOccasionOptions : moreFoodTypeOptions;
  const normalizedCategoryFilter = Array.isArray(selectedCategory)
    ? selectedCategory.map((item) => item.trim())
    : selectedCategory?.trim() ?? null;
  const previewItems = useMemo(() => {
    const baseItems = foodTypeMenuItems.filter((item) => {
      if (!normalizedCategoryFilter) {
        return true;
      }

      const tags = (item.categoryTags ?? []).map((tag) => tag.trim());

      return Array.isArray(normalizedCategoryFilter)
        ? normalizedCategoryFilter.some((tag) => tags.includes(tag))
        : tags.includes(normalizedCategoryFilter);
    });

    return baseItems.slice(0, 6);
  }, [normalizedCategoryFilter]);
  const activeCategoryLabel = Array.isArray(normalizedCategoryFilter)
    ? normalizedCategoryFilter.join(", ")
    : normalizedCategoryFilter;

  return (
    <section className="overflow-x-clip bg-white px-4 py-6 sm:px-8 lg:px-20">
      <div className="relative mx-auto w-full max-w-7xl">
        <BrowseTabs gapless showCenterDivider />

        <BrowseCategoryStrip
          activeCategory={selectedCategory}
          categories={activeCategories}
          moreOptions={moreOptions}
          isOpen={showMorePanel}
          onOpenChange={setShowMorePanel}
          onCategoryChange={setSelectedCategory}
        />

        <BrowseFilterBar onControlInteract={() => setShowMorePanel(false)} />
      </div>

      <BrowseMenuSection
        title="Menu"
        items={previewItems}
        totalItems={previewItems.length}
        activeCategoryLabel={activeCategoryLabel}
      />
    </section>
  );
}
