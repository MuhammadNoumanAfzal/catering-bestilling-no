import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff8f2_0%,#f8f0e9_54%,#f4ece4_100%)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="absolute left-[6%] top-12 -z-10 h-44 w-44 rounded-full bg-[#e8b894]/30 blur-3xl" />
        <div className="absolute right-[10%] top-[24%] -z-10 h-56 w-56 rounded-full bg-[#f4d7b6]/40 blur-3xl" />
        <div className="absolute bottom-12 left-1/3 -z-10 h-40 w-40 rounded-full bg-[#cf6e38]/12 blur-3xl" />

        <div className="grid min-h-[calc(100vh-3rem)] overflow-hidden rounded-[34px] border border-[#eadccf] bg-[rgba(255,251,247,0.82)] shadow-[0_30px_90px_rgba(69,42,19,0.12)] backdrop-blur xl:grid-cols-[0.88fr_1.12fr]">
          <section className="relative hidden overflow-hidden border-r border-[#eadfd5] bg-[radial-gradient(circle_at_top_left,rgba(207,110,56,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(246,219,191,0.45),transparent_38%),linear-gradient(160deg,#2f241d_0%,#493326_42%,#c76838_140%)] p-10 text-white xl:flex xl:flex-col xl:justify-center">
            <div className="absolute -right-20 top-8 h-56 w-56 rounded-full border border-white/12 bg-white/6 blur-sm" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full border border-white/10 bg-[#f3be96]/10 blur-2xl" />

            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffe8d6]">
                Lunsjavtale Access
              </div>
              <h1 className="mt-7 font-serif text-[44px] leading-[0.98] text-white">
                Simple access for orders, vendors, and team lunches.
              </h1>
              <p className="mt-5 text-[16px] leading-7 text-white/76">
                A cleaner place to sign in, create an account, and get back to your catering flow.
              </p>
              <div className="mt-8 grid gap-3">
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white/82 backdrop-blur-sm">
                  Fast planning
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white/82 backdrop-blur-sm">
                  Warm brand feel
                </div>
                <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-3 text-[14px] text-white/82 backdrop-blur-sm">
                  Cleaner account flow
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-12">
            <div className="w-full max-w-[500px]">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
