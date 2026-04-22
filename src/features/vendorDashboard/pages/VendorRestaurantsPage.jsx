import { FiMapPin, FiPackage, FiPlusCircle } from "react-icons/fi";
import { vendorRestaurants } from "../data/vendorDashboardData";

function getRestaurantStatusClasses(status) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "active") {
    return "bg-[#eff9ef] text-[#269847]";
  }

  if (normalizedStatus === "busy") {
    return "bg-[#fff3e8] text-[#c6792b]";
  }

  return "bg-[#f2f2f2] text-[#676767]";
}

export default function VendorRestaurantsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="type-h3 text-[#191919]">Restaurants</h1>
          <p className="mt-2 text-sm text-[#5f5f5f]">
            Manage your restaurant listings, activity, and availability.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#cf5c2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b84f26]"
        >
          <FiPlusCircle className="text-[18px]" />
          <span>Add Restaurant</span>
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {vendorRestaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="rounded-[28px] border border-[#dad4ce] bg-white p-5 shadow-[0_10px_28px_rgba(32,32,32,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1f1f1f]">
                  {restaurant.name}
                </h2>
                <p className="mt-1 text-sm text-[#7d746b]">
                  {restaurant.cuisine}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getRestaurantStatusClasses(restaurant.status)}`}
              >
                {restaurant.status}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[#faf7f3] px-4 py-3">
                <FiPackage className="text-[17px] text-[#cf5c2f]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-[#8f867d]">
                    Orders
                  </p>
                  <p className="text-sm font-semibold text-[#232323]">
                    {restaurant.orders} active bookings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-[#faf7f3] px-4 py-3">
                <FiMapPin className="text-[17px] text-[#cf5c2f]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-[#8f867d]">
                    Address
                  </p>
                  <p className="text-sm font-semibold text-[#232323]">
                    {restaurant.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-2xl border border-[#d8d0c8] px-4 py-3 text-sm font-semibold text-[#242424] transition hover:bg-[#faf7f3]"
              >
                View Details
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-[#1f1f1f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
              >
                Edit Listing
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
