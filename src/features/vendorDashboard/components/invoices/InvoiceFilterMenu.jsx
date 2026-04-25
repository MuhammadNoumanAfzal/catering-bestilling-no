import { FiChevronDown } from "react-icons/fi";

export default function InvoiceFilterMenu({
  isOpen,
  label,
  onToggle,
  options,
  selectedValue,
  onSelect,
  menuRef,
  renderContent,
}) {
  return (
    <div className="relative w-full sm:w-auto" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-3 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#faf7f3] sm:w-auto sm:justify-start"
      >
        <span>
          {options.find((option) => option.value === selectedValue)?.label ?? label}
        </span>
        <FiChevronDown
          className={["text-[15px] transition", isOpen ? "rotate-180" : ""].join(" ")}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 rounded-2xl border border-[#e5ddd5] bg-white p-2 shadow-[0_18px_40px_rgba(31,24,19,0.12)] sm:left-auto sm:right-0 sm:min-w-[180px]">
          {renderContent
            ? renderContent()
            : options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSelect(option.value)}
                    className={[
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition",
                      isSelected
                        ? "bg-[#fff1e8] font-semibold text-[#c85f33]"
                        : "text-[#2f2f2f] hover:bg-[#faf7f3]",
                    ].join(" ")}
                  >
                    <span>{option.label}</span>
                    {isSelected ? <span className="text-xs font-semibold">Active</span> : null}
                  </button>
                );
              })}
        </div>
      ) : null}
    </div>
  );
}
