import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/src/configs/CustomTheme';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = Colors.primary,
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader;
