import { useState } from 'react';
import { useGetCurrentUserProfileQuery, useUploadProfilePhotoMutation } from '@/src/services';

interface UseProfilePhotoProps {
  onUploadSuccess?: (profilePhotoUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export const useProfilePhoto = ({
  onUploadSuccess,
  onUploadError,
}: UseProfilePhotoProps = {}) => {
  const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const [uploadProfilePhoto] = useUploadProfilePhotoMutation();

  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetCurrentUserProfileQuery();

  const userData = userProfile?.data;
  const userName = userData?.preferredName || userData?.firstName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const profilePhoto = userData?.profilePhoto;

  const handleOpenPhotoPicker = () => {
    setIsPhotoPickerVisible(true);
  };

  const handleClosePhotoPicker = () => {
    setIsPhotoPickerVisible(false);
  };

  const handleImageSelected = async (imageData: {
    uri: string;
    mimeType: string;
    fileName: string;
  }) => {
    try {
      setIsPhotoUploading(true);

      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: imageData.uri,
        type: imageData.mimeType,
        name: imageData.fileName,
      } as any);

      const response = await uploadProfilePhoto(formData).unwrap();

      if (response.success) {
        setIsPhotoUploading(false);
        onUploadSuccess?.(response.data.profilePhotoUrl);
        refetch(); // Refetch user profile to update UI
      } else {
        setIsPhotoUploading(false);
        onUploadError?.(response.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      setIsPhotoUploading(false);
      onUploadError?.(error?.data?.message || 'Failed to upload photo');
    }
  };

  const handleUploadError = (error: string) => {
    setIsPhotoUploading(false);
    onUploadError?.(error);
  };

  return {
    // Profile data
    userProfile,
    userData,
    userName,
    userInitial,
    profilePhoto,
    isLoadingProfile,

    // Photo picker state
    isPhotoPickerVisible,
    isPhotoUploading,

    // Handlers
    handleOpenPhotoPicker,
    handleClosePhotoPicker,
    handleImageSelected,
    handleUploadError,
    refetch,
  };
};
