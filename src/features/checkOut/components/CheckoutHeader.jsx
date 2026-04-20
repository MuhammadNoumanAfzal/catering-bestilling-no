import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function CheckoutHeader() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-[#d9d1c7] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#ddd6cd] text-[#2b2b2b] transition hover:border-[#c85f33] hover:text-[#c85f33]"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-[18px]" />
          </button>

          <Link to="/" className="inline-flex cursor-pointer">
            <img
              src="/home/logo.png"
              alt="Lunsjavtale"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <p className="type-h6 hidden text-[#2b2b2b] sm:block">
          Checkout
        </p>
      </div>
    </header>
  );
}
