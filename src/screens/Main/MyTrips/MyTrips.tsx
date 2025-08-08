import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { useGetCurrentUserProfileQuery } from '@/src/services';
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

const MyTrips = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

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
        <NoData
          title={myTripsStrings.noData}
          subtitle={
            activeTab === 'upcoming'
              ? myTripsStrings.noUpcomingTrips
              : myTripsStrings.noPastTrips
          }
        />
      </Box>
    </SafeAreaView>
  );
};

export default MyTrips;
