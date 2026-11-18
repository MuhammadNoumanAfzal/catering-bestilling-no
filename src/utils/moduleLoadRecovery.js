export function isModuleLoadError(error) {
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk .+ failed/i.test(typeof error==='string'?error:error?.message||'');
}
const KEY='customer-chunk-recovery-at';
export function recoverModuleLoad(error,{storage=window.sessionStorage,now=Date.now(),reload=()=>window.location.reload()}={}) {
  if(!isModuleLoadError(error))return false;
  try {
    const previous=storage.getItem(KEY);
    if(previous!==null && Number.isFinite(Number(previous)) && now-Number(previous)<60000)return false;
    storage.setItem(KEY,String(now));
  } catch { return false; }
  reload();
  return true;
}
