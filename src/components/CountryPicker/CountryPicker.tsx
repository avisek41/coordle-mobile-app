import countries from '@/src/constant/countries';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField } from '@/components/ui/input';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Country {
  code: string;
  name: string;
  phone: string;
}

interface CountryPickerProps {
  onClose: () => void;
  onSelect: (country: Country) => void;
  visible: boolean;
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  onClose,
  onSelect,
  visible,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Country[]>(countries);

  useEffect(() => {
    if (searchText) {
      const results = countries.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults(countries);
    }
  }, [searchText]);

  const renderCountryItem = ({ item }: { item: Country }) => (
    <Pressable
      onPress={() => onSelect(item)}
      className="py-3 px-4 border-b border-gray-100"
    >
      <HStack className="items-center space-x-3">
        <Image
          source={{
            uri: `https://flagcdn.com/w20/${item.code
              .slice(0, 2)
              .toLowerCase()}.png`,
          }}
          style={styles.flag}
          resizeMode="contain"
        />
        <VStack className="flex-1">
          <Text className="text-base font-body text-black">{item.name}</Text>
          <Text className="text-sm font-body text-gray-500">{item.phone}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );

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
              Select Country
            </Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </HStack>

          {/* Search Input */}
          <Box className="p-4">
            <Input
              className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
              style={{
                opacity: 1,
              }}
            >
              <InputField
                placeholder="Search country..."
                value={searchText}
                onChangeText={setSearchText}
                className="text-base font-body"
                style={{
                  gap: 1,
                }}
              />
            </Input>
          </Box>

          {/* Countries List */}
          <FlatList
            data={searchResults}
            renderItem={renderCountryItem}
            keyExtractor={item => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            className="flex-1"
            keyboardShouldPersistTaps="always"
            // Performance optimizations
            maxToRenderPerBatch={10}
            initialNumToRender={15}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: 60, // Height of each item
              offset: 60 * index,
              index,
            })}
          />

          {/* No Results Message */}
          {searchResults.length === 0 && (
            <Box className="flex-1 justify-center items-center p-8">
              <Text className="text-base font-body text-gray-500 text-center">
                No countries found matching "{searchText}"
              </Text>
            </Box>
          )}
        </VStack>
      </SafeAreaView>
    </Modal>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  flag: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
});
