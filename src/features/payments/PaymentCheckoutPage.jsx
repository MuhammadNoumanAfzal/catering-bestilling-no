import { validateOfferPayment } from '../offers/offerPayment';
import { useOfferText } from '../offers/offerText';
import {useCallback,useEffect,useRef,useState} from "react";
import {Link,useLocation,useNavigate,useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {FiArrowLeft,FiArrowUpRight,FiCheck,FiCheckCircle,FiLock,FiShield,FiShoppingBag} from "react-icons/fi";
import {useAuth} from "../auth/hooks/useAuth";
import {graphqlRequest} from "../../lib/api/graphqlClient";
import {createDinteroClient,paymentState} from "./dinteroClient.js";
import {PAYMENT_CHECKOUT_QUERY,normalizePaymentOrder,hostedSessionUrl,validDinteroSessionId} from "./checkoutModel.js";
import {mountCheckout} from "./mountCheckout.js";
const client=createDinteroClient(graphqlRequest);
export default function PaymentCheckoutPage(){
 const {orderId}=useParams(),{isLoggedIn,user}=useAuth(),{t,i18n}=useTranslation();
 const location=useLocation(),navigate=useNavigate();
 const [order,setOrder]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(false),[sessionId,setSessionId]=useState(null),[starting,setStarting]=useState(false),[revision,setRevision]=useState(0);
 const [sdkState,setSdkState]=useState("loading"); const container=useRef(null),startingRef=useRef(false);
 const offerText=useOfferText();
 const [offerBlocked,setOfferBlocked]=useState(false);
 const language=/^(no|nb)/i.test(i18n.resolvedLanguage||i18n.language)?"no":"en";
 const returnToOrder=useCallback(()=>navigate("/orders/"+encodeURIComponent(orderId)+"?payment=dintero",{replace:true}),[navigate,orderId]);
 useEffect(()=>{
  if(!isLoggedIn)return;let active=true;setLoading(true);setError(false);setOrder(null);setSessionId(null);
  graphqlRequest({query:PAYMENT_CHECKOUT_QUERY,variables:{id:orderId}}).then(async data=>{
   const value=normalizePaymentOrder(data?.clientOrder);
   if(["pending","retry"].includes(paymentState(value)))await validateOfferPayment(orderId,user?.id);
   if(active){setOrder(value);if(["pending","retry"].includes(paymentState(value)))setSessionId(value.sessionId);}
  }).catch(err=>{if(active){setError(true);setOfferBlocked(err?.code==="OFFER_PAYMENT_BLOCKED");}}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[orderId,isLoggedIn,user?.id,revision]);
 useEffect(()=>{
  if(!isLoggedIn || loading || error || offerBlocked || !sessionId || !container.current)return;let active=true,cleanup;setSdkState("loading");
  const timeout=setTimeout(()=>{if(active)setSdkState("error");},20000);
  import("@dintero/checkout-web-sdk").then(({embed})=>{
   if(!active)return;
   cleanup=mountCheckout({embed,container:container.current,sessionId,language,onReturn:returnToOrder,
    onError:()=>{if(active){clearTimeout(timeout);setSdkState("error");}},
    onReady:()=>{if(active){clearTimeout(timeout);setSdkState("ready");container.current?.querySelector("iframe")?.setAttribute("title",language==="no"?"Sikker betaling med Dintero":"Secure payment with Dintero");}}
   });
  }).catch(()=>{if(active){clearTimeout(timeout);setSdkState("error");}});
  return()=>{active=false;clearTimeout(timeout);cleanup?.();};
 },[sessionId,language,returnToOrder,isLoggedIn,loading,error,offerBlocked]);
 useEffect(()=>{
  if(!isLoggedIn||!orderId||!order||!["pending","retry"].includes(paymentState(order)))return;let active=true;
  const check=()=>validateOfferPayment(orderId,user?.id).then(()=>{if(active)setOfferBlocked(false);}).catch(()=>{if(active){setOfferBlocked(true);setSessionId(null);}});
  void check();const timer=setInterval(check,5000);window.addEventListener('focus',check);
  return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',check);};
 },[orderId,isLoggedIn,user?.id,order]);
 async function startPayment(){
  if(startingRef.current)return;startingRef.current=true;setStarting(true);setError(false);
  try{
   await validateOfferPayment(orderId,user?.id);
   const current=await client.status(orderId);
   if(!["pending","retry"].includes(paymentState(current))){setRevision(value=>value+1);return;}
   const session=await client.session(orderId,window.location.origin);
   if(!validDinteroSessionId(session.sessionId))throw new Error("Invalid session.");
   // Tear down the previous checkout before mounting a replacement, even if reused.
   setSessionId(null);setSdkState("loading");setRevision(value=>value+1);
  }catch{setError(true);}finally{startingRef.current=false;setStarting(false);}
 }
 const state=paymentState(order);
 const money=value=>value==null ? t("checkoutPage.unavailable") : new Intl.NumberFormat(language==="no"?"nb-NO":"en-GB",{style:"currency",currency:order?.currency||"NOK",maximumFractionDigits:2}).format(Number(value));
 const orderLink="/orders/"+encodeURIComponent(orderId);
 const buttonClass="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c96432] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b45527] disabled:opacity-50";
 return <div className="min-h-dvh bg-[#f7f5f1] text-[#302923]">
 <header className="border-b border-[#e8e2da] bg-white"><div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
 <Link to="/" aria-label="Go Catering"><img src="/home/logo (2).png" alt="Go Catering" className="h-11 w-28 object-contain"/></Link>
 <span className="flex items-center gap-2 text-xs font-medium text-[#82786e]"><FiLock size={14}/>{t("checkoutPage.secure")}</span>
 </div></header>
 <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-8 sm:py-9">{offerBlocked?<div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{offerText("This offer changed, expired or could not be verified. Payment has stopped. Return to My offers to review it.","Tilbudet er endret, utløpt eller kunne ikke verifiseres. Betalingen er stoppet. Gå til Mine tilbud for å se gjennom det.")} <Link to="/my-offers" className="underline">{offerText("My offers","Mine tilbud")}</Link></div>:null}
 <Link to={orderLink} className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#8c7a69] hover:text-[#c96432]"><FiArrowLeft/>{t("checkoutPage.back")}</Link>
 <div className="mb-6"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bb734e]">{t("checkoutPage.step")}</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("checkoutPage.title")}</h1><p className="mt-2 max-w-lg text-sm leading-6 text-[#8a7c6e]">{t("checkoutPage.subtitle")}</p></div>
 {!isLoggedIn ? <section className="rounded-2xl border border-[#e8e0d5] bg-white p-6"><p className="mb-4 text-sm">{t("checkoutPage.signInHint")}</p><Link to="/signin" state={{from:location}} className={buttonClass}>{t("checkoutPage.signIn")}</Link></section> :
 <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
 <section className="overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white shadow-[0_4px_20px_rgba(50,34,18,0.03)]">
 <div className="flex items-center gap-3 border-b border-[#eee8e0] px-5 py-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff2e8] text-[#c96432]"><FiLock size={15}/></span><div><h2 className="text-sm font-semibold">{t("checkoutPage.method")}</h2><p className="mt-0.5 text-xs text-[#9b8e80]">{t("checkoutPage.powered")}</p></div>{order ? <p className="ml-auto text-right text-sm font-semibold tabular-nums">{money(order.pricing?.amountDue ?? order.dueAmount ?? order.grandTotal)}</p>:null}</div>
 <div className="p-5 sm:p-6">
 {loading ? <p role="status" className="py-8 text-center text-sm text-[#8b7e70]">{t("checkoutPage.loading")}</p> : error ? <div role="alert"><p className="mb-4 text-sm leading-6 text-[#9b4c35]">{t("checkoutPage.error")}</p><button type="button" onClick={()=>setRevision(value=>value+1)} className={buttonClass}>{t("checkoutPage.retryLoad")}</button></div> : ["paid","reserved","released"].includes(state) ? <div className="py-5"><FiCheckCircle className={"mb-3 " + (state === "released" ? "text-[#9c8c7d]" : "text-[#438454]")} size={28}/><h3 className="font-semibold">{t("dintero."+state)}</h3>{state === "reserved" ? <p className="mt-2 text-sm leading-6 text-[#8a7c6e]">{t("dintero.reservedHint")}</p>:null}<Link to={orderLink} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c96432]">{t("checkoutPage.viewOrder")}<FiArrowUpRight/></Link></div> : ["orderCancelled","unknown"].includes(state) ? <p className="text-sm leading-6 text-[#8a7c6f]">{t("dintero."+state)}</p> : <>
 {sessionId?.startsWith("T") ? <p className="mb-4 rounded-lg border border-[#f0dfb0] bg-[#fffae9] px-3 py-2.5 text-xs leading-5 text-[#9c7b34]">{t("checkoutPage.testMode")}</p>:null}
 {sessionId ? <>
 {sdkState==="loading" ? <p role="status" className="mb-3 text-xs text-[#988777]">{t("checkoutPage.opening")}</p>:null}
 <div ref={container} className="min-w-0 [&_iframe]:w-full"/>
 {sdkState==="error" ? <div role="alert" className="mt-3 rounded-xl bg-[#fff7f1] p-4"><p className="mb-3 text-xs leading-5 text-[#976443]">{t("checkoutPage.sdkError")}</p><a href={hostedSessionUrl(sessionId)} className={buttonClass}>{t("checkoutPage.hosted")}<FiArrowUpRight/></a><button type="button" disabled={starting||offerBlocked} onClick={startPayment} className="mt-3 block text-xs font-semibold text-[#9b6d4e] underline underline-offset-4">{t("dintero.retryButton")}</button></div>:null}
 </> : <div className="py-4"><p className="mb-4 text-sm leading-6 text-[#8b7b6b]">{t("checkoutPage.startHint")}</p><button type="button" disabled={starting} onClick={startPayment} className={buttonClass}>{t(starting?"dintero.opening":"checkoutPage.start")}<FiArrowUpRight/></button></div>}
 </>}
 </div>
 <div className="flex items-start gap-2 border-t border-[#f0ebe4] bg-[#fdfcf9] px-5 py-3 text-[11px] leading-5 text-[#9b8d7d]"><FiShield className="mt-1 shrink-0"/>{t("checkoutPage.securityHint")}</div>
 </section>
 <aside className="rounded-2xl border border-[#e7dfd5] bg-white p-5 lg:sticky lg:top-6">
 <h2 className="flex items-center gap-2 text-sm font-semibold"><FiShoppingBag size={15} className="text-[#b78a65]"/>{t("checkoutPage.summary")}</h2>
 {order ? <>
 <div className="mt-4 flex items-center gap-3 border-b border-[#eee8df] pb-4">{order.vendor?.logoUrl ? <img src={order.vendor.logoUrl} alt="" className="h-10 w-10 rounded-lg border border-[#eee8df] object-contain"/>:null}<div className="min-w-0"><p className="text-sm font-semibold">{order.vendor?.name}</p><p className="mt-1 text-[11px] text-[#a28e79]">{order.invoiceNumber || order.id}</p></div></div>
 <ul className="divide-y divide-[#f2ede7]">{order.items.map((item,index)=><li key={item.id || index} className="flex items-start justify-between gap-3 py-3 text-xs leading-5"><div className="min-w-0"><p className="break-words font-medium">{item.productName || t("checkoutPage.item")}</p><p className="text-[#9c8c7c]">{t("checkoutPage.quantity",{count:item.quantity || 1})}</p></div><span className="shrink-0 tabular-nums text-[#766655]">{money(item.lineTotal)}</span></li>)}</ul>
 <dl className="space-y-2 border-t border-[#e9e1d7] pt-4 text-xs text-[#8f7c69]">{[["subtotal",order.pricing?.subtotal],["delivery",order.pricing?.deliveryFee],["tip",order.pricing?.tipAmount]].filter(([,value])=>value!=null).map(([key,value])=><div key={key} className="flex justify-between gap-3"><dt>{t("checkoutPage."+key)}</dt><dd className="tabular-nums">{money(value)}</dd></div>)}</dl>
 <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#e9e1d7] pt-4"><div><p className="text-sm font-semibold">{t("checkoutPage.total")}</p><p className="mt-1 text-[10px] text-[#a28f7b]">{t("checkoutPage.vat")}</p></div><p className="text-xl font-semibold tracking-tight tabular-nums">{money(order.grandTotal)}</p></div>
 {order.pricing?.amountPaid!=null && Number(order.pricing.amountPaid)>0 ? <p className="mt-3 text-xs text-[#8c7c68]">{t("checkoutPage.remaining")}: {money(order.pricing.amountDue ?? order.dueAmount)}</p>:null}
 {[order.eventDate,order.eventTime,[order.deliveryAddress,order.deliveryPostalCode,order.deliveryCity].filter(Boolean).join(", ")].filter(Boolean).length ? <div className="mt-5 space-y-1 rounded-xl bg-[#f9f7f3] p-3 text-[11px] leading-5 text-[#92816e]">{[order.eventDate,order.eventTime,[order.deliveryAddress,order.deliveryPostalCode,order.deliveryCity].filter(Boolean).join(", ")].filter(Boolean).map((line,index)=><p key={index}>{line}</p>)}</div>:null}
 </> : <p className="mt-4 text-xs text-[#a08d7a]">{t("checkoutPage.loading")}</p>}
 </aside></div>}
 <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#a3978a]"><FiCheck size={12}/>{t("checkoutPage.footer")}</p>
 </main></div>;
}
