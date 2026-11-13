import {useEffect} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import policies from "../data/policies.json";
function Text({children}) {
 return String(children).split(/(https:\/\/gocatering\.no\/privacy-policy|support@gocatering\.no|datatilsynet\.no)/g).map((part,i)=>{
  if(part==="https://gocatering.no/privacy-policy")return <Link key={i} to="/privacy-policy" className="font-medium text-[#b4542c] underline">{part}</Link>;
  if(part==="support@gocatering.no")return <a key={i} href="mailto:support@gocatering.no" className="font-medium text-[#b4542c] underline">{part}</a>;
  if(part==="datatilsynet.no")return <a key={i} href="https://www.datatilsynet.no" className="font-medium text-[#b4542c] underline">{part}</a>;
  return part;
 });
}
function Block({block}) {
 if(block.type==="list")return <ul className="list-disc space-y-3 pl-5 marker:text-[#b47c59]">{block.items.map((item,i)=><li key={i}><Text>{item}</Text></li>)}</ul>;
 if(block.type==="table")return <div className="overflow-x-auto rounded-xl border border-[#e8dfd6]"><table className="w-full min-w-[430px] border-collapse text-left text-sm leading-6"><thead className="bg-[#faf4ee] text-[#3c2d23]"><tr>{block.headers.map((h,i)=><th key={i} scope="col" className="px-4 py-3 align-top font-semibold"><Text>{h}</Text></th>)}</tr></thead><tbody>{block.rows.map((row,i)=><tr key={i} className="border-t border-[#eee5dd]">{row.map((cell,j)=><td key={j} className="px-4 py-3 align-top"><Text>{cell}</Text></td>)}</tr>)}</tbody></table></div>;
 return <p><Text>{block.text}</Text></p>;
}
export default function PolicyDocument({type}) {
 const {i18n}=useTranslation();const [params,setParams]=useSearchParams();const requested=params.get("lang");
 const language=requested==="en"||requested==="no"?requested:/^(no|nb|nn)/i.test(i18n.resolvedLanguage||i18n.language)?"no":"en";
 const no=language==="no",policy=policies[language][type];
 useEffect(()=>{if((requested==="en"||requested==="no")&&i18n.language!==requested)i18n.changeLanguage(requested);},[requested,i18n]);
 useEffect(()=>{const previous=document.title;document.title=policy.title+" | GoCatering.no";return()=>{document.title=previous;};},[policy.title]);
 function changeLanguage(next){const updated=new URLSearchParams(params);updated.set("lang",next);setParams(updated,{replace:true});i18n.changeLanguage(next);}
 return <main lang={language} className="min-h-screen bg-[#fcfaf7] px-4 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl">
  <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><Link to="/" className="text-sm font-medium text-[#8a6650] hover:text-[#b4542c]">{no?"Til forsiden":"Back to home"}</Link><div role="group" aria-label={no?"Språk":"Language"} className="flex gap-1 rounded-xl border border-[#e7dbd0] bg-white p-1">{[["no","Norsk"],["en","English"]].map(([value,label])=><button key={value} type="button" onClick={()=>changeLanguage(value)} aria-pressed={language===value} className={"rounded-lg px-4 py-2 text-sm font-medium transition "+(language===value?"bg-[#c96432] text-white":"text-[#786454] hover:bg-[#faf2eb]")}>{label}</button>)}</div></div>
  <header className="mb-8 border-b border-[#e9ddd2] pb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b0744c]">Go Catering AS</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-[#302923] sm:text-4xl">{policy.title}</h1><p className="mt-4 text-sm leading-6 text-[#8b7766]">{policy.updated}</p><Link to={(type==="terms"?"/privacy-policy":"/terms-and-conditions")+"?lang="+language} className="mt-4 inline-block text-sm font-medium text-[#b4542c] underline underline-offset-4">{policies[language][type==="terms"?"privacy":"terms"].title}</Link></header>
  <div className="grid items-start gap-8 lg:grid-cols-[230px_minmax(0,1fr)]"><nav aria-label={no?"Innhold":"Contents"} className="rounded-2xl border border-[#e8ddd2] bg-white p-4 lg:sticky lg:top-28"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#997d67]">{no?"Innhold":"Contents"}</p><ol className="space-y-1">{policy.sections.map(section=><li key={section.id}><a href={"#"+section.id} className="block rounded-lg px-2 py-1.5 text-[13px] leading-5 text-[#786454] transition hover:bg-[#faf2eb] hover:text-[#b4542c]">{section.title}</a></li>)}</ol></nav>
   <article className="min-w-0 rounded-2xl border border-[#e8ddd2] bg-white px-5 sm:px-8">{policy.sections.map(section=><section id={section.id} key={section.id} className="scroll-mt-32 border-b border-[#f0e8e0] py-7 last:border-0"><h2 className="mb-4 text-lg font-semibold leading-7 text-[#302923] sm:text-xl">{section.title}</h2><div className="space-y-4 break-words text-[15px] leading-7 text-[#695a4e]">{section.blocks.map((block,i)=><Block key={i} block={block}/>)}</div></section>)}</article>
  </div>
 </div></main>;
}
