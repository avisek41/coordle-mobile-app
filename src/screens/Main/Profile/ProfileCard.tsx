import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text as GluestackText } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useGetCurrentUserProfileQuery } from '@/src/services';
import { Loader } from '@/src/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParams } from '@/src/types/allRoutes';
import { profileStrings } from './strings';

type ProfileNavigationProp = NativeStackNavigationProp<
  MainStackParams,
  'EditProfile'
>;

const ProfileCard: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  const {
    data: userProfile,
    isLoading,
    error,
  } = useGetCurrentUserProfileQuery();

  if (isLoading) {
    return <Loader />;
  }

  const userData = userProfile?.data;
  const userName = userData?.preferredName || userData?.firstName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Box className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 -mt-20">
      <VStack space="lg">
        {/* Avatar and User Info */}
        <Box className="items-center mb-6 -mt-16">
          <Box className="relative">
            <LinearGradient
              colors={['#2E6F9E', '#51B1C0']}
              style={styles.avatarGradient}
            >
              <GluestackText className="text-4xl font-heading text-white">
                {userInitial}
              </GluestackText>
            </LinearGradient>

            {/* Edit Avatar Button */}
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 justify-center items-center border-2 border-white">
              <MaterialIcons name="mode-edit" size={16} color="white" />
            </TouchableOpacity>
          </Box>

          <VStack className="items-center mt-1" space="sm">
            <GluestackText className="text-2xl font-heading text-gray-800">
              {userName}
            </GluestackText>
            <GluestackText className="text-sm text-gray-500">
              {profileStrings.accountType}
            </GluestackText>
          </VStack>
        </Box>

        {/* Profile Items */}
        <VStack space="lg">
          <ProfileItem
            icon="person-outline"
            label={profileStrings.preferredName}
            value={userData?.preferredName || profileStrings.notSet}
          />
          <ProfileItem
            icon="male-female-outline"
            label={profileStrings.pronouns}
            value={userData?.pronouns || profileStrings.notSet}
          />
          <ProfileItem
            icon="mail-outline"
            label={profileStrings.email}
            value={userData?.email || profileStrings.notSet}
          />
          <ProfileItem
            icon="call-outline"
            label={profileStrings.phoneNumber}
            value={userData?.phoneNumber || profileStrings.notSet}
          />
          <ProfileItem
            icon="home-outline"
            label={profileStrings.address}
            value={
              `${userData?.country || ''} ${userData?.state || ''} ${
                userData?.postalCode || ''
              }`.trim() || profileStrings.notSet
            }
          />
          <ProfileItem
            icon="airplane-outline"
            label={profileStrings.preferredAirport}
            value={userData?.preferredAirport || profileStrings.notSet}
          />
        </VStack>

        {/* View More Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileOtherInfo')}
        >
          <HStack className="justify-center items-center" space="sm">
            <GluestackText className="text-lg font-body text-primary-500">
              {profileStrings.viewMore}
            </GluestackText>
            <Ionicons name="chevron-forward" size={20} color="#51B1C0" />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  avatarGradient: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface ProfileItemProps {
  icon: string;
  label: string;
  value: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value }) => {
  return (
    <HStack className="items-start" space="md">
      <Box className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
        <Ionicons name={icon as any} size={20} color="#9CA3AF" />
      </Box>
      <VStack className="flex-1" space="xs">
        <GluestackText className="text-lg text-gray-500">{label}</GluestackText>
        <GluestackText className="text-md font-body text-gray-800">
          {value}
        </GluestackText>
      </VStack>
    </HStack>
  );
};

export default ProfileCard;
