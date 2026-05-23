import NotificationListItem from "./NotificationListItem";

export default function NotificationSection({ dayLabel, items }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9a8f84]">
          {dayLabel}
        </h2>
        <span className="text-xs text-[#b0a49a]">{items.length} item{items.length === 1 ? "" : "s"}</span>
      </div>

      <div className="space-y-3">
        {items.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </section>
  );
}
