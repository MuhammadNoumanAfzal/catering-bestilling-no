import { useState } from "react";
import { foodTypeCategories, moreFoodTypeOptions } from "../../browse/data/browseData";
import BrowseMenuSection from "../../browse/components/BrowseMenuSection";
import BrowseTabs from "../../browse/components/BrowseTabs";
import BrowseCategoryStrip from "../../../components/shared/BrowseCategoryStrip";
import BrowseFilterBar from "../../../components/shared/BrowseFilterBar";

export default function FoodBrowsePreviewSection({
  selectedCategory,
  onCategoryChange,
  previewItems,
  totalItems,
  activeCategoryLabel,
  onSeeAllClick,
}) {
  const [showMorePanel, setShowMorePanel] = useState(false);
  const shouldShowPreviewMenu = Boolean(activeCategoryLabel);

  return (
    <section className="overflow-x-clip bg-white px-4 py-6 sm:px-8 lg:px-20">
      <div className="relative mx-auto w-full max-w-7xl">
        <BrowseTabs gapless showCenterDivider />

        <BrowseCategoryStrip
          activeCategory={selectedCategory}
          categories={foodTypeCategories}
          moreOptions={moreFoodTypeOptions}
          isOpen={showMorePanel}
          onOpenChange={setShowMorePanel}
          onCategoryChange={onCategoryChange}
        />

        <BrowseFilterBar onControlInteract={() => setShowMorePanel(false)} />
      </div>

      {shouldShowPreviewMenu ? (
        <BrowseMenuSection
          title={`${activeCategoryLabel} Menu`}
          items={previewItems}
          totalItems={totalItems}
          activeCategoryLabel={activeCategoryLabel}
          onSeeAllClick={onSeeAllClick}
        />
      ) : null}
    </section>
  );
}
