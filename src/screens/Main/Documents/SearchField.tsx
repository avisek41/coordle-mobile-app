import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Box, Input, InputField, Pressable } from '@/components/ui';

import { documentsStrings } from './strings';
import { Colors } from '@/src/configs/CustomTheme';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ value, onChangeText }) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <Box className="flex-1">
      <Input
        className={`bg-white border rounded-lg h-12 ${
          value.length > 0 ? 'border-blue-400' : 'border-gray-300'
        }`}
      >
        <Box className="absolute left-3 top-3 z-10">
          <Ionicons
            name="search"
            size={20}
            color={value.length > 0 ? Colors.blue : Colors.textGray}
          />
        </Box>
        <InputField
          placeholder={documentsStrings.searchPlaceholder}
          value={value}
          onChangeText={onChangeText}
          className="text-base font-body pl-10 pr-10"
          style={{ backgroundColor: Colors.transparent }}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            className="absolute right-3 top-3 z-10 p-1"
          >
            <Ionicons name="close-circle" size={18} color={Colors.textGray} />
          </Pressable>
        )}
      </Input>
    </Box>
  );
};

export default SearchField;
