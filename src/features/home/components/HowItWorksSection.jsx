import React from "react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    {
      id: "/home/1.webp",
      titleKey: "home.howItWorks.steps.location.title",
      descriptionKey: "home.howItWorks.steps.location.description",
      icon: "/home/Vector.webp",
    },
    {
      id: "/home/2.webp",
      titleKey: "home.howItWorks.steps.food.title",
      descriptionKey: "home.howItWorks.steps.food.description",
      icon: "/home/Vector-1.webp",
    },
    {
      id: "/home/3.webp",
      titleKey: "home.howItWorks.steps.delivery.title",
      descriptionKey: "home.howItWorks.steps.delivery.description",
      icon: "/home/Vector-2.webp",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-20 bg-white ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="type-h2  text-center mb-10 tracking-tight text-gray-900">
          {t("home.howItWorks.title")}
        </h2>

        {/* Main Background Container */}
        <div
          className="relative rounded-3xl overflow-hidden bg-cover bg-center min-h-[500px] flex items-center shadow-2xl"
          style={{
            backgroundImage: `url('/home/bg-image.webp')`,
          }}
        >
          {/* Dark Overlay to make text legible */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Cards Grid */}
          <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-10 lg:p-14 cursor-pointer">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                {/* Large Background Number */}
                {/* <div      
 className="text-white/80 text-7xl md:text-8xl font-black mb-[20px] z-88 select-none opacity-80 drop-shadow-lg">
                  {step.id}
                </div> */}
                <img
                  src={step.id}
                  alt={`Step ${step.id}`}
                  className="text-white/80 text-7xl md:text-8xl font-black mb-[20px] z-88 select-none opacity-80 drop-shadow-lg"
                />

                {/* White Content Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center text-center w-full z-10 min-h-[220px] transition-transform hover:scale-105 duration-300">
                  <div className="mb-3 text-gray-900">
                    <img
                      src={step.icon}
                      alt={t(step.titleKey)}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 tracking-tight">
                    {t(step.titleKey)}
                  </h3>
                  <p className="type-para leading-relaxed text-gray-600">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
