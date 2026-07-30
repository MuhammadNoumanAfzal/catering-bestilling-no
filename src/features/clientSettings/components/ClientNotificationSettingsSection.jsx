import SettingsCheckboxField from "../../vendorDashboard/components/settings/SettingsCheckboxField";
import SettingsSection from "../../vendorDashboard/components/settings/SettingsSection";

export default function ClientNotificationSettingsSection({
  formState,
  updateField,
}) {
  return (
    <SettingsSection
      id="notifications"
      title="Notification Preferences"
      subtitle="Choose which updates you want to receive as a client."
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="newOrders"
          label="New orders"
          checked={formState.newOrders}
          onChange={(event) => updateField("newOrders", event.target.checked)}
          description="Get notified when a new order is confirmed."
        />
        <SettingsCheckboxField
          id="orderUpdates"
          label="Order updates"
          checked={formState.orderUpdates}
          onChange={(event) => updateField("orderUpdates", event.target.checked)}
          description="Receive status changes for upcoming deliveries."
        />
        <SettingsCheckboxField
          id="reviewsAndRatings"
          label="Reviews and ratings"
          checked={formState.reviewsAndRatings}
          onChange={(event) =>
            updateField("reviewsAndRatings", event.target.checked)
          }
          description="Get reminders to review completed orders."
        />
        <SettingsCheckboxField
          id="promotionsAndTips"
          label="Promotions and tips"
          checked={formState.promotionsAndTips}
          onChange={(event) =>
            updateField("promotionsAndTips", event.target.checked)
          }
          description="Receive occasional offers, recommendations, and helpful tips."
        />
        <SettingsCheckboxField
          id="emailNotifications"
          label="Email notifications"
          checked={formState.emailNotifications}
          onChange={(event) =>
            updateField("emailNotifications", event.target.checked)
          }
          description="Send updates to your email inbox."
        />
        <SettingsCheckboxField
          id="smsEnabled"
          label="SMS notifications"
          checked={formState.smsEnabled}
          onChange={(event) => updateField("smsEnabled", event.target.checked)}
          description="Send important order messages to your phone."
        />
      </div>
    </SettingsSection>
  );
}
