import { FiClock, FiMessageSquare, FiSend } from "react-icons/fi";
import { contactFormTopics } from "../data/contactPageData";

function ContactFieldLabel({ children }) {
  return (
    <span className="mb-2 block text-sm font-semibold text-[#342c26]">
      {children}
    </span>
  );
}

function ContactInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition placeholder:text-[#aa9b8e] focus:border-[#c86135] ${className}`}
    />
  );
}

export default function ContactFormCard({
  formState,
  onSubmit,
  updateField,
}) {
  return (
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

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <ContactFieldLabel>Full name</ContactFieldLabel>
              <ContactInput
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Alex Johnson"
                required
              />
            </label>

            <label className="block">
              <ContactFieldLabel>Email address</ContactFieldLabel>
              <ContactInput
                type="email"
                value={formState.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="alex@company.com"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <label className="block">
              <ContactFieldLabel>Company or organization</ContactFieldLabel>
              <ContactInput
                type="text"
                value={formState.company}
                onChange={(event) => updateField("company", event.target.value)}
                placeholder="Lunsjavtale Studio"
              />
            </label>

            <label className="block">
              <ContactFieldLabel>Phone</ContactFieldLabel>
              <ContactInput
                type="tel"
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+47 000 00 000"
              />
            </label>
          </div>

          <label className="block">
            <ContactFieldLabel>What can we help with?</ContactFieldLabel>
            <select
              value={formState.topic}
              onChange={(event) => updateField("topic", event.target.value)}
              className="h-12 w-full rounded-[16px] border border-[#dfd1c4] bg-white px-4 text-[15px] text-[#2a2520] outline-none transition focus:border-[#c86135]"
            >
              {contactFormTopics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <ContactFieldLabel>Message</ContactFieldLabel>
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
  );
}
