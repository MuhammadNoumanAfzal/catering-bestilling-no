import { FaCheck } from "react-icons/fa";

export default function OrderConfirmationHero() {
  return (
    <>
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1ea]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#cf6e38] text-white shadow-[0_10px_24px_rgba(207,110,56,0.28)]">
          <FaCheck className="text-[26px]" />
        </div>
      </div>

      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b77754]">
        Order placed successfully
      </p>
      <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#201b17] sm:text-[42px]">
        Your catering order has been placed
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#5f5a55]">
        We have received your request and sent it to the vendor. You will
        receive an email confirmation shortly with the final order details.
      </p>
    </>
  );
}
