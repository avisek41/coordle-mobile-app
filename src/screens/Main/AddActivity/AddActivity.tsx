import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Header } from '@/src/components';
import { globalStyles } from '@/src/styles';
import { Colors } from '@/src/configs/CustomTheme';
import { addActivityIcons } from '@/src/assets';
interface ActivityCategory {
  id: string;
  name: string;
  color: string;
}

const activityCategories: ActivityCategory[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    color: Colors.primary,
  },
  {
    id: 'tour',
    name: 'Tour',
    color: Colors.primary,
  },
  {
    id: 'museum',
    name: 'Museum',
    color: Colors.primary,
  },
  {
    id: 'bar',
    name: 'Bar & Party',
    color: Colors.primary,
  },
  {
    id: 'event',
    name: 'Event',
    color: Colors.primary,
  },
  {
    id: 'training',
    name: 'Training',
    color: Colors.primary,
  },
  {
    id: 'relax',
    name: 'Relax',
    color: Colors.primary,
  },
  {
    id: 'fitness',
    name: 'Fitness',
    color: Colors.primary,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: Colors.primary,
  },
  {
    id: 'concert',
    name: 'Concert',
    color: Colors.primary,
  },
  {
    id: 'kids',
    name: 'Kids',
    color: Colors.primary,
  },
  {
    id: 'theater',
    name: 'Theater',
    color: Colors.primary,
  },
  {
    id: 'meeting',
    name: 'Meeting',
    color: Colors.primary,
  },
  {
    id: 'misc',
    name: 'Misc',
    color: Colors.primary,
  },
  {
    id: 'other',
    name: 'Other',
    color: Colors.primary,
  },
];

/**
 * Maps category id to the corresponding image key in addActivityIcons
 */
const getCategoryImage = (categoryId: string) => {
  const imageMap: Record<string, keyof typeof addActivityIcons> = {
    restaurant: 'restaurant',
    tour: 'tour',
    museum: 'museum',
    bar: 'bar_and_party',
    event: 'event',
    training: 'training',
    relax: 'relax',
    fitness: 'fitness',
    shopping: 'shopping',
    concert: 'concert',
    kids: 'kids',
    theater: 'theater',
    meeting: 'meeting',
    misc: 'misc',
    other: 'other',
  };

  const imageKey = imageMap[categoryId];
  return imageKey ? addActivityIcons[imageKey] : addActivityIcons.other;
};

const AddActivity: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'AddActivity'>>();
  const { tripId, tripName } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (categoryId: string) => {
    const selectedActivity = activityCategories.find(c => c.id === categoryId);

    // Navigate to CreateActivity with the selected activity name
    navigation.navigate('CreateActivity', {
      tripId,
      tripName,
      activityName: selectedActivity?.name || '',
    });
  };

  const renderActivityCategory = (category: ActivityCategory) => {
    return (
      <TouchableOpacity
        key={category.id}
        onPress={() => handleCategorySelect(category.id)}
        style={styles.categoryButton}
        activeOpacity={0.7}
      >
        <HStack className="items-center" space="sm">
          <Image
            source={getCategoryImage(category.id)}
            style={styles.categoryIcon}
            resizeMode="contain"
          />
          <Text className="text-base font-body text-gray-700">
            {category.name}
          </Text>
        </HStack>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header title="Add Activity" onBackPress={handleBackPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="flex-1"
      >
        <VStack className="px-5 py-2" space="lg">
          <Box className="flex-row flex-wrap justify-between">
            {activityCategories.map((category, index) => (
              <Box
                key={category.id}
                className="w-[48%] mb-4"
                style={{ marginRight: index % 2 === 0 ? '4%' : 0 }}
              >
                {renderActivityCategory(category)}
              </Box>
            ))}
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
  },
});

export default AddActivity;
