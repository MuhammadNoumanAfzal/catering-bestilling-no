import {
  FiBell,
  FiCheckCircle,
  FiCreditCard,
  FiGift,
  FiPackage,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const ICON_BY_TYPE = {
  "order-update": FiPackage,
  confirmation: FiCheckCircle,
  payment: FiCreditCard,
  offer: FiGift,
  delivery: FiCheckCircle,
  menu: FiBell,
};

export default function NotificationListItem({ notification }) {
  const Icon = ICON_BY_TYPE[notification.type] ?? FiBell;
  const Wrapper = notification.actionUrl ? Link : "article";
  const wrapperProps = notification.actionUrl
    ? { to: notification.actionUrl }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        "grid gap-3 rounded-[22px] border px-4 py-4 transition sm:grid-cols-[auto_1fr_auto] sm:items-start",
        notification.category === "unread"
          ? "border-[#f0b79e] bg-[#fff7f2]"
          : "border-[#ece3db] bg-white",
        notification.actionUrl ? "cursor-pointer hover:border-[#cf6e38]" : "",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-11 w-11 items-center justify-center rounded-2xl",
          notification.category === "unread"
            ? "bg-[#ffe8dc] text-[#cf5c2f]"
            : "bg-[#f6f1eb] text-[#8d7e70]",
        ].join(" ")}
      >
        <Icon className="text-[20px]" />
      </div>

      <div className="min-w-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-[#1f1f1f] sm:text-[15px]">
              {notification.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#6a625c]">
              {notification.message}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span className="text-xs font-medium text-[#978d84]">
          {notification.timeLabel}
        </span>
        {notification.actionUrl ? (
          <span className="rounded-full bg-[#fff2eb] px-2.5 py-1 text-[11px] font-semibold text-[#cf6e38]">
            Open
          </span>
        ) : null}
        {notification.category === "unread" ? (
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#cf5c2f]" />
        ) : (
          <span className="rounded-full bg-[#f3eee8] px-2.5 py-1 text-[11px] font-semibold text-[#80766d]">
            Viewed
          </span>
        )}
      </div>
    </Wrapper>
  );
}
