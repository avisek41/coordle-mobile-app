import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { documentsStrings } from './strings';

interface FilterButtonProps {
  onPress: () => void;
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  sortBy,
  sortOrder,
}) => {
  const getSortIcon = () => {
    return sortOrder === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline';
  };

  const getSortText = () => {
    return sortBy === 'date' ? 'Date' : 'Name';
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box className="bg-white border border-gray-300 rounded-lg h-12 px-4 justify-center items-center ml-4">
        <HStack className="items-center " space="sm">
          <Ionicons name="funnel-outline" size={18} color="#374151" />
          <Text className="text-base font-body text-gray-700">
            {getSortText()}
          </Text>
          <Ionicons name={getSortIcon()} size={16} color="#374151" />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default FilterButton;
