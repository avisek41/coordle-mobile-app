import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { images } from '@/src/assets';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NoDataProps {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
  buttonText?: string;
  onButtonPress?: () => void;
  showButton?: boolean;
  imageSize?: number;
  className?: string;
  isIcon?: boolean;
  iconName?: string;
  iconSize?: number;
}

const NoData: React.FC<NoDataProps> = ({
  title = 'No Data Found',
  description = 'There are no items to display at the moment.',
  image = images.docs,
  buttonText,
  onButtonPress,
  showButton = false,
  imageSize = 64,
  className = '',
  isIcon = false,
  iconName = 'alert-circle',
  iconSize = 28,
}) => {
  return (
    <Box className={`flex-1 justify-center items-center px-6 ${className}`}>
      <VStack className="items-center justify-center">
        {/* Icon/Image */}
        <Box className="mb-4">
          {isIcon ? (
            <Ionicons name={iconName} size={iconSize} color="#51B1C0" />
          ) : (
            <Image
              source={image}
              className={`w-${imageSize / 4} h-${imageSize / 4}`}
              style={{ width: imageSize, height: imageSize }}
              resizeMode="contain"
            />
          )}
        </Box>

        {/* Title */}
        <Text className="text-xl font-heading text-black mb-3 text-center">
          {title}
        </Text>

        {/* Description */}
        <Text className="text-sm font-body text-gray-600 text-center mb-6 px-4">
          {description}
        </Text>

        {/* Optional Button */}
        {showButton && buttonText && onButtonPress && (
          <TouchableOpacity onPress={onButtonPress} className="w-full">
            <Box
              className="border-2 border-primary-300 rounded-xl p-6 items-center justify-center bg-gray-50"
              style={{ borderStyle: 'dashed' }}
            >
              <Text className="text-lg font-heading text-black text-center">
                {buttonText}
              </Text>
            </Box>
          </TouchableOpacity>
        )}
      </VStack>
    </Box>
  );
};

export default NoData;
