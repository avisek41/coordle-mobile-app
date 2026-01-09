import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { GradientButton, Header, Loader } from '@/src/components';
import { globalStyles } from '@/src/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { dateFormatWithDay } from '@/src/utils/dateTimeFormat';
import { useCreateLodgingMutation } from '@/src/services/lodgingApi';
import { ADD_LODGING_STRINGS } from './strings';
import { HStack } from '@/components/ui/hstack';

const AddLodging: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'AddLodging'>>();
  const { tripId } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();
  const [createLodging, { isLoading }] = useCreateLodgingMutation();

  const [lodgingName, setLodgingName] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [reservationCode, setReservationCode] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCheckInDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowCheckInPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckInDate(selectedDate);
    }
  };

  const handleCheckOutDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowCheckOutPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  /**
   * Handles saving the lodging data by calling the API
   * Validates required fields and date constraints before submission
   */
  const handleSave = async () => {
    // Validate lodging name
    if (!lodgingName.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: ADD_LODGING_STRINGS.LODGING_NAME_REQUIRED,
        duration: 2000,
      });
      return;
    }

    // Validate check-out date is after check-in date
    if (checkInDate >= checkOutDate) {
      showToast({
        type: 'error',
        title: 'Error',
        message: ADD_LODGING_STRINGS.CHECKOUT_AFTER_CHECKIN,
        duration: 2000,
      });
      return;
    }

    try {
      // Format dates to ISO 8601 format with time
      // Set check-in time to 14:00 (2 PM) and check-out time to 11:00 (11 AM)
      const checkInISO = moment(checkInDate)
        .set({ hour: 14, minute: 0, second: 0, millisecond: 0 })
        .toISOString();
      const checkOutISO = moment(checkOutDate)
        .set({ hour: 11, minute: 0, second: 0, millisecond: 0 })
        .toISOString();

      // Prepare request payload
      const lodgingData = {
        lodging_name: lodgingName.trim(),
        check_in: checkInISO,
        check_out: checkOutISO,
        trip_id: tripId,
        ...(phoneNumber.trim() && { phone: phoneNumber.trim() }),
        ...(website.trim() && { website: website.trim() }),
        ...(reservationCode.trim() && {
          reservation_code: reservationCode.trim(),
        }),
        ...(address.trim() && { address: address.trim() }),
        ...(notes.trim() && { notes: notes.trim() }),
      };

      // Call API to create lodging
      const response = await createLodging(lodgingData).unwrap();

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: ADD_LODGING_STRINGS.LODGING_CREATED_SUCCESS,
          duration: 2000,
        });

        // Navigate back after successful creation
        navigation.goBack();
      }
    } catch (error: any) {
      // Handle API errors
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        ADD_LODGING_STRINGS.LODGING_CREATE_FAILED;

      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        duration: 2000,
      });
    }
  };

  const formatDate = (date: Date) => {
    return moment(date).format(dateFormatWithDay);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />
      {isLoading && <Loader />}

      <Header title={ADD_LODGING_STRINGS.TITLE} onBackPress={handleBackPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        <VStack className="px-5 py-2" space="lg">
          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.LODGING_NAME_LABEL}
              <Text className="text-red-500">*</Text>
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder={ADD_LODGING_STRINGS.LODGING_NAME_PLACEHOLDER}
                value={lodgingName}
                onChangeText={setLodgingName}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.CHECK_IN_LABEL}
              <Text className="text-red-500">*</Text>
            </Text>
            <Pressable
              onPress={() => setShowCheckInPicker(true)}
              className="bg-white border border-gray-300 rounded-lg h-12 flex-row items-center justify-between px-4"
            >
              <Text className="text-base font-body text-gray-700">
                {formatDate(checkInDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </Pressable>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.CHECK_OUT_LABEL}
              <Text className="text-red-500">*</Text>
            </Text>
            <Pressable
              onPress={() => setShowCheckOutPicker(true)}
              className="bg-white border border-gray-300 rounded-lg h-12 flex-row items-center justify-between px-4"
            >
              <Text className="text-base font-body text-gray-700">
                {formatDate(checkOutDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </Pressable>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.PHONE_NUMBER_LABEL}
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder={ADD_LODGING_STRINGS.PHONE_NUMBER_PLACEHOLDER}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.WEBSITE_LABEL}
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder={ADD_LODGING_STRINGS.WEBSITE_PLACEHOLDER}
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.RESERVATION_CODE_LABEL}
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder={ADD_LODGING_STRINGS.RESERVATION_CODE_PLACEHOLDER}
                value={reservationCode}
                onChangeText={setReservationCode}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.ADDRESS_LABEL}
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder={ADD_LODGING_STRINGS.ADDRESS_PLACEHOLDER}
                value={address}
                onChangeText={setAddress}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              {ADD_LODGING_STRINGS.NOTES_LABEL}
            </Text>
            <Box className="bg-white border border-gray-300 rounded-lg min-h-24 p-4">
              <Input className="bg-transparent border-0 h-auto">
                <InputField
                  placeholder={ADD_LODGING_STRINGS.NOTES_PLACEHOLDER}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                  className="text-base font-body"
                  style={styles.notesInput}
                />
              </Input>
            </Box>
          </VStack>

          <Box className="mt-4">
            <GradientButton
              title={ADD_LODGING_STRINGS.SAVE_BUTTON}
              onPress={handleSave}
              disabled={isLoading}
            />
          </Box>
        </VStack>
      </ScrollView>

      {showCheckInPicker && (
        <>
        <DateTimePicker
          value={checkInDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange= {(event: DateTimePickerEvent, selectedDate?: Date) => {
            if (Platform.OS === 'android') {
              setShowCheckInPicker(false);
            }
            if (event.type === 'set' && selectedDate) {
              handleCheckInDateChange(event, selectedDate);
            } else if (event.type === 'dismissed') {
              setShowCheckInPicker(false);
            }
          }}
          minimumDate={new Date()}
        />
        {Platform.OS === 'ios' && (
          <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <HStack className="justify-between items-center">
              <Pressable
                onPress={() => setShowCheckInPicker(false)}
                className="px-4 py-2"
              >
                <Text className="text-base font-body text-gray-600">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowCheckInPicker(false)}
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

      {showCheckOutPicker && (
        <>
        <DateTimePicker
          value={checkOutDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange= {(event: DateTimePickerEvent, selectedDate?: Date) => {
            if (Platform.OS === 'android') {
              setShowCheckOutPicker(false);
            }
            if (event.type === 'set' && selectedDate) {
              handleCheckOutDateChange(event, selectedDate);
            } else if (event.type === 'dismissed') {
              setShowCheckOutPicker(false);
            }
          }}
          minimumDate={checkInDate}
        />
        {Platform.OS === 'ios' && (
          <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <HStack className="justify-between items-center">
              <Pressable
                onPress={() => setShowCheckOutPicker(false)}
                className="px-4 py-2"
              >
                <Text className="text-base font-body text-gray-600">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowCheckOutPicker(false)}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  notesInput: {
    minHeight: 80,
  },
});

export default AddLodging;
