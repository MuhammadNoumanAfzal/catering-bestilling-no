import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { PLACEHOLDERS } from "./checkoutPage.constants";

export default function EventDetailsSection({
  mode,
  formState,
  updateField,
  updateCartField,
}) {
  const eventLabel = mode === "corporate" ? "Event Name" : "Occasion";
  const eventKey = mode === "corporate" ? "eventName" : "occasion";
  const eventPlaceholder =
    mode === "corporate" ? PLACEHOLDERS.eventName : PLACEHOLDERS.occasion;

  const adjustPersonCount = (delta) => {
    const nextPersonCount = Math.max(1, Number(formState.personCount) + delta);
    updateField("personCount", nextPersonCount);
    updateCartField("personCount", nextPersonCount);
  };

  return (
    <CheckoutSection title="Event Details">
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckoutField
          label={eventLabel}
          value={formState[eventKey]}
          onChange={(event) => updateField(eventKey, event.target.value)}
          placeholder={eventPlaceholder}
          className="sm:col-span-2"
        />
        <CheckoutField
          label="Date"
          type="date"
          value={formState.date}
          onChange={(event) => {
            updateField("date", event.target.value);
            updateCartField("deliveryDate", event.target.value);
          }}
          inputClassName="cursor-pointer"
        />
        <CheckoutField
          label="Time"
          type="time"
          value={formState.time}
          onChange={(event) => {
            updateField("time", event.target.value);
            updateCartField("deliveryTime", event.target.value);
          }}
          inputClassName="cursor-pointer"
        />
      </div>

      <div className="mt-3">
        <span className="type-subpara mb-1 block text-[#2d2d2d]">
          Person Count
        </span>
        <div className="inline-flex items-center border border-[#d9d1c7] bg-white">
          <button
            type="button"
            onClick={() => adjustPersonCount(-1)}
            className="type-subpara h-8 w-8 cursor-pointer border-r border-[#d9d1c7] text-[#2d2d2d]"
          >
            -
          </button>
          <span className="type-subpara inline-flex min-w-[56px] justify-center px-3 text-[#2d2d2d]">
            {formState.personCount}
          </span>
          <button
            type="button"
            onClick={() => adjustPersonCount(1)}
            className="type-subpara h-8 w-8 cursor-pointer border-l border-[#d9d1c7] text-[#2d2d2d]"
          >
            +
          </button>
        </div>
      </div>
    </CheckoutSection>
  );
}
