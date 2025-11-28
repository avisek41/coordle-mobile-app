import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';

import { Box, Text, VStack } from '@/components/ui';

import { Header, Loader, GradientButton, CustomAlert } from '@/src/components';
import { MainNavigationProps, MainStackParams } from '@/src/types/allRoutes';
import { Colors } from '@/src/configs/CustomTheme';
import { useGetMealsByTripQuery, useDeleteMealMutation, useGetTripByIdQuery } from '@/src/services';
import { MealDetailCard } from './components';
import { Meal } from '@/src/types/meal';
import { dateFormat } from '@/src/utils/dateTimeFormat';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useAppSelector } from '@/src/hooks';
import { mealStrings } from './string';

type MealDetailRouteProp = RouteProp<MainStackParams, 'MealDetail'>;

const MealDetail: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MealDetailRouteProp>();
  const { tripId, date, tripStartDate, tripEndDate, tripMembersCounts } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const { showToast, ToastComponent } = useSimpleToast();
  const { userId } = useAppSelector(state => state.auth);

  const {
    data: mealsData,
    isLoading,
    refetch,
  } = useGetMealsByTripQuery({
    tripId: tripId || '',
  });

  // Get trip details to check if user is owner or host
  const {
    data: tripData,
    isLoading: isLoadingTrip,
  } = useGetTripByIdQuery(tripId || '', { skip: !tripId });

  const [deleteMeal] = useDeleteMealMutation();

  // Filter meals for the selected date
  const mealsForDate = useMemo(() => {
    if (!mealsData?.data?.meals || !date) return [];

    return mealsData.data.meals.filter((meal) => {
      const mealDate = moment(meal.meal_date).format(dateFormat);
      return mealDate === date;
    });
  }, [mealsData?.data?.meals, date]);

  // Group meals by meal type and sort
  const groupedMeals = useMemo(() => {
    const grouped: { [key: string]: Meal[] } = {};
    
    for (const meal of mealsForDate) {
      const mealType = meal.meal_type.toLowerCase();
      if (!grouped[mealType]) {
        grouped[mealType] = [];
      }
      grouped[mealType].push(meal);
    }

    // Sort meal types in a specific order
    const mealTypeOrder = ['breakfast', 'lunch', 'snack', 'pre-game', 'dinner', 'post-game-dinner'];
    const sorted: Meal[] = [];
    
    for (const type of mealTypeOrder) {
      if (grouped[type]) {
        sorted.push(...grouped[type]);
      }
    }

    return sorted;
  }, [mealsForDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEdit = (mealId: string) => {
    navigation.navigate('AddMeal', {
      tripId: tripId || '',
      tripStartDate,
      tripEndDate,
      mealId,
    });
  };

  const handleDeletePress = (mealId: string) => {
    setMealToDelete(mealId);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mealToDelete) return;

    try {
      await deleteMeal(mealToDelete).unwrap();
      showToast({
        type: 'success',
        title: mealStrings.mealDeleted,
        message: mealStrings.mealDeletedSuccessfully,
        duration: 3000,
      });
      setShowDeleteAlert(false);
      setMealToDelete(null);
      await refetch();
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as any).data === 'object' &&
        (error as any).data !== null &&
        'message' in (error as any).data
          ? ((error as any).data.message as string)
          : mealStrings.failedToDeleteMeal;

      showToast({
        type: 'error',
        title: mealStrings.deleteFailed,
        message: errorMessage,
      });
    }
  };

  const handleAddMeal = () => {
    navigation.navigate('AddMeal', {
      tripId: tripId || '',
      tripStartDate,
      tripEndDate,
    });
  };

  const handleSubmitOrder = (mealId: string) => {
    navigation.navigate('SubmitMeal', { mealId });
  };

  const handleEditOrder = (mealId: string, orderId: string) => {
    navigation.navigate('SubmitMeal', { mealId, orderId });
  };

  const formattedDate = date ? moment(date, dateFormat).format(dateFormat) : '';

  // Check if current user is owner or host
  const trip = tripData?.data;
  const isOwner = trip?.owner_id && userId && String(trip.owner_id) === String(userId);
  const isHost = trip?.hosts?.some(hostId => userId && String(hostId) === String(userId)) || false;
  const canAddMeal = isOwner || isHost;
  const isOwnerOrHost = isOwner || isHost;

  if (isLoading || isLoadingTrip) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={formattedDate}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Box className="flex-1 justify-center items-center">
          <Loader />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={formattedDate}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {groupedMeals.length === 0 ? (
          <VStack className="items-center justify-center py-20 px-6">
            <Text className="text-lg font-body text-gray-500 text-center">
              {mealStrings.noMealsFoundForDate}
            </Text>
          </VStack>
        ) : (
          <VStack className="px-6 py-4">
            {groupedMeals.map((meal) => (
              <MealDetailCard
                tripMembersCounts={tripMembersCounts || 0}
                collectedCount={meal.food_order?.length || 0}
                key={meal._id}
                meal={meal}
                userId={userId}
                isOwnerOrHost={isOwnerOrHost}
                onEdit={handleEdit}
                onDelete={handleDeletePress}
                onSubmitOrder={handleSubmitOrder}
                onEditOrder={handleEditOrder}
                onPress={(mealId) => {
                  navigation.navigate('MealOrderDetail', { mealId });
                }}
              />
            ))}
          </VStack>
        )}
      </ScrollView>

      {/* Add a Meal Button - Only show to trip owners and hosts */}
      {canAddMeal && (
        <View style={styles.buttonContainer}>
          <Box className="px-5 pb-5">
            <GradientButton
              title={mealStrings.addAMeal}
              onPress={handleAddMeal}
              style={styles.addButton}
            />
          </Box>
        </View>
      )}

      <CustomAlert
        isOpen={showDeleteAlert}
        title={mealStrings.areYouSure}
        message={mealStrings.deleteMealConfirmation}
        cancelText={mealStrings.cancel}
        confirmText={mealStrings.deleteAMeal}
        onCancel={() => {
          setShowDeleteAlert(false);
          setMealToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isCreatedAlert={true}
      />

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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  addButton: {
    marginVertical: 0,
  },
});

export default MealDetail;

