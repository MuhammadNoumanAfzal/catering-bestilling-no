import { FiStar } from "react-icons/fi";
import { LiaBicycleSolid } from "react-icons/lia";

export default function MenuCard({ image, title, vendor, rating, price }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-[22px] bg-[#f2f2f2]">
        <img
          src={image}
          alt={title}
          className="h-[140px] md:h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-3">
        <h3 className="type-h4 line-clamp-2 text-[#191919]">{title}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      <div className="type-subpara mt-1 flex items-center gap-1.5 text-[#666]">
        <span className="truncate">{vendor}</span>
        <LiaBicycleSolid className="shrink-0 text-[12px] text-[#888]" />
        <span className="shrink-0">{price}</span>
      </div>

      <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff1eb] px-2 py-1 text-[#ff6a3d]">
        Available Now
      </div>
    </article>
  );
}
