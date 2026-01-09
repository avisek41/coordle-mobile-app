import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { Header, Loader, GradientButton } from '@/src/components';
import { Box,Text,VStack,HStack,Input,InputField,Pressable } from '@/components/ui';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { Colors } from '@/src/configs/CustomTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCreateActivityMutation, type CreateActivityFormData } from '@/src/services';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import { dateFormat, timeFormat } from '@/src/utils/dateTimeFormat';
import GooglePlacesModal from '@/src/components/GooglePlacesAutocomplete/GooglePlacesModal';

/**
 * Configuration for activity-specific form fields
 */
interface ActivityFieldConfig {
  showPhone: boolean;
  showWebsite: boolean;
  showReservationCode: boolean;
  showTickets: boolean;
  addressLabel: string,
  showStartTimeRequired: boolean;
  dateLabel: string;
  dateField: string;
  notesLabel: string;
  notesField: string;
}

const getActivityFieldConfig = (activityName: string): ActivityFieldConfig => {
  const configs: Record<string, ActivityFieldConfig> = {
    Restaurant: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Tour: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Museum: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    'Bar & Party': {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Event: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Training: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Location',
      dateLabel: 'Date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Relax: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: false,
      addressLabel: 'Location',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Fitness: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: false,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Shopping: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: false,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Concert: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: true,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Kids: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Theater: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: false,
      showTickets: true,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Meeting: {
      showPhone: false,
      showWebsite: false,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Location',
      dateLabel: 'Meeting date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
    Misc: {
      showPhone: false,
      showWebsite: false,
      showReservationCode: false,
      showTickets: false,
      showStartTimeRequired: false,
      addressLabel: 'Location',
      dateLabel: 'Reservation date',
      dateField: 'reservationDate',
      notesLabel: 'Description',
      notesField: 'notes',
    },
    Other: {
      showPhone: true,
      showWebsite: true,
      showReservationCode: true,
      showTickets: false,
      showStartTimeRequired: true,
      addressLabel: 'Address',
      dateLabel: 'Reservation Date',
      dateField: 'reservationDate',
      notesLabel: 'Notes',
      notesField: 'notes',
    },
  };

  return configs[activityName] || configs.Other;
};

const CreateActivity: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'CreateActivity'>>();
  const { tripId, activityName } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();
  const [createActivity, { isLoading }] = useCreateActivityMutation();

  // Get activity-specific field configuration
  const fieldConfig = getActivityFieldConfig(activityName || '');

  // Activities that should use the activity name directly (without "name" suffix)
  const specialActivities = ['Relax', 'Fitness', 'Shopping', 'Kids'];
  const isSpecialActivity = activityName ? specialActivities.includes(activityName) : false;
  
  // Activities that should use "title" instead of "name"
  const titleActivities = ['Training', 'Meeting'];
  const isTitleActivity = activityName ? titleActivities.includes(activityName) : false;

  // Special handling for Misc - uses "Activity name" instead of "Misc name"
  const isMiscActivity = activityName === 'Misc';

  /**
   * Gets the label text for the activity name field
   */
  const getActivityNameLabel = (): string => {
    if (isMiscActivity) {
      return 'Activity name';
    }
    if (isSpecialActivity) {
      return activityName || '';
    }
    if (isTitleActivity) {
      return `${activityName || ''} title`;
    }
    if (activityName === 'Other') {
      return 'Name';
    }
    return `${activityName || ''} name`;
  };

  /**
   * Gets the placeholder text for the activity name field
   */
  const getActivityNamePlaceholder = (): string => {
    if (isMiscActivity) {
      return 'Enter activity name';
    }
    if (isSpecialActivity) {
      if (activityName === 'Relax' || activityName === 'Fitness' || activityName === 'Shopping' || activityName === 'Kids') {
        return 'Enter title';
      }
      return activityName || '';
    }
    if (isTitleActivity) {
      return `Enter ${activityName?.toLowerCase() || ''} title`;
    }
    return `Enter ${activityName?.toLowerCase() || ''} name`;
  };

  /**
   * Gets the error message for missing activity name
   */
  const getActivityNameErrorMessage = (): string => {
    return `${getActivityNameLabel()} is required`;
  };

  const [formData, setFormData] = useState({
    activityName: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    phone: '',
    website: '',
    reservationCode: '',
    tickets: '',
    address: '',
    location: '',
    notes: '',
    activityType: activityName === 'Bar & Party' ? 'bar' : activityName?.toLowerCase() || '',
    tripId: tripId,
  });

  // Google Places Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Date and time picker states
  const [reservationDate, setReservationDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showReservationDatePicker, setShowReservationDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handles reservation date change from date picker
   */
  const handleReservationDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowReservationDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setReservationDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        reservationDate: moment(selectedDate).format(dateFormat),
      }));
    } else if (event.type === 'dismissed') {
      setShowReservationDatePicker(false);
    }
  };

  /**
   * Handles start time change from time picker
   */
  const handleStartTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (event.type === 'set' && selectedTime) {
      setStartTime(selectedTime);
      setFormData(prev => ({
        ...prev,
        startTime: moment(selectedTime).format(timeFormat),
      }));
    } else if (event.type === 'dismissed') {
      setShowStartTimePicker(false);
    }
  };

  /**
   * Handles end time change from time picker
   */
  const handleEndTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (event.type === 'set' && selectedTime) {
      setEndTime(selectedTime);
      setFormData(prev => ({
        ...prev,
        endTime: moment(selectedTime).format(timeFormat),
      }));
    } else if (event.type === 'dismissed') {
      setShowEndTimePicker(false);
    }
  };

  /**
   * Handles address selection from Google Places
   */
  const handleAddressSelect = (coordinates: { latitude: number; longitude: number }, details: any) => {
    const address = details?.formatted_address || details?.name || '';
    setFormData(prev => ({
      ...prev,
      address,
    }));
  };

  /**
   * Handles saving the activity data by calling the API
   * Validates required fields and transforms data before submission
   */
  const handleSave = async () => {
    // Validate required fields
    if (!formData.activityName.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: getActivityNameErrorMessage(),
        duration: 3000,
      });
      return;
    }

    if (!formData.reservationDate.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: `${fieldConfig.dateLabel} is required`,
        duration: 3000,
      });
      return;
    }

    if (!formData.startTime.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Start time is required',
        duration: 3000,
      });
      return;
    }

    // Meeting requires end time
    if (activityName === 'Meeting' && !formData.endTime.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'End time is required',
        duration: 3000,
      });
      return;
    }

    try {
      // Combine reservation date with start time and end time
      // Create ISO 8601 timestamps by combining date from reservationDate with times
      const startTimeMoment = moment(startTime);
      const endTimeMoment = moment(endTime);

      // Combine reservation date with start time (clone to avoid mutation)
      const startTimeISO = moment(reservationDate)
        .set({
          hour: startTimeMoment.hour(),
          minute: startTimeMoment.minute(),
          second: startTimeMoment.second(),
          millisecond: 0,
        })
        .toISOString();

      // Combine reservation date with end time (clone to avoid mutation)
      const endTimeISO = moment(reservationDate)
        .set({
          hour: endTimeMoment.hour(),
          minute: endTimeMoment.minute(),
          second: endTimeMoment.second(),
          millisecond: 0,
        })
        .toISOString();

      // Format reservation date as ISO 8601 (date only, set to midnight)
      const reservationDateISO = moment(reservationDate)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toISOString();

      // Prepare request payload
      const activityData: CreateActivityFormData = {
        activity_name: formData.activityName.trim(),
        reservation_date: reservationDateISO,
        startTime: startTimeISO,
        endTime: endTimeISO,
        trip_id: tripId,
        activity_type: formData.activityType,
        ...(formData.phone.trim() && { phone: formData.phone.trim() }),
        ...(formData.website.trim() && { website: formData.website.trim() }),
        ...(formData.reservationCode.trim() && {
          reservation_code: formData.reservationCode.trim(),
        }),
        ...(formData.tickets.trim() && { tickets: formData.tickets.trim() }),
        ...(formData.address.trim() && { address: formData.address.trim() }),
        ...(formData.notes.trim() && { notes: formData.notes.trim() }),
      };

      // Call API to create activity
      const response = await createActivity(activityData).unwrap();

      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Activity created successfully',
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
        'Failed to create activity. Please try again.';

      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        duration: 3000,
      });
    }
  };

  const renderInputField = (
    label: string,
    field: string,
    placeholder: string,
    isRequired: boolean = false,
    icon?: string,
    multiline: boolean = false,
  ) => (
    <VStack space="xs">
      <Text className="text-sm font-body text-gray-700">
        {label}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      <Box className="relative">
        <Input
          className="pr-10"
          style={[styles.input, multiline && styles.multilineInput]}
        >
          <InputField
            value={String(formData[field as keyof typeof formData] || '')}
            onChangeText={(value: string) => handleInputChange(field, value)}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
          />
        </Input>
        {icon && (
          <Box className="absolute right-3 top-1/2 -translate-y-1/2">
            <Ionicons name={icon as any} size={20} color={Colors.gray} />
          </Box>
        )}
      </Box>
    </VStack>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />
      {isLoading && <Loader />}

      <Header title={`Add ${activityName}`} onBackPress={handleBackPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        <VStack className="px-6 py-6 gap-6" space="lg">
          {renderInputField(
            getActivityNameLabel(),
            'activityName',
            getActivityNamePlaceholder(),
            true,
          )}

          {/* Date Field */}
          <VStack space="xs">
            <Text className="text-sm font-body text-gray-700">
              {fieldConfig.dateLabel}<Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowReservationDatePicker(true)}
              activeOpacity={0.7}
            >
              <Box
                className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-4"
                style={styles.input}
              >
                <Text
                  className={`text-base font-body ${
                    formData.reservationDate ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {formData.reservationDate || 'Select '+fieldConfig.dateLabel.toLowerCase()}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={Colors.gray} />
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Start Time and End Time */}
          <HStack space="md">
            <Box className="flex-1">
              <VStack space="xs">
                <Text className="text-sm font-body text-gray-700">
                  Start Time<Text className="text-red-500">{fieldConfig.showStartTimeRequired ? '*' : ''}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowStartTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Box
                    className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-4"
                    style={styles.input}
                  >
                    <Text
                      className={`text-base font-body ${
                        formData.startTime ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {formData.startTime || 'Time'}
                    </Text>
                    <Ionicons name="time-outline" size={20} color={Colors.gray} />
                  </Box>
                </TouchableOpacity>
              </VStack>
            </Box>
            <Box className="flex-1">
              <VStack space="xs">
                <Text className="text-sm font-body text-gray-700">
                  End Time{activityName === 'Meeting' && <Text className="text-red-500">*</Text>}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowEndTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Box
                    className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-4"
                    style={styles.input}
                  >
                    <Text
                      className={`text-base font-body ${
                        formData.endTime ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {formData.endTime || 'Time'}
                    </Text>
                    <Ionicons name="time-outline" size={20} color={Colors.gray} />
                  </Box>
                </TouchableOpacity>
              </VStack>
            </Box>
          </HStack>

          {/* Phone Field */}
          {fieldConfig.showPhone && renderInputField('Phone', 'phone', 'Enter phone number')}

          {/* Website Field */}
          {fieldConfig.showWebsite && renderInputField('Website', 'website', 'Enter website')}

          {/* Reservation Code Field */}
          {fieldConfig.showReservationCode && renderInputField(
            'Reservation Code',
            'reservationCode',
            'Enter reservation code',
          )}

          {/* Tickets Field */}
          {fieldConfig.showTickets && renderInputField(
            'Tickets',
            'tickets',
            'Enter tickets number',
          )}

          {/* Address Field with Google Places */}
            <VStack space="xs">
              <Text className="text-sm font-body text-gray-700">{fieldConfig.addressLabel}</Text>
              <TouchableOpacity
                onPress={() => setShowAddressModal(true)}
                activeOpacity={0.7}
              >
                <Box
                  className="bg-white border border-gray-200 rounded-lg min-h-12 flex-row items-center justify-between px-4"
                  style={styles.input}
                >
                  <Text
                    className={`text-base font-body flex-1 ${
                      formData.address ? 'text-gray-700' : 'text-gray-400'
                    }`}
                    numberOfLines={2}
                  >
                    {formData.address || 'Enter ' + fieldConfig.addressLabel.toLowerCase()}
                  </Text>
                  <Ionicons name="location-outline" size={20} color={Colors.gray} />
                </Box>
              </TouchableOpacity>
            </VStack>
          

          {/* Notes/Description Field */}
          {renderInputField(
            fieldConfig.notesLabel,
            fieldConfig.notesField,
            fieldConfig.notesLabel === 'Description' ? 'Write a description' : 'Write a note',
            false,
            undefined,
            true,
          )}

          <Box className="pt-8">
            <GradientButton
              title="Add"
              onPress={handleSave}
              disabled={isLoading}
            />
          </Box>
        </VStack>
      </ScrollView>

      {/* Date and Time Pickers */}
      {showReservationDatePicker && (
        <>
          <DateTimePicker
            value={reservationDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleReservationDateChange}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <Pressable
                  onPress={() => setShowReservationDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-base font-body text-gray-600">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowReservationDatePicker(false)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-base font-body text-white">Confirm</Text>
                </Pressable>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showStartTimePicker && (
        <>
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartTimeChange}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <Pressable
                  onPress={() => setShowStartTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-base font-body text-gray-600">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowStartTimePicker(false)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-base font-body text-white">Confirm</Text>
                </Pressable>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showEndTimePicker && (
        <>
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndTimeChange}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <Pressable
                  onPress={() => setShowEndTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-base font-body text-gray-600">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowEndTimePicker(false)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-base font-body text-white">Confirm</Text>
                </Pressable>
              </HStack>
            </Box>
          )}
        </>
      )}

      {/* Google Places Modals */}
      <GooglePlacesModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onLocationSelect={handleAddressSelect}
        placeholder="Search for address..."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal:2,
    paddingVertical: 8,
    fontSize: 16,
    color: '#374151',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default CreateActivity;
