import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollDocumentToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function RouteScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    scrollDocumentToTop();

    const frameId = window.requestAnimationFrame(scrollDocumentToTop);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.search]);

  return null;
}
