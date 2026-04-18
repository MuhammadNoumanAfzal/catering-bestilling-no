import { FiStar } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";

export function ProductItem({
  image,
  name,
  rating,
  deliveryTime,
  deliveryFee,
  discount,
}) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-[18px] bg-[#f2f2f2]">
        <img
          src={image}
          alt={name}
          className="h-[168px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <h3 className="type-h4 truncate text-[#191919]">{name}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="type-subpara mt-1 flex items-center gap-1.5 text-[#666]">
        <span>{deliveryTime}</span>
        <LiaBicycleSolid className="text-[11px] text-[#888]" />
        <span>{deliveryFee}</span>
      </div>

      {discount ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff1eb] px-2 py-1 text-[#ff6a3d]">
          {discount}
        </div>
      ) : null}
    </article>
  );
}

export default function ProductShowcaseSection({ title, products }) {
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductItem key={product.id ?? product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
