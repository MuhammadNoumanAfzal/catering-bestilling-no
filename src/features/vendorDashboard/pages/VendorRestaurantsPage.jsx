import { useEffect, useMemo, useState } from "react";
import { FiHeart, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { vendorProfiles } from "../../vendor/data/vendorData";
import {
  readSavedVendorSlugs,
  toggleSavedVendor,
} from "../../vendor/utils/savedVendorsStorage";
import { showSuccessToast } from "../../../utils/alerts";

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
  const navigate = useNavigate();
  const [savedSlugs, setSavedSlugs] = useState([]);

  useEffect(() => {
    setSavedSlugs(readSavedVendorSlugs());
  }, []);

  const savedRestaurants = useMemo(
    () =>
      savedSlugs
        .map((slug) => vendorProfiles.find((vendor) => vendor.slug === slug))
        .filter(Boolean),
    [savedSlugs],
  );

  const handleToggleSaved = (event, restaurant) => {
    event.stopPropagation();

    const nextSavedState = toggleSavedVendor(restaurant.slug);
    setSavedSlugs(readSavedVendorSlugs());
    showSuccessToast(
      nextSavedState
        ? `${restaurant.name} saved successfully`
        : `${restaurant.name} removed from saved restaurants`,
    );
  };

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

      {savedRestaurants.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedRestaurants.map((restaurant) => (
            <article
              key={restaurant.slug}
              onClick={() => navigate(`/vendor/${restaurant.slug}`)}
              className="cursor-pointer overflow-hidden rounded-[18px] border border-[#ddd7d1] bg-white shadow-[0_10px_24px_rgba(32,32,32,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(32,32,32,0.1)]"
            >
              <div className="relative">
                <img
                  src={restaurant.banner}
                  alt={restaurant.name}
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(event) => handleToggleSaved(event, restaurant)}
                  aria-label={`Toggle save for ${restaurant.name}`}
                  className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/92 text-[#f15b4f] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition hover:scale-105"
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/vendor/${restaurant.slug}`);
                  }}
                  className="mt-2 inline-flex cursor-pointer text-sm font-medium text-[#5d7dff] transition hover:text-[#355df3]"
                >
                  View Menu
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[24px] border border-dashed border-[#ddd7d1] bg-white px-6 py-16 text-center shadow-[0_10px_24px_rgba(32,32,32,0.04)]">
          <h2 className="text-[24px] font-semibold text-[#242424]">
            No saved restaurants yet
          </h2>
          <p className="mt-3 text-sm text-[#6d655f]">
            Save restaurants from their detail page or menu page to see them
            here.
          </p>
        </section>
      )}
    </div>
  );
}
