import {paymentPagePath} from "./checkoutModel.js";
import {FiCheckCircle, FiCreditCard, FiRefreshCw, FiChevronDown} from "react-icons/fi";
import {useEffect,useRef,useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation,useNavigate} from "react-router-dom";
import {graphqlRequest} from "../../lib/api/graphqlClient";
import {createDinteroClient,paymentState} from "./dinteroClient.js";
const client=createDinteroClient(graphqlRequest);
export default function OrderPaymentSection({orderId}) {
 const {t}=useTranslation(); const location=useLocation(); const navigate=useNavigate();
 const returned=new URLSearchParams(location.search).get("payment")==="dintero";
 const [order,setOrder]=useState(null),[error,setError]=useState(false),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[revision,setRevision]=useState(0);
 const paying=useRef(false);
 useEffect(()=>{
  let active=true,timer,attempt=0; setOrder(null);setLoading(true);setError(false);
  async function refresh(){
   try {const result=await client.status(orderId);if(!active)return;setOrder(result);setError(false);
    if(returned && paymentState(result)==="pending" && ++attempt<12) timer=setTimeout(refresh,3000);
   } catch {if(active)setError(true);} finally {if(active)setLoading(false);}
  }
  refresh();return()=>{active=false;clearTimeout(timer);};
 },[orderId,returned,revision]);
 useEffect(()=>{
  const refresh=event=>{if(!event.detail?.orderId || String(event.detail.orderId)===String(orderId))setRevision(value=>value+1);};
  window.addEventListener("gocatering-order-updated",refresh);
  return()=>window.removeEventListener("gocatering-order-updated",refresh);
 },[orderId]);
 async function pay(){
  if(paying.current)return;paying.current=true;setBusy(true);setError(false);
  try {const current=await client.status(orderId);setOrder(current);
   if(!["pending","retry"].includes(paymentState(current)))return;
   navigate(paymentPagePath(orderId));
  }catch{setError(true);}finally{paying.current=false;setBusy(false);}
 }
 const state=paymentState(order);
 return <section aria-live="polite" className="mx-4 my-3 overflow-hidden rounded-xl border border-[#e7e2dc] bg-white text-left sm:mx-5">
 <div className="flex items-start gap-3 px-4 py-3.5">
 <span className={"mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full " + (["paid","reserved"].includes(state) && !error ? "bg-[#edf6ef] text-[#39834e]" : "bg-[#fff3e9] text-[#c56636]")} aria-hidden="true">{state === "paid" && !error ? <FiCheckCircle size={17}/> : <FiCreditCard size={17}/>}</span>
 <div className="min-w-0 flex-1">
 <h3 className="text-sm font-semibold leading-5 text-[#302923]">{t(!loading && !error && ["paid","reserved","released"].includes(state) ? "dintero."+state : "dintero.title")}</h3>
 {["paid","reserved"].includes(state) && !loading && !error ? <p className="mt-0.5 text-xs leading-5 text-[#82766b]">{state === "reserved" ? t("dintero.reservedHint") : "Dintero"}</p> : <p className="mt-1 text-[13px] leading-5 text-[#776b60]">{t(loading?"dintero.checking":error?"dintero.error":"dintero."+state)}</p>}
 {!loading && !error && ["pending","retry"].includes(state) ? <button type="button" disabled={busy} onClick={pay} className="mt-3 rounded-lg bg-[#c96432] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#b35629] disabled:opacity-50">{t(busy?"dintero.opening":state==="retry"?"dintero.retryButton":"dintero.pay")}</button>:null}
 </div>
 {!["paid","released"].includes(state) || error ? <button type="button" disabled={loading||busy} onClick={()=>setRevision(value=>value+1)} title={t("dintero.refresh")} aria-label={t("dintero.refresh")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e7dfd7] text-[#7d7065] hover:bg-[#faf7f3] disabled:opacity-40"><FiRefreshCw size={15} className={loading ? "animate-spin" : ""}/></button> : null}
 </div>
 {order?.dinteroTransactionId ? <details className="group border-t border-[#f0ece7] px-4 py-2.5 text-xs text-[#8c7e72]"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">{t("dintero.reference")}<FiChevronDown className="transition group-open:rotate-180" aria-hidden="true"/></summary><p className="mt-2 break-all font-mono text-[11px] leading-5 text-[#716356]">{order.dinteroTransactionId}</p></details>:null}
 </section>;
}
