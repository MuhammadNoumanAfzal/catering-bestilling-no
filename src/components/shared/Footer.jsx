import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMail, FiPhone } from "react-icons/fi";
import { MdFacebook } from "react-icons/md";
import { PiInstagramLogoFill } from "react-icons/pi";
import { RiWhatsappFill } from "react-icons/ri";

const footerLinks = [
  { label: "Menus", to: "/browse/food-type" },
  { label: "Occasions", to: "/browse/occasion" },
  { label: "Vendors", to: "/vendors/featured" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: MdFacebook },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: PiInstagramLogoFill,
  },
  { label: "WhatsApp", href: "https://wa.me/", icon: RiWhatsappFill },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#a94d2b] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,236,224,0.65),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,229,210,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,45,22,0.22),transparent_30%),linear-gradient(180deg,#ca6639_0%,#b2532e_48%,#964323_100%)]" />
      <div className="absolute left-[8%] top-[-52px] h-28 w-28 rounded-full border border-white/10 bg-white/8 blur-2xl" />
      <div className="absolute bottom-[-78px] right-[10%] h-36 w-36 rounded-full bg-[#ffd7bf]/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="rounded-[28px] border border-white/14 bg-[linear-gradient(135deg,rgba(255,248,243,0.16)_0%,rgba(255,255,255,0.08)_100%)] px-4 py-5 shadow-[0_20px_40px_rgba(76,28,11,0.2)] backdrop-blur sm:px-6 lg:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 lg:min-w-0 lg:flex-row lg:items-center lg:gap-6">
              <Link to="/" className="inline-flex shrink-0">
                <img
                  src="/home/logo.png"
                  alt="Cateringbestilling"
                  className="h-12 w-auto object-contain"
                />
              </Link>

              <div className="lg:min-w-0">
                <p className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                  Modern catering, minus the friction.
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#ffe9db]">
                  Discover local food partners for office lunches, meetings, and private events.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/16"
                >
                  <span>{item.label}</span>
                  <FiArrowUpRight className="text-[13px]" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-white/12 pt-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <a
                  href="mailto:hello@cateringbestilling.no"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#ffe9db] transition hover:text-white"
                >
                  <FiMail className="text-[14px]" />
                  <span>hello@cateringbestilling.no</span>
                </a>

                <a
                  href="tel:+4700000000"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#ffe9db] transition hover:text-white"
                >
                  <FiPhone className="text-[14px]" />
                  <span>+47 00 00 00 00</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/12 text-[19px] text-white transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/18"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-[12px] text-[#ffd9c7] sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Cateringbestilling</p>
              <p>Designed for faster, calmer ordering.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
