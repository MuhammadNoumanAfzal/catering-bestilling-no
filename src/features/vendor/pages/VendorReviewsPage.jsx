import { FiChevronLeft, FiMapPin, FiMessageSquare, FiStar } from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getVendorProfileBySlug,
  getVendorReviewsBySlug,
} from "../data/vendorData";

const REVIEW_HIGHLIGHTS = [
  {
    label: "Delivery Timing",
    score: "4.9/5",
    note: "Orders usually arrive on time and event-ready.",
  },
  {
    label: "Food Quality",
    score: "4.8/5",
    note: "Guests consistently praise freshness and flavor.",
  },
  {
    label: "Presentation",
    score: "4.7/5",
    note: "Packaging and setup feel polished for office events.",
  },
];

function StatCard({ label, value, accent = "default" }) {
  const accentClasses =
    accent === "warm"
      ? "bg-[#fff2e8] text-[#cf6e38]"
      : accent === "gold"
        ? "bg-[#fff7dd] text-[#8b6a11]"
        : "bg-white text-[#1a1714]";

  return (
    <div className="rounded-[18px] border border-[#eadfd2] bg-white/80 p-4 shadow-[0_10px_24px_rgba(31,19,8,0.04)] backdrop-blur">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8a7d71]">
        {label}
      </p>
      <div
        className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-[16px] font-semibold ${accentClasses}`}
      >
        {value}
      </div>
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
                {review.occasion}
              </span>
              {isFeatured ? (
                <span className="inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#cf6e38]">
                  Featured Review
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.03em] text-[#171512]">
              {review.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] text-[#74685d]">
              <span className="font-medium text-[#28211c]">{review.author}</span>
              <span>•</span>
              <span>{review.date}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff6dc] px-4 py-2 text-[15px] font-semibold text-[#805c05]">
            <FiStar className="fill-current" />
            {review.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#564f49]">
          {review.comment}
        </p>
      </div>
    </article>
  );
}

export default function VendorReviewsPage() {
  const { vendorSlug } = useParams();
  const vendor = getVendorProfileBySlug(vendorSlug);
  const reviews = getVendorReviewsBySlug(vendorSlug);
  const featuredReview = reviews[0] ?? null;
  const otherReviews = reviews.slice(1);
  const averageRating = vendor?.rating?.toFixed(1) ?? "0.0";

  if (!vendor) {
    return <Navigate to="/" replace />;
  }

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
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:p-8">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#cf6e38]">
                Guest Feedback
              </p>
              <h1 className="mt-3 max-w-2xl text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#171512] sm:text-[48px]">
                Reviews for {vendor.name}
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#62564c]">
                A full look at how teams rate this vendor for food quality,
                reliability, packaging, and event delivery experience.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-[15px] text-[#4f4740]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(31,19,8,0.04)]">
                  <FiStar className="fill-[#f4b400] text-[#f4b400]" />
                  <span className="font-semibold text-[#171512]">
                    {averageRating}
                  </span>
                  <span>from {vendor.reviewCount} reviews</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(31,19,8,0.04)]">
                  <FiMapPin className="text-[14px]" />
                  {vendor.addressLine}
                </span>
              </div>
            </div>

            <div className="grid gap-3 self-start">
              <StatCard
                label="Average Rating"
                value={`${averageRating} / 5`}
                accent="gold"
              />
              <StatCard
                label="Total Reviews"
                value={`${vendor.reviewCount}+`}
                accent="warm"
              />
              <StatCard
                label="Cuisine"
                value={vendor.cuisine}
              />
            </div>
          </div>
        </div>

        {featuredReview ? (
          <div className="mt-8">
            <ReviewCard review={featuredReview} isFeatured />
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-[#eadfd2] bg-[linear-gradient(180deg,#fffaf6_0%,#fff5ed_100%)] shadow-[0_22px_48px_rgba(31,19,8,0.08)]">
              <div className="border-b border-[#f0e2d5] px-5 py-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#fff1e8] text-[#cf6e38] shadow-[0_10px_24px_rgba(207,110,56,0.14)]">
                  <FiMessageSquare className="text-[22px]" />
                </div>

                <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] text-[#171512]">
                  Review Snapshot
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-[#665b51]">
                  A quick summary of what customers consistently highlight about
                  this vendor.
                </p>

                <div className="mt-5 rounded-[20px] border border-[#efdccd] bg-white/85 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a7d71]">
                    Overall Score
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fff7dd] px-4 py-2 text-[18px] font-semibold text-[#8b6a11]">
                      <FiStar className="fill-current" />
                      {averageRating}
                    </div>
                    <p className="text-right text-[13px] leading-5 text-[#7a6d61]">
                      Based on
                      <br />
                      {vendor.reviewCount} verified reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a7d71]">
                  Top Signals
                </p>

                <div className="mt-4 space-y-3">
                  {REVIEW_HIGHLIGHTS.map((highlight) => (
                    <div
                      key={highlight.label}
                      className="rounded-[20px] border border-[#eedfd2] bg-white/90 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[15px] font-semibold text-[#211c18]">
                          {highlight.label}
                        </p>
                        <span className="inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                          {highlight.score}
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-[#6d6258]">
                        {highlight.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[20px] bg-[#f7efe7] px-4 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a7d71]">
                    Most Mentioned
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#5d5147]">
                      Reliable delivery
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#5d5147]">
                      Fresh ingredients
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#5d5147]">
                      Clean presentation
                    </span>
                    <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#5d5147]">
                      Office-friendly setup
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="grid gap-4">
            {otherReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
