import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { Text as GluestackText, Box, HStack } from '@/components/ui';

import { Colors } from '@/src/configs/CustomTheme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  containerStyle?: any;
  titleStyle?: any;
  backButtonStyle?: any;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  containerStyle,
  titleStyle,
  backButtonStyle,
  iconName = 'chevron-back',
  iconSize = 20,
  iconColor = '#333',
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <Box className="px-5 py-4" style={[styles.container, containerStyle]}>
      <HStack className="items-center" space="md">
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={[styles.backButton, backButtonStyle]}
            activeOpacity={0.8}
          >
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
          </TouchableOpacity>
        )}

        {/* Title */}
        <GluestackText
          className="text-xl font-heading text-gray-800 font-bold flex-1"
          style={titleStyle}
        >
          {title}
        </GluestackText>

        {/* Right Component */}
        {rightComponent && <Box>{rightComponent}</Box>}
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    // Default container styles
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
