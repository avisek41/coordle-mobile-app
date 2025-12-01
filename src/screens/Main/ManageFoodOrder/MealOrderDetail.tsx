import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Box, Text, HStack, VStack } from '@/components/ui';

import { Header, Loader, GradientButton, GradientAvatar, CustomActionForm, GradientText } from '@/src/components';
import { MainNavigationProps, MainStackParams } from '@/src/types/allRoutes';
import { Colors } from '@/src/configs/CustomTheme';
import { useGetMealByIdQuery, useSubmitMealOrderMutation, useUpdateMealOrderMutation, useGetTripByIdQuery, useGetTripMembersQuery } from '@/src/services';
import { IFoodOrder } from '@/src/types/meal';
import { dateFormat, timeFormat } from '@/src/utils/dateTimeFormat';
import { globalStyles } from '@/src/styles';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useAppSelector } from '@/src/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { images } from '@/src/assets';
import { mealStrings } from './string';


type MealOrderDetailRouteProp = RouteProp<MainStackParams, 'MealOrderDetail'>;

const MealOrderDetail: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MealOrderDetailRouteProp>();
  const { mealId } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Collected' | 'Pending'>('Collected');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<{ orderId: string; name: string; foodOrder: string } | null>(null);
  const { showToast, ToastComponent } = useSimpleToast();
  const { userId } = useAppSelector(state => state.auth);

  const {
    data: mealData,
    isLoading,
    error,
    refetch,
  } = useGetMealByIdQuery(mealId);

  const mealDataValue = mealData?.data;
  const tripId = mealDataValue?.trip_id;

  // Get trip details to check owner/host
  const {
    data: tripData,
    isLoading: isLoadingTrip,
  } = useGetTripByIdQuery(tripId || '', { skip: !tripId });

  // Get trip members for pending tab
  const {
    data: tripMembersData,
    isLoading: isLoadingMembers,
  } = useGetTripMembersQuery(tripId || '', { skip: !tripId });

  const [submitMealOrder, { isLoading: isSubmitting }] = useSubmitMealOrderMutation();
  const [updateMealOrder, { isLoading: isUpdating }] = useUpdateMealOrderMutation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatMealType = (mealType: string): string => {
    const mealTypeMap: { [key: string]: string } = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      'pre-game': 'Pre Game',
      'post-game-dinner': 'Post Game Dinner',
      snack: 'Snack',
    };
    return mealTypeMap[mealType.toLowerCase()] || mealType;
  };

  const handleOpenMenu = (link: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  if (isLoading || isLoadingTrip || isLoadingMembers) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={mealStrings.loading}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Box className="flex-1 justify-center items-center">
          <Loader />
        </Box>
      </SafeAreaView>
    );
  }

  if (error || !mealDataValue) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Header
          title={mealStrings.error}
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

  const meal = mealDataValue;
  const trip = tripData?.data;
  const tripMembers = tripMembersData?.data?.members || [];
  const mealTypeDisplay = formatMealType(meal.meal_type);
  const mealDate = moment(meal.meal_date).format(dateFormat);
  const headerTitle = `${mealTypeDisplay} - ${mealDate}`;
  const deadlineDate = moment(meal.order_deadline_date_time).format(dateFormat);
  const deadlineTime = moment(meal.order_deadline_date_time).format(timeFormat);
  const isOrderOpen = moment(meal.order_deadline_date_time).isAfter(moment());

  // Collected orders - all food orders that have been submitted
  const collectedOrders: IFoodOrder[] = meal.food_order || [];
  const collectedCount = collectedOrders.length;

  // Check if there are multiple restaurants
  const hasMultipleRestaurants = meal.restaurants && meal.restaurants.length > 1;

  // Group orders by restaurant name if there are multiple restaurants
  const ordersByRestaurant = hasMultipleRestaurants
    ? collectedOrders.reduce((acc, order) => {
        const restaurantName = order.name || mealStrings.other;
        if (!acc[restaurantName]) {
          acc[restaurantName] = [];
        }
        acc[restaurantName].push(order);
        return acc;
      }, {} as Record<string, IFoodOrder[]>)
    : null;

  // Get user IDs who have submitted orders - convert to strings for consistent comparison
  const submittedUserIds = new Set(
    collectedOrders
      .map(order => order.user?._id || order.userId)
      .filter(Boolean)
      .map(String)
  );

  // Check if current user has already submitted an order
  const hasCurrentUserSubmitted = userId ? submittedUserIds.has(String(userId)) : false;

  // Pending members - trip members who haven't submitted orders
  const pendingMembers = tripMembers.filter(
    member => !submittedUserIds.has(String(member.userId))
  );
  const pendingCount = pendingMembers.length;

  const handleSubmitMeal = () => {
    setEditingOrder(null);
    setShowSubmitForm(true);
  };

  const handleEditOrder = (order: IFoodOrder) => {
    setEditingOrder({
      orderId: order._id,
      name: order.name || '',
      foodOrder: order.meal || '',
    });
    setShowSubmitForm(true);
  };

  const handleFormSubmit = async (foodOrder: string, _restaurant?: string) => {
    if (!foodOrder.trim()) {
      showToast({
        type: 'error',
        title: mealStrings.validationError,
        message: mealStrings.pleaseEnterFoodOrder,
        duration: 3000,
      });
      return;
    }

    // Check if deadline has passed
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
      if (editingOrder) {
        // Update existing order - use restaurant from form if provided, otherwise from order, otherwise first restaurant
        const restaurantName = _restaurant || editingOrder.name || meal.restaurants?.[0]?.name || '';
        await updateMealOrder({
          mealId,
          orderId: editingOrder.orderId,
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
        console.log('Meal Submitted');
        // Submit new order - need to get restaurant name from form or first restaurant
        const restaurantName = _restaurant || meal.restaurants?.[0]?.name || '';
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

      setShowSubmitForm(false);
      setEditingOrder(null);
      await refetch();
    } catch (submitError: unknown) {
      const errorMessage =
        typeof submitError === 'object' &&
        submitError !== null &&
        'data' in submitError &&
        typeof (submitError as any).data === 'object' &&
        (submitError as any).data !== null &&
        'message' in (submitError as any).data
          ? ((submitError as any).data.message as string)
          : editingOrder
            ? mealStrings.failedToUpdateOrder
            : mealStrings.failedToSubmitOrder;

      showToast({
        type: 'error',
        title: editingOrder ? mealStrings.updateFailed : mealStrings.submissionFailed,
        message: errorMessage,
      });
    }
  };

  const handleFormCancel = () => {
    setShowSubmitForm(false);
    setEditingOrder(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue]}
            tintColor={Colors.blue}
          />
        }
        nestedScrollEnabled={true}
      >
        {/* Cover Image */}
        <Box className="relative">
          <Image source={images.cover} style={styles.coverImage} />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header
              title={headerTitle}
              onBackPress={() => navigation.goBack()}
              showBackButton={true}
              titleStyle={styles.headerTitle}
              iconColor={Colors.white}
            />
          </Box>
        </Box>

        {/* Meal Content */}
        <VStack className="flex-1 px-6" style={styles.contentCard}>
          {/* Restaurant and Deadline Info Card */}
          <Box style={styles.infoCard}>
            <VStack space="md">
              {/* Restaurant Info */}
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

          {/* Order Summary Section */}
          <VStack className="py-4" space="md">
          <Text style={styles.orderSummaryTitle}>{mealStrings.orderSummary}</Text>

          {/* Tabs */}
          <HStack className="items-center" space="lg">
            <TouchableOpacity
              onPress={() => setActiveTab('Collected')}
              style={styles.tabButton}
            >
              <HStack className="items-center" space="xs">
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'Collected' && styles.activeTabText,
                  ]}
                >
                  {mealStrings.collected}
                </Text>
                <Box
                  style={[
                    styles.badge,
                    activeTab === 'Collected'
                      ? styles.activeBadge
                      : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      activeTab === 'Collected'
                        ? styles.activeBadgeText
                        : styles.inactiveBadgeText,
                    ]}
                  >
                    {collectedCount > 10 || collectedCount === 0 ? collectedCount : '0'+collectedCount}
                  </Text>
                </Box>
              </HStack>
              {activeTab === 'Collected' && (
                <Box style={styles.tabIndicator} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('Pending')}
              style={styles.tabButton}
            >
              <HStack className="items-center" space="xs">
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'Pending' && styles.activeTabText,
                  ]}
                >
                  {mealStrings.pending}
                </Text>
                <Box
                  style={[
                    styles.badge,
                    activeTab === 'Pending'
                      ? styles.activeBadge
                      : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      activeTab === 'Pending'
                        ? styles.activeBadgeText
                        : styles.inactiveBadgeText,
                    ]}
                  >
                    {pendingCount > 10 || pendingCount === 0 ? pendingCount : '0'+pendingCount}
                  </Text>
                </Box>
              </HStack>
              {activeTab === 'Pending' && (
                <Box style={styles.tabIndicator} />
              )}
            </TouchableOpacity>
          </HStack>

          {/* Orders List */}
          <VStack space="md" className="mt-4">
            {activeTab === 'Collected' && (
              <>
                {collectedOrders.length > 0 ? (
                  <>
                    {hasMultipleRestaurants && ordersByRestaurant ? (
                      // Group by restaurant when multiple restaurants exist
                      // Sort restaurants by name for consistent ordering
                      Object.entries(ordersByRestaurant)
                        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                        .map(([restaurantName, orders]) => (
                        <VStack key={restaurantName} space="md">
                          {/* Restaurant Heading */}
                          <Text style={styles.restaurantHeading}>{restaurantName}</Text>
                          {/* Orders for this restaurant */}
                          {orders.map((order: IFoodOrder) => {
                            // Get user ID from order - prioritize user._id from food_order.user object
                            const orderUserId = order.user?._id || order.userId || '';

                            // Check if current logged-in user matches the food_order user
                            // Compare user IDs as strings to ensure proper matching
                            const isCurrentUserOrder = userId && orderUserId && String(orderUserId) === String(userId);

                            // Allow edit only if:
                            // 1. Current user ID matches food_order user._id
                            // 2. Order deadline (meal.order_deadline_date_time) has not been exceeded
                            const canEdit = isCurrentUserOrder && isOrderOpen;

                            // Check if user is owner or host
                            const isOwner = trip?.owner_id && String(trip.owner_id) === String(orderUserId);
                            const isHost = trip?.hosts?.some(hostId => String(hostId) === String(orderUserId)) || false;
                            const showHostBadge = isOwner || isHost;
                            
                            // Get user name with proper fallback
                            const userName = order.user?.preferredName || order.user?.email?.split('@')[0] || mealStrings.user;
                            const userImage = order.user?.profilePhotoURL || '';
                            
                            return (
                              <Box key={order._id} style={styles.orderCard}>
                                <HStack className="items-center justify-between">
                                  <HStack className="items-center flex-1" space="md">
                                    <GradientAvatar
                                      userName={userName}
                                      userImage={userImage}
                                      size="small"
                                    />
                                    <VStack className="flex-1" space="xs">
                                      <HStack className="items-center gap-4" space="xs">
                                        <Text style={styles.userName}>
                                          {userName}
                                        </Text>
                                        {showHostBadge && (
                                          <HStack
                                            className="items-center"
                                            space="xs"
                                          >
                                            <Box style={styles.hostDot} />
                                            <Text style={styles.hostBadgeText}>
                                              {mealStrings.hostText}
                                            </Text>
                                          </HStack>
                                        )}
                                      </HStack>
                                      <Text style={styles.orderText}>
                                        {order.meal || mealStrings.noMealSpecified}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  {canEdit && (
                                    <TouchableOpacity
                                      onPress={() => handleEditOrder(order)}
                                      style={styles.editButton}
                                      activeOpacity={0.7}>
                                      <AntDesign name="edit" size={20} color={Colors.textGray} />
                                    </TouchableOpacity>
                                  )}
                                </HStack>
                              </Box>
                            );
                          })}
                        </VStack>
                      ))
                    ) : (
                      // Flat list when single restaurant or no grouping needed
                      collectedOrders.map((order: IFoodOrder) => {
                        // Get user ID from order - prioritize user._id from food_order.user object
                        const orderUserId = order.user?._id || order.userId || '';

                        // Check if current logged-in user matches the food_order user
                        // Compare user IDs as strings to ensure proper matching
                        const isCurrentUserOrder = userId && orderUserId && String(orderUserId) === String(userId);

                        // Allow edit only if:
                        // 1. Current user ID matches food_order user._id
                        // 2. Order deadline (meal.order_deadline_date_time) has not been exceeded
                        const canEdit = isCurrentUserOrder && isOrderOpen;

                        // Check if user is owner or host
                        const isOwner = trip?.owner_id && String(trip.owner_id) === String(orderUserId);
                        const isHost = trip?.hosts?.some(hostId => String(hostId) === String(orderUserId)) || false;
                        const showHostBadge = isOwner || isHost;
                        
                        // Get user name with proper fallback
                        const userName = order.user?.preferredName || order.user?.email?.split('@')[0] || mealStrings.user;
                        const userImage = order.user?.profilePhotoURL || '';
                        
                        return (
                          <Box key={order._id} style={styles.orderCard}>
                            <HStack className="items-center justify-between">
                              <HStack className="items-center flex-1" space="md">
                                <GradientAvatar
                                  userName={userName}
                                  userImage={userImage}
                                  size="small"
                                />
                                <VStack className="flex-1" space="xs">
                                  <HStack className="items-center gap-4" space="xs">
                                    <Text style={styles.userName}>
                                      {userName}
                                    </Text>
                                    {showHostBadge && (
                                      <HStack
                                        className="items-center"
                                        space="xs"
                                      >
                                        <Box style={styles.hostDot} />
                                        <Text style={styles.hostBadgeText}>
                                          {mealStrings.hostText}
                                        </Text>
                                      </HStack>
                                    )}
                                  </HStack>
                                  <Text style={styles.orderText}>
                                    {order.meal || mealStrings.noMealSpecified}
                                  </Text>
                                </VStack>
                              </HStack>
                              {canEdit && (
                                <TouchableOpacity
                                  onPress={() => handleEditOrder(order)}
                                  style={styles.editButton}
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="create-outline" size={20} color={Colors.primary} />
                                </TouchableOpacity>
                              )}
                            </HStack>
                          </Box>
                        );
                      })
                    )}
                  </>
                ) : (
                  <Box className="py-8 items-center">
                    <Text style={styles.emptyText}>
                      {mealStrings.noCollectedOrdersYet}
                    </Text>
                  </Box>
                )}
              </>
            )}
            {activeTab === 'Pending' && (
              <>
                {pendingMembers.length > 0 ? (
                  <Box style={styles.pendingListContainer}>
                    {pendingMembers.map((member, index) => {
                      // Check if user is owner or host - compare as strings
                      const memberUserId = String(member.userId);
                      const isOwner = trip?.owner_id && String(trip.owner_id) === memberUserId;
                      const isHost = trip?.hosts?.some(hostId => String(hostId) === memberUserId) || false;
                      const showHostBadge = isOwner || isHost;
                      
                      // Get user name with proper fallback
                      const userName = member.preferredName || member.email?.split('@')[0] || mealStrings.user;
                      
                      return (
                        <React.Fragment key={member.userId}>
                          <Box style={styles.pendingMemberItem}>
                            <HStack className="items-center" space="md">
                              <GradientAvatar
                                userName={userName}
                                userImage={member?.profilePhotoURL || ''}
                                size="small"
                              />
                              <HStack className="items-center gap-4" space="xs">
                                <Text style={styles.pendingMemberName}>
                                  {userName}
                                </Text>
                                {showHostBadge && (
                                  <HStack
                                    className="items-center"
                                    space="xs"
                                  >
                                    <Box style={styles.hostDot} />
                                    <Text style={styles.pendingHostBadge}>
                                      {mealStrings.hostText}
                                    </Text>
                                  </HStack>
                                )}
                              </HStack>
                            </HStack>
                            {index < pendingMembers.length - 1 && (
                              <Box style={styles.pendingSeparator} />
                            )}
                          </Box>
                        </React.Fragment>
                      );
                    })}
                  </Box>
                ) : (
                  <Box className="py-8 items-center">
                    <Text style={styles.emptyText}>
                      {mealStrings.noPendingOrders}
                    </Text>
                  </Box>
                )}
              </>
            )}
          </VStack>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Submit Your Meal Button - Only show if order is open and user hasn't submitted yet */}
      {isOrderOpen && !hasCurrentUserSubmitted && (
          <Box className="px-5 pb-5">
            <TouchableOpacity
              className="py-3 px-3 border border-primary-500 rounded-md bg-white items-center justify-center"
              onPress={handleSubmitMeal}>
              <GradientText
                text={mealStrings.submitYourMeal}
                textStyle={styles.submitYourMealGradientText}
              />
            </TouchableOpacity>
          </Box>
      )}

      <CustomActionForm
        isOpen={showSubmitForm}
        onClose={handleFormCancel}
        title={editingOrder ? mealStrings.editYourMeal : mealStrings.submitYourMeal}
        label={mealStrings.foodOrder}
        placeholder={mealStrings.foodOrderPlaceholder}
        initialValue={editingOrder?.foodOrder || ''}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        submitButtonText={editingOrder ? mealStrings.update : mealStrings.submit}
        cancelButtonText={mealStrings.cancel}
        isLoading={isSubmitting || isUpdating}
        multiline={true}
        restaurants={meal.restaurants}
        selectedRestaurant={editingOrder?.name}
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
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  headerTitle: {
    color: Colors.white,
  },
  contentCard: {
    marginTop: -50,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: Colors.textGray,
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
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Heavy',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Medium',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  inactiveBadge: {
    backgroundColor: Colors.mediumGray,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'AvenirLTPro-Medium',
  },
  activeBadgeText: {
    color: Colors.white,
  },
  inactiveBadgeText: {
    color: Colors.white,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Medium',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    fontFamily: 'AvenirLTPro-Medium',
  },
  orderText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
  hostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  hostDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textGray || '#6B7280',
  },
  hostBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    fontFamily: 'AvenirLTPro-Medium',
  },
  submitButton: {
    marginVertical: 0,
  },
  submitYourMealGradientText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
  restaurantHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Heavy',
    marginBottom: 8,
  },
  pendingListContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    overflow: 'hidden',
  },
  pendingMemberItem: {
    paddingVertical: 16,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  pendingMemberName: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Roman',
  },
  pendingHostBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: 'AvenirLTPro-Heavy',
  },
  pendingSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: Colors.borderGray,
  },
});

export default MealOrderDetail;

