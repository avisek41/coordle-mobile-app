import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text as GluestackText } from '@/components/ui/text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Loader, PhotoPicker } from '@/src/components';
import { useProfilePhoto } from '@/src/hooks/useProfilePhoto';
import { ProfilePhoto } from '@/src/services';

interface ProfileAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showEditButton?: boolean;
  onUploadSuccess?: (profilePhotoUrl: string) => void;
  onUploadError?: (error: string) => void;
  profilePhoto?: string;
  userInitial?: string;
  isUploading?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  size = 'medium',
  showEditButton = true,
  onUploadSuccess,
  onUploadError,
  profilePhoto: externalProfilePhoto,
  userInitial: externalUserInitial,
  isUploading: externalIsUploading,
}) => {
  const {
    userInitial: hookUserInitial,
    profilePhoto: hookProfilePhoto,
    isPhotoPickerVisible,
    isPhotoUploading: hookIsUploading,
    handleOpenPhotoPicker,
    handleClosePhotoPicker,
    handleImageSelected,
    handleUploadError,
  } = useProfilePhoto({ onUploadSuccess, onUploadError });

  // Use external props if provided, otherwise use hook values
  const profilePhoto = externalProfilePhoto || hookProfilePhoto;
  const userInitial = externalUserInitial || hookUserInitial;
  const isUploading =
    externalIsUploading !== undefined ? externalIsUploading : hookIsUploading;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          avatar: { width: 50, height: 50, borderRadius: 25 },
          edit: { width: 6, height: 6 },
          text: 'text-lg',
          editIcon: 12,
        };
      case 'large':
        return {
          avatar: { width: 100, height: 100, borderRadius: 50 },
          edit: { width: 10, height: 10 },
          text: 'text-5xl',
          editIcon: 20,
        };
      default: // medium
        return {
          avatar: { width: 76, height: 76, borderRadius: 38 },
          edit: { width: 8, height: 8 },
          text: 'text-4xl',
          editIcon: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  console.log('profilePhoto', profilePhoto);

  return (
    <>
      <Box className="relative">
        {isUploading ? (
          <Box
            style={[styles.avatarContainer, sizeStyles.avatar]}
            className="justify-center items-center bg-gray-100"
          >
            <Loader />
          </Box>
        ) : (
            typeof profilePhoto === 'string'
              ? profilePhoto?.length > 0
              : profilePhoto?.url
          ) ? (
          <Image
            source={{
              uri:
                typeof profilePhoto === 'string'
                  ? profilePhoto
                  : profilePhoto?.url,
            }}
            style={[styles.avatarContainer, sizeStyles.avatar]}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#2E6F9E', '#51B1C0']}
            style={[styles.avatarContainer, sizeStyles.avatar]}
          >
            <GluestackText
              className={`${sizeStyles.text} font-heading text-white`}
            >
              {userInitial}
            </GluestackText>
          </LinearGradient>
        )}

        {showEditButton && (
          <TouchableOpacity
            style={[
              styles.editButton,
              sizeStyles.edit,
              {
                width: sizeStyles.edit.width * 4,
                height: sizeStyles.edit.height * 4,
                borderRadius: sizeStyles.edit.width * 2,
              },
            ]}
            className="absolute bottom-0 right-0 bg-primary-500 justify-center items-center border-2 border-white"
            onPress={handleOpenPhotoPicker}
            disabled={isUploading}
          >
            <MaterialIcons
              name="mode-edit"
              size={sizeStyles.editIcon}
              color="white"
            />
          </TouchableOpacity>
        )}
      </Box>

      {showEditButton && (
        <PhotoPicker
          isVisible={isPhotoPickerVisible}
          onClose={handleClosePhotoPicker}
          onImageSelected={handleImageSelected}
          onError={handleUploadError}
          cropping={true}
          cropperCircleOverlay={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    // Base styles for edit button - size will be dynamic
  },
});

export default ProfileAvatar;
