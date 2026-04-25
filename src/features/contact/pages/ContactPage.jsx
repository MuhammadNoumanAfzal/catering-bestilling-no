import { useEffect, useState } from "react";
import ContactFaqSection from "../components/ContactFaqSection";
import ContactFormCard from "../components/ContactFormCard";
import ContactHeroContent from "../components/ContactHeroContent";
import ContactInfoCards from "../components/ContactInfoCards";
import ContactProcessSection from "../components/ContactProcessSection";
import {
  contactCards,
  faqItems,
  initialContactFormState,
  responseSteps,
} from "../data/contactPageData";
import { showSuccessToast } from "../../../utils/alerts";

export default function ContactPage() {
  const [formState, setFormState] = useState(initialContactFormState);

  const updateField = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await showSuccessToast("Message sent successfully");
    setFormState(initialContactFormState);
  };

  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#fff9f4_0%,#fffdfb_24%,#f8f3ee_100%)] text-[#1f1b17]">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(207,110,56,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(244,195,129,0.24),transparent_32%),linear-gradient(180deg,#fff6ee_0%,rgba(255,246,238,0)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <ContactHeroContent />
          <ContactFormCard
            formState={formState}
            onSubmit={handleSubmit}
            updateField={updateField}
          />
        </div>
      </section>

      <ContactInfoCards cards={contactCards} />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <ContactProcessSection steps={responseSteps} />
        <ContactFaqSection items={faqItems} />
      </section>
    </main>
  );
}
