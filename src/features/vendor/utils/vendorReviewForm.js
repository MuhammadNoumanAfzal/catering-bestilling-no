export const VENDOR_REVIEW_OCCASIONS = [
  "Office lunch",
  "Corporate event",
  "Private event",
  "Wedding",
  "Birthday",
  "Other",
];

export function createInitialVendorReviewFormState() {
  return {
    rating: 5,
    title: "",
    comment: "",
    occasion: VENDOR_REVIEW_OCCASIONS[0],
    eventDate: "",
    orderId: "",
    authorName: "",
    authorEmail: "",
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

export function getVendorReviewSummaryCards(vendor) {
  const reviewSummary = vendor?.reviewSummary || null;
  const ratingBreakdown = Array.isArray(reviewSummary?.ratingBreakdown)
    ? reviewSummary.ratingBreakdown
    : [];
  const topRatingBand = ratingBreakdown.reduce(
    (bestMatch, item) => {
      const count = Number(item?.count ?? 0);

      if (count > bestMatch.count) {
        return {
          stars: Number(item?.stars ?? 0),
          count,
        };
      }

      return bestMatch;
    },
    { stars: 0, count: 0 },
  );

  return [
    {
      label: "Rating",
      value: `${Number(vendor?.rating ?? 0).toFixed(1)} / 5`,
      note: vendor?.reviewCount ? `${vendor.reviewCount} reviews` : "",
    },
    {
      label: "Location",
      value: vendor?.city || vendor?.addressLine || "Not available",
      note: vendor?.addressLine || "",
    },
    {
      label: "Delivery",
      value: vendor?.deliveryFee || "Not available",
      note: "",
    },
    {
      label: "Timing",
      value: vendor?.leadTime || "Not available",
      note:
        topRatingBand.count > 0
          ? `Most reviews are ${topRatingBand.stars}-star ratings`
          : vendor?.availability?.delivery?.label || "",
    },
  ];
}
