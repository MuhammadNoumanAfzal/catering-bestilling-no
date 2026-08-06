import { FiUploadCloud } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { translateSupport } from "./supportI18n";

export default function SupportUploadBox({ disabled = false, fileName, onChange }) {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSupport(t, i18n, key, options);
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#2d2d2d]">
        {st("attachments")}
      </span>

      <div
        className={[
          "rounded-[12px] border border-dashed px-4 py-8 text-center",
          disabled ? "border-[#ddd2ca] bg-[#f6f1ec]" : "border-[#cfc2b7] bg-white",
        ].join(" ")}
      >
        <input
          className="sr-only"
          disabled={disabled}
          id="support-ticket-file"
          onChange={onChange}
          type="file"
        />

        <label
          className={[
            "flex flex-col items-center justify-center",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          htmlFor="support-ticket-file"
        >
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full",
              disabled ? "bg-[#ece5df] text-[#9f9388]" : "bg-[#fff2eb] text-[#cf6e38]",
            ].join(" ")}
          >
            <FiUploadCloud className="text-[18px]" />
          </span>

          <span className="mt-3 text-sm font-semibold text-[#1f1f1f]">
            {disabled ? st("attachmentUnavailable") : st("clickOrDrag")}
          </span>
          <span className="mt-1 text-xs text-[#8b8177]">
            {disabled
              ? st("attachmentDisabledHint")
              : st("attachmentHint")}
          </span>
          {fileName && !disabled ? (
            <span className="mt-3 rounded-full bg-[#f8f2ec] px-3 py-1 text-xs font-semibold text-[#8a5d3b]">
              {fileName}
            </span>
          ) : null}
        </label>
      </div>
    </label>
  );
}
