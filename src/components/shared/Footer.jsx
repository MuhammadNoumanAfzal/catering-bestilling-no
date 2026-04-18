import React from "react";
import { Link } from "react-router-dom";
import { PiInstagramLogoFill } from "react-icons/pi";
import { MdFacebook } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

const footerGroups = [
  {
    title: "Solutions",
    links: ["Company Lunch", "Private Events", "Overtime Food"],
  },
  {
    title: "Support",
    links: ["Contact Us", "FAQ", "Delivery Areas"],
  },
  {
    title: "Explore",
    links: ["Browse Food Type", "Browse by Occasion", "Popular Vendors"],
  },
];

const Footer = () => {
  return (
    <footer className="mt-12 bg-[#c95c32] text-white px-10">
      <div className="mx-auto grid  gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Link to="/" className="inline-flex">
            <img
              src="/home/logo2.webp"
              alt="Lunsjavtale"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#ffe7de]">
            Fresh office meals, event catering, and curated lunch menus with a
            shared browsing experience across the whole app.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-lg font-semibold">{group.title}</h3>
            <div className="mt-4 space-y-3 text-sm text-[#ffe7de]">
              {group.links.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#dc7a53]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[#ffe7de]">
            Copyright 2026 Lunsjavtale. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-2xl text-[#2f2f2f]">
            <PiInstagramLogoFill />
            <MdFacebook />
            <RiWhatsappFill />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
