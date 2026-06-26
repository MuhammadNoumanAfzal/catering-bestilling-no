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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(229,135,86,0.22),transparent_22%),radial-gradient(circle_at_top_right,rgba(255,214,187,0.55),transparent_28%),linear-gradient(180deg,#f7f0e8_0%,#fbf8f4_38%,#f4ede6_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:flex-row lg:gap-6 lg:px-5 lg:py-5">
        <div className="lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] lg:self-start">
          <VendorSidebar />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(255,251,247,0.92)_100%)] shadow-[0_24px_60px_rgba(78,47,28,0.10)] backdrop-blur">
          <CommonNavbar
            hideLogo
            className="border-b border-[#ece5dd] bg-white/70 px-3 sm:px-4 lg:px-8 backdrop-blur"
          />
          <main className="flex-1 overflow-x-hidden px-3 pb-5 pt-4 sm:px-4 sm:pb-6 sm:pt-5 md:px-6 md:pb-8 md:pt-6 lg:px-8 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
