import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Box, HStack, VStack, Text } from '@/components/ui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { Meal, IFoodOrder } from '@/src/types/meal';
import { Colors } from '@/src/configs/CustomTheme';
import { dateFormat, dateFormatWithDay, timeFormat } from '@/src/utils/dateTimeFormat';
import { CustomActionSheet, ActionItem, GradientButton, GradientText } from '@/src/components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { mealStrings } from '../string';

interface MealDetailCardProps {
  meal: Meal;
  tripMembersCounts: number;
  collectedCount: number;
  userId?: string | null;
  isOwnerOrHost?: boolean;
  onEdit: (mealId: string) => void;
  onDelete: (mealId: string) => void;
  onSubmitOrder?: (mealId: string) => void;
  onEditOrder?: (mealId: string, orderId: string) => void;
  onPress?: (mealId: string) => void;
}

const MealDetailCard: React.FC<MealDetailCardProps> = ({ 
  meal, 
  tripMembersCounts, 
  collectedCount, 
  userId,
  isOwnerOrHost = false,
  onEdit, 
  onDelete, 
  onSubmitOrder,
  onEditOrder,
  onPress 
}) => {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const mealDate = moment(meal.meal_date).format(dateFormatWithDay);
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

  // Find current user's order
  const currentUserOrder: IFoodOrder | undefined = meal.food_order?.find((order) => {
    const orderUserId = order.user?._id || order.userId;
    return userId && orderUserId && String(orderUserId) === String(userId);
  });

  const hasUserSubmitted = !!currentUserOrder;

  const handleMenuPress = (event?: any) => {
    // Prevent card navigation when menu is clicked
    if (event) {
      event.stopPropagation?.();
    }
    setIsActionSheetOpen(true);
  };

  const handleActionSheetClose = () => {
    setIsActionSheetOpen(false);
  };

  const handleEdit = () => {
    setIsActionSheetOpen(false);
    onEdit(meal._id);
  };

  const handleDelete = () => {
    setIsActionSheetOpen(false);
    onDelete(meal._id);
  };

  const handleOpenMenu = (link: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const deadlineDate = moment(meal.order_deadline_date_time).format(dateFormat);
  const deadlineTime = moment(meal.order_deadline_date_time).format(timeFormat);
  const mealTypeDisplay = formatMealType(meal.meal_type);
  
  // Check if order deadline has passed
  const isOrderOpen = moment(meal.order_deadline_date_time).isAfter(moment());
  
  // Check if user can edit their order
  const canEditOrder = hasUserSubmitted && isOrderOpen && userId;

  const actionItems: ActionItem[] = 
    isOrderOpen ? [{
      id: 'edit',
      title: mealStrings.edit,
      onPress: handleEdit
    },
    {
      id: 'delete',
      title: mealStrings.delete,
      onPress: handleDelete
    }]:[{
      id: 'delete',
      title: mealStrings.delete,
      onPress: handleDelete
    }];

  const handleSubmitOrder = () => {
    if (onSubmitOrder) {
      onSubmitOrder(meal._id);
    } else if (onPress) {
      onPress(meal._id);
    }
  };

  const handleEditUserOrder = () => {
    if (currentUserOrder && onEditOrder) {
      onEditOrder(meal._id, currentUserOrder._id);
    } else if (onPress) {
      onPress(meal._id);
    }
  };

  return (
    <>
      <Box style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => isOwnerOrHost && onPress && onPress(meal._id)}
          style={styles.cardContent}
        >
          <VStack space="md">
            {/* Header with meal type and menu (only for owners/hosts) */}
            <HStack className="items-center justify-between">
              <Text style={styles.mealTypeText}>{mealTypeDisplay}</Text>
              {isOwnerOrHost && (
                <TouchableOpacity
                  onPress={handleMenuPress}
                  style={styles.menuButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color={Colors.textGray} />
                </TouchableOpacity>
              )}
            </HStack>

          {/* Restaurants */}
          <VStack space="sm">
            {meal.restaurants && meal.restaurants.length > 0 ? (
              meal.restaurants.map((restaurant) => {
                const restaurantName = (restaurant as any).name || (restaurant as any).restaurantName || '';
                const menuLink = (restaurant as any).link || (restaurant as any).menuLink || '';
                const restaurantId = (restaurant as any)._id || restaurantName || menuLink;
                
                return (
                  <VStack key={restaurantId} space="xs">
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
                  </VStack>
                );
              })
            ) : null}
          </VStack>

          {/* Order Deadline */}
          <VStack space="xs">
            <Text style={styles.deadlineLabel}>{mealStrings.orderDeadlineLabel}</Text>
            <HStack className="items-center justify-between">
              <Text style={styles.deadlineText}>
                {deadlineDate} {deadlineTime}
              </Text>
              
              {/* Status Badge */}
              {isOrderOpen ? (
                <Box className=" rounded-full">
                  <GradientButton
                    title={mealStrings.open}
                    onPress={() => {
                      // Open the first restaurant menu link if available
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
                    style = {styles.openButton}
                    gradientStyle={styles.gradientButton}
                  />
                </Box>
              ) : (
                <Box
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: Colors.mediumGray }}
                >
                  <Text
                    className="text-sm text-center fontFamilyAvenir text-white fontWeight900"
                    style={styles.closedButtonText}
                  >
                    {mealStrings.closed}
                  </Text>
                </Box>
              )}
            </HStack>
          </VStack>

          {/* User Order Section - Only show for travellers */}
          {!isOwnerOrHost && (
            <VStack space="xs" style={styles.userOrderSection}>
              {hasUserSubmitted && (
                // User has submitted order - show with edit icon
                <HStack className="items-center justify-between">
                  <VStack className="flex-1 items-left" space="xs">
                    <HStack className="items-left" space="xs">
                      <Text style={styles.yourOrderText}>{mealStrings.yourOrder}</Text>
                      <Text style={styles.yourOrderLabel}>
                        {currentUserOrder?.name || mealStrings.noRestaurantSpecified}
                      </Text>
                    </HStack>
                    <Text style={styles.yourOrderLabel} numberOfLines={2}>
                      {currentUserOrder?.meal || mealStrings.noMealSpecified}
                    </Text>
                  </VStack>
                  {canEditOrder && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditUserOrder();
                      }}
                      style={styles.editIconButton}
                      activeOpacity={0.7}
                    >
                      <AntDesign name="edit" size={24} color={Colors.textGray} />
                    </TouchableOpacity>
                  )}
                </HStack>
              )}
              {!hasUserSubmitted && isOrderOpen && (
                // User hasn't submitted - show submit option
                <HStack className="items-center justify-between">
                  <Text style={styles.submitPromptText}>
                    {mealStrings.pleaseSubmitYourOrder}
                  </Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSubmitOrder();
                    }}
                    className="p-1.5 px-3 border border-primary-500 rounded-md bg-white items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <GradientText
                      text={mealStrings.submit}
                      textStyle={styles.submitButtonText}
                    />
                  </TouchableOpacity>
                </HStack>
              )}
            </VStack>
          )}

          {/* Order Stats - Only show for owners/hosts */}
          {isOwnerOrHost && (
            <HStack className="items-center justify-between" style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {mealStrings.orderCollected} <Text style={styles.statsTextCount}>{collectedCount > 10 || collectedCount === 0 ? collectedCount : '0'+ collectedCount   }</Text>
              </Text>
              <Text style={styles.statsText}>
                {mealStrings.pendingLabel} <Text style={styles.statsTextCount}>{(tripMembersCounts - collectedCount) > 10 || (tripMembersCounts - collectedCount) === 0 ? (tripMembersCounts - collectedCount) : '0'+(tripMembersCounts - collectedCount)}</Text>
              </Text>
            </HStack>
          )}
        </VStack>
        </TouchableOpacity>
      </Box>

      <CustomActionSheet
        isOpen={isActionSheetOpen}
        onClose={handleActionSheetClose}
        title={mealTypeDisplay+ ' - '+ mealDate}
        actions={actionItems}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  mealTypeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Heavy',
  },
  menuButton: {
    padding: 4,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textGray,
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
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Medium',
  },
  deadlineText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Roman',
  },
  openButton: {
    height: 28,
    marginTop: 0,
  },
  openButtonText: {
    fontSize: 12,
    fontFamily: 'AvenirLTPro-Medium',
    fontWeight: 900,
  },
  statsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
  statsTextCount: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Roman',
    fontWeight: 700,
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
  userOrderSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
    marginTop: 8,
  },
  yourOrderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    fontFamily: 'AvenirLTPro-Medium',
    flex: 1,
    alignItems: 'flex-start',
  },
  yourOrderText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
  editIconButton: {
    padding: 4,
    marginLeft: 8,
  },
  submitPromptText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'AvenirLTPro-Medium',
  },
});

export default MealDetailCard;

