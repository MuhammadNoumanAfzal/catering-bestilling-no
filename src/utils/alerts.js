import Swal from "sweetalert2";

const BRAND_ORANGE = "#cf6e38";
const POPUP_BACKGROUND = "#fffaf6";
const TEXT_COLOR = "#201b17";

function withBaseOptions(options) {
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

export function showAuthErrorAlert(message, title = "Something went wrong") {
  return Swal.fire(
    withBaseOptions({
      icon: "error",
      title,
      text: message,
      confirmButtonText: "Try again",
    }),
  );
}

export function confirmRemoveItem(itemName) {
  return Swal.fire(
    withBaseOptions({
      icon: "warning",
      title: "Remove item?",
      text: itemName
        ? `Remove "${itemName}" from your cart?`
        : "Remove this item from your cart?",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Keep it",
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function confirmPlaceOrder() {
  return Swal.fire(
    withBaseOptions({
      icon: "question",
      title: "Place order now?",
      text: "We will submit your catering order and clear your current cart.",
      showCancelButton: true,
      confirmButtonText: "Place order",
      cancelButtonText: "Not yet",
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function confirmLogout() {
  return Swal.fire(
    withBaseOptions({
      icon: "question",
      title: "Log out now?",
      text: "You will be signed out of your current session.",
      showCancelButton: true,
      confirmButtonText: "Log out",
      cancelButtonText: "Stay signed in",
      cancelButtonColor: "#d7cec6",
    }),
  );
}

export function showOrderPlacedSuccess() {
  return Swal.fire(
    withBaseOptions({
      icon: "success",
      title: "Order placed",
      text: "Your catering order was submitted successfully.",
      confirmButtonText: "Continue",
    }),
  );
}

export function promptSignInRequired() {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title: "Sign in required",
      text: "Please sign in or create an account before placing an order.",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Sign in",
      denyButtonText: "Create account",
      cancelButtonText: "Not now",
      cancelButtonColor: "#d7cec6",
      denyButtonColor: "#f0b79e",
    }),
  );
}

export function showNoVendorsAlert(locationLabel) {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title: "No Vendors Found",
      text: "Sorry! No vendors are available for the entered postal code.",
      confirmButtonText: "Okay",
    }),
  );
}

export function showNoProductsAlert() {
  return Swal.fire(
    withBaseOptions({
      icon: "info",
      title: "No Products Found",
      text: "There are currently no popular products available for this location.",
      confirmButtonText: "Okay",
    }),
  );
}

export function showMenuUnavailableAlert({
  menuTitle,
  message,
  availableDaysLabel = "",
}) {
  const safeTitle = menuTitle || "This menu";
  const subtitle = availableDaysLabel
    ? `Available on ${availableDaysLabel}`
    : "Please choose another date";

  return Swal.fire(
    withBaseOptions({
      icon: "warning",
      title: "Menu unavailable",
      confirmButtonText: "Choose another date",
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
