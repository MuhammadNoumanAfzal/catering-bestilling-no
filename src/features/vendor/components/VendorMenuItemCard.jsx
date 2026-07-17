export default function VendorMenuItemCard({ item, onClick }) {
  return (
    <article
      onClick={onClick}
      className="overflow-hidden rounded-[22px] border border-[#eadfd7] bg-white shadow-[0_10px_28px_rgba(35,22,12,0.08)] transition duration-200 hover:-translate-y-[2px] hover:border-[#d7c4b4] hover:shadow-[0_18px_34px_rgba(35,22,12,0.12)] cursor-pointer"
    >
      <div className="relative h-[165px] overflow-hidden bg-[#f2f2f2] sm:h-[175px]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      <div className="space-y-2.5 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.subcategory ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cf6e38] sm:text-xs">
              {item.subcategory}
            </p>
          ) : null}

          {item.tag ? (
            <span className="inline-flex rounded-full bg-[#fff1eb] px-2 py-0.5 text-[10px] font-medium text-[#cf5d2e]">
              {item.tag}
            </span>
          ) : null}
        </div>

        <h4 className="line-clamp-2 text-[1.28rem] font-semibold leading-tight text-[#1a1a1a] sm:text-[1.42rem]">
          {item.title}
        </h4>
        {item.serves ? (
          <p className="text-[0.98rem] font-medium text-[#3a342f]">
            Feeds {item.serves}
          </p>
        ) : null}

        {item.detailLines?.length ? (
          <div className="space-y-1.5">
            {item.detailLines.slice(0, 2).map((detail) => (
              <p
                key={detail}
                className="line-clamp-2 text-[0.9rem] leading-5 text-[#746b63]"
              >
                {detail}
              </p>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {item.dietaryLabels?.slice(0, 3).map((label) => (
            <span
              key={label}
              className="inline-flex rounded-full bg-[#faf4ee] px-3 py-1 text-xs font-medium lowercase text-[#7a6b5e]"
            >
              {label}
            </span>
          ))}
        </div>

        <p className="text-[1rem] font-semibold text-[#121212] sm:text-[1.08rem]">
          NOK {item.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
