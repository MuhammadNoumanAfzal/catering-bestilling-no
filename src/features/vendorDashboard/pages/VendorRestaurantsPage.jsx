import { useEffect, useMemo, useState } from "react";
import { FiHeart, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { fetchSavedVendors, removeSavedVendor } from "../../vendor/api";
import { showAuthErrorAlert, showSuccessToast } from "../../../utils/alerts";

function normalizeSavedRestaurant(vendor) {
  if (!vendor) {
    return null;
  }

  return {
    id: vendor.id ?? "",
    slug: vendor.slug ?? "",
    name: vendor.name ?? "Saved restaurant",
    banner: vendor.coverPhotoUrl ?? vendor.logoUrl ?? "",
    logo: vendor.logoUrl ?? "",
    rating: Number(vendor.rating ?? 0),
    reviewCount: Number(vendor.reviewCount ?? vendor.reviewsCount ?? 0),
  };
}

function RatingRow({ rating, reviewCount }) {
  const normalizedRating = Number(rating ?? 0);

  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#7a746e]">
      <div className="flex items-center gap-0.5 text-[#f4b400]">
        {Array.from({ length: 5 }, (_, index) => (
          <FiStar key={index} className="fill-current text-[11px]" />
        ))}
      </div>
      <span className="font-semibold text-[#6c655f]">
        {normalizedRating.toFixed(1)}
      </span>
      <span>({reviewCount})</span>
    </div>
  );
}

function RestaurantsPageStatus({ title, message, actionLabel, onAction }) {
  return (
    <section className="rounded-[24px] border border-dashed border-[#ddd7d1] bg-white px-6 py-16 text-center shadow-[0_10px_24px_rgba(32,32,32,0.04)]">
      <h2 className="text-[24px] font-semibold text-[#242424]">{title}</h2>
      <p className="mt-3 text-sm text-[#6d655f]">{message}</p>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d]"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

export default function VendorRestaurantsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSavedRestaurants() {
      if (!isLoggedIn) {
        if (isMounted) {
          setRestaurants([]);
          setError("");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const savedVendors = await fetchSavedVendors();
        const normalizedRestaurants = savedVendors
          .map(normalizeSavedRestaurant)
          .filter((vendor) => vendor?.id && vendor?.slug);

        if (isMounted) {
          setRestaurants(normalizedRestaurants);
        }
      } catch (loadError) {
        if (isMounted) {
          setRestaurants([]);
          setError(
            loadError?.message ||
              "Unable to load saved restaurants right now.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedRestaurants();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const savedRestaurants = useMemo(() => restaurants, [restaurants]);

  const handleToggleSaved = async (event, restaurant) => {
    event.stopPropagation();

    try {
      await removeSavedVendor(restaurant.id);
      setRestaurants((current) =>
        current.filter((candidate) => candidate.id !== restaurant.id),
      );
      await showSuccessToast(`${restaurant.name} removed from saved restaurants`);
    } catch (removeError) {
      await showAuthErrorAlert(
        removeError?.message || "Unable to update saved restaurants right now.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
  }

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

      {!isLoggedIn ? (
        <RestaurantsPageStatus
          title="Sign in to view saved restaurants"
          message="Your saved restaurants are linked to your account and load from the API after sign in."
        />
      ) : error ? (
        <RestaurantsPageStatus
          title="Unable to load saved restaurants"
          message={error}
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      ) : savedRestaurants.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedRestaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              onClick={() => navigate(`/vendor/${restaurant.slug}`)}
              className="cursor-pointer overflow-hidden rounded-[18px] border border-[#ddd7d1] bg-white shadow-[0_10px_24px_rgba(32,32,32,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(32,32,32,0.1)]"
            >
              <div className="relative">
                {restaurant.banner ? (
                  <img
                    src={restaurant.banner}
                    alt={restaurant.name}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-full items-center justify-center bg-[#f6efe8] px-4 text-center text-sm font-medium text-[#7b7168]">
                    {restaurant.name}
                  </div>
                )}
                <button
                  type="button"
                  onClick={(event) => handleToggleSaved(event, restaurant)}
                  aria-label={`Remove ${restaurant.name} from saved restaurants`}
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
        <RestaurantsPageStatus
          title="No saved restaurants yet"
          message="Save restaurants from their detail page or menu page to see them here."
        />
      )}
    </div>
  );
}
