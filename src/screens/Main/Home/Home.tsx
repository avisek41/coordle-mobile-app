import React from 'react';
import { SafeAreaView, Linking } from 'react-native';
import {
  useGetCurrentUserProfileQuery,
  useGetBannersQuery,
  useGetTripsQuery,
} from '@/src/services';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Loader, BannerCarousel } from '@/src/components';
import { homeStrings } from './strings';
import Header from './Header';
import NoTrips from './NoTrips';
import TripCard from './TripCard';
import AddNewTripCard from './AddNewTripCard';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';
import { Trip } from '@/src/types/trip';

const Home = () => {
  const navigation = useNavigation<MainNavigationProps>();

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetCurrentUserProfileQuery();

  const {
    data: bannersData,
    isLoading: isBannersLoading,
    error: bannersError,
  } = useGetBannersQuery();

  const {
    data: tripsData,
    isLoading: isTripsLoading,
    error: tripsError,
  } = useGetTripsQuery();

  if (isTripsLoading) {
    return <Loader />;
  }

  const userName =
    userProfile?.data?.preferredName || userProfile?.data?.firstName || 'User';

  const trips = tripsData?.data?.trips || [];
  const hasTrips = trips.length > 0;

  const handleBannerPress = (banner: any) => {
    if (banner.linkUrl) {
      Linking.openURL(banner.linkUrl);
    }
  };

  const handleCreateTrip = () => {
    navigation.navigate('CreateTrip');
  };

  const handleTripPress = (trip: Trip) => {
    // Handle trip press - navigate to trip details
    console.log('Trip pressed:', trip);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header userName={userName} />

      <Box className="flex-1 px-5 pt-6">
        {hasTrips ? (
          <VStack space="lg">
            <AddNewTripCard onPress={handleCreateTrip} />

            <VStack space="md">
              <Text className="text-xl font-heading text-gray-800">
                Upcoming Trip
              </Text>
              {trips.map((trip: Trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onPress={() => handleTripPress(trip)}
                />
              ))}
            </VStack>
          </VStack>
        ) : (
          <NoTrips />
        )}

        <Box className="mt-10">
          <Text className="text-xl font-heading text-black-800 mb-6">
            {homeStrings.mediaTitle}
          </Text>
          {bannersData?.data && bannersData.data.length > 0 && (
            <Box className="mb-6">
              <BannerCarousel
                banners={bannersData?.data || []}
                height={180}
                autoPlay={true}
                autoPlayInterval={4000}
                onBannerPress={handleBannerPress}
              />
            </Box>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
