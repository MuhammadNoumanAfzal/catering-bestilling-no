import SupportAudienceSelector from "./SupportAudienceSelector";
import SupportField from "./SupportField";
import SupportUploadBox from "./SupportUploadBox";

export default function SupportTicketForm({
  audienceOptions,
  fileName,
  formState,
  isSubmitting = false,
  onAudienceChange,
  onFieldChange,
  onFileChange,
  onSubmit,
  subjectOptions,
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#e5d8cc] bg-[linear-gradient(180deg,#fffdfb_0%,#fff8f2_100%)] shadow-[0_18px_40px_rgba(30,20,12,0.06)]">
      <div className="border-b border-[#eee4da] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,247,239,0.9))] px-5 py-5 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ad7a5f]">
          Support request
        </p>
        <h2 className="text-lg font-semibold text-[#201b17]">
          Submit a Support Ticket
        </h2>
        <p className="mt-1 text-sm text-[#746b63]">
          Describe your issue and our team will get back to you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6">
        <div>
          <span className="mb-2 block text-sm font-semibold text-[#2d2d2d]">
            I am
          </span>
          <SupportAudienceSelector
            value={formState.audience}
            onChange={onAudienceChange}
            options={audienceOptions}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SupportField
            as="select"
            label="Subject/Issue Type"
            value={formState.subject}
            onChange={(event) => onFieldChange("subject", event.target.value)}
          >
            <option value="">Select issue type</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SupportField>

          <SupportField
            label="Related Order (Optional)"
            value={formState.orderId}
            onChange={(event) => onFieldChange("orderId", event.target.value)}
            placeholder="Enter Order ID (e.g. #12450)"
          />
        </div>

        <SupportField
          as="textarea"
          label="Description"
          value={formState.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Please describe your issue in detail..."
        >
          <div className="mt-1 text-right text-[11px] text-[#9b9188]">
            {formState.description.length}/500
          </div>
        </SupportField>

        <SupportUploadBox fileName={fileName} onChange={onFileChange} />

        {fileName ? (
          <p className="text-xs text-[#8b8177]">
            Attachment selected. It will be linked once file upload API is
            available.
          </p>
        ) : null}

        <div className="flex justify-end border-t border-[#eee4da] pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[14px] bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
          >
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>
    </section>
  );
}
