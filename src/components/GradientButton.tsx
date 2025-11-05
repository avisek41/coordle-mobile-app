import { Text } from '@/components/ui/text';
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../configs/CustomTheme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  colors?: string[];
  style?: ViewStyle;
  gradientStyle?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  colors = [Colors.progressBarColor, Colors.primary],
  style,
  gradientStyle,
  textStyle,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        style,
        { opacity: disabled || loading ? 0.5 : 1 },
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={colors}
        style={[styles.gradient, gradientStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text className="font-heading" style={[styles.text, textStyle]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 50,
  },
  text: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default GradientButton;
