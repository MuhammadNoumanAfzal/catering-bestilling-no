import { Outlet } from "react-router-dom";
import Footer from "../../components/shared/Footer";

export default function CheckoutLayout() {
  return (
    <div className="min-h-screen bg-[#f5f2ee]">
      <Outlet />
      <Footer />
    </div>
  );
}
