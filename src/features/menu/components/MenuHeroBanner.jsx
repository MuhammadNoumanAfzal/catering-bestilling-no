import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function MenuHeroBanner({ vendorSlug, image, title }) {
  return (
    <div className="relative overflow-hidden rounded-t-[30px]">
      <img
        src={image}
        alt={title}
        className="h-[240px] w-full rounded-t-[30px] object-cover sm:h-[320px] lg:h-[460px]"
      />

      <Link
        to={`/vendor/${vendorSlug}`}
        className="absolute left-4 top-4 cursor-pointer rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-medium text-[#382d24] shadow"
      >
        Back
      </Link>

      <button
        type="button"
        className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-medium text-[#382d24] shadow"
      >
        <FiHeart />
        Save
      </button>
    </div>
  );
}
