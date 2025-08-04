import React, { useState } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  placeholder: string;
  options: DropdownOption[];
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  className?: string;
  multiSelect?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  className = '',
  multiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedValues = multiSelect ? (Array.isArray(value) ? value : []) : [];
  const selectedValue = multiSelect ? '' : (typeof value === 'string' ? value : '');

  const selectedOptions = multiSelect 
    ? options.filter(option => selectedValues.includes(option.value))
    : options.find(option => option.value === selectedValue);

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange(newValues);
    } else {
      onValueChange(optionValue);
      setIsOpen(false);
    }
  };

  const removeTag = (tagValue: string) => {
    if (multiSelect) {
      const newValues = selectedValues.filter(v => v !== tagValue);
      onValueChange(newValues);
    }
  };

  const renderTags = () => {
    if (!multiSelect || selectedValues.length === 0) return null;

    return (
      <HStack className="flex-wrap gap-2 mt-2">
        {selectedOptions.map((option, index) => (
          <HStack
            key={index}
            className="bg-primary-100 px-3 py-1 rounded-full items-center"
          >
            <Text className="text-sm font-body text-primary-700 mr-2">
              {option.label}
            </Text>
            <TouchableOpacity onPress={() => removeTag(option.value)}>
              <Ionicons name="close" size={16} color="#2E6F9E" />
            </TouchableOpacity>
          </HStack>
        ))}
      </HStack>
    );
  };

  const getDisplayText = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option ? option.label : placeholder;
      }
      return `${selectedValues.length} selected`;
    } else {
      return selectedOptions ? selectedOptions.label : placeholder;
    }
  };

  return (
    <Box className={`relative ${className}`}>
      <TouchableOpacity
        className={`bg-gray-50 border border-gray-200 rounded-lg flex-row items-center justify-between px-3 mt-2 ${
          multiSelect ? 'min-h-12 py-2' : 'h-12'
        }`}
        onPress={() => setIsOpen(!isOpen)}
      >
        <VStack className="flex-1">
          <Text className="text-base font-body text-gray-500">
            {getDisplayText()}
          </Text>
          {renderTags()}
        </VStack>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Dropdown positioned absolutely below the input */}
      {isOpen && (
        <View className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg">
          <ScrollView className="max-h-60">
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
                  multiSelect 
                    ? selectedValues.includes(option.value) ? 'bg-primary-50' : ''
                    : selectedValue === option.value ? 'bg-primary-50' : ''
                }`}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  className={`text-base font-body ${
                    multiSelect
                      ? selectedValues.includes(option.value) ? 'text-primary-500' : 'text-black'
                      : selectedValue === option.value ? 'text-primary-500' : 'text-black'
                  }`}
                >
                  {option.label}
                </Text>
                {(multiSelect 
                  ? selectedValues.includes(option.value)
                  : selectedValue === option.value) && (
                  <Ionicons name="checkmark" size={20} color="#2E6F9E" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </Box>
  );
};

export default Dropdown;
