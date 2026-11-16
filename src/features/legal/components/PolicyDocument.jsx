import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  Mail,
  ShieldCheck,
  Printer,
  Search,
  ArrowRight,
  Clock3,
} from "lucide-react";
import policies from "../data/policies.json";
import "./PolicyDocument.css";

const linkStyle =
  "font-medium text-[#b85e35] underline decoration-[#e7c5b0] underline-offset-4 transition hover:decoration-[#b85e35] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96432]";
const sectionTitle = (title) => title.replace(/^\d+\.\s*/, "");

function PolicyText({ children }) {
  return String(children)
    .split(
      /(https:\/\/gocatering\.no\/privacy-policy|support@gocatering\.no|datatilsynet\.no)/g,
    )
    .map((part, index) => {
      if (part === "https://gocatering.no/privacy-policy") {
        return (
          <Link key={index} to="/privacy-policy" className={linkStyle}>
            {part}
          </Link>
        );
      }
      if (part === "support@gocatering.no") {
        return (
          <a
            key={index}
            href="mailto:support@gocatering.no"
            className={linkStyle}
          >
            {part}
          </a>
        );
      }
      if (part === "datatilsynet.no") {
        return (
          <a
            key={index}
            href="https://www.datatilsynet.no"
            className={linkStyle}
          >
            {part}
          </a>
        );
      }
      return part;
    });
}

function PolicyBlock({ block }) {
  if (block.type === "list") {
    return (
      <ul className="space-y-3">
        {block.items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c29170]"
            />
            <span className="min-w-0">
              <PolicyText>{item}</PolicyText>
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e8e3dd]">
        <div
          className="overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-[#c96432]"
          tabIndex={0}
        >
          <table className="w-full min-w-[420px] border-collapse text-left text-[13px] leading-6 sm:text-sm">
            <thead className="bg-[#f5f3ef] text-[#44382d]">
              <tr>
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-4 py-3.5 align-top font-semibold sm:px-5"
                  >
                    <PolicyText>{header}</PolicyText>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-t border-[#ede8e1] odd:bg-white even:bg-[#fcfbf9]"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        "px-4 py-3.5 align-top sm:px-5 " +
                        (cellIndex === 0
                          ? "font-medium text-[#473c32]"
                          : "text-[#73675b]")
                      }
                    >
                      <PolicyText>{cell}</PolicyText>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <p>
      <PolicyText>{block.text}</PolicyText>
    </p>
  );
}

function SectionLinks({ sections, activeSection, onSelect }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((section) => {
        const active = activeSection === section.id;
        return (
          <li key={section.id}>
            <a
              href={"#" + section.id}
              onClick={() => onSelect(section.id)}
              aria-current={active ? "location" : undefined}
              className={
                "flex items-start gap-2.5 rounded-lg px-3 py-2 text-[12px] leading-5 transition focus-visible:outline-2 focus-visible:outline-[#c96432] " +
                (active
                  ? "bg-[#f8ede5] font-semibold text-[#a8502c]"
                  : "text-[#807467] hover:bg-[#f5f3ef] hover:text-[#42362b]")
              }
            >
              <span
                className={
                  "w-4 shrink-0 tabular-nums " +
                  (active ? "text-[#b9653e]" : "text-[#b4a99c]")
                }
              >
                {String(section.id.replace("section-", "")).padStart(2, "0")}
              </span>
              <span>{sectionTitle(section.title)}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function PolicyDocument({ type }) {
  const { i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("section-1");
  const [contentsSearch, setContentsSearch] = useState("");
  const [progress, setProgress] = useState(0);
  const requested = params.get("lang");
  const language =
    requested === "en" || requested === "no"
      ? requested
      : /^(no|nb|nn)/i.test(i18n.resolvedLanguage || i18n.language)
        ? "no"
        : "en";
  const no = language === "no";
  const privacy = type === "privacy";
  const policy = policies[language][type];
  const PolicyIcon = privacy ? ShieldCheck : FileText;
  const labels = no
    ? {
        home: "Til forsiden",
        legal: "Vilk\u00e5r og personvern",
        language: "Spr\u00e5k",
        contents: "P\u00e5 denne siden",
        description: privacy
          ? "Slik samler vi inn, bruker og beskytter personopplysningene dine."
          : "Vilk\u00e5rene som gjelder n\u00e5r du bruker GoCatering.",
        help: "Har du sp\u00f8rsm\u00e5l?",
        contact:
          "Kontakt oss hvis du har sp\u00f8rsm\u00e5l om disse retningslinjene.",
        backToTop: "Til toppen",
        sections: "deler",
        organisation: "Org.nr. 938291632",
      }
    : {
        home: "Back to home",
        legal: "Terms & privacy",
        language: "Language",
        contents: "On this page",
        description: privacy
          ? "How we collect, use and protect your personal information."
          : "The terms that apply when you use GoCatering.",
        help: "Have a question?",
        contact: "We are here to help with questions about these policies.",
        backToTop: "Back to top",
        sections: "sections",
        organisation: "Org. no. 938291632",
      };

  useEffect(() => {
    if (
      (requested === "en" || requested === "no") &&
      i18n.language !== requested
    )
      i18n.changeLanguage(requested);
  }, [requested, i18n]);

  useEffect(() => {
    const previous = document.title;
    document.title = policy.title + " | GoCatering.no";
    return () => {
      document.title = previous;
    };
  }, [policy.title]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 },
    );
    policy.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [policy.sections]);

  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const content = document.getElementById("legal-document");
        if (!content) return;
        const bounds = content.getBoundingClientRect();
        setProgress(
          Math.max(
            0,
            Math.min(
              100,
              ((-bounds.top + 140) /
                Math.max(1, bounds.height - window.innerHeight + 140)) *
                100,
            ),
          ),
        );
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [policy]);
  const searchResults = policy.sections.filter((section) =>
    sectionTitle(section.title)
      .toLocaleLowerCase(language)
      .includes(contentsSearch.trim().toLocaleLowerCase(language)),
  );
  const readingMinutes = Math.max(
    1,
    Math.ceil(JSON.stringify(policy.sections).split(/\s+/).length / 220),
  );
  const shortcuts = (privacy ? [1, 6, 8] : [3, 4, 5]).map(
    (index) => policy.sections[index],
  );
  function changeLanguage(next) {
    const updated = new URLSearchParams(params);
    updated.set("lang", next);
    setParams(updated, { replace: true });
    i18n.changeLanguage(next);
  }

  function goToTop() {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .getElementById("policy-title")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
  }

  return (
    <main lang={language} className="legal-page">
      <div className="legal-utility legal-wrap print:hidden">
        <Link to="/" className="legal-back">
          <ArrowLeft size={15} />
          {labels.home}
        </Link>
        <div className="legal-utility-actions">
          <div
            className="legal-language"
            role="group"
            aria-label={labels.language}
          >
            {[
              ["no", "Norsk"],
              ["en", "English"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={language === value}
                onClick={() => {
                  setContentsSearch("");
                  changeLanguage(value);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="legal-print"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span>{no ? "Skriv ut / lagre PDF" : "Print / save PDF"}</span>
          </button>
        </div>
      </div>
      <header className="legal-hero legal-wrap legal-reveal">
        <div className="legal-hero-copy">
          <p className="legal-eyebrow">
            GO CATERING <span>/</span> {labels.legal}
          </p>
          <h1 id="policy-title">{policy.title}</h1>
          <p className="legal-intro">{labels.description}</p>
          <div className="legal-meta">
            <span>
              <CalendarDays size={15} />
              {policy.updated.split("\u00b7").at(-1).trim()}
            </span>
            <span>
              <Clock3 size={15} />
              {no ? "Ca." : "About"} {readingMinutes}{" "}
              {no ? "min lesetid" : "min read"}
            </span>
          </div>
          <a className="legal-hero-action" href={"#" + policy.sections[0].id}>
            {no ? "Les dokumentet" : "Read the document"}
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="legal-hero-art" aria-hidden="true">
          <div className="legal-art-ring" />
          <div className="legal-paper">
            <div className="legal-paper-top">
              <span>GO CATERING</span>
              <PolicyIcon size={25} strokeWidth={1.3} />
            </div>
            <div className="legal-paper-title">
              {privacy
                ? no
                  ? "Ditt personvern"
                  : "Your privacy"
                : no
                  ? "Våre vilkår"
                  : "Our terms"}
            </div>
            <div className="legal-paper-lines">
              <i />
              <i />
              <i />
            </div>
            <div className="legal-paper-rule" />
            <div className="legal-paper-lines">
              <i />
              <i />
            </div>
            <div className="legal-paper-footer">
              Go Catering AS
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="legal-art-label">
            <PolicyIcon size={18} />
            <span>{privacy ? labels.legal : labels.organisation}</span>
          </div>
        </div>
      </header>
      <div className="legal-wrap">
        <nav
          aria-label={labels.legal}
          className="legal-document-tabs print:hidden"
        >
          {["terms", "privacy"].map((key) => {
            const TabIcon = key === "terms" ? FileText : ShieldCheck;
            return (
              <Link
                key={key}
                to={
                  (key === "terms"
                    ? "/terms-and-conditions"
                    : "/privacy-policy") +
                  "?lang=" +
                  language
                }
                aria-current={type === key ? "page" : undefined}
                className={type === key ? "is-current" : ""}
              >
                <span className="legal-tab-icon">
                  <TabIcon size={22} strokeWidth={1.5} />
                </span>
                <span>
                  <strong>{policies[language][key].title}</strong>
                  <small>
                    {key === "terms"
                      ? no
                        ? "Bestillinger, betaling og dine rettigheter"
                        : "Orders, payments and your rights"
                      : no
                        ? "Personopplysninger og dine valg"
                        : "Personal information and your choices"}
                  </small>
                </span>
                <ArrowUpRight size={19} className="legal-tab-arrow" />
              </Link>
            );
          })}
        </nav>
        <div className="legal-shortcut-heading print:hidden">
          <span>{no ? "Finn det du leter etter" : "Find what you need"}</span>
          <span>
            {no ? "Snarveier i dokumentet" : "Shortcuts within this document"}
          </span>
        </div>
        <nav
          className="legal-shortcuts print:hidden"
          aria-label={no ? "Snarveier" : "Quick links"}
        >
          {shortcuts.map((section) => (
            <a
              key={section.id}
              href={"#" + section.id}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="legal-shortcut-number">
                {String(policy.sections.indexOf(section) + 1).padStart(2, "0")}
              </span>
              <span>{sectionTitle(section.title)}</span>
              <ArrowUpRight size={17} />
            </a>
          ))}
        </nav>
      </div>
      <div className="legal-reading-bar print:hidden">
        <div className="legal-wrap">
          <span>{policy.title}</span>
          <span>
            {Math.round(progress)}%
            <span className="legal-reading-label">
              {" "}
              {no ? "gjennom dokumentet" : "through the document"}
            </span>
          </span>
        </div>
        <div
          className="legal-reading-track"
          role="progressbar"
          aria-label={no ? "Leseposisjon" : "Reading position"}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: progress + "%" }} />
        </div>
      </div>
      <div className="legal-body legal-wrap">
        <aside className="legal-sidebar print:hidden">
          <nav className="legal-contents" aria-label={labels.contents}>
            <div className="legal-contents-title">
              <h2>{labels.contents}</h2>
              <span>{policy.sections.length}</span>
            </div>
            <label className="legal-contents-search">
              <Search size={14} />
              <input
                value={contentsSearch}
                onChange={(e) => setContentsSearch(e.target.value)}
                placeholder={no ? "Finn en del..." : "Find a section..."}
                aria-label={no ? "Søk i innhold" : "Search contents"}
              />
            </label>
            {searchResults.length ? (
              <SectionLinks
                sections={searchResults}
                activeSection={activeSection}
                onSelect={setActiveSection}
              />
            ) : (
              <p className="legal-no-results">
                {no ? "Ingen deler funnet" : "No matching sections"}
              </p>
            )}
          </nav>
          <div className="legal-contact-small">
            <Mail size={20} />
            <h3>{labels.help}</h3>
            <p>{labels.contact}</p>
            <a href="mailto:support@gocatering.no">
              {no ? "Kontakt oss" : "Get in touch"}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </aside>
        <div className="legal-content-column">
          <details className="legal-mobile-contents print:hidden">
            <summary>
              {labels.contents}
              <ChevronDown size={17} />
            </summary>
            <nav aria-label={labels.contents}>
              <SectionLinks
                sections={policy.sections}
                activeSection={activeSection}
                onSelect={setActiveSection}
              />
            </nav>
          </details>
          <article
            id="legal-document"
            className="legal-document"
            aria-labelledby="policy-title"
          >
            <div className="legal-document-heading">
              <div>
                <span className="legal-document-kicker">
                  {no ? "Hele dokumentet" : "The full document"}
                </span>
                <h2>{policy.title}</h2>
              </div>
              <PolicyIcon size={30} strokeWidth={1.2} />
            </div>
            {policy.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={section.id + "-title"}
                className={
                  "legal-section" +
                  (activeSection === section.id ? " is-active" : "")
                }
              >
                <div className="legal-section-heading">
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 id={section.id + "-title"}>
                    <span className="sr-only">{index + 1}. </span>
                    {sectionTitle(section.title)}
                  </h2>
                  <a
                    href={"#" + section.id}
                    aria-label={
                      (no ? "Lenke til " : "Link to ") +
                      sectionTitle(section.title)
                    }
                    className="legal-section-anchor print:hidden"
                  >
                    #
                  </a>
                </div>
                <div className="legal-prose">
                  {section.blocks.map((block, index) => (
                    <PolicyBlock key={index} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>
          <section className="legal-contact-banner">
            <div className="legal-contact-icon">
              <Mail size={26} strokeWidth={1.4} />
            </div>
            <div>
              <h2>{labels.help}</h2>
              <p>{labels.contact}</p>
            </div>
            <a href="mailto:support@gocatering.no">
              support@gocatering.no
              <ArrowUpRight size={17} />
            </a>
          </section>
          <footer className="legal-footer">
            <span>
              <Building2 size={14} />
              Go Catering AS / {labels.organisation}
            </span>
            <button type="button" onClick={goToTop} className="print:hidden">
              {labels.backToTop}
              <ArrowUp size={15} />
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
