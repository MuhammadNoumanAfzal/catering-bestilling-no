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
import { useAuth } from "../../auth";
import { clientSettingsInitialState } from "../constants/clientSettingsForm";
import {
  fetchClientSettingsProfile,
  removeClientAvatar,
  uploadClientAvatar,
  updateClientSettingsProfile,
} from "../api/clientSettingsService";

function readInitialClientSettings() {
  const savedSettings = readSavedSettings();

  return {
    ...clientSettingsInitialState,
    ...savedSettings,
  };
}

export function useClientSettingsPage() {
  const { accessToken, setAuthSession, user } = useAuth();
  const [savedFormState, setSavedFormState] = useState(readInitialClientSettings);
  const [formState, setFormState] = useState(readInitialClientSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

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

  const syncAuthenticatedUser = (nextState) => {
    if (!accessToken || !user) {
      return;
    }

    setAuthSession({
      accessToken,
      user: {
        ...user,
        firstName: nextState.firstName || user.firstName,
        lastName: nextState.lastName || user.lastName,
        email: nextState.email || user.email,
        phone: nextState.phone || user.phone,
        avatarUrl: nextState.avatarUrl || "",
        avatarThumbnailUrl: nextState.avatarThumbnailUrl || "",
      },
    });
  };

  const handleAvatarUpload = async (file) => {
    setIsAvatarUploading(true);

    try {
      const result = await uploadClientAvatar(file, formState);
      setSavedFormState(result.formState);
      setFormState(result.formState);
      writeSavedSettings(result.formState);
      syncAuthenticatedUser(result.formState);
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error?.message || "Unable to upload your profile photo.",
        i18n.t("settings.updateErrorTitle"),
      );
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleAvatarRemove = async () => {
    setIsAvatarUploading(true);

    try {
      const result = await removeClientAvatar(formState);
      setSavedFormState(result.formState);
      setFormState(result.formState);
      writeSavedSettings(result.formState);
      syncAuthenticatedUser(result.formState);
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error?.message || "Unable to remove your profile photo.",
        i18n.t("settings.updateErrorTitle"),
      );
    } finally {
      setIsAvatarUploading(false);
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
    handleAvatarRemove,
    handleAvatarUpload,
    isAvatarUploading,
    updateField,
  };
}
