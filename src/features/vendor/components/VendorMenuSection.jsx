import VendorMenuItemCard from "./VendorMenuItemCard";

export default function VendorMenuSection({ section, onItemClick }) {
  return (
    <section className="mt-6">
      <h3 className="type-h4 text-[#111]">{section.title}</h3>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        {section.items.map((item) => (
          <VendorMenuItemCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </section>
  );
}
