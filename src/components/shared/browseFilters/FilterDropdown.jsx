export default function FilterDropdown({
  minWidthClassName,
  children,
  onClear,
}) {
  return (
    <div
      className={`absolute left-0 top-[calc(100%+12px)] z-30 w-full max-w-[min(20rem,calc(100vw-2rem))] rounded-[12px] border border-[#d9d9d9] bg-white p-2 shadow-[0_12px_26px_rgba(0,0,0,0.16)] sm:w-auto ${minWidthClassName}`}
    >
      <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-[#d9d9d9] bg-white" />
      <div className="space-y-1">{children}</div>
      <div className="mt-2 flex justify-end">
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
