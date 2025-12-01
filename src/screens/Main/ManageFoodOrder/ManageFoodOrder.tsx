import React, { useState, useMemo } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, View, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';

import { Box, Text, VStack, HStack } from '@/components/ui';

import { GradientButton, Header, Loader } from '@/src/components';
import { MainNavigationProps, MainStackParams } from '@/src/types/allRoutes';
import { Colors } from '@/src/configs/CustomTheme';
import { formatDateRange } from '@/src/utils';
import { images } from '@/src/assets';
import { mealStrings } from './string';
import { useGetMealsByTripQuery, useGetTripByIdQuery } from '@/src/services';
import { MealCard } from './components';
import { Meal } from '@/src/types/meal';
import { dateFormat } from '@/src/utils/dateTimeFormat';
import { globalStyles } from '@/src/styles';
import { useAppSelector } from '@/src/hooks';

type ManageFoodOrderRouteProp = RouteProp<MainStackParams, 'ManageFoodOrder'>;

const ManageFoodOrder: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<ManageFoodOrderRouteProp>();

  const { tripName, tripStartDate, tripEndDate, tripId, tripMembersCounts } = route.params;
  const [refreshing, setRefreshing] = useState(false);
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

  // Group meals by date
  const mealsByDate = useMemo(() => {
    if (!mealsData?.data?.meals) return {};

    const grouped: { [key: string]: Meal[] } = {};
    for (const meal of mealsData.data.meals) {
      const mealDate = moment(meal.meal_date).format(dateFormat);
      if (!grouped[mealDate]) {
        grouped[mealDate] = [];
      }
      grouped[mealDate].push(meal);
    }

    // Sort dates in ascending order
    const sortedDates = Object.keys(grouped).sort((a, b) =>
      moment(a, dateFormat).diff(moment(b, dateFormat))
    );

    const sortedGrouped: { [key: string]: Meal[] } = {};
    for (const date of sortedDates) {
      sortedGrouped[date] = grouped[date];
    }

    return sortedGrouped;
  }, [mealsData?.data?.meals]);

  const mealsList = Object.entries(mealsByDate);
  const todayDate = moment().format(dateFormat);

  // Check if current user is owner or host
  const trip = tripData?.data;
  const isOwner = trip?.owner_id && userId && String(trip.owner_id) === String(userId);
  const isHost = trip?.hosts?.some(hostId => userId && String(hostId) === String(userId)) || false;
  const canAddMeal = isOwner || isHost;

  const handleAddMeal = () => {
    navigation.navigate('AddMeal', {
      tripId,
      tripStartDate,
      tripEndDate,
    });
  };

  const handleMealPress = (date: string) => {
    navigation.navigate('MealDetail', {
      tripId,
      date,
      tripStartDate,
      tripEndDate,
      tripMembersCounts
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading || isLoadingTrip) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={mealStrings.manageFoodOrder}
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
        title="Manage Food Order"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Trip Info */}
      <VStack className="px-6 py-2">
        <HStack className="items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">
            {tripName}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDateRange(tripStartDate, tripEndDate)}
          </Text>
        </HStack>
      </VStack>

      {/* Meals List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {mealsList.length === 0 ? (
          <VStack
            className="items-center justify-center"
            style={styles.emptyState}
          >
            <Box className="items-center justify-center mb-3">
              <Box style={styles.foodIconContainer}>
                <Image source={images.manageFood} className="mb-5" />
              </Box>
            </Box>

            <Text className="text-xl font-bold font-heading text-gray-800 mb-2">
              {mealStrings.noMealAdded}
            </Text>

            <Text className="text-base text-gray-500 text-center">
              {mealStrings.onceAdded}
            </Text>
          </VStack>
        ) : (
          <VStack className="px-6 py-4">
            {mealsList.map(([date, meals]) => (
              <MealCard
                key={date}
                meals={meals}
                date={date}
                isToday={date === todayDate}
                onPress={handleMealPress}
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
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

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
    paddingBottom: 100, // Add space for bottom button
  },
  emptyState: {
    minHeight: height * 0.5,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default ManageFoodOrder;
