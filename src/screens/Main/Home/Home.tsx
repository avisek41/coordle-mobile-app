import React from 'react';
import { SafeAreaView } from 'react-native';
import { useGetCurrentUserProfileQuery } from '@/src/services';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Loader } from '@/src/components';
import { homeStrings } from './strings';
import Header from './Header';
import NoTrips from './NoTrips';

const Home = () => {
  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

  const userName =
    userProfile?.data?.preferredName || userProfile?.data?.firstName || 'User';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <Header userName={userName} />

      {/* Main Content */}
      <Box className="flex-1 px-5 pt-6">
        {/* No Trips Card */}
        <NoTrips />

        {/* Media Section */}
        <Box className="mt-10">
          <GluestackText className="text-xl font-heading text-black-800 mb-6">
            {homeStrings.mediaTitle}
          </GluestackText>

          {/* Coordle Logo */}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
