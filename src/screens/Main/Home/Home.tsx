import React from 'react';
import { SafeAreaView, Linking } from 'react-native';
import {
  useGetCurrentUserProfileQuery,
  useGetBannersQuery,
} from '@/src/services';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { Loader, BannerCarousel } from '@/src/components';
import { homeStrings } from './strings';
import Header from './Header';
import NoTrips from './NoTrips';

const Home = () => {
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

  if (isProfileLoading || isBannersLoading) {
    return <Loader />;
  }

  const userName =
    userProfile?.data?.preferredName || userProfile?.data?.firstName || 'User';

  const handleBannerPress = (banner: any) => {
    if (banner.linkUrl) {
      Linking.openURL(banner.linkUrl);
    }
  };

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
          {/* Banner Carousel */}
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

          {/* Coordle Logo */}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
