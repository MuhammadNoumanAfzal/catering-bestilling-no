import { useEffect, useState } from "react";
import ContactFaqSection from "../components/ContactFaqSection";
import ContactFormCard from "../components/ContactFormCard";
import ContactHeroContent from "../components/ContactHeroContent";
import ContactInfoCards from "../components/ContactInfoCards";
import ContactProcessSection from "../components/ContactProcessSection";
import {
  fetchContactPrefill,
  fetchContactTopics,
  submitContactInquiry,
} from "../api/contactService";
import {
  contactCards,
  contactFormTopics,
  faqItems,
  initialContactFormState,
  responseSteps,
} from "../data/contactPageData";
import {
  showAuthErrorAlert,
  showContactRequestSubmittedAlert,
} from "../../../utils/alerts";

function buildFallbackTopics() {
  return contactFormTopics.map((topic) => ({
    id: topic,
    label: topic,
  }));
}

export default function ContactPage() {
  const [formState, setFormState] = useState(initialContactFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [topics, setTopics] = useState(buildFallbackTopics);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefillState, setPrefillState] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContactPageDependencies() {
      try {
        const [loadedTopics, prefillData] = await Promise.allSettled([
          fetchContactTopics(),
          fetchContactPrefill(),
        ]);

        if (!isMounted) {
          return;
        }

        if (
          loadedTopics.status === "fulfilled" &&
          Array.isArray(loadedTopics.value) &&
          loadedTopics.value.length > 0
        ) {
          setTopics(loadedTopics.value);
          setFormState((current) => ({
            ...current,
            topic:
              loadedTopics.value.some(
                (topic) => (topic.id ?? topic) === current.topic,
              )
                ? current.topic
                : loadedTopics.value[0]?.id ??
                  loadedTopics.value[0]?.label ??
                  current.topic,
          }));
        } else {
          setTopics(buildFallbackTopics());
        }

        if (prefillData.status === "fulfilled" && prefillData.value) {
          setPrefillState(prefillData.value);
          setFormState((current) => ({
            ...current,
            name: prefillData.value.name || current.name,
            email: prefillData.value.email || current.email,
            company: prefillData.value.company || current.company,
            phone: prefillData.value.phone || current.phone,
          }));
        }
      } catch {
        if (isMounted) {
          setTopics(buildFallbackTopics());
        }
      } finally {
        if (isMounted) {
          setIsLoadingTopics(false);
        }
      }
    }

    loadContactPageDependencies();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (key, value) => {
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const result = await submitContactInquiry(formState);

      if (!result.success && result.errorType === "validation") {
        setFieldErrors(result.errors || {});
        return;
      }

      if (!result.success && result.errorType === "rate-limit") {
        await showAuthErrorAlert(
          result.message || "Too many requests. Please try again later.",
          "Please slow down",
        );
        return;
      }

      await showContactRequestSubmittedAlert();
      setFormState({
        ...initialContactFormState,
        name: prefillState?.name || "",
        email: prefillState?.email || "",
        company: prefillState?.company || "",
        phone: prefillState?.phone || "",
        topic: topics[0]?.id ?? topics[0]?.label ?? initialContactFormState.topic,
        message: "",
      });
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to submit your request right now.",
        "Contact request failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#fff9f4_0%,#fffdfb_24%,#f8f3ee_100%)] text-[#1f1b17]">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(207,110,56,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(244,195,129,0.24),transparent_32%),linear-gradient(180deg,#fff6ee_0%,rgba(255,246,238,0)_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <ContactHeroContent />
          <ContactFormCard
            fieldErrors={fieldErrors}
            formState={formState}
            isLoadingTopics={isLoadingTopics}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            topics={topics}
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
