import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  readOnly = false,
  className = "",
  required = false,
}) {
  const isPasswordField = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const resolvedType =
    isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <label className="block">
      {label ? (
        <span className="mb-2.5 block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6d6259]">
          {label}
        </span>
      ) : (
        <span className="mb-2 block h-[17px]" aria-hidden="true" />
      )}
      <div className="relative">
        <input
          type={resolvedType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          required={required}
          className={`type-para h-13 w-full rounded-[18px] border border-[#ddd3ca] bg-[#fffdfa] px-4 text-[#1d1a17] outline-none transition placeholder:text-[#b4aba2] focus:border-[#c85f33] focus:bg-white focus:ring-4 focus:ring-[#c85f33]/10 ${
            isPasswordField ? "pr-12" : ""
          } ${className}`}
        />
        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[#9a8d82] transition hover:text-[#c85f33]"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <FiEyeOff className="text-[18px]" />
            ) : (
              <FiEye className="text-[18px]" />
            )}
          </button>
        ) : null}
      </div>
    </label>
  );
}
