import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const activityCategories: ActivityCategory[] = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: 'restaurant-outline',
    color: Colors.primary,
  },
  {
    id: 'museum',
    name: 'Museum',
    icon: 'library-outline',
    color: Colors.primary,
  },
  { id: 'event', name: 'Event', icon: 'ticket-outline', color: Colors.primary },
  { id: 'relax', name: 'Relax', icon: 'leaf-outline', color: Colors.primary },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'bag-outline',
    color: Colors.primary,
  },
  { id: 'kids', name: 'Kids', icon: 'car-outline', color: Colors.primary },
  {
    id: 'meeting',
    name: 'Meeting',
    icon: 'calendar-outline',
    color: Colors.primary,
  },
  { id: 'tour', name: 'Tour', icon: 'map-outline', color: Colors.primary },
  {
    id: 'bar',
    name: 'Bar & Party',
    icon: 'wine-outline',
    color: Colors.primary,
  },
  {
    id: 'training',
    name: 'Training',
    icon: 'trophy-outline',
    color: Colors.primary,
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'fitness-outline',
    color: Colors.primary,
  },
  {
    id: 'concert',
    name: 'Concert',
    icon: 'musical-notes-outline',
    color: Colors.primary,
  },
  {
    id: 'theater',
    name: 'Theater',
    icon: 'theater-masks-outline',
    color: Colors.primary,
  },
  { id: 'other', name: 'Other', icon: 'grid-outline', color: Colors.primary },
];

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

  const renderActivityCategory = (category: ActivityCategory) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => handleCategorySelect(category.id)}
      style={styles.categoryButton}
      activeOpacity={0.7}
    >
      <HStack className="items-center" space="sm">
        <Ionicons
          name={category.icon as any}
          size={24}
          color={category.color}
        />
        <Text className="text-base font-body text-gray-700">
          {category.name}
        </Text>
      </HStack>
    </TouchableOpacity>
  );

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
});

export default AddActivity;
