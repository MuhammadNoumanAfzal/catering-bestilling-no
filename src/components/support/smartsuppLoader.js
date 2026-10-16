export const SMARTSUPP_SCRIPT_ID = "gocatering-smartsupp-loader";
export const DEFAULT_SMARTSUPP_KEY = "360c40b103c080b92263cc67ffe30f8dbab9b1fe";

export function loadSmartsupp({ window: browser, document, key = DEFAULT_SMARTSUPP_KEY }) {
  if (!key || document.getElementById(SMARTSUPP_SCRIPT_ID)) return;
  browser._smartsupp = {
    ...browser._smartsupp,
    key,
    color: "#cf6e38",
    privacyNoticeEnabled: true,
    privacyNoticeCheckRequired: true,
    privacyNoticeUrl: new URL("/privacy-policy", browser.location.origin).href,
    offsetY: browser.innerWidth < 640 ? 88 : 24,
  };
  if (!browser.smartsupp) {
    const queue = function (...args) { queue._.push(args); };
    queue._ = [];
    browser.smartsupp = queue;
  }
  browser.smartsupp("language", "no");
  const script = document.createElement("script");
  script.id = SMARTSUPP_SCRIPT_ID;
  script.type = "text/javascript";
  script.charset = "utf-8";
  script.async = true;
  script.src = "https://www.smartsuppchat.com/loader.js";
  script.onerror = () => script.remove();
  document.head.appendChild(script);
}
