import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiBell, FiLock, FiSave, FiShield, FiUser } from "react-icons/fi";

const settingsSections = [
  {
    id: "profile",
    title: "Profile Details",
    description: "Keep your public vendor information up to date.",
    icon: FiUser,
    fields: [
      { label: "Business Name", value: "Lunsjavtale Catering" },
      { label: "Contact Email", value: "vendor@lunsjavtale.no" },
      { label: "Phone Number", value: "+47 555 12 345" },
    ],
  },
  {
    id: "password",
    title: "Password & Security",
    description: "Review your sign-in protection and access preferences.",
    icon: FiLock,
    fields: [
      { label: "Password", value: "Last updated 14 days ago" },
      { label: "Two-factor Auth", value: "Enabled" },
      { label: "Recovery Email", value: "security@lunsjavtale.no" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Choose which activity updates should reach your team.",
    icon: FiBell,
    fields: [
      { label: "New Order Alerts", value: "Email and dashboard" },
      { label: "Invoice Reminders", value: "Email only" },
      { label: "Promotions", value: "Muted" },
    ],
  },
];

function SettingsCard({ title, description, icon: Icon, fields, id }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-[28px] border border-[#ddd4cb] bg-white p-6 shadow-[0_10px_28px_rgba(32,32,32,0.06)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
          <Icon className="text-[22px]" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#1f1f1f]">{title}</h2>
          <p className="mt-2 text-sm text-[#666666]">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {fields.map((field) => (
          <article
            key={field.label}
            className="rounded-2xl border border-[#ece3da] bg-[#fcfaf7] px-4 py-4"
          >
            <p className="text-xs uppercase tracking-[0.08em] text-[#8f867d]">
              {field.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#232323]">
              {field.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function VendorSettingsPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="type-h3 text-[#191919]">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5f5f5f]">
            Manage profile information, security controls, and dashboard
            notifications from one place.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-5 py-3 text-sm font-semibold text-white">
          <FiSave className="text-[17px]" />
          <span>All changes saved</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[#ddd4cb] bg-white p-5 shadow-[0_10px_24px_rgba(30,30,30,0.06)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
            <FiUser className="text-[22px]" />
          </div>
          <p className="mt-4 text-sm font-medium text-[#595959]">Profile</p>
          <p className="mt-1 text-2xl font-extrabold text-[#1f1f1f]">84%</p>
        </div>

        <div className="rounded-[24px] border border-[#ddd4cb] bg-white p-5 shadow-[0_10px_24px_rgba(30,30,30,0.06)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
            <FiShield className="text-[22px]" />
          </div>
          <p className="mt-4 text-sm font-medium text-[#595959]">Security</p>
          <p className="mt-1 text-2xl font-extrabold text-[#1f1f1f]">Strong</p>
        </div>

        <div className="rounded-[24px] border border-[#ddd4cb] bg-white p-5 shadow-[0_10px_24px_rgba(30,30,30,0.06)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#cf5c2f]">
            <FiBell className="text-[22px]" />
          </div>
          <p className="mt-4 text-sm font-medium text-[#595959]">
            Notifications
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#1f1f1f]">3 Active</p>
        </div>
      </section>

      <div className="space-y-5">
        {settingsSections.map((section) => (
          <SettingsCard key={section.id} {...section} />
        ))}
      </div>
    </div>
  );
}
