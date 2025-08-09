import React from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { documentsStrings } from './strings';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ value, onChangeText }) => {
  return (
    <Box className="flex-1">
      <Input className="bg-white border border-gray-300 rounded-lg h-12">
        <Box className="absolute left-3 top-3 z-10">
          <Ionicons name="search" size={20} color="#9CA3AF" />
        </Box>
        <InputField
          placeholder={documentsStrings.searchPlaceholder}
          value={value}
          onChangeText={onChangeText}
          className="text-base font-body pl-10 pr-4"
          style={{ backgroundColor: 'transparent' }}
        />
      </Input>
    </Box>
  );
};

export default SearchField;
