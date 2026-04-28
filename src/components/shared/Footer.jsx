import React from "react";
import { Link } from "react-router-dom";
import { PiInstagramLogoFill } from "react-icons/pi";
import { MdFacebook } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

const footerGroups = [
  {
    title: "Solutions",
    links: [
      { label: "Company Lunch", to: "/products/boxed-lunches" },
      { label: "Private Events", to: "/browse/occasion" },
      { label: "Overtime Food", to: "/browse/food-type" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/contact#faq" },
      { label: "Delivery Areas", to: "/browse/food-type" },
    ],
  },
  {
    title: "Links",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/" },
      { label: "Instagram", href: "https://www.instagram.com/" },
    ],
  },
  {
    title: "FAQ",
    links: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/",
        icon: <MdFacebook />,
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/",
        icon: <PiInstagramLogoFill />,
      },
      {
        label: "WhatsApp",
        href: "https://wa.me/",
        icon: <RiWhatsappFill />,
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer
      className=" overflow-hidden rounded-t-[28px] bg-[#c95c32] bg-cover bg-center text-white h-[320px]"
      style={{ backgroundImage: "url('/home/footer.png')" }}
    >
      <div className="">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Link to="/" className="inline-flex flex-col items-center">
              <img
                src="/home/logo2.webp"
                alt="Cateringbestilling"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="mt-7 grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[15px] font-bold uppercase tracking-[0.02em]">
                  {group.title}
                </h3>

                {group.title === "FAQ" ? (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xl text-[#2c221d] sm:justify-start">
                    {group.links.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        className="transition-opacity hover:opacity-80"
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 space-y-2 text-[13px] leading-6 text-[#fff1e9]">
                    {group.links.map((item) => (
                      item.href ? (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block transition-opacity hover:opacity-80"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="block transition-opacity hover:opacity-80"
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
