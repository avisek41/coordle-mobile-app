import React from 'react';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

interface NoDataProps {
  title: string;
  subtitle: string;
}

const NoData: React.FC<NoDataProps> = ({ title, subtitle }) => {
  return (
    <Box className="flex-1 bg-white rounded-xl p-6">
      <VStack className="flex-1 justify-center items-center" space="lg">
        {/* No Data Text */}
        <VStack className="items-center" space="sm">
          <GluestackText className="text-xl font-heading text-gray-800 text-center">
            {title}
          </GluestackText>
          <GluestackText className="text-md text-gray-500 text-center">
            {subtitle}
          </GluestackText>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NoData;
