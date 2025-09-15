import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Header } from '@/src/components';
import { GradientButton } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CREATE_POLL_STRINGS } from './strings';
import { Colors } from '@/src/configs/CustomTheme';

interface PollOption {
  id: string;
  text: string;
}

const CreatePoll: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([{ id: '1', text: '' }]);
  const [allowMultipleAnswers, setAllowMultipleAnswers] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setSelectedDate(selectedDate);
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && selectedTime) {
      setSelectedTime(selectedTime);
    } else if (event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCreatePoll = () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question for your poll.');
      return;
    }

    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 answer options.');
      return;
    }

    Alert.alert('Success', 'Poll created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={CREATE_POLL_STRINGS.TITLE} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <VStack className="px-6 py-4" space="lg">
          {/* Question Section */}
          <VStack className="space-y-2 mb-4">
            <Text className="text-sm font-body text-black mb-1">
              {CREATE_POLL_STRINGS.QUESTION_LABEL}
            </Text>
            <Box className="relative mt-2">
              <Input
                className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                style={{ opacity: 1 }}
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
                      className="bg-gray-50 border border-gray-200 rounded-lg w-full h-12"
                      style={{ opacity: 1 }}
                    >
                      <InputField
                        placeholder={`${
                          CREATE_POLL_STRINGS.OPTION_PLACEHOLDER
                        } ${index + 1}`}
                        value={option.text}
                        onChangeText={text => updateOption(option.id, text)}
                        className="text-base font-body"
                        style={{ gap: 1 }}
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
                        color="#EF4444"
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
                    {formatDate(selectedDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{ ...styles.dateTimeButton }}
                activeOpacity={0.7}
              >
                <HStack className="items-center justify-between" space="sm">
                  <Text className="text-gray-600 font-body text-base">
                    {formatTime(selectedTime)}
                  </Text>
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
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
                  trackColor={{ false: '#D1D5DB', true: Colors.primary }}
                  thumbColor={allowMultipleAnswers ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#D1D5DB"
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
                  trackColor={{ false: '#D1D5DB', true: Colors.primary }}
                  thumbColor={reminders ? '#ffffff' : '#ffffff'}
                  ios_backgroundColor="#D1D5DB"
                />
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>

      <Box className="px-6 pb-6">
        <GradientButton
          title={CREATE_POLL_STRINGS.CREATE_POLL}
          onPress={handleCreatePoll}
          size="large"
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

      {/* Time Picker */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
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
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
});

export default CreatePoll;
