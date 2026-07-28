import BackLinkButton from "../../../components/shared/BackLinkButton";

function LegalSection({ title, children }) {
  return (
    <section className="rounded-[24px] border border-[#eadfd5] bg-white p-5 shadow-[0_14px_30px_rgba(55,34,19,0.05)] sm:p-6">
      <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#1d1713]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#564b43]">
        {children}
      </div>
    </section>
  );
}

export default function LegalPageLayout({
  eyebrow,
  title,
  intro,
  updatedLabel = "Last updated: July 28, 2026",
  children,
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#fffdfb_40%,#f8f1ea_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <BackLinkButton to="/" className="mb-6">
          Back to home
        </BackLinkButton>

        <div className="rounded-[30px] border border-[#eadfd5] bg-[linear-gradient(135deg,#fffdfb_0%,#fff5ed_100%)] p-6 shadow-[0_24px_56px_rgba(55,34,19,0.07)] sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b37a59]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] text-[#17120f] sm:text-[46px]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#5f534a] sm:text-[16px]">
            {intro}
          </p>
          <p className="mt-4 inline-flex rounded-full border border-[#ead7c9] bg-white/80 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8d7768]">
            {updatedLabel}
          </p>
        </div>

        <div className="mt-6 space-y-5">{children}</div>
      </div>
    </main>
  );
}

export { LegalSection };
