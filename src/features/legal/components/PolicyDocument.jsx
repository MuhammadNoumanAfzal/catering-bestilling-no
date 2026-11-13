import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, ArrowUp, ArrowUpRight, Building2, CalendarDays,
  ChevronDown, FileText, Mail, ShieldCheck,
} from "lucide-react";
import policies from "../data/policies.json";

const linkStyle = "font-medium text-[#b85e35] underline decoration-[#e7c5b0] underline-offset-4 transition hover:decoration-[#b85e35] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c96432]";
const sectionTitle = (title) => title.replace(/^\d+\.\s*/, "");

function PolicyText({ children }) {
  return String(children)
    .split(/(https:\/\/gocatering\.no\/privacy-policy|support@gocatering\.no|datatilsynet\.no)/g)
    .map((part, index) => {
      if (part === "https://gocatering.no/privacy-policy") {
        return <Link key={index} to="/privacy-policy" className={linkStyle}>{part}</Link>;
      }
      if (part === "support@gocatering.no") {
        return <a key={index} href="mailto:support@gocatering.no" className={linkStyle}>{part}</a>;
      }
      if (part === "datatilsynet.no") {
        return <a key={index} href="https://www.datatilsynet.no" className={linkStyle}>{part}</a>;
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
            <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c29170]" />
            <span className="min-w-0"><PolicyText>{item}</PolicyText></span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <div className="overflow-hidden rounded-xl border border-[#e8e3dd]">
        <div className="overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-[#c96432]" tabIndex={0}>
          <table className="w-full min-w-[420px] border-collapse text-left text-[13px] leading-6 sm:text-sm">
            <thead className="bg-[#f5f3ef] text-[#44382d]">
              <tr>{block.headers.map((header, index) => (
                <th key={index} scope="col" className="px-4 py-3.5 align-top font-semibold sm:px-5"><PolicyText>{header}</PolicyText></th>
              ))}</tr>
            </thead>
            <tbody>{block.rows.map((row, index) => (
              <tr key={index} className="border-t border-[#ede8e1] odd:bg-white even:bg-[#fcfbf9]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={"px-4 py-3.5 align-top sm:px-5 " + (cellIndex === 0 ? "font-medium text-[#473c32]" : "text-[#73675b]")}><PolicyText>{cell}</PolicyText></td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  }
  return <p><PolicyText>{block.text}</PolicyText></p>;
}

function SectionLinks({ sections, activeSection, onSelect }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((section, index) => {
        const active = activeSection === section.id;
        return (
          <li key={section.id}>
            <a href={"#" + section.id} onClick={() => onSelect(section.id)} aria-current={active ? "location" : undefined}
              className={"flex items-start gap-2.5 rounded-lg px-3 py-2 text-[12px] leading-5 transition focus-visible:outline-2 focus-visible:outline-[#c96432] " + (active ? "bg-[#f8ede5] font-semibold text-[#a8502c]" : "text-[#807467] hover:bg-[#f5f3ef] hover:text-[#42362b]")}>
              <span className={"w-4 shrink-0 tabular-nums " + (active ? "text-[#b9653e]" : "text-[#b4a99c]")}>{String(index + 1).padStart(2, "0")}</span>
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
  const requested = params.get("lang");
  const language = requested === "en" || requested === "no"
    ? requested
    : /^(no|nb|nn)/i.test(i18n.resolvedLanguage || i18n.language) ? "no" : "en";
  const no = language === "no";
  const privacy = type === "privacy";
  const policy = policies[language][type];
  const PolicyIcon = privacy ? ShieldCheck : FileText;
  const labels = no ? {
    home: "Til forsiden", legal: "Vilk\u00e5r og personvern", language: "Spr\u00e5k", contents: "P\u00e5 denne siden",
    description: privacy ? "Slik samler vi inn, bruker og beskytter personopplysningene dine." : "Vilk\u00e5rene som gjelder n\u00e5r du bruker GoCatering.",
    help: "Har du sp\u00f8rsm\u00e5l?", contact: "Kontakt oss hvis du har sp\u00f8rsm\u00e5l om disse retningslinjene.",
    backToTop: "Til toppen", sections: "deler", organisation: "Org.nr. 938291632",
  } : {
    home: "Back to home", legal: "Terms & privacy", language: "Language", contents: "On this page",
    description: privacy ? "How we collect, use and protect your personal information." : "The terms that apply when you use GoCatering.",
    help: "Have a question?", contact: "We are here to help with questions about these policies.",
    backToTop: "Back to top", sections: "sections", organisation: "Org. no. 938291632",
  };

  useEffect(() => {
    if ((requested === "en" || requested === "no") && i18n.language !== requested) i18n.changeLanguage(requested);
  }, [requested, i18n]);

  useEffect(() => {
    const previous = document.title;
    document.title = policy.title + " | GoCatering.no";
    return () => { document.title = previous; };
  }, [policy.title]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-120px 0px -55% 0px", threshold: 0 });
    policy.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [policy.sections]);

  function changeLanguage(next) {
    const updated = new URLSearchParams(params);
    updated.set("lang", next);
    setParams(updated, { replace: true });
    i18n.changeLanguage(next);
  }

  function goToTop() {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("policy-title")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <main lang={language} className="min-h-screen bg-[#f7f7f4] text-[#40372e] print:bg-white">
      <div className="border-b border-[#e8e5df] bg-white">
        <header className="mx-auto max-w-[1160px] px-4 pb-7 pt-6 sm:px-6 sm:pb-9 lg:px-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-medium text-[#8c7c6b] transition hover:text-[#bc643b] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#c96432]"><ArrowLeft size={14} aria-hidden="true" />{labels.home}</Link>
            <div role="group" aria-label={labels.language} className="inline-flex rounded-lg border border-[#e8e3dc] bg-[#faf9f6] p-0.5">
              {[["no", "Norsk"], ["en", "English"]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => changeLanguage(value)} aria-pressed={language === value}
                  className={"rounded-md px-3 py-1.5 text-[12px] font-semibold transition focus-visible:outline-2 focus-visible:outline-[#c96432] " + (language === value ? "bg-white text-[#ab542f] shadow-sm ring-1 ring-[#eae1d6]" : "text-[#9a8d7e] hover:text-[#544536]")}>{label}</button>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className={"hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:inline-flex " + (privacy ? "bg-[#eef4ee] text-[#5c8062]" : "bg-[#fbefe6] text-[#c57549]")}><PolicyIcon size={26} strokeWidth={1.5} /></span>
            <div className="min-w-0">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b08b6e]">GoCatering / {labels.legal}</p>
              <h1 id="policy-title" className="scroll-mt-28 text-[29px] font-bold leading-tight tracking-[-0.035em] text-[#302820] sm:text-[38px]">{policy.title}</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#81705f] sm:text-sm">{labels.description}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#81705f]">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} aria-hidden="true" />{policy.updated.split("\u00b7").at(-1).trim()}</span>
                <span aria-hidden="true" className="hidden h-3 w-px bg-[#e5dcd0] sm:block" />
                <span className="inline-flex items-center gap-1.5"><Building2 size={13} aria-hidden="true" />Go Catering AS</span>
              </p>
            </div>
          </div>
        </header>
        <nav aria-label={labels.legal} className="mx-auto flex max-w-[1160px] gap-5 px-4 sm:gap-7 sm:px-6 lg:px-8 print:hidden">
          {["terms", "privacy"].map((key) => {
            const TabIcon = key === "terms" ? FileText : ShieldCheck;
            return (
            <Link key={key} to={(key === "terms" ? "/terms-and-conditions" : "/privacy-policy") + "?lang=" + language} aria-current={type === key ? "page" : undefined}
              className={"-mb-px inline-flex items-center gap-2 border-b-2 pb-3.5 pt-1 text-[12px] font-semibold transition sm:text-[13px] focus-visible:outline-2 focus-visible:outline-[#c96432] " + (type === key ? "border-[#c96432] text-[#b55b32]" : "border-transparent text-[#81705f] hover:border-[#e2c7b4] hover:text-[#64503f]")}><TabIcon size={15} aria-hidden="true" />{policies[language][key].title}</Link>
          );})}
        </nav>
      </div>

      <div className="mx-auto grid w-full max-w-[1160px] grid-cols-1 items-start gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-7 lg:px-8 print:block print:px-0">
        <aside className="hidden space-y-4 lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-140px)] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden print:hidden">
          <nav aria-label={labels.contents} className="rounded-xl border border-[#e8e3da] bg-white p-3">
            <div className="mb-2 flex items-center justify-between px-3 pt-2"><h2 className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#a18a74]">{labels.contents}</h2><span className="rounded bg-[#f5f2ec] px-1.5 py-0.5 text-[10px] tabular-nums text-[#ac9680]">{policy.sections.length}</span></div>
            <SectionLinks sections={policy.sections} activeSection={activeSection} onSelect={setActiveSection} />
          </nav>
          <div className="rounded-xl border border-[#e8e1d6] bg-[#f1eee7] p-4">
            <Mail size={17} aria-hidden="true" className="mb-2.5 text-[#ab825f]" />
            <p className="text-[13px] font-semibold text-[#68533f]">{labels.help}</p>
            <p className="mt-1 text-[11px] leading-5 text-[#806c58]">{labels.contact}</p>
            <a href="mailto:support@gocatering.no" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#aa653d] hover:underline">support@gocatering.no<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <details className="group rounded-xl border border-[#e8e3da] bg-white lg:hidden print:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[13px] font-semibold text-[#715b46] [&::-webkit-details-marker]:hidden"><span>{labels.contents}<span className="ml-2 text-[11px] font-normal text-[#ad9b87]">{policy.sections.length} {labels.sections}</span></span><ChevronDown size={15} className="transition group-open:rotate-180" aria-hidden="true" /></summary>
            <nav aria-label={labels.contents} className="border-t border-[#f0e9e0] p-2"><SectionLinks sections={policy.sections} activeSection={activeSection} onSelect={setActiveSection} /></nav>
          </details>
          <article aria-labelledby="policy-title" className="overflow-hidden rounded-2xl border border-[#e8e3da] bg-white px-5 shadow-[0_2px_6px_rgba(65,49,31,0.02)] sm:px-8 print:rounded-none print:border-0 print:px-0 print:shadow-none">
            {policy.sections.map((section, index) => (
              <section id={section.id} key={section.id} aria-labelledby={section.id + "-title"} className="scroll-mt-28 border-b border-[#eee9e2] py-6 last:border-b-0 sm:py-7">
                <div className="mb-4 flex items-start gap-3">
                  <span aria-hidden="true" className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#eee3d7] bg-[#faf5ee] text-[11px] font-semibold tabular-nums text-[#b28b68]">{String(index + 1).padStart(2, "0")}</span>
                  <h2 id={section.id + "-title"} className="pt-0.5 text-[16px] font-semibold leading-7 tracking-[-0.015em] text-[#483a2e] sm:text-[18px]"><span className="sr-only">{index + 1}. </span>{sectionTitle(section.title)}</h2>
                </div>
                <div className="space-y-3.5 break-words text-[13px] leading-[1.95] text-[#81705f] sm:text-[14px] sm:leading-[1.95]">{section.blocks.map((block, index) => <PolicyBlock key={index} block={block} />)}</div>
              </section>
            ))}
          </article>
          <footer className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3 pt-1 text-[10px] leading-5 text-[#82705e]">
            <p>Go Catering AS<span aria-hidden="true" className="px-2 text-[#d2c6b7]">/</span>{labels.organisation}</p>
            <button type="button" onClick={goToTop} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-[#a97a55] transition hover:bg-[#efe8de] focus-visible:outline-2 focus-visible:outline-[#c96432] print:hidden">{labels.backToTop}<ArrowUp size={13} aria-hidden="true" /></button>
          </footer>
        </div>
      </div>
    </main>
  );
}
