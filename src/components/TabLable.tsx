import { Text } from '@/components/ui/text';
import React from 'react';

type TabLabelProps = {
  focused: boolean;
  color: string;
  text: string;
};

export default ({ color, focused, text }: TabLabelProps) => {
  return (
    <Text
      className={`text-sm ${focused ? 'font-heading' : 'font-body'}`}
      style={{
        fontSize: 12,

        color: color,
      }}
    >
      {text}
    </Text>
  );
};
