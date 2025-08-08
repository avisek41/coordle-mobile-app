import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { globalStyles } from '@/src/styles';
import { useGetCurrentUserProfileQuery } from '@/src/services';
import { Loader } from '@/src/components';
import { profileOtherInfoStrings } from './strings';
import ProfileOtherInfoHeader from './Header';
import OtherInfoForm from './OtherInfoForm';

const ProfileOtherInfo = () => {
  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

  const userData = userProfile?.data;

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ProfileOtherInfoHeader />

        {/* Content */}
        <Box className="flex-1 px-5 pt-6">
          <OtherInfoForm userData={userData} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileOtherInfo;
