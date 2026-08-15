import { useMemo } from "react";
import ClientProfilePhotoSection from "../../../clientSettings/components/ClientProfilePhotoSection";

export default function VendorProfilePhotoSection({
  formState,
  isUploading,
  onRemoveAvatar,
  onUploadAvatar,
}) {
  const normalizedFormState = useMemo(
    () => ({
      fullName:
        formState.fullName ||
        [formState.firstName, formState.lastName].filter(Boolean).join(" "),
      firstName: formState.firstName,
      lastName: formState.lastName,
      email: formState.primaryEmail,
      phone: formState.mobilePhone,
      avatarUrl: formState.avatarUrl,
      avatarThumbnailUrl: formState.avatarThumbnailUrl,
      profileCompletionPercent: formState.profileCompletionPercent,
    }),
    [formState],
  );

  return (
    <ClientProfilePhotoSection
      formState={normalizedFormState}
      isUploading={isUploading}
      onRemoveAvatar={onRemoveAvatar}
      onUploadAvatar={onUploadAvatar}
    />
  );
}
