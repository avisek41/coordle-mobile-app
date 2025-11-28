import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box, HStack, VStack, Text } from '@/components/ui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Meal } from '@/src/types/meal';
import { Colors } from '@/src/configs/CustomTheme';
import { mealStrings } from '../string';

interface MealCardProps {
  meals: Meal[];
  date: string;
  isToday: boolean;
  onPress: (date: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meals, date, isToday, onPress }) => {
  const formatMealType = (mealType: string): string => {
    // Map meal types to display format
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

  // Get unique meal types for this date and format them
  const mealTypes = meals
    .map(meal => formatMealType(meal.meal_type))
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  const mealTypesDisplay = mealTypes.join(', ');

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isToday && styles.todayCard,
      ]}
      activeOpacity={0.8}
      onPress={() => onPress(date)}
    >
      <HStack className="items-center justify-between">
        <VStack className="flex-1" space="xs">
          <HStack className="items-center" space="sm">
            <Text
              style={[
                styles.dateText,
                isToday && styles.todayDateText,
              ]}
            >
              {date}
            </Text>
            {isToday && (
              <Box style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>{mealStrings.todayLabel}</Text>
              </Box>
            )}
          </HStack>
          <Text style={styles.mealTypesText}>{mealTypesDisplay}</Text>
        </VStack>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isToday ? Colors.primary : Colors.iconGray}
        />
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  todayCard: {
    backgroundColor: '#E6F4F7',
    borderColor: '#51B1C0',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Medium',
    paddingRight: 6,
  },
  todayDateText: {
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: 'AvenirLTPro-Heavy',
  },
  todayBadge: {
    backgroundColor: '#51B1C0',
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  todayBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'AvenirLTPro-Medium',
  },
  mealTypesText: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: 'AvenirLTPro-Roman',
  },
});

export default MealCard;
