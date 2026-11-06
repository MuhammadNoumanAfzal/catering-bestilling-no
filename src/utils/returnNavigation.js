export function createReturnState(location) {
 return {from: location.pathname + (location.search || "") + (location.hash || ""), fromState: location.state || null};
}
export function resolveReturnNavigation(state, fallback) {
 const from=state?.from;
 const path=typeof from === "string" ? from : from?.pathname ? from.pathname + (from.search || "") + (from.hash || "") : "";
 // Accept only local paths, including legacy location-object state.
 if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return {to:fallback,state:null};
 return {to:path,state:state?.fromState ?? (typeof from === "object" ? from.state : null) ?? null};
}
