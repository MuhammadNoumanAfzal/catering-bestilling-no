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
  return <section ref={section} className="mx-6 my-5 rounded-2xl border border-[#eadfd6] bg-[#fffaf6] p-4 sm:p-5" aria-label={t("orderReview.title")}>
    <h3 className="text-lg font-bold">{t("orderReview.title")}</h3>
    {loading ? <p className="mt-2 text-sm" role="status">{t("orderReview.loading")}</p> : null}
    {error ? <p className="mt-2 text-sm text-red-700" role="alert">{t("orderReview." + error)} {error === "unavailable" ? <button type="button" onClick={() => setRevision(value => value + 1)} className="underline">{t("orderReview.retry")}</button> : null}</p> : null}
    {details?.review ? <div className="mt-3"><p className="font-semibold">{details.review.rating} / 5</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{details.review.comment}</p><p className="mt-2 text-xs text-[#74665c]">{t("orderReview.submitted")}</p></div> : null}
    {!loading && details && !details.canReview && !details.review ? <p className="mt-2 text-sm text-[#74665c]">{t("orderReview.reason." + details.reviewIneligibilityReason, { defaultValue: t("orderReview.notEligible") })}</p> : null}
    {details?.canReview && !details.review ? (open ? <form onSubmit={submit} className="mt-4 space-y-3">
      <fieldset disabled={saving}><legend className="text-sm font-semibold">{t("orderReview.rating")}</legend><div className="mt-2 flex flex-wrap gap-2">{[1,2,3,4,5].map(value => <label key={value} className={"cursor-pointer rounded-lg border px-3 py-2 " + (rating === value ? "border-[#c65e30] bg-[#fff0e5]" : "border-[#dfd4cb] bg-white")}><input type="radio" name={"rating-" + orderId} value={value} required checked={rating === value} onChange={() => setRating(value)} className="mr-1" />{value} ?</label>)}</div></fieldset>
      <label className="block text-sm font-semibold">{t("orderReview.reviewTitle")}<input required disabled={saving} value={title} onChange={event => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dfd4cb] bg-white p-3 font-normal" /></label>
      <label className="block text-sm font-semibold">{t("orderReview.comment")}<textarea value={comment} onChange={event => setComment(event.target.value)} disabled={saving} rows={4} className="mt-2 w-full rounded-xl border border-[#dfd4cb] bg-white p-3 font-normal" /></label>
      <div className="flex flex-wrap gap-2"><button type="submit" disabled={saving || !rating || !vendorId || !title.trim()} className="rounded-full bg-[#c65e30] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{t(saving ? "orderReview.saving" : "orderReview.submit")}</button><button type="button" disabled={saving} onClick={() => setOpen(false)} className="rounded-full border px-5 py-2 text-sm">{t("orderReview.cancel")}</button></div>
    </form> : <button type="button" onClick={() => setOpen(true)} className="mt-3 rounded-full bg-[#c65e30] px-5 py-2 text-sm font-semibold text-white">{t("orderReview.leave")}</button>) : null}
  </section>;
}
