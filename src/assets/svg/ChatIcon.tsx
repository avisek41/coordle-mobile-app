import React from 'react';
import { Path, Circle } from 'react-native-svg';
import SvgIcon from '../../components/SvgIcon';

interface ChatIconProps {
  size?: number;
  color?: string;
}

const ChatIcon: React.FC<ChatIconProps> = ({
  size = 24,
  color = '#6264A7',
}) => {
  return (
    <SvgIcon size={size} color={color} viewBox="0 0 24 24">
      {/* Speech bubble */}
      <Path
        d="M20 2H4c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h4l4 4 4-4h4c1.1 0 2-0.9 2-2V4c0-1.1-0.9-2-2-2z"
        fill={color}
      />

      {/* Typing dots */}
      <Circle cx="8" cy="10" r="1" fill="white" />
      <Circle cx="12" cy="10" r="1" fill="white" />
      <Circle cx="16" cy="10" r="1" fill="white" />
    </SvgIcon>
  );
};

export default ChatIcon;
