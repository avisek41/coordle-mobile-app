import { useState } from 'react';
import { useGetCurrentUserProfileQuery } from '@/src/services';

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

  const handleUploadStart = () => {
    setIsPhotoUploading(true);
  };

  const handleUploadSuccess = (profilePhotoUrl: string) => {
    setIsPhotoUploading(false);
    onUploadSuccess?.(profilePhotoUrl);
    refetch(); // Refetch user profile to update UI
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
    handleUploadStart,
    handleUploadSuccess,
    handleUploadError,
    refetch,
  };
};
