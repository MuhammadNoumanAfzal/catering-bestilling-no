import { Link } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function HomeNavbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const navLinks = [
    { to: "/contact", label: "Contact us" },
    { to: "/signin", label: "Sign in", button: true },
    { to: "/cart", label: "Cart", icon: <FiShoppingCart /> },
  ];

  return (
    <header className="relative z-50 w-full">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-10">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/home/logo.png
            "
            alt="logo"
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          <Link
            to="/contact"
            className="type-h5 text-gray-700 transition hover:text-black"
          >
            Contact us
          </Link>

          <Link
            to="/signin"
            className="type-h6 rounded-full bg-[#c85f33] px-6 py-2 text-white transition hover:opacity-90"
          >
            Sign in
          </Link>

          <Link
            to="/cart"
            className="text-3xl text-black transition hover:opacity-70"
            aria-label="Cart"
          >
            <FiShoppingCart />
          </Link>
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center text-9xl text-black transition duration-300 hover:scale-110 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Contact us
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              <span className="text-lg">
                <FiShoppingCart />
              </span>
              Cart
            </Link>

            <Link
              to="/signin"
              onClick={closeMenu}
              className="mt-1 w-full rounded-full bg-[#c85f33] px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
