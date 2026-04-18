export default function VendorMenuItemCard({ item, onClick }) {
  return (
    <article
      onClick={onClick}
      className="grid min-h-[144px] cursor-pointer grid-cols-[1fr_112px] overflow-hidden rounded-[10px] border border-[#e7dfd6] bg-white"
    >
      <div className="p-2">
        {item.subcategory ? (
          <p className="text-subpara font-semibold uppercase tracking-[0.08em] text-[#cf6e38]">
            {item.subcategory}
          </p>
        ) : null}
        <h4 className="text-subpara font-semibold text-[#1a1a1a]">{item.title}</h4>
        <p className="mt-2 text-subpara font-medium text-[#5d5d5d]">
          Feeds {item.serves}
        </p>
        <p className="mt-2  text-subpara leading-4 text-[#87807a]">
          {item.description}
        </p>

        {item.tag ? (
          <span className="mt-4 inline-flex rounded-full bg-[#fff1eb] px-2 py-0.5 text-[9px] font-semibold text-[#cf5d2e]">
            {item.tag}
          </span>
        ) : null}

        <p className="mt-3 text-[18px] font-semibold text-[#121212]">
          {item.price.toFixed(2)}
        </p>
      </div>

      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />
    </article>
  );
}
