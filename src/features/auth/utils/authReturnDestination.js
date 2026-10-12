export function resolveAuthReturnDestination(state) {
  const from = state?.from;
  const pathname = typeof from === "string" ? from : from?.pathname;
  if (typeof pathname !== "string" || !pathname.startsWith("/") ||
      pathname.startsWith("//") || pathname.includes("\\") ||
      /^\/(signin|signup|forgot-password|reset-password)(?:[/?#]|$)/.test(pathname)) return "/";
  if (typeof from === "string") return from;
  return { pathname, search: from.search || "", hash: from.hash || "" };
}
