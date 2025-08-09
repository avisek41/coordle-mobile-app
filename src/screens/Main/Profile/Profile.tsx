import React from 'react';
import { SafeAreaView, Image, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { globalStyles } from '@/src/styles';
import { images } from '@/src/assets';
import Header from '@/src/screens/Main/Profile/Header';
import ProfileCard from '@/src/screens/Main/Profile/ProfileCard';
import ProfileSettings from '@/src/screens/Main/Profile/ProfileSettings';
import { useGetCurrentUserProfileQuery } from '@/src/services';
import { useFocusEffect } from '@react-navigation/native';
import { useSimpleToast } from '@/src/hooks/useSimpleToast';

const Profile = () => {
  const { showToast, ToastComponent } = useSimpleToast();

  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useGetCurrentUserProfileQuery();

  // Refetch user data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleUploadSuccess = (profilePhotoUrl: string) => {
    showToast({
      type: 'success',
      message: 'Profile photo updated successfully!',
    });
  };

  const handleUploadError = (error: string) => {
    showToast({
      type: 'error',
      message: error,
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image with Curve */}
        <Box className="relative">
          <Image
            source={images.cover}
            style={{
              width: '100%',
              height: 170,
              resizeMode: 'cover',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          />
          <Box />

          {/* Header Overlay */}
          <Box className="absolute top-0 left-0 right-0">
            <Header />
          </Box>
          <Box className="px-4 pt-2">
            <ProfileCard
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </Box>
        </Box>
        {/* Profile Settings */}
        <Box className=" px-2 pt-8">
          <ProfileSettings />
        </Box>
      </ScrollView>

      {/* Toast Notification */}
      <ToastComponent />
    </SafeAreaView>
  );
};

export default Profile;
