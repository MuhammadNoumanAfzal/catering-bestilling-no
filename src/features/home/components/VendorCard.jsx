import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePostalCodePrompt } from "../../location/PostalCodePromptContext";

const DEFAULT_VENDOR_IMAGE = "/home/hero1.webp";

export default function VendorCard(props) {
  const {
    image,
    name,
    slug,
    rating,
    discount,
    hasPublicActiveMenus,
    publicActiveMenuCount,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { requirePostalCodeForMenu } = usePostalCodePrompt();
  const [displayImage, setDisplayImage] = useState(image || DEFAULT_VENDOR_IMAGE);

  useEffect(() => {
    setDisplayImage(image || DEFAULT_VENDOR_IMAGE);
  }, [image]);

  const handleClick = () => {
    if (!slug) {
      return;
    }

    requirePostalCodeForMenu({
      vendor: props,
      onAvailable: () => navigate(`/vendor/${slug}`),
    });
  };

  return (
    <article
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="overflow-hidden rounded-[22px] bg-[#f2f2f2]">
        <img
          src={displayImage}
          alt={name}
          className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            setDisplayImage(DEFAULT_VENDOR_IMAGE);
          }}
        />
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-3">
        <h3 className="type-h4 truncate text-[#191919]">{name}</h3>

        <div className="type-h6 flex shrink-0 items-center gap-1 text-[#2c2c2c]">
          <FiStar className="text-[12px] fill-[#f4b400] text-[#f4b400]" />
          <span>{rating}</span>
        </div>
      </div>

      {discount ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff1eb] px-2 py-1 text-[#ff6a3d]">
          {discount}
        </div>
      ) : null}

      {hasPublicActiveMenus ? (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#edf8ef] px-2 py-1 text-[#2c8b52]">
          {t("browse.menusAvailable", { count: publicActiveMenuCount })}
        </div>
      ) : (
        <div className="type-subpara mt-1.5 inline-flex items-center rounded-full bg-[#fff6e8] px-2 py-1 text-[#b36a1e]">
          {t("browse.noActiveMenus")}
        </div>
      )}
    </article>
  );
}
