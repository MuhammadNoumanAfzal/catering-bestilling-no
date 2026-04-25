import { FaCheck } from "react-icons/fa";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function OrderConfirmedPage() {
  return (
    <section className="min-h-[calc(100vh-120px)] bg-[linear-gradient(180deg,#faf6f1_0%,#fffdf9_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[28px] border border-[#e7ddd3] bg-white shadow-[0_24px_60px_rgba(48,31,17,0.08)]">
          <div className="border-b border-[#f0e5db] px-6 py-5 sm:px-8">
            <Link to="/" className="inline-flex cursor-pointer">
              <img
                src="/home/logo.png"
                alt="Lunsjavtale"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="px-6 py-10 text-center sm:px-8 sm:py-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1ea]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#cf6e38] text-white shadow-[0_10px_24px_rgba(207,110,56,0.28)]">
                <FaCheck className="text-[26px]" />
              </div>
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b77754]">
              Order placed successfully
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#201b17] sm:text-[42px]">
              Your catering order is confirmed
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#5f5a55]">
              We have received your request and sent it to the vendor. You will
              receive an email confirmation shortly with the final order details.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[20px] border border-[#eee4da] bg-[#fcf9f6] p-5 text-left sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Status
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                  Confirmed
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Order ID
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#cf6e38]">
                  #23459
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                  Next step
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#201b17]">
                  Check your email inbox
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
              >
                <FiHome className="text-[16px]" />
                Back to Home
              </Link>

              <Link
                to="/browse/food-type"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
              >
                Browse Menus
                <FiArrowRight className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
