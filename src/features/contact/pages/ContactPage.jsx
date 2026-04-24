import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiHeadphones,
  FiHelpCircle,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhoneCall,
  FiSend,
} from "react-icons/fi";
import { showSuccessToast } from "../../../utils/alerts";

const contactCards = [
  {
    title: "General support",
    value: "support@lunsjavtale.no",
    description: "Help with bookings, delivery details, account questions, and order updates.",
    icon: FiMail,
    accent: "from-[#fff1e7] to-[#fffaf5]",
  },
  {
    title: "Call our team",
    value: "+47 22 40 88 10",
    description: "Best for urgent catering changes, delivery coordination, and vendor timing.",
    icon: FiPhoneCall,
    accent: "from-[#fff6ec] to-[#fffdf8]",
  },
  {
    title: "Visit the kitchen desk",
    value: "Bryggen 14, Bergen",
    description: "Meet the team for partnership conversations, menu tastings, and event planning.",
    icon: FiMapPin,
    accent: "from-[#fff3ed] to-[#fffaf7]",
  },
];

const responseSteps = [
  {
    title: "Tell us what you need",
    text: "Share your event size, delivery date, and what kind of help you want from us.",
  },
  {
    title: "We match the right team",
    text: "Orders go to support, large events go to planning, and vendor issues go to operations.",
  },
  {
    title: "You get a clear next step",
    text: "Expect a practical reply with timing, availability, and what happens next.",
  },
];

const faqItems = [
  {
    question: "How fast do you reply?",
    answer: "Most contact requests are answered within one business day, and urgent order issues are prioritized faster.",
  },
  {
    question: "Can you help with large office catering?",
    answer: "Yes. We support recurring lunches, internal events, launches, and one-off large team gatherings.",
  },
  {
    question: "Do you work with vendors too?",
    answer: "Yes. Restaurants and catering partners can contact us for onboarding, menu setup, and operations support.",
  },
];

const initialFormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  topic: "Event planning",
  message: "",
};

export default function ContactPage() {
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await showSuccessToast("Message sent successfully");
    setFormState(initialFormState);
  };

  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#fff9f4_0%,#fffdfb_24%,#f8f3ee_100%)] text-[#1f1b17]">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(207,110,56,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(244,195,129,0.24),transparent_32%),linear-gradient(180deg,#fff6ee_0%,rgba(255,246,238,0)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ecd9cb] bg-white/85 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b56237] shadow-[0_10px_26px_rgba(94,54,24,0.08)] backdrop-blur">
              <FiHeadphones className="text-[15px]" />
              Contact & Event Support
            </div>

            <h1 className="mt-6 max-w-2xl font-serif text-[42px] leading-[1.02] text-[#1f1a16] sm:text-[56px] lg:text-[68px]">
              Planning lunch for ten or catering for two hundred?
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-8 text-[#5d554f] sm:text-[18px]">
              Reach a team that understands food logistics, vendor coordination,
              and polished event delivery. We help turn vague requests into clear
              plans quickly.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@lunsjavtale.no"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c86135] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_18px_34px_rgba(200,97,53,0.24)] transition hover:bg-[#b5542b]"
              >
                Email support
                <FiArrowRight className="text-[16px]" />
              </a>
              <Link
                to="/browse/food-type"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dccbbd] bg-white/90 px-6 py-3 text-[15px] font-semibold text-[#2a2520] transition hover:border-[#c86135] hover:text-[#c86135]"
              >
                Explore menus
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#eadccf] bg-white/88 p-4 shadow-[0_16px_32px_rgba(43,31,20,0.06)] backdrop-blur">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#af7d5f]">
                  Average reply
                </p>
                <p className="mt-2 text-[26px] font-semibold text-[#1e1a16]">
                  &lt; 1 day
                </p>
              </div>
              <div className="rounded-[22px] border border-[#eadccf] bg-white/88 p-4 shadow-[0_16px_32px_rgba(43,31,20,0.06)] backdrop-blur">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#af7d5f]">
                  Coverage
                </p>
                <p className="mt-2 text-[26px] font-semibold text-[#1e1a16]">
                  Office + private
                </p>
              </div>
              <div className="rounded-[22px] border border-[#eadccf] bg-white/88 p-4 shadow-[0_16px_32px_rgba(43,31,20,0.06)] backdrop-blur">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#af7d5f]">
                  Support hours
                </p>
                <p className="mt-2 text-[26px] font-semibold text-[#1e1a16]">
                  08:00-18:00
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 top-10 -z-10 h-40 w-40 rounded-full bg-[#f7d6bf]/55 blur-3xl" />
            <div className="rounded-[30px] border border-[#eadccf] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(252,246,240,0.92))] p-5 shadow-[0_30px_70px_rgba(48,31,17,0.1)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b77754]">
                    Priority desk
                  </p>
                  <h2 className="mt-2 text-[30px] font-semibold leading-tight text-[#201b17]">
                    Tell us what you need and we will route it fast
                  </h2>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#c86135] sm:inline-flex">
                  <FiMessageSquare className="text-[22px]" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Alex Johnson"
                      className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135]"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                      Email address
                    </span>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="alex@company.com"
                      className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135]"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                      Company or organization
                    </span>
                    <input
                      type="text"
                      value={formState.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      placeholder="Lunsjavtale Studio"
                      className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                      Phone
                    </span>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="+47 000 00 000"
                      className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                    What can we help with?
                  </span>
                  <select
                    value={formState.topic}
                    onChange={(event) => updateField("topic", event.target.value)}
                    className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition focus:border-[#c86135]"
                  >
                    <option>Event planning</option>
                    <option>Corporate lunch program</option>
                    <option>Order support</option>
                    <option>Vendor partnership</option>
                    <option>General question</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#342c26]">
                    Message
                  </span>
                  <textarea
                    value={formState.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Tell us your event date, headcount, preferred cuisine, delivery location, or any issue you need help with."
                    className="min-h-[150px] w-full rounded-[20px] border border-[#dfd1c4] bg-white px-4 py-3 text-[15px] leading-7 text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135]"
                    required
                  />
                </label>

                <div className="flex flex-col gap-3 border-t border-[#eee2d8] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-[#6a625b]">
                    <FiClock className="text-[#c86135]" />
                    We usually respond within one business day.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#201b17] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#342b24]"
                  >
                    Send message
                    <FiSend className="text-[16px]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {contactCards.map((card) => {
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <article className="rounded-[30px] border border-[#e7d9cb] bg-[#201b17] p-6 text-white shadow-[0_26px_60px_rgba(32,27,23,0.16)] sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f1b899]">
            How It Works
          </p>
          <h2 className="mt-3 max-w-md text-[34px] font-semibold leading-tight">
            A smoother support flow for busy teams and event planners
          </h2>

          <div className="mt-8 space-y-4">
            {responseSteps.map((step, index) => (
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

        <article className="rounded-[30px] border border-[#eadccf] bg-white p-6 shadow-[0_24px_54px_rgba(43,31,20,0.08)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#c86135]">
              <FiHelpCircle className="text-[22px]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#b77754]">
                FAQ
              </p>
              <h2 className="mt-1 text-[32px] font-semibold leading-tight text-[#1f1a16]">
                Quick answers before you send
              </h2>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[22px] border border-[#eee3d8] bg-[#fcf8f4] p-5"
              >
                <h3 className="text-[18px] font-semibold text-[#231e1a]">
                  {item.question}
                </h3>
                <p className="mt-2 text-[15px] leading-7 text-[#5e5650]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
