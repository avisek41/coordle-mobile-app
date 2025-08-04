import React from 'react';
import { Path, Circle } from 'react-native-svg';
import SvgIcon from '../../components/SvgIcon';

interface ProfileIconProps {
  size?: number;
  color?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = 24,
  color = '#6264A7',
}) => {
  return (
    <SvgIcon size={size} color={color} viewBox="0 0 24 24">
      {/* Head */}
      <Circle cx="12" cy="8" r="3" fill={color} />

      {/* Body */}
      <Path d="M12 12c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4z" fill={color} />
    </SvgIcon>
  );
};

export default ProfileIcon;
