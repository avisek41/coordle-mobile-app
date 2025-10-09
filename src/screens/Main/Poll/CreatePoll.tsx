import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';

// imports from gluestack components
import { Box, HStack, VStack, Text, Input, InputField } from '@/components/ui';

import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useCreatePollMutation } from '@/src/services/pollApi';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { CREATE_POLL_STRINGS } from './strings';
import { Colors } from '@/src/configs/CustomTheme';
import { RootState } from '@/src/redux/Store';
import { Header, GradientButton } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { dateFormatWithDay, timeFormat } from '@/src/utils/dateTimeFormat';

interface PollOption {
  id: string;
  text: string;
}

const CreatePoll: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const { userId } = useSelector((state: RootState) => state.auth);
  const [createPoll, { isLoading: isCreating }] = useCreatePollMutation();
  const { showToast, ToastComponent } = useSimpleToast();
  const route = useRoute<MainRouteProps<'CreatePoll'>>();
  const { tripId } = route.params ?? {
    tripId: '',
  };

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([{ id: '1', text: '' }]);
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const reminderOptions = CREATE_POLL_STRINGS.REMINDER_OPTION_LIST;

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

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      showToast({
        type: 'error',
        title: CREATE_POLL_STRINGS.VALIDATION_ERROR,
        message: CREATE_POLL_STRINGS.PLEASE_ENTER_A_QUESTION_FOR_YOUR_POLL,
      });
      return;
    }

    const validOptions = options?.filter(option => option.text.trim()) || [];

    try {
      const combinedDateTime = moment(selectedDate)
        .set({
          hour: moment(selectedTime).hour(),
          minute: moment(selectedTime).minute(),
          second: 0,
        })
        .toISOString();
      const pollData = {
        question: question.trim(),
        options: validOptions.map(option => option.text.trim()),
        allow_multi_answers: allowMultipleAnswers,
        published: true,
        status: 'Active' as const,
        createdBy: userId,
        trip_id: tripId,
        close_poll_date_time: combinedDateTime,
        display_poll_date: moment(combinedDateTime).format(dateFormatWithDay),
        display_poll_time: moment(combinedDateTime).format(timeFormat),
        reminders: selectedReminders.map(Number),
      };

      await createPoll(pollData).unwrap();
      showToast({
        type: 'success',
        message: CREATE_POLL_STRINGS.POLL_CREATED_SUCCESSFULLY,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error('Failed to create poll:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: CREATE_POLL_STRINGS.POLL_CREATION_FAILED,
      });
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title={CREATE_POLL_STRINGS.TITLE} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="px-6 py-4" space="lg">
          {/* Question Section */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_POLL_STRINGS.QUESTION_LABEL}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12 opacity-100"
              >
                <InputField
                  placeholder={CREATE_POLL_STRINGS.QUESTION_PLACEHOLDER}
                  value={question}
                  onChangeText={setQuestion}
                  className="text-base font-body"
                />
              </Input>
            </Box>
          </VStack>

          {/* Answer Options Section */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_POLL_STRINGS.ANSWER_OPTIONS_LABEL}
            </Text>
            <VStack space="md">
              {options.map((option, index) => (
                <HStack key={option.id} className="items-center" space="sm">
                  <Box className="relative flex-1">
                    <Input
                      className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12 opacity-100">
                      <InputField
                        placeholder={`${
                          CREATE_POLL_STRINGS.OPTION_PLACEHOLDER
                        } ${index + 1}`}
                        value={option.text}
                        onChangeText={text => updateOption(option.id, text)}
                        className="text-base font-body gap-1"
                      />
                    </Input>
                  </Box>
                  {options.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeOption(option.id)}
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
                </HStack>
              ))}
            </VStack>

            <TouchableOpacity
              onPress={addOption}
              style={styles.addOptionButton}
              activeOpacity={0.7}
            >
              <HStack className="items-center" space="sm">
                <Ionicons name="add-circle" size={20} color={Colors.primary} />
                <Text className="text-primary-500 font-body text-base">
                  {CREATE_POLL_STRINGS.ADD_OPTION}
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>

          {/* Close Poll Section */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_POLL_STRINGS.CLOSE_POLL_LABEL}
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
                  {CREATE_POLL_STRINGS.ALLOW_MULTIPLE_ANSWERS}
                </Text>
                <Switch
                  value={allowMultipleAnswers}
                  onValueChange={setAllowMultipleAnswers}
                  trackColor={{ false: Colors.borderGray, true: Colors.primary }}
                  thumbColor={allowMultipleAnswers ? Colors.white : Colors.white}
                  ios_backgroundColor={Colors.borderGray}
                />
              </HStack>
            </Box>

            <Box className="mt-5">
              <HStack className="items-center justify-between">
                <Text className="text-base font-body text-black">
                  {CREATE_POLL_STRINGS.REMINDERS}
                </Text>
                <Switch
                  value={reminders}
                  onValueChange={setReminders}
                  trackColor={{ false: Colors.borderGray, true: Colors.primary }}
                  thumbColor={reminders ? Colors.white : Colors.white}
                  ios_backgroundColor={Colors.borderGray}
                />
              </HStack>
            </Box>

            {/* Reminder Options */}
            {reminders && (
              <VStack className="mt-4" space="sm">
                <Text className="text-sm font-body text-gray-600 mb-2">
                  {CREATE_POLL_STRINGS.REMINDER_OPTIONS}
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
                          <Text
                            className={`text-sm font-body ${
                              selectedReminders?.includes(option.value)
                                ? 'text-blue-700'
                                : 'text-gray-600'
                            }`}
                          >
                            {option.label}
                          </Text>
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
                          <Text
                            className={`text-sm font-body ${
                              selectedReminders?.includes(option.value)
                                ? 'text-blue-700'
                                : 'text-gray-600'
                            }`}
                          >
                            {option.label}
                          </Text>
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

      <Box className="px-6 pb-6">
        <GradientButton
          title={CREATE_POLL_STRINGS.CREATE_POLL}
          onPress={handleCreatePoll}
          size="large"
          loading={isCreating}
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
      <ToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    padding: 4,
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
