import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { TextStyle } from 'react-native';

interface GradientTextProps {
  text: string;
  textStyle?: TextStyle;
  colors?: string[];
}

const GradientText: React.FC<GradientTextProps> = ({ text, textStyle, colors = ['#2E6F9E', '#51B1C0'] }) => {
  return (
    <MaskedView
      maskElement={
        <Text
          style={{
            fontSize: textStyle?.fontSize || 16,
            fontWeight: textStyle?.fontWeight || '500',
            color: 'black', // Mask color (black shows gradient)
            textAlign: textStyle?.textAlign || 'center',
            fontFamily: textStyle?.fontFamily || 'AvenirLTPro-Medium',
          }}>
          {text}
        </Text>
      }>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text
          style={{
            opacity: 0, // Hide original text, only show gradient
            fontSize: textStyle?.fontSize || 16,
            fontWeight: textStyle?.fontWeight || '500',
            textAlign: textStyle?.textAlign || 'center',
            fontFamily: textStyle?.fontFamily || 'AvenirLTPro-Medium',
          }}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;