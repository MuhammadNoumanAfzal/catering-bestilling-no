import { useState } from "react";
import SupportTicketForm from "../components/support/SupportTicketForm";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { createSupportTicket } from "../support/api";
import { uploadMenuImage } from "../../menu/api/menuUploadApi";

const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024;

const SUBJECT_OPTIONS = [
  { label: "Order not received", value: "order-not-received" },
  { label: "Delivery delayed", value: "delivery-delayed" },
  { label: "Wrong items received", value: "wrong-items-received" },
  { label: "Missing items", value: "missing-items" },
  { label: "Payment issue", value: "payment-issue" },
  { label: "Refund request", value: "refund-request" },
  { label: "Canceled order request", value: "canceled-order-request" },
  { label: "Cannot contact vendor", value: "cannot-contact-vendor" },
  { label: "Food quality issue", value: "food-quality-issue" },
  { label: "Account issue", value: "account-issue" },
  { label: "General inquiry", value: "general-inquiry" },
  { label: "Other", value: "other" },
];

const INITIAL_FORM_STATE = {
  subject: "",
  orderId: "",
  description: "",
};

export default function VendorSupportPage() {
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
      SUBJECT_OPTIONS.find((option) => option.value === subjectValue)?.label ||
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
        response.message || "Support ticket submitted successfully",
      );

      setFormState(INITIAL_FORM_STATE);
      setSelectedFileName("");
      setSelectedFile(null);
      setAttachmentError("");
    } catch (error) {
      await showAuthErrorAlert(
        error?.message || "Unable to submit support ticket right now.",
        "Support ticket failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Support Center</h1>
        <p className="mt-2 type-para text-[#635b53]">
          We&apos;re here to help. Find answers or get in touch with our team.
        </p>
      </section>

      <SupportTicketForm
        attachmentError={attachmentError}
        fileName={selectedFileName}
        formState={formState}
        isSubmitting={isSubmitting}
        onFieldChange={updateField}
        onFileChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          setAttachmentError("");

          if (!nextFile) {
            setSelectedFile(null);
            setSelectedFileName("");
            return;
          }

          if (!ALLOWED_ATTACHMENT_TYPES.includes(nextFile.type)) {
            setSelectedFile(null);
            setSelectedFileName("");
            setAttachmentError("Please upload a PNG, JPG, JPEG, or WEBP image.");
            return;
          }

          if (nextFile.size > MAX_ATTACHMENT_SIZE_BYTES) {
            setSelectedFile(null);
            setSelectedFileName("");
            setAttachmentError("Please upload an image under 2MB.");
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
