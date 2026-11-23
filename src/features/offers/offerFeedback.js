import Swal from 'sweetalert2';

export function showOfferSuccessToast(title) {
  return Swal.fire({ toast: true, position: 'top-end', icon: 'success', titleText: title, showConfirmButton: false, showCloseButton: true, timer: 3000, timerProgressBar: true, background: '#fffaf6', color: '#1a1410' });
}

export function confirmOfferAction({ title, text, confirmButtonText, cancelButtonText, icon }) {
  return Swal.fire({ titleText: title, text, confirmButtonText, cancelButtonText, icon, showCancelButton: true, reverseButtons: true, confirmButtonColor: '#ce6534', background: '#fffaf6', color: '#1a1410' });
}
