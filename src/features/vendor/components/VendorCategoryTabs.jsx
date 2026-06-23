export default function VendorCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="border-b border-[#ece5dc] pb-6">
      <div className="hide-scrollbar flex items-center gap-5 overflow-x-auto pb-2 text-[14px] font-semibold">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 border-b pb-2 transition ${
                isActive
                  ? "cursor-pointer border-[#1a1a1a] font-semibold text-[#1a1a1a]"
                  : "cursor-pointer border-transparent text-[#5f5f5f]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
