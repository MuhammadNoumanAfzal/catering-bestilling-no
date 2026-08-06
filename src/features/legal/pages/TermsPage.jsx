import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      eyebrow={t("legal.termsEyebrow")}
      title={t("legal.termsTitle")}
      intro={t("legal.termsIntro")}
    >
      <LegalSection title={t("legal.usingPlatformTitle")}>
        <p>{t("legal.usingPlatformBodyOne")}</p>
        <p>{t("legal.usingPlatformBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.ordersTitle")}>
        <p>{t("legal.ordersBodyOne")}</p>
        <p>{t("legal.ordersBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.paymentsTitle")}>
        <p>{t("legal.paymentsBodyOne")}</p>
        <p>{t("legal.paymentsBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.accountTitle")}>
        <p>{t("legal.accountBodyOne")}</p>
        <p>{t("legal.accountBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.supportTitle")}>
        <p>{t("legal.supportBodyOne")}</p>
        <p>{t("legal.supportBodyTwo")}</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
