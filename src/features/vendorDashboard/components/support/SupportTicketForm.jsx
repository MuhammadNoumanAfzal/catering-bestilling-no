import SupportField from "./SupportField";
import SupportUploadBox from "./SupportUploadBox";
import { useTranslation } from "react-i18next";

export default function SupportTicketForm({
  attachmentError,
  attachmentUploadAvailable = true,
  fileName,
  formState,
  isSubmitting = false,
  onFieldChange,
  onFileChange,
  onSubmit,
  subjectOptions,
}) {
  const { t } = useTranslation();
  return (
    <section className="rounded-[18px] border border-[#d9cec4] bg-white shadow-[0_14px_32px_rgba(30,20,12,0.05)]">
      <div className="border-b border-[#eee4da] px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-[#201b17]">
          {t("vendorPanel.supportPage.submitTitle")}
        </h2>
        <p className="mt-1 text-sm text-[#746b63]">
          {t("vendorPanel.supportPage.submitDescription")}
        </p>
      </div>

      <form className="space-y-4 px-5 py-5 sm:px-6" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <SupportField
            as="select"
            label={t("vendorPanel.supportPage.subject")}
            onChange={(event) => onFieldChange("subject", event.target.value)}
            value={formState.subject}
          >
            <option value="">{t("vendorPanel.supportPage.selectIssueType")}</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </SupportField>

          <SupportField
            label={t("vendorPanel.supportPage.relatedOrder")}
            onChange={(event) => onFieldChange("orderId", event.target.value)}
            placeholder={t("vendorPanel.supportPage.relatedOrderPlaceholder")}
            value={formState.orderId}
          />
        </div>

        <SupportField
          as="textarea"
          label={t("vendorPanel.supportPage.descriptionLabel")}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder={t("vendorPanel.supportPage.descriptionPlaceholder")}
          value={formState.description}
        >
          <div className="mt-1 text-right text-[11px] text-[#9b9188]">
            {formState.description.length}/500
          </div>
        </SupportField>

        <SupportUploadBox
          disabled={!attachmentUploadAvailable}
          fileName={fileName}
          onChange={onFileChange}
        />

        {attachmentError ? (
          <p className="text-xs text-[#c05445]">{attachmentError}</p>
        ) : fileName ? (
          <p className="text-xs text-[#8b8177]">
            {t("vendorPanel.supportPage.attachmentReady")}
          </p>
        ) : null}

        <div className="flex justify-end">
          <button
            className="rounded-[10px] bg-[#cf6e38] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? t("vendorPanel.supportPage.submitting") : t("vendorPanel.supportPage.submit")}
          </button>
        </div>
      </form>
    </section>
  );
}
