export default function ContactProcessSection({ steps }) {
  return (
    <article className="rounded-[30px] border border-[#e7d9cb] bg-[#201b17] p-6 text-white shadow-[0_26px_60px_rgba(32,27,23,0.16)] sm:p-8">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f1b899]">
        How It Works
      </p>
      <h2 className="mt-3 max-w-md text-[34px] font-semibold leading-tight">
        A smoother support flow for busy teams and event planners
      </h2>

      <div className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c86135] text-sm font-semibold text-white">
                0{index + 1}
              </div>
              <h3 className="text-[19px] font-semibold">{step.title}</h3>
            </div>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-[#eadfd7]">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
