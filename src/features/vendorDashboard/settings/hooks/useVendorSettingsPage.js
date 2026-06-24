import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import {
  readSavedSettings,
  writeSavedSettings,
} from "../../../../utils/customerProfileStorage";
import { vendorSettingsInitialState } from "../constants/settingsForm";
import {
  fetchSettingsProfile,
  updateSettingsProfile,
} from "../api";

function getPasswordFields() {
  return {
    oldPassword: "",
    confirmOldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
}

function stripPasswordFields(formState) {
  const {
    oldPassword,
    confirmOldPassword,
    newPassword,
    confirmNewPassword,
    ...rest
  } = formState;

  return rest;
}

export function useVendorSettingsPage() {
  const location = useLocation();
  const [savedFormState, setSavedFormState] = useState(() => ({
    ...vendorSettingsInitialState,
    ...readSavedSettings(),
  }));
  const [formState, setFormState] = useState(() => ({
    ...vendorSettingsInitialState,
    ...readSavedSettings(),
    ...getPasswordFields(),
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadWarning, setLoadWarning] = useState("");

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const nextSavedState = await fetchSettingsProfile();

        if (!isMounted) {
          return;
        }

        writeSavedSettings(nextSavedState);
        setSavedFormState(nextSavedState);
        setFormState({
          ...nextSavedState,
          ...getPasswordFields(),
        });
        setLoadWarning("");
      } catch {
        if (!isMounted) {
          return;
        }

        const localState = {
          ...vendorSettingsInitialState,
          ...readSavedSettings(),
        };

        setSavedFormState(localState);
        setFormState({
          ...localState,
          ...getPasswordFields(),
        });
        setLoadWarning(
          "Live settings could not be loaded. Showing your last saved local values.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const isDirty = useMemo(() => {
    const currentComparable = JSON.stringify(stripPasswordFields(formState));
    const savedComparable = JSON.stringify(savedFormState);
    return currentComparable !== savedComparable;
  }, [formState, savedFormState]);

  const updateField = (key, value) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFormState({
      ...savedFormState,
      ...getPasswordFields(),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const result = await updateSettingsProfile(formState);
      writeSavedSettings(result.formState);
      setSavedFormState(result.formState);
      setFormState({
        ...result.formState,
        ...getPasswordFields(),
      });
      setLoadWarning("");
      await showSuccessToast(result.message);
    } catch (error) {
      await showAuthErrorAlert(
        error instanceof Error
          ? error.message
          : "Unable to update your settings right now.",
        "Settings update failed",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formState,
    handleReset,
    handleSave,
    isDirty,
    isLoading,
    isSaving,
    loadWarning,
    updateField,
  };
}
