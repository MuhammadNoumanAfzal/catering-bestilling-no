import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SupportTicketForm from "../components/support/SupportTicketForm";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { createSupportTicket } from "../support/api";
import {
  isMenuImageUploadConfigured,
  uploadMenuImage,
} from "../../menu/api/menuUploadApi";

const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024;

const SUBJECT_OPTIONS = [
  { labelKey: "vendorPanel.supportPage.subjects.orderNotReceived", value: "order-not-received" },
  { labelKey: "vendorPanel.supportPage.subjects.deliveryDelayed", value: "delivery-delayed" },
  { labelKey: "vendorPanel.supportPage.subjects.wrongItemsReceived", value: "wrong-items-received" },
  { labelKey: "vendorPanel.supportPage.subjects.missingItems", value: "missing-items" },
  { labelKey: "vendorPanel.supportPage.subjects.paymentIssue", value: "payment-issue" },
  { labelKey: "vendorPanel.supportPage.subjects.refundRequest", value: "refund-request" },
  { labelKey: "vendorPanel.supportPage.subjects.canceledOrderRequest", value: "canceled-order-request" },
  { labelKey: "vendorPanel.supportPage.subjects.cannotContactVendor", value: "cannot-contact-vendor" },
  { labelKey: "vendorPanel.supportPage.subjects.foodQualityIssue", value: "food-quality-issue" },
  { labelKey: "vendorPanel.supportPage.subjects.accountIssue", value: "account-issue" },
  { labelKey: "vendorPanel.supportPage.subjects.generalInquiry", value: "general-inquiry" },
  { labelKey: "vendorPanel.supportPage.subjects.other", value: "other" },
];

const INITIAL_FORM_STATE = {
  subject: "",
  orderId: "",
  description: "",
};

export default function VendorSupportPage() {
  const { t } = useTranslation();
  const attachmentUploadAvailable = isMenuImageUploadConfigured();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(key, value) {
    setFormState((current) => ({
      ...current,
      [key]: key === "description" ? value.slice(0, 500) : value,
    }));
  }

  function getSubjectLabel(subjectValue) {
    return (
      t(SUBJECT_OPTIONS.find((option) => option.value === subjectValue)?.labelKey) ||
      subjectValue
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedAttachment = selectedFile
        ? await uploadMenuImage(selectedFile)
        : null;

      const response = await createSupportTicket({
        userRole: "customer",
        subject: getSubjectLabel(formState.subject),
        relatedOrderId: formState.orderId,
        description: formState.description,
        attachmentUrl: uploadedAttachment?.fileUrl || null,
        attachmentFileId: uploadedAttachment?.fileId || null,
      });

      await showSuccessToast(
        response.message || t("vendorPanel.supportPage.submittedSuccess"),
      );

      setFormState(INITIAL_FORM_STATE);
      setSelectedFileName("");
      setSelectedFile(null);
      setAttachmentError("");
    } catch (error) {
      await showAuthErrorAlert(
        error?.message || t("vendorPanel.supportPage.submitFailedMessage"),
        t("vendorPanel.supportPage.submitFailedTitle"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="type-h2 text-[#191919]">{t("vendorPanel.supportPage.title")}</h1>
          <p className="mt-2 type-para text-[#635b53]">
            {t("vendorPanel.supportPage.description")}
          </p>
        </div>

        <Link
          className="inline-flex h-[42px] items-center justify-center rounded-[10px] border border-[#dfd3c8] bg-white px-4 text-[14px] font-bold text-[#2a211b] no-underline transition hover:bg-[#faf6f2] hover:text-[#cf6e38]"
          to="/vendor-dashboard/support/responses"
        >
          {t("vendorPanel.supportPage.viewResponses")}
        </Link>
      </section>

      <SupportTicketForm
        attachmentError={attachmentError}
        attachmentUploadAvailable={attachmentUploadAvailable}
        fileName={selectedFileName}
        formState={formState}
        isSubmitting={isSubmitting}
        onFieldChange={updateField}
        onFileChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          setAttachmentError("");

          if (!attachmentUploadAvailable) {
            setSelectedFile(null);
            setSelectedFileName("");
            setAttachmentError(
              t("vendorPanel.supportPage.uploadUnavailableError"),
            );
            return;
          }

          if (!nextFile) {
            setSelectedFile(null);
            setSelectedFileName("");
            return;
          }

          if (!ALLOWED_ATTACHMENT_TYPES.includes(nextFile.type)) {
            setSelectedFile(null);
            setSelectedFileName("");
            setAttachmentError(t("vendorPanel.supportPage.invalidFileType"));
            return;
          }

          if (nextFile.size > MAX_ATTACHMENT_SIZE_BYTES) {
            setSelectedFile(null);
            setSelectedFileName("");
            setAttachmentError(t("vendorPanel.supportPage.invalidFileSize"));
            return;
          }

          setSelectedFile(nextFile);
          setSelectedFileName(nextFile.name);
        }}
        onSubmit={handleSubmit}
        subjectOptions={SUBJECT_OPTIONS}
      />
    </div>
  );
}
