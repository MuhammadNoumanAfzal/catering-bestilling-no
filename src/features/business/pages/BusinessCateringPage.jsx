import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, ClipboardList, MapPin, Phone, Utensils } from "lucide-react";
import { COMPANY_EMAIL, COMPANY_PHONE_DISPLAY, COMPANY_PHONE_LINK } from "../../../constants/companyContact";
import "./businessCatering.css";

const copy = {
  nb: {
    title: "Go Catering for bedrifter",
    eyebrow: "GODE MÅLTIDER. GODE MØTER.",
    intro: "Fra en liten møtelunsj til den store markeringen. Finn catering fra lokale leverandører, og samle alle rundt noe godt.",
    browse: "Utforsk catering", contact: "Snakk med oss", how: "Slik fungerer det", faq: "Spørsmål og svar",
    heroAlt: "Et utvalg retter og salater til et felles måltid",
    strip: ["Lokale leverandører", "Mat til små og store anledninger", "Velg dato og levering"],
    reasons: "Mer tid til menneskene rundt bordet.",
    reasonsIntro: "Maten er en viktig del av dagen. Bestill den fra ett sted, enten dere samles på kontoret eller utenfor.",
    features: [
      ["01", "Velg mat", "Et godt møte starter med god mat.", "Utforsk buffeter, kaker, fingermat og cateringpakker laget for møter, feiringer og arrangementer.", "Se utvalget"],
      ["02", "Hold oversikten", "Mindre administrasjon. Mer oversikt.", "Se bestillingene dine og finn fakturaene i kundeportalen. Har dere spesielle behov? Ta kontakt før bestilling.", "Opprett konto"],
      ["03", "Få levert", "Planlegg måltidet. Vi hjelper deg videre.", "Velg leveringsdato, tidspunkt og antall gjester. Se tilgjengelige alternativer hos leverandøren, og finn maten som passer deres anledning.", "Finn leverandør"],
    ],
    stepsTitle: "Fra plan til mat på bordet.",
    steps: [
      ["Finn din leverandør", "Søk etter catering der maten skal leveres."],
      ["Velg meny og gjester", "Finn rettene, sett datoen og legg inn antall personer."],
      ["Bestill og følg opp", "Send bestillingen og følg statusen i kundeportalen."],
    ],
    occasions: "En anledning til å samles.",
    occasionsIntro: "Gjør litt ekstra ut av hverdagen, eller finn maten til årets store øyeblikk.",
    cards: [["Møter og konferanser", "Mat til en god arbeidsdag."], ["Feiringer og arrangementer", "Gi gjestene noe å glede seg til."], ["Buffet og fingermat", "Noe godt å dele rundt bordet."]],
    faqTitle: "Greit å vite før du bestiller.",
    faqs: [
      ["Hvor tidlig bør jeg bestille?", "Bestillingsfristen varierer mellom leverandørene. Velg dato og leverandør for å se tilgjengelige leveringstider. Kontakt oss hvis dere planlegger et større arrangement."],
      ["Hvor mange personer kan jeg bestille til?", "Minimum antall gjester står på den enkelte menyen eller produktet. Sett inn ønsket antall når du bestiller."],
      ["Kan jeg endre antall gjester eller leveringsadresse?", "Åpne bestillingen i kundeportalen for å se tilgjengelige endringsvalg. Endringer kan kreve godkjenning fra leverandøren. Kontakt oss ved spørsmål eller hvis levering nærmer seg."],
      ["Hvordan finner jeg informasjon om allergener?", "Se allergeninformasjonen på menyen eller produktet. Avklar allergier og spesielle kostbehov med leverandøren før du bestiller."],
      ["Hvor finner jeg fakturaen min?", "Logg inn i kundeportalen og åpne Fakturaer. Ta kontakt hvis du trenger hjelp med faktura eller bedriftsopplysninger."],
      ["Hva gjør jeg hvis noe er galt med leveringen?", "Kontakt leverandøren eller Go Catering så snart som mulig med bestillingsnummeret og en beskrivelse av problemet."],
    ],
    closing: "Hva skal dere samles rundt?",
    closingText: "Finn neste møtelunsj, buffet eller festmåltid hos Go Catering.",
    footerLink: "Catering til bedrifter",
  },
  en: {
    title: "Go Catering for business",
    eyebrow: "GOOD FOOD. GREAT COMPANY.",
    intro: "From a small team lunch to your biggest celebration. Discover local caterers and bring everyone together over something delicious.",
    browse: "Explore catering", contact: "Talk to us", how: "How it works", faq: "Questions & answers",
    heroAlt: "A selection of dishes and salads for a shared meal",
    strip: ["Local caterers", "Food for every occasion", "Choose your delivery date"],
    reasons: "More time for the people around your table.",
    reasonsIntro: "Food is an important part of the day. Order in one place, whether you are gathering at the office or somewhere new.",
    features: [
      ["01", "Choose your food", "Great meetings start with great food.", "Explore buffets, cakes, finger food and catering packages for meetings, celebrations and events.", "Browse the selection"],
      ["02", "Stay organised", "Less administration. More clarity.", "View orders and find invoices in your customer portal. Have special requirements? Get in touch before ordering.", "Create an account"],
      ["03", "Get it delivered", "Plan the meal. Make room for the moment.", "Choose a delivery date, time and guest count. Check your caterer's available options and find food that fits your occasion.", "Find a caterer"],
    ],
    stepsTitle: "From the first plan to the first bite.",
    steps: [["Find your caterer", "Browse catering where you need it delivered."], ["Choose food and guests", "Pick your menu, date and number of people."], ["Order and follow up", "Submit your order and follow its status in the customer portal."]],
    occasions: "A reason to come together.",
    occasionsIntro: "Make more of the everyday, or find the food for your biggest moments.",
    cards: [["Meetings & conferences", "Food for a productive working day."], ["Celebrations & events", "Give your guests something to look forward to."], ["Buffets & finger food", "Something delicious to share."]],
    faqTitle: "A few things worth knowing.",
    faqs: [
      ["How far ahead should I order?", "Lead times vary by caterer. Select a date and caterer to see available delivery times. Contact us when planning a larger event."],
      ["How many people can I order for?", "Each menu or product lists its minimum guest count. Enter your preferred number of guests when ordering."],
      ["Can I change the guest count or delivery address?", "Open your order in the customer portal to see available change options. Changes may require the caterer's approval. Contact us with questions or when delivery is approaching."],
      ["Where can I find allergen information?", "Check the menu or product's allergen information. Confirm allergies and special dietary requirements with the caterer before ordering."],
      ["Where can I find my invoice?", "Sign in to the customer portal and open Invoices. Contact us for help with invoices or business details."],
      ["What if something is wrong with my delivery?", "Contact the caterer or Go Catering as soon as possible with your order number and a description of the issue."],
    ],
    closing: "What will bring your team together?",
    closingText: "Find your next team lunch, buffet or celebration with Go Catering.",
    footerLink: "Business catering",
  },
};

export default function BusinessCateringPage() {
  const pageRef = useRef(null);
  const { i18n } = useTranslation();
  const c = copy[i18n.resolvedLanguage?.startsWith("en") ? "en" : "nb"];
  useEffect(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = root.querySelectorAll(".gc-feature, .gc-section-heading, .gc-steps li, .gc-occasion, .gc-faq-layout header, .gc-faq-layout details, .gc-closing>div");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("gc-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    elements.forEach((element, index) => {
      element.style.setProperty("--gc-delay", `${(index % 3) * 90}ms`);
      element.classList.add("gc-reveal");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("gc-reveal", "gc-revealed"));
    };
  }, [c]);
  useEffect(() => {
    const previous = document.title;
    document.title = c.title;
    return () => { document.title = previous; };
  }, [c.title]);
  const browse = "/browse/food-type";
  return (
    <div className="gc-business" ref={pageRef}>
      <nav className="gc-business-nav" aria-label={c.title}>
        <Link to="/" aria-label="Go Catering" className="gc-orange-logo"><img src="/home/logo%20(2).png" alt="Go Catering" width="180" height="160" /></Link>
        <div><a href="#business-how">{c.how}</a><a href="#business-faq">{c.faq}</a><Link className="gc-button gc-button-small" to="/contact">{c.contact}<ArrowUpRight size={16} /></Link></div>
      </nav>
      <section className="gc-business-hero">
        <img className="gc-hero-photo" src="/home/bg-image.webp" alt={c.heroAlt} fetchPriority="high" />
        <div className="gc-hero-shade" />
        <div className="gc-hero-content">
          <p className="gc-eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p>{c.intro}</p>
          <Link className="gc-button" to={browse}>{c.browse}<ArrowRight size={19} /></Link>
        </div>
        <span className="gc-hero-caption"><MapPin size={16} /> Norge · Norway</span>
      </section>
      <div className="gc-business-promises">{c.strip.map((item) => <span key={item}><Check size={18} />{item}</span>)}</div>

      <section className="gc-business-section">
        <header className="gc-section-heading"><p className="gc-eyebrow">GO CATERING</p><h2>{c.reasons}</h2><p>{c.reasonsIntro}</p></header>
        {c.features.map(([number, label, title, text, action], index) => {
          const Icon = [Utensils, ClipboardList, CalendarDays][index];
          return <article className={`gc-feature gc-feature-${index}`} key={number}>
            <div className="gc-feature-media">
              {index !== 1 ? <img src={index === 0 ? "/home/bg-image.webp" : "/home/hero3.webp"} alt={label} loading="lazy" /> : (
                <div className="gc-order-illustration" aria-hidden="true">
                  <span className="gc-orange-logo"><img src="/home/logo%20(2).png" alt="" /></span>
                  <div className="gc-paper-line" /><div className="gc-paper-line gc-paper-short" />
                  <div className="gc-paper-row"><Utensils /><span>{c.steps[1][0]}</span><Check /></div>
                  <div className="gc-paper-row"><CalendarDays /><span>{c.features[2][1]}</span><Check /></div>
                  <div className="gc-paper-line" /><span className="gc-paper-footer">{c.steps[2][0]}<ArrowUpRight size={18} /></span>
                </div>
              )}
              <span className="gc-media-label"><Icon size={18} />{label}</span>
            </div>
            <div className="gc-feature-copy"><span className="gc-feature-number">{number} /</span><h3>{title}</h3><p>{text}</p><Link className="gc-text-link" to={index === 1 ? "/signup" : index === 2 ? "/vendors/featured" : browse}>{action}<ArrowRight size={18} /></Link></div>
          </article>;
        })}
      </section>

      <section className="gc-how-band" id="business-how"><div className="gc-business-section">
        <header className="gc-section-heading"><p className="gc-eyebrow">{c.how}</p><h2>{c.stepsTitle}</h2></header>
        <ol className="gc-steps">{c.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        <Link className="gc-button" to={browse}>{c.browse}<ArrowRight size={18} /></Link>
      </div></section>

      <section className="gc-business-section gc-occasions"><header className="gc-section-heading"><p className="gc-eyebrow">GO CATERING</p><h2>{c.occasions}</h2><p>{c.occasionsIntro}</p></header>
        <div className="gc-occasion-grid">{c.cards.map(([title, text], index) => <Link key={title} className="gc-occasion" to={index === 2 ? browse : "/browse/occasion"}><img src={index === 1 ? "/home/hero3.webp" : "/home/bg-image.webp"} alt={title} loading="lazy" /><div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight size={22} /></div></Link>)}</div>
      </section>

      <section className="gc-faq-band" id="business-faq"><div className="gc-business-section gc-faq-layout"><header><p className="gc-eyebrow">{c.faq}</p><h2>{c.faqTitle}</h2><a className="gc-text-link" href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}<ArrowUpRight size={17} /></a></header>
        <div>{c.faqs.map(([question, answer]) => <details name="business-faq" key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div>
      </div></section>
      <section className="gc-closing"><div><p className="gc-eyebrow">GO CATERING</p><h2>{c.closing}</h2><p>{c.closingText}</p><div className="gc-closing-actions"><Link className="gc-button" to={browse}>{c.browse}<ArrowRight size={18} /></Link><a href={`tel:${COMPANY_PHONE_LINK}`}><Phone size={17} />{COMPANY_PHONE_DISPLAY}</a></div></div></section>
    </div>
  );
}
