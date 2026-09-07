import { Navigate, Outlet, useLocation } from "react-router-dom";
import CommonNavbar from "../../../components/shared/CommonNavbar";
import VendorSidebar from "../components/VendorSidebar";
import { useAuth } from "../../auth";

export default function VendorDashboardLayout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ee]">
      <div className="min-h-screen w-full overflow-x-clip lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
        <div className="px-3 pt-3 sm:px-4 lg:sticky lg:top-0 lg:h-screen lg:px-0 lg:pt-0 lg:self-start">
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
