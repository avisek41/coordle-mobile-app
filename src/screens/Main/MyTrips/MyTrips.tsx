import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import {
  useGetCurrentUserProfileQuery,
  useGetTripsQuery,
} from '@/src/services';
import { useAppSelector } from '@/src/hooks';
import { selectCurrentUserId } from '@/src/features';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Loader } from '@/src/components';
import { myTripsStrings } from '@/src/screens/Main/MyTrips/strings';
import { Colors } from '@/src/configs/CustomTheme';
import { globalStyles } from '@/src/styles';
import Header from './Header';
import NoData from './NoData';
import UpcomingTrips from './UpcomingTrips';
import PastTrips from './PastTrips';
import { Trip } from '@/src/types/trip';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';

const MyTrips = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetCurrentUserProfileQuery();

  const {
    data: upcomingTripsData,
    isLoading: isUpcomingTripsLoading,
    error: upcomingTripsError,
  } = useGetTripsQuery({ status: 'upcoming' });

  const {
    data: pastTripsData,
    isLoading: isPastTripsLoading,
    error: pastTripsError,
  } = useGetTripsQuery({ status: 'past' });

  if (isProfileLoading || isUpcomingTripsLoading || isPastTripsLoading) {
    return <Loader />;
  }

  const upcomingTrips = upcomingTripsData?.data?.trips || [];
  const pastTrips = pastTripsData?.data?.trips || [];

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box className="flex-1 px-5 pt-3">
        {/* Tabs */}
        <Box className="mb-6">
          <HStack space="sm">
            <TouchableOpacity
              onPress={() => setActiveTab('upcoming')}
              style={{ flex: 1 }}
            >
              <VStack space="xs">
                <GluestackText
                  className={`font-heading ${
                    activeTab === 'upcoming' ? 'font-heading' : 'text-gray-600'
                  }`}
                  style={{
                    color:
                      activeTab === 'upcoming' ? Colors.primary : undefined,
                  }}
                >
                  {myTripsStrings.upcomingTrip}
                </GluestackText>
                {activeTab === 'upcoming' && (
                  <Box
                    className="h-0.5"
                    style={{
                      backgroundColor: Colors.primary,
                      width: '20%',
                    }}
                  />
                )}
              </VStack>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('past')}
              style={{ flex: 1 }}
            >
              <VStack space="xs">
                <GluestackText
                  className={`font-heading ${
                    activeTab === 'past' ? 'font-heading' : 'text-gray-600'
                  }`}
                  style={{
                    color: activeTab === 'past' ? Colors.primary : undefined,
                  }}
                >
                  {myTripsStrings.pastTrip}
                </GluestackText>
                {activeTab === 'past' && (
                  <Box
                    className="h-0.5"
                    style={{
                      backgroundColor: Colors.primary,
                      width: '20%',
                    }}
                  />
                )}
              </VStack>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* Content Area */}
        {activeTab === 'upcoming' ? (
          upcomingTrips.length > 0 ? (
            <UpcomingTrips
              trips={upcomingTrips}
              onTripPress={(trip: Trip) => {
                navigation.navigate('TripDetails', { tripId: trip._id, isPastTrip: false });
              }}
            />
          ) : (
            <NoData
              title={myTripsStrings.noData}
              subtitle={myTripsStrings.noUpcomingTrips}
            />
          )
        ) : pastTrips.length > 0 ? (
          <PastTrips
            trips={pastTrips}
            onTripPress={(trip: Trip) => {
              navigation.navigate('TripDetails', { tripId: trip._id, isPastTrip: true });
            }}
          />
        ) : (
          <NoData
            title={myTripsStrings.noData}
            subtitle={myTripsStrings.noPastTrips}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};

export default MyTrips;
