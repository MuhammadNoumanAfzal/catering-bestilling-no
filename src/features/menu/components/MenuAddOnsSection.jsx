import { formatCurrency } from "../utils/formatters";
import { useTranslation } from "react-i18next";

function AddOnCard({
  option,
  quantity,
  onDecrease,
  onIncrease,
  canAdd = true,
}) {
  const { t } = useTranslation();
  return (
    <article className="w-[164px] shrink-0 overflow-hidden rounded-[18px] border border-[#ddd3cb] bg-white shadow-[0_8px_18px_rgba(39,24,13,0.05)] sm:w-[180px] lg:w-[196px]">
      <img
        src={option.image}
        alt={option.label}
        className="h-[86px] w-full object-cover"
      />
      <div className="p-2.5">
        <p className="text-[13px] font-semibold leading-4 text-[#1d1713]">
          {option.label}
        </p>
        <p className="mt-0.5 text-[12px] text-[#7d736b]">
          NOK {formatCurrency(option.price)}
        </p>

        {quantity > 0 ? (
          <div className="mt-2 flex items-center justify-between rounded-[12px] border border-[#d8cec4] bg-[#fff8f3] px-2.5 py-1.5 text-[12px] font-medium text-[#3e332b]">
            <button
              type="button"
              onClick={onDecrease}
              disabled={!canAdd}
              className="cursor-pointer px-1 text-[16px] text-[#8a7364]"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              disabled={!canAdd}
              className="cursor-pointer px-1 text-[16px] text-[#cf6e38]"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onIncrease}
            disabled={!canAdd}
            className={`mt-2 w-full rounded-[12px] border px-2.5 py-1.5 text-[12px] font-medium transition ${
              canAdd
                ? "cursor-pointer border-[#ddd3c8] text-[#4c4037] hover:border-[#cf6e38] hover:text-[#cf6e38]"
                : "cursor-not-allowed border-[#e7ddd4] bg-[#f7f2ed] text-[#a39286]"
            }`}
          >
            {canAdd ? t("menu.add") : t("menu.addMainDishFirst")}
          </button>
        )}
      </div>
    </article>
  );
}

export default function MenuAddOnsSection({
  addOnsSliderRef,
  addOnItems,
  hasMainDishInCart = false,
  selectedOptional,
  onScroll,
  onUpdateOptionalQuantity,
}) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-[#ece4dc] bg-[linear-gradient(180deg,#fffdfa_0%,#fff6ef_100%)] px-3 py-3 sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b37a59]">
            {t("menu.addOnsEyebrow")}
          </p>
          <h2 className="mt-1 text-[20px] font-semibold text-[#1c1713]">{t("menu.addOnsTitle")}</h2>
          <p className="mt-0.5 text-[12px] leading-5 text-[#6b5d53]">
            {t("menu.addOnsIntro")}
          </p>
          {!hasMainDishInCart ? (
            <p className="mt-1 text-[11px] leading-4 text-[#9a5f3d]">
              {t("menu.addOnsLocked")}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onScroll(-1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] bg-white text-[#8a7e74] shadow-[0_6px_12px_rgba(39,24,13,0.04)] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={() => onScroll(1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] bg-white text-[#8a7e74] shadow-[0_6px_12px_rgba(39,24,13,0.04)] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          >
            &#8250;
          </button>
        </div>
      </div>

      <div
        ref={addOnsSliderRef}
        className="mt-3 flex w-full gap-3 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {addOnItems.map((option) => {
          const optionKey = `${option.groupTitle}:${option.label}`;
          const quantity = selectedOptional[optionKey] ?? 0;

          return (
            <AddOnCard
              key={option.id}
              option={option}
              quantity={quantity}
              canAdd={hasMainDishInCart}
              onDecrease={() =>
                onUpdateOptionalQuantity(option.groupTitle, option.label, -1)
              }
              onIncrease={() =>
                onUpdateOptionalQuantity(option.groupTitle, option.label, 1)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
