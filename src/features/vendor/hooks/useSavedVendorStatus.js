import { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { fetchSavedVendors, removeSavedVendor, saveVendor } from "../api";
import {
  isVendorSaved,
  toggleSavedVendor,
} from "../utils/savedVendorsStorage";

export function useSavedVendorStatus(vendor) {
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!vendor?.slug) {
      setIsSaved(false);
      return undefined;
    }

    if (!isLoggedIn) {
      setIsSaved(isVendorSaved(vendor.slug));
      return undefined;
    }

    const loadSavedState = async () => {
      try {
        const savedVendors = await fetchSavedVendors();
        const nextIsSaved = savedVendors.some(
          (savedVendor) => savedVendor.slug === vendor.slug,
        );

        if (isMounted) {
          setIsSaved(nextIsSaved);
        }
      } catch {
        if (isMounted) {
          setIsSaved(isVendorSaved(vendor.slug));
        }
      }
    };

    loadSavedState();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, vendor?.slug]);

  const toggle = async () => {
    if (!vendor?.id || !vendor?.slug) {
      return false;
    }

    if (!isLoggedIn) {
      const nextSavedState = toggleSavedVendor(vendor.slug);
      setIsSaved(nextSavedState);
      return nextSavedState;
    }

    setIsSaving(true);

    try {
      if (isSaved) {
        await removeSavedVendor(vendor.id);
        setIsSaved(false);
        return false;
      }

      await saveVendor(vendor.id);
      setIsSaved(true);
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaved,
    isSaving,
    toggle,
  };
}
