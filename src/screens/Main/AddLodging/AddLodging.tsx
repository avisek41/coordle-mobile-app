import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { GradientButton, Header } from '@/src/components';
import { globalStyles } from '@/src/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const AddLodging: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'AddLodging'>>();
  const { tripId } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();

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

  const handleSave = () => {
    if (!lodgingName.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter lodging name',
        duration: 2000,
      });
      return;
    }

    if (checkInDate >= checkOutDate) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Check-out date must be after check-in date',
        duration: 2000,
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Success',
      message: 'Lodging added successfully',
      duration: 2000,
    });

    navigation.goBack();
  };

  const formatDate = (date: Date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />

      <Header title="Add Lodging" onBackPress={handleBackPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        <VStack className="px-5 py-2" space="lg">
          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              Enter Lodging Name<Text className="text-red-500">*</Text>
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder="Enter Lodging Name"
                value={lodgingName}
                onChangeText={setLodgingName}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              Check-in<Text className="text-red-500">*</Text>
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
              Check-out<Text className="text-red-500">*</Text>
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
              Enter phone number
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder="Phone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              Enter website
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder="Website"
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">
              Enter reservation code
            </Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder="Reservation Code"
                value={reservationCode}
                onChangeText={setReservationCode}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">Address</Text>
            <Input className="bg-white border border-gray-300 rounded-lg h-12">
              <InputField
                placeholder="Enter Address"
                value={address}
                onChangeText={setAddress}
                className="text-base font-body px-4"
              />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm font-body text-gray-600">Notes</Text>
            <Box className="bg-white border border-gray-300 rounded-lg min-h-24 p-4">
              <Input className="bg-transparent border-0 h-auto">
                <InputField
                  placeholder="Write a note"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                  className="text-base font-body"
                  style={{ minHeight: 80 }}
                />
              </Input>
            </Box>
          </VStack>

          <Box className="mt-4">
            <GradientButton title="Save Lodging" onPress={handleSave} />
          </Box>
        </VStack>
      </ScrollView>

      {showCheckInPicker && (
        <DateTimePicker
          value={checkInDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleCheckInDateChange}
          minimumDate={new Date()}
        />
      )}

      {showCheckOutPicker && (
        <DateTimePicker
          value={checkOutDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleCheckOutDateChange}
          minimumDate={checkInDate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default AddLodging;
