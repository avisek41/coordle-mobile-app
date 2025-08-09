import React from 'react';
import { TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { Colors } from '@/src/configs/CustomTheme';
import { useUploadProfilePhotoMutation } from '@/src/services';

interface PhotoPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onUploadStart?: () => void;
  onUploadSuccess?: (profilePhotoUrl: string) => void;
  onUploadError?: (error: string) => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({
  isVisible,
  onClose,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploadProfilePhoto, { isLoading: isUploading }] =
    useUploadProfilePhotoMutation();

  const handleImageUpload = async (
    imageUri: string,
    mimeType: string,
    fileName: string,
  ) => {
    try {
      onUploadStart?.(); // Notify parent that upload is starting

      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: imageUri,
        type: mimeType,
        name: fileName,
      } as any);

      const response = await uploadProfilePhoto(formData).unwrap();

      if (response.success) {
        onUploadSuccess?.(response.data.profilePhotoUrl);
        onClose();
      } else {
        onUploadError?.(response.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      onUploadError?.(error?.data?.message || 'Failed to upload photo');
    }
  };

  const handleSelectFromGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      includeBase64: false,
      compressImageQuality: 0.8,
    })
      .then((image: any) => {
        const fileName = `profile_photo_${Date.now()}.jpg`;
        handleImageUpload(image.path, image.mime, fileName);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.error('Gallery picker error:', error);
          Alert.alert('Error', 'Failed to select image from gallery');
        }
      });
  };

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
      includeBase64: false,
      compressImageQuality: 0.8,
    })
      .then((image: any) => {
        const fileName = `profile_photo_${Date.now()}.jpg`;
        handleImageUpload(image.path, image.mime, fileName);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.error('Camera error:', error);
          Alert.alert('Error', 'Failed to take photo');
        }
      });
  };
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay Background */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Bottom Sheet Container */}
        <Box className="absolute bottom-0 left-0 right-0">
          <TouchableOpacity activeOpacity={1}>
            <Box className="bg-white rounded-t-3xl px-6 pb-12 pt-8">
              {/* Handle Bar */}
              <Box className="w-12 h-1 bg-gray-300 rounded-full self-center mb-8" />

              {/* Options Container */}
              <Box className="py-3">
                <HStack className="justify-center" space="4xl">
                  {/* Gallery Option */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleSelectFromGallery}
                    activeOpacity={0.7}
                    disabled={isUploading}
                  >
                    <Box
                      className="w-16 h-16 
                     rounded-2xl justify-center items-center
                     
                    "
                    >
                      <MaterialIcons name="folder" size={32} color="#51B1C0" />
                    </Box>
                  </TouchableOpacity>

                  {/* Camera Option */}
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleTakePhoto}
                    activeOpacity={0.7}
                    disabled={isUploading}
                  >
                    <Box
                      className="w-16 h-16 
                     rounded-2xl justify-center items-center border-1 border-gray-500"
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={32}
                        color="#51B1C0"
                      />
                    </Box>
                  </TouchableOpacity>
                </HStack>
              </Box>
            </Box>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionButton: {
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 10,
  },
});

export default PhotoPicker;
