import React, { useState } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  useGetCurrentUserProfileQuery,
  useGetTripsQuery,
} from '@/src/services';
import { useAppSelector } from '@/src/hooks';
import { selectCurrentUserId } from '@/src/features';
import { Box } from '@/components/ui/box';
import { Loader } from '@/src/components';
import { myTripsStrings } from '@/src/screens/Main/MyTrips/strings';
import { globalStyles } from '@/src/styles';
import Header from './Header';
import NoData from './NoData';
import UpcomingTrips from './UpcomingTrips';
import PastTrips from './PastTrips';
import TripTabs from './TripTabs';
import { Trip } from '@/src/types/trip';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProps } from '@/src/types/allRoutes';

const MyTrips = () => {
  const navigation = useNavigation<MainNavigationProps>();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetCurrentUserProfileQuery();

  const {
    data: upcomingTripsData,
    isLoading: isUpcomingTripsLoading,
    error: upcomingTripsError,
    refetch: refetchUpcomingTrips,
  } = useGetTripsQuery({ status: 'upcoming' });

  const {
    data: pastTripsData,
    isLoading: isPastTripsLoading,
    error: pastTripsError,
    refetch: refetchPastTrips,
  } = useGetTripsQuery({ status: 'past' });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchUpcomingTrips(), refetchPastTrips()]);
    } catch (error) {
      console.error('Error refreshing trips:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
      <ScrollView
        style={{ paddingHorizontal: 16, paddingTop: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#51B1C0']} // Primary color
            tintColor="#51B1C0"
          />
        }
      >
        {/* Tabs */}
        <TripTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}

        {activeTab === 'upcoming' ? (
          upcomingTrips.length > 0 ? (
            <UpcomingTrips
              trips={upcomingTrips}
              onTripPress={(trip: Trip) => {
                navigation.navigate('TripDetails', {
                  tripId: trip._id,
                  isPastTrip: false,
                });
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
              navigation.navigate('TripDetails', {
                tripId: trip._id,
                isPastTrip: true,
              });
            }}
          />
        ) : (
          <NoData
            title={myTripsStrings.noData}
            subtitle={myTripsStrings.noPastTrips}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyTrips;
