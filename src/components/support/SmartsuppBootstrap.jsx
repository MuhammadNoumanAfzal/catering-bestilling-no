import { useEffect } from "react";
import { DEFAULT_SMARTSUPP_KEY, loadSmartsupp } from "./smartsuppLoader";

export default function SmartsuppBootstrap() {
  useEffect(() => {
    if (import.meta.env.VITE_SMARTSUPP_ENABLED === "false") return;
    const timer = window.setTimeout(() => {
      loadSmartsupp({ window, document,
        key: import.meta.env.VITE_SMARTSUPP_KEY || DEFAULT_SMARTSUPP_KEY,
      });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
