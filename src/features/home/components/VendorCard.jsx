import { FiStar } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function VendorCard({
  image,
  name,
  slug,
  rating,
  deliveryFee,
  discount,
  hasPublicActiveMenus,
  publicActiveMenuCount,
}) {
  const navigate = useNavigate();

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate(`/vendor/${slug}`)}
    >
      <div className="overflow-hidden rounded-[22px] bg-[#f2f2f2]">
        <img
          src={image}
          alt={name}
          className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-3">
        <h3 className="type-h4 truncate text-[#191919]">{name}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      {deliveryFee ? (
        <div className="type-subpara mt-1 flex items-center gap-1.5 text-[#666]">
          <LiaBicycleSolid className="text-[12px] text-[#888]" />
          <span>{deliveryFee}</span>
        </div>
      ) : null}

      {discount ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff1eb] px-2 py-1 text-[#ff6a3d]">
          {discount}
        </div>
      ) : null}

      {hasPublicActiveMenus ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#edf8ef] px-2 py-1 text-[#2c8b52]">
          {publicActiveMenuCount} Menus Available
        </div>
      ) : (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff6e8] px-2 py-1 text-[#b36a1e]">
          No Active Menus Currently
        </div>
      )}
    </article>
  );
}
