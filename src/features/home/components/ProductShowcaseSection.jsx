import { FiStar } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function ProductItem({
  image,
  name,
  vendorSlug,
  rating,
  deliveryFee,
  discount,
}) {
  const navigate = useNavigate();

  return (
    <article
      className="group cursor-pointer"
      onClick={() => vendorSlug && navigate(`/vendor/${vendorSlug}`)}
    >
      <div className="overflow-hidden rounded-[18px] bg-[#f2f2f2]">
        <img
          src={image}
          alt={name}
          className="h-[168px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <h3 className="type-h4 truncate text-[#191919]">{name}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      {deliveryFee ? (
        <div className="type-subpara mt-1 flex items-center gap-1.5 text-[#666]">
          <LiaBicycleSolid className="text-[11px] text-[#888]" />
          <span>{deliveryFee}</span>
        </div>
      ) : null}

      {discount ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff1eb] px-2 py-1 text-[#ff6a3d]">
          {discount}
        </div>
      ) : null}
    </article>
  );
}

export default function ProductShowcaseSection({
  title,
  products,
  emptyMessage,
  seeAllLabel = "See all",
  onSeeAllClick,
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-white px-8 py-6 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        {title ? (
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="type-h3 font-semibold text-[#191919] sm:text-xl">
              {title}
            </h2>

            {onSeeAllClick ? (
              <button
                type="button"
                onClick={onSeeAllClick}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#d9d1c7] px-5 py-2 text-sm font-medium text-[#191919] transition hover:border-[#c46a35] hover:text-[#c46a35]"
              >
                {seeAllLabel || t("browse.seeAll")}
              </button>
            ) : null}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductItem key={product.id ?? product.name} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#ddd4cb] bg-[#fcfaf8] px-6 py-12 text-center text-sm text-[#6f675f]">
            {emptyMessage ?? t("browse.noProductsGeneric")}
          </div>
        )}
      </div>
    </section>
  );
}
