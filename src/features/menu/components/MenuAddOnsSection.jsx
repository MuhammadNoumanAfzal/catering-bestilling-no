import { formatCurrency } from "../utils/formatters";

function AddOnCard({
  option,
  quantity,
  onDecrease,
  onIncrease,
  canAdd = true,
}) {
  return (
    <article className="w-[188px] shrink-0 overflow-hidden rounded-[22px] border border-[#ddd3cb] bg-white shadow-[0_12px_28px_rgba(39,24,13,0.06)] sm:w-[210px] lg:w-[228px]">
      <img
        src={option.image}
        alt={option.label}
        className="h-[112px] w-full object-cover"
      />
      <div className="p-3">
        <p className="text-para font-semibold leading-5 text-[#1d1713]">
          {option.label}
        </p>
        <p className="mt-1 text-[13px] text-[#7d736b]">
          NOK {formatCurrency(option.price)}
        </p>

        {quantity > 0 ? (
          <div className="mt-3 flex items-center justify-between rounded-[14px] border border-[#d8cec4] bg-[#fff8f3] px-3 py-2 text-[13px] font-medium text-[#3e332b]">
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
            className={`mt-3 w-full rounded-[14px] border px-3 py-2 text-[13px] font-medium transition ${
              canAdd
                ? "cursor-pointer border-[#ddd3c8] text-[#4c4037] hover:border-[#cf6e38] hover:text-[#cf6e38]"
                : "cursor-not-allowed border-[#e7ddd4] bg-[#f7f2ed] text-[#a39286]"
            }`}
          >
            {canAdd ? "Add" : "Add main dish first"}
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
  return (
    <div className="border-t border-[#ece4dc] bg-[linear-gradient(180deg,#fffdfa_0%,#fff6ef_100%)] px-4 py-4 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b37a59]">
            Customize your order
          </p>
          <h2 className="mt-2 text-[24px] font-semibold text-[#1c1713]">Add-ons</h2>
          <p className="mt-1 text-[14px] leading-6 text-[#6b5d53]">
            Add extras or side items to tailor the menu for your team.
          </p>
          {!hasMainDishInCart ? (
            <p className="mt-2 text-[13px] leading-5 text-[#9a5f3d]">
              Select any add-ons you want, then add the main dish to cart. Add-ons cannot be ordered alone.
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onScroll(-1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] bg-white text-[#8a7e74] shadow-[0_10px_18px_rgba(39,24,13,0.05)] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={() => onScroll(1)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] bg-white text-[#8a7e74] shadow-[0_10px_18px_rgba(39,24,13,0.05)] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
          >
            &#8250;
          </button>
        </div>
      </div>

      <div
        ref={addOnsSliderRef}
        className="mt-4 flex w-full gap-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
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
