import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useRoute } from '@react-navigation/native';
import { MainRouteProps } from '@/src/types/allRoutes';
import { useGetMemberProfileQuery } from '@/src/services/memberProfileApi';
import { MEMBER_PROFILE_STRINGS } from './strings';
import { GradientAvatar, Header, Loader } from '@/src/components';

const MemberProfile = () => {
  const route = useRoute<MainRouteProps<'MemberProfile'>>();
  const { userId } = route.params;

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGetMemberProfileQuery(userId);

  const getDisplayName = () => {
    if (profileData?.data?.preferredName) {
      return profileData.data.preferredName;
    }
    if (profileData?.data?.firstName && profileData?.data?.lastName) {
      return `${profileData.data.firstName} ${profileData.data.lastName}`;
    }
    if (profileData?.data?.firstName) {
      return profileData.data.firstName;
    }
    if (profileData?.data?.email) {
      return profileData.data.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName === 'User') return 'U';
    return displayName.charAt(0).toUpperCase();
  };

  const getCountryStatePostal = () => {
    const { country, state, postalCode } = profileData?.data || {};
    const parts = [];

    if (country) parts.push(country);
    if (state) parts.push(state);
    if (postalCode) parts.push(postalCode);

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  const getFoodAllergies = () => {
    const allergies = profileData?.data?.foodAllergies;
    if (!allergies || allergies.length === 0) {
      return MEMBER_PROFILE_STRINGS.NO_ALLERGY;
    }
    return allergies.join(', ');
  };

  const getDietaryRestrictions = () => {
    const restrictions = profileData?.data?.dietaryRestrictions;
    return restrictions || MEMBER_PROFILE_STRINGS.NONE;
  };

  const getDisabilityStatus = () => {
    const status = profileData?.data?.disabilityStatus;
    return status || MEMBER_PROFILE_STRINGS.NO_DISABILITY;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <VStack space="lg" className="flex-1 bg-white">
        {/* Header */}
        <Header title={MEMBER_PROFILE_STRINGS.TITLE} />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <Box className="items-center px-4 py-6">
            <GradientAvatar
              userName={getInitials()}
              userImage={profileData?.data?.profilePhoto?.url || ''}
              size="large"
            />
            <Text className="text-xl font-heading text-gray-900 mt-3">
              {getDisplayName()}
            </Text>
            <Box className="bg-red-500 rounded-full px-3 py-1 mt-2">
              <Text className="text-white font-heading text-sm">
                {profileData?.data.userRole === 'traveller'
                  ? MEMBER_PROFILE_STRINGS.TRAVELLER
                  : profileData?.data.userRole === 'hosts'
                  ? MEMBER_PROFILE_STRINGS.HOST
                  : MEMBER_PROFILE_STRINGS.OWNER}
              </Text>
            </Box>
          </Box>

          {/* Personal Information Section */}
          <Box className="px-4 mb-6">
            <Text className="text-lg font-heading text-gray-900 mb-4">
              {MEMBER_PROFILE_STRINGS.PERSONAL_INFO}
            </Text>
            <Box className="bg-gray-50 rounded-lg p-4">
              <VStack space="md">
                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.FIRST_NAME}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data.firstName || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.LAST_NAME}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data.lastName || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.PREFERRED_NAME}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data.preferredName || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.AGE_DEMOGRAPHIC}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data.ageDemographic || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.GENDER_IDENTITY}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data?.genderIdentity || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.PRONOUNS}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data?.pronouns || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.ADDRESS}
                  </Text>
                  <Text className="text-base font-body text-gray-900 text-right flex-1 ml-2">
                    {getCountryStatePostal()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </Box>

          {/* Contact Information Section */}
          <Box className="px-4 mb-6">
            <Text className="text-lg font-heading text-gray-900 mb-4">
              {MEMBER_PROFILE_STRINGS.CONTACT_INFO}
            </Text>
            <Box className="bg-gray-50 rounded-lg p-4">
              <VStack space="md">
                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.EMAIL}
                  </Text>
                  <HStack className="items-center" space="sm">
                    <Text className="text-base font-body text-gray-900">
                      {profileData?.data?.email}
                    </Text>
                  </HStack>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.PHONE_NUMBER}
                  </Text>
                  <HStack className="items-center" space="sm">
                    <Text className="text-base font-body text-gray-900">
                      {profileData?.data?.phoneNumber}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </Box>

          {/* Preferences Section */}
          <Box className="px-4 mb-6">
            <Text className="text-lg font-heading text-gray-900 mb-4">
              {MEMBER_PROFILE_STRINGS.PREFERENCES}
            </Text>
            <Box className="bg-gray-50 rounded-lg p-4">
              <VStack space="md">
                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.DIETARY_RESTRICTIONS}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {getDietaryRestrictions()}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.FOOD_ALLERGIES}
                  </Text>
                  <Text className="text-base font-body text-gray-900 text-right flex-1 ml-2">
                    {getFoodAllergies()}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.DISABILITY_STATUS}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {getDisabilityStatus()}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.PREFERRED_AIRPORT}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data?.preferredAirport || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.RACIAL_ETHNIC}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data?.racialEthnic || 'Not specified'}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text className="text-sm font-body text-gray-500">
                    {MEMBER_PROFILE_STRINGS.SEXUAL_ORIENTATION}
                  </Text>
                  <Text className="text-base font-body text-gray-900">
                    {profileData?.data?.sexualOrientation || 'Not specified'}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});

export default MemberProfile;
