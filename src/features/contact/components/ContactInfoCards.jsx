export default function ContactInfoCards({ cards }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className={`rounded-[28px] border border-[#eadccf] bg-gradient-to-br ${card.accent} p-6 shadow-[0_18px_36px_rgba(44,29,18,0.06)]`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c86135] shadow-[0_10px_24px_rgba(200,97,53,0.12)]">
                <Icon className="text-[20px]" />
              </div>
              <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#b07a5c]">
                {card.title}
              </p>
              <h3 className="mt-2 text-[26px] font-semibold leading-tight text-[#1f1a16]">
                {card.value}
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#5d554f]">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
