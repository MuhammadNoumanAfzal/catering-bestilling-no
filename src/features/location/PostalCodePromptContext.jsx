import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";
import { showAuthErrorAlert } from "../../utils/alerts";
import { isVendorAvailableForPostalCode } from "../vendor/services";

const noop = () => false;

const PostalCodePromptContext = createContext({
  requirePostalCodeForMenu: noop,
  openPostalCodePrompt: noop,
});

function normalizePostalCode(value) {
  return `${value ?? ""}`.replace(/\D/g, "").slice(0, 5);
}

function isValidPostalCode(value) {
  return /^\d{4,5}$/.test(`${value ?? ""}`.trim());
}

function hasSelectedLocation(value) {
  return Boolean(`${value ?? ""}`.trim());
}

async function showUnavailableMessage(t) {
  await showAuthErrorAlert(
    t("home.menuUnavailableInArea", {
      defaultValue: "This menu is not available in your area.",
    }),
    t("home.menuUnavailableInAreaTitle", {
      defaultValue: "Unavailable in your area",
    }),
  );
}

export function PostalCodePromptProvider({ children }) {
  const { t } = useTranslation();
  const { locationValue, setLocationValue } = useBrowseFilters();
  const [promptState, setPromptState] = useState(null);
  const [draftPostalCode, setDraftPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");

  const closePrompt = useCallback(() => {
    setPromptState(null);
    setDraftPostalCode("");
    setPostalCodeError("");
  }, []);

  const continueIfAvailable = useCallback(
    async ({ vendor, postalCode, onAvailable }) => {
      if (vendor && postalCode && !isVendorAvailableForPostalCode(vendor, postalCode)) {
        await showUnavailableMessage(t);
        return false;
      }

      onAvailable?.(postalCode);
      return true;
    },
    [t],
  );

  const requirePostalCodeForMenu = useCallback(
    ({ vendor = null, onAvailable } = {}) => {
      if (hasSelectedLocation(locationValue)) {
        const activePostalCode = normalizePostalCode(locationValue);

        if (activePostalCode && vendor && !isVendorAvailableForPostalCode(vendor, activePostalCode)) {
          showUnavailableMessage(t);
          return false;
        }

        onAvailable?.(activePostalCode || locationValue.trim());
        return true;
      }

      setPromptState({ vendor, onAvailable });
      setDraftPostalCode("");
      setPostalCodeError("");
      return false;
    },
    [locationValue, t],
  );

  const openPostalCodePrompt = useCallback(
    (options = {}) => {
      setPromptState(options);
      setDraftPostalCode("");
      setPostalCodeError("");
    },
    [],
  );

  const handleSubmit = async () => {
    const nextPostalCode = normalizePostalCode(draftPostalCode);

    if (!isValidPostalCode(nextPostalCode)) {
      setPostalCodeError(t("home.postalCodeValidation"));
      return;
    }

    setLocationValue(nextPostalCode);

    const didContinue = await continueIfAvailable({
      vendor: promptState?.vendor,
      postalCode: nextPostalCode,
      onAvailable: promptState?.onAvailable,
    });

    if (didContinue) {
      closePrompt();
    }
  };

  const contextValue = useMemo(
    () => ({
      openPostalCodePrompt,
      requirePostalCodeForMenu,
    }),
    [openPostalCodePrompt, requirePostalCodeForMenu],
  );

  return (
    <PostalCodePromptContext.Provider value={contextValue}>
      {children}
      {promptState ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[430px] rounded-[18px] bg-[#fffaf6] p-6 text-center shadow-[0_28px_70px_rgba(28,18,12,0.24)]">
            <h2 className="text-[24px] font-extrabold text-[#241815]">
              {t("home.postalCodePromptTitle", {
                defaultValue: "Enter your postal code",
              })}
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#6f6258]">
              {t("home.menuPostalCodePromptMessage", {
                defaultValue:
                  "Please enter your postal code to check if this menu is available in your area.",
              })}
            </p>
            <input
              autoFocus
              inputMode="numeric"
              type="text"
              value={draftPostalCode}
              onChange={(event) => {
                setDraftPostalCode(event.target.value.replace(/\D/g, "").slice(0, 5));
                if (postalCodeError) {
                  setPostalCodeError("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder={t("home.postalCodePlaceholder")}
              className="mt-5 h-12 w-full rounded-xl border border-[#e7d8cd] bg-white px-4 text-center text-[16px] font-semibold text-[#241815] outline-none placeholder:font-normal placeholder:text-[#b6a79c] focus:border-[#d46f38]"
            />
            {postalCodeError ? (
              <p className="mt-2 text-sm font-medium text-[#b6542c]">
                {postalCodeError}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl bg-[#d46f38] px-6 text-[15px] font-bold text-white transition hover:bg-[#bf5f2d]"
              >
                {t("home.checkAvailability", {
                  defaultValue: "Check availability",
                })}
              </button>
              <button
                type="button"
                onClick={closePrompt}
                className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-xl border border-[#e7d8cd] bg-white px-5 text-[15px] font-bold text-[#6f6258] transition hover:border-[#d46f38] hover:text-[#bf5f2d]"
              >
                {t("common.cancel", { defaultValue: "Cancel" })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PostalCodePromptContext.Provider>
  );
}

export function usePostalCodePrompt() {
  return useContext(PostalCodePromptContext);
}