import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MegaphoneIconProps {
  size?: number;
  color?: string;
}

const MegaphoneIcon: React.FC<MegaphoneIconProps> = ({
  size = 80,
  color = '#3B82F6',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Megaphone body */}
      <Path
        d="M15 25C15 20.5817 18.5817 17 23 17H35C39.4183 17 43 20.5817 43 25V35C43 39.4183 39.4183 43 35 43H23C18.5817 43 15 39.4183 15 35V25Z"
        fill={color}
        fillOpacity="0.1"
      />

      {/* Megaphone handle */}
      <Path
        d="M35 25H45C47.2091 25 49 26.7909 49 29V31C49 33.2091 47.2091 35 45 35H35V25Z"
        fill={color}
        fillOpacity="0.1"
      />

      {/* Sound waves */}
      <Path
        d="M55 30C57.7614 30 60 27.7614 60 25C60 22.2386 57.7614 20 55 20C52.2386 20 50 22.2386 50 25C50 27.7614 52.2386 30 55 30Z"
        fill="#EF4444"
        fillOpacity="0.8"
      />
      <Path
        d="M62 30C64.7614 30 67 27.7614 67 25C67 22.2386 64.7614 20 62 20C59.2386 20 57 22.2386 57 25C57 27.7614 59.2386 30 62 30Z"
        fill="#EF4444"
        fillOpacity="0.6"
      />
      <Path
        d="M69 30C71.7614 30 74 27.7614 74 25C74 22.2386 71.7614 20 69 20C66.2386 20 64 22.2386 64 25C64 27.7614 66.2386 30 69 30Z"
        fill="#EF4444"
        fillOpacity="0.4"
      />

      {/* Megaphone outline */}
      <Path
        d="M15 25C15 20.5817 18.5817 17 23 17H35C39.4183 17 43 20.5817 43 25V35C43 39.4183 39.4183 43 35 43H23C18.5817 43 15 39.4183 15 35V25Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Megaphone handle outline */}
      <Path
        d="M35 25H45C47.2091 25 49 26.7909 49 29V31C49 33.2091 47.2091 35 45 35H35V25Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

export default MegaphoneIcon;
