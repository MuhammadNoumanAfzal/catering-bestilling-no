import Footer from "../../components/shared/Footer";
import CommonNavbar from "../../components/shared/CommonNavbar";
import { BrowseFiltersProvider } from "../context/BrowseFiltersContext";
import { Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const location = useLocation();
  const hideSharedShell =
    location.pathname === "/" || location.pathname === "/order-confirmed";
  const showCommonNavbar = !hideSharedShell;

  return (
    <BrowseFiltersProvider>
      <div>
        {showCommonNavbar ? <CommonNavbar /> : null}
        <Outlet />
        <Footer />
      </div>
    </BrowseFiltersProvider>
  );
}
