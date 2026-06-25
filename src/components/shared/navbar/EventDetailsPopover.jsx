import { FiMinus, FiPlus } from "react-icons/fi";

export default function EventDetailsPopover({
  attendeeCount,
  attendeeInput,
  eventName,
  onApply,
  onClear,
  onAttendeeChange,
  onAttendeeInputChange,
  onEventNameChange,
}) {
  return (
    <div className="absolute left-[250px] top-[calc(100%+10px)] z-50 max-h-[calc(100vh-96px)] w-[450px] overflow-y-auto rounded-[18px] border border-[#e6ded4] bg-white p-6 py-8 shadow-[0_18px_60px_rgba(26,18,9,0.18)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="absolute -top-2 left-8 h-4 w-4 rotate-45 border-l border-t border-[#e6ded4] bg-white" />

      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="type-h4 ">Number of attendees</p>

          {attendeeCount > 0 || eventName.trim() ? (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-[13px] font-semibold text-[#c85f33] transition hover:text-[#a94b24]"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAttendeeChange(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#cfc7bc] cursor-pointer  transition hover:bg-[#f7f2ec]"
            aria-label="Decrease attendees"
          >
            <FiMinus className="text-[22px]" />
          </button>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={attendeeInput}
            onChange={(event) => onAttendeeInputChange(event.target.value)}
            className="inline-flex min-w-[68px] rounded-[6px] border border-[#cfc7bc] px-2 py-2 text-center text-[12px] font-medium outline-none transition focus:border-[#c85f33]"
            aria-label="Attendee count"
            placeholder="0"
          />
          <button
            type="button"
            onClick={() => onAttendeeChange(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#cfc7bc]  transition hover:bg-[#f7f2ec] cursor-pointer"
            aria-label="Increase attendees"
          >
            <FiPlus className="text-[22px]" />
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="navbar-event-name"
          className="mb-1 block text-[16px] font-bold"
        >
          Event name <span className="type-para">(optional)</span>
        </label>
        <input
          id="navbar-event-name"
          type="text"
          value={eventName}
          onChange={(event) => onEventNameChange(event.target.value)}
          className="h-8 w-full rounded-[4px] border border-[#cfc7bc] px-2 text-[12px]  outline-none transition focus:border-[#c85f33]"
        />
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-4 w-full rounded-[6px] bg-[#c85f33] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#b6542c] cursor-pointer"
      >
        Update results
      </button>
    </div>
  );
}
