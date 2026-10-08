import { Link, Outlet, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "../../components/shared/Footer";
import { useAuth } from "../../features/auth";

export default function CheckoutLayout() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
        <section role="dialog" aria-modal="true" aria-labelledby="checkout-login-title" className="w-full max-w-[420px] rounded-[8px] bg-white p-6 shadow-xl">
          <h1 id="checkout-login-title" className="text-[22px] font-semibold text-black">{t("checkout.loginRequiredTitle")}</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#444]">{t("checkout.loginRequiredMessage")}</p>
          <div className="mt-5 flex flex-col gap-3">
            <Link autoFocus to="/signin" state={{ from: location }} className="flex items-center justify-center gap-2 rounded-[6px] bg-[#cf6e38] px-4 py-3 font-semibold text-white"><LogIn size={18} />{t("alerts.signIn")}</Link>
            <Link to="/signup" state={{ from: location }} className="flex items-center justify-center gap-2 rounded-[6px] border border-[#ddd] px-4 py-3 font-semibold text-black"><UserPlus size={18} />{t("alerts.createAccount")}</Link>
            <Link to="/" replace className="py-2 text-center font-semibold text-[#555]">{t("alerts.notNow")}</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ee]">
      <Outlet />
      <Footer />
    </div>
  );
}
