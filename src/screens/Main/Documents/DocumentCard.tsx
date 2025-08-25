import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';

import { Document, TripDocument } from '@/src/services';
import { Colors } from '@/src/configs/CustomTheme';
import moment from 'moment';

interface DocumentCardProps {
  document: Document | TripDocument;
  onPress?: (document: Document | TripDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return moment(dateString).format('MM/DD/YYYY');
  };

  const handlePress = () => {
    if (onPress) {
      onPress(document);
    } else {
      // Default action: open the document
      Linking.openURL(document.fileUrl);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <HStack className="items-center" space="md">
        {/* Document Thumbnail or Icon */}
        <Box className="w-12 h-12 rounded-lg bg-primary-100 items-center justify-center">
          <Ionicon name="document-text" size={24} color={Colors.primary} />
        </Box>

        {/* Document Info */}
        <VStack className="flex-1 space-y-1">
          <Text className="font-body text-base text-gray-900" numberOfLines={1}>
            {document.originalFileName || document.fileName}
          </Text>
          <HStack className="items-center space-x-2">
            <Text className="font-body text-sm text-gray-500">
              {formatDate(document.updatedAt)}
            </Text>

            <Text className="font-body text-sm text-gray-500 ml-3">
              {formatFileSize(document.fileSize)}
            </Text>
          </HStack>
        </VStack>

        {/* More Options */}
        <TouchableOpacity onPress={handlePress} style={styles.moreButton}>
          <Ionicon name="ellipsis-vertical" size={21} color={Colors.darkGray} />
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  moreButton: {
    padding: 8,
  },
});

export default DocumentCard;
