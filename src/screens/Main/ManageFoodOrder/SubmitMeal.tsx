import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';

import { Box, Text, HStack, VStack } from '@/components/ui';
import { Input, InputField } from '@/components/ui/input';

import { Header, Loader, GradientButton, Dropdown } from '@/src/components';
import { MainNavigationProps, MainStackParams } from '@/src/types/allRoutes';
import { Colors } from '@/src/configs/CustomTheme';
import { useGetMealByIdQuery, useSubmitMealOrderMutation, useUpdateMealOrderMutation } from '@/src/services';
import { dateFormat, timeFormat } from '@/src/utils/dateTimeFormat';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useAppSelector } from '@/src/hooks';
import { mealStrings } from './string';

type SubmitMealRouteProp = RouteProp<MainStackParams, 'SubmitMeal'>;

const SubmitMeal: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<SubmitMealRouteProp>();
  const { mealId, orderId } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();
  const { userId } = useAppSelector(state => state.auth);

  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [foodOrder, setFoodOrder] = useState<string>('');

  const isEditMode = !!orderId;

  const {
    data: mealData,
    isLoading,
    error,
  } = useGetMealByIdQuery(mealId);

  const [submitMealOrder, { isLoading: isSubmitting }] = useSubmitMealOrderMutation();
  const [updateMealOrder, { isLoading: isUpdating }] = useUpdateMealOrderMutation();

  const meal = mealData?.data;

  // Load order data in edit mode
  useEffect(() => {
    if (isEditMode && meal?.food_order && orderId) {
      const orderToEdit = meal.food_order.find(order => order._id === orderId);
      if (orderToEdit) {
        setFoodOrder(orderToEdit.meal || '');
        setSelectedRestaurant(orderToEdit.name || '');
      }
    }
  }, [isEditMode, meal?.food_order, orderId]);

  // Set default restaurant when meal data loads (only if not in edit mode)
  useEffect(() => {
    if (!isEditMode && meal?.restaurants && meal.restaurants.length > 0 && !selectedRestaurant) {
      const firstRestaurant = meal.restaurants[0];
      const restaurantName = (firstRestaurant as any).name || (firstRestaurant as any).restaurantName || '';
      if (restaurantName) {
        setSelectedRestaurant(restaurantName);
      }
    }
  }, [isEditMode, meal?.restaurants, selectedRestaurant]);

  // Convert restaurants to dropdown options
  const restaurantOptions = meal?.restaurants
    ? meal.restaurants.map((restaurant) => {
        const restaurantName = (restaurant as any).name || (restaurant as any).restaurantName || '';
        return {
          label: restaurantName,
          value: restaurantName,
        };
      })
    : [];

  const showRestaurantDropdown = meal?.restaurants && meal.restaurants.length > 1;

  const handleOpenMenu = (link: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const handleSubmit = async () => {
    if (!foodOrder.trim()) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.pleaseEnterFoodOrder,
        duration: 3000,
      });
      return;
    }

    if (!meal) {
      showToast({
        type: 'error',
        title: mealStrings.error,
        message: mealStrings.mealInformationNotAvailable,
        duration: 3000,
      });
      return;
    }

    // Check if deadline has passed
    const isOrderOpen = moment(meal.order_deadline_date_time).isAfter(moment());
    if (!isOrderOpen) {
      showToast({
        type: 'error',
        title: mealStrings.orderClosed,
        message: mealStrings.cannotSubmitAfterDeadline,
        duration: 3000,
      });
      return;
    }

    try {
      const restaurantName = selectedRestaurant || meal.restaurants?.[0]?.name || '';
      
      if (isEditMode && orderId) {
        // Update existing order
        await updateMealOrder({
          mealId,
          orderId,
          name: restaurantName,
          meal: foodOrder.trim(),
        }).unwrap();

        showToast({
          type: 'success',
          title: mealStrings.orderUpdated,
          message: mealStrings.orderUpdatedSuccessfully,
          duration: 3000,
        });
      } else {
        // Submit new order
        await submitMealOrder({
          mealId,
          name: restaurantName,
          userId: userId || '',
          meal: foodOrder.trim(),
        }).unwrap();

        showToast({
          type: 'success',
          title: mealStrings.mealSubmitted,
          message: mealStrings.mealSubmittedSuccessfully,
          duration: 3000,
        });
      }

      // Navigate back after successful submission/update
      navigation.goBack();
    } catch (submitError: unknown) {
      const errorMessage =
        typeof submitError === 'object' &&
        submitError !== null &&
        'data' in submitError &&
        typeof (submitError as any).data === 'object' &&
        (submitError as any).data !== null &&
        'message' in (submitError as any).data
          ? ((submitError as any).data.message as string)
          : isEditMode
            ? mealStrings.failedToUpdateOrder
            : mealStrings.failedToSubmitOrder;

      showToast({
        type: 'error',
        title: isEditMode ? mealStrings.updateFailed : mealStrings.submissionFailed,
        message: errorMessage,
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={mealStrings.submitYourMeal}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Box className="flex-1 justify-center items-center">
          <Loader />
        </Box>
      </SafeAreaView>
    );
  }

  if (error || !meal) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={mealStrings.submitYourMeal}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Box className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center">
            {mealStrings.errorLoadingMealDetails}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const deadlineDate = moment(meal.order_deadline_date_time).format(dateFormat);
  const deadlineTime = moment(meal.order_deadline_date_time).format(timeFormat);
  const isOrderOpen = moment(meal.order_deadline_date_time).isAfter(moment());

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEditMode ? mealStrings.editYourMeal : mealStrings.submitYourMeal}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Information Card */}
        <Box style={styles.infoCard}>
          <VStack space="md">
            {/* Restaurants */}
            {meal.restaurants && meal.restaurants.length > 0 && (
              <VStack space="sm">
                {meal.restaurants.map((restaurant) => {
                  const restaurantName = (restaurant as any).name || (restaurant as any).restaurantName || '';
                  const menuLink = (restaurant as any).link || (restaurant as any).menuLink || '';
                  const restaurantId = restaurantName || menuLink || `${Date.now()}`;
                  
                  return (
                    <VStack key={restaurantId} space="xs">
                      <HStack className="items-center" space="xs">
                        <Text style={styles.restaurantName}>
                          {restaurantName} :
                        </Text>
                        {menuLink ? (
                          <TouchableOpacity
                            onPress={() => handleOpenMenu(menuLink)}
                          >
                            <Text style={styles.menuLink}>
                              {menuLink}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </HStack>
                    </VStack>
                  );
                })}
              </VStack>
            )}

            {/* Order Deadline */}
            <VStack space="xs">
              <Text style={styles.deadlineLabel}>{mealStrings.orderDeadline}</Text>
              <HStack className="items-center justify-between">
                <Text style={styles.deadlineText}>
                  {deadlineDate} {deadlineTime}
                </Text>
                {isOrderOpen ? (
                  <Box className="px-3 py-1 rounded-full">
                    <GradientButton
                      title={mealStrings.open}
                      onPress={() => {
                        const firstRestaurant = meal.restaurants?.[0];
                        if (firstRestaurant) {
                          const menuLink = (firstRestaurant as any).link || (firstRestaurant as any).menuLink || '';
                          if (menuLink) {
                            handleOpenMenu(menuLink);
                          }
                        }
                      }}
                      size="small"
                      textStyle={styles.openButtonText}
                      gradientStyle={styles.gradientButton}
                    />
                  </Box>
                ) : (
                  <Box
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: Colors.mediumGray }}
                  >
                    <Text style={styles.closedButtonText}>
                      {mealStrings.closed}
                    </Text>
                  </Box>
                )}
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Select Restaurant */}
        {showRestaurantDropdown && (
          <VStack className="px-6 mb-4" space="xs">
            <Text style={styles.label}>{mealStrings.selectRestaurant}</Text>
            <Dropdown
              label=""
              placeholder={mealStrings.selectRestaurantPlaceholder}
              options={restaurantOptions}
              value={selectedRestaurant}
              onValueChange={(selectedValue) => {
                if (typeof selectedValue === 'string') {
                  setSelectedRestaurant(selectedValue);
                }
              }}
            />
          </VStack>
        )}

        {/* Food Order */}
        <VStack className="px-6 mb-6" space="xs">
          <Text style={styles.label}>{mealStrings.foodOrder}</Text>
          <Input
            className="bg-white border border-gray-200 rounded-lg"
            style={styles.textArea}
          >
            <InputField
              value={foodOrder}
              onChangeText={setFoodOrder}
              placeholder={mealStrings.foodOrderPlaceholder}
              multiline={true}
              numberOfLines={4}
              className="text-base font-body text-black"
              style={styles.textAreaField}
            />
          </Input>
        </VStack>
      </ScrollView>

      {/* Submit Button */}
      <Box className="px-6 pb-6">
        <GradientButton
          title={isEditMode ? mealStrings.update : mealStrings.submit}
          onPress={handleSubmit}
          loading={isSubmitting || isUpdating}
          disabled={!foodOrder.trim() || isSubmitting || isUpdating || (showRestaurantDropdown && !selectedRestaurant)}
          size="large"
        />
      </Box>

      <ToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    overflow: 'hidden',
    marginBottom: 25,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 20,
  },
  infoCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Medium',
  },
  menuLink: {
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontFamily: 'AvenirLTPro-Roman',
  },
  deadlineLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Medium',
  },
  deadlineText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Roman',
  },
  openButtonText: {
    fontSize: 12,
    fontFamily: 'AvenirLTPro-Medium',
    fontWeight: 900,
  },
  gradientButton: {
    borderRadius: 50,
    height: 28,
    width: 60,
    marginTop: 0,
  },
  closedButtonText: {
    fontSize: 12,
    fontFamily: 'AvenirLTPro-Medium',
    fontWeight: '900',
    color: Colors.white,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Medium',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 120,
  },
  textAreaField: {
    textAlignVertical: 'top',
    paddingTop: 12,
    minHeight: 120,
  },
});

export default SubmitMeal;

