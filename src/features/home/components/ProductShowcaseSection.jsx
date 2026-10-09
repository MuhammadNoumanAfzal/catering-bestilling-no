import { FiStar } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostalCodePrompt } from "../../location/PostalCodePromptContext";

export function ProductItem({
  id,
  image,
  name,
  vendorSlug,
  rating,
  discount,
  vendorData,
  price,
  pricingType,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { requirePostalCodeForMenu } = usePostalCodePrompt();
  const productPath =
    vendorSlug && id
      ? "/vendor/" + encodeURIComponent(vendorSlug) + "/menu/" + encodeURIComponent(id)
      : vendorSlug
        ? "/vendor/" + encodeURIComponent(vendorSlug)
        : "";

  const handleClick = () => {
    if (!productPath) {
      return;
    }

    requirePostalCodeForMenu({
      vendor: vendorData,
      onAvailable: () => {
        const returnPath = `${location.pathname}${location.search}${location.hash}`;
        window.sessionStorage.setItem("gocatering-menu-back-target", returnPath);
        navigate(productPath, {
          state: { from: returnPath },
        });
      },
    });
  };

  return (
    <article
      className="group cursor-pointer pb-2"
      onClick={handleClick}
    >
      <div className="overflow-hidden rounded-[18px] bg-[#f2f2f2]">
        <img
          src={image}
          alt={name}
          className="h-[184px] w-full object-cover transition duration-300 group-hover:scale-105 sm:h-[168px]"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <h3 className="type-h4 min-w-0 flex-1 truncate text-[#191919]">{name}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 pt-0.5 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      {price ? (
        <p className="mt-2 text-[20px] font-semibold text-[#191919]">
          {price} {t(pricingType === "per-person" ? "products.pricePerPerson" : "products.pricePerOrder")}
        </p>
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
  seeAllLabel,
  onSeeAllClick,
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-white px-6 py-8 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        {title ? (
          <div className="mb-6 flex items-start justify-between gap-5">
            <h2 className="type-h3 max-w-[70%] font-semibold leading-tight text-[#191919] sm:max-w-none sm:text-xl">
              {title}
            </h2>

            {onSeeAllClick ? (
              <button
                type="button"
                onClick={onSeeAllClick}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#d9d1c7] px-4 py-2 text-sm font-medium text-[#191919] transition hover:border-[#c46a35] hover:text-[#c46a35] sm:px-5"
              >
                {seeAllLabel || t("browse.seeAll")}
              </button>
            ) : null}
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
