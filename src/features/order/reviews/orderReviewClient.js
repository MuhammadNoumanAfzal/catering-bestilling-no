export const ORDER_REVIEW_QUERY = `query CustomerOrderReview($orderId: ID!) {
  customerOrder(id: $orderId) { id status canReview reviewIneligibilityReason review { id rating comment status createdAt } }
}`;
export const SUBMIT_ORDER_REVIEW = `mutation SubmitOrderLinkedVendorReview($input: VendorReviewInput!) {
  createVendorReview(input: $input) { success message review { id rating title comment status createdOn } }
}`;
export function createOrderReviewClient(request) {
  return {
    async load(orderId) {
      const data = await request({ query: ORDER_REVIEW_QUERY, variables: { orderId } });
      if (!data?.customerOrder) throw new Error("Unable to load review details.");
      return data.customerOrder;
    },
    async submit(orderId, rating, comment, context = {}) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("INVALID_RATING");
      if (!context.vendorId || !context.authorEmail || !context.authorName || !String(context.title || "").trim()) throw new Error("Missing review details.");
      const data = await request({ query: SUBMIT_ORDER_REVIEW, variables: { input: { vendorId: context.vendorId, orderId: String(orderId), rating, title: context.title.trim(), comment: String(comment || "").trim(), authorName: context.authorName, authorEmail: context.authorEmail } } });
      const result = data?.createVendorReview;
      if (!result?.success || !result.review?.id) {
        const error = new Error(result?.message || "Unable to submit review.");
        error.code = /already.*review|review.*already/i.test(result?.message || "") ? "ALREADY_REVIEWED" : "SUBMIT_FAILED"; throw error;
      }
      return { ...result.review, createdAt: result.review.createdOn || result.review.createdAt };
    },
  };
}
