import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { CREATE_TRIP_STRINGS } from './strings';
import { Header, GradientButton } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { images } from '@/src/assets';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Platform } from 'react-native';
import { Colors } from '@/src/configs/CustomTheme';
import PhotoPicker from '@/src/components/PhotoPicker/PhotoPicker';

const CreateTrip = () => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [tripBegins, setTripBegins] = useState(new Date());
  const [tripEnds, setTripEnds] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showBeginsPicker, setShowBeginsPicker] = useState(false);
  const [showEndsPicker, setShowEndsPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const handleImagePicker = () => {
    setShowPhotoPicker(true);
  };

  const handlePhotoPickerClose = () => {
    setShowPhotoPicker(false);
  };

  const handlePhotoUploadSuccess = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowPhotoPicker(false);
  };

  const handlePhotoUploadError = (error: string) => {
    console.error('Photo upload error:', error);
    setShowPhotoPicker(false);
  };

  const handleCreateTrip = () => {
    // Handle trip creation logic here
    console.log('Creating trip:', {
      tripName,
      destination,
      tripBegins,
      tripEnds,
      selectedImage,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box className="relative">
          <Image
            source={images.cover}
            style={{
              width: '100%',
              height: 230,
              resizeMode: 'cover',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          />

          <Box className="absolute top-0 left-0 right-0 px-5 py-5 mt-5">
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.backButton]}
              activeOpacity={0.8}
            >
              <Ionicons name={'chevron-back'} size={21} color={Colors.white} />
            </TouchableOpacity>
            <Box className="mt-4">
              <Input className="bg-transparent border-0">
                <InputField
                  placeholder="Trip Name"
                  cursorColor={Colors.white}
                  value={tripName}
                  onChangeText={setTripName}
                  className="text-3xl font-heading text-white placeholder:text-white"
                />
              </Input>
            </Box>
          </Box>
        </Box>

        <Box className="px-4 -mt-24">
          <Box className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
            <VStack space="lg">
              <VStack space="sm">
                <Box className="bg-white border border-gray-200 rounded-lg h-16 flex-row items-center px-4">
                  <Ionicons name="location" size={20} color="#6B7280" />
                  <Box className="w-px h-8 bg-gray-300 mx-3" />
                  <Input className="flex-1 bg-transparent border-0">
                    <InputField
                      placeholder={CREATE_TRIP_STRINGS.DESTINATION_PLACEHOLDER}
                      value={destination}
                      onChangeText={setDestination}
                      className="text-base font-body text-gray-900 placeholder:text-gray-500"
                      style={styles.destinationInput}
                    />
                  </Input>
                </Box>
              </VStack>

              <Box className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Pressable
                  onPress={() => setShowBeginsPicker(true)}
                  className="h-16 flex-row items-center px-4"
                >
                  <Ionicons name="calendar" size={20} color="#6B7280" />
                  <Box className="w-px h-8 bg-gray-300 mx-3" />
                  <Text className="text-base font-body text-gray-500 flex-1">
                    {tripBegins
                      ? tripBegins.toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : CREATE_TRIP_STRINGS.TRIP_BEGINS_PLACEHOLDER}
                  </Text>
                </Pressable>

                <Box className="w-full h-px bg-gray-200" />

                <Pressable
                  onPress={() => setShowEndsPicker(true)}
                  className="h-16 flex-row items-center px-4"
                >
                  <Ionicons name="calendar" size={20} color="#6B7280" />
                  <Box className="w-px h-8 bg-gray-300 mx-3" />
                  <Text className="text-base font-body text-gray-500 flex-1">
                    {tripEnds
                      ? tripEnds.toLocaleDateString('en-IN', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : CREATE_TRIP_STRINGS.TRIP_ENDS_PLACEHOLDER}
                  </Text>
                </Pressable>
              </Box>

              <Pressable
                onPress={handleImagePicker}
                className="bg-white border border-gray-200 rounded-lg h-16 flex-row items-center px-4"
              >
                <Ionicons name="image" size={20} color="#6B7280" />
                <Box className="w-px h-8 bg-gray-300 mx-3" />
                <Text className="text-base font-body text-gray-500 flex-1">
                  {selectedImage
                    ? 'Image selected'
                    : CREATE_TRIP_STRINGS.CHOOSE_IMAGE_PLACEHOLDER}
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </Box>

        <Box className="px-4 mt-6 mb-8">
          <GradientButton
            title={CREATE_TRIP_STRINGS.CREATE_TRIP_BUTTON}
            onPress={handleCreateTrip}
            colors={['#2E6F9E', '#51B1C0']}
          />
        </Box>
      </ScrollView>

      {showBeginsPicker && (
        <>
          <DateTimePicker
            value={tripBegins}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (Platform.OS === 'android') {
                setShowBeginsPicker(false);
              }
              if (event.type === 'set' && selectedDate) {
                setTripBegins(selectedDate);
              } else if (event.type === 'dismissed') {
                setShowBeginsPicker(false);
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <Pressable
                  onPress={() => setShowBeginsPicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-base font-body text-gray-600">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowBeginsPicker(false)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-base font-body text-white">
                    Confirm
                  </Text>
                </Pressable>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showEndsPicker && (
        <>
          <DateTimePicker
            value={tripEnds}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (Platform.OS === 'android') {
                setShowEndsPicker(false);
              }
              if (event.type === 'set' && selectedDate) {
                setTripEnds(selectedDate);
              } else if (event.type === 'dismissed') {
                setShowEndsPicker(false);
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <Pressable
                  onPress={() => setShowEndsPicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-base font-body text-gray-600">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowEndsPicker(false)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-base font-body text-white">
                    Confirm
                  </Text>
                </Pressable>
              </HStack>
            </Box>
          )}
        </>
      )}

      <PhotoPicker
        isVisible={showPhotoPicker}
        onClose={handlePhotoPickerClose}
        onUploadSuccess={handlePhotoUploadSuccess}
        onUploadError={handlePhotoUploadError}
      />
    </SafeAreaView>
  );
};

export default CreateTrip;

const styles = StyleSheet.create({
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripNameInput: {
    fontSize: 24,

    color: Colors.white,
    textAlign: 'left',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  destinationInput: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
