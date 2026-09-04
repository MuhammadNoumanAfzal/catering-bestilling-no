import CheckoutField from "./CheckoutField";
import CheckoutSection from "./CheckoutSection";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";
import { useTranslation } from "react-i18next";

export default function ContactInfoSection({
  mode,
  formState,
  updateField,
}) {
  const { t } = useTranslation();
  return (
    <CheckoutSection title={t("checkout.contactInfo")}>
      {mode === "corporate" ? (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <CheckoutField
            label={t("checkout.companyName")}
            value={formState.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.companyName}
            className="sm:col-span-2"
          />
          <CheckoutField
            label={t("checkout.organizationNumber")}
            value={formState.organizationNumber}
            onChange={(event) =>
              updateField("organizationNumber", event.target.value)
            }
            placeholder={CHECKOUT_PLACEHOLDERS.organizationNumber}
          />
          <CheckoutField
            label={t("checkout.invoiceReference")}
            value={formState.invoiceReference}
            onChange={(event) =>
              updateField("invoiceReference", event.target.value)
            }
            placeholder={CHECKOUT_PLACEHOLDERS.invoiceReference}
          />
          <CheckoutField
            label={t("checkout.email")}
            type="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.email}
          />
          <CheckoutField
            label={t("checkout.phone")}
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.phone}
          />
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <CheckoutField
            label={t("checkout.firstName")}
            value={formState.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.firstName}
          />
          <CheckoutField
            label={t("checkout.lastName")}
            value={formState.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.lastName}
          />
          <CheckoutField
            label={t("checkout.invoiceReference")}
            value={formState.invoiceReference}
            onChange={(event) =>
              updateField("invoiceReference", event.target.value)
            }
            placeholder={CHECKOUT_PLACEHOLDERS.invoiceReference}
          />
          <CheckoutField
            label={t("checkout.phone")}
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.phone}
          />
          <CheckoutField
            label={t("checkout.email")}
            type="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={CHECKOUT_PLACEHOLDERS.email}
            className="sm:col-span-2"
          />
        </div>
      )}
    </CheckoutSection>
  );
}
