export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="w-full rounded-[28px] border border-[#ece6de] bg-white p-6 shadow-[0_20px_60px_rgba(33,24,16,0.08)] sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="type-h3 text-[#1d1a17]">{title}</h1>
        {subtitle ? (
          <p className="type-para mt-2 text-[#7c746d]">{subtitle}</p>
        ) : null}
      </div>

      {children}

      {footer ? <div className="mt-5 text-center">{footer}</div> : null}
    </section>
  );
}
