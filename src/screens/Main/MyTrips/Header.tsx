import React from 'react';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { myTripsStrings } from './strings';

const Header: React.FC = () => {
  return (
    <Box className="px-5 py-4">
      {/* Main Title */}
      <GluestackText className="text-2xl font-heading text-gray-800">
        {myTripsStrings.title}
      </GluestackText>
    </Box>
  );
};

export default Header;
