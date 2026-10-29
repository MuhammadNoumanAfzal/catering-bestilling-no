import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ClipboardList, MapPin, ShieldCheck, Utensils, Wallet } from "lucide-react";
import "./businessCatering.css";

const REGISTER = "https://vendor.gocatering.no/auth/register";
const LOGIN = "https://vendor.gocatering.no/auth/login";
const copy = {
  en: {
    title: "Become a catering partner", eyebrow: "YOUR FOOD. MORE OCCASIONS.", hero: "Bring your kitchen to more tables.",
    intro: "Showcase your catering, plan your availability and manage orders in one vendor portal. Build a profile that tells your story, and make it easier for customers to discover what you do best.",
    register: "Register your business", login: "Partner sign in", how: "How it works", tools: "Your vendor portal", faq: "Questions & answers", contact: "Talk to our team", photo: "A selection of freshly prepared catering dishes",
    promises: ["Your menus and pricing", "Delivery on your schedule", "Applications reviewed by our team"],
    toolsTitle: "You cook. Keep the rest organised.", toolsIntro: "A dedicated workspace for the details behind a great catering experience.",
    features: [
      ["Menus that tell your story.", "Create menus and add-ons with photos, descriptions, prices and allergen information. Keep your selection current as your offering changes."],
      ["Make your delivery plans clear.", "Set service areas, delivery days and time slots. Configure advance notice and delivery fees so customers can plan around your availability."],
      ["One place to follow your orders.", "Review incoming orders, follow their progress and handle available change requests. Find finance information and support in the same portal."],
    ],
    portal: "YOUR CATERING WORKSPACE", overview: "Business overview", preview: "Illustration of vendor tools", toolLabels: ["Menus & add-ons", "Delivery schedule", "Order management", "Finance & support"], ready: "Your setup, at a glance", readyText: "Menus, delivery and business details in one place.",
    processTitle: "From your kitchen to Go Catering.", processIntro: "A clear setup process, with an admin review before your business goes live.",
    steps: [
      ["Create your account", "Enter your name, company name, email, Norwegian phone number and postal code. Choose a password and verify your email with a six-digit code."],
      ["Prepare your business", "Complete your profile, brand images and payout details. Add menus and delivery settings in the vendor portal where account access is enabled."],
      ["Get reviewed", "Our team reviews the application and its readiness. If updates are needed, follow the feedback in Settings and contact Support for another review."],
      ["Start taking orders", "Once approved and publicly visible, your available menus can be discovered by customers. Keep your information current and manage orders through your portal."],
    ],
    reviewTitle: "A good first impression starts with the details.", reviewText: "Registration is the first step, not automatic approval. Prepare your business information, menus and delivery setup so the team can review your application. Approval does not guarantee orders.",
    reviewItems: ["Complete business and contact details", "Clear menu photos, descriptions and prices", "Accurate delivery areas and availability", "Payout bank details for admin review"],
    faqTitle: "Before you join.", faqs: [
      ["What do I need to register?", "Your first and last name, email, Norwegian phone number, company name, postal code and a password. Confirm your password and verify your email with a six-digit code."],
      ["Will my business appear immediately?", "No. Registration starts the application process. Your application must be approved and your business publicly visible before customers can discover your available offering."],
      ["What can I prepare before approval?", "Where login is enabled for your account, prepare your profile, images, bank details, menus and delivery settings. Access to individual operations depends on your account permissions."],
      ["What happens if changes are requested?", "Read the feedback in vendor Settings, save the requested corrections and contact Support if you need help or another review."],
      ["Where can I ask about fees or the partnership?", "Contact Go Catering to discuss commercial terms and joining the platform. Commission rates and approval timelines are not specified on this page."],
    ],
    closing: "Ready to share what you do best?", closingText: "Introduce your business to Go Catering. Take the first step towards becoming a catering partner.",
  },
  no: {
    title: "Bli cateringpartner", eyebrow: "DIN MAT. FLERE ANLEDNINGER.", hero: "Fra ditt kjøkken til flere bord.",
    intro: "Vis frem maten din, planlegg tilgjengeligheten og håndter bestillinger i én leverandørportal. Lag en profil som viser hvem dere er, og gjør det enklere for kundene å finne dere.",
    register: "Registrer bedriften din", login: "Logg inn som partner", how: "Slik fungerer det", tools: "Leverandørportalen", faq: "Spørsmål og svar", contact: "Snakk med teamet vårt", photo: "Et utvalg nylagde cateringretter",
    promises: ["Dine menyer og priser", "Levering etter din plan", "Søknader vurderes av teamet vårt"],
    toolsTitle: "Du lager maten. Hold resten samlet.", toolsIntro: "En egen arbeidsflate for detaljene bak en god cateringopplevelse.",
    features: [
      ["Menyer som viser hvem dere er.", "Opprett menyer og tillegg med bilder, beskrivelser, priser og allergeninformasjon. Oppdater utvalget når tilbudet ditt endrer seg."],
      ["Gjør leveringsplanen tydelig.", "Velg leveringsområder, dager og tidsluker. Angi bestillingsfrist og leveringsgebyrer slik at kundene kan planlegge ut fra tilgjengeligheten din."],
      ["Ett sted for bestillingene dine.", "Se innkommende bestillinger, følg fremdriften og håndter tilgjengelige endringsforespørsler. Finn økonomiinformasjon og brukerstøtte i samme portal."],
    ],
    portal: "DIN ARBEIDSFLATE FOR CATERING", overview: "Bedriftsoversikt", preview: "Illustrasjon av leverandørverktøy", toolLabels: ["Menyer og tillegg", "Leveringsplan", "Bestillinger", "Økonomi og støtte"], ready: "Oppsettet ditt, samlet", readyText: "Menyer, levering og bedriftsopplysninger på ett sted.",
    processTitle: "Fra ditt kjøkken til Go Catering.", processIntro: "En tydelig oppstartsprosess med vurdering før bedriften blir synlig.",
    steps: [
      ["Opprett en konto", "Oppgi navn, bedriftsnavn, e-post, norsk telefonnummer og postnummer. Velg et passord og bekreft e-posten med en sekssifret kode."],
      ["Gjør bedriften klar", "Fyll ut bedriftsprofil, bilder og bankopplysninger. Legg inn menyer og leveringsinnstillinger i portalen når kontoen har tilgang."],
      ["Få søknaden vurdert", "Teamet vårt vurderer søknaden og om oppsettet er klart. Følg tilbakemeldingene i Innstillinger hvis noe må endres, og kontakt brukerstøtte for ny vurdering."],
      ["Ta imot bestillinger", "Når bedriften er godkjent og offentlig synlig, kan kundene finne tilgjengelige menyer. Hold informasjonen oppdatert, og håndter bestillinger i portalen."],
    ],
    reviewTitle: "Et godt førsteinntrykk starter med detaljene.", reviewText: "Registrering er første steg, ikke automatisk godkjenning. Gjør bedriftsinformasjon, menyer og levering klare for vurdering. Godkjenning gir ingen garanti for bestillinger.",
    reviewItems: ["Fullstendige bedrifts- og kontaktopplysninger", "Tydelige menybilder, beskrivelser og priser", "Riktige leveringsområder og tilgjengelighet", "Bankopplysninger for vurdering av administrator"],
    faqTitle: "Før du blir med.", faqs: [
      ["Hva trenger jeg for å registrere meg?", "Fornavn, etternavn, e-post, norsk telefonnummer, bedriftsnavn, postnummer og passord. Bekreft passordet og e-posten med en sekssifret kode."],
      ["Blir bedriften synlig med en gang?", "Nei. Registrering starter søknadsprosessen. Søknaden må godkjennes og bedriften være offentlig synlig før kundene kan finne tilbudet ditt."],
      ["Hva kan jeg gjøre før godkjenning?", "Når innlogging er aktivert for kontoen, kan du klargjøre profil, bilder, bankopplysninger, menyer og leveringsinnstillinger. Kontotillatelsene styrer hvilke handlinger som er tilgjengelige."],
      ["Hva skjer hvis det blir bedt om endringer?", "Les tilbakemeldingen i Innstillinger i leverandørportalen, lagre endringene og kontakt brukerstøtte ved behov eller for ny vurdering."],
      ["Hvor kan jeg spørre om priser og samarbeid?", "Kontakt Go Catering for å diskutere avtalevilkår og spørsmål om samarbeidet. Provisjonssatser og behandlingstid er ikke fastsatt på denne siden."],
    ],
    closing: "Klar til å dele det du kan best?", closingText: "Presenter bedriften din for Go Catering. Ta første steg mot å bli cateringpartner.",
  },
};
const toolIcons = [Utensils, MapPin, ClipboardList, Wallet];

export default function CateringPartnerPage() {
  const { i18n } = useTranslation();
  const c = copy[i18n.resolvedLanguage?.startsWith("en") ? "en" : "no"];
  const rootRef = useRef(null);
  useEffect(() => {
    const previous = document.title;
    document.title = `${c.title} | Go Catering`;
    return () => { document.title = previous; };
  }, [c.title]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = rootRef.current.querySelectorAll(".gc-feature, .gc-section-heading, .gc-steps li, .gc-faq-layout details, .gc-closing>div");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("gc-revealed"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    elements.forEach((element, index) => { element.style.setProperty("--gc-delay", `${(index % 3) * 90}ms`); element.classList.add("gc-reveal"); observer.observe(element); });
    return () => { observer.disconnect(); elements.forEach((element) => element.classList.remove("gc-reveal", "gc-revealed")); };
  }, [c]);
  return (
    <div className="gc-business" ref={rootRef}>
      <nav className="gc-business-nav" aria-label={c.title}>
        <Link to="/" aria-label="Go Catering" className="gc-orange-logo"><img src="/home/logo%20(2).png" alt="Go Catering" width="180" height="160" /></Link>
        <div><a href="#partner-how">{c.how}</a><a href={LOGIN}>{c.login}</a><a className="gc-button gc-button-small" href={REGISTER}>{c.register}<ArrowUpRight size={16}/></a></div>
      </nav>
      <section className="gc-business-hero">
        <img className="gc-hero-photo" src="/home/bg-image.webp" alt={c.photo} fetchPriority="high"/>
        <div className="gc-hero-shade"/>
        <div className="gc-hero-content"><p className="gc-eyebrow">{c.eyebrow}</p><h1>{c.hero}</h1><p>{c.intro}</p><a className="gc-button" href={REGISTER}>{c.register}<ArrowRight size={18}/></a></div>
      </section>
      <div className="gc-business-promises">{c.promises.map((text) => <span key={text}><Check size={17}/>{text}</span>)}</div>
      <section className="gc-business-section" id="partner-tools">
        <header className="gc-section-heading"><p className="gc-eyebrow">{c.tools}</p><h2>{c.toolsTitle}</h2><p>{c.toolsIntro}</p></header>
        <div className="gc-feature gc-feature-0">
          <div className="rounded-[24px] border border-[#ecdacc] bg-[#f8ece2] p-4 sm:p-7" aria-label={c.preview}>
            <div className="overflow-hidden rounded-2xl border border-[#e9ddd4] bg-white shadow-[0_18px_50px_rgba(99,57,28,0.1)]">
              <div className="flex items-center gap-2 border-b border-[#f0e5dd] px-5 py-4"><span className="h-2 w-2 rounded-full bg-[#d26838]"/><span className="h-2 w-2 rounded-full bg-[#edc9af]"/><span className="h-2 w-2 rounded-full bg-[#f2e6dd]"/><span className="ml-auto text-[11px] text-[#947e6f]">Go Catering</span></div>
              <div className="p-5 sm:p-6"><p className="text-[10px] tracking-widest text-[#9c806c]">{c.portal}</p><h3 className="!mb-5 !mt-2 !text-xl">{c.overview}</h3>
                <div className="grid grid-cols-2 gap-3">{c.toolLabels.map((label,index) => { const Icon=toolIcons[index]; return <div key={label} className="rounded-xl border border-[#eee3da] p-3 transition duration-300 hover:-translate-y-1 hover:bg-[#fff8f2] motion-reduce:transform-none"><Icon className="mb-3 text-[#c65f30]" size={20}/><p className="text-xs font-semibold text-[#57443a]">{label}</p><div className="mt-3 h-1 w-3/4 rounded-full bg-[#eed9ca]"/></div>; })}</div>
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#f4f8f3] p-4"><ShieldCheck className="shrink-0 text-[#5a8059]" size={21}/><div><p className="text-xs font-semibold text-[#3d5a3c]">{c.ready}</p><p className="mt-1 text-[11px] leading-5 text-[#7a8d77]">{c.readyText}</p></div></div>
              </div>
            </div>
          </div>
          <div className="gc-feature-copy">{c.features.map(([title,text],index) => { const Icon=toolIcons[index]; return <div key={title} className="mb-7 last:mb-0"><Icon className="mb-3 text-[#c65f30]" size={23}/><h3 className="!mb-3 !text-[23px]">{title}</h3><p className="text-[14px] leading-7 text-[#776d67]">{text}</p></div>; })}</div>
        </div>
      </section>
      <section className="gc-how-band" id="partner-how"><div className="gc-business-section"><header className="gc-section-heading"><p className="gc-eyebrow">{c.how}</p><h2>{c.processTitle}</h2><p>{c.processIntro}</p></header><ol className="gc-steps !grid-cols-1 sm:!grid-cols-2">{c.steps.map(([title,text],index) => <li key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><a className="gc-button" href={REGISTER}>{c.register}<ArrowRight size={18}/></a></div></section>
      <section className="gc-business-section"><div className="gc-feature"><div className="gc-feature-copy"><span className="gc-feature-number"><ShieldCheck size={28}/></span><h2>{c.reviewTitle}</h2><p>{c.reviewText}</p><Link className="gc-text-link" to="/contact">{c.contact}<ArrowUpRight size={17}/></Link></div><ul className="space-y-4 rounded-[24px] border border-[#ecdacc] bg-[#fffbf7] p-6 sm:p-9">{c.reviewItems.map((item) => <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-[#665043]"><Check size={19} className="mt-1 shrink-0 text-[#c65f30]"/>{item}</li>)}</ul></div></section>
      <section className="gc-faq-band" id="partner-faq"><div className="gc-business-section gc-faq-layout"><header><p className="gc-eyebrow">{c.faq}</p><h2>{c.faqTitle}</h2><Link className="gc-text-link" to="/contact">{c.contact}<ArrowUpRight size={17}/></Link></header><div>{c.faqs.map(([question,answer]) => <details key={question}><summary>{question}<ChevronDown size={17}/></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="gc-closing"><div><p className="gc-eyebrow">Go Catering</p><h2>{c.closing}</h2><p>{c.closingText}</p><div className="gc-closing-actions"><a className="gc-button" href={REGISTER}>{c.register}<ArrowRight size={18}/></a><Link className="gc-text-link !text-white" to="/contact">{c.contact}<ArrowUpRight size={17}/></Link></div></div></section>
    </div>
  );
}