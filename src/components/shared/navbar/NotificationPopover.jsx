const TYPE_STYLES = {
  "order-update": {
    badge: "from-[#fff2e9] to-[#ffe2cf] text-[#c96532] border-[#f3c4a7]",
    dot: "bg-[#de6f3a]",
    label: "Order update",
  },
  payment: {
    badge: "from-[#ecfff4] to-[#d9f7e7] text-[#1f8a52] border-[#b9e9cd]",
    dot: "bg-[#1f8a52]",
    label: "Payment",
  },
  review: {
    badge: "from-[#fff8e8] to-[#ffeab8] text-[#b7791f] border-[#f3d38a]",
    dot: "bg-[#d38a17]",
    label: "Review",
  },
  delivery: {
    badge: "from-[#eef7ff] to-[#deefff] text-[#2d6fa3] border-[#bfdcff]",
    dot: "bg-[#2d6fa3]",
    label: "Delivery",
  },
  menu: {
    badge: "from-[#f6f1ff] to-[#ece1ff] text-[#7a56c2] border-[#dac7ff]",
    dot: "bg-[#7a56c2]",
    label: "Menu",
  },
};

function getNotificationStyle(type) {
  return TYPE_STYLES[type] || TYPE_STYLES.menu;
}

export default function NotificationPopover({
  notifications,
  className = "",
  onNotificationClick,
}) {
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div
      className={`fixed left-3 right-3 top-[72px] z-50 w-auto max-w-none overflow-hidden rounded-[24px] border border-[#eadfd6] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f1_100%)] shadow-[0_22px_48px_rgba(38,24,16,0.16)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-[380px] sm:max-w-[calc(100vw-24px)] ${className}`.trim()}
    >
      <div className="flex items-center justify-between border-b border-[#f0e7df] px-5 py-4">
        <div>
          <p className="text-base font-semibold tracking-[-0.01em] text-[#1f1f1f]">
            Notifications
          </p>
          <p className="mt-1 text-xs text-[#8d837a]">
            {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="max-h-[min(68vh,420px)] overflow-y-auto bg-transparent px-3 py-3 sm:max-h-[420px]">
        {notifications.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#eadfd6] bg-white/80 px-4 py-10 text-center">
            <p className="text-sm font-medium text-[#3a332d]">
              No notifications yet
            </p>
            <p className="mt-1 text-xs leading-5 text-[#8d837a]">
              New order and status updates will appear here.
            </p>
          </div>
        ) : null}
        {notifications.map((notification, index) => (
          (() => {
            const style = getNotificationStyle(notification.type);

            return (
              <article
                key={notification.id}
                onClick={() => onNotificationClick?.(notification)}
                className={[
                  "group relative flex items-start gap-3 rounded-[20px] border px-4 py-4 transition-all duration-200",
                  notification.unread
                    ? "border-[#efcdb7] bg-white shadow-[0_10px_28px_rgba(36,24,18,0.08)]"
                    : "border-[#f0e7df] bg-white/78",
                  onNotificationClick ? "cursor-pointer hover:border-[#dfb291]" : "",
                  index !== notifications.length - 1 ? "mb-3" : "",
                ].join(" ")}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border bg-gradient-to-br ${style.badge}`}
                >
                  <img
                    src="/home/logo.png"
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] bg-gradient-to-r ${style.badge}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-[11px] font-medium text-[#9a9189]">
                      {notification.timeLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-base font-semibold leading-6 tracking-[-0.01em] text-[#272727]">
                    {notification.title}
                  </p>
                  <p className="mt-1 pr-2 text-[13px] leading-5 text-[#6f6258] break-words">
                    {notification.message}
                  </p>
                </div>

                {notification.unread ? (
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot} shadow-[0_0_0_6px_rgba(222,111,58,0.12)]`}
                  />
                ) : null}
              </article>
            );
          })()
        ))}
      </div>
    </div>
  );
}
