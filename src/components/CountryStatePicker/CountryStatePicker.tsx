import React, { useState, useEffect } from 'react';
import { Modal, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField } from '@/components/ui/input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getAllCountries,
  getStatesByCountry,
  CountryOption,
  StateOption,
} from '@/src/utils/countryStateUtils';

interface CountryStatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'country' | 'state', value: string, label: string) => void;
  type: 'country' | 'state';
  selectedCountry?: string;
}

const CountryStatePicker: React.FC<CountryStatePickerProps> = ({
  visible,
  onClose,
  onSelect,
  type,
  selectedCountry,
}) => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<CountryOption[] | StateOption[]>([]);
  const [filteredData, setFilteredData] = useState<
    CountryOption[] | StateOption[]
  >([]);

  useEffect(() => {
    if (type === 'country') {
      const countries = getAllCountries();
      setData(countries);
      setFilteredData(countries);
    } else if (type === 'state' && selectedCountry) {
      const states = getStatesByCountry(selectedCountry);
      setData(states);
      setFilteredData(states);
    }
    // Clear search text when type changes
    setSearchText('');
  }, [type, selectedCountry]);

  useEffect(() => {
    if (searchText) {
      const filtered = data.filter(item =>
        item.label.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchText, data]);

  const renderItem = ({ item }: { item: CountryOption | StateOption }) => (
    <Pressable
      onPress={() => {
        onSelect(type, item.value, item.label);
        setSearchText(''); // Clear search text when item is selected
      }}
      className="py-3 px-4 border-b border-gray-100"
    >
      <Text className="text-base font-body text-black">{item.label}</Text>
    </Pressable>
  );

  const getTitle = () => {
    return type === 'country' ? 'Select Country' : 'Select State';
  };

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={true}
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <VStack className="flex-1">
          {/* Header */}
          <HStack className="items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-heading text-black">
              {getTitle()}
            </Text>
            <Pressable
              onPress={() => {
                setSearchText(''); // Clear search text when modal is closed
                onClose();
              }}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </HStack>

          {/* Search Input */}
          <Box className="p-4">
            <Input
              className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
              style={{ opacity: 1 }}
            >
              <InputField
                placeholder={`Search ${type}...`}
                value={searchText}
                onChangeText={setSearchText}
                className="text-base font-body"
                style={{ gap: 1 }}
              />
            </Input>
          </Box>

          {/* List */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="flex-1"
            keyboardShouldPersistTaps="always"
            maxToRenderPerBatch={10}
            initialNumToRender={15}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
          />

          {/* No Results Message */}
          {filteredData.length === 0 && (
            <Box className="flex-1 justify-center items-center p-8">
              <Text className="text-base font-body text-gray-500 text-center">
                No {type}s found matching "{searchText}"
              </Text>
            </Box>
          )}
        </VStack>
      </SafeAreaView>
    </Modal>
  );
};

export default CountryStatePicker;
