import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms & Conditions"
      title="Terms for ordering through Cateringbestilling"
      intro="These terms explain how customers use the client-side ordering platform, place catering requests, and interact with listed vendors through Cateringbestilling."
    >
      <LegalSection title="Using the platform">
        <p>
          You may use Cateringbestilling to browse menus, compare vendors, submit
          order requests, and manage your account details.
        </p>
        <p>
          You agree to provide accurate booking, contact, and delivery
          information whenever you create an account or place an order.
        </p>
      </LegalSection>

      <LegalSection title="Orders and availability">
        <p>
          Menu availability, pricing, lead times, and delivery windows can vary
          by vendor, location, and event date.
        </p>
        <p>
          Submitting an order does not override vendor capacity limits. Orders
          may be adjusted or declined if delivery timing, staffing, or product
          availability changes.
        </p>
      </LegalSection>

      <LegalSection title="Payments and cancellations">
        <p>
          Prices shown in the app may include menu cost, delivery fees, taxes,
          and optional tips depending on the order type and selected vendor.
        </p>
        <p>
          Cancellation or refund handling may depend on vendor policy, delivery
          timing, and whether preparation has already started.
        </p>
      </LegalSection>

      <LegalSection title="Account responsibilities">
        <p>
          You are responsible for maintaining the confidentiality of your login
          details and for activity performed through your account.
        </p>
        <p>
          We may suspend or restrict access if the platform is used for fraud,
          abuse, or unlawful activity.
        </p>
      </LegalSection>

      <LegalSection title="Support and contact">
        <p>
          For customer support, booking changes, or account questions, please
          use the contact tools available in the client app.
        </p>
        <p>
          Questions about these terms can be directed to the support contact
          information published on the platform.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
