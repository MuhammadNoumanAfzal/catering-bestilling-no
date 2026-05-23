import SupportAudienceSelector from "./SupportAudienceSelector";
import SupportField from "./SupportField";
import SupportUploadBox from "./SupportUploadBox";

export default function SupportTicketForm({
  audienceOptions,
  fileName,
  formState,
  onAudienceChange,
  onFieldChange,
  onFileChange,
  onSubmit,
  subjectOptions,
}) {
  return (
    <section className="rounded-[18px] border border-[#d9cec4] bg-white shadow-[0_14px_32px_rgba(30,20,12,0.05)]">
      <div className="border-b border-[#eee4da] px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-[#201b17]">
          Submit a Support Ticket
        </h2>
        <p className="mt-1 text-sm text-[#746b63]">
          Describe your issue and our team will get back to you.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6">
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

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-[10px] bg-[#cf6e38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </section>
  );
}
