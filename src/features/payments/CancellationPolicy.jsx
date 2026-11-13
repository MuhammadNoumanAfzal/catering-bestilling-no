import {useEffect,useRef,useState} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
function PolicyDialog({onClose}) {
 const {t}=useTranslation();const dialog=useRef(null);
 useEffect(()=>{const node=dialog.current;node.showModal();return()=>node.close();},[]);
 return <dialog ref={dialog} onCancel={event=>{event.preventDefault();onClose();}} aria-labelledby="cancellation-policy-title" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-[#e8dfd5] bg-white p-5 text-[#352b22] shadow-xl backdrop:bg-black/45">
 <div className="flex items-center justify-between gap-4"><h3 id="cancellation-policy-title" className="text-lg font-semibold">{t("cancellationPolicy.title")}</h3><button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xs text-[#8c7a68]">{t("cancellationPolicy.close")}</button></div>
 <p className="mt-2 text-sm leading-6 text-[#938170]">{t("cancellationPolicy.intro")}</p>
 <dl className="mt-4 divide-y divide-[#efe8df]">{["early","middle","late"].map(key=><div key={key} className="py-3"><dt className="text-sm font-semibold">{t("cancellationPolicy."+key)}</dt><dd className="mt-1 text-xs leading-5 text-[#8c7968]">{t("cancellationPolicy."+key+"Detail")}</dd></div>)}</dl>
 <p className="mt-3 rounded-lg bg-[#faf7f2] p-3 text-xs leading-5 text-[#8d7b69]">{t("cancellationPolicy.note")}</p>
 <Link to="/client-dashboard/support" onClick={onClose} className="mt-4 inline-flex rounded-lg bg-[#c96432] px-4 py-2.5 text-sm font-semibold text-white">{t("cancellationPolicy.support")}</Link>
 </dialog>;
}
export default function CancellationPolicy(){
 const {t}=useTranslation();const [open,setOpen]=useState(false);
 return <div className="mx-4 my-2 sm:mx-5"><button type="button" onClick={()=>setOpen(true)} className="py-1 text-xs font-medium text-[#9a7b61] underline underline-offset-4">{t("cancellationPolicy.title")}</button>{open?<PolicyDialog onClose={()=>setOpen(false)}/>:null}</div>;
}
