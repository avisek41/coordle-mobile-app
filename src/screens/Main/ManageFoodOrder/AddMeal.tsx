import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/Store';

// imports from gluestack components
import { Box, HStack, VStack, Text, Input, InputField } from '@/components/ui';

import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { mealStrings, MEAL_TYPES } from './string';
import { Colors } from '@/src/configs/CustomTheme';
import { Header, GradientButton, Dropdown, GradientText } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { dateFormatWithDay, timeFormat, dateTime, dateFormat } from '@/src/utils/dateTimeFormat';
import { useCreateMealMutation, useUpdateMealMutation, useGetMealByIdQuery } from '@/src/services';
import { CreateMealFormData, UpdateMealFormData } from '@/src/types/meal';

interface Restaurant {
  id: string;
  restaurantName: string;
  menuLink: string;
}

const AddMeal: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { showToast, ToastComponent } = useSimpleToast();
  const route = useRoute<MainRouteProps<'AddMeal'>>();
  const { tripId, tripEndDate, mealId } = route.params ?? {
    tripId: '',
    tripEndDate: '',
    mealId: undefined,
  };

  // Determine if we're in edit mode
  const isEditMode = !!mealId;

  // Fetch existing meal data for edit mode
  const {
    data: mealData,
    isLoading: isLoadingMeal,
    error: mealError,
  } = useGetMealByIdQuery(mealId!, { skip: !isEditMode });

  const [createMeal, { isLoading: isCreating }] = useCreateMealMutation();
  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation();

  const [mealDate, setMealDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    { id: '1', restaurantName: '', menuLink: '' },
  ]);
  const [reminders, setReminders] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const reminderOptions = mealStrings.reminderOptionList;

  const [showMealDatePicker, setShowMealDatePicker] = useState(false);
  const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
  const [showDeadlineTimePicker, setShowDeadlineTimePicker] = useState(false);

  // Load existing meal data when in edit mode
  useEffect(() => {
    if (isEditMode && mealData?.data) {
      const meal = mealData.data;
      
      // Set meal date
      if (meal.meal_date) {
        const mealDateMoment = moment(meal.meal_date);
        setMealDate(mealDateMoment.toDate());
      }

      // Set meal type
      if (meal.meal_type) {
        setSelectedMealType(meal.meal_type);
      }

      // Set order deadline date/time
      if (meal.order_deadline_date_time) {
        const deadlineMoment = moment(meal.order_deadline_date_time);
        setDeadlineDate(deadlineMoment.toDate());
        setDeadlineTime(deadlineMoment.toDate());
      }

      // Set restaurants
      if (meal.restaurants && meal.restaurants.length > 0) {
        const formattedRestaurants = meal.restaurants.map((restaurant, index) => ({
          id: (index + 1).toString(),
          restaurantName: restaurant.name || '',
          menuLink: restaurant.link || '',
        }));
        setRestaurants(formattedRestaurants);
      }

      // Set reminders
      if (meal.reminders && meal.reminders.length > 0) {
        const mealReminders = reminderOptions.filter((rem) => {
          return meal.reminders?.find((r: number) => Number.parseInt(r.toString(), 10) === Number.parseInt(rem.value, 10));
        });
        if (mealReminders.length > 0) {
          setReminders(true);
          setSelectedReminders(mealReminders.map((r: { value: string; label: string }) => r.value));
        }
      }
    }
  }, [isEditMode, mealData?.data, reminderOptions]);

  const handleMealDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowMealDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setMealDate(date);
    } else if (event.type === 'dismissed') {
      setShowMealDatePicker(false);
    }
  };

  const handleDeadlineDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDeadlineDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setDeadlineDate(date);
    } else if (event.type === 'dismissed') {
      setShowDeadlineDatePicker(false);
    }
  };

  const handleDeadlineTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowDeadlineTimePicker(false);
    }
    if (event.type === 'set' && time) {
      setDeadlineTime(time);
    } else if (event.type === 'dismissed') {
      setShowDeadlineTimePicker(false);
    }
  };

  const addRestaurant = () => {
    const newId = (restaurants.length + 1).toString();
    setRestaurants([...restaurants, { id: newId, restaurantName: '', menuLink: '' }]);
  };

  const removeRestaurant = (id: string) => {
    if (restaurants.length > 1) {
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    }
  };

  const updateRestaurant = (id: string, field: 'restaurantName' | 'menuLink', value: string) => {
    setRestaurants(
      restaurants.map(restaurant =>
        restaurant.id === id ? { ...restaurant, [field]: value } : restaurant,
      ),
    );
  };

  const toggleReminderOption = (value: string) => {
    setSelectedReminders(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value],
    );
  };

  const handleAddMeal = async () => {
    
    // Validation
    if (!mealDate) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.mealDateRequired,
      });
      return;
    }

    if (!selectedMealType || selectedMealType.trim() === '') {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.mealTypeRequired,
      });
      return;
    }

    if (!userId) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: 'User ID is required',
      });
      return;
    }

    if (!deadlineDate) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.deadlineDateRequired,
      });
      return;
    }

    if (!deadlineTime) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.deadlineTimeRequired,
      });
      return;
    }

    // Validate at least one restaurant with name
    const validRestaurants = restaurants.filter(
      restaurant => restaurant.restaurantName.trim() !== '',
    );

    if (validRestaurants.length === 0) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.restaurantRequired,
      });
      return;
    }

    // Validate each restaurant has a name
    for (const restaurant of validRestaurants) {
      if (!restaurant.restaurantName.trim()) {
        showToast({
          type: 'error',
          title: mealStrings.validationError,
          message: mealStrings.restaurantNameRequired,
        });
        return;
      }
    }

    try {
      // Format restaurants for API (remove id field)
      const formattedRestaurants = validRestaurants.map(restaurant => ({
        name: restaurant.restaurantName.trim(),
        link: restaurant.menuLink.trim(),
      }));
      if (moment(deadlineDate).date() > moment(mealDate).date()) {
        showToast({
          type: 'error',
          title: mealStrings.validationError,
          message: mealStrings.deadlineDateTimeRequired,
        });
        return;
      } else if(moment(deadlineDate).date() === moment(mealDate).date()) {
        setMealDate(moment(mealDate).add(1, "hour").toDate());
      }

      // Format meal date
      const formattedMealDate = moment(mealDate).format(dateTime);

      // Combine deadline date and time similar to CreatePoll
      let combinedDeadlineDateTime = moment(deadlineDate)
        .set({
          hour: moment(deadlineTime).hour(),
          minute: moment(deadlineTime).minute(),
          second: 0,
        });
        
      if (moment(combinedDeadlineDateTime).format(dateTime) > moment(tripEndDate, dateFormat).format(dateTime)) {
        showToast({
          type: 'error',
          title: mealStrings.validationError,
          message: mealStrings.deadlineDateTimeCannotBeAfterTripEndDate,
        });
        return;
      }

      if (isEditMode && mealId) {
        const mealPayload: UpdateMealFormData = {
          meal_date: formattedMealDate,
          meal_type: selectedMealType,
          order_deadline_date_time: combinedDeadlineDateTime.format(dateTime),
          restaurants: formattedRestaurants,
          reminders: selectedReminders.map(Number),
        };

        await updateMeal({ mealId, mealData: mealPayload }).unwrap();
        showToast({
          type: 'success',
          title: mealStrings.mealUpdatedTitle,
          message: mealStrings.mealUpdatedSuccessfully,
          duration: 3000,
        });
        navigation.goBack();
      } else {
        const mealPayload: CreateMealFormData = {
          meal_date: formattedMealDate,
          meal_type: selectedMealType,
          order_deadline_date_time: combinedDeadlineDateTime.format(dateTime),
          restaurants: formattedRestaurants,
          trip_id: tripId,
          reminders: selectedReminders.map(Number),
          createdBy: userId,
        };
        console.log('mealPayload', mealPayload);
        await createMeal(mealPayload).unwrap();

        showToast({
          type: 'success',
          title: 'Success',
          message: 'Meal added successfully',
          duration: 3000,
        });

        navigation.goBack();
      }
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        (error as any).data !== null &&
        'message' in (error as any).data
          ? ((error as any).data.message as string)
          : 'Something went wrong';

      console.error(`Failed to ${isEditMode ? 'update' : 'create'} meal:`, errorMessage);

      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  };

  // Show loading state for edit mode
  if (isEditMode && isLoadingMeal) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={mealStrings.editMealTitle} />
        <Box className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">{mealStrings.loadingMealData}</Text>
        </Box>
      </SafeAreaView>
    );
  }

  // Show error state for edit mode
  if (isEditMode && (mealError || !mealData?.data)) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header title={mealStrings.editMealTitle} onBackPress={() => navigation.goBack()} />
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {mealStrings.errorLoadingMealData}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header 
        title={isEditMode ? mealStrings.editMealTitle : mealStrings.addMealTitle} 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="px-6 py-4" space="lg">
          {/* Meal Date Section */}
          <VStack className="space-y-2">
            <Text className="text-sm font-body text-black mb-1">
              {mealStrings.mealDateLabel}
            </Text>
            <TouchableOpacity
              onPress={() => setShowMealDatePicker(true)}
              activeOpacity={0.7}
            >
              <Box className="bg-gray-50 border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-3">
                <Text
                  className={`text-base font-body ${
                    mealDate ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {mealDate
                    ? moment(mealDate).format(dateFormatWithDay)
                    : mealStrings.mealDatePlaceholder}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={Colors.iconGray} />
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Select Meal Type Section */}
          <VStack className="space-y-2">
            <Text className="text-sm font-body text-black mb-1">
              {mealStrings.selectMealTypeLabel}
            </Text>
            <Dropdown
              label=""
              placeholder={mealStrings.selectMealTypePlaceholder}
              options={MEAL_TYPES}
              value={selectedMealType}
              onValueChange={(value) => {
                if (typeof value === 'string' && (value === 'breakfast' || value === 'lunch' || value === 'dinner' || value === 'pre-game' || value === 'post-game-dinner' || value === 'snack')) {
                  setSelectedMealType(value);
                }
              }}
            />
          </VStack>

          {/* Deadline Date Section */}
          <VStack className="space-y-2">
            <Text className="text-sm font-body text-black mb-1">
              {mealStrings.deadlineDateLabel}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDeadlineDatePicker(true)}
              activeOpacity={0.7}
            >
              <Box className="bg-gray-50 border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-3">
                <Text
                  className={`text-base font-body ${
                    deadlineDate ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {deadlineDate
                    ? moment(deadlineDate).format(dateFormatWithDay)
                    : mealStrings.deadlineDatePlaceholder}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={Colors.iconGray} />
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Deadline Time Section */}
          <VStack className="space-y-2">
            <Text className="text-sm font-body text-black mb-1">
              {mealStrings.deadlineTimeLabel}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDeadlineTimePicker(true)}
              activeOpacity={0.7}
            >
              <Box className="bg-gray-50 border border-gray-200 rounded-lg h-12 flex-row items-center justify-between px-3">
                <Text
                  className={`text-base font-body ${
                    deadlineTime ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {deadlineTime
                    ? moment(deadlineTime).format(timeFormat)
                    : mealStrings.deadlineTimePlaceholder}
                </Text>
                <Ionicons name="time-outline" size={20} color={Colors.iconGray} />
              </Box>
            </TouchableOpacity>
          </VStack>

          {/* Add Restaurant Section - Card Style */}
          <VStack space="md">
            {restaurants.map((restaurant) => (
              <Box key={restaurant.id} className="space-y-3">
                <Box className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  {restaurants.length > 1 ? (
                      <HStack className="flex-row items-center justify-between">
                        <Text className="text-sm font-body text-black font-semibold mb-2">
                          {mealStrings.addRestaurantLabel}
                        </Text>
                        <HStack className="items-center justify-end mb-1">
                          <TouchableOpacity
                            onPress={() => removeRestaurant(restaurant.id)}
                            style={styles.removeButton}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="remove-circle"
                              size={24}
                              color={Colors.secondary}
                            />
                          </TouchableOpacity>
                        </HStack>
                      </HStack>
                   ) : (<Text className="text-sm font-body text-black font-semibold mb-2">
                    {mealStrings.addRestaurantLabel}
                  </Text>)}
                <VStack space="sm">
                  <Input className="bg-gray-50 border border-gray-200 rounded-lg h-12">
                    <InputField
                      placeholder={mealStrings.restaurantNamePlaceholder}
                      value={restaurant.restaurantName}
                      onChangeText={text =>
                        updateRestaurant(restaurant.id, 'restaurantName', text)
                      }
                      className="text-base font-body text-black"
                    />
                  </Input>
                  <Input className="bg-gray-50 border border-gray-200 rounded-lg h-12">
                    <InputField
                      placeholder={mealStrings.foodMenuLinkPlaceholder}
                      value={restaurant.menuLink}
                      onChangeText={text =>
                        updateRestaurant(restaurant.id, 'menuLink', text)
                      }
                      className="text-base font-body text-black"
                    />
                  </Input>
                </VStack>
                </Box>
              </Box>
            ))}
          </VStack>
          <TouchableOpacity
            onPress={addRestaurant}
            style={styles.addRestaurantButton}
            activeOpacity={0.7}
          >
            <HStack className="items-center" space="xs">
              <Ionicons name="add" size={16} color={Colors.primary} />
              <Text className="text-primary-500 font-body text-base">
                {mealStrings.addAdditionalRestaurant}
              </Text>
            </HStack>
          </TouchableOpacity>

          {/* Reminders Section */}
          <VStack className="space-y-4 mb-4">
            <Box>
              <HStack className="items-center justify-between">
                <Text className="text-base font-body text-black">
                  {mealStrings.reminders}
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
                  {mealStrings.reminderOptions}
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
                          {selectedReminders?.includes(option.value) ? (
                            <GradientText
                              text={option.label}
                              textStyle={styles.reminderOptionGradientText}
                            />
                          ) : (
                            <Text className="text-sm font-body text-gray-600">
                              {option.label}
                            </Text>
                          )}
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
                          {selectedReminders?.includes(option.value) ? (
                            <GradientText
                              text={option.label}
                              textStyle={styles.reminderOptionGradientText}
                            />
                          ) : (
                            <Text className="text-sm font-body text-gray-600">
                              {option.label}
                            </Text>
                          )}
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
          title={isEditMode ? mealStrings.saveButton : mealStrings.addButton}
          onPress={handleAddMeal}
          size="large"
          loading={isCreating || isUpdating}
        />
      </Box>

      {/* Date Pickers */}
      {showMealDatePicker && (
        <>
          <DateTimePicker
            value={mealDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleMealDateChange}
            minimumDate={new Date()}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={() => setShowMealDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowMealDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Done</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showDeadlineDatePicker && (
        <>
          <DateTimePicker
            value={deadlineDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDeadlineDateChange}
            minimumDate={new Date()}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={() => setShowDeadlineDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeadlineDatePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Done</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}
        </>
      )}

      {showDeadlineTimePicker && (
        <>
          <DateTimePicker
            value={deadlineTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDeadlineTimeChange}
          />
          {Platform.OS === 'ios' && (
            <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <HStack className="justify-between items-center">
                <TouchableOpacity
                  onPress={() => setShowDeadlineTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeadlineTimePicker(false)}
                  className="px-4 py-2"
                >
                  <Text className="text-blue-600 font-body text-base">Done</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRestaurantButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
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
  reminderOptionGradientText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
});

export default AddMeal;

