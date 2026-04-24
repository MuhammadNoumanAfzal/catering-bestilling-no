import SettingsCheckboxField from "./SettingsCheckboxField";
import SettingsSection from "./SettingsSection";

export default function NotificationSettingsSection({ formState, updateField }) {
  return (
    <SettingsSection
      id="notifications"
      title="Notifications"
      subtitle="Send delivery updates via"
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="textNotifications"
          label="Text message"
          checked={formState.textNotifications}
          onChange={(event) =>
            updateField("textNotifications", event.target.checked)
          }
          description="We will send you SMS text messages such as order confirmations and delivery updates. Message and data rates may apply."
        />
        <SettingsCheckboxField
          id="emailNotifications"
          label="Email"
          checked={formState.emailNotifications}
          onChange={(event) =>
            updateField("emailNotifications", event.target.checked)
          }
          description="Receive order, marketing and account related messages in your inbox. You can change this preference later."
        />
        <SettingsCheckboxField
          id="pushNotifications"
          label="Push notification"
          checked={formState.pushNotifications}
          onChange={(event) =>
            updateField("pushNotifications", event.target.checked)
          }
        />
      </div>

      <div className="mt-4 border-t border-[#ece4dc] pt-3">
        <p className="type-subpara mb-1.5 text-[#8b837b]">Order confirmation</p>
        <SettingsCheckboxField
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
          className="type-h6 w-full cursor-pointer rounded-[8px] bg-[#cf6e38] px-5 py-2.5 text-white transition hover:bg-[#ba5f2e] sm:w-auto"
        >
          Save Changes
        </button>
      </div>
    </SettingsSection>
  );
}
