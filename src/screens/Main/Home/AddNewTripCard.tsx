import React from 'react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { GradientButton } from '@/src/components';

interface AddNewTripCardProps {
  onPress: () => void;
}

const AddNewTripCard: React.FC<AddNewTripCardProps> = ({ onPress }) => {
  return (
    <Box className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <HStack className="justify-between items-center space-x-4">
        <Text className="text-lg font-heading text-gray-800 flex-1">
          Add a new trip
        </Text>
        <Box className="w-24">
          <GradientButton
            title="Create"
            onPress={onPress}
            style={{ height: 35, marginTop: 0 }}
            gradientStyle={{ width: '100%', height: '100%' }}
            textStyle={{ fontSize: 14 }}
          />
        </Box>
      </HStack>
    </Box>
  );
};

export default AddNewTripCard;
