import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { Box, Text, VStack, HStack, Input, InputField, Pressable } from '@/components/ui';

import { CREATE_TRIP_STRINGS } from './strings';
import { GradientButton } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { images } from '@/src/assets';
import { Colors } from '@/src/configs/CustomTheme';
import PhotoPicker from '@/src/components/PhotoPicker/PhotoPicker';
import CustomAlert from '@/src/components/CustomAlert';

import {
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useGetTripByIdQuery,
} from '@/src/services';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';

import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import ShareTripSection from './ShareTripSection';
import { useAppSelector } from '@/src/hooks';
import GooglePlacesModal from '@/src/components/GooglePlacesAutocomplete/GooglePlacesModal';
import { dateFormat } from '@/src/utils/dateTimeFormat';

const CreateTrip = () => {
  const { userRole } = useAppSelector(state => state.auth);
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'CreateTrip'>>();

  const { isEditMode, tripId } = route.params ?? {
    isEditMode: false,
    tripId: undefined,
  };

  const [createTrip, { isLoading: isCreating }] = useCreateTripMutation();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationCoordinates, setDestinationCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [tripBegins, setTripBegins] = useState(new Date());
  const [tripEnds, setTripEnds] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showBeginsPicker, setShowBeginsPicker] = useState(false);
  const [showEndsPicker, setShowEndsPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [tripMembers, setTripMembers] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Fetch trip data for edit mode
  const { data: tripData} = useGetTripByIdQuery(
    tripId || '',
    { skip: !isEditMode || !tripId },
  );

  // Populate form data when editing
  useEffect(() => {
    if (isEditMode && tripData?.data) {
      const trip = tripData.data;
      setTripName(trip.name || '');
      setDestination(trip.to_address || '');
      setTripBegins(new Date(trip.start_date));
      setTripEnds(new Date(trip.end_date));
      setSelectedImage(trip.cover_image?.url || null);
    }
  }, [isEditMode, tripData]);

  const handleImagePicker = () => {
    setShowPhotoPicker(true);
  };

  const handlePhotoPickerClose = () => {
    setShowPhotoPicker(false);
  };

  const handleImageSelected = (imageData: {
    uri: string;
    mimeType: string;
    fileName: string;
  }) => {
    setSelectedImage(imageData.uri);
    setShowPhotoPicker(false);
  };

  const handlePhotoPickerError = (error: string) => {
    console.error('Photo picker error:', error);
    showToast({
      type: 'error',
      title: 'Error',
      message: error,
    });
    setShowPhotoPicker(false);
  };

  const handleDeleteTrip = () => {
    if (!isEditMode || !tripId) return;
    setShowDeleteAlert(true);
  };

  const handleConfirmDeleteTrip = async () => {
    if (!isEditMode || !tripId) return;

    try {
      await deleteTrip(tripId).unwrap();
      setShowDeleteAlert(false);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Trip deleted successfully!',
      });
      setTimeout(() => {
        navigation.navigate('BottomTabs');
      }, 1500);
    } catch (error) {
      console.error('Failed to delete trip:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete trip. Please try again.',
      });
    }
  };

  const handleCancelDeleteTrip = () => {
    setShowDeleteAlert(false);
  };

  const handleSaveTrip = async () => {
    // Validate all required fields
    if (!tripName.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a trip name',
      });
      return;
    }

    if (!destination.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a destination',
      });
      return;
    }

    // Validate dates
    if (!tripBegins) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select trip start date',
      });
      return;
    }

    if (!tripEnds) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select trip end date',
      });
      return;
    }

    // Validate that end date is after start date
    if (tripEnds < tripBegins) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Trip end date must be after start date',
      });
      return;
    }

    try {
      const formData = new FormData();

      // Add trip data
      formData.append('name', tripName.trim());
      formData.append('to_address', destination.trim());
      formData.append(
        'to_location_latitude',
        destinationCoordinates?.latitude.toString() || '',
      );
      formData.append(
        'to_location_longitude',
        destinationCoordinates?.longitude.toString() || '',
      );
      formData.append('from_address', '');
      formData.append('from_location_latitude', '');
      formData.append('from_location_longitude', '');
      formData.append('display_start', moment(tripBegins).format(dateFormat));
      formData.append('display_end', moment(tripEnds).format(dateFormat));
      formData.append('start_date', moment(tripBegins).toISOString());
      formData.append('end_date', moment(tripEnds).toISOString());

      // Add cover image if selected
      if (selectedImage) {
        formData.append('coverImage', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: `trip_cover_${Date.now()}.jpg`,
        } as any);
      }

      if (isEditMode && tripId) {
        // Update existing trip
        await updateTrip({ tripId, formData }).unwrap();
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Trip updated successfully!',
        });
      } else {
        // Create new trip
        await createTrip(formData).unwrap();
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Trip created successfully!',
        });
      }

      // Navigate back after successful operation
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? 'update' : 'create'} trip:`,
        error,
      );

      // Show error toast
      showToast({
        type: 'error',
        title: 'Error',
        message: `Failed to ${
          isEditMode ? 'update' : 'create'
        } trip. Please try again.`,
      });
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box className="relative">
          <Image
            source={
              isEditMode && tripData?.data?.cover_image?.url
                ? { uri: tripData?.data?.cover_image?.url }
                : images.cover
            }
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
              onPress={() => {
                navigation.goBack();
              }}
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
                  <Pressable
                    className="flex-1 bg-transparent border-0"
                    onPress={() => setShowLocationModal(true)}
                  >
                    <Text className="text-base font-body text-gray-500">
                      {destination ||
                        CREATE_TRIP_STRINGS.DESTINATION_PLACEHOLDER}
                    </Text>
                  </Pressable>
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
                      ? moment(tripBegins).format(dateFormat)
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
                      ? moment(tripEnds).format(dateFormat)
                      : CREATE_TRIP_STRINGS.TRIP_ENDS_PLACEHOLDER}
                  </Text>
                </Pressable>
              </Box>

              <Pressable
                onPress={handleImagePicker}
                className="bg-white border border-gray-200 rounded-lg h-16 flex-row items-center px-4"
              >
                <Ionicons
                  name="image"
                  size={20}
                  color={selectedImage ? '#51B1C0' : '#6B7280'}
                />
                <Box className="w-px h-8 bg-gray-300 mx-3" />
                <Text
                  className={`text-base font-body flex-1 ${
                    selectedImage ? 'text-primary-500' : 'text-gray-500'
                  }`}
                >
                  {selectedImage
                    ? selectedImage.split('/').pop() || 'Image selected'
                    : CREATE_TRIP_STRINGS.CHOOSE_IMAGE_PLACEHOLDER}
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </Box>

        {/* Share Trip Section */}
        {isEditMode && (
          <Box className="px-4 mt-6">
            <ShareTripSection
              tripMembers={tripMembers}
              onTripMembersChange={setTripMembers}
              tripId={tripId}
            />
          </Box>
        )}

        <Box className="px-4 mt-6 mb-8">
          <VStack space="md">
            <GradientButton
              title={
                isEditMode
                  ? CREATE_TRIP_STRINGS.SAVE_TRIP_BUTTON
                  : CREATE_TRIP_STRINGS.CREATE_TRIP_BUTTON
              }
              onPress={handleSaveTrip}
              colors={['#2E6F9E', '#51B1C0']}
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            />

            {isEditMode && userRole === 'owner' && (
              <TouchableOpacity
                onPress={handleDeleteTrip}
                disabled={isDeleting}
                className="py-3"
              >
                <Text className="text-center text-primary-500 font-heading">
                  {CREATE_TRIP_STRINGS.DELETE_TRIP_BUTTON}
                </Text>
              </TouchableOpacity>
            )}
          </VStack>
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
        onImageSelected={handleImageSelected}
        onError={handlePhotoPickerError}
        cropping={false}
        cropperCircleOverlay={false}
      />

      <CustomAlert
        isOpen={showDeleteAlert}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={handleCancelDeleteTrip}
        onConfirm={handleConfirmDeleteTrip}
        isDestructive={true}
      />

      <ToastComponent />

      {showLocationModal && (
        <GooglePlacesModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={(coords, details) => {
            console.log('Selected:', coords, details);
            setDestination(details.formatted_address);
            setDestinationCoordinates(coords);
            setShowLocationModal(false);
          }}
        />
      )}
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
