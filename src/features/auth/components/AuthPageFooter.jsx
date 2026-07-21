import { Link } from "react-router-dom";

export default function AuthPageFooter({
  prompt,
  actionLabel,
  actionTo,
  actionState,
  secondaryLabel = "I'm a Caterer",
  secondaryTo = "/",
  secondaryHref,
}) {
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
          {secondaryLabel}
        </a>
      ) : (
        <Link to={secondaryTo} className="text-[15px] font-semibold text-[#c85f33]">
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}
