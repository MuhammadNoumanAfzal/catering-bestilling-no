import React from "react";
import { FaCheck } from "react-icons/fa";

const OrderConfirmedPage = () => {
  return (
    <div className=" flex items-center justify-center bg-white px-4">
      <div className="w-full  text-center py-12 px-6">
        {/* Centered Logo */}
        <div className="flex justify-center mb-20">
          <img
            src="/home/logo.png"
            alt="logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-5 rounded-full">
            <div className="bg-green-500 rounded-full p-5">
              <FaCheck className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="type-h2 mb-4 text-black">Order Confirmed</h2>

        {/* Description */}
        <p className="text-gray-900 text-[20px] leading-relaxed mb-8">
          Your catering request has been sent. <br />
          You will receive confirmation by email shortly.
        </p>

        {/* Order ID */}
        <p className="text-2xl mb-6">
          <span className="text-[#c85f33]">Order ID: #23459</span>
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-[#c85f33] text-white cursor-pointer px-8 py-5 rounded-md type-para font-bold ">
            Back to Home
          </button>

          <button className="bg-[#d9d9d9] text-black cursor-pointer px-8 py-5 rounded-md type-para font-bold ">
            Browse Menus
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;
