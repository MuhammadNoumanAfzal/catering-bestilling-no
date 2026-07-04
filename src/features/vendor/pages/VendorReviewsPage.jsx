import { useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiMapPin,
  FiMessageSquare,
  FiPlus,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";
import { useVendorProfile } from "../hooks/useVendorProfile";
import { useVendorReviews } from "../hooks/useVendorReviews";
import VendorReviewModal from "../components/VendorReviewModal";
import {
  buildVendorReviewSubmissionPayload,
  getVendorReviewSummaryCards,
} from "../utils/vendorReviewForm";

function SummaryCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-[22px] border border-[#eadfd2] bg-[#f8f2eb] p-5 shadow-[0_10px_22px_rgba(31,19,8,0.04)]">
      <div className="flex items-center gap-2 text-[#171512]">
        <Icon className="text-[16px]" />
        <p className="text-[16px] font-medium">{label}</p>
      </div>
      <p className="mt-3 text-[31px] font-semibold leading-none tracking-[-0.04em] text-[#171512]">
        {value}
      </p>
      {note ? (
        <p className="mt-3 text-[14px] leading-6 text-[#665b51]">{note}</p>
      ) : null}
    </div>
  );
}

function ReviewCard({ review, isFeatured = false }) {
  return (
    <article
      className={`overflow-hidden rounded-[24px] border border-[#eadfd2] ${
        isFeatured
          ? "bg-[linear-gradient(135deg,#fffaf5_0%,#fff3ea_100%)] shadow-[0_20px_44px_rgba(31,19,8,0.08)]"
          : "bg-white shadow-[0_12px_26px_rgba(31,19,8,0.05)]"
      }`}
    >
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-[#f6efe7] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7b6c61]">
                {review.occasion || "General"}
              </span>
            </div>

            <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-[#171512]">
              {review.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] text-[#74685d]">
              <span className="font-medium text-[#28211c]">
                {review.author}
              </span>
              <span>&bull;</span>
              <span>{review.date}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6dc] px-4 py-2 text-[15px] font-semibold text-[#805c05]">
            <FiStar className="fill-current" />
            {Number(review.rating ?? 0).toFixed(1)}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#564f49]">
          {review.comment}
        </p>
      </div>
    </article>
  );
}

function EmptyReviewsState({ onAddReview, canReview }) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#e3d7ca] bg-[linear-gradient(180deg,#fffaf6_0%,#fff4eb_100%)] p-8 text-center shadow-[0_14px_36px_rgba(31,19,8,0.05)]">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-[#cf6e38] shadow-[0_10px_24px_rgba(31,19,8,0.06)]">
        <FiMessageSquare className="text-[26px]" />
      </div>
      <h2 className="mt-5 text-[28px] font-semibold tracking-[-0.03em] text-[#171512]">
        No reviews published yet
      </h2>
      {canReview ? (
        <button
          type="button"
          onClick={onAddReview}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#cf6e38] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
        >
          <FiPlus className="text-[16px]" />
          Write a review
        </button>
      ) : (
        <p className="mt-5 text-sm text-[#74685d]">
          Reviews can be submitted after an eligible order is completed.
        </p>
      )}
    </div>
  );
}

export default function VendorReviewsPage() {
  const { vendorSlug } = useParams();
  const { vendor, isLoading, error } = useVendorProfile(vendorSlug);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const {
    reviews,
    totalCount,
    isLoading: isReviewsLoading,
    isLoadingMore,
    isSubmitting,
    error: reviewsError,
    loadMore,
    createReview,
    pageInfo,
  } = useVendorReviews(vendorSlug);

  const featuredReview = reviews[0] ?? null;
  const otherReviews = reviews.slice(1);
  const reviewCount =
    totalCount ||
    Number(vendor?.reviewSummary?.totalCount ?? vendor?.reviewCount ?? 0) ||
    reviews.length;
  const canReview = Boolean(vendor?.canReview);
  const derivedAverageRating = reviews.length
    ? (
        reviews.reduce(
          (total, review) => total + Number(review.rating || 0),
          0,
        ) / reviews.length
      ).toFixed(1)
    : null;
  const averageRating = (
    vendor?.reviewSummary?.averageRating ??
    derivedAverageRating ??
    Number(vendor?.rating ?? 0)
  ).toString();
  const summaryCards = useMemo(
    () =>
      getVendorReviewSummaryCards({
        ...vendor,
        rating: averageRating,
        reviewCount,
      }).map((card, index) => ({
        ...card,
        icon:
          index === 0
            ? FiStar
            : index === 1
              ? FiMapPin
              : index === 2
                ? FiTruck
                : FiMessageSquare,
      })),
    [averageRating, reviewCount, vendor],
  );

  if (isLoading || isReviewsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return <Navigate to="/" replace />;
  }

  const handleReviewSubmit = async (formState) => {
    const payload = buildVendorReviewSubmissionPayload(vendor, formState);

    if (!payload.authorName || !payload.authorEmail || !payload.title || !payload.comment) {
      await showAuthErrorAlert(
        "Please complete name, email, title, and review details before submitting.",
        "Missing review details",
      );
      return;
    }

    try {
      const response = await createReview(payload);
      setIsReviewModalOpen(false);
      await showSuccessToast(response.message || "Review submitted successfully");
    } catch (submitError) {
      await showAuthErrorAlert(
        submitError.message || "Unable to submit your review right now.",
        "Review submission failed",
      );
    }
  };

  return (
    <section className="relative overflow-hidden px-4 py-5 md:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#fff1e6_0%,transparent_32%),radial-gradient(circle_at_top_right,#f4eee6_0%,transparent_28%),linear-gradient(180deg,#f9f3ec_0%,#fffdfa_34%,#f7f0e9_100%)]" />

      <div className="mx-auto max-w-6xl">
        <Link
          to={`/vendor/${vendor.slug}`}
          className="inline-flex items-center gap-2 text-[16px] font-medium text-[#2c76ff] transition hover:text-[#cf6e38]"
        >
          <FiChevronLeft className="text-[18px]" />
          Back to vendor page
        </Link>

        <div className="mt-5 overflow-hidden rounded-[30px] border border-[#eadfd2] bg-[linear-gradient(135deg,#fffaf6_0%,#fff2e9_45%,#fff9f3_100%)] shadow-[0_24px_56px_rgba(31,19,8,0.08)]">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#cf6e38]">
                  Guest Feedback
                </p>
                <h1 className="mt-3 text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#171512] sm:text-[48px]">
                  Reviews for {vendor.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-[15px] text-[#4f4740]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(31,19,8,0.04)]">
                    <FiStar className="fill-[#f4b400] text-[#f4b400]" />
                    <span className="font-semibold text-[#171512]">
                      {averageRating}
                    </span>
                    <span>from {reviewCount} reviews</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(31,19,8,0.04)]">
                    <FiMapPin className="text-[14px]" />
                    {vendor.addressLine}
                  </span>
                  {!canReview ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(31,19,8,0.04)]">
                      <FiMessageSquare className="text-[14px]" />
                      Review available after eligible order
                    </span>
                  ) : null}
                </div>
              </div>

              {canReview ? (
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#cf6e38] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
                >
                  <FiPlus className="text-[16px]" />
                  Write a review
                </button>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  note={card.note}
                />
              ))}
            </div>
          </div>
        </div>

        {featuredReview ? (
          <div className="mt-8">
            <ReviewCard review={featuredReview} isFeatured />
          </div>
        ) : (
          <div className="mt-8">
            <EmptyReviewsState
              canReview={canReview}
              onAddReview={() => setIsReviewModalOpen(true)}
            />
          </div>
        )}

        {otherReviews.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {otherReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : null}

        {reviewsError ? (
          <div className="mt-6 rounded-[20px] border border-[#eadfd2] bg-white p-4 text-sm text-[#8b3f1f]">
            {reviewsError}
          </div>
        ) : null}

        {pageInfo.hasNextPage ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="rounded-[12px] border border-[#d8ccc0] bg-white px-5 py-3 text-[14px] font-semibold text-[#27211c] transition hover:bg-[#faf5f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? "Loading..." : "Load more reviews"}
            </button>
          </div>
        ) : null}
      </div>

      {isReviewModalOpen && canReview ? (
        <VendorReviewModal
          vendor={vendor}
          onCancel={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </section>
  );
}
