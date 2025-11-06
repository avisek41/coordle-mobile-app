import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// imports from gluestack components
import { Box, HStack, VStack, Text, Input, InputField } from '@/components/ui';

import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useCreatePollMutation, useUpdatePollMutation, useGetPollVotesQuery } from '@/src/services/pollApi';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { CREATE_EDIT_POLL_STRINGS, POLL_STRINGS } from './strings';
import { Colors } from '@/src/configs/CustomTheme';
import { RootState } from '@/src/redux/Store';
import { Header, GradientButton, CustomAlert, GradientText } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { dateFormat, dateFormatWithDay, dateTime, timeFormat, dateMonthYearFormat } from '@/src/utils/dateTimeFormat';
import { formatTimeRemaining } from '@/src/utils';
import { images } from '@/src/assets';

interface PollOption {
  id: string;
  text: string;
}

const CreatePoll: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [createPoll, { isLoading: isCreating }] = useCreatePollMutation();
  const [updatePoll, { isLoading: isUpdating }] = useUpdatePollMutation();
  const { showToast, ToastComponent } = useSimpleToast();
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const route = useRoute<MainRouteProps<'CreatePoll'>>();
  const { tripId, tripEndDate, pollId } = route.params ?? {
    tripId: '',
    tripEndDate: null,
    pollId: undefined,
  };
  
  // Determine if we're in edit mode
  const isEditMode = !!pollId;

  // Fetch existing poll data for edit mode
  const {
    data: pollData,
    isLoading: isLoadingPoll,
    error: pollError,
  } = useGetPollVotesQuery(pollId!, { skip: !isEditMode });

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([{ id: '1', text: '' }]);
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const reminderOptions = CREATE_EDIT_POLL_STRINGS.REMINDER_OPTION_LIST;
  const [closePollDateTime, setClosePollDateTime] = useState(moment());

  // Load existing poll data when in edit mode
  useEffect(() => {
    if (isEditMode && pollData?.data) {
      const poll = pollData.data;
      setQuestion(poll.question || '');
      setAllowMultipleAnswers(poll.allow_multi_answers || false);
      
      if(poll?.reminders && poll?.reminders?.length > 0) {
        let pollReminders = reminderOptions.filter((rem, i) => { 
          if(poll?.reminders?.find((r: number) => parseInt(r.toString(), 10) === parseInt(rem.value, 10))) {
            return reminderOptions[i]; }
        });
        if(pollReminders) {
          setReminders(true);
          setSelectedReminders(pollReminders.map((r: { value: string; label: string; }) => r.value));
        }
      }
      
      // Convert poll options to our format
      if (poll.options && poll.options.length > 0) {
        const formattedOptions = poll.options.map((option, index) => ({
          id: (index + 1).toString(),
          text: typeof option === 'string' ? option : (option as PollOption).text.trim(),
        }));
        setOptions(formattedOptions);
      }

      // Set close poll date/time
      if (poll.close_poll_date_time) {
        const pollCloseDate = moment(poll.close_poll_date_time);
        setSelectedDate(pollCloseDate.toDate());
        setSelectedTime(pollCloseDate.toDate());
        setClosePollDateTime(pollCloseDate);
      }
    }
  }, [isEditMode, pollData?.data, reminderOptions]);

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option)),
    );
  };

  const onDragEnd = ({ data }: { data: PollOption[] }) => {
    setOptions(data);
  };

  const renderOption = ({ item, drag, isActive }: RenderItemParams<PollOption>) => {
    const index = options.findIndex(option => option.id === item.id);
    
    return (
      <ScaleDecorator>
        <Box 
          className="bg-gray-50 rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
          style={{ opacity: isActive ? 0.8 : 1 }}
        >
          <HStack className="items-center justify-between">
            {/* Remove Button - Left Side */}
            {options.length > 1 && (
              <TouchableOpacity
                onPress={() => removeOption(item.id)}
                style={styles.removeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="remove-circle"
                  size={24}
                  color={Colors.secondary}
                />
              </TouchableOpacity>
            )}

            {/* Input Field - Middle */}
            <Box className="flex-1 mx-3">
              <Input
                className="bg-white border border-gray-200 rounded-lg h-12">
                <InputField
                  placeholder={`${
                    CREATE_EDIT_POLL_STRINGS.OPTION_PLACEHOLDER
                  } ${index + 1}`}
                  value={item.text}
                  onChangeText={text => updateOption(item.id, text)}
                  className="text-base font-body text-black"
                />
              </Input>
            </Box>

            {/* Drag Handle - Right Side */}
            <TouchableOpacity
              onPressIn={drag}
              disabled={isActive}
              style={styles.dragHandle}
              activeOpacity={0.7}
            >
              <Ionicons
                name="reorder-three"
                size={20}
                color={Colors.iconGray}
              />
            </TouchableOpacity>
          </HStack>
        </Box>
      </ScaleDecorator>
    );
  };

  const toggleReminderOption = (value: string) => {
    setSelectedReminders(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value],
    );
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && time) {
      setSelectedTime(time);
    } else if (event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const handleBackPress = () => {
    setShowLeaveAlert(true);
  };

  const handleCreatePoll = async () => {
    console.log('question>>', question);
    if (!question.trim()) {
      showToast({
        type: 'error',
        title: CREATE_EDIT_POLL_STRINGS.VALIDATION_ERROR,
        message: CREATE_EDIT_POLL_STRINGS.PLEASE_ENTER_A_QUESTION_FOR_YOUR_POLL,
      });
      return;
    }
   
    const validOptions = options?.filter(option => option.text.trim()) || [];
    let combinedDateTime = moment(selectedDate)
    .set({
      hour: moment(selectedTime).hour(),
      minute: moment(selectedTime).minute(),
      second: 0,
    });
    setClosePollDateTime(combinedDateTime);
    
    if (moment(combinedDateTime).format(dateFormat) > moment(tripEndDate, dateMonthYearFormat).format(dateFormat)) {
      showToast({
        type: 'error',
        title: CREATE_EDIT_POLL_STRINGS.VALIDATION_ERROR,
        message: CREATE_EDIT_POLL_STRINGS.PLEASE_SELECT_A_CLOSE_POLL_DATE_IS_NOT_GREATER_THAN_TRIP_END_DATE,
      });
      return;
    }

    try {
      const pollPayload = {
        question: question.trim(),
        options: validOptions.map(option => option.text.trim()),
        allow_multi_answers: allowMultipleAnswers,
        published: true,
        status: 'Active' as const,
        createdBy: userId,
        trip_id: tripId,
        close_poll_date_time: combinedDateTime.format(dateTime),
        display_close_poll_date: moment(combinedDateTime).format(dateFormat),
        display_close_poll_time: moment(combinedDateTime).format(timeFormat),
        reminders: selectedReminders.map(Number),
      };

      if (isEditMode && pollId) {
        await updatePoll({ pollId, pollData: pollPayload }).unwrap();
        showToast({
          type: 'success',
          title: CREATE_EDIT_POLL_STRINGS.POLL_UPDATED_TITLE,
          message: CREATE_EDIT_POLL_STRINGS.POLL_UPDATED_SUCCESSFULLY,
          duration: 3000,
        });
        navigation.goBack();
      } else {
        await createPoll(pollPayload).unwrap();
        setShowCustomAlert(true);
      }
    } catch (error: unknown) {
      // Check if error is an object and has 'data' property
      const errorMessage =
      typeof error === 'object' && error !== null && 'data' in error && typeof (error as any).data === 'object' && (error as any).data !== null && 'message' in (error as any).data
        ? ((error as any).data.message as string)
        : 'Something went wrong';

    console.error(`Failed to ${isEditMode ? 'update' : 'create'} poll:`, errorMessage);

    showToast({
      type: 'error',
      title: 'Error',
      message: errorMessage,
    });
    }
  };

  // Show loading state for edit mode
  if (isEditMode && isLoadingPoll) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={CREATE_EDIT_POLL_STRINGS.EDIT_POLL_TITLE} />
        <Box className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">{CREATE_EDIT_POLL_STRINGS.LOADING_POLL_DATA}</Text>
        </Box>
      </SafeAreaView>
    );
  }

  // Show error state for edit mode
  if (isEditMode && (pollError || !pollData?.data)) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={CREATE_EDIT_POLL_STRINGS.EDIT_POLL_TITLE} onBackPress={handleBackPress}/>
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {CREATE_EDIT_POLL_STRINGS.ERROR_LOADING_POLL_DATA}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView className='flex-1'>
    <SafeAreaView style={globalStyles.container}>
      <Header 
        title={isEditMode ? CREATE_EDIT_POLL_STRINGS.EDIT_POLL_TITLE : CREATE_EDIT_POLL_STRINGS.CREATE_POLL_TITLE} 
        onBackPress={handleBackPress}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="px-6 py-4" space="lg">
          {/* Question Section */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_EDIT_POLL_STRINGS.QUESTION_LABEL}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12 opacity-100"
              >
                <InputField
                  placeholder={CREATE_EDIT_POLL_STRINGS.QUESTION_PLACEHOLDER}
                  value={question}
                  onChangeText={setQuestion}
                  className="text-base font-body"
                />
              </Input>
            </Box>
          </VStack>

          {/* Answer Options Section */}
          <VStack className="space-y-2">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_EDIT_POLL_STRINGS.ANSWER_OPTIONS_LABEL}
            </Text>
            <VStack space="md">
              <DraggableFlatList
                data={options}
                onDragEnd={onDragEnd}
                keyExtractor={item => item.id}
                renderItem={renderOption}
                scrollEnabled={false}
                contentContainerStyle={{ paddingVertical: 0 }}
              />
            </VStack>

            <TouchableOpacity
              onPress={addOption}
              style={styles.addOptionButton}
              activeOpacity={0.7}
            >
              <HStack className="items-center" space="sm">
                <Ionicons name="add-circle" size={20} color={Colors.primary} />
                <Text className="text-primary-500 font-body text-base">
                  {CREATE_EDIT_POLL_STRINGS.ADD_OPTION}
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* Close Poll Section */}
          <VStack className="space-y-2 border-t border-gray-200 pt-7 mb-4">
            <Text className="text-sm font-body text-black mb-2">
              {CREATE_EDIT_POLL_STRINGS.CLOSE_POLL_LABEL}
            </Text>
            <HStack space="sm">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
                activeOpacity={0.7}
              >
                <HStack className="items-center justify-between" space="sm">
                  <Text className="text-gray-600 font-body text-base">
                    {moment(selectedDate).format(dateFormatWithDay)}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={Colors.iconGray} />
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{ ...styles.dateTimeButton }}
                activeOpacity={0.7}
              >
                <HStack className="items-center justify-between" space="sm">
                  <Text className="text-gray-600 font-body text-base">
                    {moment(selectedTime).format(timeFormat)}
                  </Text>
                  <Ionicons name="time-outline" size={20} color={Colors.iconGray} />
                </HStack>
              </TouchableOpacity>
            </HStack>
          </VStack>

          <VStack className="space-y-4 mb-4">
            <Box>
              <HStack className="items-center justify-between">
                <Text className="text-base font-body text-black">
                  {CREATE_EDIT_POLL_STRINGS.ALLOW_MULTIPLE_ANSWERS}
                </Text>
                <Switch
                  value={allowMultipleAnswers}
                  onValueChange={setAllowMultipleAnswers}
                  trackColor={{ false: Colors.borderGray, true: Colors.primary }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.borderGray}
                />
              </HStack>
            </Box>

            <Box className="mt-5">
              <HStack className="items-center justify-between">
                <Text className="text-base font-body text-black">
                  {CREATE_EDIT_POLL_STRINGS.REMINDERS}
                </Text>
                <Switch
                  value={reminders}
                  onValueChange={setReminders}
                  trackColor={{ false: Colors.borderGray, true: Colors.primary }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.borderGray}
                />
              </HStack>
            </Box>

            {/* Reminder Options */}
            {reminders && (
              <VStack className="mt-4" space="sm">
                <Text className="text-sm font-body text-gray-600 mb-2">
                  {CREATE_EDIT_POLL_STRINGS.REMINDER_OPTIONS}
                </Text>
                <VStack space="sm">
                  <HStack space="sm">
                    {reminderOptions.slice(0, 2).map(option => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => toggleReminderOption(option.value)}
                        style={[
                          styles.reminderOption,
                          selectedReminders?.includes(option.value) &&
                            styles.reminderOptionSelected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <HStack className="items-center" space="xs">
                          <Ionicons
                            name={
                              selectedReminders?.includes(option.value)
                                ? 'checkmark-circle'
                                : 'checkmark-circle-outline'
                            }
                            size={16}
                            color={
                              selectedReminders?.includes(option.value)
                                ? Colors.primary
                                : Colors.textGray
                            }
                          />
                          {selectedReminders?.includes(option.value) ? (<GradientText text={option.label}
                            textStyle={styles.reminderOptionGradientText} />) : <Text className={`text-sm font-body text-gray-600`}>{option.label}</Text>} 
                        </HStack>
                      </TouchableOpacity>
                    ))}
                  </HStack>
                  <HStack space="sm">
                    {reminderOptions?.slice(2, 4).map(option => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => toggleReminderOption(option.value)}
                        style={[
                          styles.reminderOption,
                          selectedReminders?.includes(option.value) &&
                            styles.reminderOptionSelected,
                        ]}
                        activeOpacity={0.7}
                      >
                        <HStack className="items-center" space="xs">
                          <Ionicons
                            name={
                              selectedReminders?.includes(option.value)
                                ? 'checkmark-circle'
                                : 'checkmark-circle-outline'
                            }
                            size={16}
                            color={
                              selectedReminders?.includes(option.value)
                                ? Colors.primary
                                : Colors.textGray
                            }
                          />
                          {selectedReminders?.includes(option.value) ? (<GradientText text={option.label}
                            textStyle={styles.reminderOptionGradientText} />) : <Text className={`text-sm font-body text-gray-600`}>{option.label}</Text>} 
                        </HStack>
                      </TouchableOpacity>
                    ))}
                  </HStack>
                </VStack>
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <Box className={`px-6 ${isEditMode ? 'bg-white border-t border-gray-200 p-3 mb-3' : 'pb-6'}`}>
        {isEditMode && (<><Text className="text-sm font-body text-red-600 mb-1">
              {`${POLL_STRINGS.POLL_ENDS_IN} ${formatTimeRemaining(pollData?.data?.close_poll_date_time || '')}`}
            </Text></>)}
        <GradientButton
          title={isEditMode ? CREATE_EDIT_POLL_STRINGS.SAVE_BUTTON_TITLE : CREATE_EDIT_POLL_STRINGS.CREATE_POLL_BUTTON_TITLE}
          onPress={handleCreatePoll}
          size="large"
          loading={isCreating || isUpdating}
        />
      </Box>

      {/* Date Picker */}
      {showDatePicker && (
        <>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">
                    Done
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showTimePicker && (
        <>
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">
                    Done
                  </Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}
        </>
      )}
      
      <CustomAlert
        isOpen={showCustomAlert}
        icon={images.poll}
        title={isEditMode ? "Poll Updated" : CREATE_EDIT_POLL_STRINGS.POLL_CREATED}
        message={`This poll will close in ${formatTimeRemaining(closePollDateTime.toISOString())}`}
        onCancel={() => {
          setShowCustomAlert(false);
          navigation.goBack();
        }}
        onConfirm={() => {}}
        />

      {/* Leave Poll Confirmation Alert */}
      <CustomAlert
        isOpen={showLeaveAlert}
        title="Leave Poll?"
        message="Your edits won't be saved"
        cancelText="Leave"
        confirmText="Keep Editing"
        onCancel={() => {
          setShowLeaveAlert(false);
          navigation.goBack(); }}
        onConfirm={() => {
          setShowLeaveAlert(false)
        }}
        isCreatedAlert={true}
      />
      
      <ToastComponent />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  reminderOptionGradientText: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  removeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOptionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  dateTimeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  reminderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  reminderOptionSelected: {
    backgroundColor: Colors.lightBlue,
    borderColor: Colors.primary,
  },
});

export default CreatePoll;
