import React from 'react';
import { Text } from 'react-native';

type TabLabelProps = {
  focused: boolean;
  color: string;
  text: string;
};

export default ({ color, focused, text }: TabLabelProps) => {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: focused ? 'bold' : 'normal',
        color: color,
      }}
    >
      {text}
    </Text>
  );
};
