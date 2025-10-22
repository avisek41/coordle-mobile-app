import React from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientProgressBarProps {
  percentage: number;
  colors?: string[];
  height?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  borderRadius?: number;
}

const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  percentage,
  colors = ['#2E6F9E', '#51B1C0'],
  height = 4,
  backgroundColor = '#E5E7EB',
  style,
  borderRadius = 999,
}) => {
  return (
    <LinearGradient
      colors={[backgroundColor, backgroundColor]}
      style={[
        {
          width: '100%',
          height: height,
          borderRadius: borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <LinearGradient
        colors={colors}
        style={{
          width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          height: '100%',
          borderRadius: borderRadius,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </LinearGradient>
  );
};

export default GradientProgressBar;