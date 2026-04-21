import { formatCurrency } from "./menuDetailsUtils";

function AddOnCard({ option, quantity, onDecrease, onIncrease }) {
  return (
    <article className="w-[calc(50%-0.375rem)] shrink-0 overflow-hidden rounded-[16px] border border-[#d9d0c8] bg-white shadow-[0_4px_12px_rgba(39,24,13,0.06)] sm:w-[calc((100%-0.75rem)/3)] lg:w-[calc((100%-3rem)/5)] xl:w-[calc((100%-5.25rem)/10 )]">
      <img
        src={option.image}
        alt={option.label}
        className="h-[104px] w-full object-cover"
      />
      <div className="p-2.5">
        <p className="text-para font-semibold leading-5 text-[#1d1713]">
          {option.label}
        </p>
        <p className="mt-1 type-para text-[#7d736b]">
          NOK {formatCurrency(option.price)}
        </p>

        {quantity > 0 ? (
          <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#d8cec4] px-3 py-1.5 text-[13px] text-[#3e332b]">
            <button
              type="button"
              onClick={onDecrease}
              className="cursor-pointer px-1 text-[16px]"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              className="cursor-pointer px-1 text-[16px]"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onIncrease}
            className="mt-3 w-full cursor-pointer rounded-[10px] border border-[#ddd3c8] px-3 py-2 text-[13px] font-medium text-[#4c4037]"
          >
            Add
          </button>
        )}
      </div>
    </article>
  );
}

export default function MenuAddOnsSection({
  addOnsSliderRef,
  addOnItems,
  selectedOptional,
  onScroll,
  onUpdateOptionalQuantity,
}) {
  return (
    <div className="border-t border-[#ece4dc] bg-white px-4 py-5 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-semibold text-[#1c1713]">Add-ons</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onScroll(-1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] text-[#8a7e74]"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={() => onScroll(1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#d8cec4] text-[#8a7e74]"
          >
            &#8250;
          </button>
        </div>
      </div>

      <div
        ref={addOnsSliderRef}
        className="mt-4 flex w-full gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
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
