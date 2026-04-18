import { FiMapPin, FiSearch, FiArrowDownLeft } from "react-icons/fi";
import HomeNavbar from "./HomeNavbar";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf8f5]">
      <img
        src="/home/heroBg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="relative z-10 ">
        <HomeNavbar />

        <div className="grid min-h-[calc(100vh-88px)] items-center gap-12 px-5 py-10 md:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14">
          <div className="md:max-w-2xl">
            <h1 className=" text-[40px] md:text-[70px] font-extrabold text-black">
              Order Lunch 
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
                    placeholder="Enter your delivery address"
                    className="type-para ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Add Postal Code"
                  className="type-para h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-700 outline-none placeholder:text-gray-400 transition focus-within:border-[#e98c65] sm:w-[180px]"
                />
              </div>

              <button className="type-h6 mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c85f33] px-6 text-white transition hover:bg-[#b9542b]">
                <FiSearch className="text-base" />
                Search
              </button>
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
