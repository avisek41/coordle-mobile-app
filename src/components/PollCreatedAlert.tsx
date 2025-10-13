import React from 'react';
import { Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Text, VStack, Box } from '@/components/ui';

import { images } from '@/src/assets';

export interface PollCreatedAlertProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

const PollCreatedAlert: React.FC<PollCreatedAlertProps> = ({
  isOpen,
  title = '',
  subtitle = '',
  onClose,
}) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Box className="flex-1 justify-center items-center bg-black/50">
        <Box className="bg-white px-6 py-8 rounded-2xl mx-6 w-full max-w-sm shadow-lg">
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Content */}
          <VStack className="items-center">
            {/* Poll Icon */}
            <Image
              source={images.poll}
              style={{
                width: 44,
                height: 38.13,
              }}
              className='fontFamilyAvenir mb-3'
              resizeMode='contain'
            />

            {/* Title */}
            <Text className="text-xl font-bold text-black leading-5 text-center mb-4 fontFamilyAvenir">
              {title}
            </Text>

            {/* Subtitle */}
            <Text className="text-sm text-gray-600 text-center leading-5 fontFamilyAvenir">
              {subtitle}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  fontFamilyAvenir: {
    fontFamily: 'AvenirLTProRoman',
  },
});

export default PollCreatedAlert;
