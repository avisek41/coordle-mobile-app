import React, { useEffect, useState } from 'react';
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
import { useGetTripByIdQuery, useDeleteTripMutation } from '@/src/services';
import { Loader, CustomAlert } from '@/src/components';
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

  const {
    data: tripData,
    isLoading,
    error,
    refetch,
  } = useGetTripByIdQuery(tripId);
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
    if (feature === 'Documents') {
      navigation.navigate('TripDocuments', {
        tripId: trip._id,
        tripTitle: trip.name,
      });
    } else {
      // TODO: Navigate to respective feature screens
      showToast({
        type: 'info',
        title: feature,
        message: `${feature} ${tripDetailsStrings.featureComingSoon}`,
        duration: 2000,
      });
    }
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

  const handleDeletePress = () => {
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setShowDeleteAlert(false);
      await deleteTrip(tripId).unwrap();

      showToast({
        type: 'success',
        title: 'Success',
        message: tripDetailsStrings.deleteTripSuccess,
        duration: 2000,
      });

      // Navigate to MyTrips after successful deletion
      navigation.navigate('BottomTabs');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: tripDetailsStrings.deleteTripError,
        duration: 3000,
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    if (tripId) {
      refetch();
    }
  }, [tripId]);

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
    <SafeAreaView style={globalStyles.container}>
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
            onAddMembersPress={() =>
              navigation.navigate('AddTripMembers', { tripId: trip._id })
            }
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

      {/* Delete Confirmation Alert */}
      <CustomAlert
        isOpen={showDeleteAlert}
        title={tripDetailsStrings.deleteTripTitle}
        message={tripDetailsStrings.deleteTripMessage}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDestructive={true}
      />
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
