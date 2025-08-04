import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { images } from '@/src/assets';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  onBackPress?: () => void;
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  onBackPress,
  showBackButton = true,
  title,
}) => {
  return (
    <HStack className="items-center  px-4 py-3">
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
      )}

      {/* Logo */}
      <Box className="flex-1 items-center">
        <Image
          source={images.appLogo}
          className="w-24 h-8"
          resizeMode="contain"
        />
      </Box>

      {/* Spacer to balance the layout */}
      {showBackButton && <Box className="w-10 h-10" />}
    </HStack>
  );
};

export default Header;
