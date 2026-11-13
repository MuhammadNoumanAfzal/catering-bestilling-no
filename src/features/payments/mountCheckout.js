// Lifecycle wrapper: provider callbacks initiate server verification, never mark paid.
export function mountCheckout({embed,container,sessionId,language,onReturn,onError,onReady}) {
 let active=true,instance;
 const handleReturn=()=>{if(active)onReturn();};
 Promise.resolve().then(()=>active ? embed({container,sid:sessionId,language,popOut:true,ui:"inline",debug:false,
  onSession:()=>{if(active)onReady();},
  onPayment:handleReturn,onPaymentError:handleReturn,onSessionCancel:handleReturn,
  onSessionNotFound:()=>{if(active)onError();},onSessionLockFailed:()=>{if(active)onError();}
 }) : null).then(checkout=>{
  instance=checkout;
  if(!active)checkout?.destroy();

 }).catch(()=>{if(active)onError();});
 return ()=>{active=false;instance?.destroy();};
}
