import VendorCard from "./VendorCard";

export default function VendorShowcaseSection({ title, vendors }) {
  const visibleVendors = vendors.slice(0, 3);

  return (
    <section className="bg-white px-8 py-6 sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-7xl">
        {title ? (
          <div className="mb-4">
            <h2 className="type-h3 font-semibold text-[#191919] sm:text-xl">
              {title}
            </h2>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVendors.map((vendor) => (
            <VendorCard key={vendor.id ?? vendor.name} {...vendor} />
          ))}
        </div>
      </div>
    </section>
  );
}
