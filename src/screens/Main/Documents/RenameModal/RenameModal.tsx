import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { GradientButton } from '@/src/components';
import { renameModalStrings } from './strings';
import { Document, TripDocument } from '@/src/services';
import { Colors } from '@/src/configs/CustomTheme';

interface RenameModalProps {
  isVisible: boolean;
  onClose: () => void;
  document: (Document | TripDocument) | null;
  onRename: (documentId: string, newTitle: string) => void;
  isLoading?: boolean;
}

const RenameModal: React.FC<RenameModalProps> = ({
  isVisible,
  onClose,
  document,
  onRename,
  isLoading = false,
}) => {
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (document && isVisible) {
      // Remove file extension for editing
      const nameWithoutExtension =
        document.originalFileName || document.fileName.replace(/\.[^/.]+$/, '');
      setFileName(nameWithoutExtension);
    }
  }, [document, isVisible]);

  const handleRename = () => {
    if (document && fileName.trim()) {
      // Add back the file extension
      const fileExtension =
        document.originalFileName || document.fileName.split('.').pop();
      const newFileName = `${fileName.trim()}.${fileExtension}`;
      onRename(document._id, newFileName);
    }
  };

  const handleCancel = () => {
    setFileName('');
    onClose();
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop() || '';
  };

  return (
    <Modal
      key={document?._id || 'rename-modal'}
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <Box className="bg-white rounded-2xl w-full max-w-sm p-6">
          {/* Title */}
          <Text className="font-heading text-lg text-black text-center mb-4">
            {renameModalStrings.title}
          </Text>

          {/* Input Field */}
          <Box className="mb-6">
            <Input className="bg-gray-50 rounded-lg">
              <InputField
                value={fileName}
                onChangeText={setFileName}
                placeholder={renameModalStrings.placeholder}
                autoFocus={true}
                selectTextOnFocus={true}
                className="text-base"
              />
            </Input>
            {document && (
              <Text className="font-body text-xs text-gray-500 mt-1">
                File extension: .{getFileExtension(document.originalFileName)}
              </Text>
            )}
          </Box>

          {/* Action Buttons */}
          <HStack className="justify-between">
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              <Text className="font-body text-primary-500 text-center text-base">
                {renameModalStrings.cancel}
              </Text>
            </TouchableOpacity>

            {/* Rename Button */}

            <GradientButton
              title={renameModalStrings.rename}
              onPress={handleRename}
              style={styles.confirmButton}
              gradientStyle={styles.gradientStyle}
              loading={isLoading}
              disabled={!fileName.trim() || isLoading}
            />
          </HStack>
        </Box>
      </View>
    </Modal>
  );
};

export default RenameModal;

const styles = StyleSheet.create({
  cancelButton: {
    height: 40,
    width: '40%',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  confirmButton: {
    marginTop: 0,
    height: 40,
    width: '40%',
  },
  gradientStyle: {
    height: 40,
  },
});
