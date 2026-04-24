export default function MultiSelectIndicator({ isSelected }) {
  return (
    <span
      className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
        isSelected
          ? "border-[#CF3A00] bg-[#CF3A00]"
          : "border-[#bcbcbc] bg-white"
      }`}
    >
      {isSelected ? (
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      ) : null}
    </span>
  );
}
