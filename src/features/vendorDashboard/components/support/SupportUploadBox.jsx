import { FiUploadCloud } from "react-icons/fi";

export default function SupportUploadBox({ fileName, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#2d2d2d]">
        Attachments (Optional)
      </span>

      <div className="rounded-[12px] border border-dashed border-[#cfc2b7] bg-white px-4 py-8 text-center">
        <input
          type="file"
          onChange={onChange}
          className="sr-only"
          id="support-ticket-file"
        />

        <label
          htmlFor="support-ticket-file"
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff2eb] text-[#cf6e38]">
            <FiUploadCloud className="text-[18px]" />
          </span>

          <span className="mt-3 text-sm font-semibold text-[#1f1f1f]">
            Click or drag to upload
          </span>
          <span className="mt-1 text-xs text-[#8b8177]">
            PNG, JPG, JPEG or WEBP image max 2MB
          </span>
          {fileName ? (
            <span className="mt-3 rounded-full bg-[#f8f2ec] px-3 py-1 text-xs font-semibold text-[#8a5d3b]">
              {fileName}
            </span>
          ) : null}
        </label>
      </div>
    </label>
  );
}
