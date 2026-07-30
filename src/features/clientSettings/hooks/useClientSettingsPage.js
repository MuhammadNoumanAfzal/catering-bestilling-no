import { useEffect, useMemo, useState } from "react";
import {
  showAuthErrorAlert,
  showSuccessToast,
} from "../../../utils/alerts";
import { readSavedSettings, writeSavedSettings } from "../../../utils/customerProfileStorage";
import { clientSettingsInitialState } from "../constants/clientSettingsForm";
import {
  fetchClientSettingsProfile,
  updateClientSettingsProfile,
} from "../api/clientSettingsService";

function readInitialClientSettings() {
  const savedSettings = readSavedSettings();

  return {
    ...clientSettingsInitialState,
    newOrders:
      savedSettings.newOrders ?? clientSettingsInitialState.newOrders,
    orderUpdates:
      savedSettings.orderUpdates ?? clientSettingsInitialState.orderUpdates,
    reviewsAndRatings:
      savedSettings.reviewsAndRatings ?? clientSettingsInitialState.reviewsAndRatings,
    promotionsAndTips:
      savedSettings.promotionsAndTips ?? clientSettingsInitialState.promotionsAndTips,
    emailNotifications:
      savedSettings.emailNotifications ?? clientSettingsInitialState.emailNotifications,
    smsEnabled:
      savedSettings.smsEnabled ?? clientSettingsInitialState.smsEnabled,
    pushEnabled:
      savedSettings.pushEnabled ?? clientSettingsInitialState.pushEnabled,
    orderAlertsEnabled:
      savedSettings.orderAlertsEnabled ?? clientSettingsInitialState.orderAlertsEnabled,
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
            error?.message || "Unable to load your notification settings.",
            "Settings load failed",
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
        error?.message || "Unable to save your notification settings.",
        "Settings update failed",
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
    updateField,
  };
}
