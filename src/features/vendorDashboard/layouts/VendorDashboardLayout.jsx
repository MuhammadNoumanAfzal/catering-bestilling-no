import { Navigate, Outlet, useLocation } from "react-router-dom";
import CommonNavbar from "../../../components/shared/CommonNavbar";
import VendorSidebar from "../components/VendorSidebar";
import { useAuth } from "../../auth/context/AuthContext";

export default function VendorDashboardLayout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5efe8_0%,#fbf9f6_32%,#f6f1eb_100%)]">
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row">
        <div className="px-3 pt-3 sm:px-4 lg:px-0 lg:pt-0 lg:sticky lg:top-0 lg:h-screen lg:self-start">
          <VendorSidebar />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <CommonNavbar
            hideLogo
            className="border-b border-[#ece5dd] bg-[#fcfaf7]/95 px-3 sm:px-4 lg:px-10 backdrop-blur"
          />
          <main className="flex-1 overflow-x-hidden px-3 pb-5 pt-4 sm:px-4 sm:pb-6 sm:pt-5 md:px-6 md:pb-8 md:pt-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
