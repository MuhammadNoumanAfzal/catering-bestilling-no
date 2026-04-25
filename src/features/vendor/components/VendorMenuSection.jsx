import VendorMenuItemCard from "./VendorMenuItemCard";

export default function VendorMenuSection({ section, onItemClick }) {
  return (
    <section className="scroll-mt-36 rounded-[20px] border border-[#efe4da] bg-[#fffdfa] p-4 sm:p-5">
      <div className="max-w-3xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#cf6e38]">
          Menu Category
        </p>
        <h3 className="mt-2 type-h4 text-[#111]">{section.title}</h3>
        <p className="mt-2 text-[15px] leading-6 text-[#756b61]">
          {section.items[0]?.description}
        </p>
      </div>

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
