import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface GradientFabButtonProps {
  onPress: () => void;
  iconName: string;
  iconSize?: number;
  iconColor?: string;
  size?: 'small' | 'medium' | 'large';
  colors?: string[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  disabled?: boolean;
}

const GradientFabButton: React.FC<GradientFabButtonProps> = ({
  onPress,
  iconName,
  iconSize = 28,
  iconColor = '#FFFFFF',
  size = 'medium',
  colors = ['#2E6F9E', '#51B1C0'],
  position = 'bottom-right',
  className = '',
  disabled = false,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 48, height: 48, borderRadius: 24 },
          iconSize: 20,
        };
      case 'large':
        return {
          container: { width: 64, height: 64, borderRadius: 32 },
          iconSize: 32,
        };
      default: // medium
        return {
          container: { width: 56, height: 56, borderRadius: 28 },
          iconSize: 28,
        };
    }
  };

  const getPositionStyles = () => {
    const basePosition = {
      position: 'absolute' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    };

    switch (position) {
      case 'bottom-left':
        return { ...basePosition, bottom: 24, left: 24 };
      case 'top-right':
        return { ...basePosition, top: 24, right: 24 };
      case 'top-left':
        return { ...basePosition, top: 24, left: 24 };
      default: // bottom-right
        return { ...basePosition, bottom: 24, right: 24 };
    }
  };

  const sizeStyles = getSizeStyles();
  const positionStyles = getPositionStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, sizeStyles.container, positionStyles]}
      activeOpacity={0.8}
      disabled={disabled}
      className={className}
    >
      <LinearGradient
        colors={colors}
        style={[styles.gradient, sizeStyles.container]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
      </LinearGradient>
    </TouchableOpacity>
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
});

export default GradientFabButton;
