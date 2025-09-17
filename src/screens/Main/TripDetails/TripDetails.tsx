import React, { useState } from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { MainNavigationProps, MainRouteProps } from '@/src/types/allRoutes';
import {
  useGetTripByIdQuery,
  useDeleteTripMutation,
  useRemoveParticipantMutation,
} from '@/src/services';
import {
  Loader,
  CustomAlert,
  ExpandableFab,
  GradientButton,
} from '@/src/components';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';
import { useAppSelector } from '@/src/hooks';
import { tripDetailsStrings } from './strings';
import TripHeader from './TripHeader';
import ItineraryCard from './ItineraryCard';
import FeatureGrid from './FeatureGrid';
import CoverImage from './CoverImage';
import { globalStyles } from '@/src/styles';
import { Colors } from '@/src/configs/CustomTheme';

const TripDetails: React.FC = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const route = useRoute<MainRouteProps<'TripDetails'>>();
  const { tripId, isPastTrip = false } = route.params;
  const { showToast, ToastComponent } = useSimpleToast();

  const { userId, userRole } = useAppSelector(state => state?.auth);

  const {
    data: tripData,
    isLoading,
    error,
    refetch,
  } = useGetTripByIdQuery(tripId);
  const [deleteTrip, { isLoading: isDeleting }] = useDeleteTripMutation();
  const [removeParticipant, { isLoading: isRemoving }] =
    useRemoveParticipantMutation();
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
    } else if (feature === tripDetailsStrings.tripMembers) {
      navigation.navigate('TripMembers', {
        tripId: trip._id,
        start: trip.display_start,
        end: trip.display_end,
        isOwner: trip.owner_id === userId,
      });
    } else if (feature === tripDetailsStrings.announcement) {
      navigation.navigate('Announcements', {
        tripId: trip._id,
        tripName: trip.name,
        startDate: trip.display_start,
        endDate: trip.display_end,
      });
    } else if (feature === tripDetailsStrings.poll) {
      navigation.navigate('Poll', {
        tripId: trip._id,
        tripName: trip.name,
      });
    } else if (feature === tripDetailsStrings.manageFoodOrder) {
      navigation.navigate('ManageFoodOrder', {
        tripId: trip._id,
        tripName: trip.name,
        tripStartDate: trip.display_start,
        tripEndDate: trip.display_end,
      });
    } else if (feature === tripDetailsStrings.map) {
      Linking.openURL(
        `https://www.google.com/maps?q=${trip.to_location.latitude},${trip.to_location.longitude}`,
      );
    } else {
      showToast({
        type: 'info',
        title: feature,
        message: `${feature} ${tripDetailsStrings.featureComingSoon}`,
        duration: 2000,
      });
    }
  };

  const handleExportItinerary = () => {
    showToast({
      type: 'info',
      title: 'Export Itinerary',
      message: 'Export functionality coming soon',
      duration: 2000,
    });
  };

  const handleTravel = () => {
    showToast({
      type: 'info',
      title: 'Travel',
      message: 'Travel options coming soon',
      duration: 2000,
    });
  };

  const handleLodging = () => {
    showToast({
      type: 'info',
      title: 'Lodging',
      message: 'Lodging options coming soon',
      duration: 2000,
    });
  };

  const handleActivity = () => {
    showToast({
      type: 'info',
      title: 'Activity',
      message: 'Activity options coming soon',
      duration: 2000,
    });
  };

  const handleExitTrip = async () => {
    if (!userId) {
      showToast({
        type: 'error',
        title: tripDetailsStrings.error,
        message: tripDetailsStrings.userIdNotFound,
        duration: 3000,
      });
      return;
    }

    try {
      await removeParticipant({
        tripId,
        body: { userId },
      }).unwrap();

      showToast({
        type: 'success',
        title: tripDetailsStrings.success,
        message: tripDetailsStrings.exitTripSuccess,
        duration: 2000,
      });

      navigation.navigate('BottomTabs');
    } catch (error: any) {
      showToast({
        type: 'error',
        title: tripDetailsStrings.error,
        message: error?.data?.message || tripDetailsStrings.exitTripError,
        duration: 3000,
      });
    }
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

  useFocusEffect(
    React.useCallback(() => {
      if (tripId) {
        refetch();
      }
    }, [tripId]),
  );

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
          isOwner={isOwner}
        />

        <VStack
          className="px-5 py-6 bg-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl -mt-4"
          space="lg"
        >
          <TripHeader
            trip={trip}
            onAddMembersPress={() =>
              navigation.navigate('AddTripMembers', {
                tripId: trip._id,
                ownerId: trip.owner_id,
              })
            }
            isPast={isPastTrip}
            isOwner={userRole !== 'traveller'}
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
            isOwner={isOwner}
          />
          {userRole !== 'owner' && (
            <GradientButton
              title="Exit Trip"
              loading={isRemoving}
              onPress={handleExitTrip}
            />
          )}
        </VStack>
      </ScrollView>

      {/* Expandable Floating Action Button */}
      {!isPastTrip && (
        <ExpandableFab
          actions={[
            {
              id: 'export',
              title: 'Export Itinerary',
              icon: 'arrow-up-outline',
              color: Colors.dogerBlue,
              onPress: handleExportItinerary,
            },
            {
              id: 'travel',
              title: 'Travel',
              icon: 'airplane-outline',
              color: '#50C878',
              onPress: handleTravel,
            },
            {
              id: 'lodging',
              title: 'Lodging',
              icon: 'bed-outline',
              color: '#4A90E2',
              onPress: handleLodging,
            },
            {
              id: 'activity',
              title: 'Activity',
              icon: 'trending-up-outline',
              color: 'orange',
              onPress: handleActivity,
            },
          ]}
        />
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
});

export default TripDetails;
