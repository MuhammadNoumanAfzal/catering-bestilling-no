import { useState } from "react";
import SupportTicketForm from "../components/support/SupportTicketForm";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import DashboardPageHero from "../components/DashboardPageHero";
import { createSupportTicket } from "../support/api";

const AUDIENCE_OPTIONS = [
  { label: "Customer", value: "customer" },
  { label: "Vendor", value: "vendor" },
];

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
  audience: "vendor",
  subject: "",
  orderId: "",
  description: "",
};

export default function VendorSupportPage() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
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
      const response = await createSupportTicket({
        userRole: formState.audience,
        subject: getSubjectLabel(formState.subject),
        relatedOrderId: formState.orderId,
        description: formState.description,
        attachmentUrl: null,
        attachmentFileId: null,
      });

      await showSuccessToast(
        response.message || "Support ticket submitted successfully",
      );

      if (selectedFile) {
        await showAuthErrorAlert(
          "Your ticket was submitted, but file upload is not connected yet. Please share attachments once backend upload API is available.",
          "Attachment not uploaded",
        );
      }

      setFormState(INITIAL_FORM_STATE);
      setSelectedFileName("");
      setSelectedFile(null);
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
      <DashboardPageHero
        eyebrow="Help desk"
        title="Support Center"
        description="Raise delivery, order, payment, or account issues with the right context so your team can move faster."
        stats={[
          {
            label: "Audience",
            value: formState.audience || "vendor",
            note: "Who the current ticket is being raised for.",
          },
          {
            label: "Subject",
            value: formState.subject ? "Selected" : "Pending",
            note: "Choose the issue type before submission.",
          },
          {
            label: "Attachment",
            value: selectedFileName ? "Added" : "Optional",
            note: selectedFileName || "Upload support evidence when needed.",
          },
          {
            label: "Status",
            value: isSubmitting ? "Sending" : "Draft",
            note: "Current ticket submission state.",
          },
        ]}
      />

      <SupportTicketForm
        audienceOptions={AUDIENCE_OPTIONS}
        fileName={selectedFileName}
        formState={formState}
        isSubmitting={isSubmitting}
        onAudienceChange={(value) => updateField("audience", value)}
        onFieldChange={updateField}
        onFileChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          setSelectedFile(nextFile);
          setSelectedFileName(nextFile?.name ?? "");
        }}
        onSubmit={handleSubmit}
        subjectOptions={SUBJECT_OPTIONS}
      />
    </div>
  );
}
