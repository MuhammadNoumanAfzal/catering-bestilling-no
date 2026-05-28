export default function OtpInput({
  length = 4,
  value = "",
  onChange,
}) {
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const handleDigitChange = (index, nextValue) => {
    const sanitizedValue = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitizedValue;
    onChange?.(nextDigits.join(""));
  };

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={digit}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          className="h-13 w-13 rounded-[18px] border border-[#ddd3ca] bg-[#fffdfa] text-center text-[20px] font-semibold text-[#1d1a17] outline-none transition focus:border-[#c85f33] focus:ring-4 focus:ring-[#c85f33]/10"
        />
      ))}
    </div>
  );
}
