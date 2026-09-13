import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function LocalizedDatePicker({ value, onChange, min, max, label = "Velg dato", className = "" }) {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("no") ? "nb-NO" : "en-GB";
  const selected = value ? new Date(`${value}T00:00:00`) : null;
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(() => selected || new Date());
  const year = visible.getFullYear();
  const month = visible.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, index + 1)));
  const display = selected ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(selected) : label;

  return <div className={`relative ${className}`}><button type="button" aria-label={label} onClick={() => setIsOpen((open) => !open)} className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#d8ccc2] bg-white px-3 text-left text-[12px] font-semibold text-[#231913] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"><span className={selected ? "" : "text-[#9a8f86]"}>{display}</span><FiCalendar /></button>{isOpen ? <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 max-w-[calc(100vw-2rem)] rounded-[16px] border border-[#eadfd5] bg-white p-3 shadow-[0_18px_44px_rgba(45,28,16,0.14)]"><div className="mb-3 flex items-center justify-between"><button className="rounded p-1.5 hover:bg-[#fff3ec]" type="button" onClick={() => setVisible((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}>‹</button><strong className="text-[13px]">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(visible)}</strong><button className="rounded p-1.5 hover:bg-[#fff3ec]" type="button" onClick={() => setVisible((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}>›</button></div><div className="grid grid-cols-7 gap-1 text-center">{weekdays.map((day) => <span key={day} className="py-1 text-[10px] font-bold text-[#746a62]">{day}</span>)}{Array.from({ length: offset }).map((_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => index + 1).map((day) => { const next = isoDate(new Date(year, month, day)); const disabled = (min && next < min) || (max && next > max); return <button key={day} disabled={disabled} type="button" onClick={() => { onChange(next); setIsOpen(false); }} className={`h-8 rounded-full text-[11px] font-semibold ${next === value ? "bg-[#cf6e38] text-white" : "hover:bg-[#fff3ec]"} disabled:opacity-30`}>{day}</button>; })}</div><div className="mt-3 flex justify-between border-t border-[#f1e9e2] pt-2 text-[11px] font-bold text-[#c75f2e]"><button type="button" onClick={() => { onChange(""); setIsOpen(false); }}>{locale === "nb-NO" ? "Tøm dato" : "Clear"}</button><button type="button" onClick={() => { const today = new Date(); onChange(isoDate(today)); setVisible(today); setIsOpen(false); }}>{locale === "nb-NO" ? "I dag" : "Today"}</button></div></div> : null}</div>;
}
