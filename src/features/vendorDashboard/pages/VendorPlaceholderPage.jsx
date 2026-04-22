import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FiClock, FiTool } from "react-icons/fi";

const pageContent = {
  "/vendor-dashboard/orders": {
    title: "Orders",
    description:
      "Track order intake, fulfillment progress, and delivery timelines from one place.",
  },
  "/vendor-dashboard/invoices": {
    title: "Invoice",
    description:
      "Review billing history, payment states, and export-ready invoice records.",
  },
  "/vendor-dashboard/rewards": {
    title: "Reward",
    description:
      "Monitor reward points, earning activity, and redemption opportunities for your account.",
  },
  "/vendor-dashboard/address": {
    title: "Address",
    description:
      "Maintain pickup, delivery, and billing addresses used across your vendor operations.",
  },
  "/vendor-dashboard/settings": {
    title: "Setting",
    description:
      "Update account preferences, security settings, and dashboard-level configuration options.",
  },
};

export default function VendorPlaceholderPage() {
  const location = useLocation();

  const content = useMemo(
    () =>
      pageContent[location.pathname] ?? {
        title: "Vendor Page",
        description: "This section is ready for its dedicated content module.",
      },
    [location.pathname],
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
            This page is structured and ready for feature work.
          </h2>

          <p className="text-sm leading-6 text-[#5d5d5d]">
            The shared layout, routing, navigation state, and page container are
            already in place. You can now build this screen independently
            without touching the vendor shell again.
          </p>

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#faf5ef] px-4 py-2 text-sm font-semibold text-[#8a5b36]">
            <FiClock className="text-[16px]" />
            <span>Ready for the next module</span>
          </div>
        </div>
      </section>
    </div>
  );
}
