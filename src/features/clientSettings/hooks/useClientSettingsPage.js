import { useEffect, useMemo, useState } from "react";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";
import i18n from "../../../i18n";
import { writeSavedLanguage } from "../../../i18n/languagePreferences";
import {
  readSavedSettings,
  writeSavedSettings,
} from "../../../utils/customerProfileStorage";
import { clientSettingsInitialState } from "../constants/clientSettingsForm";
import {
  fetchClientSettingsProfile,
  updateClientSettingsProfile,
} from "../api/clientSettingsService";

function readInitialClientSettings() {
  const savedSettings = readSavedSettings();

  return {
    ...clientSettingsInitialState,
    emailEnabled:
      savedSettings.emailEnabled ?? clientSettingsInitialState.emailEnabled,
    smsEnabled:
      savedSettings.smsEnabled ?? clientSettingsInitialState.smsEnabled,
    pushEnabled:
      savedSettings.pushEnabled ?? clientSettingsInitialState.pushEnabled,
  };
}

export function useClientSettingsPage() {
  const [savedFormState, setSavedFormState] = useState(readInitialClientSettings);
  const [formState, setFormState] = useState(readInitialClientSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      setIsLoading(true);

      try {
        const nextState = await fetchClientSettingsProfile();

        if (!isMounted) {
          return;
        }

        setSavedFormState(nextState);
        setFormState(nextState);
        writeSavedSettings(nextState);
      } catch (error) {
        if (isMounted) {
          await showAuthErrorAlert(
            error?.message || i18n.t("settings.loadErrorMessage"),
            i18n.t("settings.loadErrorTitle"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(savedFormState),
    [formState, savedFormState],
  );

  const updateField = (key, value) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleLanguageChange = async (language) => {
    await i18n.changeLanguage(language);
    writeSavedLanguage(language);
    await showSuccessToast(i18n.t("settings.languageSaved"));
  };

  const handleReset = () => {
    setFormState(savedFormState);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const result = await updateClientSettingsProfile(formState);
      setSavedFormState(result.formState);
      setFormState(result.formState);
      writeSavedSettings(result.formState);
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error?.message || i18n.t("settings.updateErrorMessage"),
        i18n.t("settings.updateErrorTitle"),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formState,
    isDirty,
    isLoading,
    isSaving,
    handleReset,
    handleSave,
    handleLanguageChange,
    updateField,
  };
}
