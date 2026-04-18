import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: "/home/1.png",
      title: "Choose Location",
      description:
        "Enter your delivery address or postal code to see which menus are available in your area for office or home delivery.",
      icon: "/home/Vector.png",
    },
    {
      id: "/home/2.png",
      title: "Select Food",
      description:
        "Browse our varied menu options. Pick from flexible corporate lunch plans or delicious catering packages for your private events.",
      icon: "/home/Vector-1.png",
    },
    {
      id: "/home/3.png",
      title: "Get Delivered",
      description:
        "Sit back and relax. Our team delivers fresh, chef-prepared meals directly to your door, exactly when you need them.",
      icon: "/home/Vector-2.png",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-20 bg-white ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="type-h2  text-center mb-10 tracking-tight text-gray-900">
          HOW IT WORKS
        </h2>

        {/* Main Background Container */}
        <div
          className="relative rounded-3xl overflow-hidden bg-cover bg-center min-h-[500px] flex items-center shadow-2xl"
          style={{
            backgroundImage: `url('/home/bg-image.png')`,
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
                    <img src={step.icon} alt={step.title} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="type-para leading-relaxed text-gray-600">
                    {step.description}
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
