import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";
import { useAuth } from "../auth";
import { showAuthErrorAlert } from "../../utils/alerts";
import { readSavedSettings } from "../../utils/customerProfileStorage";
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

function resolveAccountPostalCode(user) {
  const savedSettings = readSavedSettings();
  const candidates = [
    user?.postCode,
    user?.postalCode,
    user?.post_code,
    user?.postal_code,
    savedSettings?.postCode,
    savedSettings?.postalCode,
  ];

  return candidates
    .map((value) => normalizePostalCode(value))
    .find((value) => isValidPostalCode(value)) || "";
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
  const { isLoggedIn, user } = useAuth();
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

  useEffect(() => {
    if (!promptState || !isLoggedIn) {
      return;
    }

    const accountPostalCode = resolveAccountPostalCode(user);

    if (!accountPostalCode) {
      return;
    }

    let isCancelled = false;

    async function continueFromAccountPostalCode() {
      setLocationValue(accountPostalCode);
      const didContinue = await continueIfAvailable({
        vendor: promptState.vendor,
        postalCode: accountPostalCode,
        onAvailable: promptState.onAvailable,
      });

      if (!isCancelled && didContinue) {
        closePrompt();
      }
    }

    continueFromAccountPostalCode();

    return () => {
      isCancelled = true;
    };
  }, [closePrompt, continueIfAvailable, isLoggedIn, promptState, setLocationValue, user]);

  const handleProceedWithoutPostalCode = useCallback(() => {
    const onAvailable = promptState?.onAvailable;
    closePrompt();
    onAvailable?.();
  }, [closePrompt, promptState]);

  const requirePostalCodeForMenu = useCallback(
    ({ vendor = null, onAvailable, mode = "openMenu", dismissButtonText } = {}) => {
      if (hasSelectedLocation(locationValue)) {
        const activePostalCode = normalizePostalCode(locationValue);

        if (activePostalCode && vendor && !isVendorAvailableForPostalCode(vendor, activePostalCode)) {
          showUnavailableMessage(t);
          return false;
        }

        onAvailable?.(activePostalCode || locationValue.trim());
        return true;
      }

      const savedPostalCode = readSavedSettings()?.postCode;
      const accountPostalCode = normalizePostalCode(user?.postCode || savedPostalCode);

      if (isLoggedIn && isValidPostalCode(accountPostalCode)) {
        setLocationValue(accountPostalCode);

        if (vendor && !isVendorAvailableForPostalCode(vendor, accountPostalCode)) {
          showUnavailableMessage(t);
          return false;
        }

        onAvailable?.(accountPostalCode);
        return true;
      }

      setPromptState({ vendor, onAvailable, mode, dismissButtonText });
      setDraftPostalCode("");
      setPostalCodeError("");
      return false;
    },
    [isLoggedIn, locationValue, setLocationValue, t, user],
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

  const dismissButtonText = useMemo(() => {
    if (promptState?.dismissButtonText) {
      return promptState.dismissButtonText;
    }
    if (promptState?.mode === "addToCart") {
      return t("home.continueAnyway", { defaultValue: "Fortsett likevel" });
    }
    return t("home.viewMenuAnyway", { defaultValue: "Se meny likevel" });
  }, [promptState, t]);

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
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1f1711]/60 px-4 backdrop-blur-[3px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closePrompt();
            }
          }}
        >
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#eadfd5] bg-[#fffaf6] p-6 text-left shadow-[0_24px_64px_rgba(28,18,12,0.22)] sm:p-7">
            <button
              type="button"
              onClick={handleProceedWithoutPostalCode}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd5] bg-white text-[#7a6c62] shadow-sm transition hover:border-[#d46f38] hover:bg-[#fff4ed] hover:text-[#bf5f2d]"
              aria-label={t("common.close", { defaultValue: "Lukk" })}
              title={dismissButtonText}
            >
              <FiX className="text-[18px]" />
            </button>

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e9] text-[#d46f38] shadow-[0_8px_20px_rgba(212,111,56,0.14)]">
              <FiMapPin className="text-[22px]" />
            </div>
            <h2 className="mt-4 pr-10 text-[24px] font-extrabold leading-tight text-[#241815]">
              {t("home.postalCodePromptTitle", {
                defaultValue: "Skriv inn postnummer",
              })}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6f6258]">
              {t("home.menuPostalCodePromptMessage", {
                defaultValue:
                  "Skriv inn postnummeret ditt for å sjekke om denne menyen kan leveres til området ditt.",
              })}
            </p>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="postal-code-input"
                  className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#a36d4e]"
                >
                  {t("home.postalCodeLabel", { defaultValue: "Postnummer" })}
                </label>
                <span className="text-[12px] font-medium text-[#9c8c82]">
                  ({t("home.optional", { defaultValue: "Valgfritt" }).toLowerCase()})
                </span>
              </div>
              <input
                id="postal-code-input"
                autoFocus
                inputMode="numeric"
                type="text"
                maxLength={5}
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
                  } else if (event.key === "Escape") {
                    handleProceedWithoutPostalCode();
                  }
                }}
                placeholder={t("home.modalPostalCodePlaceholder", { defaultValue: "f.eks. 0150" })}
                className="mt-2 h-13 w-full rounded-2xl border border-[#e7d8cd] bg-white px-4 text-center text-[19px] font-bold tracking-[0.1em] text-[#241815] shadow-sm outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#b6a79c] focus:border-[#d46f38] focus:ring-4 focus:ring-[#d46f38]/12"
              />
              {postalCodeError ? (
                <p className="mt-2 rounded-xl bg-[#fff1e9] px-3.5 py-2 text-[13px] font-semibold text-[#b6542c]">
                  {postalCodeError}
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#d46f38] px-6 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(212,111,56,0.22)] transition hover:bg-[#bf5f2d] active:scale-[0.99]"
              >
                <FiSearch className="text-[17px] shrink-0" />
                <span>{t("home.checkAvailability", {
                  defaultValue: "Sjekk tilgjengelighet",
                })}</span>
              </button>
              <button
                type="button"
                onClick={handleProceedWithoutPostalCode}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[#e2d5cb] bg-white px-6 text-[15px] font-bold text-[#5c4d43] shadow-sm transition hover:border-[#d46f38] hover:bg-[#fff9f5] hover:text-[#bf5f2d] active:scale-[0.99]"
              >
                <span>{dismissButtonText}</span>
              </button>
            </div>
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={closePrompt}
                className="text-[13px] font-semibold text-[#8f8076] transition hover:text-[#241815] hover:underline"
              >
                {t("common.cancel", { defaultValue: "Avbryt" })}
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