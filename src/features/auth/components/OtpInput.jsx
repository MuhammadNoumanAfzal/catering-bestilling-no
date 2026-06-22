import { useEffect, useRef } from "react";

export default function OtpInput({
  length = 4,
  value = "",
  onChange,
}) {
  const inputRefs = useRef([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index, nextValue) => {
    const sanitizedValue = nextValue.replace(/\D/g, "");
    if (!sanitizedValue) return;

    const char = sanitizedValue.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    onChange?.(nextDigits.join(""));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!digits[index]) {
        if (index > 0) {
          const nextDigits = [...digits];
          nextDigits[index - 1] = "";
          onChange?.(nextDigits.join(""));
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current field
        const nextDigits = [...digits];
        nextDigits[index] = "";
        onChange?.(nextDigits.join(""));
      }
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length);
    if (pasteData) {
      onChange?.(pasteData);
      const targetIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          inputMode="numeric"
          value={digit}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="h-13 w-13 rounded-[18px] border border-[#ddd3ca] bg-[#fffdfa] text-center text-[20px] font-semibold text-[#1d1a17] outline-none transition focus:border-[#c85f33] focus:ring-4 focus:ring-[#c85f33]/10"
        />
      ))}
    </div>
  );
}
