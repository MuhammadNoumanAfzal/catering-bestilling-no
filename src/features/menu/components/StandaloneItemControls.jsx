import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Counter({ label, value, minimum, onChange, disabled }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  function commit() {
    const parsed = Math.trunc(Number(draft));
    const next = Math.max(minimum, Number.isSafeInteger(parsed) ? parsed : minimum);
    setDraft(String(next));
    onChange(next);
  }
  return <label className="flex flex-wrap items-center justify-between gap-2 text-xs">
    <span>{label}</span>
    <span className="inline-flex h-9 items-center rounded-md border border-[#d7d1ca] bg-white">
      <button type="button" title={`${label} -`} aria-label={`${label} -`} disabled={disabled || value <= minimum} onClick={() => onChange(value - 1)} className="flex h-full w-9 items-center justify-center disabled:opacity-40"><Minus size={14} /></button>
      <input aria-label={label} type="number" min={minimum} step="1" disabled={disabled} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} className="h-full w-16 border-x border-[#d7d1ca] bg-transparent text-center" />
      <button type="button" title={`${label} +`} aria-label={`${label} +`} disabled={disabled} onClick={() => onChange(value + 1)} className="flex h-full w-9 items-center justify-center"><Plus size={14} /></button>
    </span>
  </label>;
}

export default function StandaloneItemControls({ item, onChange, disabled = false, showGuests = true }) {
  const { t } = useTranslation();
  return <div className="mt-3 space-y-2">
    {showGuests && <Counter label={t("menu.personsLabel")} value={item.personCount} minimum={item.minimumGuests || item.serves || 1} onChange={(personCount) => onChange({ personCount })} disabled={disabled} />}
    {item.pricingType !== "per-person" && <Counter label={t("menu.standaloneQuantity", { defaultValue: "Antall enheter" })} value={item.quantity} minimum={1} onChange={(quantity) => onChange({ quantity })} disabled={disabled} />}
  </div>;
}
