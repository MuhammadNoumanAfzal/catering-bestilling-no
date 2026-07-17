import { FiMapPin, FiSearch } from "react-icons/fi";
import HomeNavbar from "./HomeNavbar";

export default function HeroSection({
  deliveryAddress,
  onDeliveryAddressChange,
  onBrowseVendors,
  postalCode,
  onPostalCodeChange,
  hasValidPostalCode,
  onSearch,
  searchValidationMessage,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#fbf8f5]">
      <img
        src="/home/heroBg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="relative z-10 max-w-7xl mx-auto ">
        <HomeNavbar />

        <div className="grid min-h-[calc(100vh-88px)] max-w-7xl  mx-auto items-center gap-12 px-5 py-10 md:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14">
          <div className="md:max-w-2xl">
            <h1 className=" text-[40px] md:text-[70px] font-extrabold text-black">
              Order Lunch For
              <br />
              Work or Home
            </h1>

            <p className="type-h5 mt-5 max-w-xl text-gray-700">
              Fresh meals from local vendors delivered on time.
            </p>

            <div className="mt-8 max-w-2xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 py-2 flex-1 items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#e98c65]">
                  <FiMapPin className="shrink-0 text-sm text-gray-500" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(event) =>
                      onDeliveryAddressChange?.(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your delivery address"
                    className="type-para ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(event) =>
                    onPostalCodeChange?.(
                      event.target.value.replace(/\D/g, "").slice(0, 5),
                    )
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Add Postal Code"
                  className="type-para h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-700 outline-none placeholder:text-gray-400 transition focus-within:border-[#e98c65] sm:w-[180px]"
                />
              </div>

              <button
                type="button"
                onClick={onSearch}
                className="type-h6 mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c85f33] px-6 text-white transition hover:bg-[#b9542b]"
              >
                <FiSearch className="text-base" />
                Search
              </button>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onBrowseVendors}
                  className="type-h6 inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-[#e6d5c8] bg-[linear-gradient(135deg,#fffaf6_0%,#fff1e9_100%)] px-6 text-[#191919] shadow-[0_10px_24px_rgba(201,95,51,0.14)] transition duration-200 hover:-translate-y-[1px] hover:border-[#c46a35] hover:text-[#c46a35] hover:shadow-[0_16px_30px_rgba(201,95,51,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf6e38]/30"
                >
                  Browse all vendors
                </button>
              </div>
              {searchValidationMessage || (postalCode && !hasValidPostalCode) ? (
                <p className="mt-3 text-sm text-[#5f5a55]">
                  {searchValidationMessage ? (
                    <span className="font-medium text-[#b6542c]">
                      {searchValidationMessage}
                    </span>
                  ) : (
                    "Enter a 4 or 5 digit postal code to search in your area."
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="relative w-full">
              <img
                src="/home/home-hero.webp"
                alt="Home hero"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[320px] w-full object-contain sm:h-[420px] lg:h-[560px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
