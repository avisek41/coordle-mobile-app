import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { images } from '@/src/assets';
import { documentsStrings } from './strings';

// Example usage of the reusable NoData component

interface UploadDocProps {
  onUploadPress: () => void;
}

const UploadDoc: React.FC<UploadDocProps> = ({ onUploadPress }) => {
  return (
    <>
      <Box className="flex-1 justify-center items-center px-6">
        {/* Upload Document Section - Centered */}
        <TouchableOpacity onPress={onUploadPress} className="w-full">
          <Box
            className="border-2 border-primary-300 rounded-xl p-8 items-center justify-center bg-gray-50"
            style={{ borderStyle: 'dashed' }}
          >
            {/* Document Icon */}
            <Box className="mb-4">
              <Image
                source={images.docs}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </Box>

            {/* Upload Document Text */}
            <Text className="text-xl font-heading text-black mb-3 text-center">
              {documentsStrings.uploadDocument}
            </Text>

            {/* Description */}
            <Text className="text-sm font-body text-gray-600 text-center mb-2 px-4">
              {documentsStrings.uploadDescription}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </>
  );
};

export default UploadDoc;
