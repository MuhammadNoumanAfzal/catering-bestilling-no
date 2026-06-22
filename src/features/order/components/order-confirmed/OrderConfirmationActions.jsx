import { FiArrowRight, FiEdit3, FiGrid, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function OrderConfirmationActions({
  canModify,
  onModify,
}) {
  return (
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

      <Link
        to="/vendor-dashboard"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
      >
        Browse Dashboard
        <FiGrid className="text-[16px]" />
      </Link>

      {canModify ? (
        <button
          type="button"
          onClick={onModify}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
        >
          Modify Order
          <FiEdit3 className="text-[16px]" />
        </button>
      ) : null}
    </div>
  );
}
