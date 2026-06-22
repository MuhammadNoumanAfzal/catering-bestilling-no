import { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";
import {
  createInitialVendorReviewFormState,
  VENDOR_REVIEW_OCCASIONS,
} from "../utils/vendorReviewForm";

function RatingPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
            rating <= value
              ? "border-[#f4c44f] bg-[#fff5d8] text-[#c48a00]"
              : "border-[#e3d8cc] bg-white text-[#8f8479]"
          }`}
          aria-label={`Rate ${rating} out of 5`}
        >
          <FiStar className={rating <= value ? "fill-current" : ""} />
        </button>
      ))}
    </div>
  );
}

export default function VendorReviewModal({ vendor, onCancel, onSubmit }) {
  const [formState, setFormState] = useState(() =>
    createInitialVendorReviewFormState(),
  );

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formState);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1b140f]/55 px-4 py-4 backdrop-blur-[2px]">
      <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#e8ddd2] bg-[#fffaf6] shadow-[0_28px_90px_rgba(22,14,9,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#efe2d6] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#cf6e38]">
              Leave a review
            </p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#171512] sm:text-[28px]">
              Share your experience with {vendor.name}
            </h2>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6a5d52]">
              Your review helps other customers understand food quality,
              delivery reliability, and the overall catering experience.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e3d8cc] bg-white text-[#54493f] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
            aria-label="Close review form"
          >
            <FiX className="text-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="space-y-4">
            <div>
              <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8a7d71]">
                Overall rating
              </span>
              <RatingPicker
                value={formState.rating}
                onChange={(rating) => updateField("rating", rating)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                  Your name
                </span>
                <input
                  value={formState.authorName}
                  onChange={(event) => updateField("authorName", event.target.value)}
                  placeholder="John Doe"
                  className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                  Email
                </span>
                <input
                  type="email"
                  value={formState.authorEmail}
                  onChange={(event) => updateField("authorEmail", event.target.value)}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                  Occasion
                </span>
                <select
                  value={formState.occasion}
                  onChange={(event) => updateField("occasion", event.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
                >
                  {VENDOR_REVIEW_OCCASIONS.map((occasion) => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                  Event date
                </span>
                <input
                  type="date"
                  value={formState.eventDate}
                  onChange={(event) => updateField("eventDate", event.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                Review title
              </span>
              <input
                value={formState.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Professional service and very fresh food"
                className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                Order ID
              </span>
              <input
                value={formState.orderId}
                onChange={(event) => updateField("orderId", event.target.value)}
                placeholder="ORD-10293"
                className="h-11 w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] font-semibold text-[#2a241f]">
                Review details
              </span>
              <textarea
                value={formState.comment}
                onChange={(event) => updateField("comment", event.target.value)}
                placeholder="Tell other customers how the food, setup, delivery, and overall experience went."
                className="min-h-[110px] w-full rounded-[12px] border border-[#ddd2c6] bg-white px-3 py-3 text-[#1f1a16] outline-none transition focus:border-[#cf6e38]"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#efe2d6] px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[12px] border border-[#d8ccc0] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#27211c] transition hover:bg-[#faf5f0]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-[12px] bg-[#cf6e38] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d]"
          >
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}
