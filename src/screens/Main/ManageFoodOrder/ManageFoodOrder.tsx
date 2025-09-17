import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ExpandableFab, Header } from '@/src/components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MainNavigationProps, MainStackParams } from '@/src/types/allRoutes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/configs/CustomTheme';

type ManageFoodOrderRouteProp = RouteProp<MainStackParams, 'ManageFoodOrder'>;

const ManageFoodOrder: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<ManageFoodOrderRouteProp>();

  const { tripName, tripStartDate, tripEndDate, tripId } = route.params;

  const handleAddMeal = () => {
    // TODO: Navigate to add meal screen or show modal
    console.log('Add meal pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Manage Food Order"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Box className="px-5 py-4">
          <VStack space="sm" className="mb-6">
            <HStack className="justify-between items-center">
              <Text className="text-lg font-heading text-gray-800">
                {tripName}
              </Text>
              <Text className="text-sm text-gray-500">
                {tripStartDate} - {tripEndDate}
              </Text>
            </HStack>
          </VStack>

          <VStack
            className="items-center justify-center"
            style={styles.emptyState}
          >
            <Box className="items-center justify-center mb-6">
              <Box style={styles.foodIconContainer}>
                <Ionicons name="restaurant" size={60} color={Colors.primary} />
              </Box>
            </Box>

            <Text className="text-xl font-heading text-gray-800 mb-2">
              No Meal Added
            </Text>

            <Text className="text-base text-gray-600 text-center px-8">
              Once added, All traveler meals will be visible
            </Text>
          </VStack>
        </Box>
      </ScrollView>
      <ExpandableFab
        actions={[
          {
            id: 'export',
            title: 'Export Itinerary',
            icon: 'arrow-up-outline',
            color: Colors.dogerBlue,
            onPress: handleAddMeal,
          },
          {
            id: 'travel',
            title: 'Travel',
            icon: 'airplane-outline',
            color: '#50C878',
            onPress: handleAddMeal,
          },
        ]}
      />
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    minHeight: height * 0.4,
    paddingVertical: 40,
  },
  foodIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  addButton: {
    marginVertical: 0,
  },
});

export default ManageFoodOrder;
