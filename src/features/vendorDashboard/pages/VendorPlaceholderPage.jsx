import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FiClock, FiTool } from "react-icons/fi";

export default function VendorPlaceholderPage() {
  const { t } = useTranslation();
  const location = useLocation();

  const content = useMemo(
    () => {
      const knownContent = {
        "/vendor-dashboard/orders": {
          title: t("vendorPanel.placeholderPages.orders.title"),
          description: t("vendorPanel.placeholderPages.orders.description"),
        },
        "/vendor-dashboard/invoices": {
          title: t("vendorPanel.placeholderPages.invoices.title"),
          description: t("vendorPanel.placeholderPages.invoices.description"),
        },
        "/vendor-dashboard/address": {
          title: t("vendorPanel.placeholderPages.address.title"),
          description: t("vendorPanel.placeholderPages.address.description"),
        },
        "/vendor-dashboard/settings": {
          title: t("vendorPanel.placeholderPages.settings.title"),
          description: t("vendorPanel.placeholderPages.settings.description"),
        },
      };

      return knownContent[location.pathname] ?? {
        title: t("vendorPanel.placeholderPages.default.title"),
        description: t("vendorPanel.placeholderPages.default.description"),
      };
    },
    [location.pathname, t],
  );

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h3 text-[#191919]">{content.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5f5f5f]">
          {content.description}
        </p>
      </section>

      <section className="rounded-[32px] border border-[#ddd4cb] bg-white p-8 shadow-[0_12px_30px_rgba(28,28,28,0.06)]">
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#cf5c2f]">
            <FiTool className="text-[24px]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1f1f1f]">
            {t("vendorPanel.placeholderPages.readyTitle")}
          </h2>

          <p className="text-sm leading-6 text-[#5d5d5d]">
            {t("vendorPanel.placeholderPages.readyDescription")}
          </p>

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#faf5ef] px-4 py-2 text-sm font-semibold text-[#8a5b36]">
            <FiClock className="text-[16px]" />
            <span>{t("vendorPanel.placeholderPages.readyBadge")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
