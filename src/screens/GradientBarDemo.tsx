import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import GradientBarImage from '@/src/components/GradientBarImage';

const GradientBarDemo = () => {
  return (
    <Box className="flex-1 bg-white">
      <VStack className="flex-1">
        <Text className="text-2xl font-heading text-center p-4">
          Gradient Bar Image Demo
        </Text>

        <Box className="flex-1 m-4">
          <GradientBarImage />
        </Box>

        <Text className="text-base font-body text-center p-4 text-gray-600">
          This recreates the image with a horizontal gradient bar at the top and
          a partial black curved shape in the bottom right corner.
        </Text>
      </VStack>
    </Box>
  );
};

export default GradientBarDemo;
