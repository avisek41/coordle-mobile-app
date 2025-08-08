import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Header } from '@/src/components';
import { Text } from '@/components/ui/text';
import { profileOtherInfoStrings } from '@/src/screens/Main/Profile/ProfileOtherInfo/strings';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParams } from '@/src/types/allRoutes';

type ProfileNavigationProp = NativeStackNavigationProp<
  MainStackParams,
  'EditProfile'
>;

const ProfileOtherInfoHeader: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  return (
    <Header 
      title={profileOtherInfoStrings.title} 
      showBackButton={true}
      rightComponent={
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          className="px-3 py-1"
        >
          <Text className="text-sm font-body text-primary-500">
            View More
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default ProfileOtherInfoHeader;
