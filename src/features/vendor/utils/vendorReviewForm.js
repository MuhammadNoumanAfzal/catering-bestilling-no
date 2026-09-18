export const VENDOR_REVIEW_OCCASIONS = [
  "Office lunch",
  "Corporate event",
  "Private event",
  "Wedding",
  "Birthday",
  "Other",
];

export function createInitialVendorReviewFormState(initialValue = {}) {
  return {
    rating: Number(initialValue?.rating ?? 5) || 5,
    title: initialValue?.title || "",
    comment: initialValue?.comment || "",
    occasion: initialValue?.occasion || VENDOR_REVIEW_OCCASIONS[0],
    eventDate: initialValue?.eventDate || "",
    orderId: initialValue?.orderId || "",
    authorName: initialValue?.authorName || "",
    authorEmail: initialValue?.authorEmail || "",
  };
}

export function buildVendorReviewSubmissionPayload(vendor, formState) {
  return {
    vendorId: vendor?.id || "",
    rating: Number(formState.rating),
    title: formState.title.trim(),
    comment: formState.comment.trim(),
    occasion: formState.occasion.trim(),
    eventDate: formState.eventDate || null,
    orderId: formState.orderId.trim() || null,
    authorName: formState.authorName.trim(),
    authorEmail: formState.authorEmail.trim(),
  };
}

export function createPendingVendorReview(payload) {
  return {
    id: `pending-${Date.now()}`,
    rating: payload.rating,
    title: payload.title,
    comment: payload.comment,
    occasion: payload.occasion,
    author: payload.authorName || "Anonymous",
    date: payload.eventDate || new Date().toISOString().slice(0, 10),
    status: "pending",
  };
}

export function getVendorReviewSummaryCards(vendor, t) {
  return [
    {
      label: t("vendor.reviews.summaryRating"),
      value: `${Number(vendor?.rating ?? 0).toFixed(1)} / 5`,
      note: vendor?.reviewCount
        ? t("vendor.reviews.fromReviews", { count: vendor.reviewCount })
        : "",
    },
    {
      label: t("vendor.reviews.summaryLocation"),
      value: vendor?.city || vendor?.addressLine || t("vendor.reviews.notAvailable"),
      note: vendor?.addressLine || "",
    },
  ];
}