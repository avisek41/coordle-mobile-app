import React from 'react';
import { StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';

interface GradientAvatarProps {
  userName: string;
  userImage?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  colors?: string[];
  onPress?: () => void;
  className?: string;
}

const GradientAvatar: React.FC<GradientAvatarProps> = ({
  userName,
  userImage,
  size = 'medium',
  colors = ['#2E6F9E', '#51B1C0'],
  onPress,
  className = '',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 32, height: 32, borderRadius: 16 },
          text: 'text-sm',
        };
      case 'large':
        return {
          container: { width: 60, height: 60, borderRadius: 30 },
          text: 'text-xl',
        };
      case 'xlarge':
        return {
          container: { width: 80, height: 80, borderRadius: 40 },
          text: 'text-2xl',
        };
      default: // medium
        return {
          container: { width: 40, height: 40, borderRadius: 20 },
          text: 'text-lg',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Box
      className={`justify-center items-center ${className}`}
      style={[styles.container, sizeStyles.container]}
      onTouchEnd={onPress}
    >
      {userImage ? (
        <Image
          source={{ uri: userImage }}
          style={[styles.image, sizeStyles.container]}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={colors}
          style={[styles.gradient, sizeStyles.container]}
        >
          <GluestackText
            className={`${sizeStyles.text} font-heading text-white`}
          >
            {userInitial}
          </GluestackText>
        </LinearGradient>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 20, // Will be overridden by sizeStyles
  },
});

export default GradientAvatar;
