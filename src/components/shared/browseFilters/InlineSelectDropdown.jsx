import { FiCheck, FiChevronDown } from "react-icons/fi";

export default function InlineSelectDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  menuPosition = "bottom",
}) {
  const isActiveValue = value !== "Any price" && value !== "Any distance";
  const menuPositionClassName =
    menuPosition === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]";

  return (
    <div className="relative">
      <p className="type-para mb-1 text-black">{label}</p>
      <button
        type="button"
        onClick={onToggle}
        className={`type-subpara flex w-full items-center justify-between rounded-[2px] border bg-white px-3 py-2 text-left outline-none transition ${
          isActiveValue
            ? "border-[#CF3A00] text-[#CF3A00]"
            : "border-[#cfcfcf] text-black"
        }`}
      >
        <span>{value}</span>
        <FiChevronDown
          className={`text-[18px] ${
            isActiveValue ? "text-[#CF3A00]" : "text-[#666]"
          }`}
        />
      </button>

      {isOpen ? (
        <div
          className={`absolute left-0 z-20 w-full max-w-[min(16rem,calc(100vw-3rem))] rounded-[8px] border border-[#d9d9d9] bg-white p-1 shadow-[0_12px_26px_rgba(0,0,0,0.16)] sm:w-[250px] ${menuPositionClassName}`}
        >
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={`type-subpara flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left transition ${
                  isSelected
                    ? "bg-[#fff1eb] text-[#CF3A00]"
                    : "text-black hover:bg-[#f7f2ec]"
                }`}
              >
                <span>{option}</span>
                <span className="flex w-4 justify-center">
                  {isSelected ? (
                    <FiCheck className="text-[14px] text-[#CF3A00]" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
