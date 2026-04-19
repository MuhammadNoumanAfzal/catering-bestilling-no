import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import VendorCard from "../components/VendorCard";
import { getVendorCollectionBySlug } from "../data/homeData";

const PAGE_SIZE = 8;

export default function VendorListingPage() {
  const { vendorType } = useParams();
  const vendorCollection = getVendorCollectionBySlug(vendorType);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setVisibleCount(PAGE_SIZE);
  }, [vendorType]);

  if (!vendorCollection) {
    return <Navigate to="/" replace />;
  }

  const { title, description, vendors } = vendorCollection;
  const visibleVendors = vendors.slice(0, visibleCount);
  const hasMore = visibleCount < vendors.length;

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8b7d70]">
              Vendors
            </p>
            <h1 className="mt-2 type-h2 text-[#191919]">{title}</h1>
            <p className="mt-2 max-w-[720px] text-[14px] leading-7 text-[#4f4f4f]">
              {description}
            </p>
          </div>

          <Link
            to="/"
            className="rounded-full border border-[#d7cec3] px-4 py-2 text-[13px] font-semibold text-[#2b2b2b] transition hover:border-[#c85f33] hover:text-[#c85f33]"
          >
            Back to home
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleVendors.map((vendor) => (
            <VendorCard key={vendor.id ?? vendor.name} {...vendor} />
          ))}
        </div>

        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((current) =>
                  Math.min(current + PAGE_SIZE, vendors.length),
                )
              }
              className="rounded-full bg-[#c85f33] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#b6542c]"
            >
              Show 8 more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
