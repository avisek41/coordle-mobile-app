import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PollIconProps {
  size?: number;
}

const PollIcon: React.FC<PollIconProps> = ({ size = 60 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Left bar - light blue */}
      <View style={[styles.bar, styles.leftBar, { height: size * 0.4 }]} />

      {/* Middle bar - light blue */}
      <View style={[styles.bar, styles.middleBar, { height: size * 0.6 }]} />

      {/* Right bar - red */}
      <View style={[styles.bar, styles.rightBar, { height: size * 0.8 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  leftBar: {
    backgroundColor: '#87CEEB', // Light blue
  },
  middleBar: {
    backgroundColor: '#87CEEB', // Light blue
  },
  rightBar: {
    backgroundColor: '#FF6B6B', // Red
  },
});

export default PollIcon;
