import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { vendorSettingsInitialState } from "../data/vendorDashboardData";

function Field({ id, label, value, onChange, placeholder, type = "text" }) {
  return (
    <label htmlFor={id} className="block">
      <span className="type-para mb-2 block text-[#8b837b]">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="type-para h-10 w-full rounded-[4px] border border-[#d9d1c8] bg-white px-3 text-[#1f1f1f] outline-none placeholder:text-[#b4aca4]"
      />
    </label>
  );
}

function CheckboxField({ id, label, checked, onChange, description }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2 rounded-[8px] py-1"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 cursor-pointer rounded-[2px] border border-[#cfc7be] accent-[#cf5c2f]"
      />
      <span>
        <span className="type-h6 block text-[#1f1f1f]">{label}</span>
        {description ? (
          <span className="mt-0.5 block type-para leading-3 text-[#aaa29a]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-[#e9e1d8] pb-6">
      <h2 className="type-h3 ">{title}</h2>
      {subtitle ? <p className="mt-3 type-para ">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function VendorSettingsPage() {
  const location = useLocation();
  const [formState, setFormState] = useState(vendorSettingsInitialState);

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

  function updateField(key, value) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function handleReset() {
    setFormState(vendorSettingsInitialState);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Setting</h1>
      </section>

      <div className="space-y-6">
        <Section id="profile" title="Profile">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              id="firstName"
              label="First name *"
              value={formState.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              placeholder=""
            />
            <Field
              id="lastName"
              label="Last name *"
              value={formState.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              placeholder=""
            />
            <Field
              id="primaryEmail"
              label="Primary email *"
              value={formState.primaryEmail}
              onChange={(event) =>
                updateField("primaryEmail", event.target.value)
              }
              placeholder=""
              type="email"
            />
            <Field
              id="secondaryEmail"
              label="Secondary email"
              value={formState.secondaryEmail}
              onChange={(event) =>
                updateField("secondaryEmail", event.target.value)
              }
              placeholder=""
              type="email"
            />
            <Field
              id="mobilePhone"
              label="Mobile phone *"
              value={formState.mobilePhone}
              onChange={(event) =>
                updateField("mobilePhone", event.target.value)
              }
              placeholder=""
            />
            <Field
              id="workPhone"
              label="Work phone"
              value={formState.workPhone}
              onChange={(event) => updateField("workPhone", event.target.value)}
              placeholder=""
            />
            <Field
              id="company"
              label="Company"
              value={formState.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder=""
            />
            <Field
              id="jobTitle"
              label="Job title"
              value={formState.jobTitle}
              onChange={(event) => updateField("jobTitle", event.target.value)}
              placeholder=""
            />
            <Field
              id="industry"
              label="Industry or usage"
              value={formState.industry}
              onChange={(event) => updateField("industry", event.target.value)}
              placeholder=""
            />
          </div>
        </Section>

        <Section id="password" title="Password" subtitle="change password">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              id="oldPassword"
              label="Old Password *"
              value={formState.oldPassword}
              onChange={(event) =>
                updateField("oldPassword", event.target.value)
              }
              placeholder=""
              type="password"
            />
            <Field
              id="confirmOldPassword"
              label="Confirm Password *"
              value={formState.confirmOldPassword}
              onChange={(event) =>
                updateField("confirmOldPassword", event.target.value)
              }
              placeholder=""
              type="password"
            />
            <Field
              id="newPassword"
              label="New Password *"
              value={formState.newPassword}
              onChange={(event) =>
                updateField("newPassword", event.target.value)
              }
              placeholder=""
              type="password"
            />
            <Field
              id="confirmNewPassword"
              label="Confirm Password *"
              value={formState.confirmNewPassword}
              onChange={(event) =>
                updateField("confirmNewPassword", event.target.value)
              }
              placeholder=""
              type="password"
            />
          </div>
        </Section>

        <Section
          id="notifications"
          title="Notifications"
          subtitle="Send delivery updates via"
        >
          <div className="space-y-1.5">
            <CheckboxField
              id="textNotifications"
              label="Text message"
              checked={formState.textNotifications}
              onChange={(event) =>
                updateField("textNotifications", event.target.checked)
              }
              description="We will send you SMS text messages such as order confirmations and delivery updates. Message and data rates may apply."
            />
            <CheckboxField
              id="emailNotifications"
              label="Email"
              checked={formState.emailNotifications}
              onChange={(event) =>
                updateField("emailNotifications", event.target.checked)
              }
              description="Receive order, marketing and account related messages in your inbox. You can change this preference later."
            />
            <CheckboxField
              id="pushNotifications"
              label="Push notification"
              checked={formState.pushNotifications}
              onChange={(event) =>
                updateField("pushNotifications", event.target.checked)
              }
            />
          </div>

          <div className="mt-4 border-t border-[#ece4dc] pt-3">
            <p className="type-subpara mb-1.5 text-[#8b837b]">
              Order confirmation
            </p>
            <CheckboxField
              id="orderConfirmationPush"
              label="Push notification"
              checked={formState.orderConfirmationPush}
              onChange={(event) =>
                updateField("orderConfirmationPush", event.target.checked)
              }
            />
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="type-h6 cursor-pointer rounded-[8px] bg-[#cf6e38] px-5 py-2.5 text-white transition hover:bg-[#ba5f2e]"
            >
              Save Changes
            </button>
          </div>
        </Section>

        <section className="space-y-3">
          <h2 className="type-h4 text-[#191919]">Additional actions</h2>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="type-h6 cursor-pointer rounded-[8px] bg-[#cf2e2e] px-4 py-2.5 text-white transition hover:bg-[#b92626]"
            >
              Delete account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
