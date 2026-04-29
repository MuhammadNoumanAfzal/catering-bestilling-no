import { useState } from "react";
import { FiChevronDown, FiMinusCircle, FiPlusCircle, FiX } from "react-icons/fi";

function OptionRow({ option, type = "radio", selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full cursor-pointer items-start gap-3 border-b border-[#e6e6e6] py-4 text-left"
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border text-[12px] font-bold ${
          type === "checkbox" ? "rounded-[6px]" : "rounded-full"
        } ${
          selected
            ? "border-[#cf6e38] bg-[#cf6e38]/10 text-[#cf6e38]"
            : "border-[#bfbfbf] text-transparent"
        }`}
      >
        {"\u2713"}
      </span>

      <span className="min-w-0">
        <span className="block text-[16px] text-[#1b1b1b]">
          {option.label ?? option}
        </span>
        {option.price ? (
          <span className="mt-1 block text-[13px] text-[#666]">
            +NOK {option.price.toFixed(2)}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export default function VendorMenuItemModal({ item, onClose }) {
  const [selectedQuantity, setSelectedQuantity] = useState(
    item.modal.quantityOptions[0] ?? "1 order",
  );
  const [showQuantityOptions, setShowQuantityOptions] = useState(false);
  const [selectedRequired, setSelectedRequired] = useState(
    item.modal.requiredSelection.options[0],
  );
  const [selectedOptional, setSelectedOptional] = useState({});
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [instructions, setInstructions] = useState("");

  const toggleOptional = (groupTitle, optionLabel) => {
    setSelectedOptional((current) => {
      const key = `${groupTitle}:${optionLabel}`;
      return {
        ...current,
        [key]: !current[key],
      };
    });
  };

  const handleAddToOrder = () => {
    const quantityCount = Number.parseInt(selectedQuantity, 10) || 1;
    const totalServes = item.serves * quantityCount;
    const itemName = item.modal?.heading ?? item.title ?? "Item";
    const selectedAddOns = Object.entries(selectedOptional)
      .filter(([, isSelected]) => isSelected)
      .map(([key]) => key.split(":")[1]);

    onClose({
      id: `${item.id}-${Date.now()}`,
      name: itemName,
      quantity: quantityCount,
      serves: item.serves,
      totalServes,
      unitPrice: Number(item.modal.pricePerPerson),
      price: Number(item.modal.pricePerPerson) * totalServes,
      details: [
        `Serves ${item.serves}`,
        selectedQuantity,
        selectedRequired,
        ...selectedAddOns,
        instructions ? `Note: ${instructions}` : null,
      ].filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 px-3 py-4 sm:px-6">
      <div className="mx-auto flex h-full max-h-[90vh] max-w-2xl flex-col overflow-hidden rounded-[18px] bg-white shadow-2xl">
        <div className="relative">
          <img
            src={item.image}
            alt={item.modal.heading}
            className="h-[180px] w-full object-cover sm:h-[210px]"
          />
          <button
            type="button"
            onClick={() => onClose()}
            className="absolute right-4 top-4 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-[#1f1f1f] shadow"
          >
            <FiX className="text-[28px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[#ececec] px-5 py-4 sm:px-6">
            <h2 className="text-[24px] font-semibold text-[#151515]">
              {item.modal.heading}
            </h2>
            <p className="mt-2 text-[16px] text-[#151515]">
              <span className="font-bold">NOK {item.modal.pricePerPerson}</span> / person
            </p>
            <span className="mt-4 inline-flex rounded-[8px] bg-[#efefef] px-3 py-1 text-[14px] font-semibold text-[#1f1f1f]">
              {item.modal.badge}
            </span>
            <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[#565656]">
              {item.description}
            </p>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <h3 className="text-[16px] font-semibold text-[#1d1d1d]">
              Select quantity:
            </h3>

            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setShowQuantityOptions((current) => !current)}
                className="flex w-full cursor-pointer items-center justify-between rounded-[14px] border border-[#d2d2d2] px-4 py-4 text-[16px] text-[#1f1f1f]"
              >
                <span>{selectedQuantity}</span>
                <FiChevronDown className="text-[20px]" />
              </button>

              {showQuantityOptions ? (
                <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-full rounded-[14px] border border-[#ddd6cd] bg-white p-2 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
                  {item.modal.quantityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedQuantity(option);
                        setShowQuantityOptions(false);
                      }}
                      className={`block w-full cursor-pointer rounded-[10px] px-3 py-2 text-left text-[15px] transition ${
                        selectedQuantity === option
                          ? "bg-[#fff1eb] text-[#cf6e38]"
                          : "text-[#1f1f1f] hover:bg-[#f7f2ec]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[#ececec] px-5 py-4 sm:px-6">
            <h3 className="text-[16px] font-semibold text-[#1d1d1d]">
              {item.modal.requiredSelection.title}
            </h3>
            <p className="mt-1 text-[14px] text-[#666]">
              {item.modal.requiredSelection.subtitle}
            </p>

            <div className="mt-2">
              {item.modal.requiredSelection.options.map((option) => (
                <OptionRow
                  key={option}
                  option={option}
                  selected={selectedRequired === option}
                  onToggle={() => setSelectedRequired(option)}
                />
              ))}
            </div>
          </div>

          {item.modal.optionalSelections.map((group) => (
            <div
              key={group.title}
              className="border-t border-[#ececec] px-5 py-4 sm:px-6"
            >
              <h3 className="text-[16px] font-semibold text-[#1d1d1d]">
                {group.title}
              </h3>
              <p className="mt-1 text-[14px] text-[#666]">{group.subtitle}</p>

              <div className="mt-2">
                {group.options.map((option) => (
                  <OptionRow
                    key={`${group.title}-${option.label}`}
                    option={option}
                    type="checkbox"
                    selected={Boolean(
                      selectedOptional[`${group.title}:${option.label}`],
                    )}
                    onToggle={() => toggleOptional(group.title, option.label)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-[#ececec] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setInstructionsOpen((current) => !current)}
              className="inline-flex cursor-pointer items-center gap-2 text-[16px] font-medium text-[#1d1d1d]"
            >
              {instructionsOpen ? (
                <FiMinusCircle className="text-[18px]" />
              ) : (
                <FiPlusCircle className="text-[18px]" />
              )}
              Add special instructions
            </button>

            {instructionsOpen ? (
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder={item.modal.instructionPlaceholder}
                className="mt-4 h-28 w-full rounded-[16px] border border-[#1f1f1f] px-4 py-3 text-[14px] text-[#1d1d1d] outline-none"
              />
            ) : null}
          </div>
        </div>

        <div className="border-t border-[#ececec] bg-white px-5 py-4">
          <button
            type="button"
            onClick={handleAddToOrder}
            className="flex w-full cursor-pointer items-center justify-between rounded-full bg-[#cf6e38] px-6 py-4 text-left text-white"
          >
            <span className="text-[16px] font-semibold">
              Make 1 required selection
            </span>
            <span className="text-right">
              <span className="block text-[18px] font-bold">
                NOK {item.modal.pricePerPerson}
              </span>
              <span className="block text-[14px]">
                NOK {item.modal.pricePerPerson} / person
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
