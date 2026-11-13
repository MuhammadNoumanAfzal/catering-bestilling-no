import { FiStar, FiArrowUpRight, FiCheck, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { createOrderReviewClient } from "./orderReviewClient.js";
const api = createOrderReviewClient(graphqlRequest);
export default function OrderReviewSection({ orderId, vendorId, autoOpen = false }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(autoOpen);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [revision, setRevision] = useState(0);
  const section = useRef(null);
  useEffect(() => {
    let active = true; setLoading(true); setDetails(null); setError(""); setOpen(autoOpen); setRating(0); setComment(""); setTitle("");
    api.load(orderId).then(value => { if (active) setDetails(value); }).catch(() => { if (active) setError("unavailable"); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId, autoOpen, revision]);
  useEffect(() => { if (autoOpen && !loading) section.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [autoOpen, loading]);
  async function submit(event) {
    event.preventDefault(); if (saving || !details?.canReview || !rating) return;
    setSaving(true); setError("");
    try {
      const review = await api.submit(orderId, rating, comment, { vendorId, title, authorName: user?.name || [user?.firstName,user?.lastName].filter(Boolean).join(" "), authorEmail: user?.email });
      setDetails(current => ({ ...current, canReview: false, reviewIneligibilityReason: "ALREADY_REVIEWED", review })); setOpen(false);
    } catch (failure) {
      if (["DUPLICATE_REVIEW", "ALREADY_REVIEWED"].includes(String(failure.code || "").toUpperCase()) || /review.*already|already.*review/i.test(failure.message || "")) {
        try { setDetails(await api.load(orderId)); setOpen(false); } catch { setError("unavailable"); }
      } else setError("submitFailed");
    } finally { setSaving(false); }
  }
  const fieldClass = "mt-2 w-full rounded-xl border border-[#e6ded7] bg-[#fcfbfa] px-3 py-2.5 text-sm font-normal text-[#322a25] outline-none transition placeholder:text-[#aa9c92] focus:border-[#c65e30] focus:bg-white focus:ring-4 focus:ring-[#c65e30]/10 disabled:opacity-60";
  if (!loading && !error && details && !details.canReview && !details.review) {
    return <section ref={section} className="mx-4 my-3 flex items-start gap-2.5 rounded-xl bg-[#f7f6f3] px-4 py-3 sm:mx-5" aria-label={t("orderReview.title")}>
      <FiMessageSquare className="mt-0.5 shrink-0 text-[#a08a76]" size={15} aria-hidden="true"/>
      <p className="text-xs leading-5 text-[#8a7c6f]">{t("orderReview.reason." + details.reviewIneligibilityReason, {defaultValue:t("orderReview.notEligible")})}</p>
    </section>;
  }
  return (
    <section ref={section} className="mx-4 my-3 overflow-hidden rounded-xl border border-[#e8e2db] bg-white sm:mx-5" aria-label={t("orderReview.title")}>
      <header className="flex items-center gap-2.5 border-b border-[#f1ebe6] px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff1e7] text-[#c65e30]"><FiMessageSquare size={16} aria-hidden="true" /></span>
        <div><h3 className="text-sm font-semibold tracking-tight text-[#2f261f]">{t("orderReview.title")}</h3></div>
      </header>
      <div className="px-4 py-3.5">
        {loading ? <p className="text-sm text-[#8c7d72]" role="status">{t("orderReview.loading")}</p> : null}
        {error ? <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{t("orderReview." + error)} {error === "unavailable" ? <button type="button" onClick={() => setRevision(value => value + 1)} className="font-semibold underline underline-offset-2">{t("orderReview.retry")}</button> : null}</p> : null}
        {details?.review ? <div>
          <div className="flex items-center gap-1 text-[#d87a36]" aria-label={t("orderReview.starRating", { count: details.review.rating })}>{[1,2,3,4,5].map(value => <FiStar key={value} size={20} fill={value <= details.review.rating ? "currentColor" : "none"} aria-hidden="true" />)}<span className="ml-2 text-sm font-semibold text-[#57473c]">{details.review.rating}/5</span></div>
          {details.review.title ? <h4 className="mt-4 font-semibold text-[#352a23]">{details.review.title}</h4> : null}
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#79695c]">{details.review.comment}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800"><FiCheck aria-hidden="true" />{t("orderReview.submitted")}</p>
        </div> : null}
        {!loading && details && !details.canReview && !details.review ? <p className="text-sm leading-6 text-[#8c7c70]">{t("orderReview.reason." + details.reviewIneligibilityReason, { defaultValue: t("orderReview.notEligible") })}</p> : null}
        {details?.canReview && !details.review ? (open ? <form onSubmit={submit} className="space-y-3">
          <fieldset disabled={saving}>
            <legend className="text-sm font-semibold text-[#514136]">{t("orderReview.rating")}</legend>
            <div className="mt-3 flex items-center gap-1 sm:gap-2">{[1,2,3,4,5].map(value => <label key={value} className="cursor-pointer">
              <input type="radio" name={"rating-" + orderId} value={value} required checked={rating === value} onChange={() => setRating(value)} className="peer sr-only" aria-label={t("orderReview.starRating", { count: value })} />
              <span className={"flex h-11 w-11 items-center justify-center rounded-xl transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#c65e30] " + (value <= rating ? "bg-[#fff1e5] text-[#d77b35]" : "bg-[#faf7f4] text-[#d4c7bd] hover:bg-[#fff2e7] hover:text-[#d77b35]")}><FiStar size={25} fill={value <= rating ? "currentColor" : "none"} aria-hidden="true" /></span>
            </label>)}<span className="ml-2 text-sm font-semibold text-[#8d7562]" aria-live="polite">{rating ? rating + "/5" : ""}</span></div>
          </fieldset>
          <label className="block text-sm font-semibold text-[#514136]">{t("orderReview.reviewTitle")}<input required disabled={saving} value={title} onChange={event => setTitle(event.target.value)} placeholder={t("orderReview.titlePlaceholder")} className={fieldClass} /></label>
          <label className="block text-sm font-semibold text-[#514136]">{t("orderReview.comment")}<textarea value={comment} onChange={event => setComment(event.target.value)} disabled={saving} rows={3} placeholder={t("orderReview.commentPlaceholder")} className={fieldClass + " resize-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"} /></label>
          <div className="flex flex-col-reverse gap-2 border-t border-[#f1ebe6] pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button type="button" disabled={saving} onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-5 py-2.5 text-sm font-medium text-[#8b7869] transition hover:bg-[#f8f4f0] disabled:opacity-50">{t("orderReview.cancel")}</button>
            <button type="submit" disabled={saving || !rating || !vendorId || !title.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c65e30] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(198,94,48,0.15)] transition hover:bg-[#ad4f27] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none">{t(saving ? "orderReview.saving" : "orderReview.submit")}<FiArrowUpRight size={17} aria-hidden="true" /></button>
          </div>
        </form> : <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#c65e30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ad4f27]"><FiStar size={16} aria-hidden="true" />{t("orderReview.leave")}</button>) : null}
      </div>
    </section>
  );
}
