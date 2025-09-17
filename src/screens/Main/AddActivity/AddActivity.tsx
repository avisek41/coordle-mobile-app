import React, { useState } from 'react';
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
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
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
  const { showToast, ToastComponent } = useSimpleToast();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);

    const selectedActivity = activityCategories.find(c => c.id === categoryId);
    showToast({
      type: 'success',
      title: 'Activity Selected',
      message: `${selectedActivity?.name} activity type selected`,
      duration: 2000,
    });

    // Navigate back after selection
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const renderActivityCategory = (category: ActivityCategory) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => handleCategorySelect(category.id)}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      activeOpacity={0.7}
    >
      <HStack className="items-center" space="sm">
        <Ionicons
          name={category.icon as any}
          size={24}
          color={selectedCategory === category.id ? '#FFFFFF' : category.color}
        />
        <Text
          className={`text-base font-body ${
            selectedCategory === category.id ? 'text-white' : 'text-gray-700'
          }`}
        >
          {category.name}
        </Text>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <ToastComponent />

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

          {selectedCategory && (
            <Box
              className="mt-6 p-4 rounded-lg border"
              style={{
                backgroundColor: `${Colors.primary}15`,
                borderColor: `${Colors.primary}40`,
              }}
            >
              <Text
                className="text-center font-body"
                style={{ color: Colors.primary }}
              >
                Selected:{' '}
                {activityCategories.find(c => c.id === selectedCategory)?.name}
              </Text>
            </Box>
          )}
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
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});

export default AddActivity;
