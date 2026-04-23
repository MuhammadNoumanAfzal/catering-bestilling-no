import { FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { vendorRestaurants } from "../data/vendorDashboardData";

function RatingRow({ rating, reviewCount }) {
  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#7a746e]">
      <div className="flex items-center gap-0.5 text-[#f4b400]">
        {Array.from({ length: 5 }, (_, index) => (
          <FiStar key={index} className="fill-current text-[11px]" />
        ))}
      </div>
      <span className="font-semibold text-[#6c655f]">{rating.toFixed(1)}</span>
      <span>({reviewCount})</span>
    </div>
  );
}

export default function VendorRestaurantsPage() {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h1 className="type-h2 text-[#191919]">Saved Restaurants</h1>
          <p className="mt-2 text-sm text-[#5f5f5f]">
            View all your saved restaurants that you like to order again
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 cursor-pointer">
        {vendorRestaurants.map((restaurant) => (
          <article
            key={restaurant.id}
            className="overflow-hidden rounded-[18px] border border-[#ddd7d1] bg-white shadow-[0_10px_24px_rgba(32,32,32,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(32,32,32,0.1)]"
          >
            <div className="relative">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                aria-label="Saved restaurant"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-[#f15b4f] shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
              >
                <FiHeart className="fill-current text-[15px]" />
              </button>
            </div>

            <div className="px-4 py-3">
              <h2 className="text-base font-semibold text-[#242424]">
                {restaurant.name}
              </h2>
              <RatingRow
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
              />
              <Link
                to={`/vendor/${restaurant.slug}`}
                className="mt-2 inline-flex text-sm font-medium text-[#5d7dff] transition hover:text-[#355df3]"
              >
                View Menu
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
