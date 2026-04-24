export default function OtpInput({ length = 4 }) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode="numeric"
          className="h-13 w-13 rounded-[18px] border border-[#ddd3ca] bg-[#fffdfa] text-center text-[20px] font-semibold text-[#1d1a17] outline-none transition focus:border-[#c85f33] focus:ring-4 focus:ring-[#c85f33]/10"
        />
      ))}
    </div>
  );
}
