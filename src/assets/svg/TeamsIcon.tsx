import React from 'react';
import { Path, Circle } from 'react-native-svg';
import SvgIcon from '../../components/SvgIcon';

interface TeamsIconProps {
  size?: number;
  color?: string;
}

const TeamsIcon: React.FC<TeamsIconProps> = ({
  size = 24,
  color = '#6264A7',
}) => {
  return (
    <SvgIcon size={size} color={color} viewBox="0 0 24 24">
      {/* Back person (right) */}
      <Circle cx="14" cy="8" r="2.5" fill={color} />
      <Path
        d="M14 11.5c-1.1 0-2 0.9-2 2v2h4v-2c0-1.1-0.9-2-2-2z"
        fill={color}
      />

      {/* Front person (left) - overlapping */}
      <Circle cx="10" cy="8" r="2.5" fill={color} />
      <Path
        d="M10 11.5c-1.1 0-2 0.9-2 2v2h4v-2c0-1.1-0.9-2-2-2z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default TeamsIcon;
