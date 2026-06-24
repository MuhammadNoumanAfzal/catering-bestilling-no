import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { showAuthErrorAlert, showSuccessToast } from "../../../../utils/alerts";
import { changePassword } from "../../../auth/api";
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

function hasPasswordValues(formState) {
  return [
    formState.oldPassword,
    formState.confirmOldPassword,
    formState.newPassword,
    formState.confirmNewPassword,
  ].some((value) => `${value ?? ""}`.trim());
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
    return currentComparable !== savedComparable || hasPasswordValues(formState);
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
      const profileHasChanged =
        JSON.stringify(stripPasswordFields(formState)) !==
        JSON.stringify(savedFormState);
      const passwordHasChanged = hasPasswordValues(formState);
      const successMessages = [];

      if (profileHasChanged) {
        const result = await updateSettingsProfile(formState);
        writeSavedSettings(result.formState);
        setSavedFormState(result.formState);
        setFormState((current) => ({
          ...result.formState,
          ...getPasswordFields(),
          oldPassword: current.oldPassword,
          confirmOldPassword: current.confirmOldPassword,
          newPassword: current.newPassword,
          confirmNewPassword: current.confirmNewPassword,
        }));
        setLoadWarning("");
        successMessages.push(result.message);
      }

      if (passwordHasChanged) {
        const oldPassword = `${formState.oldPassword ?? ""}`.trim();
        const confirmOldPassword = `${formState.confirmOldPassword ?? ""}`.trim();
        const newPassword = `${formState.newPassword ?? ""}`.trim();
        const confirmNewPassword = `${formState.confirmNewPassword ?? ""}`.trim();

        if (
          !oldPassword ||
          !confirmOldPassword ||
          !newPassword ||
          !confirmNewPassword
        ) {
          throw new Error("Please complete all password fields.");
        }

        if (oldPassword !== confirmOldPassword) {
          throw new Error("Old password confirmation does not match.");
        }

        if (newPassword !== confirmNewPassword) {
          throw new Error("New password confirmation does not match.");
        }

        const passwordResult = await changePassword({
          oldPassword,
          newPassword1: newPassword,
          newPassword2: confirmNewPassword,
        });

        setFormState((current) => ({
          ...current,
          ...getPasswordFields(),
        }));
        successMessages.push(
          passwordResult.message || "Password changed successfully.",
        );
      }

      if (successMessages.length > 0) {
        await showSuccessToast(successMessages.join(" "));
      }
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
