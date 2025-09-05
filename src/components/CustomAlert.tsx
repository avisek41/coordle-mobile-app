import React from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import GradientButton from './GradientButton';
import { Colors } from '../configs/CustomTheme';

export interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  isDestructive?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  isDestructive = false,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Box className="flex-1 justify-center items-center bg-black/50">
        <Box className="bg-white rounded-2xl mx-6 p-6 w-full max-w-sm">
          {/* Title and Message */}
          <VStack className="mb-6">
            <Text className="text-xl font-heading text-gray-900  mb-2">
              {title}
            </Text>
            <Text className="text-sm font-body text-gray-600  leading-5">
              {message}
            </Text>
          </VStack>

          {/* Action Buttons */}
          <HStack className="justify-between">
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
              activeOpacity={0.8}
            >
              <Text className="text-primary-500 font-heading text-base">
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Confirm Button */}

            <GradientButton
              title={confirmText}
              onPress={handleConfirm}
              style={styles.confirmButton}
              gradientStyle={styles.gradientStyle}
              textStyle={styles.confirmButtonText}
            />
          </HStack>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    height: 40,
    width: '40%',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    marginTop: 0,
    height: 40,
    width: '40%',
  },
  gradientStyle: {
    height: 40,
  },
  confirmButtonText: {
    fontSize: 16,
  },
});

export default CustomAlert;
