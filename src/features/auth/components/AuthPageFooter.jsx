import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AuthPageFooter({
  prompt,
  actionLabel,
  actionTo,
  actionState,
  secondaryLabel,
  secondaryTo = "/",
  secondaryHref,
}) {
  const { t } = useTranslation();
  const resolvedSecondaryLabel =
    secondaryLabel ?? t("auth.footer.imCaterer");

  return (
    <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] text-[#6f665f]">
        {prompt}{" "}
        <Link to={actionTo} state={actionState} className="font-semibold text-[#c85f33]">
          {actionLabel}
        </Link>
      </p>
      {secondaryHref ? (
        <a href={secondaryHref} className="text-[15px] font-semibold text-[#c85f33]">
          {resolvedSecondaryLabel}
        </a>
      ) : (
        <Link to={secondaryTo} className="text-[15px] font-semibold text-[#c85f33]">
          {resolvedSecondaryLabel}
        </Link>
      )}
    </div>
  );
}
