import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/VendorSidebar";
import VendorTopbar from "../components/VendorTopbar";

export default function VendorDashboardLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5efe8_0%,#fbf9f6_32%,#f6f1eb_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <div className="lg:sticky lg:top-0 lg:h-screen lg:self-start">
          <VendorSidebar />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <VendorTopbar />
          <main className="flex-1 p-5 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
