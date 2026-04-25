import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { PLACEHOLDERS } from "./checkoutPage.constants";

export default function ContactInfoSection({
  mode,
  formState,
  updateField,
}) {
  return (
    <CheckoutSection title="Contact Info">
      {mode === "corporate" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckoutField
            label="CompanyName"
            value={formState.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder={PLACEHOLDERS.companyName}
            className="sm:col-span-2"
          />
          <CheckoutField
            label="Organization number"
            value={formState.organizationNumber}
            onChange={(event) =>
              updateField("organizationNumber", event.target.value)
            }
            placeholder={PLACEHOLDERS.organizationNumber}
          />
          <CheckoutField
            label="Invoice Reference"
            value={formState.invoiceReference}
            onChange={(event) =>
              updateField("invoiceReference", event.target.value)
            }
            placeholder={PLACEHOLDERS.invoiceReference}
          />
          <CheckoutField
            label="Email"
            type="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={PLACEHOLDERS.email}
          />
          <CheckoutField
            label="Phone"
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder={PLACEHOLDERS.phone}
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <CheckoutField
            label="First Name"
            value={formState.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder={PLACEHOLDERS.firstName}
          />
          <CheckoutField
            label="Last Name"
            value={formState.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder={PLACEHOLDERS.lastName}
          />
          <CheckoutField
            label="Invoice Reference"
            value={formState.invoiceReference}
            onChange={(event) =>
              updateField("invoiceReference", event.target.value)
            }
            placeholder={PLACEHOLDERS.invoiceReference}
          />
          <CheckoutField
            label="Phone"
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder={PLACEHOLDERS.phone}
          />
          <CheckoutField
            label="Email"
            type="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={PLACEHOLDERS.email}
            className="sm:col-span-2"
          />
        </div>
      )}
    </CheckoutSection>
  );
}
