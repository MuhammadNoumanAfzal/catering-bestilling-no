import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      eyebrow={t("legal.privacyEyebrow")}
      title={t("legal.privacyTitle")}
      intro={t("legal.privacyIntro")}
    >
      <LegalSection title={t("legal.collectTitle")}>
        <p>{t("legal.collectBodyOne")}</p>
        <p>{t("legal.collectBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.usageTitle")}>
        <p>{t("legal.usageBodyOne")}</p>
        <p>{t("legal.usageBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.sharingTitle")}>
        <p>{t("legal.sharingBodyOne")}</p>
        <p>{t("legal.sharingBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.storageTitle")}>
        <p>{t("legal.storageBodyOne")}</p>
        <p>{t("legal.storageBodyTwo")}</p>
      </LegalSection>

      <LegalSection title={t("legal.choicesTitle")}>
        <p>{t("legal.choicesBodyOne")}</p>
        <p>{t("legal.choicesBodyTwo")}</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
