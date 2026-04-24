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
        <div className="lg:sticky lg:top-0 lg:h-screen lg:self-start">
          <VendorSidebar />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <CommonNavbar
            hideLogo
            className="border-b border-[#ece5dd] bg-[#fcfaf7]/95 backdrop-blur"
          />
          <main className="flex-1 overflow-x-hidden p-4 sm:p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
