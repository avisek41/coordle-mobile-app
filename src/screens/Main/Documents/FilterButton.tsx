import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { documentsStrings } from './strings';

interface FilterButtonProps {
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box className="bg-white border border-gray-300 rounded-lg h-12 px-4 justify-center items-center ml-4">
        <HStack className="items-center space-x-2">
          <Ionicons name="funnel-outline" size={18} color="#374151" />
          <Text className="text-base font-body text-gray-700">
            {documentsStrings.dateFilter}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#374151" />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default FilterButton;
