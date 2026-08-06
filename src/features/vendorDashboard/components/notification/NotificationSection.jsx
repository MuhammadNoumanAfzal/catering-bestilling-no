import NotificationListItem from "./NotificationListItem";
import { useTranslation } from "react-i18next";
import { translateNotification } from "./notificationI18n";

export default function NotificationSection({ dayLabel, items, onOpenNotification }) {
  const { t, i18n } = useTranslation();
  const nt = (key, options) => translateNotification(t, i18n, key, options);
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9a8f84]">
          {dayLabel}
        </h2>
        <span className="text-xs text-[#b0a49a]">{nt("itemCount", { count: items.length })}</span>
      </div>

      <div className="space-y-3">
        {items.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onOpen={onOpenNotification}
          />
        ))}
      </div>
    </section>
  );
}
