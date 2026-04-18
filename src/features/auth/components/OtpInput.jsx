export default function OtpInput({ length = 4 }) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode="numeric"
          className="type-h5 h-13 w-13 rounded-2xl border border-[#ddd6ce] text-center text-[#1d1a17] outline-none transition focus:border-[#c85f33] focus:ring-2 focus:ring-[#c85f33]/15"
        />
      ))}
    </div>
  );
}
