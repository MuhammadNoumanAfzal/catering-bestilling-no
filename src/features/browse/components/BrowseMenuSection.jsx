import MenuCard from "../../../components/shared/MenuCard";

export default function BrowseMenuSection({ title, items, totalItems }) {
  return (
    <section className="mt-12 ">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h3 font-semibold text-[#191919]">{title}</h2>
          <p className="text-sm text-[#777]">
            {totalItems ?? items.length} items
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ">
          {items.map((item) => (
            <MenuCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
