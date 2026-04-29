export default function VendorMenuItemCard({ item, onClick }) {
  return (
    <article
      onClick={onClick}
      className="grid min-h-[176px] cursor-pointer grid-cols-[1fr_112px] overflow-hidden rounded-[18px] border border-[#e7dfd6] bg-white shadow-[0_10px_24px_rgba(31,19,8,0.05)] transition hover:-translate-y-0.5 hover:border-[#d7c4b4]"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.subcategory ? (
            <p className="text-subpara font-semibold uppercase tracking-[0.08em] text-[#cf6e38]">
              {item.subcategory}
            </p>
          ) : null}

          {item.tag ? (
            <span className="inline-flex rounded-full bg-[#fff1eb] px-2 py-0.5 text-[9px] font-semibold text-[#cf5d2e]">
              {item.tag}
            </span>
          ) : null}
        </div>

        <h4 className="mt-2 text-[17px] font-semibold leading-6 text-[#1a1a1a]">
          {item.title}
        </h4>
        <p className="mt-2 text-subpara font-medium text-[#5d5d5d]">
          Feeds {item.serves}
        </p>

        <div className="mt-2 space-y-1.5">
          {item.detailLines?.map((detail) => (
            <p key={detail} className="text-subpara leading-5 text-[#87807a]">
              {detail}
            </p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.dietaryLabels?.map((label) => (
            <span
              key={label}
              className="inline-flex rounded-full bg-[#f6f1ea] px-2.5 py-1 text-[11px] font-medium text-[#5e5349]"
            >
              {label}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[18px] font-semibold text-[#121212]">
          NOK {item.price.toFixed(2)}
        </p>
      </div>

      <div className="relative h-full">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
    </article>
  );
}
