import Swal from "sweetalert2";
import i18n from "../i18n";

const BRAND_ORANGE = "#cf6e38";
const POPUP_BACKGROUND = "#fffaf6";
const TEXT_COLOR = "#201b17";

export function withBaseOptions(options) {
  return {
    background: POPUP_BACKGROUND,
    color: TEXT_COLOR,
    confirmButtonColor: BRAND_ORANGE,
    reverseButtons: true,
    ...options,
  };
}

export function showSuccessToast(title) {
  return Swal.fire(
    withBaseOptions({
      toast: true,
      position: "top-end",
      icon: "success",
      title,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    }),
  );
}

export function showContactRequestSubmittedAlert() {
  return Swal.fire(
    withBaseOptions({
      icon: "success",
      title: i18n.t("alerts.requestSubmittedTitle"),
      text: i18n.t("alerts.requestSubmittedText"),
      confirmButtonText: i18n.t("alerts.okay"),
    }),
  );
}

export function showAuthErrorAlert(
  message,
  title = i18n.t("alerts.somethingWentWrong"),
) {
  return Swal.fire(
    withBaseOptions({
      icon: "error",
      title,
      text: message,
      confirmButtonText: i18n.t("alerts.tryAgain"),
    }),
  );
}

export function confirmRemoveItem(itemName) {
  return Swal.fire(
    withBaseOptions({
      icon: "warning",
      title: i18n.t("alerts.removeItemTitle"),
      text: itemName
        ? i18n.t("alerts.removeNamedItemText", { itemName })
        : i18n.t("alerts.removeGenericItemText"),
      showCancelButton: true,
      confirmButtonText: i18n.t("alerts.removeConfirm"),
      cancelButtonText: i18n.t("alerts.keepIt"),
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function confirmPlaceOrder() {
  return Swal.fire(
    withBaseOptions({
      icon: "question",
      title: i18n.t("alerts.placeOrderTitle"),
      text: i18n.t("alerts.placeOrderText"),
      showCancelButton: true,
      confirmButtonText: i18n.t("alerts.placeOrderConfirm"),
      cancelButtonText: i18n.t("alerts.notYet"),
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function confirmLogout() {
  return Swal.fire(
    withBaseOptions({
      icon: "question",
      title: i18n.t("alerts.logoutTitle"),
      text: i18n.t("alerts.logoutText"),
      showCancelButton: true,
      confirmButtonText: i18n.t("alerts.logoutConfirm"),
      cancelButtonText: i18n.t("alerts.staySignedIn"),
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function showOrderPlacedSuccess() {
  return Swal.fire(
    withBaseOptions({
      icon: "success",
      title: i18n.t("alerts.orderPlacedTitle"),
      text: i18n.t("alerts.orderPlacedText"),
      confirmButtonText: i18n.t("alerts.continue"),
    }),
  );
}

export function showDeliveredReviewPrompt(vendorName) {
  return Swal.fire(
    withBaseOptions({
      icon: "success",
      title: i18n.t("alerts.reviewDeliveredTitle"),
      text: i18n.t("alerts.reviewDeliveredText", {
        vendorName: vendorName || i18n.t("alerts.thisVendor"),
      }),
      showCancelButton: true,
      confirmButtonText: i18n.t("alerts.reviewDeliveredConfirm"),
      cancelButtonText: i18n.t("alerts.notNow"),
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function promptSignInRequired({
  title = i18n.t("alerts.signInRequiredTitle"),
  text = i18n.t("alerts.signInRequiredText"),
} = {}) {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title,
      text,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: i18n.t("alerts.signIn"),
      denyButtonText: i18n.t("alerts.createAccount"),
      cancelButtonText: i18n.t("alerts.notNow"),
      cancelButtonColor: "#d7cec6",
      denyButtonColor: "#f0b79e",
    }),
  );
}

export function showNoVendorsAlert(locationLabel) {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title: i18n.t("alerts.noVendorsTitle"),
      text: locationLabel
        ? i18n.t("alerts.noVendorsTextWithLocation", { locationLabel })
        : i18n.t("alerts.noVendorsText"),
      confirmButtonText: i18n.t("alerts.okay"),
    }),
  );
}

export function showNoProductsAlert() {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title: i18n.t("alerts.noProductsTitle"),
      text: i18n.t("alerts.noProductsText"),
      confirmButtonText: i18n.t("alerts.okay"),
    }),
  );
}

export function showMenuUnavailableAlert({
  menuTitle,
  message,
  availableDaysLabel = "",
}) {
  const safeTitle = menuTitle || i18n.t("alerts.thisMenu");
  const subtitle = availableDaysLabel
    ? i18n.t("alerts.availableOn", { availableDaysLabel })
    : i18n.t("alerts.chooseAnotherDate");

  return Swal.fire(
    withBaseOptions({
      icon: "warning",
      title: i18n.t("alerts.menuUnavailableTitle"),
      confirmButtonText: i18n.t("alerts.chooseAnotherDate"),
      html: `
        <div style="text-align:left;padding-top:6px">
          <div style="margin-bottom:12px;border:1px solid #f1ddcf;background:#fff4ec;border-radius:16px;padding:14px 16px">
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#cf6e38;margin-bottom:6px">
              ${subtitle}
            </div>
            <div style="font-size:20px;font-weight:800;color:#201b17;line-height:1.25">
              ${safeTitle}
            </div>
          </div>
          <div style="font-size:15px;line-height:1.6;color:#5b4d42">
            ${message}
          </div>
        </div>
      `,
    }),
  );
}

function formatClosureDate(dateValue) {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue || "";
  }

  return parsedDate.toLocaleDateString(
    i18n.language === "no" ? "nb-NO" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

export function showVendorClosureAlert({
  vendorName,
  selectedDate,
  closureReason,
  closureStartDate,
  closureEndDate,
}) {
  const dateLabel = formatClosureDate(selectedDate);
  const startLabel = formatClosureDate(closureStartDate);
  const endLabel = formatClosureDate(closureEndDate);
  const isSingleDayClosure = Boolean(startLabel) && startLabel === endLabel;
  const rangeLabel = isSingleDayClosure
    ? startLabel
    : [startLabel, endLabel].filter(Boolean).join(" - ");

  return Swal.fire(
    withBaseOptions({
      icon: "warning",
      title: i18n.t("alerts.vendorClosedTitle"),
      confirmButtonText: i18n.t("alerts.chooseAnotherDate"),
      html: `
        <div style="text-align:left;padding-top:6px">
          <div style="margin-bottom:12px;border:1px solid #f1ddcf;background:#fff4ec;border-radius:16px;padding:14px 16px">
            <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#cf6e38;margin-bottom:6px">
              ${vendorName || i18n.t("alerts.thisVendor")}
            </div>
            <div style="font-size:20px;font-weight:800;color:#201b17;line-height:1.25">
              ${dateLabel || i18n.t("alerts.selectedDateUnavailable")}
            </div>
          </div>
          <div style="font-size:15px;line-height:1.6;color:#5b4d42">
            ${
              closureReason
                ? `${i18n.t("alerts.closedReason", { closureReason })}<br /><br />`
                : ""
            }
            ${
              rangeLabel
                ? i18n.t("alerts.vendorNotAcceptingRange", { rangeLabel })
                : i18n.t("alerts.vendorNotAcceptingSelectedDate")
            }
          </div>
        </div>
      `,
    }),
  );
}
