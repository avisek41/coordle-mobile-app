import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import { useGetTripByIdQuery } from '@/src/services';
import { Loader } from '@/src/components';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useAppSelector } from '@/src/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { tripDetailsStrings } from './strings';
import TripHeader from './TripHeader';
import ItineraryCard from './ItineraryCard';
import FeatureGrid from './FeatureGrid';
import CoverImage from './CoverImage';
import { Colors } from '@/src/configs/CustomTheme';
import { globalStyles } from '@/src/styles';

const TripDetails: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'TripDetails'>>();
  const { tripId, isPastTrip = false } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();

  const { userId } = useAppSelector(state => state?.auth);

  const { data: tripData, isLoading, error } = useGetTripByIdQuery(tripId);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    navigation.navigate('CreateTrip', {
      isEditMode: true,
      tripId: trip._id,
    });
  };

  const handleImportItinerary = () => {
    // TODO: Implement import itinerary functionality
    showToast({
      type: 'info',
      title: tripDetailsStrings.importItinerary,
      message: tripDetailsStrings.importComingSoon,
      duration: 2000,
    });
  };

  const handleFeaturePress = (feature: string) => {
    // TODO: Navigate to respective feature screens
    showToast({
      type: 'info',
      title: feature,
      message: `${feature} ${tripDetailsStrings.featureComingSoon}`,
      duration: 2000,
    });
  };

  const handleAddPress = () => {
    // TODO: Show add options
    showToast({
      type: 'info',
      title: 'Add',
      message: tripDetailsStrings.addComingSoon,
      duration: 2000,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !tripData?.data) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Box className="flex-1 justify-center items-center px-5">
          <Text className="text-lg font-body text-gray-600 text-center">
            {tripDetailsStrings.errorMessage}
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  const trip = tripData.data;
  const isOwner = trip.owner_id === userId;
  const userCount = trip.users?.length || 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastComponent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CoverImage
          trip={trip}
          userCount={userCount}
          onBackPress={handleBackPress}
          onEditPress={handleEditPress}
          isPast={isPastTrip}
        />

        <VStack
          className="px-5 py-6 bg-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl -mt-4"
          space="lg"
        >
          <TripHeader
            trip={trip}
            onAddMembersPress={() => handleFeaturePress('Add Trip Members')}
            isPast={isPastTrip}
          />

          <ItineraryCard
            trip={trip}
            isOwner={isOwner}
            onImportPress={handleImportItinerary}
            isPast={isPastTrip}
          />

          <FeatureGrid
            userCount={userCount}
            onFeaturePress={handleFeaturePress}
            isPast={isPastTrip}
          />
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}

      {!isPastTrip && (
        <TouchableOpacity
          onPress={handleAddPress}
          style={styles.fab}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="red" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add space for floating action button
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.white,
    borderRadius: 28,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TripDetails;
