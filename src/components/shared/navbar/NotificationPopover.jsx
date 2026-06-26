export default function NotificationPopover({
  notifications,
  className = "",
}) {
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div
      className={`fixed left-3 right-3 top-[72px] z-50 w-auto max-w-none overflow-hidden rounded-[18px] border border-[#eadfd6] bg-white shadow-[0_18px_40px_rgba(22,22,22,0.14)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-[320px] sm:max-w-[calc(100vw-24px)] ${className}`.trim()}
    >
      <div className="flex items-center justify-between border-b border-[#f0e7df] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#1f1f1f]">Notifications</p>
          <p className="text-xs text-[#8d837a]">
            {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="max-h-[min(60vh,320px)] overflow-y-auto bg-[#fbf9f6] sm:max-h-[320px]">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium text-[#3a332d]">
              No notifications yet
            </p>
            <p className="mt-1 text-xs text-[#8d837a]">
              New order and status updates will appear here.
            </p>
          </div>
        ) : null}
        {notifications.map((notification, index) => (
          <article
            key={notification.id}
            className={[
              "flex items-start gap-3 px-3 py-3 sm:px-4",
              index !== notifications.length - 1
                ? "border-b border-[#f0e7df]"
                : "",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd7] bg-white">
              <img
                src="/home/logo.png"
                alt=""
                className="h-6 w-6 rounded-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
                <p className="w-full truncate text-sm font-semibold text-[#272727] sm:w-auto">
                  {notification.title}
                </p>
                <span className="text-[11px] text-[#9a9189]">
                  {notification.timeLabel}
                </span>
              </div>
              <p className="mt-1 pr-1 text-xs leading-4 text-[#7d746c] break-words">
                {notification.message}
              </p>
            </div>

            {notification.unread ? (
              <span className="mt-2 h-2.5 w-2.5 shrink-0 self-start rounded-full bg-[#c85f33]" />
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
