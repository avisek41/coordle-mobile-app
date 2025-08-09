import React from 'react';
import { TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/src/configs/CustomTheme';

interface PhotoPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectFromGallery: () => void;
  onTakePhoto: () => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({
  isVisible,
  onClose,
  onSelectFromGallery,
  onTakePhoto,
}) => {
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
                    onPress={onSelectFromGallery}
                    activeOpacity={0.7}
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
                    onPress={onTakePhoto}
                    activeOpacity={0.7}
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
