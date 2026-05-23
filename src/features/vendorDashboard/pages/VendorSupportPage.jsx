import { useState } from "react";
import SupportTicketForm from "../components/support/SupportTicketForm";
import { showSuccessToast } from "../../../utils/alerts";

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

  function updateField(key, value) {
    setFormState((current) => ({
      ...current,
      [key]: key === "description" ? value.slice(0, 500) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await showSuccessToast("Support ticket submitted successfully");

    setFormState(INITIAL_FORM_STATE);
    setSelectedFileName("");
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
        audienceOptions={AUDIENCE_OPTIONS}
        fileName={selectedFileName}
        formState={formState}
        onAudienceChange={(value) => updateField("audience", value)}
        onFieldChange={updateField}
        onFileChange={(event) =>
          setSelectedFileName(event.target.files?.[0]?.name ?? "")
        }
        onSubmit={handleSubmit}
        subjectOptions={SUBJECT_OPTIONS}
      />
    </div>
  );
}
