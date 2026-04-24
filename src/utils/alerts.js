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
