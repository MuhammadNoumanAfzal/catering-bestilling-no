export function createReturnState(location) {
 return {from: location.pathname + (location.search || "") + (location.hash || ""), fromState: location.state || null, ...(typeof window !== "undefined" ? {fromScrollY: window.scrollY} : {})};
}
export function resolveReturnNavigation(state, fallback) {
 const from=state?.from;
 const path=typeof from === "string" ? from : from?.pathname ? from.pathname + (from.search || "") + (from.hash || "") : "";
 // Accept only local paths, including legacy location-object state.
 if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return {to:fallback,state:null};
 const previousState = state?.fromState ?? (typeof from === "object" ? from.state : null) ?? null;
 const scrollY = state?.fromScrollY;
 return {to:path,state:Number.isFinite(scrollY) && scrollY >= 0 ? {...(previousState && typeof previousState === 'object' ? previousState : {}), __restoreScrollY: Math.min(scrollY,10000000)} : previousState};
}
