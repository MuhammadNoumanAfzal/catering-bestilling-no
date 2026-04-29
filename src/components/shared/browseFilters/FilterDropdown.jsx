export default function FilterDropdown({
  minWidthClassName,
  children,
  onClear,
  mobileAlign = "left",
}) {
  const mobilePositionClassName =
    mobileAlign === "right" ? "right-0 left-auto" : "left-0 right-auto";

  return (
    <div
      className={`absolute top-[calc(100%+12px)] z-30 w-[min(20rem,calc(100vw-1.25rem))] max-w-[calc(100vw-1.25rem)] rounded-[12px] border border-[#d9d9d9] bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.16)] ${mobilePositionClassName} sm:left-0 sm:right-auto sm:w-auto sm:max-w-[20rem] ${minWidthClassName}`}
    >
      <span
        className={`absolute top-0 h-3 w-3 -translate-y-1/2 rotate-45 border-l border-t border-[#d9d9d9] bg-white ${
          mobileAlign === "right"
            ? "right-6"
            : "left-6"
        } sm:left-1/2 sm:right-auto sm:-translate-x-1/2`}
      />
      <div className="max-h-[min(18rem,calc(100vh-14rem))] space-y-1 overflow-y-auto pr-1">
        {children}
      </div>
      <div className="mt-2 flex justify-end border-t border-[#f1ece6] pt-2">
        <button
          type="button"
          onClick={onClear}
          className="type-para cursor-pointer rounded-[6px] border border-[#bcbcbc] px-2 py-1 text-black"
        >
          Clear filter
        </button>
      </div>
    </div>
  );
}
