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
      <HStack className="justify-between items-center">
        <Text className="text-lg font-heading text-gray-800">
          Add a new trip
        </Text>
        <GradientButton
          title="Create"
          onPress={onPress}
          colors={['#2E6F9E', '#51B1C0']}
          style={{ width: 100, height: 40 }}
          textStyle={{ fontSize: 14 }}
        />
      </HStack>
    </Box>
  );
};

export default AddNewTripCard; 