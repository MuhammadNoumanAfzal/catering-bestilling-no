import { useState } from "react";
import BrowseMenuSection from "../../browse/components/BrowseMenuSection";
import BrowseTabs from "../../browse/components/BrowseTabs";
import BrowseCategoryStrip from "../../../components/shared/BrowseCategoryStrip";
import BrowseFilterBar from "../../../components/shared/BrowseFilterBar";

export default function FoodBrowsePreviewSection({
  categories = [],
  moreOptions = [],
  selectedCategory,
  onCategoryChange,
  previewItems,
  totalItems,
  activeCategoryLabel,
  onSeeAllClick,
}) {
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const shouldShowPreviewMenu = Boolean(activeCategoryLabel || hasAppliedFilters);

  return (
    <section className="overflow-x-clip bg-white px-4 py-6 sm:px-8 lg:px-20">
      <div className="relative mx-auto w-full max-w-7xl">
        <BrowseTabs gapless showCenterDivider />

        <BrowseCategoryStrip
          activeCategory={selectedCategory}
          categories={categories}
          moreOptions={moreOptions}
          isOpen={showMorePanel}
          onOpenChange={setShowMorePanel}
          onCategoryChange={onCategoryChange}
        />

        <BrowseFilterBar
          onControlInteract={() => setShowMorePanel(false)}
          onApply={() => {
            setShowMorePanel(false);
            setHasAppliedFilters(true);
          }}
          resultsAnchorId="home-browse-results"
        />
      </div>

      {shouldShowPreviewMenu ? (
        <BrowseMenuSection
          sectionId="home-browse-results"
          title={activeCategoryLabel ? `${activeCategoryLabel} Menu` : "Menu"}
          items={previewItems}
          totalItems={totalItems}
          activeCategoryLabel={activeCategoryLabel}
          onSeeAllClick={onSeeAllClick}
        />
      ) : null}
    </section>
  );
}
