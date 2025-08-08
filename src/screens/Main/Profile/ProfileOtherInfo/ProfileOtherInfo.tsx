import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { globalStyles } from '@/src/styles';
import {
  useGetCurrentUserProfileQuery,
  useSetupProfileMutation,
} from '@/src/services';
import { Loader } from '@/src/components';
import { profileOtherInfoStrings } from './strings';
import ProfileOtherInfoHeader from './Header';
import OtherInfoForm from './OtherInfoForm';
import { useSimpleToast } from '@/src/hooks';

const ProfileOtherInfo = () => {
  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetCurrentUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useSetupProfileMutation();
  const { showToast, ToastComponent } = useSimpleToast();

  const handleSave = async (formData: any) => {
    try {
      // Prepare the data for the API
      const updateData = {
        // Keep existing user data that we don't want to change
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        preferredName: userData?.preferredName || '',
        phoneNumber: userData?.phoneNumber || '',
        pronouns: userData?.pronouns || '',
        country: userData?.country || '',
        state: userData?.state || '',
        postalCode: userData?.postalCode || '',
        preferredAirport: userData?.preferredAirport || '',
        // Update the fields from the form
        racialEthnic: formData.racialEthnic,
        ageDemographic: formData.ageDemographic,
        foodAllergies: formData.foodAllergies,
        dietaryRestrictions: formData.dietaryRestrictions,
        genderIdentity: formData.genderIdentity,
        sexualOrientation: formData.sexualOrientation
          ? formData.sexualOrientationValue
          : '',
        disabilityStatus: formData.disabilityStatus
          ? formData.disabilityStatusValue
          : '',
      };

      const response = await updateProfile(updateData).unwrap();

      if (response.success) {
        showToast({
          type: 'success',
          message: 'Profile updated successfully',
        });
      } else {
        showToast({
          type: 'error',
          message: 'Failed to update profile',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        type: 'error',
        message: 'Failed to update profile',
      });
    }
  };

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
          <OtherInfoForm
            userData={userData}
            onSave={handleSave}
            isLoading={isUpdating}
          />
        </Box>
      </ScrollView>
      <ToastComponent />
    </SafeAreaView>
  );
};

export default ProfileOtherInfo;
