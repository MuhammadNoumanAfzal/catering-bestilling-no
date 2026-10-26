import Footer from "../../components/shared/Footer";
import CommonNavbar from "../../components/shared/CommonNavbar";
import { Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const location = useLocation();
  const hideSharedShell =
    location.pathname === "/" || location.pathname === "/order-confirmed" || location.pathname === "/catering-for-business";
  const showCommonNavbar = !hideSharedShell;

  return (
    <div>
      {showCommonNavbar ? <CommonNavbar /> : null}
      <Outlet />
      <Footer />
    </div>
  );
}
